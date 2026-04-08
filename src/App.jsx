import Header from './components/layout/Header';
import Hero from './components/common/Hero';
import Reviews from './components/common/Reviews';
import Comparison from './components/common/Comparison';
import MindmapFeature from './components/common/MindmapFeature';

function App() {
  return (
    <div className="min-h-screen bg-brand-light font-sans">
      <Header />
      <main>
        <Hero />
        <Reviews />
        <Comparison />
        <MindmapFeature />
      </main>
    </div>
  );
}

export default App
