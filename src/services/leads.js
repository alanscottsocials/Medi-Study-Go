const googleLink = import.meta.env.GOOGLE_LINK

export async function submitLead(formData, utmData = {}) {
  if (!googleLink) {
    throw new Error('Missing GOOGLE_LINK in environment variables.')
  }

  const payload = new URLSearchParams({
    firstName: formData.firstName.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    countryCode: formData.countryCode,
    source: 'website-popup',
    submittedAt: new Date().toISOString(),
    utmSource: utmData.utm_source || '',
    utmMedium: utmData.utm_medium || '',
    utmCampaign: utmData.utm_campaign || '',
    utmTerm: utmData.utm_term || '',
    utmContent: utmData.utm_content || '',
  })

  await fetch(googleLink, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: payload.toString(),
  })
}
