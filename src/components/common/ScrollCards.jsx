import React, { useState } from 'react';
import { X } from 'lucide-react';

const ScrollCards = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Generate an array of 10 image paths
  const images = Array.from({ length: 9 }, (_, i) => `/scroll${i + 1}.webp`);

  // Duplicate array once to allow a seamless CSS marquee
  const marqueeImages = [...images, ...images];

  return (
    <section className="w-full bg-[#c3b6e8] py-[40px] md:py-[60px] overflow-hidden">

      {/* Title */}
      <div className="w-full px-[4%] md:px-[6%] mx-auto  mb-8 md:mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-brand-dark tracking-tight uppercase">
          Explore Our Books
        </h2>
      </div>

      {/* Marquee Track Container */}
      <div className="w-full overflow-hidden relative flex items-center">

        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-4 md:gap-8 px-4">
          {marqueeImages.map((src, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[200px] md:w-[300px] rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:scale-[1.03] hover:shadow-2xl hover:z-10 bg-brand-dark"
              onClick={() => setSelectedImage(src)}
            >
              <img
                src={src}
                alt={`Book Cover ${index + 1}`}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/90 backdrop-blur-sm p-4 animate-fade-in-up"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex justify-center">
            {/* Close Button */}
            <button
              className="absolute -top-12 right-0 md:-right-12 md:top-0 bg-white text-brand-dark rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <img
              src={selectedImage}
              alt="Enlarged Book Cover"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

    </section>
  );
};

export default ScrollCards;
