import type { ReactNode } from 'react';

export function AnalyticsCard({ icon, label, value, hint, tone }: { icon: ReactNode; label: string; value: string; hint: string; tone: string }) {
  return (
    <div className={`min-w-0 rounded-2xl border border-white/70 bg-gradient-to-br ${tone} p-4 shadow-[0_10px_30px_rgba(0,17,34,0.05)]`}>
      <div className="flex items-center justify-between gap-3"><p className="text-[13px] font-semibold text-[#42566b]">{label}</p><span className="grid size-9 place-items-center rounded-xl bg-white/75 text-[#005bff] shadow-sm">{icon}</span></div>
      <p className="mt-5 text-[30px] font-bold tracking-[-0.02em] text-[#001122f2]">{value}</p>
      <p className="mt-1 text-[12px] leading-5 text-[#6f8091]">{hint}</p>
    </div>
  );
}
