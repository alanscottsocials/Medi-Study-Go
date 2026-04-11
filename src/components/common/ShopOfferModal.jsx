import { useEffect } from 'react'
import { X } from 'lucide-react'

function ShopOfferModal({ isOpen, onOpenChange, onClaimOffer }) {
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

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/55 px-4 py-6 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative w-full max-w-[360px] overflow-hidden rounded-[18px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
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
          <span className="text-lg md:text-xl font-bold tracking-tight text-brand-dark">
            Medi Study Go
          </span>
        </div>

        <div className="px-6 pb-7 pt-8 text-center">
          <h2 className="text-4xl font-black uppercase tracking-tight text-brand-dark">
            Get 20% Off
          </h2>
          <p className="mt-3 text-lg text-brand-dark/55">
            Your first order
          </p>

          <button
            type="button"
            onClick={onClaimOffer}
            className="mt-8 w-full rounded-sm bg-brand-dark px-6 py-3 text-lg font-black uppercase tracking-wide text-white transition hover:bg-brand-dark/90"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShopOfferModal
