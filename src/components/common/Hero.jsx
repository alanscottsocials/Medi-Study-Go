import React from 'react';

const Hero = ({ onDiscountClick, onShopNowClick }) => {
  return (
    <section className="w-full bg-brand-light py-[40px] md:py-[60px] overflow-hidden">
      <div className="w-full px-[4%] md:px-[6%] mx-auto  grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-12 items-center">
        {/* Left: Image */}
        <div className="relative animate-fade-in-up order-2 lg:order-1">
          {/* Decorative elements could go here */}
          <div className="relative z-10 animate-float">
            <img
              src="/girl.png"
              alt="Student with books"
              className="w-full max-w-lg mx-auto transform hover:scale-105 transition-transform duration-500"
            />
          </div>
          {/* Background blob for depth */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-primary/10 rounded-full blur-3xl -z-10"></div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col  animate-fade-in-up [animation-delay:200ms] order-1 lg:order-2">
          <img src="/logo.webp" alt="Logo" className="h-18 md:h-20 w-auto object-contain self-center " />
          <h1 className="text-2xl lg:text-5xl font-black text-brand-dark leading-tight text-center mb-4">
            Final year BDS is tough. <br />
            <span className="text-brand-primary">Your exams don't have to be</span>
          </h1>

          <div className="bg-brand-primary rounded-[2rem] p-[3%] shadow-2xl shadow-brand-primary/20 relative overflow-hidden group flex flex-col items-center max-w-3xl w-full mx-auto">
            <div className="absolute inset-0 bg-brand-primary/90 z-0"></div>
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
              <img
                src="/logo.webp"
                alt=""
                aria-hidden="true"
                className="w-[55%] max-w-[320px] object-contain opacity-10"
              />
            </div>

            {/* Discount Badge */}
            <button
              type="button"
              onClick={onDiscountClick}
              className="relative z-10 inline-block cursor-pointer bg-white px-12 py-2 shadow-md mb-6 transform group-hover:scale-110 transition-transform duration-300"
              style={{ clipPath: 'polygon(0% 0%, 4% 50%, 0% 100%, 100% 100%, 96% 50%, 100% 0%)' }}
            >
              <span className="text-lg lg:text-2xl font-black text-brand-dark italic">
                Get 20% OFF
              </span>
            </button>

            <h2 className="relative z-10 text-lg lg:text-xl font-bold text-brand-dark mb-3 self-start">
              On all mindmap book bundles!
            </h2>

            <ul className="relative z-10 space-y-4 mb-4 self-start lg:pl-4">
              {[
                "10 Books",
                "2000 Mindmaps",
                "Free access to 500+ flashcards 300+ videos on our App",
                "3x Better retention",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-brand-dark/90 font-semibold group/item max-w-md">
                  <span className="mt-1 bg-brand-dark text-white rounded-full p-0.5 group-hover/item:bg-white group-hover/item:text-brand-dark transition-colors shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="text-sm lg:text-lg font-bold">{item}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={onDiscountClick}
              className="relative z-10 bg-brand-dark text-white px-10 py-2 rounded-xl text-lg lg:text-xl font-black tracking-widest uppercase hover:bg-brand-dark/90 hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-brand-dark/30"
            >
              SHOP NOW
            </button>

            {/* Subtle background decoration for the card */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl z-0"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-dark/10 rounded-full -ml-16 -mb-16 blur-2xl z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
