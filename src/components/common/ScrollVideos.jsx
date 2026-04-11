import React, { useEffect, useMemo, useRef, useState } from 'react';
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

const buildCloudinaryUrl = ({ resourceType = 'video', transformation = '', publicId, extension = '' }) => {
  const encodedPublicId = encodePublicId(publicId);
  const transformationPath = transformation ? `${transformation}/` : '';
  const extensionSuffix = extension ? `.${extension}` : '';

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/${transformationPath}${encodedPublicId}${extensionSuffix}`;
};

const buildCloudinaryVideoUrl = ({ public_id: publicId }) => {
  return buildCloudinaryUrl({
    resourceType: 'video',
    publicId,
    transformation: 'q_auto:good,vc_auto',
  });
};

const buildCloudinaryPosterUrl = ({ public_id: publicId }) => {
  return buildCloudinaryUrl({
    resourceType: 'video',
    publicId,
    transformation: 'so_1/c_fill,g_auto,w_560,h_996/q_auto:good',
    extension: 'jpg',
  });
};

const buildCloudinaryPreviewUrl = ({ public_id: publicId }) => {
  return buildCloudinaryUrl({
    resourceType: 'video',
    publicId,
    transformation: 'so_0,du_6/c_fill,g_auto,w_420,h_748/q_auto:low,vc_auto',
    extension: 'mp4',
  });
};

const VideoCard = ({ video, onOpen }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [posterError, setPosterError] = useState(false);
  const [previewRetryKey, setPreviewRetryKey] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!showPreview && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [showPreview]);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  const startPreview = () => {
    setShowPreview(true);
  };

  const stopPreview = () => {
    setShowPreview(false);
  };

  return (
    <button
      type="button"
      className="flex-shrink-0 w-[200px] h-[355px] md:w-[280px] md:h-[498px] rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:scale-[1.03] hover:shadow-2xl hover:z-10 bg-brand-dark/20 border-2 border-brand-dark text-left"
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      onFocus={startPreview}
      onBlur={stopPreview}
      onClick={() => onOpen(video)}
      aria-label="Open student video"
    >
      <div className="relative w-full h-full bg-brand-dark/10">
        {showPreview ? (
          <video
            key={previewRetryKey}
            ref={videoRef}
            src={video.previewSrc}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="none"
            autoPlay
            poster={video.posterSrc}
            onError={() => {
              setShowPreview(false);
              window.setTimeout(() => {
                setPreviewRetryKey((currentKey) => currentKey + 1);
              }, 1200);
            }}
          />
        ) : posterError ? (
          <div className="w-full h-full flex items-center justify-center bg-brand-dark text-white font-black tracking-wide text-center px-4">
            STUDENT STORY
          </div>
        ) : (
          <img
            src={video.posterSrc}
            alt="Student video thumbnail"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onError={() => setPosterError(true)}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/35 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <div className="ml-1 border-y-[10px] border-y-transparent border-l-[16px] border-l-brand-dark" />
          </div>
        </div>
      </div>
    </button>
  );
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
            posterSrc: buildCloudinaryPosterUrl(resource),
            previewSrc: buildCloudinaryPreviewUrl(resource),
            fullSrc: buildCloudinaryVideoUrl(resource),
          }))
          .filter((resource) => Boolean(resource.publicId && resource.posterSrc && resource.previewSrc && resource.fullSrc));

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
              <VideoCard
                key={`${video.id}-${index}`}
                video={video}
                onOpen={setSelectedVideo}
              />
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
              src={selectedVideo.fullSrc}
              className="w-full h-full object-contain rounded-xl shadow-2xl bg-black"
              poster={selectedVideo.posterSrc}
              onClick={(e) => e.stopPropagation()}
              controls
              autoPlay
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      )}

    </section>
  );
};

export default ScrollVideos;
