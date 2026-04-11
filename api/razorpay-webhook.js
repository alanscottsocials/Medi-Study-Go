import crypto from 'node:crypto'

const googleLink = process.env.GOOGLE_LINK
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

function getIsoTimestamp(unixTimestamp) {
  if (!unixTimestamp) {
    return new Date().toISOString()
  }

  return new Date(unixTimestamp * 1000).toISOString()
}

function splitPhoneNumber(contact = '') {
  const normalized = String(contact || '').trim()

  if (!normalized) {
    return {
      countryCode: '+91',
      phone: '',
    }
  }

  if (!normalized.startsWith('+')) {
    return {
      countryCode: '+91',
      phone: normalized,
    }
  }

  const digits = normalized.replace(/[^\d]/g, '')

  if (digits.length <= 10) {
    return {
      countryCode: '+91',
      phone: digits,
    }
  }

  return {
    countryCode: `+${digits.slice(0, digits.length - 10)}`,
    phone: digits.slice(-10),
  }
}

function buildWebhookPayload(eventBody) {
  const paymentLink = eventBody?.payload?.payment_link?.entity || {}
  const payment = eventBody?.payload?.payment?.entity || {}
  const order = eventBody?.payload?.order?.entity || {}
  const customer = paymentLink.customer || {}
  const { countryCode, phone } = splitPhoneNumber(payment.contact || customer.contact || '')
  const amountValue = payment.amount || paymentLink.amount_paid || paymentLink.amount || 0

  return {
    sheetType: 'buy',
    eventType: 'success',
    timestamp: getIsoTimestamp(eventBody.created_at),
    firstName: customer.name || order.payer_name || '',
    email: payment.email || customer.email || '',
    countryCode,
    phone,
    offerName: paymentLink.description || 'Final Year BDS Offer',
    originalPrice: '13000',
    offerPrice: '9999',
    currency: payment.currency || paymentLink.currency || 'INR',
    source: 'razorpay-webhook',
    paymentLink: paymentLink.short_url || '',
    submittedAt: getIsoTimestamp(paymentLink.created_at || eventBody.created_at),
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: '',
    paymentId: payment.id || '',
    paymentStatus: payment.status || paymentLink.status || eventBody.event || 'paid',
    paidAt: getIsoTimestamp(payment.created_at || paymentLink.updated_at || eventBody.created_at),
    amountPaid: amountValue ? String(amountValue / 100) : '',
  }
}

async function readRawBody(req) {
  const chunks = []

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  return Buffer.concat(chunks).toString('utf8')
}

function verifySignature(rawBody, signature) {
  if (!webhookSecret) {
    throw new Error('Missing RAZORPAY_WEBHOOK_SECRET environment variable.')
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex')

  const provided = Buffer.from(signature || '', 'utf8')
  const expected = Buffer.from(expectedSignature, 'utf8')

  return provided.length === expected.length && crypto.timingSafeEqual(provided, expected)
}

async function forwardToGoogleSheet(payload) {
  if (!googleLink) {
    throw new Error('Missing GOOGLE_LINK environment variable.')
  }

  await fetch(googleLink, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: new URLSearchParams(payload).toString(),
  })
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({
      ok: true,
      message: 'Razorpay webhook endpoint is live.',
    })
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' })
    return
  }

  try {
    const rawBody = await readRawBody(req)
    const signature = req.headers['x-razorpay-signature']

    if (!verifySignature(rawBody, signature)) {
      res.status(401).json({ error: 'Invalid webhook signature.' })
      return
    }

    const eventBody = JSON.parse(rawBody)

    if (eventBody.event !== 'payment_link.paid') {
      res.status(200).json({
        ok: true,
        skipped: true,
        event: eventBody.event,
      })
      return
    }

    await forwardToGoogleSheet(buildWebhookPayload(eventBody))

    res.status(200).json({
      ok: true,
      event: eventBody.event,
    })
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Webhook processing failed.',
    })
  }
}
