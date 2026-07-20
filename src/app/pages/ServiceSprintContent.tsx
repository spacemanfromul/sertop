import {
  BellRing,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Plus,
  Star,
  UserRound,
  UsersRound,
  Wrench,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import TagBadge from '../components/TagBadge';
import { Link } from 'react-router';
import serviceSprintStart from '../../assets/cases/service-sprint-start.png';
import serviceSprintPhone from '../../assets/cases/service-sprint-phone.png';
import serviceSprintCode from '../../assets/cases/service-sprint-code.png';
import serviceSprintIndustry from '../../assets/cases/service-sprint-industry.png';
import serviceSprintManager from '../../assets/cases/service-sprint-manager.png';
import serviceSprintAiPrompt from '../../assets/cases/service-sprint-ai-prompt.png';
import serviceSprintAiResult from '../../assets/cases/service-sprint-ai-result.png';
import serviceSprintEmployee from '../../assets/cases/service-sprint-employee.png';
import serviceSprintManagerTasks from '../../assets/cases/service-sprint-manager-tasks.png';
import serviceSprintExecutorTask from '../../assets/cases/service-sprint-executor-task.png';
import serviceSprintExecutorChecklist from '../../assets/cases/service-sprint-executor-checklist.png';
import serviceSprintExecutorPhotoEmpty from '../../assets/cases/service-sprint-executor-photo-empty.png';
import serviceSprintExecutorPhotoFilled from '../../assets/cases/service-sprint-executor-photo-filled.png';
import serviceSprintExecutorReview from '../../assets/cases/service-sprint-executor-review.png';
import serviceSprintCover from '../../assets/cases/service-sprint-cover.png';
import serviceSprintStatusModel from '../../assets/cases/service-sprint-status-model.png';
import serviceSprintCreateTask from '../../assets/cases/service-sprint-create-task.png';

type PhoneVariant = 'task' | 'assignee' | 'checklist' | 'control';

const sectionTitleClass =
  "font-['Google Sans',sans-serif] text-[32px] font-medium leading-[38px] tracking-[-0.5px] text-[#191c1d] md:text-[40px] md:leading-[48px] md:tracking-[-1px]";

const cardTitleClass =
  "font-['Google Sans',sans-serif] text-[22px] font-medium leading-[28px] text-[#191c1d]";

const bodyClass =
  "font-['Google Sans Flex','Google Sans',sans-serif] text-base font-normal leading-6 text-[#5f6368]";

function PhoneFrame({ variant, className = 'w-[210px]' }: { variant: PhoneVariant; className?: string }) {
  return (
    <div
      className={`relative aspect-[9/18.5] shrink-0 overflow-hidden rounded-[34px] border-[7px] border-[#202124] bg-[#f8f9fa] ${className}`}
    >
      <div className="absolute left-1/2 top-2 z-20 h-5 w-[42%] -translate-x-1/2 rounded-full bg-[#202124]" />
      <div className="h-full overflow-hidden px-3 pb-4 pt-10 text-[#191c1d]">
        {variant === 'task' ? <TaskScreen /> : null}
        {variant === 'assignee' ? <AssigneeScreen /> : null}
        {variant === 'checklist' ? <ChecklistScreen /> : null}
        {variant === 'control' ? <ControlScreen /> : null}
      </div>
    </div>
  );
}

export function ServiceSprintCover() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[24px] shadow-[0_18px_46px_rgba(25,28,29,0.22)]">
      <img src={serviceSprintCover} alt="Обложка кейса мобильного приложения для сервисных команд" className="size-full object-cover" />
    </div>
  );
}

