import React from 'react';
import { Star } from 'lucide-react';

const Reviews = () => {
  // Assuming review1.webp to review8.webp exist in the public folder
  const reviewImages = Array.from({ length: 8 }, (_, i) => `/review${i + 1}.webp`);

  return (
    <section className="w-full bg-brand-primary/5 py-[40px] md:py-[60px] overflow-hidden">
      <div className="w-full px-[4%] md:px-[6%] mx-auto  flex flex-col items-center text-center">

        {/* Headings */}
        <h2 className="text-3xl lg:text-5xl font-black text-brand-dark leading-tight mb-4">
          Loved by <span className="text-[#facc15] drop-shadow-sm">50000+</span> BDS students <br className="hidden md:block" />
          across India
        </h2>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-8 h-8 md:w-10 md:h-10 text-[#facc15]" fill="currentColor" />
          ))}
        </div>

        {/* Subheading */}
        <p className="text-xl md:text-2xl font-bold text-brand-dark mb-5 leading-snug">
          Real students. Real results. <br />
          They said it better than we could.
        </p>

        {/* Image Grid using Columns (Masonry effect) */}
        <div className="w-full columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {reviewImages.map((src, index) => (
            <div
              key={index}
              className="break-inside-avoid rounded-[2rem] overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative group bg-brand-light"
            >
              <img
                src={src}
                alt={`Student Review ${index + 1}`}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/10 transition-colors duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Reviews;
