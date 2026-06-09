import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Copy, Eye, EyeOff, LocateFixed, Minus, Plus, Ruler } from 'lucide-react';

type RoutePoint = [number, number];
type TimelineStop = {
  durationMinutes: number;
  routeProgress: number;
  timelineProgress: number;
  width: number;
};

declare global {
  interface Window {
    L?: any;
  }
}

const leafletCssUrl = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const leafletScriptUrl = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

const routeWaypoints: RoutePoint[] = [
  [59.961733, 30.291039],
  [59.954981, 30.36533],
  [59.931659, 30.360508],
  [59.911419, 30.347697],
  [59.918061, 30.286654],
  [59.930198, 30.324467],
  [59.942361, 30.276588],
  [59.939289, 30.24364],
  [59.961733, 30.291039],
];

const fallbackRoutePoints: RoutePoint[] = [
  [59.961733, 30.291039],
  [59.954981, 30.36533],
  [59.931659, 30.360508],
  [59.911419, 30.347697],
  [59.918061, 30.286654],
  [59.930198, 30.324467],
  [59.942361, 30.276588],
  [59.939289, 30.24364],
  [59.961733, 30.291039],
];

const rows = [
  ['08869064', '2026-05-09 07:06:22', '59.961733, 30.291039', '59.954981, 30.365330', '46 км'],
  ['08869065', '2026-05-09 07:06:22', '59.954981, 30.365330', '59.931659, 30.360508', '46 км'],
  ['08869066', '2026-05-09 07:06:22', '59.931659, 30.360508', '59.911419, 30.347697', '46 км'],
  ['08869067', '2026-05-09 07:06:22', '59.911419, 30.347697', '59.918061, 30.286654', '46 км'],
  ['08869068', '2026-05-09 07:06:22', '59.918061, 30.286654', '59.930198, 30.324467', '46 км'],
  ['08869069', '2026-05-09 07:06:22', '59.930198, 30.324467', '59.942361, 30.276588', '46 км'],
  ['08869070', '2026-05-09 07:06:22', '59.942361, 30.276588', '59.939289, 30.243640', '46 км'],
  ['08869071', '2026-05-09 07:06:22', '59.939289, 30.243640', '59.961733, 30.291039', '46 км'],
];

const timelineLabels = ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '15:00', '16:00'];
const stopIdleDurations = [18, 24, 16, 29, 21, 15, 27, 19];
const totalTimelineMinutes = 390;
const timelineCycleDuration = 180000;
const timelineMinuteMs = timelineCycleDuration / totalTimelineMinutes;

