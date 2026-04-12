import { readUtmValues } from '../utils/utm'

const googleLink = import.meta.env.GOOGLE_LINK
const paymentServerUrl =
  (import.meta.env.VITE_PAYMENT_SERVER_URL || 'http://localhost:4000').replace(/\/$/, '')

const OFFER_NAME = 'Final Year BDS Offer'
const ORIGINAL_PRICE = '13000'
const OFFER_PRICE = '9999'
const buyerDetailsStorageKey = 'medistudygo_buyer_details'

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

function getOfferPayload(overrides = {}) {
  return {
    offerName: OFFER_NAME,
    originalPrice: ORIGINAL_PRICE,
    offerPrice: OFFER_PRICE,
    currency: 'INR',
    source: 'shop-offer-modal',
    ...overrides,
  }
}

async function postLeadSubmission(payload) {
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

async function postPaymentRequest(path, payload) {
  const response = await fetch(`${paymentServerUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || 'Unable to connect to payment server.')
  }

  return data
}

export function persistBuyerDetails(formData) {
  localStorage.setItem(buyerDetailsStorageKey, JSON.stringify(normalizeBuyerDetails(formData)))
}

export function getStoredBuyerDetails() {
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

export async function submitLead(formData, utmData = readUtmValues()) {
  const buyerDetails = normalizeBuyerDetails(formData)
  persistBuyerDetails(buyerDetails)

  await postLeadSubmission({
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

export async function createPaymentOrder(formData = {}) {
  const incomingBuyerDetails = normalizeBuyerDetails(formData)
  const buyerDetails =
    incomingBuyerDetails.firstName || incomingBuyerDetails.email || incomingBuyerDetails.phone
      ? incomingBuyerDetails
      : getStoredBuyerDetails()

  persistBuyerDetails(buyerDetails)

  const utmData = readUtmValues()

  return postPaymentRequest('/api/payments/order', {
    buyerDetails,
    offer: getOfferPayload(),
    utmData,
  })
}

export async function verifyPayment(paymentResponse, formData = {}) {
  const incomingBuyerDetails = normalizeBuyerDetails(formData)
  const buyerDetails =
    incomingBuyerDetails.firstName || incomingBuyerDetails.email || incomingBuyerDetails.phone
      ? incomingBuyerDetails
      : getStoredBuyerDetails()

  return postPaymentRequest('/api/payments/verify', {
    buyerDetails,
    offer: getOfferPayload(),
    payment: paymentResponse,
  })
}
