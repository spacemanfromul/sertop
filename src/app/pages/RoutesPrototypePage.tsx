import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronDown, Copy, Eye, EyeOff, LocateFixed, Minus, Plus, Ruler, Search } from 'lucide-react';

type RoutePoint = [number, number];

declare global {
  interface Window {
    L?: any;
  }
}

const leafletCssUrl = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const leafletScriptUrl = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

const routeWaypoints: RoutePoint[] = [
  [59.93428, 30.3351],
  [60.085, 30.18],
  [60.103, 30.45],
  [59.92, 30.6],
  [59.8, 30.31],
  [59.93428, 30.3351],
];

const fallbackRoutePoints: RoutePoint[] = [
  [59.93428, 30.3351],
  [59.98, 30.27],
  [60.085, 30.18],
  [60.103, 30.45],
  [59.92, 30.6],
  [59.8, 30.31],
  [59.875, 30.29],
  [59.93428, 30.3351],
];

const rows = [
  ['08869064', '2026-05-09 07:06:22', '59.93428, 30.33510', '60.08500, 30.18000', '100 км'],
  ['08869065', '2026-05-09 07:06:22', '60.08500, 30.18000', '60.10300, 30.45000', '100 км'],
  ['08869066', '2026-05-09 07:06:22', '60.10300, 30.45000', '59.92000, 30.60000', '100 км'],
  ['08869067', '2026-05-09 07:06:22', '59.92000, 30.60000', '59.80000, 30.31000', '100 км'],
  ['08869068', '2026-05-09 07:06:22', '59.80000, 30.31000', '59.93428, 30.33510', '100 км'],
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
  const chunks = Math.max(1, Math.min(96, points.length - 1));

  for (let index = 0; index < chunks; index += 1) {
    const startIndex = Math.floor((index / chunks) * (points.length - 1));
    const endIndex = Math.max(startIndex + 1, Math.ceil(((index + 1) / chunks) * (points.length - 1)));
    const segment = points.slice(startIndex, endIndex + 1);

    L.polyline(segment, {
      color: getRouteColor(index / Math.max(chunks - 1, 1)),
      weight: 7,
      opacity: 1,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);
  }
}

function carSvg(rotation = 0) {
  return `
    <div class="route-car-body" style="width:65px;height:65px;transform:rotate(${rotation}deg);transform-origin:center;will-change:transform;">
      <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_154_50690)">
          <g clip-path="url(#clip0_154_50690)">
            <rect x="28.332" y="57.3281" width="29.4023" height="44.1367" transform="rotate(-135 28.332 57.3281)" fill="black"/>
            <path d="M5.73177 48.5345L16.3393 59.142C19.151 61.9538 24.5572 61.1049 27.369 58.2932L58.7648 26.8973C61.5756 24.0865 61.5774 19.5274 58.7657 16.7156L48.1582 6.1081C45.3473 3.29723 40.7873 3.29633 37.9755 6.1081L6.57972 37.5039C3.76976 40.3175 2.92091 45.7236 5.73177 48.5345ZM14.3313 31.5367L24.854 21.014L27.6324 23.1591L23.297 27.4945L14.3313 31.5367ZM12.5424 35.9091C16.977 33.3075 22.2208 30.2341 22.2208 30.2341L34.6406 42.6539L28.9683 52.3349C28.9683 52.3349 18.2318 47.0434 12.5424 35.9091ZM37.6355 41.2647L41.6876 37.2126L43.8354 39.99L33.5933 50.2322L37.6355 41.2647ZM54.7343 29.0912L45.3897 38.4358L43.2365 35.6637L50.6299 28.2703L54.7343 29.0912ZM55.9855 25.0309L50.9754 26.0395L38.5529 13.617L39.5605 8.60595L55.9855 25.0309ZM36.2932 14.4983L29.192 21.5994L26.41 19.4579L35.4741 10.3939L36.2932 14.4983Z" fill="white"/>
          </g>
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

export default function RoutesPrototypePage() {
  const [isTableHidden, setIsTableHidden] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'routes' | 'zones' | 'settings'>('routes');
  const [selectedRow, setSelectedRow] = useState(0);
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const carMarkerRef = useRef<any>(null);
  const carBodyRef = useRef<HTMLElement | null>(null);
  const displayedBearingRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const currentRouteRef = useRef<RoutePoint[]>(fallbackRoutePoints);

  const tabItems = useMemo(
    () => [
      ['requests', 'Заявки'],
      ['routes', 'Маршруты'],
      ['zones', 'Геозоны'],
      ['settings', 'Настройки'],
    ] as const,
    [],
  );

  useEffect(() => {
    let cancelled = false;
    const routeRequestController = new AbortController();

    loadLeaflet()
      .then(async (L) => {
        if (cancelled || !mapRef.current || leafletMapRef.current) {
          return;
        }

        const roadRoute = await fetchRoadRoute(routeRequestController.signal).catch(() => fallbackRoutePoints);
        if (cancelled) {
          return;
        }
        currentRouteRef.current = roadRoute;

        const map = L.map(mapRef.current, {
          center: [59.9382, 30.337],
          zoom: 14,
          zoomControl: false,
          attributionControl: false,
        });
        leafletMapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          crossOrigin: true,
          className: 'prototype-map-tiles',
        }).addTo(map);

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
        const carIcon = L.divIcon({
          className: 'route-car-marker',
          html: carSvg(initial.bearing + 135),
          iconSize: [65, 65],
          iconAnchor: [32.5, 32.5],
        });
        carMarkerRef.current = L.marker(initial.point, { icon: carIcon, interactive: false }).addTo(map);
        carBodyRef.current = carMarkerRef.current.getElement()?.querySelector('.route-car-body') ?? null;
        map.fitBounds(L.latLngBounds(roadRoute), { paddingTopLeft: [80, 80], paddingBottomRight: [80, 150] });

        const duration = 76000;
        const startedAt = performance.now();
        const animate = (now: number) => {
          const progress = ((now - startedAt) % duration) / duration;
          const { point, bearing } = interpolateRoute(roadRoute, progress, routeMetrics);
          carMarkerRef.current.setLatLng(point);
          const currentBearing = displayedBearingRef.current;
          const bearingDelta = ((((bearing - currentBearing) % 360) + 540) % 360) - 180;
          displayedBearingRef.current = currentBearing + bearingDelta * 0.08;
          if (!carBodyRef.current) {
            carBodyRef.current = carMarkerRef.current.getElement()?.querySelector('.route-car-body') ?? null;
          }
          if (carBodyRef.current) {
            carBodyRef.current.style.transform = `rotate(${displayedBearingRef.current + 135}deg)`;
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
        .leaflet-container {
          background: #eef5f7;
          font-family: Roboto, Arial, sans-serif;
        }
        .prototype-map-tiles {
          filter: saturate(.86) contrast(.96) brightness(1.02);
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

        <div className="absolute bottom-4 left-5 z-[500] flex items-center gap-3">
          <div className="flex h-11 w-[280px] items-center gap-2 rounded-xl bg-white px-4 shadow-[0_4px_14px_rgba(0,0,0,0.12)]">
            <span className="truncate text-sm">Александров Кирилл Николаевич</span>
            <button className="ml-auto text-black/35" type="button" aria-label="Очистить">x</button>
          </div>
          <button className="flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm shadow-[0_4px_14px_rgba(0,0,0,0.12)]" type="button">
            2026-05-09
            <CalendarDays className="size-4 text-black/45" />
          </button>
        </div>

        <button
          className="absolute bottom-4 right-5 z-[500] flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#f8f8f8]"
          type="button"
          onClick={() => setIsTableHidden((value) => !value)}
        >
          {isTableHidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          {isTableHidden ? 'Показать' : 'Скрыть'}
        </button>

        <div className="absolute right-5 top-[26%] z-[500] flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_4px_14px_rgba(0,0,0,0.12)]">
          <button className="flex size-11 items-center justify-center border-b border-black/5" type="button"><Copy className="size-5" /></button>
          <button className="flex size-11 items-center justify-center border-b border-black/5" type="button"><Ruler className="size-5" /></button>
          <button className="flex size-11 items-center justify-center border-b border-black/5" type="button" onClick={() => leafletMapRef.current?.zoomIn()}><Plus className="size-5" /></button>
          <button className="flex size-11 items-center justify-center border-b border-black/5" type="button" onClick={() => leafletMapRef.current?.zoomOut()}><Minus className="size-5" /></button>
          <button className="flex size-11 items-center justify-center" type="button" onClick={() => leafletMapRef.current?.fitBounds(window.L.latLngBounds(currentRouteRef.current), { padding: [80, 80] })}><LocateFixed className="size-5" /></button>
        </div>
      </section>

      <section
        className={[
          'absolute inset-x-0 bottom-0 z-[550] h-[34%] overflow-hidden rounded-t-[20px] border border-black/10 bg-white shadow-[0_-10px_28px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-out',
          isTableHidden ? 'translate-y-[calc(100%-20px)]' : 'translate-y-0',
        ].join(' ')}
      >
        <div className="flex h-16 items-center gap-4 border-b border-black/10 px-5">
          <div className="flex h-10 w-[340px] items-center gap-2 rounded-lg border border-black/10 px-3 text-black/45">
            <Search className="size-4" />
            <span className="text-sm">ФИО инженера</span>
          </div>
          <button className="flex h-10 items-center gap-2 rounded-lg border border-black/10 px-4 text-sm" type="button">
            Фильтры
            <ChevronDown className="size-4" />
          </button>
          <button className="flex h-10 items-center gap-2 rounded-lg border border-black/10 px-4 text-sm" type="button">
            Отображение столбцов
            <ChevronDown className="size-4" />
          </button>
        </div>

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
