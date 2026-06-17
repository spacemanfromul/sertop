import { type PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Car, Check, Copy, Eraser, Trash2, XCircle } from 'lucide-react';

type ReactNode = import('react').ReactNode;

type RoutePoint = [number, number];
type TimelineStop = {
  durationMinutes: number;
  routeProgress: number;
  timelineProgress: number;
  width: number;
};
type SortState = { key: string; direction: 'asc' | 'desc' } | null;
type GeozoneCreationStep = 'address' | 'drawing' | 'saved';
type CreatedGeozone = {
  id: string;
  name: string;
  address: string;
  color: string;
  points: RoutePoint[];
};
type GeozoneMapItem = {
  id: string;
  name: string;
  color: string;
  points: RoutePoint[];
};
type GeozonePointMenu = {
  pointIndex: number;
  x: number;
  y: number;
} | null;
type GeozoneInfoCard = {
  id: string;
  x: number;
  y: number;
} | null;

declare global {
  interface Window {
    L?: any;
  }
}

const leafletCssUrl = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const leafletScriptUrl = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const baseGeozonesStorageKey = 'routes-prototype:base-geozones';
const createdGeozonesStorageKey = 'routes-prototype:created-geozones';

const routeWaypoints: RoutePoint[] = [
  [59.961459, 30.291013],
  [59.954981, 30.36533],
  [59.931659, 30.360508],
  [59.947091, 30.433803],
  [59.933392, 30.261282],
  [59.930198, 30.324467],
  [59.942361, 30.276588],
  [59.939289, 30.24364],
  [59.961695, 30.29052],
];

const geozonePolygons = [
  {
    id: 'petrogradskaya-zone',
    name: 'Петроградская зона',
    color: '#ff00d6',
    points: [
      [59.9718, 30.2475],
      [59.9739, 30.2668],
      [59.9758, 30.3018],
      [59.9692, 30.3186],
      [59.9612, 30.3345],
      [59.9518, 30.3294],
      [59.9398, 30.323],
      [59.9359, 30.3026],
      [59.9328, 30.2795],
      [59.9384, 30.2609],
      [59.9468, 30.242],
      [59.9594, 30.2442],
    ] as RoutePoint[],
  },
  {
    id: 'central-zone',
    name: 'Центральная зона',
    color: '#ff9f1c',
    points: [
      [59.9598, 30.314],
      [59.9647, 30.3362],
      [59.9668, 30.366],
      [59.9616, 30.3894],
      [59.9538, 30.4105],
      [59.9406, 30.4088],
      [59.9282, 30.405],
      [59.9208, 30.3826],
      [59.9138, 30.3535],
      [59.9204, 30.3337],
      [59.9288, 30.318],
      [59.9446, 30.3154],
    ] as RoutePoint[],
  },
  {
    id: 'vasileostrovskaya-zone',
    name: 'Василеостровская зона',
    color: '#1ed532',
    points: [
      [59.9488, 30.214],
      [59.9494, 30.2386],
      [59.948, 30.277],
      [59.9382, 30.2965],
      [59.9265, 30.3175],
      [59.9152, 30.3064],
      [59.9048, 30.292],
      [59.9075, 30.2638],
      [59.913, 30.235],
      [59.9219, 30.218],
      [59.9325, 30.207],
      [59.9414, 30.2098],
    ] as RoutePoint[],
  },
];

function readStoredCreatedGeozones() {
  try {
    const rawValue = window.localStorage.getItem(createdGeozonesStorageKey);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue as CreatedGeozone[] : [];
  } catch {
    return [];
  }
}

function readStoredBaseGeozones() {
  try {
    const rawValue = window.localStorage.getItem(baseGeozonesStorageKey);
    if (!rawValue) {
      return geozonePolygons;
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue as GeozoneMapItem[] : geozonePolygons;
  } catch {
    return geozonePolygons;
  }
}

const fallbackRoutePoints: RoutePoint[] = [
  [59.961459, 30.291013],
  [59.954981, 30.36533],
  [59.931659, 30.360508],
  [59.947091, 30.433803],
  [59.933392, 30.261282],
  [59.930198, 30.324467],
  [59.942361, 30.276588],
  [59.939289, 30.24364],
  [59.961695, 30.29052],
];

const rows = [
  ['08869064', '2026-05-09 07:06:22', 'Санкт-Петербург, ул. Профессора Попова, 5', '59.961459, 30.291013', 'Санкт-Петербург, Петровская наб., 8', '59.954981, 30.365330', '46 км'],
  ['08869065', '2026-05-09 07:06:22', 'Санкт-Петербург, Петровская наб., 8', '59.954981, 30.365330', 'Санкт-Петербург, Каменноостровский пр., 42', '59.931659, 30.360508', '46 км'],
  ['08869066', '2026-05-09 07:06:22', 'Санкт-Петербург, Каменноостровский пр., 42', '59.931659, 30.360508', 'Санкт-Петербург, пр. Большевиков, 18', '59.947091, 30.433803', '46 км'],
  ['08869067', '2026-05-09 07:06:22', 'Санкт-Петербург, пр. Большевиков, 18', '59.947091, 30.433803', 'Санкт-Петербург, Морская наб., 35', '59.933392, 30.261282', '46 км'],
  ['08869068', '2026-05-09 07:06:22', 'Санкт-Петербург, Морская наб., 35', '59.933392, 30.261282', 'Санкт-Петербург, Садовая ул., 54', '59.930198, 30.324467', '46 км'],
  ['08869069', '2026-05-09 07:06:22', 'Санкт-Петербург, Садовая ул., 54', '59.930198, 30.324467', 'Санкт-Петербург, Большой пр. П.С., 74', '59.942361, 30.276588', '46 км'],
  ['08869070', '2026-05-09 07:06:22', 'Санкт-Петербург, Большой пр. П.С., 74', '59.942361, 30.276588', 'Санкт-Петербург, Приморский пр., 4', '59.939289, 30.243640', '46 км'],
  ['08869071', '2026-05-09 07:06:22', 'Санкт-Петербург, Приморский пр., 4', '59.939289, 30.243640', 'Санкт-Петербург, ул. Профессора Попова, 5', '59.961695, 30.290520', '46 км'],
];

const timelineLabels = ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '15:00', '16:00'];
const timelineEdgeLabels = [timelineLabels[0], timelineLabels[timelineLabels.length - 1]];
const stopIdleDurations = [18, 24, 16, 29, 21, 15, 27, 19];
const totalTimelineMinutes = 390;
const timelineCycleDuration = 180000;
const timelineMinuteMs = timelineCycleDuration / totalTimelineMinutes;
const registryDayOffsets = [0, 2, 5];
const engineers = [
  'Александров Кирилл Николаевич',
  'Иванов Иван Иванович',
  'Петров Алексей Сергеевич',
];
const tableColumns = [
  { key: 'route', label: 'Маршрут', width: 92 },
  { key: 'request', label: 'Заявка', width: 96 },
  { key: 'closedAt', label: 'Время закр.', width: 136 },
  { key: 'from', label: 'Откуда', width: 260 },
  { key: 'to', label: 'Куда', width: 260 },
  { key: 'plannedDistance', label: 'Пробег расч.', width: 118 },
  { key: 'actualDistance', label: 'Пробег исп.', width: 108 },
  { key: 'transport', label: 'Транспорт', width: 112 },
  { key: 'tripType', label: 'Тип поездки', width: 118 },
  { key: 'confirmed', label: 'Подтв.', width: 126 },
];

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
      className: 'route-gradient-line',
    }).addTo(map);
  }
}

function drawGeozones(L: any, zones: GeozoneMapItem[], onSelect?: (zone: GeozoneMapItem, event: any) => void) {
  return L.layerGroup(zones.map((zone) => {
    const polygon = L.polygon(zone.points, {
      color: zone.color,
      fillColor: zone.color,
      fillOpacity: 0.22,
      interactive: Boolean(onSelect),
      opacity: 0.9,
      weight: 2,
      lineJoin: 'round',
      className: 'route-geozone-polygon',
    });

    if (onSelect) {
      polygon.on('click', (event: any) => {
        L.DomEvent.stop(event);
        onSelect(zone, event);
      });
    }

    return polygon;
  }));
}

