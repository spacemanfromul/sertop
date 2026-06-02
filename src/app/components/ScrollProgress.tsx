import { useState, useEffect } from 'react';

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [tiltX, setTiltX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const calculateScrollProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      const totalScrollable = documentHeight - windowHeight;
      const progress = totalScrollable > 0 ? (scrollTop / totalScrollable) * 100 : 0;

      setScrollProgress(Math.min(Math.round(progress), 100));
    };

    window.addEventListener('scroll', calculateScrollProgress);
    calculateScrollProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', calculateScrollProgress);
  }, []);

  // Device orientation effect for mobile
  useEffect(() => {
    // Detect if device is mobile
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();

    if (!isMobile) return;

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      // Determine current screen orientation
      const isLandscape = window.matchMedia('(orientation: landscape)').matches;

      let tiltValue = 0;

      if (isLandscape) {
        // In landscape mode, use beta (forward-backward tilt)
        if (event.beta !== null) {
          // Adjust beta based on which landscape orientation
          // beta ranges from -180 to 180
          let adjustedBeta = event.beta;

          // Normalize beta for landscape
          if (adjustedBeta > 90) {
            adjustedBeta = 180 - adjustedBeta;
          } else if (adjustedBeta < -90) {
            adjustedBeta = -180 - adjustedBeta;
          }

          tiltValue = adjustedBeta;
        }
      } else {
        // In portrait mode, use gamma (left-right tilt)
        if (event.gamma !== null) {
          tiltValue = event.gamma;
        }
      }

      // Limit tilt effect to reasonable range
      const clampedTilt = Math.max(-30, Math.min(30, tiltValue));
      setTiltX(clampedTilt * 0.3); // Scale down for subtle effect
    };

    // Request permission for iOS 13+
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
          }
        })
        .catch(console.error);
    } else if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, [isMobile]);

  // Calculate liquid fill height (from bottom to top)
  const fillHeight = (scrollProgress / 100) * 56;

  // Generate liquid surface path (tilted for mobile, flat for desktop)
  const getLiquidPath = () => {
    const baseY = 56 - fillHeight;

    if (!isMobile || tiltX === 0) {
      // Desktop: flat surface
      return `M 0 ${baseY} L 56 ${baseY} L 56 56 L 0 56 Z`;
    }

    // Mobile: tilted surface based on device orientation (inverted for realistic physics)
    const leftY = baseY + tiltX;
    const rightY = baseY - tiltX;

    return `M 0 ${leftY} L 56 ${rightY} L 56 56 L 0 56 Z`;
  };

  return (
    <div className="relative size-[56px]">
      {/* Background circle */}
      <div className="absolute left-0 size-[56px] top-0">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56 56">
          <circle cx="28" cy="28" fill="white" r="28" />
        </svg>
      </div>

      {/* Liquid fill indicator */}
      <div className="absolute left-0 size-[56px] top-0 overflow-hidden rounded-full">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56 56">
          <defs>
            <clipPath id="circle-clip">
              <circle cx="28" cy="28" r="28" />
            </clipPath>
          </defs>
          <g clipPath="url(#circle-clip)">
            <path
              d={getLiquidPath()}
              fill="#B1FFC0"
              className="transition-all duration-150 ease-out"
            />
          </g>
        </svg>
      </div>

      {/* Percentage text */}
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Google Sans',sans-serif] font-medium justify-center leading-[0] left-1/2 -translate-x-1/2 not-italic text-[#0f5223] text-[20px] top-[28px] whitespace-nowrap">
        <p className="leading-[26px]">{scrollProgress}%</p>
      </div>
    </div>
  );
}
