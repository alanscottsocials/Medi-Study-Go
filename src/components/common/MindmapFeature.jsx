import React from 'react';

const MindmapFeature = () => {
  return (
    <section className="w-full bg-brand-light py-[40px] md:py-[60px] overflow-hidden">
      <div className="w-full px-[4%] md:px-[6%] mx-auto ">

        {/* Header Block */}
        <div className="mb-10 md:mb-16 flex flex-col items-center justify-center">
          <div className="flex items-center gap-3">
            <img src="/solologo.webp" alt="Medi Study Go Logo" className="h-12 md:h-16 w-auto object-contain" />
            <span className="text-2xl md:text-4xl font-black text-brand-dark tracking-tight">Medi Study Go</span>
          </div>
          <div className="flex text-center mt-2">
            <h2 className="text-3xl lg:text-5xl font-black text-brand-dark tracking-tight uppercase">
              MIND MAPS
            </h2>
          </div>
        </div>

        {/* Interactive Image Display */}
        <div className="relative w-full max-w-5xl mx-auto mt-10 md:mt-20">

          {/* Main Image */}
          <div className="relative z-10 w-full  overflow-hidden hover:scale-[1.01] transition-transform duration-500">
            <img
              src="/mindmap.webp"
              alt="Interactive mindmap example"
              className="w-full h-auto object-contain bg-transparent"
            />
          </div>

        </div>

      </div>
    </section>
  );
};

export default MindmapFeature;