function carSvg(rotation = 0) {
  return `
    <div class="route-car-body" style="width:65px;height:65px;position:relative;transform:rotate(${rotation}deg);transform-origin:center;will-change:transform;">
     <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_154_50690)">
          <g clip-path="url(#clip0_154_50690)">
            <rect x="28.332" y="57.3281" width="29.4023" height="44.1367" transform="rotate(-135 28.332 57.3281)" fill="black"/>
            <path d="M5.73177 48.5345L16.3393 59.142C19.151 61.9538 24.5572 61.1049 27.369 58.2932L58.7648 26.8973C61.5756 24.0865 61.5774 19.5274 58.7657 16.7156L48.1582 6.1081C45.3473 3.29723 40.7873 3.29633 37.9755 6.1081L6.57972 37.5039C3.76976 40.3175 2.92091 45.7236 5.73177 48.5345ZM14.3313 31.5367L24.854 21.014L27.6324 23.1591L23.297 27.4945L14.3313 31.5367ZM12.5424 35.9091C16.977 33.3075 22.2208 30.2341 22.2208 30.2341L34.6406 42.6539L28.9683 52.3349C28.9683 52.3349 18.2318 47.0434 12.5424 35.9091ZM37.6355 41.2647L41.6876 37.2126L43.8354 39.99L33.5933 50.2322L37.6355 41.2647ZM54.7343 29.0912L45.3897 38.4358L43.2365 35.6637L50.6299 28.2703L54.7343 29.0912ZM55.9855 25.0309L50.9754 26.0395L38.5529 13.617L39.5605 8.60595L55.9855 25.0309ZM36.2932 14.4983L29.192 21.5994L26.41 19.4579L35.4741 10.3939L36.2932 14.4983Z" fill="white"/>
          </g>
        </g>
        <g class="route-hazard-layer" pointer-events="none">
          <circle class="route-hazard-glow" cx="33" cy="8" r="10"/>
          <circle class="route-hazard" cx="33" cy="8" r="4"/>
          <circle class="route-hazard-glow" cx="56" cy="30" r="10"/>
          <circle class="route-hazard" cx="56" cy="30" r="4"/>
          <circle class="route-hazard-glow" cx="5" cy="43" r="10"/>
          <circle class="route-hazard" cx="5" cy="43" r="4"/>
          <circle class="route-hazard-glow" cx="22" cy="61" r="10"/>
          <circle class="route-hazard" cx="22" cy="61" r="4"/>
        </g>
        <defs>
          <filter id="filter0_d_154_50690" x="-3.57422" y="-3.19434" width="71.6406" height="71.6396" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_154_50690"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_154_50690" result="shape"/>
          </filter>
          <clipPath id="clip0_154_50690">
            <rect x="21.6406" y="64.4453" width="30" height="60" rx="8" transform="rotate(-135 21.6406 64.4453)" fill="white"/>
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

function copyText(value: string) {
  void navigator.clipboard?.writeText(value);
}

function sortIcon(isActive: boolean, direction: 'asc' | 'desc') {
  return (
    <span className="ml-auto mr-4 flex flex-col gap-0.5 opacity-100 transition-opacity">
      <span className={['h-0 w-0 border-x-[5px] border-b-[6px] border-x-transparent', isActive && direction === 'asc' ? 'border-b-[#3b82f6]' : 'border-b-black/35'].join(' ')} />
      <span className={['h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent', isActive && direction === 'desc' ? 'border-t-[#3b82f6]' : 'border-t-black/35'].join(' ')} />
    </span>
  );
}

function OverlayScrollArea({
  children,
  className = '',
  contentClassName = '',
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({ startY: 0, startScrollTop: 0 });
  const [metrics, setMetrics] = useState({ clientHeight: 0, scrollHeight: 0, scrollTop: 0 });

  function updateMetrics() {
    const element = contentRef.current;
    if (!element) {
      return;
    }

    setMetrics({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      scrollTop: element.scrollTop,
    });
  }

  useEffect(() => {
    const element = contentRef.current;
    if (!element) {
      return;
    }

    updateMetrics();
    const resizeObserver = new ResizeObserver(updateMetrics);
    resizeObserver.observe(element);
    if (element.firstElementChild) {
      resizeObserver.observe(element.firstElementChild);
    }
    element.addEventListener('scroll', updateMetrics, { passive: true });
    window.addEventListener('resize', updateMetrics);

    return () => {
      resizeObserver.disconnect();
      element.removeEventListener('scroll', updateMetrics);
      window.removeEventListener('resize', updateMetrics);
    };
  }, [children]);

  const canScroll = metrics.scrollHeight > metrics.clientHeight + 1;
  const thumbHeight = canScroll
    ? Math.max(30, (metrics.clientHeight / metrics.scrollHeight) * metrics.clientHeight)
    : 0;
  const thumbTop = canScroll
    ? (metrics.scrollTop / (metrics.scrollHeight - metrics.clientHeight)) * (metrics.clientHeight - thumbHeight)
    : 0;

  function startThumbDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const element = contentRef.current;
    if (!element) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      startY: event.clientY,
      startScrollTop: element.scrollTop,
    };
  }

  function moveThumb(event: ReactPointerEvent<HTMLDivElement>) {
    const element = contentRef.current;
    if (!element || event.buttons === 0 || !canScroll) {
      return;
    }

    const trackTravel = metrics.clientHeight - thumbHeight;
    const scrollTravel = metrics.scrollHeight - metrics.clientHeight;
    const nextScrollTop = dragRef.current.startScrollTop + ((event.clientY - dragRef.current.startY) / trackTravel) * scrollTravel;
    element.scrollTop = Math.min(Math.max(nextScrollTop, 0), scrollTravel);
  }

  return (
    <div className={['route-overlay-scroll-area relative overflow-hidden', className].join(' ')}>
      <div ref={contentRef} className={['route-overlay-scroll-content h-full overflow-auto', contentClassName].join(' ')}>
        {children}
      </div>
      {canScroll ? (
        <div className="route-overlay-scrollbar" aria-hidden="true">
          <div className="route-overlay-scrollbar-track" />
          <div
            className="route-overlay-scrollbar-thumb"
            style={{ height: `${thumbHeight}px`, transform: `translate3d(0, ${thumbTop}px, 0)` }}
            onPointerDown={startThumbDrag}
            onPointerMove={moveThumb}
          />
        </div>
      ) : null}
    </div>
  );
}

function MapLayerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M14.757 3H5.243C4.463 3 4.18 3.081 3.895 3.234C3.61341 3.38312 3.38312 3.61341 3.234 3.895C3.08 4.18 3 4.463 3 5.243V14.757C3 15.537 3.081 15.82 3.234 16.105C3.386 16.39 3.61 16.614 3.895 16.766C4.18 16.919 4.463 17 5.243 17H14.757C15.537 17 15.82 16.919 16.105 16.766C16.39 16.614 16.614 16.39 16.766 16.105C16.919 15.82 17 15.537 17 14.757V5.243C17 4.463 16.919 4.18 16.766 3.895C16.6169 3.61341 16.3866 3.38312 16.105 3.234C15.82 3.08 15.537 3 14.757 3ZM4.75 14.757V5.243C4.75 5.016 4.758 4.863 4.77 4.77C4.863 4.758 5.016 4.75 5.243 4.75H14.757C14.984 4.75 15.137 4.758 15.23 4.77C15.242 4.863 15.25 5.016 15.25 5.243V14.757C15.25 14.984 15.242 15.137 15.23 15.23C15.137 15.242 14.984 15.25 14.757 15.25H5.243C5.016 15.25 4.863 15.242 4.77 15.23C4.75437 15.0728 4.74769 14.9149 4.75 14.757Z" fill="#4D4D4D" />
      <path opacity="0.9" fillRule="evenodd" clipRule="evenodd" d="M9.243 7H18.757C19.537 7 19.82 7.081 20.105 7.234C20.39 7.386 20.614 7.61 20.766 7.895C20.919 8.18 21 8.463 21 9.243V18.757C21 19.537 20.919 19.82 20.766 20.105C20.6168 20.3866 20.3866 20.6168 20.105 20.766C19.82 20.919 19.537 21 18.757 21H9.243C8.463 21 8.18 20.919 7.895 20.766C7.61341 20.6169 7.38312 20.3866 7.234 20.105C7.08 19.82 7 19.537 7 18.757V9.243C7 8.463 7.081 8.18 7.234 7.895C7.38312 7.61341 7.61341 7.38312 7.895 7.234C8.18 7.08 8.463 7 9.243 7Z" fill="#CCCCCC" />
    </svg>
  );
}

function MapRulerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.55985 14.3628L14.3629 3.55983C14.721 3.20199 15.2066 3.00098 15.7129 3.00098C16.2191 3.00098 16.7047 3.20199 17.0629 3.55983L20.4399 6.93583C20.7977 7.29398 20.9987 7.77955 20.9987 8.28583C20.9987 8.79211 20.7977 9.27768 20.4399 9.63583L9.63585 20.4418C9.2777 20.7997 8.79213 21.0007 8.28585 21.0007C7.77957 21.0007 7.294 20.7997 6.93585 20.4418L3.55885 17.0648C3.20101 16.7067 3 16.2211 3 15.7148C3 15.2085 3.20101 14.723 3.55885 14.3648L3.55985 14.3628ZM7.67985 13.6198L8.96185 12.3378L10.7849 14.1618C10.8559 14.2327 10.9402 14.289 11.033 14.3273C11.1258 14.3656 11.2252 14.3853 11.3256 14.3852C11.4259 14.3851 11.5253 14.3653 11.618 14.3268C11.7107 14.2883 11.7949 14.2319 11.8659 14.1608C11.9368 14.0898 11.993 14.0055 12.0313 13.9127C12.0696 13.8199 12.0893 13.7205 12.0892 13.6201C12.0891 13.5197 12.0693 13.4204 12.0308 13.3277C11.9923 13.235 11.9359 13.1507 11.8649 13.0798L10.0409 11.2578L11.2569 10.0428L12.4049 11.1878C12.5103 11.2996 12.6471 11.377 12.7972 11.4098C12.9474 11.4425 13.104 11.4292 13.2464 11.3715C13.3889 11.3138 13.5106 11.2144 13.5956 11.0863C13.6806 10.9583 13.725 10.8075 13.7229 10.6538C13.7217 10.5518 13.7001 10.451 13.6594 10.3574C13.6187 10.2638 13.5597 10.1793 13.4859 10.1088L12.3379 8.96183L13.6199 7.67883L15.4439 9.50283C15.5873 9.64605 15.7818 9.7264 15.9846 9.72621C16.1873 9.72602 16.3816 9.64531 16.5249 9.50183C16.6681 9.35835 16.7484 9.16385 16.7482 8.96112C16.748 8.7584 16.6673 8.56405 16.5239 8.42083L14.6989 6.59683L15.7129 5.58483C15.76 5.54109 15.7978 5.48829 15.8241 5.42959C15.8504 5.37088 15.8645 5.30748 15.8657 5.24318C15.8669 5.17888 15.8551 5.11501 15.831 5.05538C15.8069 4.99575 15.771 4.94159 15.7255 4.89615C15.68 4.85071 15.6258 4.81492 15.5661 4.79093C15.5065 4.76693 15.4426 4.75522 15.3783 4.7565C15.314 4.75777 15.2506 4.77201 15.1919 4.79836C15.1333 4.8247 15.0805 4.86262 15.0369 4.90983L4.90985 15.0378C4.8282 15.1289 4.78454 15.2477 4.78785 15.37C4.79117 15.4922 4.84121 15.6085 4.92768 15.695C5.01415 15.7815 5.13047 15.8315 5.25271 15.8348C5.37496 15.8381 5.49382 15.7945 5.58485 15.7128L6.59685 14.7008L7.74685 15.8468C7.81654 15.9227 7.90087 15.9837 7.99475 16.0262C8.08863 16.0687 8.19013 16.0917 8.29315 16.0939C8.39617 16.0961 8.49856 16.0775 8.59419 16.0391C8.68981 16.0007 8.77668 15.9434 8.84958 15.8706C8.92247 15.7978 8.97988 15.7109 9.01835 15.6153C9.05682 15.5198 9.07556 15.4174 9.07344 15.3144C9.07131 15.2113 9.04837 15.1098 9.006 15.0159C8.96362 14.922 8.90268 14.8376 8.82685 14.7678L7.67885 13.6198H7.67985Z" fill="#4D4D4D" />
    </svg>
  );
}

function MapPlusIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M11 5.992C11 5.455 11.448 5 12 5C12.556 5 13 5.444 13 5.992V11H18.008C18.545 11 19 11.448 19 12C19 12.556 18.556 13 18.008 13H13V18.008C13 18.545 12.552 19 12 19C11.444 19 11 18.556 11 18.008V13H5.992C5.455 13 5 12.552 5 12C5 11.444 5.444 11 5.992 11H11V5.992Z" fill="#4D4D4D" /></svg>;
}

function MapMinusIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M5 12C5 11.7348 5.10536 11.4804 5.29289 11.2929C5.48043 11.1054 5.73478 11 6 11H18C18.2652 11 18.5196 11.1054 18.7071 11.2929C18.8946 11.4804 19 11.7348 19 12C19 12.2652 18.8946 12.5196 18.7071 12.7071C18.5196 12.8946 18.2652 13 18 13H6C5.73478 13 5.48043 12.8946 5.29289 12.7071C5.10536 12.5196 5 12.2652 5 12Z" fill="#4D4D4D" /></svg>;
}

function MapLocationIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M3.73634 11.0681L19.7463 3.45409C19.8583 3.40061 19.9841 3.38317 20.1064 3.40415C20.2287 3.42513 20.3415 3.48351 20.4292 3.57124C20.5169 3.65898 20.5753 3.77176 20.5963 3.89405C20.6173 4.01634 20.5998 4.14212 20.5463 4.25409L12.9303 20.2631C12.8788 20.3708 12.7962 20.4607 12.6933 20.5213C12.5903 20.5818 12.4717 20.6103 12.3524 20.603C12.2332 20.5957 12.1189 20.5529 12.0241 20.4803C11.9293 20.4076 11.8584 20.3083 11.8203 20.1951L9.81534 14.1831L3.80534 12.1801C3.69177 12.1424 3.59208 12.0715 3.51907 11.9767C3.44607 11.8818 3.4031 11.7673 3.39569 11.6479C3.38827 11.5284 3.41674 11.4095 3.47744 11.3064C3.53815 11.2032 3.62831 11.1196 3.73634 11.0681Z" fill="#4D4D4D" /></svg>;
}

function terminalMarkerHtml(type: 'start' | 'end', time: string, withStem = true) {
  const icon =
    type === 'start'
      ? `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 13s4.5-4 4.5-7.2A4.5 4.5 0 0 0 2.5 5.8C2.5 9 7 13 7 13Z" fill="#ff6b57"/><circle cx="7" cy="5.8" r="1.5" fill="white"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><g clip-path="url(#clip0_flags_terminal)"><path d="M7.26218 10.7705L6.64003 12.2524L6.4291 12.7554C6.36163 12.9175 6.43642 13.1025 6.59756 13.1711C6.6372 13.1883 6.67966 13.1966 6.72048 13.1966C6.8434 13.1966 6.96066 13.1242 7.01068 13.0022L7.60499 11.5875L7.43418 11.1806L7.26218 10.7705Z" fill="#333333"/><path d="M15.7123 5.68284C14.0435 6.05372 12.7516 3.60639 11.2225 2.93635C11.1673 2.91087 11.1095 2.90379 11.0514 2.91039C11.021 2.875 10.9835 2.84764 10.9391 2.82829C10.7782 2.75963 10.5928 2.83607 10.5253 2.99792L7.99988 9.01397L5.47422 2.99792C5.40698 2.83607 5.22153 2.75963 5.06063 2.82829C5.01651 2.84764 4.97852 2.875 4.94785 2.91039C4.89005 2.90379 4.83201 2.91087 4.77704 2.93635C3.24772 3.60639 1.95599 6.05372 0.287478 5.68284C0.0392774 5.6248 -0.0723187 5.78547 0.0496584 6.12686C0.482123 7.31643 0.903262 8.41729 1.31496 9.45162C1.43057 9.74701 1.71511 9.94496 1.94231 9.83997C3.24796 9.26948 4.38044 7.40349 5.72053 7.09961C5.95151 7.04629 6.18815 7.03992 6.43352 7.09418C6.44909 7.09796 6.46396 7.10032 6.47764 7.10244C6.49038 7.10457 6.50218 7.10457 6.5135 7.10457L7.65683 9.82982L7.64008 9.87135L7.81207 10.2795L7.98383 10.6877L8.00058 10.6461L8.98891 13.0017C9.03939 13.1234 9.15665 13.1961 9.27934 13.1961C9.32016 13.1961 9.36262 13.1878 9.40226 13.1706C9.5634 13.1017 9.63819 12.917 9.57095 12.7549L8.34316 9.83029V9.82935L9.48649 7.10409C9.51173 7.10409 9.53792 7.10079 9.5667 7.09371C11.2352 6.72259 12.5281 9.16992 14.0577 9.8395C14.2837 9.94425 14.5692 9.7463 14.686 9.45115C15.0974 8.41659 15.5174 7.31596 15.9503 6.12639C16.0728 5.78547 15.9607 5.6248 15.7123 5.68284Z" fill="#333333"/></g><defs><clipPath id="clip0_flags_terminal"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>`;

  return `
    <div class="route-terminal-marker route-terminal-marker-${type}">
      <div class="route-terminal-card">
        ${icon}
        <span>${time}</span>
      </div>
      ${withStem ? '<span class="route-terminal-stem"></span><span class="route-terminal-dot"></span>' : ''}
    </div>
  `;
}

