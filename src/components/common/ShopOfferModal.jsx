import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { createPaymentOrder, getStoredBuyerDetails, verifyPayment } from '../../services/submissions'

function loadRazorpayCheckout() {
  if (window.Razorpay) {
    return Promise.resolve(true)
  }

  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function ShopOfferModal({ isOpen, onOpenChange, onClaimOffer }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

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
  }, [isOpen, onOpenChange])

  useEffect(() => {
    if (!isOpen) {
      setError('')
      setIsSubmitting(false)
    }
  }, [isOpen])

  const handlePayNow = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      const scriptLoaded = await loadRazorpayCheckout()

      if (!scriptLoaded) {
        throw new Error('Unable to load Razorpay checkout. Please try again.')
      }

      const buyerDetails = getStoredBuyerDetails()
      const orderData = await createPaymentOrder(buyerDetails)

      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Medi Study Go',
        description: orderData.offerName,
        order_id: orderData.orderId,
        prefill: {
          name: buyerDetails.firstName,
          email: buyerDetails.email,
          contact: buyerDetails.phone,
        },
        notes: {
          offer_name: orderData.offerName,
          offer_price: orderData.offerPrice,
        },
        theme: {
          color: '#2f1f65',
        },
        handler: async (response) => {
          try {
            await verifyPayment(response, buyerDetails)
            onClaimOffer?.()
            onOpenChange(false)
          } catch (verificationError) {
            setError(verificationError.message || 'Payment completed, but verification failed.')
          } finally {
            setIsSubmitting(false)
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false)
          },
        },
      })

      razorpay.open()
    } catch (submissionError) {
      setError(submissionError.message || 'Unable to start payment. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/55 px-4 py-6 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative w-full max-w-[420px] overflow-hidden rounded-[22px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close popup"
          className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1 text-brand-dark transition hover:bg-white"
          onClick={() => onOpenChange(false)}
        >
          <X size={18} strokeWidth={2.25} />
        </button>

        <div className="flex items-center justify-center gap-2 bg-[#b58af6] px-6 py-4">
          <img
            src="/solologo.webp"
            alt="MediStudygo"
            className="h-8 w-auto object-contain"
          />
          <span className="text-lg font-bold tracking-tight text-brand-dark md:text-xl">
            Medi Study Go
          </span>
        </div>

        <div className="px-6 pb-7 pt-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-dark/55">
            Limited Time Offer
          </p>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-brand-dark">
            Final Year BDS
          </h2>
          <p className="mt-4 text-base text-brand-dark/65">
            Grab the full package at the special offer price today.
          </p>

          <div className="mt-6 rounded-2xl bg-[#f4ecff] px-4 py-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-dark/50">
              Offer Price
            </p>
            <div className="mt-3 flex items-end justify-center gap-3">
              <span className="text-xl font-bold text-brand-dark/40 line-through">
                Rs13000
              </span>
              <span className="text-4xl font-black text-brand-dark">Rs9,999</span>
            </div>
          </div>

          {error ? <p className="mt-4 text-sm font-medium text-red-700">{error}</p> : null}

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handlePayNow}
            className="mt-8 w-full rounded-xl bg-brand-dark px-6 py-3 text-lg font-black uppercase tracking-wide text-white transition hover:bg-brand-dark/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Opening Payment...' : 'Pay Rs9,999'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShopOfferModal
