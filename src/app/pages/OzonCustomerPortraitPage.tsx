import { createContext, useContext, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { useRive } from '@rive-app/react-canvas';
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ReactECharts from 'echarts-for-react';
import { useIsMobile } from '../components/ui/use-mobile';
import { SellerButton, SellerCard } from '../components/SellerUi';
import * as echarts from 'echarts';
import { ChevronDown, ChevronLeft, CircleHelp, FileSpreadsheet, FileText, GripVertical, Map as MapIcon, MoreHorizontal, Sparkles, X } from 'lucide-react';
import ozonSellerLogo from '../../assets/ozon-seller-logo.svg';
import customerPortraitPhoto from '../../assets/ozon-customer-portrait.webp';
import friendlyFloatingBotUrl from '../../assets/ozon/friendly-floating-bot.riv?url';
import { customerPortraitData, sellerNavItems } from './customerPortraitData';

const segments = ['Постоянные', 'Новые', 'Потенциальные', 'Не завершили заказ', 'Сохранённые сегменты', 'Конструктор сегментов'];

function preventHangingWords(text: string) {
  return text
    .replace(/(?<=\d)[ \u202f](?=\d{3}(?:\D|$))/gu, '\u00a0')
    .replace(/(?<=\d)\s*([-–—])\s*(?=\d)/gu, '$1')
    .replace(/(^|[\s(«„"'])(в|во|и|а|но|на|по|за|из|к|ко|с|со|у|о|об|от|до|для|при|без|над|под|про|через|как|что|чтобы|или|либо|не|ни|ещё|уже|только|даже|ведь|лишь)\s+(?=\S)/giu, '$1$2\u00a0')
    .replace(/\s+(бы|б|же|ж|ли)(?=\s|[,.!?;:—–-]|$)/giu, '\u00a0$1')
    .replace(/(\d+(?:\u00a0\d{3})*(?:[-–—]\d+(?:\u00a0\d{3})*)?%?)\s+(?=[\p{L}₽])/gu, '$1\u00a0');
}

function formatText(children: React.ReactNode) {
  return typeof children === 'string' ? preventHangingWords(children) : children;
}

function ResponsiveEChart({
  containerClassName = '',
  resizeReady = true,
  ...props
}: React.ComponentProps<typeof ReactECharts> & { containerClassName?: string; resizeReady?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReactECharts>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !resizeReady || typeof ResizeObserver === 'undefined') return;

    let animationFrame = 0;
    let debounceTimer = 0;
    let retryTimer = 0;
    let previousWidth = -1;
    let previousHeight = -1;

    const resizeChart = (allowRetry = true) => {
      const currentContainer = containerRef.current;
      if (!currentContainer) return;

      const { width, height } = currentContainer.getBoundingClientRect();
      if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return;

      const chart = chartRef.current?.getEchartsInstance();
      if (!chart || chart.isDisposed()) return;

      try {
        chart.resize({ width: Math.round(width), height: Math.round(height), silent: true });
      } catch {
        if (!allowRetry) return;
        window.clearTimeout(retryTimer);
        retryTimer = window.setTimeout(() => resizeChart(false), 120);
      }
    };

    const scheduleResize = () => {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(() => {
          animationFrame = requestAnimationFrame(() => resizeChart());
        });
      }, 80);
    };

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return;
      if (width === previousWidth && height === previousHeight) return;
      previousWidth = width;
      previousHeight = height;
      scheduleResize();
    });

    observer.observe(container);
    scheduleResize();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(debounceTimer);
      window.clearTimeout(retryTimer);
    };
  }, [resizeReady]);

  return (
    <div ref={containerRef} className={`min-w-0 w-full ${containerClassName}`}>
      <ReactECharts ref={chartRef} autoResize={false} {...props} />
    </div>
  );
}

function sanitizeGeoOption(option: object): echarts.EChartsOption {
  const layoutKeys = ['layoutCenter', 'layoutSize', 'center', 'zoom'] as const;
  const cleanLayout = (value: unknown) => {
    if (!value || typeof value !== 'object') return value;
    const next = { ...(value as Record<string, unknown>) };
    layoutKeys.forEach((key) => {
      if (next[key] == null) delete next[key];
    });
    return next;
  };
  const next = { ...(option as Record<string, unknown>) };
  if (Array.isArray(next.geo)) next.geo = next.geo.map(cleanLayout);
  else if (next.geo) next.geo = cleanLayout(next.geo);
  if (Array.isArray(next.series)) next.series = next.series.map(cleanLayout);
  return next as echarts.EChartsOption;
}

type GeoCallout = { coord: [number, number]; value: number; regionLabel: string };
type GeoCalloutLayout = GeoCallout & { anchorX: number; anchorY: number; x: number; y: number; width: number; height: number };

function resolveGeoCalloutLayout(callouts: Array<GeoCallout & { anchorX: number; anchorY: number }>, width: number, height: number): GeoCalloutLayout[] {
  const padding = 8;
  const collisionGap = 8;
  const nodes = callouts.map((callout) => {
    const labelWidth = Math.min(204, Math.max(102, callout.regionLabel.length * 7.1 + 54));
    const labelHeight = 30;
    const placeRight = callout.anchorX < width / 2;
    return {
      ...callout,
      width: labelWidth,
      height: labelHeight,
      x: placeRight ? callout.anchorX + 20 : callout.anchorX - labelWidth - 20,
      y: callout.anchorY - labelHeight / 2,
    };
  });

  nodes.forEach((node) => {
    node.x = Math.min(Math.max(padding, node.x), Math.max(padding, width - node.width - padding));
    node.y = Math.min(Math.max(padding, node.y), Math.max(padding, height - node.height - padding));
  });

  // A deterministic collision layout is more stable than a live force
  // simulation while the map is being dragged or zoomed.
  nodes.sort((a, b) => a.anchorY - b.anchorY || a.anchorX - b.anchorX);
  for (let index = 1; index < nodes.length; index += 1) {
    const previous = nodes[index - 1];
    nodes[index].y = Math.max(nodes[index].y, previous.y + previous.height + collisionGap);
  }

  const bottom = height - padding;
  if (nodes.length && nodes[nodes.length - 1].y + nodes[nodes.length - 1].height > bottom) {
    nodes[nodes.length - 1].y = bottom - nodes[nodes.length - 1].height;
    for (let index = nodes.length - 2; index >= 0; index -= 1) {
      nodes[index].y = Math.min(nodes[index].y, nodes[index + 1].y - nodes[index].height - collisionGap);
    }
  }

  if (nodes.length && nodes[0].y < padding) {
    nodes[0].y = padding;
    for (let index = 1; index < nodes.length; index += 1) {
      nodes[index].y = Math.max(nodes[index].y, nodes[index - 1].y + nodes[index - 1].height + collisionGap);
    }
  }

  return nodes;
}

function SafeGeoEChart({
  option,
  className = '',
  resizeReady,
  onRegionClick,
  onViewStateChange,
  callouts = [],
}: {
  option: object;
  className?: string;
  resizeReady: boolean;
  onRegionClick?: (params: { name?: string }) => void;
  onViewStateChange?: (view: { center?: [number, number]; zoom: number }) => void;
  callouts?: GeoCallout[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const optionRef = useRef(option);
  const clickHandlerRef = useRef(onRegionClick);
  const viewStateHandlerRef = useRef(onViewStateChange);
  const calloutsRef = useRef(callouts);
  const [calloutLayout, setCalloutLayout] = useState<GeoCalloutLayout[]>([]);

  optionRef.current = option;
  clickHandlerRef.current = onRegionClick;
  viewStateHandlerRef.current = onViewStateChange;
  calloutsRef.current = callouts;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !resizeReady || typeof ResizeObserver === 'undefined') return;

    let disposed = false;
    let debounceTimer = 0;
    let retryTimer = 0;
    let animationFrame = 0;

    const hasSize = () => container.clientWidth > 0 && container.clientHeight > 0;

    const updateCallouts = () => {
      const chart = chartRef.current;
      if (!chart || chart.isDisposed() || !hasSize()) return;
      const anchors = calloutsRef.current.flatMap((callout) => {
        try {
          const point = chart.convertToPixel({ seriesIndex: 0 }, callout.coord) as [number, number];
          return Number.isFinite(point?.[0]) && Number.isFinite(point?.[1]) ? [{ ...callout, anchorX: point[0], anchorY: point[1] }] : [];
        } catch {
          return [];
        }
      });
      setCalloutLayout(resolveGeoCalloutLayout(anchors, container.clientWidth, container.clientHeight));
    };

    const applyOption = () => {
      const chart = chartRef.current;
      if (!chart || chart.isDisposed() || !hasSize() || !echarts.getMap('russia-regions')) return;
      chart.clear();
      chart.setOption(sanitizeGeoOption(optionRef.current), { notMerge: true, lazyUpdate: false });
      requestAnimationFrame(updateCallouts);
    };

    const initialize = () => {
      if (disposed || !hasSize() || !echarts.getMap('russia-regions')) return;
      const currentChart = chartRef.current;
      if (currentChart && !currentChart.isDisposed()) currentChart.dispose();

      const chart = echarts.init(container, undefined, { renderer: 'svg' });
      chartRef.current = chart;
      chart.on('click', (params) => clickHandlerRef.current?.(params as { name?: string }));
      chart.on('georoam', () => {
        const series = (chart.getOption().series as Array<{ center?: [number, number]; zoom?: number }> | undefined)?.[0];
        if (!series) return;
        viewStateHandlerRef.current?.({ center: Array.isArray(series.center) ? series.center : undefined, zoom: typeof series.zoom === 'number' ? series.zoom : 1 });
        requestAnimationFrame(updateCallouts);
      });
      applyOption();
    };

    const scheduleStableUpdate = () => {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(() => {
          animationFrame = requestAnimationFrame(() => {
            if (disposed || !hasSize()) return;
            const chart = chartRef.current;
            if (!chart || chart.isDisposed()) {
              initialize();
              return;
            }
            try {
              chart.resize({ width: container.clientWidth, height: container.clientHeight, silent: true });
              applyOption();
            } catch {
              window.clearTimeout(retryTimer);
              retryTimer = window.setTimeout(initialize, 120);
            }
          });
        });
      }, 100);
    };

    const observer = new ResizeObserver(([entry]) => {
      if (!entry || entry.contentRect.width <= 0 || entry.contentRect.height <= 0) return;
      scheduleStableUpdate();
    });

    observer.observe(container);
    scheduleStableUpdate();

    return () => {
      disposed = true;
      observer.disconnect();
      window.clearTimeout(debounceTimer);
      window.clearTimeout(retryTimer);
      cancelAnimationFrame(animationFrame);
      const chart = chartRef.current;
      if (chart && !chart.isDisposed()) chart.dispose();
      chartRef.current = null;
    };
  }, [resizeReady]);

  useEffect(() => {
    const container = containerRef.current;
    const chart = chartRef.current;
    if (!resizeReady || !container || container.clientWidth <= 0 || container.clientHeight <= 0 || !chart || chart.isDisposed()) return;

    const timer = window.setTimeout(() => {
      if (chart.isDisposed() || container.clientWidth <= 0 || container.clientHeight <= 0 || !echarts.getMap('russia-regions')) return;
      try {
        chart.clear();
        chart.setOption(sanitizeGeoOption(optionRef.current), { notMerge: true, lazyUpdate: false });
        requestAnimationFrame(() => {
          const activeChart = chartRef.current;
          if (!activeChart || activeChart.isDisposed()) return;
          const anchors = calloutsRef.current.flatMap((callout) => {
            try {
              const point = activeChart.convertToPixel({ seriesIndex: 0 }, callout.coord) as [number, number];
              return Number.isFinite(point?.[0]) && Number.isFinite(point?.[1]) ? [{ ...callout, anchorX: point[0], anchorY: point[1] }] : [];
            } catch {
              return [];
            }
          });
          setCalloutLayout(resolveGeoCalloutLayout(anchors, container.clientWidth, container.clientHeight));
        });
      } catch {
        // A pending resize will safely recreate the Geo instance once the container is stable.
      }
    }, 100);
    return () => window.clearTimeout(timer);
  }, [option, resizeReady]);

  return <div className={`relative min-h-0 min-w-0 w-full ${className}`}>
    <div ref={containerRef} className="absolute inset-0" />
    <svg className="pointer-events-none absolute inset-0 size-full overflow-visible" aria-hidden="true">
      {calloutLayout.map((callout) => {
        const lineX = Math.min(Math.max(callout.anchorX, callout.x), callout.x + callout.width);
        const lineY = Math.min(Math.max(callout.anchorY, callout.y), callout.y + callout.height);
        return <line key={`${callout.regionLabel}-line`} x1={callout.anchorX} y1={callout.anchorY} x2={lineX} y2={lineY} stroke="#8da3b8" strokeWidth="1" opacity="0.72" />;
      })}
    </svg>
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {calloutLayout.map((callout) => <div
        key={callout.regionLabel}
        className="absolute whitespace-nowrap rounded-[7px] border border-[#d8dde4] bg-white px-2 py-[5px] text-[13px] font-semibold leading-[18px] text-[#001122f2] shadow-[0_2px_8px_rgba(0,17,34,0.08)]"
        style={{ left: callout.x, top: callout.y, width: callout.width }}
      >{callout.regionLabel} · {callout.value}%</div>)}
    </div>
  </div>;
}

function IconAction({ label, children }: { label: string; children: React.ReactNode }) {
  return <button type="button" aria-label={label} className="grid size-10 place-items-center rounded-lg text-[#00112273] transition-colors hover:bg-[#6183a21a] hover:text-[#001122f2]">{children}</button>;
}

function ProfileIcon() {
  return <svg className="size-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21C17.5842 21 21 17.5842 21 12C21 6.4158 17.5842 3 12 3C6.4158 3 3 6.4158 3 12C3 17.5842 6.4158 21 12 21ZM12 6C13.8 6 15 7.2 15 9C15 10.8 13.8 12 12 12C10.2 12 9 10.8 9 9C9 7.2 10.2 6 12 6ZM9.18751 13C9.57504 13.0015 9.80238 13.1238 10.0682 13.2667C10.4454 13.4697 10.9001 13.7143 12 13.7143C13.0983 13.7143 13.5533 13.4692 13.9302 13.2661C14.1967 13.1226 14.4242 13 14.8125 13C15.4375 13 17 14.7857 17 15.5C17 16.2143 15.4266 18 11.9946 18C8.5625 18 7 16.2143 7 15.5C7 14.7857 8.5625 12.9977 9.18751 13Z" /></svg>;
}

function MessagesIcon() {
  return <svg className="size-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 12.5C3 6.5 4 5 10 5h4c6 0 7 1.5 7 7.5 0 5.836-1 6.5-7 6.5H8c-.692 1.025-1.822 2-3 2-2 0-2-5.5-2-8.5Zm5 .5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm5-1a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" /></svg>;
}

function SupportIcon() {
  return <svg className="size-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21c5.584 0 9-3.416 9-9s-3.416-9-9-9-9 3.416-9 9 3.416 9 9 9m-1-11a1 1 0 1 1-2 0c0-.649.16-1.404.67-2.015C10.204 7.342 11.01 7 12 7s1.795.342 2.33.985c.51.61.67 1.366.67 2.015 0 .99-.541 1.603-1 1.99a3 3 0 0 1-.316.216c-.32.2-.684.429-.684.794a1 1 0 1 1-2 0c0-1.257.875-1.909 1.342-2.257.489-.364.956-.873.452-1.478C12.705 9.158 12.51 9 12 9c-.664 0-1 .341-1 1m2 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0" /></svg>;
}

function TrainingIcon() {
  return <svg className="size-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 8.5C2 6.813 9.5 4 12 4c2.1 0 7.729 1.985 9.476 3.62A1 1 0 0 1 22 8.5V12a1 1 0 1 1-2 0v-1.604C17.596 11.737 13.675 13 12 13 9.5 13 2 10.188 2 8.5" /><path d="M12 19c-5.568 0-7-1-7-6 0-.562.493-.764.993-.562 1.038.418 2.127.787 3.121 1.06 1.076.296 2.12.502 2.886.502.765 0 1.81-.206 2.886-.502a29 29 0 0 0 3.12-1.06c.501-.202.994 0 .994.562 0 5-1.432 6-7 6m9-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2" /></svg>;
}

function NotificationsIcon() {
  return <svg className="size-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 4C13 3.44772 12.5523 3 12 3C11.4477 3 11 3.44772 11 4C7.33114 4.3927 6.65279 7.03586 6.1079 9.11821C5.91732 9.84651 5.74307 10.5124 5.46291 11C5.29239 11.2968 5.09424 11.5495 4.89986 11.7975C4.4393 12.3849 4 12.9452 4 14C3.99998 16 6.99107 18 12 18C17.0089 18 20 16 20 14C20 12.9496 19.5524 12.3896 19.085 11.8048C18.885 11.5545 18.6813 11.2997 18.5076 11C18.2223 10.5077 18.0479 9.83368 17.8573 9.09717C17.3196 7.01851 16.6531 4.39152 13 4Z" /><path d="M9.30324 19C8.94643 18.9786 8.93152 19.4088 9.13668 19.701C9.68323 20.4796 10.8712 21 12 21C13.1436 21 14.3291 20.4662 14.8711 19.6705C15.0716 19.376 15.0524 18.975 14.6965 19.0003C14.6965 19.0003 13.5134 19.1875 12 19.1875C10.5031 19.1875 9.30324 19 9.30324 19Z" /></svg>;
}

function MobileHomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" {...props}><path d="M9.92195 16.3707C9.92177 14.8086 9.92195 13.7711 11.9999 13.7793C14.0778 13.7876 14.0785 14.8086 14.0781 16.3707L14.0776 17.9316C14.0781 18.9683 14.0776 19.3992 14.3819 19.7032C14.6863 20.0073 15.1171 20.0073 16.1561 20.0073C18.2342 20.0073 19.2727 20.0073 19.7922 19.4882C20.3117 18.9691 20.3122 17.2289 20.3122 14.2926C20.3122 13.2545 20.3353 10.664 19.9403 9.79429C19.5676 8.9735 18.6502 7.77796 17.1947 6.51144C15.4061 4.95499 12.988 3.38281 11.9999 3.38281C11.0118 3.38281 8.59343 4.95499 6.8048 6.51144C5.34933 7.77796 4.43194 8.9735 4.05918 9.79429C3.66418 10.664 3.68777 13.2545 3.68777 14.2926C3.68777 17.2289 3.68777 18.9691 4.2073 19.4882C4.72682 20.0073 5.76583 20.0073 7.84389 20.0073C8.88292 20.0073 9.31323 20.0073 9.61755 19.7032C9.92187 19.3992 9.92195 18.9683 9.92187 17.9316L9.92195 16.3707Z" fill="currentColor" /></svg>;
}

function MobileMenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" {...props}><path d="M3.75 7.41667C3.75 4.39717 4.39717 3.75 7.41667 3.75C10.4362 3.75 11.0833 4.39717 11.0833 7.41667C11.0833 10.4362 10.4362 11.0833 7.41667 11.0833C4.39717 11.0833 3.75 10.4362 3.75 7.41667Z" fill="currentColor" /><path d="M3.75 16.5833C3.75 13.5638 4.39717 12.9167 7.41667 12.9167C10.4362 12.9167 11.0833 13.5638 11.0833 16.5833C11.0833 19.6028 10.4362 20.25 7.41667 20.25C4.39717 20.25 3.75 19.6028 3.75 16.5833Z" fill="currentColor" /><path d="M16.5833 3.75C13.5638 3.75 12.9167 4.39717 12.9167 7.41667C12.9167 10.4362 13.5638 11.0833 16.5833 11.0833C19.6028 11.0833 20.25 10.4362 20.25 7.41667C20.25 4.39717 19.6028 3.75 16.5833 3.75Z" fill="currentColor" /><path d="M12.9167 16.5833C12.9167 13.5638 13.5638 12.9167 16.5833 12.9167C19.6028 12.9167 20.25 13.5638 20.25 16.5833C20.25 19.6028 19.6028 20.25 16.5833 20.25C13.5638 20.25 12.9167 19.6028 12.9167 16.5833Z" fill="currentColor" /></svg>;
}

function MobileFavoritesIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 22c-.316-.02-.56-.147-.848-.278a23.5 23.5 0 0 1-4.781-2.942C3.777 16.705 1 13.449 1 9a6 6 0 0 1 6-6 6.18 6.18 0 0 1 5 2.568A6.18 6.18 0 0 1 17 3a6 6 0 0 1 6 6c0 4.448-2.78 7.705-5.375 9.78a23.6 23.6 0 0 1-4.78 2.942c-.543.249-.732.278-.845.278" clipRule="evenodd" /></svg>;
}

function MobileInterestIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" {...props}><path fill="currentColor" d="M14.692 5.694c.368-.205.365-.469-.009-.664C13.367 4.343 12.708 4 12 4s-1.367.343-2.683 1.03l-2 1.044c-1.614.842-2.42 1.263-2.869 2.02C4 8.85 4 9.79 4 11.673v1.652c0 1.883 0 2.824.448 3.58s1.255 1.178 2.869 2.02l2 1.044C10.633 20.657 11.292 21 12 21s1.367-.343 2.683-1.03l2-1.044c1.614-.842 2.42-1.263 2.869-2.02.448-.756.448-1.697.448-3.58v-1.652c0-1.883 0-2.824-.448-3.58-.329-.556-.851-.93-1.744-1.423-.367-.203-.389-.204-.763.004L11 10c-.344.19-.739.394-.91.77-.09.197-.09.375-.09.73V14a1 1 0 0 1-2 0v-4a1 1 0 0 1 .514-.874z" /></svg>;
}

function CustomerLocationIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" {...props}><path fill="currentColor" d="M12 3c-4.5 0-8 3-8 8 0 6 6.5 10 8 10s8-4 8-10c0-5-3.5-8-8-8m0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6" /></svg>;
}

function MobileCartIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" {...props}><path fill="currentColor" d="M9.925 5.371a1 1 0 1 0-1.858-.742L6.317 9h-1.2c-1.076 0-1.614 0-1.913.346-.3.346-.222.878-.067 1.942l.271 1.864c.475 3.265.902 4.898 2.03 5.873s2.778.975 6.08.975h.96c3.302 0 4.953 0 6.08-.975 1.128-.975 1.559-2.608 2.034-5.873l.271-1.864c.155-1.064.233-1.596-.067-1.942S19.96 9 18.883 9h-1.205l-1.75-4.371a1 1 0 0 0-1.857.742L15.523 9h-7.05zM10.997 14v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 2 0M14 13a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1" /></svg>;
}

function ChartListIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 16 16" fill="none" {...props}><path fill="currentColor" d="M7 11a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2zm2-4a1 1 0 0 1 0 2H3a1 1 0 1 1 0-2zm4-4a1 1 0 1 1 0 2H3a1 1 0 0 1 0-2z" /></svg>;
}

function CartFilterIcon() {
  return <svg className="size-6 shrink-0 text-[#4b667e87]" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill="currentColor" d="M9.925 5.371a1 1 0 1 0-1.858-.742L6.317 9h-1.2c-1.076 0-1.614 0-1.913.346-.3.346-.222.878-.067 1.942l.271 1.864c.475 3.265.902 4.898 2.03 5.873s2.778.975 6.08.975h.96c3.302 0 4.953 0 6.08-.975 1.128-.975 1.559-2.608 2.034-5.873l.271-1.864c.155-1.064.233-1.596-.067-1.942S19.96 9 18.883 9h-1.205l-1.75-4.371a1 1 0 0 0-1.857.742L15.523 9h-7.05zM10.997 14v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 2 0M14 13a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1" /></svg>;
}

function FavoritesFilterIcon() {
  return <svg className="size-6 shrink-0 text-[#4b667e87]" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill="currentColor" fillRule="evenodd" d="M12 22c-.316-.02-.56-.147-.848-.278a23.5 23.5 0 0 1-4.781-2.942C3.777 16.705 1 13.449 1 9a6 6 0 0 1 6-6 6.18 6.18 0 0 1 5 2.568A6.18 6.18 0 0 1 17 3a6 6 0 0 1 6 6c0 4.448-2.78 7.705-5.375 9.78a23.6 23.6 0 0 1-4.78 2.942c-.543.249-.732.278-.845.278" clipRule="evenodd" /></svg>;
}

function MobileHeaderFilters() {
  const [source, setSource] = useState<'all' | 'cart' | 'favorites'>('all');
  const filters = [
    { id: 'all' as const, label: 'Все не завершившие заказ', icon: null },
    { id: 'cart' as const, label: 'Добавили товары в корзину', icon: CartFilterIcon },
    { id: 'favorites' as const, label: 'Добавили товары в «Избранное»', icon: FavoritesFilterIcon },
  ];

  return <div className="flex gap-1 overflow-x-auto px-4 pb-3 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    {filters.map(({ id, label, icon: Icon }) => {
      const isActive = source === id;
      return <button key={id} type="button" aria-pressed={isActive} onClick={() => setSource(id)} className={`flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-[13px] font-semibold leading-5 transition-colors ${isActive ? 'bg-[#25282b] text-white' : 'bg-[#f1f3f5] text-[#001a34]'}`}>
        {Icon ? <Icon /> : null}
        <span>{preventHangingWords(label)}</span>
      </button>;
    })}
  </div>;
}

function MobileAudienceSummary() {
  return <section className="mx-4 mb-3 grid grid-cols-2 items-center rounded-xl border border-[#d8dde4] bg-white px-3 py-2.5">
    <div className="pr-3 text-right text-[32px] font-semibold leading-none text-[#001122f2]">{preventHangingWords(customerPortraitData.reach)}</div>
    <p className="min-w-0 border-l border-[#d8dde4] pl-3 text-[13px] leading-[18px] text-[#60758a]">{preventHangingWords('Количество человек, не завершивших заказ за последние 90 дней')}</p>
  </section>;
}

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileTabsRef = useRef<HTMLDivElement>(null);
  const activeMobileTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 16);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  useEffect(() => {
    if (isScrolled) return;
    const animationFrame = requestAnimationFrame(() => {
      const container = mobileTabsRef.current;
      const activeTab = activeMobileTabRef.current;
      if (!container || !activeTab) return;
      container.scrollTo({ left: activeTab.offsetLeft - (container.clientWidth - activeTab.clientWidth) / 2, behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(animationFrame);
  }, [isScrolled]);

  return (
    <header className="sticky top-0 z-[1000] w-full shrink-0 self-start rounded-b-2xl bg-white pt-[env(safe-area-inset-top)] font-['Onest',Arial,sans-serif] text-[#001122f2] shadow-[0_8px_20px_rgba(0,17,34,0.06)] md:static md:z-auto md:rounded-none md:pt-0 md:shadow-none">
      <div className="relative mx-auto flex h-14 w-full max-w-[1280px] items-center justify-center px-4 md:justify-between md:px-4">
        <button type="button" aria-label="Назад" className="absolute left-3 grid size-10 place-items-center rounded-full text-[#7f91a3] transition-colors hover:bg-[#6183a21a] md:hidden">
          <svg className="size-6" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15.5992 4.47933C16.1629 5.0864 16.1277 6.03549 15.5207 6.5992L9.70442 12L15.5207 17.4008C16.1277 17.9645 16.1629 18.9136 15.5992 19.5207C15.0355 20.1278 14.0864 20.1629 13.4793 19.5992L6.47932 13.0992C6.17367 12.8154 6 12.4171 6 12C6 11.5829 6.17367 11.1846 6.47932 10.9008L13.4793 4.40082C14.0864 3.83711 15.0355 3.87226 15.5992 4.47933Z" fill="currentColor" /></svg>
        </button>
        <button type="button" aria-expanded={!isScrolled} onClick={() => setIsScrolled((current) => !current)} className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2 py-1 text-[17px] font-semibold leading-6 transition-colors active:bg-[#6183a21a] md:hidden">Портрет покупателя</button>
        <button type="button" aria-label="Добавить" className="absolute right-12 grid size-10 place-items-center rounded-full text-[#7f91a3] transition-colors active:bg-[#6183a21a] md:hidden">
          <svg className="size-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21c5.584 0 9-3.416 9-9s-3.416-9-9-9-9 3.416-9 9 3.416 9 9 9Zm1-12v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2H9a1 1 0 1 1 0-2h2V9a1 1 0 1 1 2 0Z" /></svg>
        </button>
        <details className="group absolute right-2 md:hidden">
          <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-full text-[#7f91a3] transition-colors hover:bg-[#6183a21a] [&::-webkit-details-marker]:hidden" aria-label="Дополнительные действия">
            <MoreHorizontal className="size-6" />
          </summary>
          <div className="absolute right-0 top-12 z-50 min-w-[220px] rounded-xl border border-[#d8dde4] bg-white p-1.5 shadow-[0_12px_32px_rgba(0,17,34,0.16)]">
            {['Прочитать о разделе', 'Пройти обучение', 'Оставить отзыв'].map((action) => <button key={action} type="button" className="w-full rounded-lg px-3 py-2.5 text-left text-[14px] font-medium text-[#001122f2] transition-colors hover:bg-[#6183a21a]">{action}</button>)}
          </div>
        </details>
        <img className="hidden h-5 w-auto shrink-0 md:block" src={ozonSellerLogo} alt="Ozon Seller" />
        <div className="hidden items-center gap-1 text-[15px] md:flex"><button className="hidden h-10 items-center gap-2 px-3 lg:flex" type="button">Мой магазин <ChevronDown className="size-4" /></button><IconAction label="Сообщения"><MessagesIcon /></IconAction><IconAction label="Поддержка"><SupportIcon /></IconAction><IconAction label="Уведомления"><NotificationsIcon /></IconAction><IconAction label="Профиль"><ProfileIcon /></IconAction></div>
      </div>
      {!isScrolled && <div className="md:hidden">
        <div ref={mobileTabsRef} className="relative flex min-w-0 overflow-x-auto border-b border-[#d8dde4] px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {segments.map((segment) => {
            const isActive = segment === 'Не завершили заказ';
            return <button ref={isActive ? activeMobileTabRef : undefined} key={segment} type="button" className={`relative z-[1] h-11 shrink-0 px-3 text-center text-[14px] ${isActive ? 'font-semibold text-[#001a34]' : 'font-medium text-[#7f91a3]'}`}>
              {preventHangingWords(segment)}
              {isActive && <span className="absolute inset-x-3 bottom-0 z-[2] h-0.5 rounded-full bg-[#001a34]" />}
            </button>;
          })}
        </div>
        <MobileHeaderFilters />
        <MobileAudienceSummary />
      </div>}
      <nav className="relative mx-auto hidden min-h-12 w-full max-w-[1280px] items-end overflow-x-auto px-5 after:absolute after:inset-x-5 after:bottom-0 after:h-0.5 after:rounded-px after:bg-[#001a331f] after:content-[''] md:flex md:px-4 md:after:inset-x-4">
        {sellerNavItems.map((item) => { const isActive = item === 'Покупатели'; return <button key={item} type="button" className={`relative min-h-11 shrink-0 px-3 pb-[11px] pt-[9px] text-[15px] font-normal leading-6 tracking-[0] transition-colors hover:text-[#005bff] ${isActive ? 'text-[#070707]' : 'text-[#001a3399]'}`}>{preventHangingWords(item)}{isActive && <span className="absolute inset-x-3 bottom-0 z-[1] h-0.5 rounded-px bg-[#005bff]" />}</button>; })}
      </nav>
    </header>
  );
}

function MobileBottomNav() {
  const items = [
    { label: 'Главная', icon: MobileHomeIcon },
    { label: 'Заказы', icon: MobileInterestIcon },
    { label: 'Чаты', icon: MessagesIcon, badge: '1' },
    { label: 'Товары', icon: MobileCartIcon },
    { label: 'Меню', icon: MobileMenuIcon, active: true },
  ];

  return <nav className="fixed bottom-0 left-0 right-0 z-[1100] grid min-h-[64px] w-[100dvw] max-w-full grid-cols-[repeat(5,minmax(0,1fr))] border-t border-[#e5e9f0] bg-white/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(0,17,34,0.06)] backdrop-blur [transform:translateZ(0)] md:hidden" aria-label="Основная навигация">
    {items.map(({ label, icon: Icon, badge, active }) => <button key={label} type="button" className={`relative flex w-full min-w-0 flex-col items-center gap-1 text-[11px] font-medium leading-4 ${active ? 'text-[#2b74f7]' : 'text-[#7f91a3]'}`}>
      <span className="relative grid size-6 place-items-center"><Icon className="size-6" aria-hidden="true" />{badge && <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-[#f8104b] text-[10px] font-semibold text-white">{badge}</span>}</span>
      <span>{label}</span>
    </button>)}
  </nav>;
}

const Card = SellerCard;

type CardDragHandleContextValue = Pick<ReturnType<typeof useSortable>, 'attributes' | 'isDragging' | 'listeners'>;

const CardDragHandleContext = createContext<CardDragHandleContextValue | null>(null);

function CardTitle({ children }: { children: React.ReactNode }) {
  const dragHandle = useContext(CardDragHandleContext);
  const formattedTitle = formatText(children);
  const lastSpaceIndex = typeof formattedTitle === 'string' ? formattedTitle.lastIndexOf(' ') : -1;
  const titlePrefix = typeof formattedTitle === 'string' && lastSpaceIndex >= 0 ? formattedTitle.slice(0, lastSpaceIndex + 1) : '';
  const titleEnding = typeof formattedTitle === 'string' && lastSpaceIndex >= 0 ? formattedTitle.slice(lastSpaceIndex + 1) : formattedTitle;

  return (
    <div className="flex items-start justify-between gap-3">
      <h2 className="min-w-0 flex-1 whitespace-normal pr-2 text-[16px] font-semibold leading-6 text-[#001122f2] md:text-[17px] md:leading-7">
        {titlePrefix}
        <span className="inline-flex whitespace-nowrap">
          {titleEnding}
          <CircleHelp className="ml-2 hidden size-4 shrink-0 self-center text-[#00112273] md:block" />
        </span>
      </h2>
      {dragHandle && (
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            {...dragHandle.attributes}
            {...dragHandle.listeners}
            aria-label="Переместить карточку"
            title="Переместить карточку"
            className={`grid size-8 touch-none place-items-center rounded-lg text-[#00112273] transition-colors hover:bg-[#6183a21a] hover:text-[#001122f2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#005bff] ${dragHandle.isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          >
            <GripVertical className="size-[18px]" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

function SmallButton({ children }: { children: React.ReactNode }) {
  return <SellerButton className="h-10 shrink-0 rounded-lg px-3 text-[14px] leading-5 md:h-11 md:px-4 md:text-[15px] md:leading-6">{formatText(children)}</SellerButton>;
}

function downloadExcelReport() {
  const rows: Array<Array<string | number>> = [
    ['Раздел', 'Показатель', 'Значение'],
    ['Сегмент', 'Название', 'Не завершили заказ'],
    ['Охват', 'Человек', customerPortraitData.reach],
    ...customerPortraitData.age.map((item) => ['Пол и возраст', item.label, `${item.value}%`]),
    ...customerPortraitData.geography.map((item) => ['География', item.label, `${item.value}%`]),
    ...customerPortraitData.averageCheck.map((item) => ['Средний чек', item.label, `${item.value}%`]),
    ...customerPortraitData.categories.map((item) => ['Популярные категории', item, '']),
  ];
  const csv = `\uFEFF${rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';')).join('\r\n')}`;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'portret-pokupatelya.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function DownloadReportMenu() {
  const closeMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.closest('details')?.removeAttribute('open');
  };

  return (
    <details className="group relative print:hidden">
      <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-lg bg-[#95a6b62d] px-3 text-[14px] font-semibold leading-5 text-[#001122f2] transition-colors hover:bg-[#7c9bb53a] md:h-11 md:px-4 md:text-[15px] md:leading-6 [&::-webkit-details-marker]:hidden">
        Скачать
        <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
      </summary>
      <div className="absolute right-0 top-[calc(100%+8px)] z-30 min-w-[220px] overflow-hidden rounded-xl border border-[#d8dde4] bg-white p-1.5 shadow-[0_12px_32px_rgba(0,17,34,0.14)]">
        <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] text-[#001122f2] hover:bg-[#6183a21a]" onClick={(event) => { downloadExcelReport(); closeMenu(event); }}>
          <FileSpreadsheet className="size-5 text-[#005bff]" />
          Excel (.csv)
        </button>
        <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] text-[#001122f2] hover:bg-[#6183a21a]" onClick={(event) => { closeMenu(event); window.print(); }}>
          <FileText className="size-5 text-[#005bff]" />
          PDF
        </button>
      </div>
    </details>
  );
}

function SegmentDefinition() {
  const [source, setSource] = useState<'all' | 'cart' | 'favorites'>('all');

  const filters = [
    { id: 'all' as const, label: 'Все не завершившие заказ', icon: null },
    { id: 'cart' as const, label: 'Добавили товары в корзину', icon: CartFilterIcon },
    { id: 'favorites' as const, label: 'Добавили товары в «Избранное»', icon: FavoritesFilterIcon },
  ];

  return (
    <div className="mb-6 mt-6 hidden flex-wrap items-center justify-between gap-4 md:mb-8 md:mt-8 md:flex">
      <div className="flex w-full max-w-full items-start gap-1 overflow-x-auto rounded-lg border border-transparent bg-transparent [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:w-auto md:gap-0 md:border-[#9fb2c378] md:bg-white/65" role="group" aria-label="Источник добавления товара">
        {filters.map(({ id, label, icon: Icon }) => {
          const isActive = source === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSource(id)}
              className={`flex h-9 shrink-0 items-center gap-2 rounded-lg border-2 px-3 text-[13px] font-semibold leading-5 transition-colors md:h-11 md:text-[15px] md:font-normal md:leading-6 ${isActive ? 'border-transparent bg-[#25282b] text-white md:border-[#005bff] md:bg-[#9bafcd1a] md:text-[#070707]' : 'border-transparent bg-[#f1f3f5] text-[#001a34] md:bg-transparent md:text-[#001a3399] md:hover:bg-[#6183a21a] md:hover:text-[#001122f2]'}`}
            >
              {Icon ? <Icon /> : null}
              <span>{preventHangingWords(label)}</span>
            </button>
          );
        })}
      </div>
      <div className="flex w-full flex-nowrap items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:w-auto md:flex-wrap md:gap-3">
        <div className="hidden md:block">
          <DownloadReportMenu />
        </div>
        <button
          type="button"
          className="hidden h-10 shrink-0 rounded-lg bg-[#005bff] px-4 text-[14px] font-semibold leading-5 text-white transition-colors hover:bg-[#004ed6] active:bg-[#003ead] md:block md:h-11 md:px-5 md:text-[15px] md:leading-6"
        >
          Запустить продвижение
        </button>
      </div>
    </div>
  );
}

function AudienceCard() {
  return <Card className="hidden min-w-0 w-full justify-self-start overflow-hidden p-4 md:block md:p-5 xl:max-w-[280px]"><CardTitle>Охват сегмента</CardTitle><div className="mt-6 max-w-full text-[42px] font-semibold leading-none text-[#001122f2] md:mt-7 md:text-[48px]">{preventHangingWords(customerPortraitData.reach)}</div><p className="mt-3 min-w-0 break-words text-[14px] leading-5 text-[#001122a8] md:text-[15px] md:leading-6">{preventHangingWords('Количество человек, не завершивших заказ за последние 90 дней')}</p><div className="mt-6 hidden md:mt-7 md:block"><SmallButton>Перейти в рекламу</SmallButton></div></Card>;
}

function InsightCard() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:hidden">
        <Card className="col-span-2 overflow-hidden p-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <img src={customerPortraitPhoto} alt="Покупатели товаров для активного отдыха" className="size-full object-cover object-center" loading="lazy" decoding="async" />
            <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-[#eef1f4]/95 px-2 py-1 text-[12px] font-medium leading-4 text-[#001122a8]"><Sparkles className="size-3.5 text-[#257b9a]" />ИИ-изображение</span>
          </div>
          <h2 className="mt-4 text-[17px] font-semibold leading-6 text-[#001a34]">Городской любитель активного отдыха</h2>
          <p className="mt-1 text-[15px] leading-[22px] text-[#001122f2]"><span className="block">{preventHangingWords('Интересуются товарами для активного отдыха, но откладывают покупку.')}</span><span className="block">{preventHangingWords('Чаще выбирают снаряжение стоимостью 3 000–10 000 ₽')}</span></p>
        </Card>
        {[
          { title: 'Кто это', Icon: ProfileIcon, values: ['25–44 года', 'Мужчины 55%', 'Женщины 45%'] },
          { title: 'Что интересно', Icon: MobileInterestIcon, values: ['Туристические рюкзаки', 'Палатки', 'Велоаксессуары'] },
          { title: 'Где находятся', Icon: CustomerLocationIcon, values: ['Москва', 'Санкт-Петербург', 'Свердловская область'] },
        ].map(({ title, Icon, values }, index) => <Card key={title} className={`${index === 2 ? 'col-span-2' : ''} p-4`}>
          <h3 className="flex items-center gap-2 text-[16px] font-semibold leading-6 text-[#001a34]"><Icon className="size-5" />{title}</h3>
          <div className="mt-3 flex flex-wrap gap-3">{values.map((value) => <span key={value} className="max-w-full rounded-md bg-[#ebf7ff] px-2.5 py-1 text-[14px] font-medium leading-5 text-[#005bff]">{value}</span>)}</div>
        </Card>)}
      </div>
      <Card className="relative isolate hidden overflow-hidden p-4 md:block md:p-5">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:absolute md:inset-y-0 md:right-0 md:h-full md:w-[72%] md:rounded-none">
        <img
          src={customerPortraitPhoto}
          alt="Покупатели товаров для активного отдыха у автомобиля с туристическим снаряжением"
          className="size-full object-cover object-center md:ml-auto md:h-full md:w-auto md:max-w-none md:translate-x-16 md:object-contain md:object-right"
          loading="lazy"
          decoding="async"
        />
        <span className="absolute bottom-3 left-3 z-20 flex items-center gap-1 rounded-md bg-[#eef1f4]/95 px-2 py-1 text-[11px] font-medium leading-4 text-[#001122a8] md:left-auto md:right-4">
          <Sparkles className="size-3 text-[#257b9a]" />
          <span>ИИ-изображение</span>
        </span>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] hidden bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_32%,rgba(255,255,255,0.96)_40%,rgba(255,255,255,0.78)_50%,rgba(255,255,255,0.48)_60%,rgba(255,255,255,0.2)_70%,rgba(255,255,255,0)_82%)] md:block" />

      <div className="relative z-10 mt-5 flex min-w-0 flex-col justify-start md:mt-0 md:w-[66%]">
        <CardTitle>Городской любитель активного отдыха</CardTitle>
        <p className="mt-0 max-w-[620px] text-[14px] leading-5 text-[#001122f2] md:text-[15px] md:leading-6">
          <span className="block">{preventHangingWords('Интересуются товарами для активного отдыха, но откладывают покупку.')}</span>
          <span className="block">{preventHangingWords('Чаще выбирают снаряжение стоимостью 3 000–10 000 ₽')}</span>
        </p>
        <dl className="mt-4 grid gap-3 text-[14px] leading-5">
          <div className="flex min-w-0 flex-col rounded-xl">
            <dt className="flex items-center gap-1.5 text-[14px] font-semibold leading-5 text-[#001a34]">
              <svg className="size-[21px] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M7.5 14c1.5.005 1.5 1 4.5 1s3-1 4.5-1c1 0 3.5 2.5 3.5 3.5S17.483 21 11.991 21C6.5 21 4 18.5 4 17.5s2.5-3.503 3.5-3.5M12 3C9 3 7 5 7 8s2 5 5 5 5-2 5-5-2-5-5-5" />
              </svg>
              Кто это
            </dt>
            <dd className="flex flex-wrap gap-3 pt-2">
              {['25–44 года', 'Мужчины 55%', 'Женщины 45%'].map((item) => (
                <span key={item} className="whitespace-nowrap rounded-md bg-[#ebf7ff] px-2 py-0.5 text-[12px] font-medium leading-5 text-[#005bff]">
                  {item}
                </span>
              ))}
            </dd>
          </div>
          <div className="flex min-w-0 flex-col rounded-xl">
            <dt className="flex items-center gap-1.5 text-[14px] font-semibold leading-5 text-[#001a34]">
              <svg className="size-[21px] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M14.692 5.694c.368-.205.365-.469-.009-.664C13.367 4.343 12.708 4 12 4s-1.367.343-2.683 1.03l-2 1.044c-1.614.842-2.42 1.263-2.869 2.02C4 8.85 4 9.79 4 11.673v1.652c0 1.883 0 2.824.448 3.58s1.255 1.178 2.869 2.02l2 1.044C10.633 20.657 11.292 21 12 21s1.367-.343 2.683-1.03l2-1.044c1.614-.842 2.42-1.263 2.869-2.02.448-.756.448-1.697.448-3.58v-1.652c0-1.883 0-2.824-.448-3.58-.329-.556-.851-.93-1.744-1.423-.367-.203-.389-.204-.763.004L11 10c-.344.19-.739.394-.91.77-.09.197-.09.375-.09.73V14a1 1 0 0 1-2 0v-4a1 1 0 0 1 .514-.874z" />
              </svg>
              Что интересно
            </dt>
            <dd className="flex flex-wrap gap-3 pt-2">
              {['Туристические рюкзаки', 'Палатки', 'Велоаксессуары'].map((interest) => (
                <span key={interest} className="whitespace-nowrap rounded-md bg-[#ebf7ff] px-2 py-0.5 text-[12px] font-medium leading-5 text-[#005bff]">
                  {interest}
                </span>
              ))}
            </dd>
          </div>
          <div className="flex min-w-0 flex-col rounded-xl">
            <dt className="flex items-center gap-1.5 text-[14px] font-semibold leading-5 text-[#001a34]">
              <svg className="size-[21px] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M12 3c-4.5 0-8 3-8 8 0 6 6.5 10 8 10s8-4 8-10c0-5-3.5-8-8-8m0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
              </svg>
              Где находятся
            </dt>
            <dd className="flex flex-wrap gap-3 pt-2">
              {['Москва', 'Санкт-Петербург', 'Свердловская область'].map((region) => (
                <span key={region} className="whitespace-nowrap rounded-md bg-[#ebf7ff] px-2 py-0.5 text-[12px] font-medium leading-5 text-[#005bff]">
                  {region}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
      </Card>
    </>
  );
}

function HintMascot() {
  const { rive, RiveComponent } = useRive({
    src: friendlyFloatingBotUrl,
    autoplay: true,
  });

  useEffect(() => {
    if (!rive) return;

    const playbackName =
      rive.stateMachineNames.find((name) => /idle/i.test(name)) ??
      rive.animationNames.find((name) => /idle/i.test(name)) ??
      rive.stateMachineNames[0] ??
      rive.animationNames[0];

    if (!playbackName) return;
    rive.play(playbackName, true);

    return () => rive.stop(playbackName);
  }, [rive]);

  return <RiveComponent className="size-full" />;
}

function HintCard() {
  const actions = ['Что продвигать', 'Какие товары выбрать', 'Ещё совет'];

  return <section className="relative overflow-hidden rounded-2xl border-0 bg-[#2A3545] p-4 text-white md:rounded-[24px] md:border-[4px] md:border-[#3a4657]"><h2 className="flex items-center gap-3 pr-8 text-[16px] font-semibold leading-6 md:text-[17px] md:leading-7"><Sparkles className="size-4 text-[#58bce9]" />Совет от Селли</h2><p className="mt-2 text-[14px] leading-5 text-white/90 sm:mt-3 sm:text-[15px] sm:leading-6">{preventHangingWords('Лето — подходящий момент для продвижения товаров для кемпинга и трекинга. Попробуйте акцентировать внимание на наборах для отдыха на природе и товарах стоимостью 3 000–10 000 ₽')}</p><div className="-mr-4 mt-3 flex min-w-0 flex-nowrap justify-start gap-2 overflow-x-auto pr-4 [scrollbar-width:none] [scroll-padding-right:16px] [&::-webkit-scrollbar]:hidden md:mr-0 md:flex-wrap md:justify-end md:overflow-visible md:pr-0">{actions.map((action) => <button key={action} className="min-h-10 shrink-0 rounded-lg bg-white/10 px-4 py-2 text-[13px] font-semibold leading-4 text-white transition-colors hover:bg-white/20 md:min-h-8 md:px-3 md:py-1.5 md:text-[12px] md:font-medium" type="button">{action}</button>)}</div></section>;
}

function FloatingAiHint() {
  const [isOpen, setIsOpen] = useState(false);
  const mascotWidth = 264;
  const mascotHeight = 190;
  const cardWidth = 336;
  const gap = 12;
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const [position, setPosition] = useState(() => {
    const fallback = { x: Math.max(8, window.innerWidth - mascotWidth - 20), y: Math.max(8, window.innerHeight - mascotHeight - 20) };
    try {
      const saved = JSON.parse(window.localStorage.getItem('selli-mascot-position') ?? 'null');
      return typeof saved?.x === 'number' && typeof saved?.y === 'number' ? saved : fallback;
    } catch {
      return fallback;
    }
  });
  const [cardHeight, setCardHeight] = useState(260);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number; currentX: number; currentY: number; moved: boolean } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const nextViewport = { width: window.innerWidth, height: window.innerHeight };
      setViewport(nextViewport);
      setPosition((current) => ({
        x: Math.min(Math.max(8, current.x), Math.max(8, nextViewport.width - mascotWidth - 8)),
        y: Math.min(Math.max(8, current.y), Math.max(8, nextViewport.height - mascotHeight - 8)),
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isOpen || !cardRef.current) return;
    const observer = new ResizeObserver(([entry]) => setCardHeight(entry.contentRect.height));
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setPosition((current) => ({ ...current, y: Math.max(current.y, cardHeight + gap - 64 + 12) }));
  }, [isOpen, cardHeight]);

  const clampPosition = (x: number, y: number) => ({
    x: Math.min(Math.max(8, x), Math.max(8, viewport.width - mascotWidth - 8)),
    y: Math.min(Math.max(isOpen ? cardHeight + gap - 64 + 12 : 8, y), Math.max(8, viewport.height - mascotHeight - 8)),
  });
  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: position.x, originY: position.y, currentX: position.x, currentY: position.y, moved: false };
    setIsDragging(true);
  };
  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (Math.hypot(deltaX, deltaY) > 4) drag.moved = true;
    const nextPosition = clampPosition(drag.originX + deltaX, drag.originY + deltaY);
    drag.currentX = nextPosition.x;
    drag.currentY = nextPosition.y;
    setPosition(nextPosition);
  };
  const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current = null;
    setIsDragging(false);
    if (drag.moved) window.localStorage.setItem('selli-mascot-position', JSON.stringify({ x: drag.currentX, y: drag.currentY }));
    else setIsOpen((current) => !current);
  };

  const centeredCardLeft = (mascotWidth - cardWidth) / 2;
  const cardLeft = Math.min(Math.max(centeredCardLeft, 12 - position.x), viewport.width - position.x - cardWidth - 12);

  return <div className="fixed z-[1000] hidden h-[190px] w-[264px] md:block" style={{ left: position.x, top: position.y }}>
    {isOpen ? <div
      ref={cardRef}
      className="absolute w-[min(336px,calc(100vw-32px))] rounded-[26px] bg-[#2A3545] shadow-[0_18px_48px_rgba(0,0,0,0.3)]"
      style={{ bottom: mascotHeight + gap - 64, left: cardLeft }}
    >
      <button type="button" aria-label="Закрыть совет нейросети" onClick={() => setIsOpen(false)} className="absolute right-3 top-3 z-[1] grid size-8 place-items-center rounded-full bg-white/10 text-white/75 transition-colors hover:bg-white/20 hover:text-white"><X className="size-4" /></button>
      <HintCard />
    </div> : null}
    <button
      type="button"
      aria-label={isOpen ? 'Переместить Селли или закрыть совет' : 'Переместить Селли или открыть совет'}
      aria-expanded={isOpen}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative h-[190px] w-[264px] touch-none overflow-hidden bg-transparent focus:outline-none focus-visible:ring-4 focus-visible:ring-[#005bff33] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      <span aria-hidden="true" className="pointer-events-none absolute -top-12 right-[-128px] size-[264px] origin-top-right scale-[1.5]"><HintMascot /></span>
    </button>
  </div>;
}

function AgeCard() {
  const isMobile = useIsMobile();
  const genderOption = {
    animationDuration: 450,
    color: ['#58bce9', '#ED9AB7'],
    grid: { left: 18, right: 18, top: 34, bottom: 24, containLabel: false },
    xAxis: { type: 'category', data: ['Мужчины', 'Женщины'], axisLine: { lineStyle: { color: '#d8dde4' } }, axisTick: { show: false }, axisLabel: { color: '#001122a8', fontSize: 13, interval: 0 } },
    yAxis: { type: 'value', show: false, min: 0, max: 65 },
    tooltip: { trigger: 'item', formatter: '{b}: {c}%', transitionDuration: 0 },
    series: [{ type: 'bar', data: [55, 45], barWidth: 40, itemStyle: { color: ({ dataIndex }: { dataIndex: number }) => ['#58bce9', '#ED9AB7'][dataIndex], borderRadius: [2, 2, 0, 0] }, label: { show: true, position: 'top', formatter: '{c}%', color: '#070707', fontSize: 15 } }],
  };
  const ageOption = {
    animationDuration: 450,
    animationDurationUpdate: 0,
    stateAnimation: { duration: 0 },
    color: ['#58bce9', '#ED9AB7'],
    grid: { left: 6, right: 6, top: 34, bottom: 24, containLabel: false },
    xAxis: { type: 'category', data: customerPortraitData.age.map(({ label }) => preventHangingWords(label)), axisLine: { lineStyle: { color: '#d8dde4' } }, axisTick: { show: false }, axisLabel: { color: '#001122a8', fontSize: 13 } },
    yAxis: { type: 'value', show: false, min: 0, max: 45 },
    tooltip: { trigger: 'axis', transitionDuration: 0, axisPointer: { type: 'shadow', animation: false } },
    series: [
      { name: 'Мужчины', type: 'bar', stack: 'age', data: customerPortraitData.age.map(({ male }) => male), barWidth: 40, itemStyle: { borderRadius: [2, 2, 0, 0] } },
      { name: 'Женщины', type: 'bar', stack: 'age', data: customerPortraitData.age.map(({ female }) => female), barWidth: 40, itemStyle: { borderRadius: [2, 2, 0, 0] }, label: { show: true, position: 'top', formatter: ({ dataIndex }: { dataIndex: number }) => `${customerPortraitData.age[dataIndex].value}%`, color: '#070707', fontSize: 15 } },
    ],
  };
  const chartHeight = isMobile ? 220 : 'clamp(213px, 29vh, 281px)';
  return <Card className="flex h-full flex-col p-4 md:p-5"><CardTitle>Основной сегмент — 25–44 года</CardTitle><p className="mt-0 text-[14px] leading-5 text-[#070707] md:text-[15px]">{preventHangingWords('Мужчин в сегменте на 10% больше, чем женщин')}</p><div className="mt-auto grid gap-2 pt-3 md:grid-cols-[.72fr_1.28fr] md:gap-4"><div><ResponsiveEChart option={genderOption} style={{ height: chartHeight, width: '100%' }} opts={{ renderer: 'canvas', useDirtyRect: true }} /></div><div><ResponsiveEChart option={ageOption} style={{ height: chartHeight, width: '100%' }} opts={{ renderer: 'canvas', useDirtyRect: true }} /></div></div></Card>;
}

function GeographyCard() {
  const isMobile = useIsMobile();
  const [mapReady, setMapReady] = useState(false);
  const [view, setView] = useState<'map' | 'regions' | 'cities'>('map');
  const [displayMode, setDisplayMode] = useState<'map' | 'chart'>('map');
  const [selectedRegion, setSelectedRegion] = useState('г. Москва');
  const [mapView, setMapView] = useState<{ center?: [number, number]; zoom: number }>({ zoom: 1 });
  const geographyColors = ['#005bff', '#3478f6', '#5d96f6', '#78b6e8', '#83c9ed', '#a4d5f3', '#c5e5f8'];
  const mapRegions = [
    { name: 'г. Москва', label: 'Москва', value: 15, color: '#58bce9' },
    { name: 'Свердловская обл.', label: 'Свердловская область', value: 11, color: '#78c9ed' },
    { name: 'г. Санкт-Петербург', label: 'Санкт-Петербург', value: 10, color: '#83cfef' },
    { name: 'Красноярский край', label: 'Красноярский край', value: 10, color: '#83cfef' },
    { name: 'Республика Татарстан (Татарстан)', label: 'Республика Татарстан', value: 5, color: '#b9e3f6' },
    { name: 'Краснодарский край', label: 'Краснодарский край', value: 8, color: '#91d4f2' },
  ];
  const mapCallouts = [
    { coord: [37.6173, 55.7558], value: mapRegions[0].value, regionLabel: mapRegions[0].label },
    { coord: [60.5975, 56.8389], value: mapRegions[1].value, regionLabel: mapRegions[1].label },
    { coord: [30.3351, 59.9343], value: mapRegions[2].value, regionLabel: mapRegions[2].label },
    { coord: [92.8932, 56.0153], value: mapRegions[3].value, regionLabel: mapRegions[3].label },
    { coord: [49.1064, 55.7961], value: mapRegions[4].value, regionLabel: mapRegions[4].label },
    { coord: [38.9747, 45.0355], value: mapRegions[5].value, regionLabel: mapRegions[5].label },
  ];
  useEffect(() => {
    let alive = true;
    fetch('/geo/russia-regions.geojson').then((response) => response.json()).then((geoJson) => {
      if (alive) {
        const normalizedGeoJson = {
          ...geoJson,
          features: geoJson.features.map((feature: { properties: { region: string } }) => ({
            ...feature,
            properties: { ...feature.properties, name: feature.properties.region },
          })),
        };
        echarts.registerMap('russia-regions', normalizedGeoJson);
        setMapReady(true);
      }
    }).catch(() => undefined);
    return () => { alive = false; };
  }, []);
  const option = {
    animationDuration: 550,
    tooltip: {
      trigger: 'item',
      formatter: (params: { name: string }) => {
        const region = mapRegions.find((item) => item.name === params.name);
        return region ? `${region.label}<br/><strong>${region.value}%</strong>` : params.name;
      },
      backgroundColor: '#ffffff',
      borderColor: '#d8dde4',
      borderWidth: 1,
      padding: [8, 10],
      textStyle: { color: '#001122f2', fontFamily: 'Onest, Arial, sans-serif', fontSize: 13 },
      extraCssText: 'border-radius:8px;box-shadow:0 8px 24px rgba(0,17,34,0.12);',
    },
    visualMap: {
      show: false,
      min: 5,
      max: 15,
      inRange: { color: ['#b9e3f6', '#58bce9'] },
      outOfRange: { color: '#eef3f9' },
    },
    series: [{
      type: 'map',
      map: 'russia-regions',
      roam: true,
      scaleLimit: { min: 1, max: 3 },
      center: mapView.center,
      zoom: mapView.zoom,
      silent: false,
      selectedMode: 'single',
      boundingCoords: [[25, 62], [100, 44]],
      layoutCenter: ['50%', '50%'],
      layoutSize: isMobile ? '150%' : '132%',
      itemStyle: { areaColor: '#eef3f9', borderColor: '#ffffff', borderWidth: 0.7 },
      emphasis: { itemStyle: { borderColor: '#005bff', borderWidth: 1.6 }, label: { show: false } },
      select: { itemStyle: { areaColor: '#005bff', borderColor: '#001a34', borderWidth: 2 }, label: { show: false } },
      label: { show: false },
      data: mapRegions.map((item) => ({
        name: item.name,
        value: item.value,
        selected: item.name === selectedRegion,
        itemStyle: { areaColor: item.color, borderColor: '#ffffff', borderWidth: 0.9 },
      })),
      markPoint: {
        silent: true,
        symbol: 'circle',
        symbolSize: 1,
        itemStyle: { color: 'transparent', borderColor: 'transparent' },
        label: {
          show: false,
          position: 'top',
          distance: 3,
          formatter: ({ data }: { data: { regionLabel: string; value: number } }) => `${data.regionLabel} · ${data.value}%`,
          color: '#001122f2',
          fontFamily: 'Onest, Arial, sans-serif',
          fontSize: 13,
          fontWeight: 600,
          backgroundColor: '#ffffff',
          borderColor: '#d8dde4',
          borderWidth: 1,
          borderRadius: 7,
          padding: [5, 8],
          shadowColor: 'rgba(0, 17, 34, 0.08)',
          shadowBlur: 8,
          shadowOffsetY: 2,
        },
        labelLine: {
          show: false,
          length: isMobile ? 8 : 12,
          length2: isMobile ? 5 : 8,
          lineStyle: { color: '#8da3b8', width: 1, opacity: 0.72 },
        },
        labelLayout: { hideOverlap: true, moveOverlap: 'shiftY' },
        tooltip: { show: false },
        data: mapCallouts,
      },
    }],
  };
  const cityData = [
    { label: 'Москва', value: 15 }, { label: 'Санкт-Петербург', value: 10 },
    { label: 'Екатеринбург', value: 7 }, { label: 'Краснодар', value: 6 },
    { label: 'Красноярск', value: 5 }, { label: 'Казань', value: 4 },
    { label: 'Другие города', value: 53 },
  ];
  const listData = view === 'cities' ? cityData : customerPortraitData.geography;
  const geographyBarOption = (data: ReadonlyArray<{ label: string; value: number }>) => ({
    animationDuration: 450,
    grid: { left: 8, right: 38, top: 8, bottom: 8, containLabel: true },
    xAxis: { type: 'value', show: false, max: Math.max(...data.map(({ value }) => value)) * 1.16 },
    yAxis: {
      type: 'category',
      inverse: true,
      data: data.map(({ label }) => preventHangingWords(label)),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#001122a8', fontSize: 13, width: 150, overflow: 'truncate' },
    },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, transitionDuration: 0, valueFormatter: (value: number) => `${value}%` },
    series: [{
      type: 'bar',
      barWidth: 12,
      showBackground: true,
      backgroundStyle: { color: '#eef3f8', borderRadius: 1 },
      data: data.map(({ value }, index) => ({ value, itemStyle: { color: geographyColors[index % geographyColors.length], borderRadius: 1 } })),
      label: { show: true, position: 'right', formatter: '{c}%', color: '#001122a8', fontSize: 13 },
    }],
  });
  return (
    <Card className="flex h-full min-h-0 flex-col p-4 md:p-5">
      <CardTitle>59% сегмента приходится на крупнейшие регионы</CardTitle>
      <div className="mt-4 flex flex-nowrap items-center justify-between gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-fit shrink-0 items-start rounded-lg border border-[#9fb2c378] bg-white/65" role="group" aria-label="Представление географии">
          {([['map', 'Страны'], ['regions', 'Регионы'], ['cities', 'Города']] as const).map(([value, label]) => {
            const isActive = view === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setView(value)}
                className={`flex h-11 shrink-0 items-center rounded-lg border-2 px-3 text-[15px] font-normal leading-6 transition-colors ${isActive ? 'border-[#005bff] bg-[#9bafcd1a] text-[#070707]' : 'border-transparent text-[#001a3399] hover:bg-[#6183a21a] hover:text-[#001122f2]'}`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="flex shrink-0 items-start rounded-lg border border-[#9fb2c378] bg-white/65" role="group" aria-label="Способ отображения">
          {([['map', 'Карта', MapIcon], ['chart', 'Диаграмма', ChartListIcon]] as const).map(([value, label, Icon]) => {
            const isActive = displayMode === value;
            return (
              <button
                key={value}
                type="button"
                aria-label={label}
                title={label}
                aria-pressed={isActive}
                onClick={() => setDisplayMode(value)}
                className={`grid size-11 shrink-0 place-items-center rounded-lg border-2 transition-colors ${isActive ? 'border-[#005bff] bg-[#9bafcd1a] text-[#005bff]' : 'border-transparent text-[#001a3399] hover:bg-[#6183a21a] hover:text-[#001122f2]'}`}
              >
                <Icon className="size-[18px]" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>
      {displayMode === 'map' ? (
        <div className="mt-4 flex min-h-[280px] flex-1 overflow-hidden md:min-h-[320px]">
          <div className="relative flex min-h-0 w-full flex-1">
            {mapReady ? (
              <SafeGeoEChart
                option={option}
                resizeReady={mapReady}
                className="h-full flex-1"
                onRegionClick={(params) => {
                  if (params.name && mapRegions.some((item) => item.name === params.name)) {
                    setSelectedRegion(params.name);
                  }
                }}
                onViewStateChange={setMapView}
                callouts={mapCallouts}
              />
            ) : <div className="grid min-h-[280px] w-full flex-1 place-items-center rounded-lg bg-[#f5f7fa] text-sm text-[#0011228f]">Загружаем карту регионов</div>}
          </div>
        </div>
      ) : (
        <ResponsiveEChart option={geographyBarOption(listData)} className="mt-5" style={{ height: 'clamp(260px, 38vh, 360px)', width: '100%' }} opts={{ renderer: 'svg' }} />
      )}
    </Card>
  );
}

function CheckCard() {
  const isMobile = useIsMobile();
  const option = { animationDuration: 450, grid: { left: 8, right: 8, top: 34, bottom: isMobile ? 48 : 24 }, xAxis: { type: 'category', data: customerPortraitData.averageCheck.map(({ label }) => preventHangingWords(label)), axisLine: { lineStyle: { color: '#d8dde4' } }, axisTick: { show: false }, axisLabel: { color: '#001122a8', fontSize: isMobile ? 10 : 11, interval: 0, rotate: isMobile ? 28 : 0 } }, yAxis: { type: 'value', show: false, max: 45 }, tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, transitionDuration: 0 }, series: [{ type: 'bar', data: customerPortraitData.averageCheck.map(({ value }) => value), barWidth: isMobile ? 24 : 40, itemStyle: { color: '#58bce9', borderRadius: [2, 2, 0, 0] }, label: { show: true, position: 'top', formatter: '{c}%', color: '#070707', fontSize: isMobile ? 12 : 15 } }] };
  return <Card className="flex h-full flex-col p-4 md:p-5"><CardTitle>Большинство выбирают товары на сумму от 3 000 до 10 000 ₽</CardTitle><div className="mt-auto pt-3"><ResponsiveEChart option={option} style={{ height: isMobile ? 250 : 'clamp(213px, 29vh, 281px)', width: '100%' }} opts={{ renderer: 'svg' }} /></div></Card>;
}

function CategoriesCard() {
  const isMobile = useIsMobile();
  const [level, setLevel] = useState<1 | 2 | 3>(2);
  const categoriesByLevel = {
    1: [
      ['Спорт и отдых', 38], ['Одежда', 21], ['Дом и сад', 14], ['Автотовары', 10], ['Электроника', 9], ['Другие категории', 8],
    ],
    2: [
      ['Туристические рюкзаки', 18], ['Палатки', 15], ['Велоаксессуары', 13], ['Походная одежда', 12], ['Спальники', 10],
      ['Туристическая мебель', 9], ['Фонари', 8], ['Термосы', 6], ['Навигаторы', 5], ['Трекинговые палки', 4],
    ],
    3: [
      ['Рюкзаки 40–60 литров', 17], ['Трёхместные палатки', 15], ['Велосумки', 13], ['Трекинговые куртки', 12], ['Спальники до −5 °C', 11],
      ['Складные кресла', 9], ['Налобные фонари', 8], ['Термосы 1 литр', 6], ['GPS-навигаторы', 5], ['Карбоновые палки', 4],
    ],
  } as const;
  const categories = categoriesByLevel[level];
  const visibleCategories = categories;
  const categoryChartHeight = Math.max(isMobile ? 272 : 216, visibleCategories.length * (isMobile ? 34 : 27) + 16);
  const categoryOption = {
    animationDuration: 450,
    grid: { left: isMobile ? 148 : 190, right: isMobile ? 24 : 18, top: 4, bottom: 4, containLabel: false },
    xAxis: { type: 'value', show: false, max: Math.max(...visibleCategories.map(([, value]) => value)) * 1.18 },
    yAxis: {
      type: 'category',
      inverse: true,
      data: visibleCategories.map(([category]) => preventHangingWords(category)),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#001122d9',
        fontSize: isMobile ? 11 : 13,
        margin: 12,
        width: isMobile ? 132 : 174,
        overflow: 'truncate',
        formatter: (value: string) => value.replace(/\s+/g, '\u00a0'),
      },
    },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, transitionDuration: 0, valueFormatter: (value: number) => `${value}%` },
    series: [{
      type: 'bar',
      data: visibleCategories.map(([, value]) => value),
      barWidth: 20,
      barCategoryGap: '42%',
      itemStyle: { color: '#58bce9', borderRadius: 1 },
      label: { show: true, position: 'right', formatter: '{c}%', color: '#001122a8', fontSize: 13 },
    }],
  };

  return <Card className="flex h-full min-w-0 flex-col p-4 md:p-5"><CardTitle>Чаще всего сохраняют товары для походов и кемпинга</CardTitle><div className="mt-5 inline-flex w-fit max-w-full rounded-lg border border-[#9fb2c378] bg-white/65" role="group" aria-label="Уровень категорий">{([1, 2, 3] as const).map((item) => { const isActive = level === item; return <button key={item} type="button" aria-pressed={isActive} onClick={() => setLevel(item)} className={`flex min-h-11 min-w-0 items-center justify-center rounded-lg border-2 px-1.5 text-center text-[13px] font-normal leading-4 transition-colors sm:px-3 sm:text-[15px] sm:leading-6 ${isActive ? 'border-[#005bff] bg-[#9bafcd1a] text-[#070707]' : 'border-transparent text-[#001a3399] hover:bg-[#6183a21a] hover:text-[#001122f2]'}`}>{item} уровень</button>; })}</div><div className="mt-auto min-w-0 pt-3"><ResponsiveEChart option={categoryOption} style={{ height: `${categoryChartHeight}px`, width: '100%' }} opts={{ renderer: 'svg' }} /></div></Card>;
}

type AnalyticsCardId = 'age' | 'check' | 'categories' | 'geography';

const analyticsOrderStorageKey = 'ozon-customer-portrait-card-order';
const defaultAnalyticsOrder: AnalyticsCardId[] = ['age', 'check', 'categories', 'geography'];

function getStoredAnalyticsOrder() {
  if (typeof window === 'undefined') return defaultAnalyticsOrder;

  try {
    const storedOrder = JSON.parse(window.localStorage.getItem(analyticsOrderStorageKey) ?? '[]');
    const isValidOrder = Array.isArray(storedOrder)
      && storedOrder.length === defaultAnalyticsOrder.length
      && defaultAnalyticsOrder.every((id) => storedOrder.includes(id));
    return isValidOrder ? storedOrder as AnalyticsCardId[] : defaultAnalyticsOrder;
  } catch {
    return defaultAnalyticsOrder;
  }
}

function SortableAnalyticsCard({
  id,
  children,
}: {
  id: AnalyticsCardId;
  children: React.ReactNode;
}) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    transition: { duration: 240, easing: 'cubic-bezier(0.2, 0, 0, 1)' },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 30 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative min-w-0 transition-opacity ${isDragging ? 'opacity-70' : 'opacity-100'}`}>
      <CardDragHandleContext.Provider value={{ attributes, isDragging, listeners }}>
        <div className="h-full">{children}</div>
      </CardDragHandleContext.Provider>
    </div>
  );
}

function AnalyticsGrid() {
  const [order, setOrder] = useState<AnalyticsCardId[]>(getStoredAnalyticsOrder);
  const [mobileCard, setMobileCard] = useState<AnalyticsCardId>('age');
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    setOrder((currentOrder) => {
      const oldIndex = currentOrder.indexOf(active.id as AnalyticsCardId);
      const newIndex = currentOrder.indexOf(over.id as AnalyticsCardId);
      return oldIndex === -1 || newIndex === -1
        ? currentOrder
        : arrayMove(currentOrder, oldIndex, newIndex);
    });
  };

  useEffect(() => {
    window.localStorage.setItem(analyticsOrderStorageKey, JSON.stringify(order));
  }, [order]);

  const cards: Record<AnalyticsCardId, React.ReactNode> = {
    age: <AgeCard />,
    check: <CheckCard />,
    categories: <CategoriesCard />,
    geography: <GeographyCard />,
  };

  const mobileTabs: Array<{ id: AnalyticsCardId; label: string }> = [
    { id: 'age', label: 'Пол и возраст' },
    { id: 'check', label: 'Средний чек' },
    { id: 'categories', label: 'Товары' },
    { id: 'geography', label: 'География' },
  ];

  return (
    <>
      <div className="mt-4 md:hidden">
        <div className="overflow-hidden rounded-2xl bg-white">
          <div className="flex overflow-x-auto p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {mobileTabs.map(({ id, label }) => {
              const isActive = mobileCard === id;
              return <button key={id} type="button" onClick={() => setMobileCard(id)} className={`h-9 shrink-0 rounded-xl px-3 text-[13px] font-semibold transition-colors ${isActive ? 'bg-[#25282b] text-white' : 'text-[#7f91a3]'}`}>{label}</button>;
            })}
          </div>
          <div className="[&>section]:rounded-none">{cards[mobileCard]}</div>
        </div>
      </div>
      <div className="hidden md:block">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={order} strategy={rectSortingStrategy}>
            <div className="mt-4 grid gap-4 xl:grid-cols-2 xl:items-stretch">
              {order.map((id) => (
                <SortableAnalyticsCard key={id} id={id}>
                  {cards[id]}
                </SortableAnalyticsCard>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

export default function OzonCustomerPortraitPage() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-[#f4f6f8] font-['Onest',Arial,Helvetica,sans-serif] text-[#001122f2] md:bg-white">
      <Header />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-44 pt-3 md:px-4 md:pb-8 md:pt-[60px]">
        <div className="hidden flex-wrap items-center justify-between gap-5 md:flex">
          <h1 className="font-['Onest',Arial,Helvetica,sans-serif] text-[28px] font-bold leading-9 tracking-[0] text-[#070707] md:text-[40px] md:leading-[48px]">Портрет покупателя</h1>
          <div className="flex w-full flex-nowrap gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:w-auto md:flex-wrap md:gap-3">
            <SmallButton>Прочитать о разделе</SmallButton>
            <SmallButton>Пройти обучение</SmallButton>
            <SmallButton>Оставить отзыв</SmallButton>
          </div>
        </div>
        <div className="hidden">
          <button type="button" className="h-11 rounded-xl bg-[#e9edf3] px-3 text-[14px] font-semibold text-[#42566b]">Потенциальные</button>
          <button type="button" className="h-11 rounded-xl bg-[#101214] px-3 text-[14px] font-semibold text-white shadow-[0_2px_8px_rgba(0,0,0,0.14)]">Не завершили заказ</button>
        </div>
        <div className="mt-4 hidden overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:block">
          <div className="relative flex w-max min-w-full flex-nowrap items-end after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-px after:bg-[#001a331f] after:content-['']">
            {segments.map((segment, index) => {
              const isActive = segment === 'Не завершили заказ';
              return <button key={segment} type="button" className={`relative min-h-11 shrink-0 px-3 pb-[11px] pt-[9px] font-['Onest',Arial,Helvetica,sans-serif] text-[15px] font-normal leading-6 tracking-[0] transition-colors hover:text-[#005bff] ${index === 0 ? 'pl-0' : ''} ${index === segments.length - 1 ? 'pr-0' : ''} ${isActive ? 'text-[#070707]' : 'text-[#001a3399]'}`}>{preventHangingWords(segment)}{isActive && <span className={`absolute bottom-0 z-[1] h-0.5 rounded-px bg-[#005bff] ${index === 0 ? 'left-0' : 'left-3'} ${index === segments.length - 1 ? 'right-0' : 'right-3'}`} />}</button>;
            })}
          </div>
        </div>
        <SegmentDefinition />
        <div className="grid gap-4 xl:grid-cols-[240px_minmax(0,1fr)] xl:items-stretch">
          <AudienceCard />
          <InsightCard />
          <div className="relative mt-4 md:hidden">
            <div aria-hidden="true" className="pointer-events-none absolute top-2 right-[-56px] z-0 size-32 origin-bottom-right scale-[2]">
              <HintMascot />
            </div>
            <div className="relative z-10"><HintCard /></div>
          </div>
        </div>
        <AnalyticsGrid />
      </main>
      <FloatingAiHint />
      <div className="fixed bottom-[76px] left-1/2 z-[890] -translate-x-1/2 md:hidden">
        <button
          type="button"
          className="h-12 w-fit whitespace-nowrap rounded-full bg-[#005bff] px-5 text-[15px] font-semibold leading-6 text-white shadow-[0_8px_24px_rgba(0,91,255,0.28)] transition-colors active:bg-[#003ead]"
        >
          Запустить продвижение
        </button>
      </div>
      <footer className="mx-auto hidden w-full max-w-[1280px] border-t border-[#d8dde4] px-4 py-3 text-[12px] font-normal leading-5 text-[#0011228f] md:block">{preventHangingWords('© 1998 – 2026 ООО «Интернет Решения». Все права защищены')}</footer>
      <MobileBottomNav />
    </div>
  );
}
