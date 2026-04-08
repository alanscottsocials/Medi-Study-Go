import React from 'react';

const MindmapFeature = () => {
  return (
    <section className="w-full bg-[#c3b6e8] py-[40px] md:py-[60px] overflow-hidden">
      <div className="w-full px-[4%] md:px-[6%] mx-auto max-w-[1400px]">
        
        {/* Header Block */}
        <div className="flex items-center gap-4 mb-10 md:mb-16 pl-2 border-l-8 border-brand-dark">
          <h2 className="text-4xl md:text-6xl lg:text-[70px] font-black leading-tight tracking-tight uppercase">
            <span className="text-brand-dark">Faster Recall </span>
            <span className="text-white">Under<br/>Pressure</span>
          </h2>
        </div>

        {/* Interactive Image Display */}
        <div className="relative w-full max-w-5xl mx-auto mt-10 md:mt-20">
          
          {/* Main Image */}
          <div className="relative z-10 w-full  overflow-hidden hover:scale-[1.01] transition-transform duration-500">
            <img 
              src="/mindmap.png" 
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
