import { useEffect, useMemo, useState } from 'react';
import { Check, Minus, Plus, Target } from 'lucide-react';
import { SellerCard } from '../SellerUi';
import type { JobApplication } from '../../pages/dashboardApplicationsData';

const GOAL_KEY = 'toporkov-weekly-applications-goal';

function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay() || 7;
  result.setDate(result.getDate() - day + 1);
  result.setHours(0, 0, 0, 0);
  return result;
}

const dateLabel = (date: Date) => new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(date);

export function WeeklyGoalCard({ applications }: { applications: JobApplication[] }) {
  const [goal, setGoal] = useState(() => Math.max(1, Number(localStorage.getItem(GOAL_KEY)) || 20));
  useEffect(() => { localStorage.setItem(GOAL_KEY, String(goal)); }, [goal]);

  const progress = useMemo(() => {
    const start = startOfWeek(new Date());
    const end = new Date(start); end.setDate(end.getDate() + 6); end.setHours(23, 59, 59, 999);
    const sent = applications.filter((item) => {
      const date = new Date(`${item.date}T12:00:00`);
      return item.status !== 'Черновик' && date >= start && date <= end;
    }).length;
    return { sent, start, end, percent: Math.min(100, Math.round((sent / goal) * 100)), remaining: Math.max(0, goal - sent) };
  }, [applications, goal]);

  const completed = progress.sent >= goal;

  return (
    <SellerCard className="mt-4 overflow-hidden p-5 md:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${completed ? 'bg-[#e2f7e8] text-[#087c31]' : 'bg-[#e9f2ff] text-[#005bff]'}`}>{completed ? <Check className="size-5" /> : <Target className="size-5" />}</span>
          <div><p className="text-[13px] font-semibold text-[#6f8091]">Цель недели · {dateLabel(progress.start)} — {dateLabel(progress.end)}</p><h2 className="mt-1 text-[22px] font-bold md:text-[26px]">Отправить {goal} откликов</h2><p className="mt-1 text-[13px] text-[#6f8091]">{completed ? 'Цель выполнена — отличный темп' : `Осталось отправить ${progress.remaining}`}</p></div>
        </div>
        <div className="flex items-center justify-between gap-5 md:justify-end">
          <div className="text-right"><p className="text-[32px] font-bold tracking-[-0.03em] text-[#001122f2]">{progress.sent}<span className="text-[18px] font-medium text-[#7f91a3]">/{goal}</span></p><p className="text-[12px] text-[#6f8091]">откликов отправлено</p></div>
          <div className="flex items-center rounded-xl bg-[#f1f4f7] p-1"><button type="button" onClick={() => setGoal((value) => Math.max(1, value - 1))} className="grid size-9 place-items-center rounded-lg text-[#526579] hover:bg-white" aria-label="Уменьшить цель"><Minus className="size-4" /></button><span className="min-w-9 text-center text-[14px] font-bold">{goal}</span><button type="button" onClick={() => setGoal((value) => value + 1)} className="grid size-9 place-items-center rounded-lg text-[#526579] hover:bg-white" aria-label="Увеличить цель"><Plus className="size-4" /></button></div>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-3"><div className="h-3 flex-1 overflow-hidden rounded-full bg-[#e6ebf0]"><div className={`h-full rounded-full transition-[width] duration-500 ${completed ? 'bg-[#16a34a]' : 'bg-gradient-to-r from-[#005bff] to-[#6f3dc4]'}`} style={{ width: `${progress.percent}%` }} /></div><span className="w-10 text-right text-[13px] font-bold text-[#42566b]">{progress.percent}%</span></div>
    </SellerCard>
  );
}