function ScreenHeader({ icon, title, hint }: { icon: React.ReactNode; title: string; hint: string }) {
  return (
    <div className="mb-3">
      <div className="mb-3 flex size-10 items-center justify-center rounded-2xl bg-[#d3e3fd] text-[#0b57d0]">
        {icon}
      </div>
      <p className="text-[15px] font-semibold leading-5">{title}</p>
      <p className="mt-0.5 text-[10px] leading-4 text-[#747775]">{hint}</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#dde1e4] bg-white px-3 py-2">
      <p className="text-[9px] font-medium uppercase tracking-wide text-[#747775]">{label}</p>
      <p className="mt-1 text-[11px] font-medium leading-4">{value}</p>
    </div>
  );
}

function TaskScreen() {
  return (
    <div>
      <ScreenHeader icon={<Plus className="size-5" />} title="Новая задача" hint="Добавьте детали работы" />
      <div className="space-y-2">
        <Field label="Задача" value="Диагностика оборудования" />
        <Field label="Срок" value="Сегодня, до 18:00" />
        <Field label="Исполнитель" value="Выбрать специалиста" />
        <div className="rounded-xl bg-[#e9f1ff] p-3">
          <div className="flex items-center justify-between text-[10px] font-medium">
            <span>Чек-лист</span>
            <span className="text-[#0b57d0]">3 шага</span>
          </div>
          <div className="mt-2 space-y-1.5">
            {['Проверить узел', 'Сделать фото', 'Закрыть работу'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-[9px] text-[#5f6368]">
                <span className="size-3 rounded border border-[#9aa0a6] bg-white" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 rounded-full bg-[#0b57d0] py-2 text-center text-[11px] font-semibold text-white">Создать задачу</div>
    </div>
  );
}

function AssigneeScreen() {
  const people = [
    ['Алексей Морозов', '2 задачи', 'bg-[#d3e3fd]'],
    ['Марина Белова', 'Свободна', 'bg-[#c4eed0]'],
    ['Илья Соколов', '4 задачи', 'bg-[#ffe1b3]'],
  ];

  return (
    <div>
      <ScreenHeader icon={<UsersRound className="size-5" />} title="Исполнитель" hint="Распределите нагрузку" />
      <div className="rounded-xl bg-white p-2.5 shadow-sm">
        <div className="flex items-center gap-2 rounded-lg bg-[#f1f3f4] px-2 py-2 text-[10px] text-[#747775]">
          <UserRound className="size-3.5" />
          Найти сотрудника
        </div>
      </div>
      <div className="mt-2 space-y-2">
        {people.map(([name, status, color], index) => (
          <div key={name} className={`flex items-center gap-2.5 rounded-xl border p-2.5 ${index === 1 ? 'border-[#0b57d0] bg-[#e9f1ff]' : 'border-[#e3e6e8] bg-white'}`}>
            <div className={`flex size-8 items-center justify-center rounded-full text-[10px] font-semibold ${color}`}>{name[0]}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-semibold">{name}</p>
              <p className="text-[9px] text-[#747775]">{status}</p>
            </div>
            {index === 1 ? <Check className="size-4 text-[#0b57d0]" /> : <ChevronRight className="size-4 text-[#9aa0a6]" />}
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-full bg-[#0b57d0] py-2 text-center text-[11px] font-semibold text-white">Назначить</div>
    </div>
  );
}

function ChecklistScreen() {
  return (
    <div>
      <ScreenHeader icon={<ClipboardCheck className="size-5" />} title="Выполнение" hint="3 из 4 шагов готово" />
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-[#dfe3e6]">
        <div className="h-full w-3/4 rounded-full bg-[#0b57d0]" />
      </div>
      <div className="space-y-2">
        {['Проверить оборудование', 'Заменить фильтр', 'Проверить запуск'].map((item) => (
          <div key={item} className="flex items-center gap-2 rounded-xl bg-white p-2.5 shadow-sm">
            <span className="flex size-5 items-center justify-center rounded-full bg-[#c4eed0] text-[#146c2e]"><Check className="size-3" /></span>
            <span className="text-[9px] font-medium">{item}</span>
          </div>
        ))}
        <div className="rounded-xl border border-[#0b57d0] bg-[#e9f1ff] p-2.5">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full border border-[#0b57d0] text-[#0b57d0]">4</span>
            <span className="text-[9px] font-semibold">Добавить фотоотчёт</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <div className="flex aspect-square items-center justify-center rounded-lg bg-[linear-gradient(145deg,#cde8d8,#8cb8a1)] text-white"><Camera className="size-5" /></div>
            <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-[#0b57d0] bg-white text-[#0b57d0]"><Plus className="size-5" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlScreen() {
  return (
    <div>
      <ScreenHeader icon={<BellRing className="size-5" />} title="Контроль" hint="Работа команды сегодня" />
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-[#d3e3fd] p-2.5">
          <p className="text-[19px] font-semibold">12</p>
          <p className="text-[9px] text-[#5f6368]">Выполнено</p>
        </div>
        <div className="rounded-xl bg-[#c4eed0] p-2.5">
          <p className="text-[19px] font-semibold">3</p>
          <p className="text-[9px] text-[#5f6368]">В работе</p>
        </div>
      </div>
      <div className="mt-2 rounded-xl bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold">Рейтинг команды</p>
          <div className="flex items-center gap-1 text-[10px] font-semibold"><Star className="size-3 fill-[#f9ab00] text-[#f9ab00]" />4,8</div>
        </div>
        <div className="mt-3 flex h-20 items-end gap-1.5">
          {[45, 64, 52, 78, 68, 86, 74].map((height, index) => (
            <div key={index} className="flex-1 rounded-t bg-[#a8c7fa]" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
      <div className="mt-2 space-y-2">
        {[
          ['Задача выполнена', 'Фотоотчёт добавлен'],
          ['Нужна проверка', 'Результат ожидает подтверждения'],
        ].map(([title, text], index) => (
          <div key={title} className="flex gap-2 rounded-xl bg-white p-2.5 shadow-sm">
            <span className={`mt-0.5 flex size-6 items-center justify-center rounded-full ${index ? 'bg-[#ffe1b3] text-[#7a4d00]' : 'bg-[#c4eed0] text-[#146c2e]'}`}>
              {index ? <Clock3 className="size-3.5" /> : <CheckCircle2 className="size-3.5" />}
            </span>
            <div>
              <p className="text-[9px] font-semibold">{title}</p>
              <p className="mt-0.5 text-[8px] leading-3 text-[#747775]">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AiTaskVisual() {
  return (
    <div className="grid grid-cols-2 items-end gap-0 overflow-visible px-2 py-10 md:px-6 md:py-14">
      <img
        src={serviceSprintAiPrompt}
        alt="Руководитель описывает задачу ИИ-помощнику"
        className="relative z-10 h-[400px] w-full translate-x-3 rotate-[-3deg] object-contain object-bottom md:h-[520px] md:translate-x-8"
        loading="lazy"
        decoding="async"
      />
      <img
        src={serviceSprintAiResult}
        alt="ИИ-помощник формирует тип и описание задачи"
        className="h-[400px] w-full -translate-x-3 translate-y-7 rotate-[3deg] object-contain object-bottom md:h-[520px] md:-translate-x-8 md:translate-y-10"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function EmployeeScreenVisual() {
  return (
    <div className="grid grid-cols-2 items-end gap-0 overflow-visible px-2 py-10 md:px-6 md:py-14">
      <img
        src={serviceSprintManagerTasks}
        alt="Список задач руководителя со статусами, исполнителями и сроками"
        className="relative z-10 h-[400px] w-full translate-x-3 translate-y-8 rotate-[-3deg] object-contain object-bottom md:h-[520px] md:translate-x-8 md:translate-y-12"
        loading="lazy"
        decoding="async"
      />
      <img
        src={serviceSprintEmployee}
        alt="Профиль сотрудника с динамикой эффективности и историей задач"
        className="h-[400px] w-full -translate-x-3 rotate-[3deg] object-contain object-bottom md:h-[520px] md:-translate-x-8"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function ExecutorFlowVisual() {
  const screens = [
    { src: serviceSprintExecutorTask, title: 'Получает задачу' },
    { src: serviceSprintExecutorChecklist, title: 'Отмечает работы' },
    { src: serviceSprintExecutorPhotoEmpty, title: 'Добавляет фото' },
    { src: serviceSprintExecutorPhotoFilled, title: 'Проверяет отчёт' },
    { src: serviceSprintExecutorReview, title: 'Отправляет на проверку' },
  ];

  return (
    <section className="overflow-hidden px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-[760px] text-center">
        <h3 className="font-['Google Sans',sans-serif] text-[28px] font-medium leading-[34px] tracking-[-0.4px] text-[#191c1d] md:text-[34px] md:leading-[42px]">От задачи до подтверждения результата</h3>
        <p className={`${bodyClass} mt-4 md:text-lg md:leading-7`}>
          Исполнитель видит условия и срок, отмечает выполненные работы, прикладывает фотоотчёт и отправляет результат руководителю на проверку.
        </p>
      </div>
      <div className="mt-8 grid grid-cols-2 items-end gap-x-1 gap-y-8 md:mt-16 md:grid-cols-4 md:gap-x-2 md:gap-y-12">
        {screens.map((screen, index) => (
          <figure
            key={screen.title}
            className={`flex min-w-0 flex-col items-center ${
              index === 2 ? 'md:ml-8' : ''
            } ${
              index === 4 ? 'col-span-2 w-1/2 justify-self-center md:col-span-4 md:w-1/4' : ''
            } ${
              index === 0 || index === 2 ? '-rotate-2' : index === 1 || index === 3 ? 'rotate-2' : ''
            }`}
          >
            <div className="flex h-[400px] w-full items-end justify-center md:h-[520px]">
              <img
                src={screen.src}
                alt={`${screen.title} — экран исполнителя`}
                className="size-full object-contain object-bottom"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption className="mt-3 text-center font-['Google Sans',sans-serif] text-sm font-medium leading-5 text-[#5f6368] md:text-base md:leading-6">
              {screen.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function ScenarioVisual({ variant }: { variant: PhoneVariant }) {
  if (variant === 'task') {
    return (
      <div className="flex items-end justify-center overflow-visible px-6 py-10 md:px-10 md:py-14">
        <img
          src={serviceSprintCreateTask}
          alt="Экран создания задачи с описанием, сроком, подзадачами и файлами"
          className="h-[400px] w-auto max-w-full rotate-[-2deg] object-contain object-bottom md:h-[520px]"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  if (variant === 'control') {
    return (
      <div className="flex items-end justify-center overflow-hidden px-6 pt-7 md:px-10 md:pt-10">
        <img
          src={serviceSprintManager}
          alt="Главный экран руководителя с задачами и загрузкой сотрудников"
          className="h-[400px] w-auto max-w-full object-contain object-bottom md:h-[520px]"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  if (variant === 'assignee') {
    return <EmployeeScreenVisual />;
  }

  return (
    <div className="flex items-center justify-center overflow-hidden p-7">
      <PhoneFrame variant={variant} className="w-[220px] md:w-[250px]" />
    </div>
  );
}

function TextCard({ title, children, tone = 'gray' }: { title: string; children: React.ReactNode; tone?: 'gray' | 'blue' | 'green' }) {
  const background = tone === 'blue' ? 'bg-[#e9f1ff]' : tone === 'green' ? 'bg-[#eaf7ee]' : 'bg-[#f3f4f4]';
  return (
    <article className={`h-full rounded-[28px] p-5 md:p-6 ${background}`}>
      <h3 className={cardTitleClass}>{title}</h3>
      <p className={`${bodyClass} mt-3`}>{children}</p>
    </article>
  );
}

function AuthorizationScreens() {
  const screens = [
    { title: 'Первый запуск', src: serviceSprintStart },
    { title: 'Номер телефона', src: serviceSprintPhone },
    { title: 'Код подтверждения', src: serviceSprintCode },
    { title: 'Выбор отрасли', src: serviceSprintIndustry },
  ];

  return (
    <section className="overflow-hidden px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-[820px] text-center">
        <h2 className={sectionTitleClass}>Авторизация и первый запуск</h2>
        <p className={`${bodyClass} mt-3 md:text-lg md:leading-7`}>
          Последовательный сценарий помогает начать работу: указать номер, подтвердить вход и выбрать отрасль компании.
        </p>
      </div>
      <div className="mt-8 grid grid-cols-2 items-end gap-x-1 gap-y-8 pb-6 md:mt-12 md:grid-cols-4 md:gap-x-2 md:pb-12 md:pt-10">
        {screens.map((screen, index) => (
          <figure
            key={screen.title}
            className={`flex min-w-0 flex-col items-center ${
              index < 2 ? 'md:translate-y-12' : 'md:-translate-y-8'
            } ${index === 0 || index === 2 ? '-rotate-2' : 'rotate-2'}`}
          >
            <div className="flex h-[400px] w-full items-end justify-center md:h-[520px]">
              <img
                src={screen.src}
                alt={`Экран «${screen.title}» мобильного приложения Спринт`}
                className="size-full object-contain object-bottom"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption className="mt-4 text-center font-['Google Sans',sans-serif] text-sm font-medium leading-5 text-[#5f6368] md:text-base md:leading-6">
              {screen.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function SolutionStory({
  title,
  description,
  variant,
  visualPosition,
}: {
  title: string;
  description: string;
  variant: PhoneVariant;
  visualPosition: 'left' | 'right';
}) {
  const visual = <ScenarioVisual variant={variant} />;
  const copy = (
    <div className="flex flex-col justify-center px-1 py-5 md:px-8">
      <h3 className="font-['Google Sans',sans-serif] text-[28px] font-medium leading-[34px] tracking-[-0.4px] text-[#191c1d] md:text-[34px] md:leading-[42px]">{title}</h3>
      <p className={`${bodyClass} mt-4 max-w-[520px] md:text-lg md:leading-7`}>{description}</p>
    </div>
  );

  return (
    <article className="grid items-stretch gap-5 md:grid-cols-2 md:gap-8">
      {visualPosition === 'left' ? visual : copy}
      {visualPosition === 'left' ? copy : visual}
    </article>
  );
}

export default function ServiceSprintContent() {
  const [isStatusModelOpen, setIsStatusModelOpen] = useState(false);

  useEffect(() => {
    if (!isStatusModelOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsStatusModelOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isStatusModelOpen]);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 text-[#191c1d]">
      <header className="flex flex-col gap-3">
        <h1 className="max-w-[960px] font-['Google Sans',sans-serif] text-[32px] font-medium leading-[38px] tracking-[-0.5px] md:text-[48px] md:leading-[56px] md:tracking-[-1.2px]">
          Сервисные команды
        </h1>
        <p className="max-w-[900px] font-['Google Sans',sans-serif] text-base font-medium leading-[22px] md:text-xl md:leading-[28px]">
          Приложение для постановки задач и контроля выездных работ
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <TagBadge tone="ai">Концепт</TagBadge>
          <TagBadge tone="web">PWA</TagBadge>
          <TagBadge tone="b2b">FSM</TagBadge>
        </div>
      </header>

      <section className="relative grid items-center gap-8 overflow-hidden rounded-[36px] bg-[#f8fbff] p-5 md:grid-cols-[0.82fr_1.18fr] md:gap-10 md:p-8 lg:p-12">
        <div className="order-2 flex flex-col justify-center rounded-[32px] bg-white/88 p-5 md:p-7 lg:p-8">
          <h2 className={sectionTitleClass}>Что за продукт</h2>
          <p className={`${bodyClass} mt-4 max-w-[650px] md:text-lg md:leading-7`}>
            Мобильная платформа для сервисных компаний, где руководители создают задачи, назначают сотрудников и контролируют выполнение работ, а специалисты получают понятный план действий и фиксируют результат.
          </p>
          <p className={`${bodyClass} mt-3 max-w-[650px] md:text-lg md:leading-7`}>
            Мы работали небольшой командой в режиме стартапа. Чтобы быстрее проверить продуктовую гипотезу и не тратить ресурсы на отдельные мобильные приложения, решили начать с PWA — веб-приложения, которое можно использовать на смартфоне.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-medium"><UserRound className="size-4 text-[#0b57d0]" />Руководитель</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-medium"><Wrench className="size-4 text-[#146c2e]" />Исполнитель</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-medium"><Building2 className="size-4 text-[#7a4d00]" />Сервисная компания</span>
          </div>
        </div>
        <div className="order-1 flex justify-center">
          <ScenarioVisual variant="control" />
        </div>
      </section>

      <AuthorizationScreens />

      <section className="flex flex-col gap-6 py-8 md:gap-8 md:py-12">
        <h2 className={`${sectionTitleClass} text-center`}>Проблема</h2>
        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          <TextCard title="Задачи теряются между каналами" tone="blue">
            Работа часто распределяется через звонки, чаты и таблицы. Руководителю сложно понимать актуальный статус задач.
          </TextCard>
          <TextCard title="Нет прозрачности выполнения" tone="green">
            После передачи задачи нужно отдельно уточнять, взял ли сотрудник работу, что сделано и есть ли проблемы.
          </TextCard>
          <TextCard title="Сложно управлять мобильной командой">
            Руководителю нужен простой инструмент для распределения работы и контроля результата.
          </TextCard>
        </div>
      </section>

      <section className="flex flex-col gap-6 py-8 md:gap-8 md:py-12">
        <h2 className={`${sectionTitleClass} text-center`}>Мой вклад</h2>
        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          <TextCard title="Собрал логику продукта">
            Определил роли пользователей и основные сценарии: создание задачи, назначение исполнителя, выполнение работы и контроль результата.
          </TextCard>
          <TextCard title="Спроектировал мобильные сценарии">
            Продумал основные пользовательские потоки и интерфейс для ежедневного использования сотрудниками.
          </TextCard>
          <TextCard title="Создал систему контроля">
            Спроектировал статусы, уведомления, чек-листы и фиксацию результата выполнения.
          </TextCard>
        </div>
      </section>

      <section className="grid gap-6 py-8 md:grid-cols-[0.36fr_0.64fr] md:items-start md:gap-10 md:py-12">
        <div className="md:sticky md:top-28">
          <h2 className={sectionTitleClass}>Статусная модель задачи</h2>
          <p className={`${bodyClass} mt-4 md:text-lg md:leading-7`}>
            Описал допустимые переходы между статусами и действия для каждой роли. Модель помогает руководителю и исполнителю одинаково понимать состояние задачи — от назначения до проверки и завершения.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsStatusModelOpen(true)}
          className="cursor-zoom-in overflow-hidden rounded-[28px] border border-[#e1e4e7] bg-[#f3f4f4] text-left"
          aria-label="Открыть статусную модель во весь экран"
        >
          <img
            src={serviceSprintStatusModel}
            alt="Статусная модель задачи с ролями, событиями и переходами между статусами"
            className="h-auto w-full"
            loading="lazy"
            decoding="async"
          />
        </button>
      </section>

      {isStatusModelOpen ? (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 p-3 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Статусная модель задачи"
          onClick={() => setIsStatusModelOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsStatusModelOpen(false)}
            className="fixed right-4 top-4 z-10 flex size-12 items-center justify-center rounded-full bg-white text-[#191c1d] transition-transform hover:scale-105 md:right-8 md:top-8"
            aria-label="Закрыть"
          >
            <X className="size-6" />
          </button>
          <img
            src={serviceSprintStatusModel}
            alt="Статусная модель задачи с ролями, событиями и переходами между статусами"
            className="max-h-full max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}

      <section id="service-scenario" className="flex flex-col gap-10 overflow-hidden px-4 py-10 md:gap-14 md:px-8 md:py-14">
        <h2 className={`${sectionTitleClass} text-center`}>Ключевые решения</h2>
        <article className="grid items-stretch gap-5 md:grid-cols-2 md:gap-8">
          <AiTaskVisual />
          <div className="flex flex-col justify-center px-1 py-5 md:px-8">
            <h3 className="font-['Google Sans',sans-serif] text-[28px] font-medium leading-[34px] tracking-[-0.4px] text-[#191c1d] md:text-[34px] md:leading-[42px]">Постановка задачи с помощью ИИ</h3>
            <p className={`${bodyClass} mt-4 max-w-[520px] md:text-lg md:leading-7`}>
              Руководитель описывает проблему обычными словами, а ИИ-помощник определяет тип работы и превращает сообщение в структурированную задачу для исполнителя.
            </p>
          </div>
        </article>
        <SolutionStory
          title="Быстрое создание задач"
          description="Руководитель создаёт задачу, добавляет описание, сроки, чек-лист и назначает исполнителя."
          variant="task"
          visualPosition="left"
        />
        <SolutionStory
          title="Управление исполнителями"
          description="Выбор исполнителя помогает распределять работу между специалистами и понимать текущую загрузку команды."
          variant="assignee"
          visualPosition="right"
        />
        <ExecutorFlowVisual />
        <SolutionStory
          title="Контроль выполнения"
          description="Руководитель получает прозрачную картину выполнения без постоянных уточнений."
          variant="control"
          visualPosition="right"
        />
      </section>

      <section className="flex flex-col gap-6 pb-0 pt-8 md:gap-8 md:pb-0 md:pt-12">
        <h2 className={`${sectionTitleClass} text-center`}>Чем горжусь</h2>
        <div className="relative w-full overflow-hidden rounded-[28px] bg-[#f3f4f4] p-6 md:mx-auto md:w-[56%] md:max-w-[760px] md:p-8">
          <p className={`${bodyClass} relative z-10 text-[#191c1d] md:text-lg md:leading-7`}>
            В этом проекте мне удалось спроектировать мобильный продукт с нуля: от ролей и сценариев до готового интерфейса для ежедневной работы сервисных команд.
          </p>
        </div>
      </section>

      <section className="flex w-full flex-col items-center justify-center gap-6 rounded-[28px] bg-[#e9f1ff] p-6 text-center text-[#191c1d] md:mx-auto md:w-[56%] md:max-w-[760px] md:p-8">
        <div className="flex max-w-[560px] flex-col items-center gap-2">
          <h2 className="font-['Google Sans',sans-serif] text-2xl font-medium leading-[30px]">Продолжить или связаться</h2>
          <p className="font-['Google Sans Flex','Google Sans',sans-serif] text-base leading-6 text-[#5f6368]">
            Можно посмотреть следующий кейс или сразу написать мне в Telegram
          </p>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row md:w-auto">
          <Link
            to="/cases/routes"
            className="flex h-14 min-w-[176px] items-center justify-center rounded-full bg-[#191c1d] px-6 text-center font-['Google Sans',sans-serif] text-base font-semibold leading-5 text-white transition-colors hover:bg-[#303437]"
          >
            Следующий кейс
          </Link>
          <a
            href="https://t.me/spacemanfromul"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 min-w-[132px] items-center justify-center rounded-full bg-[#2f5bd6] px-6 font-['Google Sans',sans-serif] text-base font-semibold leading-5 text-white transition-colors hover:bg-[#2448b8]"
          >
            Связаться
          </a>
        </div>
      </section>
    </div>
  );
}
