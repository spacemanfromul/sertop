import { useState, type VideoHTMLAttributes } from 'react';

type PortfolioVideoProps = {
  src: string;
  label?: string;
  poster?: string;
  className?: string;
  videoClassName?: string;
  skeletonClassName?: string;
} & Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'poster' | 'className'>;

export default function PortfolioVideo({
  src,
  label,
  poster,
  className = '',
  videoClassName = '',
  skeletonClassName = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  preload = 'metadata',
  onLoadedData,
  onCanPlay,
  ...videoProps
}: PortfolioVideoProps) {
  const [isReady, setIsReady] = useState(false);

  function showVideo() {
    setIsReady(true);
  }

  return (
    <div className={`relative overflow-hidden bg-[#f5f5f5] ${className}`}>
      {!isReady && (
        poster ? (
          <img
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover"
            src={poster}
            loading="eager"
            decoding="async"
          />
        ) : (
          <div
            aria-hidden="true"
            className={`absolute inset-0 bg-[linear-gradient(110deg,#f5f5f5_0%,#f9faf8_36%,#ecefeb_52%,#f5f5f5_72%)] bg-[length:220%_100%] motion-safe:animate-[portfolio-video-shimmer_1.6s_ease-in-out_infinite] ${skeletonClassName}`}
          />
        )
      )}
      <video
        {...videoProps}
        aria-label={label}
        className={`size-full object-cover transition-opacity duration-500 ease-out ${isReady ? 'opacity-100' : 'opacity-0'} ${videoClassName}`}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload={preload}
        onLoadedData={(event) => {
          showVideo();
          onLoadedData?.(event);
        }}
        onCanPlay={(event) => {
          showVideo();
          onCanPlay?.(event);
        }}
      />
      <style>{`
        video:fullscreen {
          object-fit: contain !important;
          background: #000;
        }
        video:-webkit-full-screen {
          object-fit: contain !important;
          background: #000;
        }
      `}</style>
    </div>
  );
}
