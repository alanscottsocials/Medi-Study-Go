import { useState } from 'react';
import Header from './components/layout/Header';
import Hero from './components/common/Hero';
import Reviews from './components/common/Reviews';
import Comparison from './components/common/Comparison';
import MindmapFeature from './components/common/MindmapFeature';
import Recall from './components/common/Recall';
import ScrollCards from './components/common/ScrollCards';
import ScrollVideos from './components/common/ScrollVideos';
import LeadCaptureModal from './components/common/LeadCaptureModal';
import Footer from './components/layout/Footer';

function App() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-light font-sans">
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onOpenChange={setIsLeadModalOpen}
      />
      <Header />
      <main>
        <Hero onShopNowClick={() => setIsLeadModalOpen(true)} />
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