function loadLeaflet() {
  if (window.L) {
    return Promise.resolve(window.L);
  }

  return new Promise<any>((resolve, reject) => {
    if (!document.querySelector(`link[href="${leafletCssUrl}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = leafletCssUrl;
      document.head.appendChild(link);
    }

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${leafletScriptUrl}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.L), { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = leafletScriptUrl;
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function fetchRoadRoute(signal: AbortSignal): Promise<RoutePoint[]> {
  const coordinates = routeWaypoints.map(([lat, lng]) => `${lng},${lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&continue_straight=false`;
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error('Route request failed');
  }

  const data = await response.json();
  const geometry = data?.routes?.[0]?.geometry?.coordinates;
  if (!Array.isArray(geometry) || geometry.length < 2) {
    throw new Error('Route geometry is empty');
  }

  return geometry.map(([lng, lat]: [number, number]) => [lat, lng]);
}

function getRouteColor(progress: number) {
  const start = { r: 37, g: 99, b: 235 };
  const end = { r: 34, g: 197, b: 94 };
  const r = Math.round(start.r + (end.r - start.r) * progress);
  const g = Math.round(start.g + (end.g - start.g) * progress);
  const b = Math.round(start.b + (end.b - start.b) * progress);
  return `rgb(${r}, ${g}, ${b})`;
}

function drawGradientRoute(L: any, map: any, points: RoutePoint[]) {
  const chunks = Math.max(1, Math.min(32, points.length - 1));

  for (let index = 0; index < chunks; index += 1) {
    const startIndex = Math.floor((index / chunks) * (points.length - 1));
    const endIndex = Math.max(startIndex + 1, Math.ceil(((index + 1) / chunks) * (points.length - 1)));
    const segment = points.slice(startIndex, endIndex + 1);

    L.polyline(segment, {
      color: getRouteColor(index / Math.max(chunks - 1, 1)),
      weight: 6,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);
  }
}

function carSvg(rotation = 0) {
  return `
    <div class="route-car-body" style="width:65px;height:65px;position:relative;transform:rotate(${rotation}deg);transform-origin:center;will-change:transform;">
      <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_169_50265)">
          <g filter="url(#filter0_d_169_50265)">
            <mask id="mask0_169_50265" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="3" y="4" width="58" height="58">
              <path d="M6.08037 48.889L15.9799 58.7885C19.1041 61.9127 24.1694 61.9127 27.2936 58.7885L58.4063 27.6758C61.5305 24.5516 61.5305 19.4862 58.4063 16.3621L48.5068 6.46256C45.3826 3.33836 40.3173 3.33836 37.1931 6.46256L6.08037 37.5753C2.95618 40.6995 2.95618 45.7648 6.08037 48.889Z" fill="white"/>
            </mask>
            <g mask="url(#mask0_169_50265)">
              <path d="M7.54147 36.5376L28.332 57.3281L59.5414 26.1188L38.7508 5.3282L7.54147 36.5376Z" fill="black"/>
              <path d="M5.73115 48.5349L16.3387 59.1424C19.1504 61.9542 24.5566 61.1053 27.3684 58.2936L58.7642 26.8977C61.575 24.0869 61.5768 19.5278 58.7651 16.716L48.1576 6.10849C45.3467 3.29762 40.7867 3.29672 37.9749 6.10849L6.5791 37.5043C3.76914 40.3179 2.92029 45.724 5.73115 48.5349ZM14.3307 31.5371L24.8534 21.0144L27.6318 23.1595L23.2964 27.4949L14.3307 31.5371ZM12.5418 35.9095C16.9764 33.3079 22.2202 30.2345 22.2202 30.2345L34.64 42.6543L28.9677 52.3353C28.9677 52.3353 18.2312 47.0438 12.5418 35.9095ZM37.6349 41.2651L41.687 37.213L43.8348 39.9904L33.5927 50.2326L37.6349 41.2651ZM54.7337 29.0916L45.3891 38.4362L43.2359 35.6641L50.6293 28.2707L54.7337 29.0916ZM55.9849 25.0313L50.9748 26.0399L38.5523 13.6174L39.5599 8.60634L55.9849 25.0313ZM36.2926 14.4987L29.1914 21.5998L26.4094 19.4583L35.4735 10.3943L36.2926 14.4987Z" fill="white"/>
            </g>
          </g>
        </g>
        <g class="route-hazard-layer" pointer-events="none">
          <circle class="route-hazard-glow" cx="12" cy="50" r="10"/>
          <circle class="route-hazard" cx="12" cy="50" r="4"/>
          <circle class="route-hazard-glow" cx="50" cy="12" r="10"/>
          <circle class="route-hazard" cx="50" cy="12" r="4"/>
          <circle class="route-hazard-glow" cx="6" cy="36" r="10"/>
          <circle class="route-hazard" cx="6" cy="36" r="4"/>
          <circle class="route-hazard-glow" cx="36" cy="6" r="10"/>
          <circle class="route-hazard" cx="36" cy="6" r="4"/>
        </g>
        <defs>
          <filter id="filter0_d_169_50265" x="0" y="0.119141" width="64.75" height="64.7549" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_169_50265"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_169_50265" result="shape"/>
          </filter>
          <clipPath id="clip0_169_50265">
            <rect width="65" height="65" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </div>
  `;
}

function getBearing(from: RoutePoint, to: RoutePoint) {
  const [lat1, lon1] = from.map((value) => (value * Math.PI) / 180);
  const [lat2, lon2] = to.map((value) => (value * Math.PI) / 180);
  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function getDistance(from: RoutePoint, to: RoutePoint) {
  const radius = 6371000;
  const lat1 = (from[0] * Math.PI) / 180;
  const lat2 = (to[0] * Math.PI) / 180;
  const deltaLat = ((to[0] - from[0]) * Math.PI) / 180;
  const deltaLng = ((to[1] - from[1]) * Math.PI) / 180;
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function createRouteMetrics(points: RoutePoint[]) {
  const distances = points.slice(1).map((point, index) => getDistance(points[index], point));
  const totalDistance = distances.reduce((sum, distance) => sum + distance, 0);
  return { distances, totalDistance };
}

function interpolateRoute(points: RoutePoint[], progress: number, metrics = createRouteMetrics(points)) {
  const targetDistance = progress * metrics.totalDistance;
  let travelled = 0;
  let index = 0;

  while (index < metrics.distances.length - 1 && travelled + metrics.distances[index] < targetDistance) {
    travelled += metrics.distances[index];
    index += 1;
  }

  const segmentDistance = metrics.distances[index] || 1;
  const amount = Math.min(Math.max((targetDistance - travelled) / segmentDistance, 0), 1);
  const current = points[index];
  const next = points[index + 1];
  const lat = current[0] + (next[0] - current[0]) * amount;
  const lng = current[1] + (next[1] - current[1]) * amount;
  return { point: [lat, lng] as RoutePoint, bearing: getBearing(current, next) };
}

function resampleRoute(points: RoutePoint[], stepMeters = 24) {
  const metrics = createRouteMetrics(points);
  const steps = Math.max(points.length, Math.ceil(metrics.totalDistance / stepMeters));

  return Array.from({ length: steps + 1 }, (_, index) =>
    interpolateRoute(points, index / steps, metrics).point,
  );
}

function smoothRoutePoints(points: RoutePoint[], passes = 2) {
  const isClosed = getDistance(points[0], points[points.length - 1]) < 1;
  let smoothed = points;

  for (let pass = 0; pass < passes; pass += 1) {
    smoothed = smoothed.map((point, index) => {
      if (!isClosed && (index === 0 || index === smoothed.length - 1)) {
        return point;
      }

      const previous = smoothed[(index - 1 + smoothed.length) % smoothed.length];
      const next = smoothed[(index + 1) % smoothed.length];
      return [
        previous[0] * 0.18 + point[0] * 0.64 + next[0] * 0.18,
        previous[1] * 0.18 + point[1] * 0.64 + next[1] * 0.18,
      ] as RoutePoint;
    });

    if (isClosed) {
      smoothed[smoothed.length - 1] = smoothed[0];
    }
  }

  return smoothed;
}

function getStopProgresses(route: RoutePoint[]) {
  const progresses = routeWaypoints.slice(0, -1).map((stop) => {
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      route.forEach((point, index) => {
        const distance = getDistance(stop, point);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      return closestIndex / Math.max(route.length - 1, 1);
    });

  return [...new Set(progresses.map((progress) => Number(progress.toFixed(4))))]
    .sort((a, b) => a - b);
}

function getPlaybackState(elapsed: number, driveDuration: number, stopDurations: number[], stopProgresses: number[]) {
  const totalDuration = driveDuration + stopDurations.reduce((sum, duration) => sum + duration, 0);
  const cycleTime = elapsed % totalDuration;
  let pauseOffset = 0;

  for (let index = 0; index < stopProgresses.length; index += 1) {
    const stopProgress = stopProgresses[index];
    const stopDuration = stopDurations[index] ?? 0;
    const stopStart = stopProgress * driveDuration + pauseOffset;

    if (cycleTime < stopStart) {
      return {
        progress: (cycleTime - pauseOffset) / driveDuration,
        timelineProgress: cycleTime / totalDuration,
        isStopped: false,
      };
    }

    if (cycleTime < stopStart + stopDuration) {
      return {
        progress: stopProgress,
        timelineProgress: cycleTime / totalDuration,
        isStopped: true,
      };
    }

    pauseOffset += stopDuration;
  }

  return {
    progress: (cycleTime - pauseOffset) / driveDuration,
    timelineProgress: cycleTime / totalDuration,
    isStopped: false,
  };
}

function progressToCycleTime(progress: number, driveDuration: number, stopDurations: number[], _stopProgresses: number[]) {
  const totalDuration = driveDuration + stopDurations.reduce((sum, duration) => sum + duration, 0);
  return progress * totalDuration;
}

function createTimelineStops(driveDuration: number, stopDurations: number[], stopProgresses: number[]) {
  const totalDuration = driveDuration + stopDurations.reduce((sum, duration) => sum + duration, 0);
  let pauseOffset = 0;

  return stopProgresses.map((routeProgress, index) => {
    const duration = stopDurations[index] ?? 0;
    const stopStart = routeProgress * driveDuration + pauseOffset;
    pauseOffset += duration;

    return {
      durationMinutes: stopIdleDurations[index % stopIdleDurations.length],
      routeProgress,
      timelineProgress: stopStart / totalDuration,
      width: duration / totalDuration,
    };
  });
}

function getTimelineTime(progress: number) {
  const startMinutes = 9 * 60 + 30;
  const endMinutes = 16 * 60;
  const minutes = Math.round(startMinutes + (endMinutes - startMinutes) * progress);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function getTimelineLabelProgress(label: string) {
  const [hours, minutes] = label.split(':').map(Number);
  const startMinutes = 9 * 60 + 30;
  const labelMinutes = hours * 60 + minutes;
  return Math.min(Math.max((labelMinutes - startMinutes) / totalTimelineMinutes, 0), 1);
}

export default function RoutesPrototypePage() {
  const [isTableHidden, setIsTableHidden] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'routes' | 'zones' | 'settings'>('routes');
  const [selectedRow, setSelectedRow] = useState(0);
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [timelineStops, setTimelineStops] = useState<TimelineStop[]>([]);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const carMarkerRef = useRef<any>(null);
  const carBodyRef = useRef<HTMLElement | null>(null);
  const displayedBearingRef = useRef(0);
  const displayedPointRef = useRef<RoutePoint | null>(null);
  const animationRef = useRef<number | null>(null);
  const currentRouteRef = useRef<RoutePoint[]>(fallbackRoutePoints);
  const driveDurationRef = useRef(140000);
  const stopDurationsRef = useRef<number[]>([]);
  const stopProgressesRef = useRef<number[]>([]);
  const isScrubbingRef = useRef(false);
  const scrubProgressRef = useRef(0);
  const playbackStartedAtRef = useRef(0);
  const lastTimelineUpdateRef = useRef(0);

  const tabItems = useMemo(
    () => [
      ['requests', 'Заявки'],
      ['routes', 'Маршруты'],
      ['zones', 'Геозоны'],
      ['settings', 'Настройки'],
    ] as const,
    [],
  );
  const currentTimelineTime = getTimelineTime(timelineProgress);

  useEffect(() => {
    let cancelled = false;
    const routeRequestController = new AbortController();

    loadLeaflet()
      .then(async (L) => {
        if (cancelled || !mapRef.current || leafletMapRef.current) {
          return;
        }

        const rawRoadRoute = await fetchRoadRoute(routeRequestController.signal).catch(() => fallbackRoutePoints);
        if (cancelled) {
          return;
        }
        const roadRoute = smoothRoutePoints(resampleRoute(rawRoadRoute), 2);
        currentRouteRef.current = roadRoute;

        const map = L.map(mapRef.current, {
          center: [59.9382, 30.337],
          zoom: 14,
          zoomControl: false,
          attributionControl: false,
        });
        leafletMapRef.current = map;

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          crossOrigin: true,
          className: 'prototype-map-tiles',
        }).addTo(map);
        L.control.scale({ imperial: false, metric: true, position: 'bottomright', maxWidth: 34 }).addTo(map);

        drawGradientRoute(L, map, roadRoute);

        routeWaypoints.slice(0, -1).forEach((point, index) => {
          L.marker(point, {
            icon: L.divIcon({
              className: 'route-stop-marker',
              html: `<span>${index + 1}</span>`,
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            }),
          }).addTo(map);
        });

        const routeMetrics = createRouteMetrics(roadRoute);
        const initial = interpolateRoute(roadRoute, 0, routeMetrics);
        displayedBearingRef.current = initial.bearing;
        displayedPointRef.current = initial.point;
        const carIcon = L.divIcon({
          className: 'route-car-marker',
          html: carSvg(initial.bearing + 135),
          iconSize: [65, 65],
          iconAnchor: [32.5, 32.5],
        });
        carMarkerRef.current = L.marker(initial.point, { icon: carIcon, interactive: false }).addTo(map);
        carBodyRef.current = carMarkerRef.current.getElement()?.querySelector('.route-car-body') ?? null;
        map.fitBounds(L.latLngBounds(roadRoute), { paddingTopLeft: [70, 70], paddingBottomRight: [70, 130], maxZoom: 15 });

        const stopProgresses = getStopProgresses(roadRoute);
        const stopDurations = stopProgresses.map((_, index) => stopIdleDurations[index % stopIdleDurations.length] * timelineMinuteMs);
        const totalStopMinutes = stopProgresses.reduce((sum, _, index) => sum + stopIdleDurations[index % stopIdleDurations.length], 0);
        const driveDuration = Math.max(1, (totalTimelineMinutes - totalStopMinutes) * timelineMinuteMs);
        driveDurationRef.current = driveDuration;
        stopDurationsRef.current = stopDurations;
        stopProgressesRef.current = stopProgresses;
        setTimelineStops(createTimelineStops(driveDuration, stopDurations, stopProgresses));
        playbackStartedAtRef.current = performance.now();
        const animate = (now: number) => {
          const totalDuration = driveDuration + stopDurations.reduce((sum, duration) => sum + duration, 0);
          const playback = isScrubbingRef.current
            ? getPlaybackState(scrubProgressRef.current * totalDuration, driveDuration, stopDurations, stopProgresses)
            : getPlaybackState(now - playbackStartedAtRef.current, driveDuration, stopDurations, stopProgresses);
          const { progress, isStopped } = playback;
          const { point, bearing } = interpolateRoute(roadRoute, progress, routeMetrics);
          const previousPoint = displayedPointRef.current ?? point;
          const pointSmoothing = isStopped ? 0.28 : 0.1;
          const smoothedPoint: RoutePoint = [
            previousPoint[0] + (point[0] - previousPoint[0]) * pointSmoothing,
            previousPoint[1] + (point[1] - previousPoint[1]) * pointSmoothing,
          ];
          displayedPointRef.current = smoothedPoint;
          carMarkerRef.current.setLatLng(smoothedPoint);
          const currentBearing = displayedBearingRef.current;
          const lookahead = interpolateRoute(roadRoute, (progress + 0.006) % 1, routeMetrics);
          const targetBearing = getDistance(smoothedPoint, lookahead.point) > 0.5 ? getBearing(smoothedPoint, lookahead.point) : bearing;
          const bearingDelta = ((((targetBearing - currentBearing) % 360) + 540) % 360) - 180;
          displayedBearingRef.current = currentBearing + bearingDelta * 0.025;
          if (!carBodyRef.current) {
            carBodyRef.current = carMarkerRef.current.getElement()?.querySelector('.route-car-body') ?? null;
          }
          if (carBodyRef.current) {
            carBodyRef.current.style.transform = `rotate(${displayedBearingRef.current + 135}deg)`;
            carBodyRef.current.parentElement?.classList.toggle('is-paused', isStopped);
          }
          if (!isScrubbingRef.current && now - lastTimelineUpdateRef.current > 90) {
            lastTimelineUpdateRef.current = now;
            setTimelineProgress(playback.timelineProgress);
          }
          animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
        setMapStatus('ready');
      })
      .catch(() => {
        if (!cancelled) {
          setMapStatus('error');
        }
      });

    return () => {
      cancelled = true;
      routeRequestController.abort();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (leafletMapRef.current) {
      window.setTimeout(() => leafletMapRef.current?.invalidateSize(), 520);
    }
  }, [isTableHidden]);

  return (
    <main className="relative h-screen min-h-[720px] overflow-hidden bg-[#f5f5f5] font-['Roboto','Arial',sans-serif] text-[rgba(0,0,0,0.88)]">
      <style>{`
        .route-stop-marker span {
          display: grid;
          width: 28px;
          height: 28px;
          place-items: center;
          border: 2px solid white;
          border-radius: 999px;
          background: rgba(24, 24, 24, 0.9);
          color: white;
          font: 700 13px/1 Arial, sans-serif;
          box-shadow: 0 2px 8px rgba(0,0,0,.28);
        }
        .route-car-marker {
          background: transparent;
          border: 0;
          filter: drop-shadow(0 6px 14px rgba(0,0,0,.22));
          transform: translate3d(0,0,0);
        }
        .route-hazard {
          opacity: 0;
          fill: #f59e0b;
          filter: drop-shadow(0 0 7px rgba(245,158,11,.78));
        }
        .route-hazard-glow {
          opacity: 0;
          fill: rgba(245,158,11,.24);
          filter: blur(2px);
        }
        .route-car-marker.is-paused .route-hazard,
        .route-car-marker.is-paused .route-hazard-glow {
          animation: route-hazard-blink .62s steps(1, end) infinite;
        }
        @keyframes route-hazard-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .leaflet-container {
          background: #eef5f7;
          font-family: Roboto, Arial, sans-serif;
        }
        .prototype-map-tiles {
          filter: saturate(.86) contrast(.96) brightness(1.02);
        }
        .leaflet-bottom.leaflet-right {
          bottom: 72px;
          right: 20px;
        }
        .route-timeline-input {
          position: absolute;
          inset: 0;
          z-index: 4;
          width: 100%;
          height: 44px;
          opacity: 0;
          cursor: grab;
        }
        .route-timeline-input:active {
          cursor: grabbing;
        }
        .route-timeline-road {
          background: linear-gradient(90deg, rgba(37,99,235,.2), rgba(34,197,94,.2));
        }
      `}</style>

      <section
        className={[
          'absolute inset-x-0 top-0 overflow-hidden transition-[height] duration-500 ease-out',
          isTableHidden ? 'h-full' : 'h-[66%]',
        ].join(' ')}
      >
        <div ref={mapRef} className="absolute inset-0" />
        {mapStatus !== 'ready' && (
          <div className="absolute inset-0 grid place-items-center bg-[#eef3eb] text-sm text-black/55">
            {mapStatus === 'loading' ? 'Загружаю карту...' : 'Не удалось загрузить OpenStreetMap'}
          </div>
        )}

        <div className="absolute left-1/2 top-4 z-[500] flex -translate-x-1/2 rounded-3xl bg-white p-1 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
          {tabItems.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={[
                'h-10 rounded-2xl px-6 text-sm transition-colors',
                activeTab === key ? 'bg-black/5 font-medium' : 'hover:bg-black/[0.03]',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="absolute bottom-4 left-5 right-5 z-[500] flex items-end gap-3">
          <div className="flex h-11 w-[280px] items-center gap-2 rounded-xl bg-white px-4 shadow-[0_4px_14px_rgba(0,0,0,0.12)]">
            <span className="truncate text-sm">Александров Кирилл Николаевич</span>
            <button className="ml-auto text-black/35" type="button" aria-label="Очистить">x</button>
          </div>
          <button className="flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm shadow-[0_4px_14px_rgba(0,0,0,0.12)]" type="button">
            2026-05-09
            <CalendarDays className="size-4 text-black/45" />
          </button>

          <div className="relative h-11 min-w-[360px] flex-1 rounded-xl bg-white/92 px-3 shadow-[0_4px_14px_rgba(0,0,0,0.12)] backdrop-blur-sm">
            <div className="absolute inset-x-3 top-1 text-[9px] font-medium text-[#7a8299]">
              {timelineLabels.map((time) => (
                <span
                  key={time}
                  className="absolute -translate-x-1/2 whitespace-nowrap"
                  style={{ left: `${getTimelineLabelProgress(time) * 100}%` }}
                >
                  {time}
                </span>
              ))}
            </div>

            <div className="route-timeline-road absolute left-3 right-3 top-[25px] h-3 overflow-hidden rounded-full">
              <div
                className="relative h-full overflow-hidden rounded-full"
                style={{ width: `${Math.max(timelineProgress * 100, 1.5)}%` }}
              >
                <div className="absolute inset-y-0 left-0 w-[calc(100vw-520px)] min-w-full rounded-full bg-gradient-to-r from-[#2563eb] to-[#22c55e]" />
              </div>
            </div>

            {timelineLabels.map((time, index) => (
              <span
                key={`tick-${time}`}
                className="absolute top-[22px] z-[3] h-4 w-px bg-black/20"
                style={{ left: `calc(12px + (100% - 24px) * ${getTimelineLabelProgress(time)})` }}
              />
            ))}

            {timelineStops.map((stop, index) => {
              return (
                <div
                  key={`${stop.timelineProgress}-${index}`}
                  className="absolute top-[19px] z-[6] flex h-6 items-center rounded-full border border-black/10 bg-white pr-2 text-black/70 shadow-[0_2px_8px_rgba(0,0,0,.14)]"
                  style={{
                    left: `calc(12px + (100% - 24px) * ${stop.timelineProgress})`,
                    width: `calc((100% - 24px) * ${stop.width})`,
                  }}
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-white bg-[rgba(24,24,24,0.92)] text-[11px] font-bold leading-none text-white">
                    {index + 1}
                  </span>
                  <span className="ml-1 whitespace-nowrap text-[10px] font-medium leading-none">{stop.durationMinutes} мин</span>
                </div>
              );
            })}

            <div
              className="absolute top-0 z-[7] flex -translate-x-1/2 flex-col items-center"
              style={{ left: `calc(12px + (100% - 24px) * ${timelineProgress})` }}
            >
              <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold text-white">{currentTimelineTime}</span>
              <span className="h-[28px] w-px bg-[#ef4444]" />
            </div>

            <input
              className="route-timeline-input"
              min="0"
              max="1"
              step="0.001"
              type="range"
              value={timelineProgress}
              onPointerDown={() => {
                isScrubbingRef.current = true;
              }}
              onPointerUp={() => {
                isScrubbingRef.current = false;
                playbackStartedAtRef.current = performance.now() - progressToCycleTime(
                  scrubProgressRef.current,
                  driveDurationRef.current,
                  stopDurationsRef.current,
                  stopProgressesRef.current,
                );
              }}
              onChange={(event) => {
                const nextProgress = Number(event.currentTarget.value);
                scrubProgressRef.current = nextProgress;
                setTimelineProgress(nextProgress);
              }}
            />
          </div>

          <button
            className="flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#f8f8f8]"
            type="button"
            onClick={() => setIsTableHidden((value) => !value)}
          >
            {isTableHidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            {isTableHidden ? 'Показать' : 'Скрыть'}
          </button>
        </div>

        <div className="absolute right-5 top-[26%] z-[500] flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_4px_14px_rgba(0,0,0,0.12)]">
          <button className="flex size-11 items-center justify-center border-b border-black/5" type="button"><Copy className="size-5" /></button>
          <button className="flex size-11 items-center justify-center border-b border-black/5" type="button"><Ruler className="size-5" /></button>
          <button className="flex size-11 items-center justify-center border-b border-black/5" type="button" onClick={() => leafletMapRef.current?.zoomIn()}><Plus className="size-5" /></button>
          <button className="flex size-11 items-center justify-center border-b border-black/5" type="button" onClick={() => leafletMapRef.current?.zoomOut()}><Minus className="size-5" /></button>
          <button className="flex size-11 items-center justify-center" type="button" onClick={() => leafletMapRef.current?.fitBounds(window.L.latLngBounds(currentRouteRef.current), { paddingTopLeft: [70, 70], paddingBottomRight: [70, 130], maxZoom: 15 })}><LocateFixed className="size-5" /></button>
        </div>
      </section>

      <section
        className={[
          'absolute inset-x-0 bottom-0 z-[550] h-[34%] overflow-hidden rounded-t-[20px] border border-black/10 bg-white shadow-[0_-10px_28px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-out',
          isTableHidden ? 'translate-y-[calc(100%-20px)]' : 'translate-y-0',
        ].join(' ')}
      >
        <div className="grid grid-cols-[70px_120px_150px_1fr_1fr_110px_110px_140px_130px_140px] bg-[#f5f5f5] px-4 text-sm font-semibold leading-[22px]">
          {['Маршрут', 'Заявка', 'Время закр.', 'Откуда', 'Куда', 'Пробег расч.', 'Пробег исп.', 'Транспорт', 'Тип поездки', 'Подтв.'].map((item) => (
            <div key={item} className="flex h-14 items-center border-b border-black/10 px-2">{item}</div>
          ))}
        </div>
        <div className="overflow-auto">
          {rows.map((row, index) => (
            <button
              key={row[0]}
              type="button"
              onClick={() => setSelectedRow(index)}
              className={[
                'grid w-full grid-cols-[70px_120px_150px_1fr_1fr_110px_110px_140px_130px_140px] px-4 text-left text-sm leading-[22px] transition-colors',
                selectedRow === index ? 'bg-[#f3f8ef]' : 'bg-white hover:bg-black/[0.02]',
              ].join(' ')}
            >
              <div className="border-b border-black/5 px-2 py-3">1</div>
              <div className="border-b border-black/5 px-2 py-3 text-[#1677ff]">{row[0]}</div>
              <div className="border-b border-black/5 px-2 py-3">{row[1]}</div>
              <div className="border-b border-black/5 px-2 py-3">{row[2]}</div>
              <div className="border-b border-black/5 px-2 py-3">{row[3]}</div>
              <div className="border-b border-black/5 px-2 py-3">{row[4]}</div>
              <div className="border-b border-black/5 px-2 py-3">{row[4]}</div>
              <div className="border-b border-black/5 px-2 py-3">Личный</div>
              <div className="border-b border-black/5 px-2 py-3">Поездка</div>
              <div className="border-b border-black/5 px-2 py-3"><span className="rounded border border-[#b7eb8f] bg-[#f6ffed] px-2 py-1 text-xs text-[#52c41a]">Подтв. авто</span></div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
