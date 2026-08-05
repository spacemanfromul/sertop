import { useEffect, useRef, useState } from 'react';
import { Eye, Globe2, RefreshCw, Smartphone, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { SellerCard } from '../SellerUi';
import { AnalyticsCard } from './AnalyticsCard';
import { AnalyticsChart, type AnalyticsPoint } from './AnalyticsChart';

type AnalyticsData = {
  visitors: number;
  pageviews: number;
  countries: number;
  mobileShare: number;
  periodChange: number;
  chart: AnalyticsPoint[];
  sources?: Array<{ name: string; visits: number }>;
  updatedAt?: string;
};

const mockData: AnalyticsData = {
  visitors: 184,
  pageviews: 426,
  countries: 9,
  mobileShare: 38,
  periodChange: 12.4,
  chart: [8, 14, 10, 18, 22, 17, 26, 21, 29, 24, 31, 35, 28, 42, 38, 45, 41, 52, 48, 56, 50, 61, 58, 67, 62, 73, 69, 78, 74, 84].map((pageviews, index) => {
    const date = new Date(); date.setDate(date.getDate() - (29 - index));
    return { date: date.toISOString().slice(0, 10), pageviews };
  }),
  sources: [{ name: 'Прямые заходы', visits: 92 }, { name: 'Поисковые системы', visits: 51 }, { name: 'Переходы по ссылкам', visits: 29 }],
};

const number = new Intl.NumberFormat('ru-RU');
const periods = [
  { key: 'today', label: 'Сегодня', chart: 'сегодня', comparison: 'К предыдущему дню' },
  { key: 'yesterday', label: 'Вчера', chart: 'вчера', comparison: 'К предыдущему дню' },
  { key: 'week', label: 'Неделя', chart: 'за 7 дней', comparison: 'К предыдущим 7 дням' },
  { key: 'month', label: 'Месяц', chart: 'за 30 дней', comparison: 'К предыдущим 30 дням' },
] as const;
type PeriodKey = typeof periods[number]['key'];

function Skeleton() {
  return <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-[148px] animate-pulse rounded-2xl bg-[#edf1f5]" />)}</div>;
}

export function AnalyticsWidget() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fallback, setFallback] = useState(false);
  const [period, setPeriod] = useState<PeriodKey>('month');
  const requestId = useRef(0);

  const load = async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?period=${period}`, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Analytics unavailable');
      const nextData = await response.json();
      if (currentRequest !== requestId.current) return;
      setData(nextData); setFallback(false);
    } catch {
      if (currentRequest !== requestId.current) return;
      setData(mockData); setFallback(true);
    } finally { if (currentRequest === requestId.current) setLoading(false); }
  };

  useEffect(() => { void load(); }, [period]);
  const change = data?.periodChange || 0;
  const selectedPeriod = periods.find((item) => item.key === period)!;

  return (
    <section className="mt-8" aria-labelledby="portfolio-pulse-title">
      <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#005bff]">Портфолио</p>
      <SellerCard className="overflow-hidden p-4 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div><h2 id="portfolio-pulse-title" className="text-[24px] font-bold md:text-[28px]">Пульс портфолио</h2><p className="mt-1 text-[14px] leading-6 text-[#6f8091]">Данные о посещениях сайта из Яндекс Метрики</p></div>
          <div className="flex flex-wrap items-center gap-2">{fallback && <span className="rounded-full bg-[#fff3d6] px-3 py-1.5 text-[11px] font-semibold text-[#8a5b00]">Демо-данные · не удалось загрузить статистику</span>}<button type="button" onClick={() => void load()} className="grid size-10 place-items-center rounded-xl bg-[#edf1f5] text-[#42566b] hover:bg-[#e2e8ee]" aria-label="Обновить статистику"><RefreshCw className={`size-[17px] ${loading ? 'animate-spin' : ''}`} /></button></div>
        </div>
        <div className="mt-5 flex w-full gap-1 overflow-x-auto rounded-xl bg-[#edf1f5] p-1 md:w-fit">{periods.map((item) => <button key={item.key} type="button" onClick={() => setPeriod(item.key)} className={`h-9 shrink-0 rounded-lg px-3 text-[13px] font-semibold transition-colors ${period === item.key ? 'bg-white text-[#005bff] shadow-sm' : 'text-[#526579] hover:text-[#001122f2]'}`} aria-pressed={period === item.key}>{item.label}</button>)}</div>
        <div className="mt-6">{loading ? <Skeleton /> : data && <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <AnalyticsCard icon={<Eye className="size-[18px]" />} label="Просмотры" value={number.format(data.pageviews)} hint="Просмотры страниц" tone="from-[#eaf3ff] to-[#f7fbff]" />
          <AnalyticsCard icon={<Users className="size-[18px]" />} label="Посетители" value={number.format(data.visitors)} hint="Уникальные посетители" tone="from-[#eef0ff] to-[#fafaff]" />
          <AnalyticsCard icon={<Globe2 className="size-[18px]" />} label="Страны" value={number.format(data.countries)} hint="География аудитории" tone="from-[#eaf9f4] to-[#f7fcfa]" />
          <AnalyticsCard icon={<Smartphone className="size-[18px]" />} label="Устройства" value={`${data.mobileShare}%`} hint="Мобильные и планшеты" tone="from-[#fff5e5] to-[#fffaf2]" />
          <AnalyticsCard icon={change >= 0 ? <TrendingUp className="size-[18px]" /> : <TrendingDown className="size-[18px]" />} label="Динамика" value={`${change > 0 ? '+' : ''}${change}%`} hint={selectedPeriod.comparison} tone={change >= 0 ? 'from-[#eaf8ee] to-[#f7fcf8]' : 'from-[#fff0ee] to-[#fff9f8]'} />
        </div>}</div>
        {!loading && data && <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-2xl bg-[#f7f9fb] p-4 md:p-5"><h3 className="text-[16px] font-semibold">Просмотры {selectedPeriod.chart}</h3><AnalyticsChart key={period} data={data.chart} /></div>
          <div className="rounded-2xl bg-[#f7f9fb] p-4 md:p-5"><h3 className="text-[16px] font-semibold">Источники переходов</h3><div className="mt-5 grid gap-4">{(data.sources || []).map((source, index) => <div key={`${source.name}-${index}`}><div className="flex justify-between gap-3 text-[13px]"><span className="truncate text-[#42566b]">{source.name}</span><b>{number.format(source.visits)}</b></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e2e8ee]"><div className="h-full rounded-full bg-[#005bff]" style={{ width: `${Math.max(8, Math.min(100, source.visits / Math.max(...(data.sources || []).map((item) => item.visits), 1) * 100))}%` }} /></div></div>)}</div></div>
        </div>}
      </SellerCard>
    </section>
  );
}
