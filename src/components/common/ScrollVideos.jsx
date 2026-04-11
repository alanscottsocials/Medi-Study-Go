import React, { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_VIDEO_TAG = import.meta.env.VITE_CLOUDINARY_VIDEO_TAG;
const CLOUDINARY_LIST_URL =
  CLOUDINARY_CLOUD_NAME && CLOUDINARY_VIDEO_TAG
    ? `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/list/${encodeURIComponent(CLOUDINARY_VIDEO_TAG)}.json`
    : null;

const encodePublicId = (publicId) =>
  publicId
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

const buildCloudinaryVideoUrl = ({ public_id: publicId, format, version, resource_type: resourceType }) => {
  const encodedPublicId = encodePublicId(publicId);
  const versionPath = version ? `v${version}/` : '';

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${resourceType || 'video'}/upload/${versionPath}${encodedPublicId}.${format || 'mp4'}`;
};

const ScrollVideos = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isCancelled = false;

    const loadVideos = async () => {
      if (!CLOUDINARY_LIST_URL) {
        if (!isCancelled) {
          setVideos([]);
          setLoadError('Cloudinary video settings are missing.');
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        setLoadError('');

        const response = await fetch(CLOUDINARY_LIST_URL, {
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load videos (${response.status})`);
        }

        const data = await response.json();
        const resources = Array.isArray(data?.resources) ? data.resources : [];

        const nextVideos = resources
          .filter((resource) => (resource.resource_type || 'video') === 'video')
          .map((resource) => ({
            id: resource.asset_id || resource.public_id,
            publicId: resource.public_id,
            src: buildCloudinaryVideoUrl(resource),
          }))
          .filter((resource) => Boolean(resource.publicId && resource.src));

        if (!isCancelled) {
          setVideos(nextVideos);
        }
      } catch (error) {
        if (!isCancelled) {
          setVideos([]);
          setLoadError(error instanceof Error ? error.message : 'Unable to load videos right now.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadVideos();

    return () => {
      isCancelled = true;
    };
  }, []);

  const marqueeVideos = useMemo(() => [...videos, ...videos], [videos]);

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
        {isLoading ? (
          <div className="w-full px-[4%] md:px-[6%] text-center text-brand-dark/70 font-semibold">
            Loading student videos...
          </div>
        ) : null}

        {!isLoading && loadError ? (
          <div className="w-full px-[4%] md:px-[6%] text-center text-brand-dark/70 font-semibold">
            {loadError}
          </div>
        ) : null}

        {!isLoading && !loadError && videos.length === 0 ? (
          <div className="w-full px-[4%] md:px-[6%] text-center text-brand-dark/70 font-semibold">
            No student videos found for this Cloudinary tag yet.
          </div>
        ) : null}

        {!isLoading && !loadError && videos.length > 0 ? (
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-4 md:gap-8 px-4" style={{ animationDuration: '120s' }}>
            {marqueeVideos.map((video, index) => (
              <div
                key={`${video.id}-${index}`}
                className="flex-shrink-0 w-[200px] h-[355px] md:w-[280px] md:h-[498px] rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:scale-[1.03] hover:shadow-2xl hover:z-10 bg-brand-dark/20 border-2 border-brand-dark"
                onClick={() => setSelectedVideo(video.src)}
              >
                <video
                  src={video.src}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onMouseEnter={(e) => {
                    e.target.muted = false;
                    e.target.play().catch(() => {
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
        ) : null}

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
