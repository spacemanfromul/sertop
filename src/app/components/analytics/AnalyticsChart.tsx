import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export type AnalyticsPoint = { date: string; pageviews: number };

export function AnalyticsChart({ data }: { data: AnalyticsPoint[] }) {
  const formatDay = (date: string) => new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short' }).format(new Date(`${date}T12:00:00`));
  return (
    <div className="h-[230px] w-full md:h-[270px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: -24 }}>
          <CartesianGrid vertical={false} stroke="#dce4ed" strokeDasharray="4 5" />
          <XAxis dataKey="date" tickFormatter={formatDay} axisLine={false} tickLine={false} minTickGap={28} tick={{ fill: '#7f91a3', fontSize: 11 }} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#7f91a3', fontSize: 11 }} />
          <Tooltip labelFormatter={(label) => formatDay(String(label))} formatter={(value) => [value, 'Просмотры']} contentStyle={{ border: 0, borderRadius: 14, boxShadow: '0 10px 32px rgba(0,17,34,.12)', fontSize: 12 }} />
          <Line type="monotone" dataKey="pageviews" stroke="#005bff" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: '#005bff', stroke: '#fff', strokeWidth: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
