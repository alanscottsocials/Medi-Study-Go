import React, { useState } from 'react';
import { X } from 'lucide-react';

const ScrollVideos = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);


  // Duplicate array once to allow a seamless CSS marquee
  const marqueeVideos = [...videos, ...videos];

  return (
    <section className="w-full bg-brand-primary/5 py-[40px] md:py-[60px] overflow-hidden">

      {/* Title */}
      <div className="w-full px-[4%] md:px-[6%] mx-auto  flex justify-center mb-8 md:mb-12">
        <h2 className="text-3xl lg:text-5xl font-black text-brand-dark tracking-tight uppercase text-center">
          THEIR JOURNEY, THEIR WORDS
        </h2>
      </div>

      {/* Marquee Track Container */}
      <div className="w-full overflow-hidden relative flex items-center">

        {/* We need a much longer animation duration for 48 videos (24x2) */}
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-4 md:gap-8 px-4" style={{ animationDuration: '120s' }}>
          {marqueeVideos.map((src, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[200px] h-[355px] md:w-[280px] md:h-[498px] rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:scale-[1.03] hover:shadow-2xl hover:z-10 bg-brand-dark/20 border-2 border-brand-dark"
              onClick={() => setSelectedVideo(src)}
            >
              <video
                src={src}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                preload="metadata"
                onMouseEnter={(e) => {
                  e.target.muted = false;
                  e.target.play().catch(() => {
                    // Browser might block unmuted autoplay if no prior interaction
                    e.target.muted = true;
                    e.target.play();
                  });
                }}
                onMouseLeave={(e) => {
                  e.target.muted = true;
                  e.target.pause();
                }}
              />
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/90 backdrop-blur-sm p-4 animate-fade-in-up"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] h-[90vh] flex justify-center aspect-[9/16]">
            {/* Close Button */}
            <button
              className="absolute -top-12 right-0 md:-right-16 md:top-0 bg-white text-brand-dark rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors z-50"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedVideo(null);
              }}
            >
              <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <video
              src={selectedVideo}
              className="w-full h-full object-contain rounded-xl shadow-2xl bg-black"
              onClick={(e) => e.stopPropagation()}
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      )}

    </section>
  );
};

export default ScrollVideos;
