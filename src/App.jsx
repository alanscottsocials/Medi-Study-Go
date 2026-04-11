import { useEffect, useState } from 'react';
import Header from './components/layout/Header';
import Hero from './components/common/Hero';
import Reviews from './components/common/Reviews';
import Comparison from './components/common/Comparison';
import MindmapFeature from './components/common/MindmapFeature';
import Recall from './components/common/Recall';
import ScrollCards from './components/common/ScrollCards';
import ScrollVideos from './components/common/ScrollVideos';
import LeadCaptureModal from './components/common/LeadCaptureModal';
import ShopOfferModal from './components/common/ShopOfferModal';
import Footer from './components/layout/Footer';
import { submitPaymentSuccessFromUrl } from './services/submissions';

function App() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isShopOfferModalOpen, setIsShopOfferModalOpen] = useState(false);

  useEffect(() => {
    submitPaymentSuccessFromUrl().catch(() => {})
  }, []);

  return (
    <div className="min-h-screen bg-brand-light font-sans">
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onOpenChange={setIsLeadModalOpen}
        onSuccess={() => setIsShopOfferModalOpen(true)}
      />
      <ShopOfferModal
        isOpen={isShopOfferModalOpen}
        onOpenChange={setIsShopOfferModalOpen}
        onClaimOffer={() => {
          setIsShopOfferModalOpen(false);
        }}
      />
      <Header />
      <main>
        <Hero
          onDiscountClick={() => setIsLeadModalOpen(true)}
          onShopNowClick={() => setIsShopOfferModalOpen(true)}
        />
        <Reviews />
        <Comparison />
        <MindmapFeature />
        <Recall/>
        <ScrollCards />
        <ScrollVideos />
      </main>
      <Footer />
    </div>
  );
}

export default App
