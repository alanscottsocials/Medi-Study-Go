import { readUtmValues } from '../utils/utm'

const googleLink = import.meta.env.GOOGLE_LINK
const razorpayPaymentLink = import.meta.env.VITE_RAZORPAY_PAYMENT_LINK

const OFFER_NAME = 'Final Year BDS Offer'
const ORIGINAL_PRICE = '13000'
const OFFER_PRICE = '9999'
const buyerDetailsStorageKey = 'medistudygo_buyer_details'
const paymentSuccessHandledKey = 'medistudygo_payment_success_handled'

function getTimestamp() {
  return new Date().toISOString()
}

function normalizeBuyerDetails(formData = {}) {
  return {
    firstName: (formData.firstName || '').trim(),
    email: (formData.email || '').trim(),
    phone: (formData.phone || '').trim(),
    countryCode: formData.countryCode || '+91',
  }
}

function buildOfferPayload(overrides = {}) {
  return {
    offerName: OFFER_NAME,
    originalPrice: ORIGINAL_PRICE,
    offerPrice: OFFER_PRICE,
    currency: 'INR',
    source: 'shop-offer-modal',
    ...overrides,
  }
}

async function postSubmission(payload) {
  if (!googleLink) {
    throw new Error('Missing GOOGLE_LINK in environment variables.')
  }

  await fetch(googleLink, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: new URLSearchParams(payload).toString(),
  })
}

function persistBuyerDetails(formData) {
  localStorage.setItem(buyerDetailsStorageKey, JSON.stringify(normalizeBuyerDetails(formData)))
}

function getStoredBuyerDetails() {
  try {
    const storedValue = localStorage.getItem(buyerDetailsStorageKey)

    if (!storedValue) {
      return normalizeBuyerDetails()
    }

    return normalizeBuyerDetails(JSON.parse(storedValue))
  } catch {
    return normalizeBuyerDetails()
  }
}

function getPaymentSuccessPayloadFromUrl() {
  const searchParams = new URLSearchParams(window.location.search)
  const paymentId =
    searchParams.get('razorpay_payment_id') ||
    searchParams.get('payment_id') ||
    searchParams.get('razorpayPaymentId') ||
    ''
  const paymentStatus =
    searchParams.get('payment_status') ||
    searchParams.get('status') ||
    searchParams.get('payment_link_status') ||
    searchParams.get('razorpay_payment_link_status') ||
    ''
  const paidAt = searchParams.get('paid_at') || searchParams.get('payment_time') || ''

  const hasSuccessSignal =
    Boolean(paymentId) ||
    ['captured', 'paid', 'success'].includes(paymentStatus.toLowerCase())

  if (!hasSuccessSignal) {
    return null
  }

  return {
    paymentId,
    paymentStatus: paymentStatus || 'paid',
    paidAt: paidAt || getTimestamp(),
  }
}

export async function submitLead(formData, utmData = readUtmValues()) {
  const buyerDetails = normalizeBuyerDetails(formData)
  persistBuyerDetails(buyerDetails)

  await postSubmission({
    ...buyerDetails,
    source: 'website-popup',
    submittedAt: getTimestamp(),
    utmSource: utmData.utm_source || '',
    utmMedium: utmData.utm_medium || '',
    utmCampaign: utmData.utm_campaign || '',
    utmTerm: utmData.utm_term || '',
    utmContent: utmData.utm_content || '',
  })
}

export async function submitPurchaseIntent(formData = {}) {
  if (!razorpayPaymentLink) {
    throw new Error('Missing VITE_RAZORPAY_PAYMENT_LINK in environment variables.')
  }

  const utmData = readUtmValues()
  const incomingBuyerDetails = normalizeBuyerDetails(formData)
  const buyerDetails =
    incomingBuyerDetails.firstName || incomingBuyerDetails.email || incomingBuyerDetails.phone
      ? incomingBuyerDetails
      : getStoredBuyerDetails()

  persistBuyerDetails(buyerDetails)

  await postSubmission({
    sheetType: 'buy',
    eventType: 'intent',
    timestamp: getTimestamp(),
    ...buyerDetails,
    ...buildOfferPayload({
      paymentLink: razorpayPaymentLink,
      submittedAt: getTimestamp(),
    }),
    utmSource: utmData.utm_source || '',
    utmMedium: utmData.utm_medium || '',
    utmCampaign: utmData.utm_campaign || '',
    utmTerm: utmData.utm_term || '',
    utmContent: utmData.utm_content || '',
  })

  const url = new URL(razorpayPaymentLink)

  if (buyerDetails.firstName) {
    url.searchParams.set('prefill[name]', buyerDetails.firstName)
  }

  if (buyerDetails.email) {
    url.searchParams.set('prefill[email]', buyerDetails.email)
  }

  if (buyerDetails.phone) {
    url.searchParams.set('prefill[contact]', buyerDetails.phone)
  }

  url.searchParams.set('notes[source]', 'shop-offer-modal')
  url.searchParams.set('notes[offer_name]', OFFER_NAME)
  url.searchParams.set('notes[offer_price]', OFFER_PRICE)

  return url.toString()
}

export async function submitPaymentSuccessFromUrl() {
  const paymentSuccess = getPaymentSuccessPayloadFromUrl()

  if (!paymentSuccess) {
    return false
  }

  if (localStorage.getItem(paymentSuccessHandledKey) === paymentSuccess.paymentId) {
    return false
  }

  const utmData = readUtmValues()
  const buyerDetails = getStoredBuyerDetails()

  await postSubmission({
    sheetType: 'buy',
    eventType: 'success',
    timestamp: getTimestamp(),
    ...buyerDetails,
    ...buildOfferPayload({
      paymentLink: razorpayPaymentLink || '',
      submittedAt: getTimestamp(),
      paymentId: paymentSuccess.paymentId,
      paymentStatus: paymentSuccess.paymentStatus,
      paidAt: paymentSuccess.paidAt,
    }),
    utmSource: utmData.utm_source || '',
    utmMedium: utmData.utm_medium || '',
    utmCampaign: utmData.utm_campaign || '',
    utmTerm: utmData.utm_term || '',
    utmContent: utmData.utm_content || '',
  })

  localStorage.setItem(paymentSuccessHandledKey, paymentSuccess.paymentId)
  return true
}
