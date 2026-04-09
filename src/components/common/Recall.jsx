import React from 'react';

const Recall = () => {
  return (
    <section className="w-full bg-brand-light py-[40px] md:py-[60px] overflow-hidden">
      <div className="w-full px-[4%] md:px-[6%] mx-auto ">

        {/* Header Block */}
        <div className="flex items-center gap-4 mb-10 md:mb-16 pl-4 border-l-[8px] border-brand-primary">
          <h2 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight text-brand-dark">
            Faster Recall <span className="text-brand-primary">Under Pressure</span>
          </h2>
        </div>

        {/* Interactive Image Display */}
        <div className="relative w-full max-w-5xl mx-auto mt-10 md:mt-20">

          {/* Main Image */}
          <div className="relative z-10 w-full  overflow-hidden hover:scale-[1.01] transition-transform duration-500">
            <img
              src="/recall.webp"
              alt="Interactive mindmap example"
              className="w-full h-auto object-contain bg-transparent"
            />
          </div>

        </div>

      </div>
    </section>
  );
};

export default Recall;
