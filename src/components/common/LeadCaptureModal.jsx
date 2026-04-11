import { useEffect, useRef, useState } from 'react'
import { X, ChevronDown } from 'lucide-react'
import { submitLead } from '../../services/leads'

const initialForm = {
  firstName: '',
  email: '',
  phone: '',
  countryCode: '+91',
}

const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

function readUtmValues() {
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

function LeadCaptureModal({ isOpen, onOpenChange }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(initialForm)
  const [utmData, setUtmData] = useState({})
  const isOpenRef = useRef(false)
  const isSubmittedRef = useRef(false)

  useEffect(() => {
    setUtmData(readUtmValues())

    const timers = [10000, 20000, 30000].map((delay) =>
      window.setTimeout(() => {
        if (!isOpenRef.current && !isSubmittedRef.current) {
          onOpenChange(true)
        }
      }, delay),
    )

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  useEffect(() => {
    isOpenRef.current = isOpen
  }, [isOpen])

  useEffect(() => {
    isSubmittedRef.current = isSubmitted
  }, [isSubmitted])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onOpenChange(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setIsSubmitting(true)
    setError('')

    try {
      await submitLead(formData, utmData)
      setIsSubmitted(true)
      setFormData(initialForm)
    } catch (submissionError) {
      setError(submissionError.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/60 px-4 py-6 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative w-full max-w-[530px] rounded-[28px] bg-[#d6b8ff] px-5 pb-10 pt-7 text-center text-black shadow-[0_30px_80px_rgba(35,12,68,0.35)] sm:px-10"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close popup"
          className="absolute right-5 top-5 cursor-pointer text-black/65 transition hover:text-black"
          onClick={() => onOpenChange(false)}
        >
          <X size={30} strokeWidth={2.2} />
        </button>

        <div className="mx-auto max-w-[400px]">
          <h2 className="mt-8 text-2xl lg:text-5xl font-black text-brand-dark leading-tight tracking-[-0.03em] sm:text-[3rem]">
            Get a 10% off on all our products!
          </h2>
          <p className="mt-4 text-lg leading-7 text-black/80">
            You will get a code after entering your details
          </p>

          {isSubmitted ? (
            <div className="mt-10 rounded-[22px] bg-white px-6 py-10 text-left shadow-[0_14px_40px_rgba(0,0,0,0.08)]">
              <p className="text-2xl font-bold">Thank you!</p>
              <p className="mt-3 text-base leading-7 text-black/75">
                Your details have been submitted successfully. We will share your code soon.
              </p>
              <button
                type="button"
                className="mt-6 w-full rounded-2xl bg-black px-6 py-4 text-lg font-semibold text-white transition hover:bg-black/90"
                onClick={() => onOpenChange(false)}
              >
                Close
              </button>
            </div>
          ) : (
            <form className="mt-10 space-y-4 text-left" onSubmit={handleSubmit}>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="h-16 w-full rounded-2xl border-2 border-[#6e9eb0] bg-white px-5 text-xl outline-none transition placeholder:text-black/35 focus:border-[#417f96]"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-16 w-full rounded-2xl border border-black/8 bg-white px-5 text-xl outline-none transition placeholder:text-black/35 focus:border-[#417f96]"
              />

              <div className="grid grid-cols-[116px_1fr] gap-3">
                <div className="relative">
                  <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 rounded-md bg-[#f3f4f6] px-2 py-1 text-xs font-bold tracking-[0.2em] text-black/80">
                    IN
                  </span>
                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-black/60"
                  />
                  <input
                    type="text"
                    value="India"
                    readOnly
                    aria-label="Country"
                    className="h-16 w-full rounded-2xl border border-black/8 bg-white pl-[64px] pr-10 text-base font-medium text-transparent caret-transparent outline-none"
                  />
                </div>

                <div className="relative">
                  <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[1.35rem] font-medium text-black/75">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    required
                    className="h-16 w-full rounded-2xl border border-black/8 bg-white pl-[4.5rem] pr-5 text-xl outline-none transition placeholder:text-black/35 focus:border-[#417f96]"
                  />
                </div>
              </div>

              {error ? (
                <p className="text-sm font-medium text-red-700">{error}</p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-16 w-full rounded-2xl bg-black px-6 text-[1.85rem] font-semibold text-white transition hover:bg-black/92 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Submitting...' : 'Start learning with us!'}
              </button>

              <p className="px-4 text-center text-[15px] leading-7 text-black/75">
                By signing up, you agree to receive whatsapp messages whenever we release a new product!
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default LeadCaptureModal
