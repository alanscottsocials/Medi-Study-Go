import Header from './components/layout/Header';
import Hero from './components/common/Hero';
import Reviews from './components/common/Reviews';

function App() {
  return (
    <div className="min-h-screen bg-brand-light font-sans">
      <Header />
      <main>
        <Hero />
        <Reviews />
      </main>
    </div>
  );
}

export default App