function terminalTimelineIconHtml(type: 'start' | 'end') {
  const icon =
    type === 'start'
      ? `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 13s4.5-4 4.5-7.2A4.5 4.5 0 0 0 2.5 5.8C2.5 9 7 13 7 13Z" fill="#ff6b57"/><circle cx="7" cy="5.8" r="1.5" fill="white"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><g clip-path="url(#clip0_flags_timeline)"><path d="M7.26218 10.7705L6.64003 12.2524L6.4291 12.7554C6.36163 12.9175 6.43642 13.1025 6.59756 13.1711C6.6372 13.1883 6.67966 13.1966 6.72048 13.1966C6.8434 13.1966 6.96066 13.1242 7.01068 13.0022L7.60499 11.5875L7.43418 11.1806L7.26218 10.7705Z" fill="#333333"/><path d="M15.7123 5.68284C14.0435 6.05372 12.7516 3.60639 11.2225 2.93635C11.1673 2.91087 11.1095 2.90379 11.0514 2.91039C11.021 2.875 10.9835 2.84764 10.9391 2.82829C10.7782 2.75963 10.5928 2.83607 10.5253 2.99792L7.99988 9.01397L5.47422 2.99792C5.40698 2.83607 5.22153 2.75963 5.06063 2.82829C5.01651 2.84764 4.97852 2.875 4.94785 2.91039C4.89005 2.90379 4.83201 2.91087 4.77704 2.93635C3.24772 3.60639 1.95599 6.05372 0.287478 5.68284C0.0392774 5.6248 -0.0723187 5.78547 0.0496584 6.12686C0.482123 7.31643 0.903262 8.41729 1.31496 9.45162C1.43057 9.74701 1.71511 9.94496 1.94231 9.83997C3.24796 9.26948 4.38044 7.40349 5.72053 7.09961C5.95151 7.04629 6.18815 7.03992 6.43352 7.09418C6.44909 7.09796 6.46396 7.10032 6.47764 7.10244C6.49038 7.10457 6.50218 7.10457 6.5135 7.10457L7.65683 9.82982L7.64008 9.87135L7.81207 10.2795L7.98383 10.6877L8.00058 10.6461L8.98891 13.0017C9.03939 13.1234 9.15665 13.1961 9.27934 13.1961C9.32016 13.1961 9.36262 13.1878 9.40226 13.1706C9.5634 13.1017 9.63819 12.917 9.57095 12.7549L8.34316 9.83029V9.82935L9.48649 7.10409C9.51173 7.10409 9.53792 7.10079 9.5667 7.09371C11.2352 6.72259 12.5281 9.16992 14.0577 9.8395C14.2837 9.94425 14.5692 9.7463 14.686 9.45115C15.0974 8.41659 15.5174 7.31596 15.9503 6.12639C16.0728 5.78547 15.9607 5.6248 15.7123 5.68284Z" fill="#333333"/></g><defs><clipPath id="clip0_flags_timeline"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>`;

  return `<span class="route-timeline-terminal-icon">${icon}</span>`;
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
  const progresses = routeWaypoints.slice(1, -1).map((stop) => {
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

function addMinutes(startMinutes: number, minutesToAdd: number, dayOffset = 0) {
  const minutes = startMinutes + minutesToAdd;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `2026-05-${String(9 + dayOffset).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`;
}

function formatRouteDate(dayOffset: number) {
  return `2026-05-${String(9 + dayOffset).padStart(2, '0')}`;
}

function getDayOffsetFromDate(date: string) {
  if (!date) {
    return 0;
  }

  const day = Number(date.split('-')[2]);
  return Number.isFinite(day) ? Math.max(day - 9, 0) : 0;
}

function formatKm(value: number) {
  return `${value.toFixed(1)} км`;
}

export default function RoutesPrototypePage() {
  const [isTableHidden, setIsTableHidden] = useState(true);
  const [activeTab, setActiveTab] = useState<'requests' | 'routes' | 'zones' | 'settings'>('routes');
  const [routeViewMode, setRouteViewMode] = useState<'map' | 'registry'>('map');
  const [selectedEngineer, setSelectedEngineer] = useState('');
  const [engineerQuery, setEngineerQuery] = useState('');
  const [isEngineerPickerOpen, setIsEngineerPickerOpen] = useState(false);
  const [selectedRouteDate, setSelectedRouteDate] = useState('');
  const [selectedRouteDayOffset, setSelectedRouteDayOffset] = useState(0);
  const [isRouteDatePickerOpen, setIsRouteDatePickerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [timelineStops, setTimelineStops] = useState<TimelineStop[]>([]);
  const [sortState, setSortState] = useState<SortState>(null);
  const [columnWidths, setColumnWidths] = useState(() => tableColumns.map((column) => column.width));
  const [fixedColumns, setFixedColumns] = useState(() => tableColumns.map(() => false));
  const [isCreatingGeozone, setIsCreatingGeozone] = useState(false);
  const [geozoneCreationStep, setGeozoneCreationStep] = useState<GeozoneCreationStep>('address');
  const [geozoneName, setGeozoneName] = useState('Приморский район');
  const [geozoneAddress, setGeozoneAddress] = useState('');
  const [geozoneBank, setGeozoneBank] = useState('55');
  const [geozoneGroup, setGeozoneGroup] = useState('Макетск');
  const [geozoneCategory, setGeozoneCategory] = useState('УС');
  const [geozoneStatus, setGeozoneStatus] = useState('Активна');
  const [geozoneColor, setGeozoneColor] = useState('#ff00d6');
  const [geozoneDraftPoints, setGeozoneDraftPoints] = useState<RoutePoint[]>([]);
  const [geozonePointMenu, setGeozonePointMenu] = useState<GeozonePointMenu>(null);
  const [geozoneInfoCard, setGeozoneInfoCard] = useState<GeozoneInfoCard>(null);
  const [editingGeozoneId, setEditingGeozoneId] = useState<string | null>(null);
  const [baseGeozones, setBaseGeozones] = useState<GeozoneMapItem[]>(readStoredBaseGeozones);
  const [createdGeozones, setCreatedGeozones] = useState<CreatedGeozone[]>(readStoredCreatedGeozones);
  const [selectedGeozoneIds, setSelectedGeozoneIds] = useState<Set<string>>(
    () => new Set([...readStoredBaseGeozones().map((zone) => zone.id), ...readStoredCreatedGeozones().map((zone) => zone.id)]),
  );
  const [geozoneSearch, setGeozoneSearch] = useState('');
  const [isGeozoneFiltersOpen, setIsGeozoneFiltersOpen] = useState(false);
  const [areGeozoneFiltersApplied, setAreGeozoneFiltersApplied] = useState(false);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const leafletLibRef = useRef<any>(null);
  const geozoneDraftLayerRef = useRef<any>(null);
  const geozoneDraftMarkerLayerRef = useRef<any>(null);
  const geozoneDraftPointsRef = useRef<RoutePoint[]>([]);
  const geozoneMidpointMarkersRef = useRef<any[]>([]);
  const geozoneDraggedMidpointRef = useRef<RoutePoint | null>(null);
  const createdGeozoneLayerRef = useRef<any>(null);
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
  const isRouteReady = Boolean(selectedEngineer && selectedRouteDate);
  geozoneDraftPointsRef.current = geozoneDraftPoints;
  const tableGridTemplate = columnWidths
    .map((width, index) => {
      const column = tableColumns[index];
      if (fixedColumns[index] || (column.key !== 'from' && column.key !== 'to')) {
        return `${width}px`;
      }
      return `minmax(${width}px, 1fr)`;
    })
    .join(' ');

  const tabItems = useMemo(
    () => [
      ['requests', 'Заявки'],
      ['routes', 'Маршруты'],
      ['zones', 'Геозоны'],
      ['settings', 'Настройки'],
    ] as const,
    [],
  );
  const availableRouteDates = useMemo(
    () =>
      registryDayOffsets.map((dayOffset) => ({
        date: formatRouteDate(dayOffset),
        day: 9 + dayOffset,
        dayOffset,
      })),
    [],
  );
  const availableRouteDateSet = useMemo(
    () => new Set(availableRouteDates.map((item) => item.date)),
    [availableRouteDates],
  );
  const filteredEngineers = useMemo(() => {
    const query = engineerQuery.trim().toLowerCase();
    if (!query) {
      return engineers;
    }

    return engineers.filter((engineer) => engineer.toLowerCase().includes(query));
  }, [engineerQuery]);

  const tableRows = useMemo(() => {
    const startMinutes = 9 * 60 + 30;
    const driveMinutes = Math.round((totalTimelineMinutes - stopIdleDurations.reduce((sum, value) => sum + value, 0)) / rows.length);
    const dayOffsets = routeViewMode === 'registry' ? registryDayOffsets : [selectedRouteDayOffset];

    const items = dayOffsets.flatMap((dayOffset, dayIndex) => {
      let elapsed = 0;

      return rows.map((row, index) => {
        const requestDayIndex = Math.max(registryDayOffsets.indexOf(dayOffset), 0);
        elapsed += driveMinutes + stopIdleDurations[index % stopIdleDurations.length] + requestDayIndex * 2;
        const from = routeWaypoints[index];
        const to = routeWaypoints[index + 1];
        const plannedDistanceValue = getDistance(from, to) / 1000;
        const actualDistanceValue = plannedDistanceValue * (index % 3 === 0 ? 1.04 : index % 3 === 1 ? 0.97 : 1.02) + dayIndex * 0.12;

        return {
          route: index + 1,
          dayOffset,
          request: String(Number(row[0]) + requestDayIndex * 12).padStart(8, '0'),
          closedAt: addMinutes(startMinutes, elapsed, dayOffset),
          fromAddress: row[2],
          fromCoords: row[3],
          toAddress: row[4],
          toCoords: row[5],
          plannedDistance: formatKm(plannedDistanceValue),
          plannedDistanceValue,
          actualDistance: formatKm(actualDistanceValue),
          actualDistanceValue,
          transport: 'Личный',
          tripType: 'Поездка',
          confirmed: 'Подтв. авто',
        };
      });
    });

    return [...items].sort((a, b) => {
      if (!sortState) {
        return a.dayOffset - b.dayOffset || a.route - b.route;
      }
      const first = sortState.key === 'from' ? a.fromAddress : sortState.key === 'to' ? a.toAddress : a[sortState.key as keyof typeof a];
      const second = sortState.key === 'from' ? b.fromAddress : sortState.key === 'to' ? b.toAddress : b[sortState.key as keyof typeof b];
      const result = String(first).localeCompare(String(second), 'ru', { numeric: true });
      return sortState.direction === 'asc' ? result : -result;
    });
  }, [routeViewMode, selectedRouteDayOffset, sortState]);

  const totalPlannedDistance = useMemo(
    () => tableRows.reduce((sum, row) => sum + row.plannedDistanceValue, 0),
    [tableRows],
  );
  const totalActualDistance = useMemo(
    () => tableRows.reduce((sum, row) => sum + row.actualDistanceValue, 0),
    [tableRows],
  );
  const allGeozones = useMemo<GeozoneMapItem[]>(
    () => [...baseGeozones, ...createdGeozones],
    [baseGeozones, createdGeozones],
  );
  const visibleGeozones = useMemo(
    () => allGeozones.filter((zone) => {
      if (isCreatingGeozone && editingGeozoneId && zone.id === editingGeozoneId) {
        return false;
      }

      return selectedGeozoneIds.has(zone.id);
    }),
    [allGeozones, editingGeozoneId, isCreatingGeozone, selectedGeozoneIds],
  );
  const visibleGeozoneTreeItems = useMemo(() => {
    const query = geozoneSearch.trim().toLowerCase();
    if (!query) {
      return allGeozones;
    }

    return allGeozones.filter((zone) => zone.name.toLowerCase().includes(query));
  }, [allGeozones, geozoneSearch]);
  const allGeozoneIds = useMemo(() => allGeozones.map((zone) => zone.id), [allGeozones]);
  const visibleGeozoneTreeIds = useMemo(() => visibleGeozoneTreeItems.map((zone) => zone.id), [visibleGeozoneTreeItems]);
  const visibleTreeChecked = visibleGeozoneTreeIds.length > 0 && visibleGeozoneTreeIds.every((id) => selectedGeozoneIds.has(id));
  const visibleTreeMixed = !visibleTreeChecked && visibleGeozoneTreeIds.some((id) => selectedGeozoneIds.has(id));
  const selectedGeozoneInfo = geozoneInfoCard ? allGeozones.find((zone) => zone.id === geozoneInfoCard.id) : null;

  useEffect(() => {
    window.localStorage.setItem(baseGeozonesStorageKey, JSON.stringify(baseGeozones));
  }, [baseGeozones]);

  useEffect(() => {
    window.localStorage.setItem(createdGeozonesStorageKey, JSON.stringify(createdGeozones));
  }, [createdGeozones]);

  function selectRouteDate(nextDate: string, dayOffset: number) {
    setSelectedRouteDate(nextDate);
    setSelectedRouteDayOffset(dayOffset);
    setSelectedRow(null);
    setTimelineProgress(0);
    scrubProgressRef.current = 0;
    playbackStartedAtRef.current = performance.now();
    setIsRouteDatePickerOpen(false);
  }

  function selectEngineer(engineer: string) {
    setSelectedEngineer(engineer);
    setEngineerQuery(engineer);
    setIsEngineerPickerOpen(false);
  }

  function startGeozoneCreation() {
    setActiveTab('zones');
    setRouteViewMode('map');
    setIsTableHidden(true);
    setIsCreatingGeozone(true);
    setEditingGeozoneId(null);
    setGeozoneInfoCard(null);
    setGeozoneCreationStep('drawing');
    setGeozoneName('Приморский район');
    setGeozoneAddress('Макетск, ТБ 55');
    setGeozoneBank('55');
    setGeozoneGroup('Макетск');
    setGeozoneCategory('УС');
    setGeozoneStatus('Активна');
    setGeozoneColor('#ff00d6');
    geozoneDraftPointsRef.current = [];
    setGeozoneDraftPoints([]);
    setGeozonePointMenu(null);
  }

  function cancelGeozoneCreation() {
    setIsCreatingGeozone(false);
    setEditingGeozoneId(null);
    setGeozoneCreationStep('address');
    geozoneDraftPointsRef.current = [];
    setGeozoneDraftPoints([]);
    setGeozonePointMenu(null);
  }

  function saveGeozone() {
    const draftPoints = geozoneDraftPointsRef.current;
    if (draftPoints.length < 3) {
      return;
    }

    if (editingGeozoneId) {
      const nextZone = {
        id: editingGeozoneId,
        name: geozoneName.trim() || 'Геозона',
        address: geozoneAddress.trim() || `${geozoneGroup}, ТБ ${geozoneBank}`,
        color: geozoneColor,
        points: draftPoints.map((point) => [...point] as RoutePoint),
      };

      setBaseGeozones((current) => current.map((zone) => (zone.id === editingGeozoneId ? nextZone : zone)));
      setCreatedGeozones((current) => current.map((zone) => (zone.id === editingGeozoneId ? nextZone : zone)));
      setEditingGeozoneId(null);
      geozoneDraftPointsRef.current = [];
      setGeozoneDraftPoints([]);
      setGeozoneInfoCard(null);
      setIsCreatingGeozone(false);
      setGeozoneCreationStep('address');
      return;
    }

    const newGeozoneId = `created-geozone-${Date.now()}`;
    setCreatedGeozones((current) => [
      {
        id: newGeozoneId,
        name: geozoneName.trim() || 'Новая геозона',
        address: geozoneAddress.trim() || `${geozoneGroup}, ТБ ${geozoneBank}`,
        color: geozoneColor,
        points: draftPoints.map((point) => [...point] as RoutePoint),
      },
      ...current,
    ]);
    setGeozoneIdsSelected([newGeozoneId], true);
    geozoneDraftPointsRef.current = [];
    setGeozoneDraftPoints([]);
    setGeozonePointMenu(null);
    setGeozoneCreationStep('saved');
    window.setTimeout(() => {
      setIsCreatingGeozone(false);
      setGeozoneCreationStep('address');
    }, 900);
  }

  function clearDraftGeozoneLayer() {
    const map = leafletMapRef.current;
    if (!map) {
      return;
    }

    if (geozoneDraftLayerRef.current) {
      map.removeLayer(geozoneDraftLayerRef.current);
      geozoneDraftLayerRef.current = null;
    }
    if (geozoneDraftMarkerLayerRef.current) {
      map.removeLayer(geozoneDraftMarkerLayerRef.current);
      geozoneDraftMarkerLayerRef.current = null;
    }
    geozoneMidpointMarkersRef.current = [];
  }

  function updateDraftPoint(index: number, point: RoutePoint) {
    const nextPoints = getDraftPointsWithUpdatedPoint(geozoneDraftPointsRef.current, index, point);
    geozoneDraftPointsRef.current = nextPoints;
    setGeozoneDraftPoints(nextPoints);
  }

  function getDraftPointsWithUpdatedPoint(points: RoutePoint[], index: number, point: RoutePoint) {
    return points.map((draftPoint, draftIndex) => (draftIndex === index ? point : draftPoint));
  }

  function updatePreviewMidpoints(points: RoutePoint[]) {
    geozoneMidpointMarkersRef.current.forEach((marker, index) => {
      const point = points[index];
      const nextPoint = points[index + 1] ?? (points.length >= 3 ? points[0] : null);
      if (!point || !nextPoint) {
        return;
      }

      marker.setLatLng([
        (point[0] + nextPoint[0]) / 2,
        (point[1] + nextPoint[1]) / 2,
      ]);
    });
  }

  function previewUpdatedDraftPoint(index: number, point: RoutePoint) {
    const layer = geozoneDraftLayerRef.current;
    if (!layer) {
      return;
    }

    const previewPoints = getDraftPointsWithUpdatedPoint(geozoneDraftPointsRef.current, index, point);
    layer.setLatLngs(previewPoints);
    updatePreviewMidpoints(previewPoints);
  }

  function insertDraftPoint(afterIndex: number, point: RoutePoint) {
    const nextPoints = getDraftPointsWithInsertedPoint(geozoneDraftPointsRef.current, afterIndex, point);
    geozoneDraftPointsRef.current = nextPoints;
    setGeozoneDraftPoints(nextPoints);
    setGeozonePointMenu(null);
  }

  function getDraftPointsWithInsertedPoint(points: RoutePoint[], afterIndex: number, point: RoutePoint) {
    return [
      ...points.slice(0, afterIndex + 1),
      point,
      ...points.slice(afterIndex + 1),
    ];
  }

  function previewInsertedDraftPoint(afterIndex: number, point: RoutePoint) {
    const layer = geozoneDraftLayerRef.current;
    if (!layer) {
      return;
    }

    const previewPoints = getDraftPointsWithInsertedPoint(geozoneDraftPointsRef.current, afterIndex, point);
    layer.setLatLngs(previewPoints);
  }

  function deleteDraftPoint(index: number) {
    const nextPoints = geozoneDraftPointsRef.current.filter((_, draftIndex) => draftIndex !== index);
    geozoneDraftPointsRef.current = nextPoints;
    setGeozoneDraftPoints(nextPoints);
    setGeozonePointMenu(null);
  }

  function clearDraftGeozone() {
    geozoneDraftPointsRef.current = [];
    setGeozoneDraftPoints([]);
    setGeozonePointMenu(null);
  }

  function deleteCurrentGeozone() {
    cancelGeozoneCreation();
  }

  function openGeozoneDetails() {
    if (geozoneDraftPointsRef.current.length < 3) {
      return;
    }

    setGeozonePointMenu(null);
    setGeozoneCreationStep('address');
  }

  function openGeozoneInfo(zone: GeozoneMapItem, event: any) {
    setGeozoneInfoCard({
      id: zone.id,
      x: event.originalEvent?.clientX ?? 0,
      y: event.originalEvent?.clientY ?? 0,
    });
  }

  function editGeozone(zone: GeozoneMapItem) {
    setEditingGeozoneId(zone.id);
    setGeozoneName(zone.name);
    setGeozoneAddress('address' in zone ? String(zone.address ?? '') : '');
    setGeozoneColor(zone.color);
    geozoneDraftPointsRef.current = zone.points.map((point) => [...point] as RoutePoint);
    setGeozoneDraftPoints(geozoneDraftPointsRef.current);
    setGeozoneInfoCard(null);
    setIsCreatingGeozone(true);
    setGeozoneCreationStep('address');
  }

  function editGeozoneShape(zone: GeozoneMapItem) {
    setEditingGeozoneId(zone.id);
    setGeozoneName(zone.name);
    setGeozoneAddress('address' in zone ? String(zone.address ?? '') : '');
    setGeozoneColor(zone.color);
    geozoneDraftPointsRef.current = zone.points.map((point) => [...point] as RoutePoint);
    setGeozoneDraftPoints(geozoneDraftPointsRef.current);
    setGeozoneInfoCard(null);
    setIsCreatingGeozone(true);
    setGeozoneCreationStep('drawing');
  }

  function duplicateGeozone(zone: GeozoneMapItem) {
    const duplicatedGeozoneId = `created-geozone-${Date.now()}`;
    setCreatedGeozones((current) => [
      {
        id: duplicatedGeozoneId,
        name: `${zone.name} копия`,
        address: 'address' in zone ? String(zone.address ?? '') : `${geozoneGroup}, ТБ ${geozoneBank}`,
        color: zone.color,
        points: zone.points.map((point) => [...point] as RoutePoint),
      },
      ...current,
    ]);
    setGeozoneIdsSelected([duplicatedGeozoneId], true);
    setGeozoneInfoCard(null);
  }

  function setGeozoneIdsSelected(ids: string[], selected: boolean) {
    setSelectedGeozoneIds((current) => {
      const next = new Set(current);
      ids.forEach((id) => {
        if (selected) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });
      return next;
    });
  }

  function toggleGeozone(id: string) {
    setSelectedGeozoneIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const renderGeozoneTreeItem = (
    label: string,
    options: { level?: number; checked?: boolean; mixed?: boolean; color?: string; expanded?: boolean; onToggle?: () => void } = {},
  ) => {
    const isIndeterminate = Boolean(options.mixed);
    const isChecked = Boolean(options.checked) && !isIndeterminate;
    const isActive = isChecked || isIndeterminate;

    return (
      <button
        aria-checked={isIndeterminate ? 'mixed' : isChecked}
        className="flex h-8 w-full items-center rounded px-1 text-left text-sm leading-[22px] text-black/85 hover:bg-black/[0.03]"
        role="checkbox"
        style={{ paddingLeft: `${4 + (options.level ?? 0) * 24}px` }}
        type="button"
        onClick={options.onToggle}
      >
        {(options.expanded ?? false) ? (
          <span className="mr-1 grid size-5 place-items-center text-black/45">⌄</span>
        ) : (
          <span className="mr-1 size-5" />
        )}
        <span
          className={[
            'mr-2 grid size-6 shrink-0 place-items-center rounded border transition-colors',
            isActive ? 'border-[#1E88FF] bg-[#1E88FF]' : 'border-[#d9d9d9] bg-white',
          ].join(' ')}
        >
          {isIndeterminate ? (
            <span className="h-0.5 w-3.5 rounded-full bg-white" />
          ) : isChecked ? (
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none" aria-hidden="true">
              <path d="M1.5 5.45 5.45 9.25 13.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : null}
        </span>
        {options.color ? <span className="mr-2 size-3 rounded-full" style={{ backgroundColor: options.color }} /> : null}
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {(options.level ?? 0) < 2 ? <span className="ml-2 text-[#1677ff]">✎</span> : null}
      </button>
    );
  };

  const renderGeozoneCreationOverlay = () => {
    if (!isCreatingGeozone) {
      return null;
    }

    const renderGeozoneField = (
      label: string,
      control: ReactNode,
    ) => (
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium leading-5 text-black/65">{label}</span>
        {control}
      </label>
    );

    const inputClassName = 'h-10 w-full rounded-md border border-[#d9d9d9] bg-white px-3 text-sm text-black/85 outline-none transition-colors placeholder:text-black/35 focus:border-[#1677ff]';
    const colorOptions = ['#ff00d6', '#1E88FF', '#22c55e', '#ff9f1c'];

    return (
      <>
        {geozoneCreationStep === 'drawing' ? (
          <section data-block="geozone-drawing-banner" className="absolute left-1/2 top-0 z-[760] flex h-[60px] w-[648px] max-w-[calc(100vw-32px)] -translate-x-1/2 items-center justify-between gap-4 rounded-b-md bg-black/65 px-4 py-1.5 text-white shadow-[0_8px_22px_rgba(0,0,0,0.18)]">
            <p className="min-w-0 text-sm leading-5">
              Выберите точку на карте, где должна начинаться граница геозоны.
              <br />
              Вы можете включить или выключить отображение геозон в списке слева.
            </p>
            <button
              className="h-8 shrink-0 rounded-md bg-white/12 px-4 text-sm font-medium text-white transition-colors hover:bg-white/20"
              type="button"
              onClick={cancelGeozoneCreation}
            >
              Отмена
            </button>
          </section>
        ) : null}
        {geozoneCreationStep === 'address' ? (
          <div data-block="geozone-modal-overlay" className="absolute inset-0 z-[850] flex items-center justify-center bg-black/50 px-4">
            <section data-block="geozone-modal" className="max-h-[calc(100vh-32px)] w-[540px] max-w-full overflow-auto rounded-2xl bg-white shadow-[0_24px_72px_rgba(0,0,0,0.28)]">
              <div className="flex min-h-[64px] items-center gap-3 border-b border-black/10 px-6 py-4">
                <h2 className="min-w-0 flex-1 text-xl font-medium leading-7 text-black/85">{editingGeozoneId ? 'Редактирование геозоны' : 'Новая геозона'}</h2>
                <button
                  className="h-9 rounded-md px-4 text-sm font-medium text-black/65 transition-colors hover:bg-black/[0.04] hover:text-black/85"
                  type="button"
                  onClick={cancelGeozoneCreation}
                >
                  Отмена
                </button>
                <button
                  className="h-9 rounded-md bg-[#1677ff] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0958d9]"
                  type="button"
                  onClick={saveGeozone}
                >
                  Сохранить
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  {renderGeozoneField(
                    'Наименование',
                    <input
                      className={inputClassName}
                      value={geozoneName}
                      onChange={(event) => setGeozoneName(event.currentTarget.value)}
                    />,
                  )}
                </div>
                {renderGeozoneField(
                  'Территориальный банк',
                  <input
                    className={inputClassName}
                    value={geozoneBank}
                    onChange={(event) => setGeozoneBank(event.currentTarget.value)}
                  />,
                )}
                {renderGeozoneField(
                  'Группа',
                  <input
                    className={inputClassName}
                    value={geozoneGroup}
                    onChange={(event) => setGeozoneGroup(event.currentTarget.value)}
                  />,
                )}
                {renderGeozoneField(
                  'Категория',
                  <select
                    className={inputClassName}
                    value={geozoneCategory}
                    onChange={(event) => setGeozoneCategory(event.currentTarget.value)}
                  >
                    <option>УС</option>
                    <option>Район</option>
                    <option>Область</option>
                  </select>,
                )}
                {renderGeozoneField(
                  'Статус',
                  <select
                    className={inputClassName}
                    value={geozoneStatus}
                    onChange={(event) => setGeozoneStatus(event.currentTarget.value)}
                  >
                    <option>Активна</option>
                    <option>Черновик</option>
                    <option>Архив</option>
                  </select>,
                )}
                <div className="sm:col-span-2">
                  {renderGeozoneField(
                    'Цвет',
                    <div className="flex h-10 items-center gap-2 rounded-md border border-[#d9d9d9] bg-white px-3">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          aria-label={`Цвет ${color}`}
                          className={[
                            'size-6 rounded-full border-2 transition-transform',
                            geozoneColor === color ? 'border-black/70 ring-2 ring-[#1677ff]/20' : 'border-white hover:scale-105',
                          ].join(' ')}
                          style={{ backgroundColor: color }}
                          type="button"
                          onClick={() => setGeozoneColor(color)}
                        />
                      ))}
                    </div>,
                  )}
                </div>
              </div>
            </section>
          </div>
        ) : null}
        {geozonePointMenu ? (
          <div
            data-block="geozone-point-context-menu"
            className="fixed z-[900] w-[178px] rounded-md bg-white p-1 shadow-[0px_9px_28px_8px_rgba(0,0,0,0.05),0px_3px_6px_-4px_rgba(0,0,0,0.12),0px_6px_16px_rgba(0,0,0,0.08)]"
            style={{ left: geozonePointMenu.x, top: geozonePointMenu.y }}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <button
              className="flex h-8 w-full items-center gap-2 rounded px-3 text-left text-sm text-[#F5222D] transition-colors hover:bg-[#fff1f0]"
              type="button"
              onClick={() => deleteDraftPoint(geozonePointMenu.pointIndex)}
            >
              <Trash2 className="size-4" />
              Удалить точку
            </button>
          </div>
        ) : null}
      </>
    );
  };

  const renderGeozoneInfoCard = () => {
    if (!geozoneInfoCard || !selectedGeozoneInfo) {
      return null;
    }

    return (
      <div
        data-block="geozone-info-card"
        className="fixed z-[840] w-[320px] max-w-[calc(100vw-24px)] rounded-md bg-white p-3 shadow-[0px_9px_28px_8px_rgba(0,0,0,0.05),0px_3px_6px_-4px_rgba(0,0,0,0.12),0px_6px_16px_rgba(0,0,0,0.08)]"
        style={{ left: Math.min(geozoneInfoCard.x + 12, window.innerWidth - 332), top: Math.min(geozoneInfoCard.y + 12, window.innerHeight - 176) }}
      >
        <div className="flex h-8 items-center gap-2">
          <span className="size-4 rounded-full" style={{ backgroundColor: selectedGeozoneInfo.color }} />
          <div className="min-w-0 flex-1 truncate text-base font-semibold leading-6 text-black/85">{selectedGeozoneInfo.name}</div>
          <div className="flex h-8 w-[104px] shrink-0 items-start gap-1">
            <button
              className="grid size-8 place-items-center rounded-md bg-[#e6f4ff] text-[#1677ff]"
              type="button"
              aria-label="Редактировать информацию геозоны"
              onClick={() => editGeozone(selectedGeozoneInfo)}
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m4 16.5-.5 4 4-.5L18.8 8.7a2.1 2.1 0 0 0 0-3L18.3 5a2.1 2.1 0 0 0-3 0L4 16.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className="grid size-8 place-items-center rounded-md text-[#1677ff] hover:bg-[#e6f4ff]"
              type="button"
              aria-label="Редактировать форму геозоны"
              onClick={() => editGeozoneShape(selectedGeozoneInfo)}
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 7h10v10H7V7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M4 4h4v4H4V4Zm12 0h4v4h-4V4ZM4 16h4v4H4v-4Zm12 0h4v4h-4v-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className="grid size-8 place-items-center rounded-md text-[#1677ff] hover:bg-[#e6f4ff]"
              type="button"
              aria-label="Создать дубликат геозоны"
              onClick={() => duplicateGeozone(selectedGeozoneInfo)}
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M8 7V5a2 2 0 0 1 2-2h9v14h-2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M5 7h9v14H5V7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="mt-3 rounded-md bg-black/[0.03] px-3 py-2 text-xs leading-5 text-black/55">
          Точек: {selectedGeozoneInfo.points.length}
          <br />
          Координаты сохранены в localStorage.
        </div>
      </div>
    );
  };

  const renderGeozonesPanel = () => (
    <>
      {!isCreatingGeozone ? (
        <button
          data-block="geozone-create-button"
          className="absolute left-40 top-5 z-[720] flex h-10 items-center gap-2 rounded-lg bg-[#1677ff] px-4 text-base text-white shadow-[0_4px_14px_rgba(22,119,255,0.28)]"
          type="button"
          onClick={startGeozoneCreation}
        >
          <span className="text-xl leading-none">+</span>
          Создать геозону
        </button>
      ) : null}

      <div data-block="geozone-map-search" className="absolute left-5 right-5 top-16 z-[720] hidden h-10 items-center overflow-hidden rounded-xl bg-white shadow-[0_0_4px_2px_rgba(138,139,151,0.35)] sm:left-auto sm:right-5 sm:top-5 sm:w-[min(540px,calc(100vw-380px))]">
        <input className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none" aria-label="Поиск геозон" />
        <button className="grid size-10 place-items-center bg-[#1677ff] text-white" type="button" aria-label="Поиск">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M10.5 18a7.5 7.5 0 1 1 5.3-12.8A7.5 7.5 0 0 1 10.5 18Zm0-2a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Zm6.6.7 4.1 4.1-1.4 1.4-4.1-4.1 1.4-1.4Z" fill="currentColor" />
          </svg>
        </button>
      </div>

      {isCreatingGeozone ? (
        <section data-block="geozone-edit-panel" className="absolute right-5 top-[72px] z-[730] w-[260px] rounded-md bg-white shadow-[0px_9px_28px_8px_rgba(0,0,0,0.05),0px_3px_6px_-4px_rgba(0,0,0,0.12),0px_6px_16px_rgba(0,0,0,0.08)]">
          <div className="border-b border-black/10 px-4 py-3">
            <h2 className="text-base font-medium leading-6 text-black/85">Геозона</h2>
            <p className="mt-0.5 text-xs leading-5 text-black/45">{geozoneDraftPoints.length} точек</p>
          </div>
          <div className="p-1">
            <button
              className="flex h-10 w-full items-center gap-2 rounded px-3 text-left text-sm text-[#22c55e] transition-colors hover:bg-[#f0fff4] disabled:cursor-not-allowed disabled:text-black/25 disabled:hover:bg-transparent"
              type="button"
              disabled={geozoneDraftPoints.length < 3}
              onClick={openGeozoneDetails}
            >
              <Check className="size-4" />
              Далее
            </button>
            <button
              className="flex h-10 w-full items-center gap-2 rounded px-3 text-left text-sm text-[#F5222D] transition-colors hover:bg-[#fff1f0]"
              type="button"
              onClick={deleteCurrentGeozone}
            >
              <XCircle className="size-4" />
              Удалить
            </button>
            <button
              className="flex h-10 w-full items-center gap-2 rounded px-3 text-left text-sm text-black/85 transition-colors hover:bg-black/[0.04]"
              type="button"
              onClick={clearDraftGeozone}
            >
              <Eraser className="size-4" />
              Очистить форму
            </button>
          </div>
        </section>
      ) : null}

      <aside data-block="geozones-sidebar" className="absolute left-5 top-20 z-[720] flex h-[calc(100%-100px)] w-[422px] flex-col overflow-hidden rounded-lg bg-white shadow-[0_0_4px_2px_rgba(138,139,151,0.35)]">
        <div className="relative border-b border-[#d9d9d9] p-4">
          <div className="flex gap-3">
            <div className="flex h-10 min-w-0 flex-1 items-center rounded-md border border-[#d9d9d9] px-3">
              <input
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-black/45"
                placeholder="Поиск группы/геозоны"
                value={geozoneSearch}
                onChange={(event) => setGeozoneSearch(event.currentTarget.value)}
              />
              <svg className="ml-auto size-4 shrink-0 text-black/35" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M10.5 18a7.5 7.5 0 1 1 5.3-12.8A7.5 7.5 0 0 1 10.5 18Zm5.6-1.2 4.1 4.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <button
              className={[
                'relative grid size-10 place-items-center rounded-lg border text-[#1677ff]',
                areGeozoneFiltersApplied || isGeozoneFiltersOpen ? 'border-[#1677ff]/30 bg-[#e6f4ff]' : 'border-[#d9d9d9] bg-white',
              ].join(' ')}
              type="button"
              aria-label="Фильтры"
              onClick={() => setIsGeozoneFiltersOpen((current) => !current)}
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {areGeozoneFiltersApplied ? <span className="absolute right-1 top-1 size-2 rounded-full bg-[#1677ff]" /> : null}
            </button>
          </div>
          {isGeozoneFiltersOpen ? (
            <div className="absolute left-4 right-4 top-[68px] z-[780] overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_14px_38px_rgba(0,0,0,0.18)]">
              <div className="flex h-12 items-center border-b border-black/10 px-4">
                <span className="text-base font-medium">Фильтры</span>
                <button
                  className="ml-auto text-sm text-[#1677ff]"
                  type="button"
                  onClick={() => {
                    setAreGeozoneFiltersApplied(false);
                    setIsGeozoneFiltersOpen(false);
                  }}
                >
                  Сбросить
                </button>
              </div>
              <div className="space-y-3 p-4 text-sm">
                {[
                  ['Группа', 'УС Санкт-Петербург'],
                  ['Категория', 'УС'],
                  ['Статус', 'Активна'],
                  ['ТБ', '55'],
                ].map(([label, value]) => (
                  <label key={label} className="block">
                    <span className="mb-1 block text-xs font-medium text-black/45">{label}</span>
                    <button className="flex h-9 w-full items-center rounded-lg border border-black/10 px-3 text-left text-black/80" type="button">
                      <span className="min-w-0 flex-1 truncate">{value}</span>
                      <span className="text-black/35">⌄</span>
                    </button>
                  </label>
                ))}
                <button
                  className="mt-2 h-10 w-full rounded-lg bg-[#1677ff] text-sm font-medium text-white"
                  type="button"
                  onClick={() => {
                    setAreGeozoneFiltersApplied(true);
                    setIsGeozoneFiltersOpen(false);
                  }}
                >
                  Применить
                </button>
              </div>
            </div>
          ) : null}
        </div>
        <OverlayScrollArea className="min-h-0 flex-1" contentClassName="px-6 py-4">
          {areGeozoneFiltersApplied ? (
            <div className="mb-3 flex flex-wrap gap-2 text-xs">
              {['УС Санкт-Петербург', 'Категория: УС', 'Статус: Активна', 'ТБ: 55'].map((filter) => (
                <span key={filter} className="rounded-full bg-[#e6f4ff] px-3 py-1 text-[#1677ff]">{filter}</span>
              ))}
            </div>
          ) : null}
          <div className="mb-3 flex items-center text-sm">
            <span className="font-semibold">Группы/Геозоны</span>
            <button className="ml-auto px-3 text-[#4096ff]" type="button">Cвернуть все</button>
            <button className="px-3 text-[#1677ff]" type="button" onClick={() => setGeozoneIdsSelected(allGeozoneIds, true)}>Выбрать все</button>
          </div>
          <div className="min-h-full rounded-md border border-[#d9d9d9] bg-white p-1">
            {visibleGeozoneTreeItems.length > 0 ? (
              <>
                {renderGeozoneTreeItem(areGeozoneFiltersApplied ? 'УС Санкт-Петербург' : 'Ситимовский край', {
                  checked: visibleTreeChecked,
                  mixed: visibleTreeMixed,
                  expanded: true,
                  onToggle: () => setGeozoneIdsSelected(visibleGeozoneTreeIds, !visibleTreeChecked),
                })}
                {renderGeozoneTreeItem(areGeozoneFiltersApplied ? 'СПБУС01 (В.О.)' : 'Макетск', {
                  checked: visibleTreeChecked,
                  mixed: visibleTreeMixed,
                  expanded: true,
                  level: 1,
                  onToggle: () => setGeozoneIdsSelected(visibleGeozoneTreeIds, !visibleTreeChecked),
                })}
                {visibleGeozoneTreeItems.map((zone) => (
                  <div key={zone.id}>
                    {renderGeozoneTreeItem(zone.name, {
                      checked: selectedGeozoneIds.has(zone.id),
                      color: zone.color,
                      level: 2,
                      onToggle: () => toggleGeozone(zone.id),
                    })}
                  </div>
                ))}
              </>
            ) : (
              <div className="px-3 py-2 text-sm text-black/45">Ничего не найдено</div>
            )}
          </div>
        </OverlayScrollArea>
        <div className="space-y-2 border-t border-[#d9d9d9] p-4">
          <button className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#1677ff] text-base text-white" type="button">
            <span className="text-xl leading-none">+</span>
            Создать группу
          </button>
          <button className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#d9d9d9] bg-white text-base text-black/85" type="button">
            Сохранить фильтры
          </button>
        </div>
      </aside>

      {renderGeozoneCreationOverlay()}
    </>
  );

  function openRouteDayOnMap(row: { dayOffset: number; route: number }) {
    const nextEngineer = selectedEngineer || engineers[0];
    setSelectedEngineer(nextEngineer);
    setEngineerQuery(nextEngineer);
    setSelectedRouteDate(formatRouteDate(row.dayOffset));
    setSelectedRouteDayOffset(row.dayOffset);
    setSelectedRow(row.route - 1);
    setTimelineProgress(0);
    scrubProgressRef.current = 0;
    playbackStartedAtRef.current = performance.now();
    setIsTableHidden(false);
    setActiveTab('routes');
    setRouteViewMode('map');
  }

  const renderRoutesTable = () => (
    <>
      <div data-block="routes-table-header" className="grid shrink-0 bg-[#f5f5f5] px-4 text-[14px] font-medium leading-[20px]" style={{ gridTemplateColumns: tableGridTemplate }}>
        {tableColumns.map((column, index) => (
          <button
            key={column.key}
            className={[
              'group relative flex h-14 items-center border-b border-black/10 px-2 text-left text-[14px] transition-colors',
              sortState?.key === column.key ? 'bg-black/[0.06]' : '',
            ].join(' ')}
            type="button"
            onClick={() => toggleSort(column.key)}
          >
            <span>{column.label}</span>
            {sortIcon(sortState?.key === column.key, sortState?.direction ?? 'asc')}
            <span className="absolute right-0 top-0 h-full w-3 cursor-col-resize touch-none" onPointerDown={(event) => startColumnResize(index, event)} />
          </button>
        ))}
      </div>
      <OverlayScrollArea className="min-h-0 flex-1" contentClassName="overflow-x-auto">
        <div data-block="routes-table-body">
        {tableRows.map((row, index) => (
          <button
            key={row.request}
            type="button"
            onClick={() => setSelectedRow(index)}
            className={[
              'grid w-full px-4 text-left text-sm font-normal leading-[22px] transition-colors',
              selectedRow === index ? 'bg-[#f3f8ef]' : 'bg-white hover:bg-black/[0.02]',
            ].join(' ')}
            style={{ gridTemplateColumns: tableGridTemplate }}
          >
            <div className={['border-b border-black/5 px-2 py-3', sortState?.key === 'route' ? 'bg-black/[0.04]' : ''].join(' ')}>{row.route}</div>
            <div className={['border-b border-black/5 px-2 py-3 text-[#1677ff]', sortState?.key === 'request' ? 'bg-black/[0.04]' : ''].join(' ')}>{row.request}</div>
            <div className={['border-b border-black/5 px-2 py-3', sortState?.key === 'closedAt' ? 'bg-black/[0.04]' : ''].join(' ')}>{row.closedAt}</div>
            <div className={['border-b border-black/5 px-2 py-3', sortState?.key === 'from' ? 'bg-black/[0.04]' : ''].join(' ')}>
              <div>{row.fromAddress}</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-black/45">
                <button className="flex items-center gap-1 rounded px-1 py-0.5 text-left font-['Roboto','Arial',sans-serif] text-xs font-normal leading-[18px] text-black/45 hover:bg-black/5 hover:text-black/70" type="button" aria-label="Скопировать координаты" onClick={(event) => { event.stopPropagation(); copyText(row.fromCoords); }}>
                  <span>{row.fromCoords}</span>
                  <Copy className="size-3" />
                </button>
              </div>
            </div>
            <div className={['border-b border-black/5 px-2 py-3', sortState?.key === 'to' ? 'bg-black/[0.04]' : ''].join(' ')}>
              <div>{row.toAddress}</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-black/45">
                <button className="flex items-center gap-1 rounded px-1 py-0.5 text-left font-['Roboto','Arial',sans-serif] text-xs font-normal leading-[18px] text-black/45 hover:bg-black/5 hover:text-black/70" type="button" aria-label="Скопировать координаты" onClick={(event) => { event.stopPropagation(); copyText(row.toCoords); }}>
                  <span>{row.toCoords}</span>
                  <Copy className="size-3" />
                </button>
              </div>
            </div>
            <div className={['border-b border-black/5 px-2 py-3', sortState?.key === 'plannedDistance' ? 'bg-black/[0.04]' : ''].join(' ')}>{row.plannedDistance}</div>
            <div className={['border-b border-black/5 px-2 py-3', sortState?.key === 'actualDistance' ? 'bg-black/[0.04]' : ''].join(' ')}>{row.actualDistance}</div>
            <div className={['border-b border-black/5 px-2 py-3', sortState?.key === 'transport' ? 'bg-black/[0.04]' : ''].join(' ')}>
              <div className="flex items-center gap-2">
                <span>{row.transport}</span>
                <button
                  className="grid size-7 place-items-center rounded-lg border border-black/10 text-black/45 transition-colors hover:border-[#1677ff]/40 hover:bg-[#e6f4ff] hover:text-[#1677ff]"
                  type="button"
                  aria-label="Открыть транспорт"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Car className="size-4" />
                </button>
              </div>
            </div>
            <div className={['border-b border-black/5 px-2 py-3', sortState?.key === 'tripType' ? 'bg-black/[0.04]' : ''].join(' ')}>
              <div className="flex items-center gap-2">
                <span>{row.tripType}</span>
                <button
                  className="grid size-7 place-items-center rounded-lg border border-black/10 text-black/45 transition-colors hover:border-[#1677ff]/40 hover:bg-[#e6f4ff] hover:text-[#1677ff]"
                  type="button"
                  aria-label="Показать поездку на карте"
                  onClick={(event) => {
                    event.stopPropagation();
                    openRouteDayOnMap(row);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Zm0-8.5A2.5 2.5 0 1 0 12 7a2.5 2.5 0 0 0 0 5.5Z" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>
            <div className={['border-b border-black/5 px-2 py-3', sortState?.key === 'confirmed' ? 'bg-black/[0.04]' : ''].join(' ')}><span className="rounded border border-[#b7eb8f] bg-[#f6ffed] px-2 py-1 text-xs text-[#52c41a]">{row.confirmed}</span></div>
          </button>
        ))}
        </div>
      </OverlayScrollArea>
    </>
  );

  function toggleSort(key: string) {
    setSortState((current) => {
      if (current?.key === key && current.direction === 'desc') {
        return null;
      }

      return {
        key,
        direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
      };
    });
  }

  function startColumnResize(index: number, event: ReactPointerEvent<HTMLSpanElement>) {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startWidth = columnWidths[index];

    function move(moveEvent: PointerEvent) {
      const nextWidth = Math.max(72, startWidth + moveEvent.clientX - startX);
      setColumnWidths((current) => current.map((width, widthIndex) => (widthIndex === index ? nextWidth : width)));
      setFixedColumns((current) => current.map((isFixed, fixedIndex) => (fixedIndex === index ? true : isFixed)));
    }

    function stop() {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
    }

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop, { once: true });
  }
  const currentTimelineTime = getTimelineTime(timelineProgress);

  useEffect(() => {
    let cancelled = false;
    const routeRequestController = new AbortController();

    loadLeaflet()
      .then(async (L) => {
        if (cancelled || !mapRef.current || leafletMapRef.current) {
          return;
        }
        leafletLibRef.current = L;

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

        routeWaypoints.slice(1, -1).forEach((point, index) => {
          L.marker(point, {
            icon: L.divIcon({
              className: 'route-stop-marker',
              html: `<span>${index + 1}</span>`,
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            }),
          }).addTo(map);
        });

        L.marker(routeWaypoints[0], {
          icon: L.divIcon({
            className: 'route-terminal-leaflet-marker',
            html: terminalMarkerHtml('start', '09:30'),
            iconSize: [74, 70],
            iconAnchor: [37, 62],
          }),
          zIndexOffset: 1200,
        }).addTo(map);

        L.marker(routeWaypoints[routeWaypoints.length - 1], {
          icon: L.divIcon({
            className: 'route-terminal-leaflet-marker',
            html: terminalMarkerHtml('end', '16:00'),
            iconSize: [74, 70],
            iconAnchor: [37, 62],
          }),
          zIndexOffset: 1201,
        }).addTo(map);

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
      leafletLibRef.current = null;
    };
  }, []);

  useEffect(() => {
    const L = leafletLibRef.current;
    const map = leafletMapRef.current;
    if (!L || !map || mapStatus !== 'ready') {
      return;
    }

    clearDraftGeozoneLayer();
    if (!isCreatingGeozone || geozoneDraftPoints.length === 0) {
      return;
    }

    const draftLayer =
      geozoneDraftPoints.length >= 3
        ? L.polygon(geozoneDraftPoints, {
            color: geozoneColor,
            fillColor: geozoneColor,
            fillOpacity: 0.18,
            opacity: 1,
            weight: 3,
            lineJoin: 'round',
            dashArray: '8 6',
            className: 'route-geozone-draft',
          })
        : L.polyline(geozoneDraftPoints, {
            color: geozoneColor,
            opacity: 1,
            weight: 3,
            dashArray: '8 6',
            className: 'route-geozone-draft',
          });

    geozoneDraftLayerRef.current = draftLayer.addTo(map);
    const vertexMarkers = geozoneDraftPoints.map((point, index) => {
      const marker = L.marker(point, {
        icon: L.divIcon({
          className: 'route-geozone-draft-point',
          html: `<span style="--geozone-point-color:${geozoneColor}" aria-hidden="true"></span>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
        draggable: true,
        interactive: true,
        zIndexOffset: 1400,
      });

      marker.on('click', (event: any) => {
        L.DomEvent.stop(event);
        setGeozonePointMenu(null);
      });
      marker.on('dragstart', () => {
        setGeozonePointMenu(null);
      });
      marker.on('drag', (event: any) => {
        const latLng = event.target.getLatLng();
        previewUpdatedDraftPoint(index, [latLng.lat, latLng.lng]);
      });
      marker.on('dragend', (event: any) => {
        const latLng = event.target.getLatLng();
        updateDraftPoint(index, [latLng.lat, latLng.lng]);
      });
      marker.on('contextmenu', (event: any) => {
        L.DomEvent.stop(event);
        event.originalEvent?.preventDefault();
        setGeozonePointMenu({
          pointIndex: index,
          x: event.originalEvent?.clientX ?? 0,
          y: event.originalEvent?.clientY ?? 0,
        });
      });

      return marker;
    });

    const midpointMarkers = geozoneDraftPoints.flatMap((point, index) => {
      const nextIndex = index + 1;
      const nextPoint = geozoneDraftPoints[nextIndex];
      const shouldClosePolygon = geozoneDraftPoints.length >= 3 && index === geozoneDraftPoints.length - 1;
      const targetPoint = nextPoint ?? (shouldClosePolygon ? geozoneDraftPoints[0] : null);

      if (!targetPoint) {
        return [];
      }

      const midpoint: RoutePoint = [
        (point[0] + targetPoint[0]) / 2,
        (point[1] + targetPoint[1]) / 2,
      ];
      const marker = L.marker(midpoint, {
        icon: L.divIcon({
          className: 'route-geozone-midpoint',
          html: `<span style="--geozone-point-color:${geozoneColor}" aria-hidden="true"></span>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        }),
        draggable: true,
        interactive: true,
        zIndexOffset: 1350,
      });

      marker.on('click', (event: any) => {
        L.DomEvent.stop(event);
      });
      marker.on('dragstart', (event: any) => {
        L.DomEvent.stop(event);
        setGeozonePointMenu(null);
        const latLng = event.target.getLatLng();
        geozoneDraggedMidpointRef.current = [latLng.lat, latLng.lng];
        event.target.setLatLng(latLng);
        previewInsertedDraftPoint(index, [latLng.lat, latLng.lng]);
      });
      marker.on('drag', (event: any) => {
        const latLng = event.target.getLatLng();
        geozoneDraggedMidpointRef.current = [latLng.lat, latLng.lng];
        event.target.setLatLng(latLng);
        previewInsertedDraftPoint(index, [latLng.lat, latLng.lng]);
      });
      marker.on('dragend', (event: any) => {
        const latLng = event.target.getLatLng();
        insertDraftPoint(index, geozoneDraggedMidpointRef.current ?? [latLng.lat, latLng.lng]);
        geozoneDraggedMidpointRef.current = null;
      });

      return [marker];
    });

    geozoneMidpointMarkersRef.current = midpointMarkers;
    geozoneDraftMarkerLayerRef.current = L.layerGroup([...midpointMarkers, ...vertexMarkers]).addTo(map);
  }, [geozoneColor, geozoneDraftPoints, geozoneCreationStep, isCreatingGeozone]);

  useEffect(() => {
    const L = leafletLibRef.current;
    const map = leafletMapRef.current;
    if (!L || !map) {
      return;
    }

    if (createdGeozoneLayerRef.current) {
      map.removeLayer(createdGeozoneLayerRef.current);
      createdGeozoneLayerRef.current = null;
    }

    if (visibleGeozones.length === 0) {
      return;
    }

    createdGeozoneLayerRef.current = drawGeozones(L, visibleGeozones, openGeozoneInfo).addTo(map);
  }, [mapStatus, visibleGeozones]);

  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || !isCreatingGeozone || geozoneCreationStep !== 'drawing') {
      return;
    }

    const handleMapClick = (event: { latlng: { lat: number; lng: number } }) => {
      setGeozonePointMenu(null);
      const nextPoints = [...geozoneDraftPointsRef.current, [event.latlng.lat, event.latlng.lng] as RoutePoint];
      geozoneDraftPointsRef.current = nextPoints;
      setGeozoneDraftPoints(nextPoints);
    };

    const handleMapContextMenu = (event: any) => {
      event.originalEvent?.preventDefault();
      setGeozonePointMenu(null);
    };

    map.getContainer().classList.add('is-drawing-geozone');
    map.on('click', handleMapClick);
    map.on('contextmenu', handleMapContextMenu);

    return () => {
      map.off('click', handleMapClick);
      map.off('contextmenu', handleMapContextMenu);
      map.getContainer().classList.remove('is-drawing-geozone');
    };
  }, [geozoneCreationStep, isCreatingGeozone]);

  useEffect(() => {
    if (!geozonePointMenu) {
      return undefined;
    }

    const closePointMenu = () => setGeozonePointMenu(null);
    window.addEventListener('pointerdown', closePointMenu);
    return () => window.removeEventListener('pointerdown', closePointMenu);
  }, [geozonePointMenu]);

  useEffect(() => {
    if (leafletMapRef.current) {
      window.setTimeout(() => leafletMapRef.current?.invalidateSize(), 520);
    }
  }, [isTableHidden, routeViewMode]);

  return (
    <main
      data-block="routes-prototype-page"
      className={[
        'relative h-screen min-h-[720px] overflow-hidden bg-[#f5f5f5] font-[\'Roboto\',\'Arial\',sans-serif] text-[rgba(0,0,0,0.88)]',
        activeTab === 'zones' ? 'zones-mode' : '',
        !isRouteReady ? 'no-route-mode' : '',
      ].join(' ')}
    >
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
        .route-terminal-leaflet-marker {
          background: transparent;
          border: 0;
        }
        .route-terminal-marker {
          display: flex;
          align-items: center;
          flex-direction: column;
          pointer-events: none;
        }
        .route-terminal-card {
          display: flex;
          width: auto;
          min-width: 58px;
          min-height: 32px;
          align-items: center;
          justify-content: center;
          flex-direction: row;
          gap: 4px;
          padding: 0 8px;
          border: 2px solid white;
          border-radius: 12px;
          background: white;
          color: #333;
          font: 600 10px/12px Roboto, Arial, sans-serif;
          box-shadow: 0 0 4px 2px rgba(138,139,151,.35);
        }
        .route-terminal-stem {
          width: 2px;
          height: 25px;
          background: rgba(24,24,24,.8);
        }
        .route-terminal-dot {
          width: 6px;
          height: 3px;
          border-radius: 999px;
          background: rgba(24,24,24,.75);
        }
        .route-timeline-terminal-icon {
          display: grid;
          width: 28px;
          height: 28px;
          place-items: center;
          border: 2px solid white;
          border-radius: 999px;
          background: white;
          box-shadow: 0 0 4px 2px rgba(138,139,151,.35);
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
        .leaflet-control-scale {
          margin-bottom: 58px !important;
        }
        .route-geozone-polygon,
        .route-geozone-label {
          display: none;
        }
        .route-geozone-label {
          border: 0;
          border-radius: 999px;
          background: rgba(255,255,255,.82);
          color: rgba(0,0,0,.78);
          font: 500 12px/16px Roboto, Arial, sans-serif;
          padding: 5px 10px;
          pointer-events: none;
          box-shadow: 0 4px 14px rgba(0,0,0,.14);
        }
        .route-geozone-label::before {
          display: none;
        }
        .leaflet-container.is-drawing-geozone {
          cursor: crosshair;
        }
        .route-geozone-draft {
          pointer-events: none;
        }
        .route-geozone-midpoint,
        .route-geozone-draft-point {
          background: transparent;
          border: 0;
        }
        .route-geozone-draft-point span {
          display: block;
          width: 20px;
          height: 20px;
          border: 2px solid white;
          border-radius: 999px;
          background: var(--geozone-point-color, #ff00d6);
          box-shadow: 0 2px 8px rgba(0,0,0,.24), inset 0 0 0 3px rgba(255,255,255,.18);
          cursor: grab;
          touch-action: none;
        }
        .route-geozone-draft-point:active span {
          cursor: grabbing;
        }
        .route-geozone-midpoint span {
          display: block;
          width: 12px;
          height: 12px;
          border: 2px solid white;
          border-radius: 999px;
          background: var(--geozone-point-color, #ff00d6);
          box-shadow: 0 2px 6px rgba(0,0,0,.16);
          cursor: grab;
          touch-action: none;
          transition: transform .16s ease, background-color .16s ease;
        }
        .route-geozone-midpoint:active span {
          cursor: grabbing;
        }
        .route-geozone-midpoint:hover span {
          transform: scale(1.12);
        }
        .route-overlay-scroll-content {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .route-overlay-scroll-content::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        .route-overlay-scrollbar {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 5;
          display: flex;
          width: 14px;
          justify-content: center;
          pointer-events: none;
        }
        .route-overlay-scrollbar-track {
          width: 3px;
          height: 100%;
          border-radius: 999px;
          background: transparent;
        }
        .route-overlay-scrollbar-thumb {
          position: absolute;
          top: 0;
          width: 6px;
          border-radius: 999px;
          background: rgba(82,82,82,.62);
          pointer-events: auto;
          cursor: grab;
          will-change: transform;
        }
        .route-overlay-scrollbar-thumb:hover {
          background: rgba(66,66,66,.76);
        }
        .route-overlay-scrollbar-thumb:active {
          cursor: grabbing;
          background: rgba(48,48,48,.82);
        }
        .zones-mode .route-car-marker,
        .zones-mode .route-stop-marker,
        .zones-mode .route-terminal-leaflet-marker {
          display: none;
        }
        .zones-mode .route-gradient-line {
          opacity: 0 !important;
        }
        .zones-mode .route-geozone-polygon,
        .zones-mode .route-geozone-label {
          display: block;
        }
        .no-route-mode .route-car-marker,
        .no-route-mode .route-stop-marker,
        .no-route-mode .route-terminal-leaflet-marker {
          display: none;
        }
        .no-route-mode .route-gradient-line {
          opacity: 0 !important;
        }
      `}</style>

      <div data-block="top-tabs-menu" className={['absolute left-1/2 top-4 z-[700] flex gap-1 -translate-x-1/2 rounded-3xl bg-white p-1 shadow-[0_6px_18px_rgba(0,0,0,0.08)]', isCreatingGeozone ? 'hidden' : ''].join(' ')}>
        {tabItems.map(([key, label]) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setActiveTab(key);
                if (key === 'zones') {
                  setRouteViewMode('map');
                  setIsTableHidden(true);
                }
              }}
              className={[
                'h-10 rounded-full px-6 text-sm transition-colors',
                isActive ? 'bg-black/[0.04] text-black' : 'text-black/70 hover:bg-black/[0.04] hover:text-black',
              ].join(' ')}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div data-block="map-registry-switch" className={['absolute left-5 top-5 z-[700] grid h-10 w-[125px] grid-cols-2 gap-1 overflow-hidden rounded-full bg-white p-0.5 [background-image:linear-gradient(0deg,rgba(0,0,0,0.04),rgba(0,0,0,0.04)),linear-gradient(0deg,#fff,#fff)]', isCreatingGeozone ? 'hidden' : ''].join(' ')}>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0.5 top-0.5 z-0 h-9 rounded-full bg-white shadow-[0_0_4px_rgba(0,0,0,0.25)] transition-transform duration-200 ease-in-out"
          style={{
            width: 'calc((100% - 8px) / 2)',
            transform: `translateX(${routeViewMode === 'map' ? '0' : 'calc(100% + 4px)'})`,
          }}
        />
        {(['map', 'registry'] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => {
              if (activeTab === 'zones') {
                setRouteViewMode('map');
                return;
              }
              setActiveTab('routes');
              setRouteViewMode(mode);
            }}
            className={[
              'relative z-[1] flex h-9 min-w-0 flex-col items-center justify-center rounded-full p-0 text-sm font-normal leading-[22px] transition-colors duration-200 ease-in-out',
              routeViewMode === mode ? 'text-black/[0.88]' : 'text-black/60 hover:bg-white/35 hover:text-black/[0.88]',
            ].join(' ')}
            style={{ fontFamily: 'Roboto, Arial, sans-serif' }}
          >
            <span className="flex h-[30px] items-center justify-center gap-2 rounded-full px-2 py-1">
              {mode === 'map' ? 'Карта' : 'Реестр'}
            </span>
          </button>
        ))}
      </div>

      <section
        data-block="map-section"
        className={[
          'absolute inset-x-0 top-0 overflow-hidden transition-[height] duration-500 ease-out',
          isTableHidden || activeTab === 'zones' || !isRouteReady ? 'h-full' : 'h-[calc(66%+20px)]',
          (activeTab === 'routes' && routeViewMode === 'map') || activeTab === 'zones' ? '' : 'hidden',
        ].join(' ')}
      >
        <div ref={mapRef} data-block="leaflet-map" className="absolute inset-0" />
        {mapStatus !== 'ready' && (
          <div className="absolute inset-0 grid place-items-center bg-[#eef3eb] text-sm text-black/55">
            {mapStatus === 'loading' ? 'Загружаю карту...' : 'Не удалось загрузить OpenStreetMap'}
          </div>
        )}

        {activeTab === 'routes' && (
        <div data-block="route-map-bottom-controls" className="absolute bottom-9 left-5 right-5 z-[500] flex items-end gap-3">
          <div data-block="engineer-picker" className="relative">
            <label className="flex h-11 w-[280px] items-center rounded-xl bg-white px-4 shadow-[0_4px_14px_rgba(0,0,0,0.12)]">
              <input
                className="min-w-0 flex-1 bg-transparent text-sm text-black/85 outline-none placeholder:text-black/45"
                aria-label="Выберите инженера"
                placeholder="Инженер"
                value={engineerQuery}
                onFocus={() => {
                  setIsEngineerPickerOpen(engineerQuery.trim().length > 0);
                  setIsRouteDatePickerOpen(false);
                }}
                onBlur={() => window.setTimeout(() => setIsEngineerPickerOpen(false), 120)}
                onChange={(event) => {
                  const nextQuery = event.currentTarget.value;
                  setEngineerQuery(nextQuery);
                  setIsEngineerPickerOpen(nextQuery.trim().length > 0);
                  if (nextQuery !== selectedEngineer) {
                    setSelectedEngineer('');
                    setSelectedRow(null);
                    setTimelineProgress(0);
                    scrubProgressRef.current = 0;
                    playbackStartedAtRef.current = performance.now();
                  }
                }}
              />
            </label>
            {isEngineerPickerOpen && (
              <div className="absolute bottom-[52px] left-0 z-[720] w-[288px] rounded-2xl bg-white p-2 text-sm shadow-[0_16px_42px_rgba(0,0,0,0.18)]">
                <div className="mb-1 px-2 py-1 text-xs font-medium text-black/45">Инженеры</div>
                <div className="space-y-1">
                  {filteredEngineers.length > 0 ? (
                    filteredEngineers.map((engineer) => (
                      <button
                        key={engineer}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => selectEngineer(engineer)}
                        className={[
                          'flex min-h-10 w-full items-center rounded-xl px-3 text-left transition-colors',
                          selectedEngineer === engineer ? 'bg-[#e8f0ff] text-[#0b57d0]' : 'text-black/85 hover:bg-black/[0.04]',
                        ].join(' ')}
                      >
                        {engineer}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-3 text-black/45">Инженер не найден</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div data-block="date-picker" className="relative">
            <button
              type="button"
              aria-label="Выберите дату маршрута"
              aria-expanded={isRouteDatePickerOpen}
              onClick={() => {
                setIsEngineerPickerOpen(false);
                setIsRouteDatePickerOpen((isOpen) => !isOpen);
              }}
              className="flex h-11 w-[170px] items-center gap-2 rounded-xl bg-white px-4 text-left text-sm shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
            >
              <CalendarDays className="size-4 shrink-0 text-black/45" />
              <span className={selectedRouteDate ? 'text-black/85' : 'text-black/45'}>
                {selectedRouteDate || 'Выберите дату'}
              </span>
            </button>
            {isRouteDatePickerOpen && (
              <div className="absolute bottom-[52px] left-0 z-[720] w-[288px] rounded-2xl bg-white p-3 text-sm shadow-[0_16px_42px_rgba(0,0,0,0.18)]">
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className="font-medium text-black/85">Май 2026</span>
                  <span className="rounded-full bg-[#e8f0ff] px-2 py-1 text-xs font-medium text-[#0b57d0]">
                    есть маршруты
                  </span>
                </div>
                <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-black/45">
                  {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((dayName) => (
                    <span key={dayName}>{dayName}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: (new Date(2026, 4, 1).getDay() + 6) % 7 }).map((_, index) => (
                    <span key={`empty-${index}`} />
                  ))}
                  {Array.from({ length: 31 }).map((_, index) => {
                    const day = index + 1;
                    const date = `2026-05-${String(day).padStart(2, '0')}`;
                    const availableDate = availableRouteDates.find((item) => item.date === date);
                    const isAvailable = availableRouteDateSet.has(date);
                    const isSelected = selectedRouteDate === date;

                    return (
                      <button
                        key={date}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => {
                          if (availableDate) {
                            selectRouteDate(availableDate.date, availableDate.dayOffset);
                          }
                        }}
                        className={[
                          'grid h-9 place-items-center rounded-xl text-sm transition-colors',
                          isSelected
                            ? 'bg-[#0b57d0] font-medium text-white'
                            : isAvailable
                              ? 'bg-[#e8f0ff] font-medium text-[#0b57d0] hover:bg-[#d7e6ff]'
                              : 'text-black/25',
                        ].join(' ')}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {isRouteReady && (
          <div data-block="route-timeline" className="relative h-11 min-w-[360px] flex-1 rounded-xl bg-white/92 px-3 shadow-[0_4px_14px_rgba(0,0,0,0.12)] backdrop-blur-sm">
            <div className="absolute inset-x-3 -top-6 z-[9] text-[9px] font-medium text-[#7a8299]">
              {timelineEdgeLabels.map((time) => (
                <span
                  key={time}
                  className="absolute -translate-x-1/2 whitespace-nowrap rounded-md bg-white/90 px-1.5 py-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] backdrop-blur-sm"
                  style={{ left: `${getTimelineLabelProgress(time) * 100}%` }}
                >
                  {time}
                </span>
              ))}
            </div>

            <div className="route-timeline-road absolute left-3 right-3 top-1/2 h-3 -translate-y-1/2 overflow-hidden rounded-full">
              <div
                className="relative h-full overflow-hidden rounded-full"
                style={{ width: `${Math.max(timelineProgress * 100, 1.5)}%` }}
              >
                <div className="absolute inset-y-0 left-0 w-[calc(100vw-520px)] min-w-full rounded-full bg-gradient-to-r from-[#2563eb] to-[#22c55e]" />
              </div>
            </div>

            <div className="pointer-events-none absolute left-3 top-1/2 z-[8] -translate-x-1/2 -translate-y-1/2" dangerouslySetInnerHTML={{ __html: terminalTimelineIconHtml('start') }} />
            <div className="pointer-events-none absolute right-3 top-1/2 z-[8] -translate-y-1/2 translate-x-1/2" dangerouslySetInnerHTML={{ __html: terminalTimelineIconHtml('end') }} />

            {timelineStops.slice(1).map((stop, index) => {
              return (
                <div
                  key={`${stop.timelineProgress}-${index}`}
                  className="absolute top-1/2 z-[6] flex h-3 -translate-y-1/2 items-center rounded-full bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.78)_0,rgba(255,255,255,.78)_5px,rgba(37,99,235,.16)_5px,rgba(37,99,235,.16)_10px)] shadow-[0_2px_10px_rgba(37,99,235,.16)] backdrop-blur-md"
                  style={{
                    left: `calc(12px + (100% - 24px) * ${stop.timelineProgress})`,
                    width: `calc((100% - 24px) * ${stop.width})`,
                  }}
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-white bg-[rgba(24,24,24,0.92)] text-[11px] font-bold leading-none text-white shadow-[0_2px_8px_rgba(0,0,0,.18)]">
                    {index + 1}
                  </span>
                </div>
              );
            })}

            <div
              className="absolute top-[-24px] z-[10] flex -translate-x-1/2 flex-col items-center"
              style={{ left: `calc(12px + (100% - 24px) * ${timelineProgress})` }}
            >
              <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold text-white">{currentTimelineTime}</span>
              <span className="h-[27px] w-px bg-[#ef4444]" />
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
          )}

          {isRouteReady && (
          <button
            data-block="route-table-toggle"
            className="grid size-11 place-items-center rounded-xl bg-white text-[#4d4d4d] shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#f8f8f8]"
            type="button"
            aria-label={isTableHidden ? 'Показать таблицу' : 'Скрыть таблицу'}
            onClick={() => setIsTableHidden((value) => !value)}
          >
            <svg
              className={['size-6 transition-transform duration-300', isTableHidden ? 'rotate-180' : 'rotate-0'].join(' ')}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path fill="currentColor" fillRule="evenodd" d="M15.378 9.85c.28-.47.062-.85-.485-.85H9.106c-.548 0-.763.382-.484.85l2.87 4.799c.28.469.736.467 1.016 0z" clipRule="evenodd" />
            </svg>
          </button>
          )}
        </div>
        )}

        {activeTab === 'zones' && renderGeozonesPanel()}
        {activeTab === 'zones' && renderGeozoneInfoCard()}

        <div data-block="map-tools" className="absolute right-5 top-[26%] z-[500] flex w-10 flex-col items-start gap-2">
          <button className="grid size-10 place-items-center rounded-xl bg-white p-1.5 shadow-[0_0_4px_2px_rgba(138,139,151,0.35)] transition-colors hover:bg-[#f8f8f8]" type="button" aria-label="Слои карты">
            <MapLayerIcon />
          </button>
          <button className="grid size-10 place-items-center rounded-xl bg-white p-1.5 shadow-[0_0_4px_2px_rgba(138,139,151,0.35)] transition-colors hover:bg-[#f8f8f8]" type="button" aria-label="Линейка">
            <MapRulerIcon />
          </button>
          <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_0_4px_2px_rgba(0,0,0,0.25)]">
            <button className="grid size-10 place-items-center p-1.5 transition-colors hover:bg-[#f8f8f8]" type="button" aria-label="Приблизить" onClick={() => leafletMapRef.current?.zoomIn()}>
              <MapPlusIcon />
            </button>
            <button className="grid size-10 place-items-center p-1.5 transition-colors hover:bg-[#f8f8f8]" type="button" aria-label="Отдалить" onClick={() => leafletMapRef.current?.zoomOut()}>
              <MapMinusIcon />
            </button>
          </div>
          <button className="grid size-10 place-items-center rounded-xl bg-white p-1.5 shadow-[0_0_4px_2px_rgba(138,139,151,0.35)] transition-colors hover:bg-[#f8f8f8]" type="button" aria-label="Показать маршрут" onClick={() => leafletMapRef.current?.fitBounds(window.L.latLngBounds(currentRouteRef.current), { paddingTopLeft: [70, 70], paddingBottomRight: [70, 130], maxZoom: 15 })}>
            <MapLocationIcon />
          </button>
        </div>
      </section>

      {activeTab === 'routes' && routeViewMode === 'registry' && (
        <section data-block="routes-registry-section" className="absolute inset-0 z-[520] flex flex-col bg-[#f5f5f5] pt-20">
          <div className="mx-0 mb-0 min-h-0 flex-1 overflow-hidden rounded-t-2xl border border-x-0 border-b-0 border-black/10 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="flex h-full flex-col">
              <div className="flex h-[52px] shrink-0 items-center gap-3 border-b border-black/10 bg-white px-4">
                <div className="flex h-9 w-[280px] items-center gap-2 rounded-xl border border-black/10 bg-white px-3">
                  <span className="truncate text-sm text-black/80">Александров Кирилл Николаевич</span>
                  <button className="ml-auto text-black/35" type="button" aria-label="Очистить">x</button>
                </div>
                <button className="flex h-9 items-center gap-2 rounded-xl border border-black/10 bg-white px-3 text-sm text-black/80" type="button">
                  2026-05-09 - 2026-05-16
                  <CalendarDays className="size-4 text-black/45" />
                </button>
                <div className="h-7 w-px bg-black/10" />
                <button className="h-9 rounded-xl bg-black/[0.04] px-4 text-sm text-black/80 transition-colors hover:bg-black/[0.07]" type="button">Фильтры</button>
                <div className="ml-auto text-sm text-black/50">Найдено: {tableRows.length}</div>
                <div className="flex items-center gap-2 text-sm text-black/65">
                  <button className="grid size-8 place-items-center rounded-lg border border-black/10 text-black/35" type="button" aria-label="Предыдущая страница">‹</button>
                  <button className="grid size-8 place-items-center rounded-lg border border-[#1677ff] text-[#1677ff]" type="button">1</button>
                  <button className="grid size-8 place-items-center rounded-lg border border-black/10" type="button" aria-label="Следующая страница">›</button>
                  <button className="h-8 rounded-lg border border-black/10 px-3 text-[14px]" type="button">15 / страница</button>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col">
                {renderRoutesTable()}
                <div className="grid h-14 shrink-0 border-t border-black/10 bg-white px-4 text-sm font-medium text-black/80" style={{ gridTemplateColumns: tableGridTemplate }}>
                  <div className="col-span-5 flex items-center px-2">Итого</div>
                  <div className="flex items-center px-2">{formatKm(totalPlannedDistance)}</div>
                  <div className="flex items-center px-2">{formatKm(totalActualDistance)}</div>
                  <div />
                  <div />
                  <div />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section
        className={[
          'absolute inset-x-0 bottom-0 z-[550] flex h-[34%] flex-col overflow-hidden rounded-t-[20px] border border-x-0 border-b-0 border-black/10 bg-white shadow-[0_-10px_28px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-out',
          isTableHidden ? 'translate-y-full' : 'translate-y-0',
          activeTab === 'routes' && routeViewMode === 'map' && isRouteReady ? '' : 'hidden',
        ].join(' ')}
      >
        {renderRoutesTable()}
      </section>
    </main>
  );
}
