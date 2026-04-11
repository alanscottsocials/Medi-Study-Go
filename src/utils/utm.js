const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

export function readUtmValues() {
  const stored = {}
  const searchParams = new URLSearchParams(window.location.search)

  utmKeys.forEach((key) => {
    const urlValue = searchParams.get(key)

    if (urlValue) {
      localStorage.setItem(key, urlValue)
      stored[key] = urlValue
      return
    }

    stored[key] = localStorage.getItem(key) || ''
  })

  return stored
}
