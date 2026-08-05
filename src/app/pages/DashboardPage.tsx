import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { BriefcaseBusiness, ExternalLink, ImagePlus, LayoutGrid, List, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { SellerButton, SellerCard } from '../components/SellerUi';
import { AnalyticsWidget } from '../components/analytics/AnalyticsWidget';
import { WeeklyGoalCard } from '../components/dashboard/WeeklyGoalCard';
import { initialApplications, type ApplicationStatus, type JobApplication } from './dashboardApplicationsData';

const STORAGE_KEY = 'toporkov-job-applications-v1';
const statuses: ApplicationStatus[] = ['Черновик', 'Отправлено', 'Интервью', 'Тестовое', 'Оффер', 'Отказ'];
const emptyApplication: JobApplication = {
  id: '', date: new Date().toISOString().slice(0, 10), company: '', segment: 'B2B', position: '', status: 'Отправлено',
  rejectionStage: '', rejectionReason: '', salary: '', link: '', contact: '', notes: '', logo: '',
};

const statusClasses: Record<ApplicationStatus, string> = {
  Черновик: 'bg-[#e9edf3] text-[#42566b]',
  Отправлено: 'bg-[#e9f2ff] text-[#005bff]',
  Интервью: 'bg-[#fff3d6] text-[#9b6500]',
  Тестовое: 'bg-[#f1eaff] text-[#6f3dc4]',
  Оффер: 'bg-[#e2f7e8] text-[#087c31]',
  Отказ: 'bg-[#ffe8e5] text-[#c7352b]',
};

function formatDate(value: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('ru-RU').format(new Date(`${value}T12:00:00`));
}

function persistApplications(applications: JobApplication[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[12px] font-semibold ${statusClasses[status]}`}>{status}</span>;
}

function CompanyLogo({ application, large = false }: { application: JobApplication; large?: boolean }) {
  const classes = large ? 'size-12 rounded-2xl text-[18px]' : 'size-10 rounded-xl text-[15px]';
  return application.logo
    ? <img src={application.logo} alt="" className={`${classes} shrink-0 border border-[#e2e7ec] bg-white object-contain p-1`} />
    : <span className={`${classes} grid shrink-0 place-items-center bg-[#e9f2ff] font-bold text-[#005bff]`}>{application.company.trim().charAt(0).toUpperCase() || '—'}</span>;
}

function LinkifiedText({ children }: { children: string }) {
  return <>{children.split(/(https?:\/\/[^\s]+)/g).map((part, index) => part.startsWith('http') ? <a key={index} href={part} target="_blank" rel="noreferrer" className="font-medium text-[#005bff] underline decoration-[#005bff55] underline-offset-2 hover:decoration-[#005bff]">{part}</a> : part)}</>;
}

function prepareLogo(file: File) {
  return new Promise<string>((resolve, reject) => {
    if (file.size > 3 * 1024 * 1024) { reject(new Error('Максимальный размер файла — 3 МБ')); return; }
    const image = new Image();
    const source = URL.createObjectURL(file);
    image.onload = () => {
      const canvas = document.createElement('canvas'); canvas.width = 160; canvas.height = 160;
      const context = canvas.getContext('2d');
      if (!context) { URL.revokeObjectURL(source); reject(new Error('Не удалось обработать изображение')); return; }
      context.fillStyle = '#ffffff'; context.fillRect(0, 0, 160, 160);
      const scale = Math.min(144 / image.width, 144 / image.height);
      const width = image.width * scale; const height = image.height * scale;
      context.drawImage(image, (160 - width) / 2, (160 - height) / 2, width, height);
      URL.revokeObjectURL(source); resolve(canvas.toDataURL('image/webp', 0.82));
    };
    image.onerror = () => { URL.revokeObjectURL(source); reject(new Error('Не удалось открыть изображение')); };
    image.src = source;
  });
}

function ApplicationDialog({ application, onClose, onSave }: { application: JobApplication; onClose: () => void; onSave: (item: JobApplication) => void }) {
  const [form, setForm] = useState(application);
  const [logoError, setLogoError] = useState('');
  const set = (key: keyof JobApplication, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSave({ ...form, id: form.id || globalThis.crypto?.randomUUID?.() || String(Date.now()) });
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center bg-[#001122]/45 p-0 backdrop-blur-[2px] md:items-center md:p-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form onSubmit={submit} className="max-h-[92dvh] w-full overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-2xl md:max-w-[760px] md:rounded-[28px] md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div><p className="text-[13px] font-medium text-[#0011228f]">Отклик</p><h2 className="text-[24px] font-bold text-[#001122f2]">{application.id ? 'Редактировать' : 'Добавить новый'}</h2></div>
          <button type="button" onClick={onClose} className="grid size-11 place-items-center rounded-full bg-[#eef1f4]" aria-label="Закрыть"><X className="size-5" /></button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-4 md:col-span-2">
            <CompanyLogo application={form} large />
            <div>
              <label htmlFor="company-logo-upload" className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-[#edf1f5] px-3 text-[13px] font-semibold text-[#42566b] hover:bg-[#e2e8ee]"><ImagePlus className="size-4" />{form.logo ? 'Заменить логотип' : 'Добавить логотип'}</label>
              <input id="company-logo-upload" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="sr-only" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; try { setLogoError(''); set('logo', await prepareLogo(file)); } catch (error) { setLogoError(error instanceof Error ? error.message : 'Не удалось загрузить логотип'); } event.target.value = ''; }} />
              {form.logo && <button type="button" onClick={() => set('logo', '')} className="ml-2 text-[12px] font-medium text-[#c7352b]">Удалить</button>}
              {logoError && <p className="mt-1 text-[12px] text-[#c7352b]">{logoError}</p>}
              <p className="mt-1 text-[11px] text-[#7f91a3]">PNG, JPG, WebP или SVG до 3 МБ</p>
            </div>
          </div>
          <Field label="Компания *"><input required value={form.company} onChange={(e) => set('company', e.target.value)} /></Field>
          <Field label="Должность"><input value={form.position} onChange={(e) => set('position', e.target.value)} /></Field>
          <Field label="Дата"><input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} /></Field>
          <Field label="Статус"><select value={form.status} onChange={(e) => set('status', e.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></Field>
          <Field label="Тип"><select value={form.segment} onChange={(e) => set('segment', e.target.value)}><option>B2B</option><option>B2C</option></select></Field>
          <Field label="Зарплата"><input value={form.salary} onChange={(e) => set('salary', e.target.value)} placeholder="Например, 250 000 ₽" /></Field>
          <Field label="Этап отказа"><input value={form.rejectionStage} onChange={(e) => set('rejectionStage', e.target.value)} /></Field>
          <Field label="Причина отказа"><input value={form.rejectionReason} onChange={(e) => set('rejectionReason', e.target.value)} /></Field>
          <Field label="Ссылка"><input type="url" value={form.link} onChange={(e) => set('link', e.target.value)} placeholder="https://" /></Field>
          <Field label="Контакт"><input value={form.contact} onChange={(e) => set('contact', e.target.value)} /></Field>
          <Field label="Заметки" className="md:col-span-2"><textarea rows={4} value={form.notes} onChange={(e) => set('notes', e.target.value)} /></Field>
        </div>
        <div className="mt-6 flex justify-end gap-3"><SellerButton onClick={onClose}>Отмена</SellerButton><SellerButton type="submit" className="!bg-[#005bff] !text-white hover:!bg-[#0045c7]">Сохранить</SellerButton></div>
      </form>
    </div>
  );
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`grid gap-1.5 text-[13px] font-semibold text-[#42566b] [&_input]:h-11 [&_input]:rounded-xl [&_input]:border [&_input]:border-[#d8dde4] [&_input]:px-3 [&_input]:text-[15px] [&_select]:h-11 [&_select]:rounded-xl [&_select]:border [&_select]:border-[#d8dde4] [&_select]:px-3 [&_select]:text-[15px] [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-[#d8dde4] [&_textarea]:p-3 [&_textarea]:text-[15px] ${className}`}>{label}{children}</label>;
}

export default function DashboardPage() {
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '') as JobApplication[];
      return saved?.map((item) => item.date === '2026-09-10' ? { ...item, date: '2026-07-10' } : item) || initialApplications;
    } catch { return initialApplications; }
  });
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Все статусы');
  const [segment, setSegment] = useState('Все типы');
  const [editing, setEditing] = useState<JobApplication | null>(null);
  const [storageError, setStorageError] = useState('');
  const [view, setView] = useState<'cards' | 'table'>(() => localStorage.getItem('toporkov-dashboard-view') === 'table' ? 'table' : 'cards');

  useEffect(() => { localStorage.setItem('toporkov-dashboard-view', view); }, [view]);
  useEffect(() => {
    document.title = 'Трекер откликов';
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousContent = robots?.content;
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.content = 'noindex, nofollow';
    return () => { if (previousContent) robots!.content = previousContent; else robots?.remove(); };
  }, []);

  const filtered = useMemo(() => applications
    .filter((item) => status === 'Все статусы' || item.status === status)
    .filter((item) => segment === 'Все типы' || item.segment === segment)
    .filter((item) => `${item.company} ${item.position} ${item.contact} ${item.notes}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date)), [applications, query, status, segment]);
  const count = (value: ApplicationStatus) => applications.filter((item) => item.status === value).length;
  const save = (item: JobApplication) => {
    const next = applications.some((entry) => entry.id === item.id)
      ? applications.map((entry) => entry.id === item.id ? item : entry)
      : [item, ...applications];
    try {
      persistApplications(next);
      setApplications(next);
      setStorageError('');
      setEditing(null);
    } catch {
      setStorageError('Не удалось сохранить изменения. Хранилище браузера переполнено — удалите несколько логотипов и повторите попытку.');
    }
  };
  const remove = (item: JobApplication) => {
    if (!window.confirm(`Удалить отклик в «${item.company}»?`)) return;
    const next = applications.filter((entry) => entry.id !== item.id);
    try {
      persistApplications(next);
      setApplications(next);
      setStorageError('');
    } catch {
      setStorageError('Не удалось сохранить изменения в браузере.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] font-['Onest',Arial,sans-serif] text-[#001122f2]">
      <main className="mx-auto w-full max-w-[1280px] px-4 py-5 md:py-10">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div><div className="mb-2 flex items-center gap-2 text-[#005bff]"><BriefcaseBusiness className="size-5" /><span className="text-[14px] font-semibold">Личный dashboard</span></div><h1 className="text-[32px] font-bold leading-[38px] md:text-[44px] md:leading-[52px]">Трекер откликов</h1><p className="mt-2 max-w-[640px] text-[15px] leading-6 text-[#526579]">Вакансии, этапы и контакты в одном месте. Стартовые данные перенесены из текущей таблицы.</p></div>
          <SellerButton onClick={() => setEditing({ ...emptyApplication })} className="flex w-full items-center justify-center gap-2 !bg-[#005bff] !text-white shadow-[0_6px_18px_rgba(0,91,255,0.24)] hover:!bg-[#004ed6] active:scale-[0.98] active:!bg-[#003ead] md:w-auto"><Plus className="size-5" />Добавить отклик</SellerButton>
        </header>

        {storageError && <div role="alert" className="mt-4 rounded-2xl border border-[#ffc9c3] bg-[#fff1ef] px-4 py-3 text-[13px] font-medium text-[#9f2f27]">{storageError}</div>}

        <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-5">
          {[['Всего', applications.length, 'text-[#001122f2]'], ['Отправлено', count('Отправлено'), 'text-[#005bff]'], ['Интервью', count('Интервью'), 'text-[#9b6500]'], ['Офферы', count('Оффер'), 'text-[#087c31]'], ['Отказы', count('Отказ'), 'text-[#c7352b]']].map(([label, value, color]) => <SellerCard key={String(label)} className="p-4 md:p-5"><p className="text-[13px] font-medium text-[#6f8091]">{label}</p><p className={`mt-1 text-[30px] font-bold ${color}`}>{value}</p></SellerCard>)}
        </div>

        <WeeklyGoalCard applications={applications} />

        <AnalyticsWidget />

        <SellerCard className="mt-4 p-3 md:p-4">
          <div className="grid gap-2 md:grid-cols-[1fr_190px_150px_auto]">
            <label className="relative"><Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#7f91a3]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Компания, должность или контакт" className="h-11 w-full rounded-xl bg-[#f3f5f7] pl-10 pr-3 text-[15px] outline-none ring-[#005bff] focus:ring-2" /></label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 rounded-xl bg-[#f3f5f7] px-3 text-[14px] font-medium outline-none"><option>Все статусы</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select>
            <select value={segment} onChange={(e) => setSegment(e.target.value)} className="h-11 rounded-xl bg-[#f3f5f7] px-3 text-[14px] font-medium outline-none"><option>Все типы</option><option>B2B</option><option>B2C</option></select>
            <div className="grid h-11 grid-cols-2 rounded-xl bg-[#f3f5f7] p-1" aria-label="Вид отображения">
              <button type="button" onClick={() => setView('cards')} className={`grid size-9 place-items-center rounded-lg transition-colors ${view === 'cards' ? 'bg-white text-[#005bff] shadow-sm' : 'text-[#6f8091] hover:text-[#001122f2]'}`} title="Карточки" aria-pressed={view === 'cards'}><LayoutGrid className="size-[18px]" /></button>
              <button type="button" onClick={() => setView('table')} className={`grid size-9 place-items-center rounded-lg transition-colors ${view === 'table' ? 'bg-white text-[#005bff] shadow-sm' : 'text-[#6f8091] hover:text-[#001122f2]'}`} title="Таблица" aria-pressed={view === 'table'}><List className="size-[19px]" /></button>
            </div>
          </div>
        </SellerCard>

        {view === 'cards' ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.length === 0 ? <SellerCard className="col-span-full px-5 py-16 text-center text-[#6f8091]">Ничего не найдено</SellerCard> : filtered.map((item) => (
              <SellerCard key={item.id} className="flex min-h-[280px] min-w-0 flex-col overflow-hidden p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3"><CompanyLogo application={item} large /><div className="min-w-0"><p className="text-[12px] font-medium text-[#6f8091]">{formatDate(item.date)}</p><h2 className="mt-1 truncate text-[20px] font-bold">{item.company}</h2></div></div>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-3 text-[14px] leading-5 text-[#42566b]">{item.position || 'Должность не указана'}</p>
                <div className="mt-3 flex items-center gap-2"><span className="rounded-md bg-[#edf1f5] px-2 py-1 text-[12px] font-semibold">{item.segment}</span>{item.salary && <span className="text-[12px] text-[#6f8091]">{item.salary}</span>}</div>
                <div className="mt-4 grid gap-2">
                  {item.rejectionReason && <div className="min-w-0 overflow-hidden rounded-xl bg-[#fff1ef] px-3 py-2.5"><p className="text-[10px] font-semibold uppercase tracking-wide text-[#c7352b]">Причина отказа</p><p className="mt-1 line-clamp-3 break-words text-[13px] leading-5 text-[#5d2723] [overflow-wrap:anywhere]"><LinkifiedText>{item.rejectionReason}</LinkifiedText></p></div>}
                  {item.notes && <div className="min-w-0 overflow-hidden rounded-xl bg-[#edf4ff] px-3 py-2.5"><p className="text-[10px] font-semibold uppercase tracking-wide text-[#005bff]">Заметки</p><p className="mt-1 line-clamp-3 break-words text-[13px] leading-5 text-[#29435f] [overflow-wrap:anywhere]"><LinkifiedText>{item.notes}</LinkifiedText></p></div>}
                </div>
                <div className="mt-auto flex items-end justify-between pt-4">
                  <p className="max-w-[65%] truncate text-[12px] text-[#7f91a3]">{item.contact || 'Контакт не указан'}</p>
                  <div className="flex gap-1"><button onClick={() => setEditing(item)} className="grid size-9 place-items-center rounded-lg hover:bg-[#edf1f5]" aria-label="Редактировать"><Pencil className="size-4" /></button>{item.link && <a href={item.link} target="_blank" rel="noreferrer" className="grid size-9 place-items-center rounded-lg hover:bg-[#edf1f5]" aria-label="Открыть вакансию"><ExternalLink className="size-4" /></a>}<button onClick={() => remove(item)} className="grid size-9 place-items-center rounded-lg text-[#c7352b] hover:bg-[#ffe8e5]" aria-label="Удалить"><Trash2 className="size-4" /></button></div>
                </div>
              </SellerCard>
            ))}
          </div>
        ) : <SellerCard className="mt-4 overflow-hidden">
          <div className="hidden grid-cols-[100px_minmax(160px,1fr)_minmax(210px,1.5fr)_90px_120px_84px] gap-3 border-b border-[#e4e8ed] bg-[#f8f9fa] px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-[#6f8091] md:grid"><span>Дата</span><span>Компания</span><span>Должность</span><span>Тип</span><span>Статус</span><span></span></div>
          {filtered.length === 0 ? <div className="px-5 py-16 text-center text-[#6f8091]">Ничего не найдено</div> : filtered.map((item) => (
            <article key={item.id} className="border-b border-[#e8ebef] p-4 last:border-0 md:px-5">
              <div className="grid gap-3 md:grid-cols-[100px_minmax(160px,1fr)_minmax(210px,1.5fr)_90px_120px_84px] md:items-center">
                <span className="text-[13px] text-[#6f8091]">{formatDate(item.date)}</span>
                <div className="flex min-w-0 items-center gap-2.5"><CompanyLogo application={item} /><div className="min-w-0"><p className="truncate text-[16px] font-semibold">{item.company}</p>{item.contact && <p className="truncate text-[12px] text-[#7f91a3]">{item.contact}</p>}</div></div>
                <div className="min-w-0"><p className="truncate text-[14px]">{item.position || 'Должность не указана'}</p></div>
                <span className="w-fit rounded-md bg-[#edf1f5] px-2 py-1 text-[12px] font-semibold">{item.segment}</span>
                <StatusBadge status={item.status} />
                <div className="flex justify-end gap-1"><button onClick={() => setEditing(item)} className="grid size-9 place-items-center rounded-lg hover:bg-[#edf1f5]" aria-label="Редактировать"><Pencil className="size-4" /></button>{item.link && <a href={item.link} target="_blank" rel="noreferrer" className="grid size-9 place-items-center rounded-lg hover:bg-[#edf1f5]" aria-label="Открыть вакансию"><ExternalLink className="size-4" /></a>}<button onClick={() => remove(item)} className="grid size-9 place-items-center rounded-lg text-[#c7352b] hover:bg-[#ffe8e5]" aria-label="Удалить"><Trash2 className="size-4" /></button></div>
              </div>
              {(item.rejectionReason || item.notes) && (
                <div className="mt-3 grid gap-2 md:ml-[112px] md:grid-cols-2">
                  {item.rejectionReason && <div className="min-w-0 overflow-hidden rounded-xl bg-[#fff1ef] px-3 py-2.5"><p className="text-[11px] font-semibold uppercase tracking-wide text-[#c7352b]">Причина отказа</p><p className="mt-1 break-words text-[13px] leading-5 text-[#5d2723] [overflow-wrap:anywhere]"><LinkifiedText>{item.rejectionReason}</LinkifiedText></p></div>}
                  {item.notes && <div className="min-w-0 overflow-hidden rounded-xl bg-[#edf4ff] px-3 py-2.5"><p className="text-[11px] font-semibold uppercase tracking-wide text-[#005bff]">Заметки</p><p className="mt-1 break-words text-[13px] leading-5 text-[#29435f] [overflow-wrap:anywhere]"><LinkifiedText>{item.notes}</LinkifiedText></p></div>}
                </div>
              )}
            </article>
          ))}
        </SellerCard>}
        <p className="mt-3 text-right text-[12px] text-[#7f91a3]">Показано {filtered.length} из {applications.length} · данные сохраняются в этом браузере</p>
      </main>
      {editing && <ApplicationDialog application={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}
