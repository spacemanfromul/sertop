import { Children, useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AboutMe from '../components/AboutMe';
import Modal from '../components/Modal';
import PortfolioVideo from '../components/PortfolioVideo';
import TagBadge, { type TagBadgeTone } from '../components/TagBadge';
import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  FileText,
  GitBranch,
  Layers3,
  MapPinned,
  Pause,
  Play,
  RotateCcw,
  Route,
  ScanSearch,
  Sparkles,
  ToggleLeft,
  Trophy,
  UsersRound,
  X,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from 'lucide-react';
import caseAdminImage from "../../assets/cases/case-admin.png";
import caseAiMobileImage from "../../assets/cases/case-ai-mobile.jpg";
import caseAiWebImage from "../../assets/cases/case-ai-web.jpg";
import caseExperimentVideo from "../../assets/cases/case-experiment.mp4";
import caseRoutesPrototypeDemoVideo from "../../assets/cases/routes-prototype-demo.mp4";
import caseRoutesPrototypeGeozonesVideo from "../../assets/cases/routes-prototype-geozones.mp4";
import caseRoutesPrototypeModesVideo from "../../assets/cases/routes-prototype-modes.mp4";
import caseRoutesCoverVideo from "../../assets/cases/routes-prototype-cover.mp4";
import routesDriverImage from "../../assets/cases/routes-driver.jpg";
import routesDashboardImage from "../../assets/cases/routes-dashboard.jpg";
import routesFuelImage from "../../assets/cases/routes-fuel.jpg";
import routesDispatcherImage from "../../assets/cases/routes-dispatcher.jpg";
import routesPrototypeGeozonesImage from "../../assets/cases/routes-prototype-geozones.jpg";
import routesPrototypeMapImage from "../../assets/cases/routes-prototype-map.jpg";
import routesPrototypeRegistryImage from "../../assets/cases/routes-prototype-registry.jpg";
import heroTransitionVideo from "../../assets/cases/hero-transition.mp4";
import pushupFrameImage from "../../assets/cases/pushup-frame.webp";
import pushupPositionImage from "../../assets/cases/pushup-position.webp";
import pushupCounterImage from "../../assets/cases/pushup-counter.webp";
import pushupGymBgImage from "../../assets/cases/pushup-gym-bg.webp";
import pushupLightOnImage from "../../assets/cases/pushup-light-on.png";
import pushupLightOffImage from "../../assets/cases/pushup-light-off.png";
import pushupSetupPhotoImage from "../../assets/cases/pushup-setup-photo.png";
import pushupWaveBgImage from "../../assets/cases/pushup-wave-bg.png";
import pushupStepsBgImage from "../../assets/cases/pushup-steps-bg.png";
import phoneMockupImage from "../../assets/cases/phone-mockup.png";
import caseAdminGroup1 from "../../assets/cases/case-admin-group-1.jpg";
import caseAdminGroup2 from "../../assets/cases/case-admin-group-2.jpg";
import caseAdminGroup3 from "../../assets/cases/case-admin-group-3.jpg";
import caseAdminGroup5 from "../../assets/cases/case-admin-group-5.jpg";
import caseAdminGroup6 from "../../assets/cases/case-admin-group-6.jpg";
import caseAdminTreeClosed from "../../assets/cases/case-admin-tree-closed.jpg";
import caseAdminTreeOpen from "../../assets/cases/case-admin-tree-open.jpg";
import caseAdminEdit1 from "../../assets/cases/case-admin-edit-1.jpg";
import caseAdminEdit2 from "../../assets/cases/case-admin-edit-2.jpg";
import caseAdminEdit3 from "../../assets/cases/case-admin-edit-3.jpg";
import caseAdminEdit4 from "../../assets/cases/case-admin-edit-4.jpg";

type ProjectId = 'admin-panel' | 'routes' | 'pushup-counter';

export default function HomePage() {
  const [activeModal, setActiveModal] = useState<ProjectId | null>(null);

  useEffect(() => {
    // SEO метатеги для главной страницы
    document.title = 'Сергей Топорков — UX/UI дизайнер портфолио';
    
    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    const setPropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMetaTag('description', 'Портфолио UX/UI дизайнера Сергея Топоркова. Превращаю сложные системы в понятный пользовательский опыт. Кейсы: админ-панель, маршруты доставки.');
    setMetaTag('keywords', 'UX дизайнер, UI дизайнер, портфолио дизайнера, Сергей Топорков, веб-дизайн, интерфейсы, UX/UI');
    setMetaTag('author', 'Сергей Топорков');
    
    // Open Graph для соцсетей
    setPropertyTag('og:title', 'Сергей Топорков — UX/UI дизайнер');
    setPropertyTag('og:description', 'Превращаю сложные системы в понятный пользовательский опыт');
    setPropertyTag('og:type', 'website');
    setPropertyTag('og:url', window.location.href);
    
    // Twitter Card
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', 'Сергей Топорков — UX/UI дизайнер');
    setMetaTag('twitter:description', 'Превращаю сложные системы в понятный пользовательский опыт');
    document.title = 'Сергей Топорков - Продуктовый дизайнер';
    setMetaTag('description', 'Портфолио продуктового дизайнера Сергея Топоркова. Проектирую сложные B2B-системы, интерфейсы для админ-панелей, карт и AI-сценариев.');
    setMetaTag('keywords', 'продуктовый дизайнер, UX дизайнер, UI дизайнер, портфолио дизайнера, Сергей Топорков, B2B, интерфейсы, AI');
    setMetaTag('author', 'Сергей Топорков');
    setPropertyTag('og:title', 'Сергей Топорков - Продуктовый дизайнер');
    setPropertyTag('og:description', 'Проектирую сложные B2B-системы, интерфейсы для админ-панелей, карт и AI-сценариев.');
    setMetaTag('twitter:title', 'Сергей Топорков - Продуктовый дизайнер');
    setMetaTag('twitter:description', 'Проектирую сложные B2B-системы, интерфейсы для админ-панелей, карт и AI-сценариев.');
  }, []);

  return (
    <div className="min-h-screen w-full bg-white">
      <Header />
      <HeroStage />
      <SectionIntro
        title="Кейсы"
        description="B2B-интерфейсы для маршрутов, администрирования и управления версиями"
      />
      <CasesBlock onProjectClick={setActiveModal} />
      <SectionIntro
        title="Обо мне"
        description="Чем я живу вне работы и что помогает возвращаться к продуктовым задачам со свежей головой"
      />
      <AboutMe />
      <ThankYou />

      <Modal isOpen={activeModal === 'admin-panel'} onClose={() => setActiveModal(null)}>
        <AdminPanelContent onNextCase={() => setActiveModal('pushup-counter')} />
      </Modal>

      <Modal isOpen={activeModal === 'routes'} onClose={() => setActiveModal(null)}>
        <RoutesContent
          onAdjacentCase={() => setActiveModal('admin-panel')}
          onOpenPrototype={() => window.open('/#routes-prototype', '_blank', 'noopener,noreferrer')}
        />
      </Modal>

      <Modal isOpen={activeModal === 'pushup-counter'} onClose={() => setActiveModal(null)}>
        <PushupCounterContent onAdjacentCase={() => setActiveModal('routes')} />
      </Modal>
    </div>
  );
}

function SectionIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto flex w-full max-w-[1392px] flex-col items-center gap-3 px-4 pb-2 pt-12 text-center md:px-8 md:pb-4 md:pt-20">
      <div className="flex max-w-[760px] flex-col items-center gap-3">
        <h2 className="font-['Google Sans',sans-serif] text-[40px] font-medium leading-[46px] tracking-[-0.5px] text-[#191c1d] md:text-[64px] md:leading-[72px]">
          {formatText(title)}
        </h2>
        <p className="max-w-[560px] font-['Google Sans',sans-serif] text-base font-medium leading-[22px] text-[#747775] md:text-xl md:leading-[28px]">
          {formatText(description)}
        </p>
      </div>
    </section>
  );
}

function formatText(text: string) {
  return text
    .replace(/(^|[\s(])(и|в|во|на|к|ко|с|со|по|для|под|над|от|до|из|у|а|но|за|без|при|о|об|обо)\s+/giu, '$1$2\u00a0')
    .replace(/([\p{L}0-9])[-–]([\p{L}0-9])/gu, '$1\u2011$2');
}

function formatParagraph(text: string) {
  const formatted = formatText(text);
  return /[.!?…]$/.test(formatted.trim()) ? formatted : `${formatted}.`;
}

function HeroStage() {
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);
  const readyVideosRef = useRef(new Set<string>());
  const splitVideoStartedRef = useRef(false);

  const playSplitVideos = (videoKey: 'left' | 'right') => {
    readyVideosRef.current.add(videoKey);

    if (
      splitVideoStartedRef.current ||
      readyVideosRef.current.size < 2 ||
      !leftVideoRef.current ||
      !rightVideoRef.current
    ) {
      return;
    }

    splitVideoStartedRef.current = true;
    leftVideoRef.current.currentTime = 0;
    rightVideoRef.current.currentTime = 0;

    requestAnimationFrame(() => {
      void leftVideoRef.current?.play();
      void rightVideoRef.current?.play();
    });
  };

  return (
    <section className="relative isolate mx-auto w-full overflow-hidden" aria-label="Главный экран">
      <video
        className="pointer-events-none absolute inset-0 z-0 size-full object-cover md:hidden"
        src={heroTransitionVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 z-0 hidden size-full grid-cols-2 md:grid" aria-hidden="true">
        <div className="relative size-full overflow-hidden">
          <video
            ref={leftVideoRef}
            className="absolute left-[-100%] top-0 h-full w-[200%] max-w-none object-cover"
            src={heroTransitionVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            onLoadedData={() => playSplitVideos('left')}
            onCanPlay={() => playSplitVideos('left')}
          />
        </div>
        <div className="relative size-full overflow-hidden">
          <video
            ref={rightVideoRef}
            className="absolute left-0 top-0 h-full w-[200%] max-w-none object-cover"
            src={heroTransitionVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            onLoadedData={() => playSplitVideos('right')}
            onCanPlay={() => playSplitVideos('right')}
          />
        </div>
      </div>
      <div className="absolute inset-0 z-10 bg-white/35" aria-hidden="true" />
      <div className="relative z-20 flex w-full flex-col gap-4 pb-4 pt-[90px] md:gap-8 md:pb-8 md:pt-[106px]">
        <div className="mx-auto w-full max-w-[1392px] px-4 md:px-8">
          <Hero />
        </div>
      </div>
    </section>
  );
}

function CaseCard({
  title,
  description,
  tags,
  onClick,
  children,
  className = '',
}: {
  title: string;
  description: string;
  tags: Array<{ label: string; tone: TagBadgeTone }>;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      onClick={onClick}
      className={`group flex w-full min-w-0 flex-col items-start gap-3 rounded-[28px] bg-[#f5f5f5] p-5 text-left transition-all duration-300 ease-out md:p-8 ${
        onClick ? 'cursor-pointer hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_44px_rgba(25,28,29,0.12)]' : ''
      } ${className}`}
    >
      {children}
      <h2 className="font-['Google Sans',sans-serif] text-[28px] font-medium leading-[34px] tracking-[-0.5px] text-[#191c1d] md:text-[40px] md:leading-[48px] md:tracking-[-1px]">
        {formatText(title)}
      </h2>
      <p className="font-['Google Sans',sans-serif] text-base font-medium leading-[22px] text-[#191c1d] md:text-xl md:leading-[26px]">
        {formatText(description)}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagBadge key={tag.label} tone={tag.tone}>
            {tag.label}
          </TagBadge>
        ))}
      </div>
    </Wrapper>
  );
}

function CaseImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="aspect-[3840/2136] w-full overflow-hidden rounded-xl shadow-[0_0_16px_0_rgba(0,0,0,0.18)]">
      <img
        alt={alt}
        className="size-full object-cover"
        src={src}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function CaseVideoPreview({ src, label }: { src: string; label: string }) {
  return (
    <PortfolioVideo
      className="aspect-[3840/2136] w-full rounded-xl shadow-[0_0_16px_0_rgba(0,0,0,0.18)]"
      src={src}
      label={label}
      preload="metadata"
    />
  );
}

function AiPreview() {
  return (
    <div className="flex w-full items-center gap-4 md:gap-8">
      <div className="h-[235px] w-[104px] shrink-0 overflow-hidden rounded-xl shadow-[0_0_16px_0_rgba(0,0,0,0.18)] md:h-[341px] md:w-[151px]">
        <img
          alt="Мобильный экран ИИ-помощника"
          className="size-full object-cover"
          src={caseAiMobileImage}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="h-[235px] min-w-0 flex-1 overflow-hidden rounded-xl shadow-[0_0_16px_0_rgba(0,0,0,0.18)] md:h-[341px]">
        <img
          alt="Веб-экран ИИ-помощника"
          className="size-full object-cover"
          src={caseAiWebImage}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

function ExperimentPreview() {
  return (
    <PortfolioVideo
      className="h-[235px] w-[104px] rounded-xl shadow-[0_0_16px_0_rgba(0,0,0,0.18)] md:h-[341px] md:w-[151px]"
      src={caseExperimentVideo}
      label="Экспериментальный прототип"
      preload="metadata"
    />
  );
}

function PushupScreensPreview() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[24px] shadow-[0_18px_46px_rgba(25,28,29,0.22)]">
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full scale-105 object-cover blur-[3px]"
        src={pushupGymBgImage}
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative aspect-[928/1962] h-[88%] drop-shadow-[0_22px_36px_rgba(0,0,0,0.45)]">
          <img
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full"
            src={phoneMockupImage}
            loading="lazy"
            decoding="async"
          />
          <div
            className="absolute left-[4.09%] top-[1.12%] h-[97.66%] w-[92.03%] overflow-hidden bg-black"
            style={{ borderRadius: '15.46% / 6.89%' }}
          >
            <img
              alt="Экран активного подхода со счётчиком"
              className="size-full object-cover"
              src={pushupCounterImage}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PushupPhoneMockup({
  src,
  alt,
  className = '',
  children,
}: {
  src?: string;
  alt?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative aspect-[928/1962] w-full max-w-[320px] drop-shadow-[0_22px_36px_rgba(0,0,0,0.22)] ${className}`}>
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full"
        src={phoneMockupImage}
        loading="lazy"
        decoding="async"
      />
      <div
        className="absolute left-[4.09%] top-[1.12%] h-[97.66%] w-[92.03%] overflow-hidden bg-black"
        style={{ borderRadius: '15.46% / 6.89%' }}
      >
        {children ?? (
          <img
            alt={alt}
            className="size-full object-cover"
            src={src}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
    </div>
  );
}

function PushupLightingMockup({ className = '' }: { className?: string }) {
  return (
    <PushupPhoneMockup className={`mx-auto md:mx-0 ${className}`}>
      <div className="relative size-full overflow-hidden bg-black">
        <img
          alt="Экран тренировки без подсветки"
          className="absolute inset-0 size-full object-cover"
          src={pushupLightOffImage}
          loading="lazy"
          decoding="async"
        />
        <img
          alt="Экран тренировки с включённой подсветкой"
          className="pushup-light-screen-on absolute inset-0 size-full object-cover"
          src={pushupLightOnImage}
          loading="lazy"
          decoding="async"
        />
        <div className="pushup-light-glow absolute inset-0 bg-[radial-gradient(circle_at_78%_78%,rgba(82,255,82,0.3),rgba(82,255,82,0)_34%)]" aria-hidden="true" />
      </div>
      <style>{`
        .pushup-light-screen-on {
          animation: pushup-light-screen 7.2s ease-in-out infinite;
        }

        .pushup-light-glow {
          animation: pushup-light-glow 7.2s ease-in-out infinite;
          mix-blend-mode: screen;
        }

        @keyframes pushup-light-screen {
          0%, 38% {
            opacity: 0;
          }
          52%, 84% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes pushup-light-glow {
          0%, 40%, 100% {
            opacity: 0;
          }
          58%, 82% {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pushup-light-screen-on,
          .pushup-light-glow {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </PushupPhoneMockup>
  );
}

function PushupScreensShowcase() {
  const StepCard = ({
    step,
    title,
    description,
    className = '',
  }: {
    step: string;
    title: string;
    description: string;
    className?: string;
  }) => (
    <div className={`flex min-w-0 flex-col gap-3 rounded-[28px] bg-white/90 p-5 shadow-[0_18px_46px_rgba(25,28,29,0.1)] backdrop-blur md:p-6 ${className}`}>
      <div className="flex size-10 items-center justify-center rounded-full bg-[#52ff52] font-['Google Sans',sans-serif] text-base font-semibold text-[#111]">
        {step}
      </div>
      <h3 className="font-['Google Sans',sans-serif] text-2xl font-medium leading-[30px] tracking-[0] text-[#191c1d]">
        {formatText(title)}
      </h3>
      <p className="font-['Google Sans Flex','Google Sans',sans-serif] text-base font-normal leading-6 tracking-[0] text-[#3c4043]">
        {formatText(description)}
      </p>
    </div>
  );

  const steps = [
    {
      step: '1',
      title: 'Поставить телефон на пол',
      description: 'Пользователь ставит телефон перед собой. Можно использовать обычную бутылку как опору вместо штатива.',
    },
    {
      step: '2',
      src: pushupFrameImage,
      alt: 'Пользователь встаёт в кадр',
      title: 'Встать в рамку',
      description: 'Пользователь отходит от телефона, пока помещается в рамке. Приложение считывает пользователя и калибруется.',
    },
    {
      step: '3',
      src: pushupPositionImage,
      alt: 'Пользователь принимает положение для отжимания',
      title: 'Начать подход',
      description: 'Когда пользователь занимает позицию, приложение начинает отслеживать движение. Счётчик работает без нажатий, а интерфейс остаётся крупным и читаемым с расстояния.',
    },
    {
      step: '4',
      src: pushupCounterImage,
      alt: 'Активный подход со счётчиком отжиманий',
      title: 'Не смотреть на экран',
      description: 'Во время подхода приложение озвучивает повторения и показывает прогресс в отдельном видимом блоке. Пользователю не нужно отвлекаться на экран.',
    },
    {
      step: '5',
      title: 'Подсветка для плохого освещения',
      description: 'Если тренировка проходит вечером или в тёмном помещении, можно включить подсветку. Это помогает камере точнее распознавать движение.',
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[36px] bg-white px-5 py-8 text-[#191c1d] md:overflow-visible md:px-10 md:py-12 lg:px-14">
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-70 blur-[3px] md:-inset-x-12 md:-inset-y-16 md:h-[calc(100%+8rem)] md:w-[calc(100%+6rem)] md:opacity-85 md:blur-[6px]"
        src={pushupStepsBgImage}
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-white/10" aria-hidden="true" />
      <div className="relative z-10 flex flex-col gap-24 md:gap-24 lg:gap-24">
        <h2 className="text-center font-['Google Sans',sans-serif] text-[32px] font-medium leading-[38px] tracking-[-0.5px] md:text-[40px] md:leading-[48px] md:tracking-[-1px]">
          {formatText('Как это работает')}
        </h2>

        <article className="grid min-w-0 gap-6 md:grid-cols-2 md:items-center">
          <StepCard
            step={steps[0].step}
            title={steps[0].title}
            description={steps[0].description}
            className="md:ml-auto md:mr-8 md:max-w-[360px] md:translate-y-8"
          />
          <div className="aspect-square w-full max-w-[300px] justify-self-center overflow-hidden rounded-[28px] shadow-[0_22px_58px_rgba(25,28,29,0.16)] md:ml-8 md:max-w-[340px] md:justify-self-start">
            <img
              alt="Пользователь ставит телефон перед тренировкой"
              className="size-full object-cover"
              src={pushupSetupPhotoImage}
              loading="lazy"
              decoding="async"
            />
          </div>
        </article>

        <article className="grid min-w-0 gap-6 md:grid-cols-2 md:items-center">
          <div className="flex justify-center md:justify-end md:pr-8">
            <PushupPhoneMockup className="max-w-[230px] md:max-w-[270px]" alt={steps[1].alt ?? ''} src={steps[1].src ?? ''} />
          </div>
          <StepCard
            step={steps[1].step}
            title={steps[1].title}
            description={steps[1].description}
            className="md:ml-8 md:max-w-[360px] md:translate-y-10"
          />
        </article>

        <article className="grid min-w-0 gap-6 md:grid-cols-2 md:items-center">
          <StepCard
            step={steps[2].step}
            title={steps[2].title}
            description={steps[2].description}
            className="md:ml-auto md:mr-8 md:max-w-[360px] md:-translate-y-10"
          />
          <div className="flex justify-center md:justify-start md:pl-8">
            <PushupPhoneMockup className="max-w-[230px] md:max-w-[270px]" alt={steps[2].alt ?? ''} src={steps[2].src ?? ''} />
          </div>
        </article>

        <article className="grid min-w-0 gap-6 md:grid-cols-2 md:items-center">
          <div className="flex justify-center md:justify-end md:pr-8">
            <PushupPhoneMockup className="max-w-[230px] md:max-w-[270px]" alt={steps[3].alt ?? ''} src={steps[3].src ?? ''} />
          </div>
          <StepCard
            step={steps[3].step}
            title={steps[3].title}
            description={steps[3].description}
            className="md:ml-8 md:max-w-[360px] md:translate-y-10"
          />
        </article>

        <article className="grid min-w-0 gap-6 md:grid-cols-2 md:items-center">
          <StepCard
            step={steps[4].step}
            title={steps[4].title}
            description={steps[4].description}
            className="md:ml-auto md:mr-8 md:max-w-[360px] md:-translate-y-10"
          />
          <div className="flex justify-center md:justify-start md:pl-8">
            <PushupLightingMockup className="max-w-[230px] md:mx-0 md:max-w-[270px]" />
          </div>
        </article>
      </div>
    </section>
  );
}

function CasesBlock({ onProjectClick }: { onProjectClick: (project: ProjectId) => void }) {
  return (
    <div className="mx-auto flex w-full max-w-[1392px] shrink-0 flex-col gap-6 px-4 py-4 md:px-8 md:py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CaseCard
          onClick={() => onProjectClick('routes')}
          title="Система контроля транспортных расходов"
          description="Собрал карту перемещений, чтобы быстрее находить поездки и контролировать спорные расходы"
          tags={[
            { label: 'WEB', tone: 'web' },
            { label: 'B2B', tone: 'b2b' },
            { label: 'Data-heavy', tone: 'data' },
          ]}
        >
          <CaseVideoPreview src={caseRoutesCoverVideo} label="Система контроля транспортных расходов" />
        </CaseCard>
        <CaseCard
          onClick={() => onProjectClick('admin-panel')}
          title="Управление релизами мобильного приложения"
          description="Сделал сложную логику проще через дерево в таблице, чтобы команда легко и быстро управляла бета-версиями"
          tags={[
            { label: 'WEB', tone: 'web' },
            { label: 'B2B', tone: 'b2b' },
          ]}
        >
          <CaseImage src={caseAdminImage} alt="Управление релизами мобильного приложения" />
        </CaseCard>
        <CaseCard
          onClick={() => onProjectClick('pushup-counter')}
          title="Счетчик отжиманий"
          description="Собрал Android-приложение в Codex, чтобы камера считала отжимания и помогала держать ежедневный челлендж"
          tags={[
            { label: 'Mobile', tone: 'mobile' },
            { label: 'AI', tone: 'ai' },
            { label: 'Pet project', tone: 'pet' },
          ]}
        >
          <PushupScreensPreview />
        </CaseCard>
      </div>
      {false && (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.42fr_1fr]">
        <CaseCard
          title="ИИ-помощник сотрудника"
          description="Проверил AI-сценарии на рабочих задачах и показал, где помощник экономит время"
          tags={[
            { label: 'AI', tone: 'ai' },
            { label: 'Mobile', tone: 'mobile' },
            { label: 'WEB', tone: 'web' },
            { label: 'B2B', tone: 'b2b' },
          ]}
        >
          <AiPreview />
        </CaseCard>
        <CaseCard
          title="Эксперименты"
          description="Собираю быстрые прототипы, чтобы проверять идеи до полноценной разработки"
          tags={[
            { label: 'AI', tone: 'ai' },
            { label: 'Mobile', tone: 'mobile' },
          ]}
        >
          <ExperimentPreview />
        </CaseCard>
      </div>
      )}
    </div>
  );
}

function ThankYou() {
  return (
    <footer className="mx-auto flex w-full max-w-[1392px] shrink-0 flex-col items-center px-4 pb-6 pt-8 text-center md:px-8 md:pb-8 md:pt-12">
      <p className="font-['Google Sans',sans-serif] text-[13px] font-normal leading-[18px] text-[#999]">
        © Сергей Топорков 2026
      </p>
    </footer>
  );
}

function CaseStudyText({ children }: { children: string }) {
  return (
    <p
      className="font-['Google Sans Flex','Google Sans',sans-serif] text-base font-normal leading-6 tracking-[0] text-[#191c1d]"
      style={{ fontOpticalSizing: 'auto' }}
    >
      {formatParagraph(children)}
    </p>
  );
}

function CaseDecisionTitle({ children }: { children: string }) {
  return (
    <h3
      className="font-['Google Sans Flex','Google Sans',sans-serif] text-xl font-medium leading-[26px] tracking-[0] text-[#191c1d] lg:text-2xl lg:leading-[30px]"
      style={{ fontOpticalSizing: 'auto' }}
    >
      {formatText(children)}
    </h3>
  );
}

function CaseStudySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full flex-col gap-4 py-6 text-center text-[#191c1d]">
      <h2 className="font-['Google Sans',sans-serif] text-[32px] font-medium leading-[38px] tracking-[-0.5px] md:text-[40px] md:leading-[48px] md:tracking-[-1px]">
        {formatText(title)}
      </h2>
      <div className="flex flex-col gap-4 text-left">
        {children}
      </div>
    </section>
  );
}

function CaseStudyImageBlock({
  alt,
  src = caseAdminImage,
  onClick,
}: {
  alt: string;
  src?: string;
  onClick?: () => void;
}) {
  const image = (
    <img
      alt={alt}
      className="size-full object-cover"
      src={src}
      loading="lazy"
      decoding="async"
    />
  );

  return (
    <div className="w-full overflow-hidden rounded-[28px]">
      <div className="aspect-[3840/2136] w-full overflow-hidden">
        {onClick ? (
          <button
            type="button"
            onClick={onClick}
            className="group relative size-full cursor-pointer overflow-hidden text-left"
          >
            {image}
            <span className="absolute bottom-4 left-4 rounded-full bg-black/80 px-4 py-2 font-['Google Sans',sans-serif] text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
              Открыть в плеере
            </span>
          </button>
        ) : (
          image
        )}
      </div>
    </div>
  );
}

function CaseStudyVideoBlock({ src, label }: { src: string; label: string }) {
  return (
    <div className="w-full rounded-[28px] bg-[#fafbec] p-4 md:p-12 lg:p-16">
      <PortfolioVideo
        className="aspect-[3840/2136] w-full rounded-xl shadow-[0_0_16px_0_rgba(0,0,0,0.12)]"
        src={src}
        label={label}
        controls
        preload="metadata"
      />
    </div>
  );
}

function RoutesMedia({
  src,
  label,
  className = '',
}: {
  src: string;
  label: string;
  className?: string;
}) {
  return (
    <figure className={`flex w-full flex-col ${className}`}>
      <PortfolioVideo
        className="aspect-[3840/2136] w-full rounded-2xl shadow-[0_0_16px_0_rgba(0,0,0,0.12)]"
        src={src}
        label={label}
        controls
        preload="metadata"
      />
    </figure>
  );
}

function getCaseBlockIcon(title: string): LucideIcon {
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes('продукт')) return BriefcaseBusiness;
  if (normalizedTitle.includes('проблем')) return CircleAlert;
  if (normalizedTitle.includes('вклад')) return Sparkles;
  if (normalizedTitle.includes('горж')) return Trophy;
  if (normalizedTitle.includes('карт') || normalizedTitle.includes('таблиц')) return MapPinned;
  if (normalizedTitle.includes('реестр')) return ToggleLeft;
  if (normalizedTitle.includes('геозон')) return ScanSearch;
  if (normalizedTitle.includes('иерарх') || normalizedTitle.includes('вет')) return GitBranch;
  if (normalizedTitle.includes('групп')) return UsersRound;
  if (normalizedTitle.includes('управлен')) return Layers3;
  return Route;
}

function CaseBlockIcon({ title }: { title: string }) {
  const Icon = getCaseBlockIcon(title);

  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-[#191c1d]">
      <Icon className="size-5" strokeWidth={1.8} />
    </span>
  );
}

type RoutesContextVisualVariant = 'product' | 'problem' | 'contribution';

function CasePhotoCard({
  images,
  label,
}: {
  images: string[];
  label: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isWiping, setIsWiping] = useState(false);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reducedMotionQuery.matches || images.length < 2) {
      return;
    }

    const showDuration = 4600;
    const wipeDuration = 1400;
    const interval = window.setInterval(() => {
      setIsWiping(true);

      window.setTimeout(() => {
        setCurrentIndex(nextIndex);
        setNextIndex((nextIndex + 1) % images.length);
        setIsWiping(false);
      }, wipeDuration);
    }, showDuration);

    return () => window.clearInterval(interval);
  }, [images.length, nextIndex]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-[32px]">
      <img
        key={images[currentIndex]}
        className="case-photo-card-image case-photo-card-current absolute inset-0 size-full object-cover"
        src={images[currentIndex]}
        alt={label}
        loading="eager"
      />
      {images.length > 1 ? (
        <img
          key={images[nextIndex]}
          className={`case-photo-card-image case-photo-card-next absolute inset-0 size-full object-cover ${isWiping ? 'case-photo-card-next-visible' : ''}`}
          src={images[nextIndex]}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
      ) : null}
      <style>{`
        .case-photo-card-image {
          transform: scale(1.25);
          will-change: transform, clip-path;
        }

        .case-photo-card-current,
        .case-photo-card-next-visible {
          animation: case-photo-card-zoom 7s linear forwards;
        }

        .case-photo-card-next {
          filter: blur(8px);
          clip-path: polygon(0 0, 0 0, 0 0);
          transition: clip-path 1400ms ease-in-out, filter 1400ms ease-in-out;
        }

        .case-photo-card-next-visible {
          filter: blur(0);
          clip-path: polygon(0 0, 240% 0, 0 240%);
        }

        @keyframes case-photo-card-zoom {
          from {
            transform: scale(1.25);
          }
          to {
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .case-photo-card-image {
            animation: none;
            transform: scale(1);
          }

          .case-photo-card-next {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

function RoutesContextVisualCard({
  variant,
}: {
  variant: RoutesContextVisualVariant;
}) {
  const cards: Record<RoutesContextVisualVariant, { label: string; images: string[] }> = {
    product: {
      label: 'Разъездной сотрудник и маршрут',
      images: [routesDriverImage, routesDashboardImage, routesFuelImage, routesDispatcherImage],
    },
    problem: {
      label: 'Сложность старой системы',
      images: [routesPrototypeMapImage, routesPrototypeRegistryImage, routesDashboardImage],
    },
    contribution: {
      label: 'Проектирование сценария маршрутов',
      images: [routesPrototypeRegistryImage, routesPrototypeMapImage, routesPrototypeGeozonesImage],
    },
  };

  return <CasePhotoCard images={cards[variant].images} label={cards[variant].label} />;
}

function RoutesApiPillIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="118" height="48" viewBox="0 0 59 24" fill="none" aria-hidden="true">
      <path d="M11.976 0.315789H45.5086C51.9484 0.315789 57.1688 5.53619 57.1688 11.9759C57.1688 18.4156 51.9484 23.636 45.5086 23.636H11.976C5.53624 23.636 0.315789 18.4156 0.315789 11.9759C0.315789 5.53619 5.53624 0.315789 11.976 0.315789Z" fill="white" stroke="black" strokeWidth="0.631579" />
      <path d="M12.105 3.35645C8.2243 3.35645 5.07892 6.50182 5.07892 10.3822C5.07767 11.3048 5.25873 12.2186 5.6117 13.071C5.96466 13.9234 6.48258 14.6977 7.1357 15.3493C8.40716 16.6213 11.4023 18.4621 11.5779 20.394C11.6042 20.684 11.8141 20.921 12.105 20.921C12.3958 20.921 12.6055 20.6838 12.6317 20.394C12.8074 18.4621 15.8028 16.6213 17.074 15.3493C17.7271 14.6977 18.245 13.9234 18.598 13.071C18.951 12.2186 19.132 11.3048 19.1308 10.3822C19.1308 6.50182 15.9854 3.35645 12.105 3.35645Z" fill="#EB5547" />
      <path d="M12.1054 12.8461C12.5918 12.8461 13.0672 12.7019 13.4716 12.4317C13.8759 12.1615 14.1911 11.7775 14.3772 11.3282C14.5633 10.8789 14.612 10.3845 14.5171 9.90746C14.4223 9.43047 14.1881 8.99233 13.8442 8.64843C13.5003 8.30454 13.0621 8.07035 12.5852 7.97547C12.1082 7.88059 11.6138 7.92929 11.1644 8.1154C10.7151 8.30151 10.3311 8.61668 10.0609 9.02106C9.7907 9.42543 9.64648 9.90084 9.64648 10.3872C9.64648 11.0393 9.90555 11.6648 10.3667 12.1259C10.8278 12.5871 11.4533 12.8461 12.1054 12.8461Z" fill="white" />
      <path d="M29.5134 5.50635H26.7473C26.633 5.50635 26.5567 5.56353 26.5183 5.67788L21.9399 18.6121C21.8827 18.7458 21.9592 18.8602 22.1117 18.8602H24.0574C24.1721 18.8602 24.2674 18.8221 24.3055 18.6886L25.4502 15.1402H30.6772L31.86 18.6886C31.8981 18.803 31.9746 18.8602 32.089 18.8602H34.0922C34.2446 18.8602 34.3209 18.7458 34.2637 18.6121L29.7424 5.67816C29.7043 5.5638 29.6281 5.50635 29.5134 5.50635ZM30.0667 13.2705H26.0416L28.0254 7.10873L30.0667 13.2705Z" fill="#111111" />
      <path d="M35.2433 5.716L35.3579 12.0877L35.2433 18.65C35.2433 18.8027 35.3198 18.8599 35.4532 18.8599H37.4564C37.5898 18.8599 37.6661 18.8027 37.6661 18.65L37.5898 13.9572H40.1272C43.1414 13.9572 45.049 12.4692 45.049 9.66492C45.049 6.91786 43.1986 5.50635 40.1272 5.50635H35.4532C35.3198 5.50635 35.2433 5.56325 35.2433 5.716ZM37.647 7.22309H40.2225C41.844 7.22309 42.7787 8.02414 42.7787 9.72209C42.7787 11.5344 41.7105 12.2404 40.2988 12.2404H37.5708L37.647 7.22309Z" fill="#111111" />
      <path d="M48.7315 12.1073L48.8462 5.71628C48.8462 5.5638 48.7699 5.50635 48.6362 5.50635H46.6521C46.5187 5.50635 46.4424 5.5638 46.4424 5.71628L46.5568 12.107L46.4424 18.6502C46.4424 18.803 46.5187 18.8602 46.6521 18.8602H48.6362C48.7699 18.8602 48.8462 18.803 48.8462 18.6502L48.7315 12.107V12.1073Z" fill="#111111" />
    </svg>
  );
}

function RoutesExternalPlatformCostIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="86" height="86" viewBox="0 0 130 130" fill="none" aria-hidden="true">
      <g clipPath="url(#routes-cost-icon-clip)">
        <path d="M130 0H0V130H130V0Z" fill="#FF0032" />
        <path d="M54.4374 75C61.0649 75 66.4374 69.6274 66.4374 63C66.4374 56.3726 61.0649 51 54.4374 51C47.81 51 42.4374 56.3726 42.4374 63C42.4374 69.6274 47.81 75 54.4374 75Z" fill="white" />
        <path d="M28.5076 100H80.3674C78.8621 94.2703 75.5015 89.2005 70.8103 85.5826C66.1191 81.9648 60.3617 80.0026 54.4375 80.0026C48.5133 80.0026 42.7559 81.9648 38.0647 85.5826C33.3735 89.2005 30.0129 94.2703 28.5076 100Z" fill="white" />
        <path d="M100.893 65.8931V45.3828C96.8134 45.3828 92.9007 43.7621 90.0159 40.8773C87.1311 37.9925 85.5104 34.0798 85.5104 30H65C65 39.5194 68.7817 48.649 75.5129 55.3803C82.2442 62.1115 91.3737 65.8931 100.893 65.8931Z" fill="white" />
      </g>
      <defs>
        <clipPath id="routes-cost-icon-clip">
          <rect width="130" height="130" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function RoutesProblemOrbitAnimation() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const orbitItemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const orbitNodesRef = useRef<Array<{ label: string; x: number; y: number; vx: number; vy: number; radius: number }> | null>(null);
  const orbitItems = [
    { label: 'legacy', className: 'routes-problem-orbit-center', x: 50, y: 50, radius: 92 },
    { label: 'platform', className: 'routes-problem-orbit-a', x: 17, y: 25, radius: 74 },
    { label: 'maps', className: 'routes-problem-orbit-b', x: 83, y: 25, radius: 82 },
    { label: 'requests', className: 'routes-problem-orbit-c', x: 22, y: 76, radius: 70 },
    { label: 'mileage', className: 'routes-problem-orbit-d', x: 66, y: 76, radius: 70 },
    { label: 'statuses', className: 'routes-problem-orbit-e', x: 38, y: 18, radius: 70 },
    { label: 'time', className: 'routes-problem-orbit-f', x: 58, y: 84, radius: 70 },
    { label: 'ux', className: 'routes-problem-orbit-g', x: 82, y: 70, radius: 74 },
  ];
  useEffect(() => {
    let frame = 0;
    const safePadding = 36;
    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

    const tick = (time: number) => {
      const rect = stageRef.current?.getBoundingClientRect();

      if (rect) {
        const width = rect.width;
        const height = rect.height;

        if (!orbitNodesRef.current) {
          orbitNodesRef.current = orbitItems.map((item, index) => ({
            label: item.label,
            x: (width * item.x) / 100,
            y: (height * item.y) / 100,
            vx: Math.sin(index * 1.7) * 0.22,
            vy: Math.cos(index * 1.3) * 0.22,
            radius: item.radius,
          }));
        }

        const nodes = orbitNodesRef.current;
        nodes.forEach((node, index) => {
          const item = orbitItems[index];
          const homeX = (width * item.x) / 100;
          const homeY = (height * item.y) / 100;
          const phase = index * 1.55;
          const targetX = homeX + Math.sin(time / 3200 + phase) * (item.label === 'legacy' ? 28 : 40);
          const targetY = homeY + Math.cos(time / 3800 + phase) * (item.label === 'legacy' ? 18 : 30);
          const attraction = 0.0042;

          node.vx += (targetX - node.x) * attraction;
          node.vy += (targetY - node.y) * attraction;
        });

        for (let iteration = 0; iteration < 5; iteration += 1) {
          for (let i = 0; i < nodes.length; i += 1) {
            for (let j = i + 1; j < nodes.length; j += 1) {
              const a = nodes[i];
              const b = nodes[j];
              let dx = b.x - a.x;
              let dy = b.y - a.y;
              let distance = Math.hypot(dx, dy);
              const minDistance = a.radius + b.radius + 12;

              if (distance === 0) {
                dx = 1;
                dy = 0;
                distance = 1;
              }

              if (distance < minDistance) {
                const nx = dx / distance;
                const ny = dy / distance;
                const overlap = minDistance - distance;
                const correction = overlap * 0.045;
                const impulse = overlap * 0.006;

                a.x -= nx * correction;
                a.y -= ny * correction;
                b.x += nx * correction;
                b.y += ny * correction;
                a.vx -= nx * impulse;
                a.vy -= ny * impulse;
                b.vx += nx * impulse;
                b.vy += ny * impulse;
              }
            }
          }
        }

        nodes.forEach((node) => {
          const minX = node.radius + safePadding;
          const maxX = width - node.radius - safePadding;
          const minY = node.radius + safePadding;
          const maxY = height - node.radius - safePadding;

          if (node.x < minX || node.x > maxX) {
            node.vx += (clamp(node.x, minX, maxX) - node.x) * 0.045;
          }

          if (node.y < minY || node.y > maxY) {
            node.vy += (clamp(node.y, minY, maxY) - node.y) * 0.045;
          }

          node.vx *= 0.92;
          node.vy *= 0.92;
          const speed = Math.hypot(node.vx, node.vy);
          const maxSpeed = 1.4;

          if (speed > maxSpeed) {
            node.vx = (node.vx / speed) * maxSpeed;
            node.vy = (node.vy / speed) * maxSpeed;
          }

          node.x = clamp(node.x + node.vx, minX, maxX);
          node.y = clamp(node.y + node.vy, minY, maxY);
        });

        nodes.forEach((node) => {
          const element = orbitItemRefs.current[node.label];
          if (!element) {
            return;
          }

          element.style.left = '0px';
          element.style.top = '0px';
          element.style.transform = `translate3d(${node.x}px, ${node.y}px, 0) translate3d(-50%, -50%, 0)`;
        });
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const getOrbitItemStyle = (item: (typeof orbitItems)[number]) => {
    return {
      left: `${item.x}%`,
      top: `${item.y}%`,
      transform: 'translate3d(-50%, -50%, 0)',
    } as React.CSSProperties;
  };

  return (
    <div
      ref={stageRef}
      className="routes-problem-orbit-stage relative mx-auto h-[460px] w-full max-w-[920px] overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_18%_18%,rgba(233,241,255,0.95),transparent_34%),radial-gradient(circle_at_82%_82%,rgba(223,247,233,0.9),transparent_36%),#f8fafa]"
    >
      <div className="absolute inset-x-[18%] top-1/2 h-[1px] -translate-y-1/2 rounded-full bg-black/5" aria-hidden="true" />
      {orbitItems.map((item) => (
        <div
          key={item.label}
          ref={(node) => {
            orbitItemRefs.current[item.label] = node;
          }}
          className={`routes-problem-orbit-item absolute ${item.className}`}
          style={getOrbitItemStyle(item)}
        >
          {item.label === 'legacy' ? (
            <span className="flex flex-col items-center justify-center gap-2 rounded-[30px] bg-white px-7 py-5 text-center shadow-[0_18px_36px_rgba(25,28,29,0.13)]" aria-hidden="true">
              <span className="text-6xl leading-none">{'\u{1F996}'}</span>
              <span className="font-['Google Sans',sans-serif] text-base font-medium leading-5 text-[#191c1d]">legacy</span>
            </span>
          ) : item.label === 'platform' ? (
            <div className="flex w-32 flex-col items-center gap-2 rounded-[24px] bg-white p-3 text-center font-['Google Sans',sans-serif] text-xs font-medium leading-4 text-[#191c1d] shadow-[0_12px_32px_rgba(25,28,29,0.1)]">
              <RoutesExternalPlatformCostIcon className="size-14 rounded-[18px]" />
              <span>Внешняя платформа</span>
            </div>
          ) : item.label === 'maps' ? (
            <div className="flex flex-col items-center gap-2 rounded-[24px] bg-white px-4 py-3 text-center shadow-[0_14px_30px_rgba(25,28,29,0.12)]">
              <RoutesApiPillIcon />
              <span className="font-['Google Sans',sans-serif] text-xs font-medium leading-4 text-[#191c1d]">Карты</span>
            </div>
          ) : item.label === 'requests' ? (
            <RoutesOrbitEmoji emoji="📍" label="Заявки" />
          ) : item.label === 'mileage' ? (
            <RoutesOrbitEmoji emoji="⛽" label="Пробег" />
          ) : item.label === 'statuses' ? (
            <RoutesOrbitEmoji emoji="🚥" label="Статусы" />
          ) : item.label === 'time' ? (
            <span className="flex flex-col items-center justify-center gap-1.5 rounded-[24px] bg-white px-5 py-4 text-center shadow-[0_14px_28px_rgba(25,28,29,0.12)]" aria-hidden="true">
              <span className="text-4xl leading-none">{'\u23F1\uFE0F'}</span>
              <span className="font-['Google Sans',sans-serif] text-sm font-medium leading-5 text-[#191c1d]">Время</span>
            </span>
          ) : item.label === 'ux' ? (
            <span className="flex flex-col items-center justify-center gap-1 rounded-[24px] bg-white px-5 py-4 text-center shadow-[0_14px_28px_rgba(25,28,29,0.1)]" aria-hidden="true">
              <span className="text-5xl leading-none">{'\u{1F92F}'}</span>
              <span className="font-['Google Sans',sans-serif] text-sm font-medium leading-5 text-[#191c1d]">UX</span>
            </span>
          ) : (
            <div className="flex h-14 min-w-24 items-center justify-center rounded-2xl bg-white px-4 font-['Google Sans',sans-serif] text-sm font-medium leading-5 text-[#191c1d] shadow-[0_14px_28px_rgba(25,28,29,0.12)]">
              {item.label}
            </div>
          )}
        </div>
      ))}
      <style>{`
        .routes-problem-orbit-item {
          will-change: left, top, transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .routes-problem-orbit-item {
            will-change: auto;
          }
        }
      `}</style>
    </div>
  );
}

function RoutesOrbitEmoji({ emoji, label }: { emoji: string; label: string }) {
  return (
    <span className="flex flex-col items-center justify-center gap-1.5 rounded-[24px] bg-white px-5 py-4 text-center shadow-[0_14px_28px_rgba(25,28,29,0.12)]" aria-hidden="true">
      <span className="text-4xl leading-none">{emoji}</span>
      <span className="font-['Google Sans',sans-serif] text-sm font-medium leading-5 text-[#191c1d]">{label}</span>
    </span>
  );
}

function RoutesContextCard({
  title,
  children,
  preview,
  previewPosition = 'left',
}: {
  title: string;
  children: React.ReactNode;
  preview?: React.ReactNode;
  previewPosition?: 'left' | 'right';
}) {
  if (preview) {
    return (
      <article className="flex min-w-0 flex-col gap-10 py-8 text-[#191c1d] md:gap-14 md:py-12">
        <div className="text-center">
          <h2 className="font-['Google Sans',sans-serif] text-[32px] font-medium leading-[38px] tracking-[-0.5px] md:text-[40px] md:leading-[48px] md:tracking-[-1px]">
            {formatText(title)}
          </h2>
        </div>
        <div className="mx-auto grid min-w-0 gap-9 md:w-[66%] md:grid-cols-2 md:items-start md:gap-6 lg:gap-8">
          <div className={`min-w-0 ${previewPosition === 'right' ? 'md:order-2' : ''}`}>
            {preview}
          </div>
          <div className={`grid min-w-0 gap-5 md:grid-cols-1 md:items-start ${previewPosition === 'right' ? 'md:order-1' : ''}`}>
            <div className="contents [&>*]:rounded-[28px] [&>*]:bg-[#f3f4f4] [&>*]:p-5 md:[&>*]:p-6">
              {children}
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex min-w-0 flex-col gap-4 text-[#191c1d]">
      <div className="flex items-start gap-3">
        <CaseBlockIcon title={title} />
        <h2 className="font-['Google Sans',sans-serif] text-2xl font-medium leading-[30px] tracking-[0]">
          {formatText(title)}
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </article>
  );
}

function RoutesProblemSection() {
  return (
    <article className="flex min-w-0 flex-col gap-10 py-8 text-[#191c1d] md:gap-14 md:py-12">
      <div className="text-center">
        <h2 className="font-['Google Sans',sans-serif] text-[32px] font-medium leading-[38px] tracking-[-0.5px] md:text-[40px] md:leading-[48px] md:tracking-[-1px]">
          {formatText('Проблема')}
        </h2>
      </div>
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-8">
        <RoutesProblemOrbitAnimation />
        <div className="grid min-w-0 items-stretch gap-5 md:grid-cols-3 md:gap-6">
          <div className="h-full rounded-[28px] bg-[#f3f4f4] p-5 md:p-6">
            <RoutesTextPoint title="Данные не складывались в сценарий">
              <CaseStudyText>Карта, заявки, статусы и пробег жили отдельно. Руководителям приходилось вручную сопоставлять данные и искать спорные участки маршрута.</CaseStudyText>
            </RoutesTextPoint>
          </div>
          <div className="h-full rounded-[28px] bg-[#f3f4f4] p-5 md:p-6">
            <RoutesTextPoint title="Один экран закрывал разные задачи">
              <CaseStudyText>Анализ маршрута и массовая проверка поездок смешивались в одном интерфейсе. Из-за этого сценарий был перегружен и требовал обучения.</CaseStudyText>
            </RoutesTextPoint>
          </div>
          <div className="h-full rounded-[28px] bg-[#f3f4f4] p-5 md:p-6">
            <RoutesTextPoint title="Внешняя платформа">
              <CaseStudyText>Геозоны формировались во внешней платформе, от которой команда уже отказывалась.</CaseStudyText>
            </RoutesTextPoint>
          </div>
        </div>
      </div>
    </article>
  );
}

function RoutesTextPoint({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-['Google Sans',sans-serif] text-xl font-medium leading-[26px] tracking-[0] text-[#191c1d]">
        {formatText(title)}
      </h3>
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
}

function RoutesDecisionBlock({
  title,
  children,
  media,
  reverse = false,
}: {
  title: string;
  children: React.ReactNode;
  media: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <section className="grid gap-5 rounded-[28px] bg-white text-[#191c1d] md:grid-cols-2 md:items-start md:gap-8">
      <div className={`flex flex-col gap-3 md:self-start ${reverse ? 'md:order-2' : ''}`}>
        <div className="flex items-start gap-3">
          <CaseBlockIcon title={title} />
          <CaseDecisionTitle>{title}</CaseDecisionTitle>
        </div>
        <div className="flex flex-col gap-3">
          {children}
        </div>
      </div>
      <div className={reverse ? 'md:order-1' : ''}>
        {media}
      </div>
    </section>
  );
}

function RoutesStoryVisual({
  src,
  label,
}: {
  src: string;
  label: string;
}) {
  return (
    <div className="relative isolate">
      <div className="routes-story-visual-card relative overflow-hidden rounded-[32px]">
        <RoutesMedia src={src} label={label} />
      </div>
    </div>
  );
}

function RoutesStorySection({
  eyebrow,
  title,
  description,
  src,
  label,
  visualPosition = 'right',
}: {
  eyebrow: string;
  title: string;
  description: string;
  src: string;
  label: string;
  visualPosition?: 'left' | 'right';
}) {
  const visualIsLeft = visualPosition === 'left';

  return (
    <section className="relative isolate overflow-hidden py-8 text-[#191c1d] md:py-14">
      <div className="grid gap-7 md:grid-cols-3 md:items-start md:gap-8">
        <div className={`md:col-span-2 ${visualIsLeft ? 'md:order-1' : 'md:order-2'}`}>
          <RoutesStoryVisual src={src} label={label} />
        </div>
        <div className={`flex flex-col items-start gap-3 md:self-start ${visualIsLeft ? 'md:order-2' : 'md:order-1'}`}>
          <TagBadge tone="web">{eyebrow}</TagBadge>
          <div className="flex flex-col items-start gap-3 rounded-[28px] bg-[#f3f4f4] p-5 md:p-6">
            <h3 className="font-['Google Sans',sans-serif] text-xl font-medium leading-[26px] tracking-[0] text-[#191c1d]">
              {formatText(title)}
            </h3>
            <p className="font-['Google Sans Flex','Google Sans',sans-serif] text-base font-normal leading-6 tracking-[0] text-[#3c4043]">
              {formatText(description)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AdminStorySection({
  eyebrow,
  title,
  description,
  media,
  visualPosition = 'right',
}: {
  eyebrow: string;
  title: string;
  description: string;
  media: React.ReactNode;
  visualPosition?: 'left' | 'right';
}) {
  const visualIsLeft = visualPosition === 'left';

  return (
    <section className="relative isolate overflow-hidden py-8 text-[#191c1d] md:py-14">
      <div className="grid gap-7 md:grid-cols-3 md:items-start md:gap-8">
        <div className={`md:col-span-2 ${visualIsLeft ? 'md:order-1' : 'md:order-2'}`}>
          <div className="routes-story-visual-card relative overflow-hidden rounded-[32px]">
            {media}
          </div>
        </div>
        <div className={`flex flex-col items-start gap-3 md:self-start ${visualIsLeft ? 'md:order-2' : 'md:order-1'}`}>
          <TagBadge tone="web">{eyebrow}</TagBadge>
          <div className="flex flex-col items-start gap-3 rounded-[28px] bg-[#f3f4f4] p-5 md:p-6">
            <h3 className="font-['Google Sans',sans-serif] text-xl font-medium leading-[26px] tracking-[0] text-[#191c1d]">
              {formatText(title)}
            </h3>
            <p className="font-['Google Sans Flex','Google Sans',sans-serif] text-base font-normal leading-6 tracking-[0] text-[#3c4043]">
              {formatText(description)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoutesSolutionsBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="routes-solutions-blob absolute left-0 top-0 h-56 w-56 rounded-full blur-2xl md:h-72 md:w-72" />
      <div className="routes-solutions-blob routes-solutions-blob-delayed absolute left-0 top-0 h-56 w-56 rounded-full blur-2xl md:h-72 md:w-72" />
      <style>{`
        .routes-solutions-blob {
          --blob-main: rgba(147, 197, 253, 0.58);
          --blob-side: rgba(52, 168, 83, 0.28);
          background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.92) 0%, var(--blob-main) 34%, var(--blob-side) 68%, rgba(52, 168, 83, 0) 100%);
          animation: routes-solutions-blob-path 34s ease-in-out infinite;
          opacity: 0;
          transition: margin-left 1.8s ease, margin-top 1.8s ease;
          will-change: transform;
        }

        .routes-solutions-blob-delayed {
          animation-delay: 17s;
        }

        .routes-case-flow:hover .routes-solutions-blob {
          margin-left: 42px;
          margin-top: -24px;
        }

        .routes-story-visual-card::after {
          content: '';
          position: absolute;
          inset: -18%;
          pointer-events: none;
          background: radial-gradient(circle, rgba(96, 165, 250, 0.22) 0%, rgba(45, 212, 191, 0.14) 34%, rgba(96, 165, 250, 0) 66%);
          opacity: 0;
          transform: scale(0.7);
          animation: routes-story-visual-wave 17s ease-in-out infinite;
        }

        @keyframes routes-story-visual-wave {
          0%, 54%, 100% {
            opacity: 0;
            transform: scale(0.7);
          }
          62% {
            opacity: 0.34;
          }
          82% {
            opacity: 0;
            transform: scale(1.35);
          }
        }

        @keyframes routes-solutions-blob-path {
          0% {
            --blob-main: rgba(147, 197, 253, 0.58);
            --blob-side: rgba(52, 168, 83, 0.28);
            left: 8%;
            top: 2%;
            transform: translate3d(-50%, -50%, 0) scale(0.72);
            opacity: 0;
          }
          8% {
            opacity: 0.34;
          }
          18% {
            --blob-main: rgba(96, 165, 250, 0.62);
            --blob-side: rgba(45, 212, 191, 0.3);
            left: 18%;
            top: 14%;
            transform: translate3d(-50%, -50%, 0) scale(1);
          }
          42% {
            --blob-main: rgba(56, 189, 248, 0.54);
            --blob-side: rgba(134, 239, 172, 0.3);
            left: 78%;
            top: 34%;
            transform: translate3d(-50%, -50%, 0) scale(0.92);
          }
          68% {
            --blob-main: rgba(45, 212, 191, 0.48);
            --blob-side: rgba(59, 130, 246, 0.28);
            left: 18%;
            top: 58%;
            transform: translate3d(-50%, -50%, 0) scale(1.04);
          }
          88% {
            --blob-main: rgba(96, 165, 250, 0.58);
            --blob-side: rgba(52, 168, 83, 0.26);
            left: 72%;
            top: 78%;
            transform: translate3d(-50%, -50%, 0) scale(0.94);
          }
          92% {
            opacity: 0.34;
          }
          100% {
            --blob-main: rgba(147, 197, 253, 0.58);
            --blob-side: rgba(52, 168, 83, 0.28);
            left: 82%;
            top: 102%;
            transform: translate3d(-50%, -50%, 0) scale(0.78);
            opacity: 0;
          }
        }

        @media (max-width: 767px) {
          .routes-solutions-blob {
            opacity: 0.2;
            transform: scale(0.72);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .routes-solutions-blob {
            animation: none;
            left: 50%;
            top: 40%;
            transform: translate3d(-50%, -50%, 0) scale(0.88);
            opacity: 0.2;
          }

          .routes-solutions-blob-delayed {
            display: none;
          }

          .routes-story-visual-card::after {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

function CaseDecisionCarousel({ children }: { children: React.ReactNode }) {
  const slides = Children.toArray(children);
  const [activeSlide, setActiveSlide] = useState(0);

  const showPrevious = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  const showNext = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full shrink-0">
              {slide}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={showPrevious}
          className="flex size-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#191c1d] transition-colors hover:bg-black/[0.04]"
          aria-label="Предыдущее решение"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeSlide ? 'w-7 bg-[#191c1d]' : 'w-2.5 bg-black/15 hover:bg-black/30'
              }`}
              aria-label={`Показать решение ${index + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={showNext}
          className="flex size-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#191c1d] transition-colors hover:bg-black/[0.04]"
          aria-label="Следующее решение"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}

function CaseFooterActions({
  adjacentCaseLabel,
  onAdjacentCase,
  className = '',
  description = 'Можно посмотреть соседний кейс или сразу написать мне в Telegram',
}: {
  adjacentCaseLabel: string;
  onAdjacentCase: () => void;
  className?: string;
  description?: string;
}) {
  return (
    <section className={`mt-8 flex flex-col items-center justify-center gap-6 rounded-[28px] bg-[#e9f1ff] p-6 text-center text-[#191c1d] md:mt-12 md:p-8 ${className}`}>
      <div className="flex max-w-[560px] flex-col items-center gap-2">
        <h2 className="font-['Google Sans',sans-serif] text-2xl font-medium leading-[30px] tracking-[0]">
          {formatText('Продолжить или связаться')}
        </h2>
        <p className="font-['Google Sans Flex','Google Sans',sans-serif] text-base font-normal leading-6 tracking-[0] text-[#5f6368]">
          {formatText(description)}
        </p>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row md:w-auto">
        <button
          type="button"
          onClick={onAdjacentCase}
          className="flex h-14 min-w-[176px] items-center justify-center rounded-full bg-[#191c1d] px-6 text-center font-['Google Sans',sans-serif] text-base font-semibold leading-5 text-white transition-colors hover:bg-[#303437]"
        >
          {formatText(adjacentCaseLabel)}
        </button>
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
  );
}

const adminGroupSlides = [
  caseAdminGroup1,
  caseAdminGroup2,
  caseAdminGroup3,
  caseAdminGroup5,
  caseAdminGroup6,
];

const adminTreeSlides = [
  caseAdminTreeClosed,
  caseAdminTreeOpen,
];

const adminEditSlides = [
  caseAdminEdit1,
  caseAdminEdit2,
  caseAdminEdit3,
  caseAdminEdit4,
];

function CaseStudySlideshow({ slides, label }: { slides: string[]; label: string }) {
  const slideshowRef = useRef<HTMLDivElement | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [areSlidesReady, setAreSlidesReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    let isCancelled = false;

    const preloadSlides = slides.map((slide) => new Promise<void>((resolve) => {
      const image = new Image();
      image.onload = () => {
        if ('decode' in image) {
          image.decode().then(() => resolve()).catch(() => resolve());
          return;
        }
        resolve();
      };
      image.onerror = () => resolve();
      image.src = slide;
    }));

    Promise.all(preloadSlides).then(() => {
      if (!isCancelled) {
        setAreSlidesReady(true);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [slides]);

  useEffect(() => {
    const node = slideshowRef.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.75 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!areSlidesReady || isPaused || hasCompleted || (!isInView && !isFullscreen)) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveSlide((current) => {
        if (current >= slides.length - 1) {
          setHasCompleted(true);
          return 0;
        }

        return current + 1;
      });
    }, 1800);

    return () => window.clearInterval(interval);
  }, [areSlidesReady, isPaused, hasCompleted, isInView, isFullscreen, slides.length]);

  useEffect(() => {
    if (!isFullscreen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false);
        setZoom(1);
      }
      if (event.key === 'ArrowLeft') {
        showPreviousSlide();
      }
      if (event.key === 'ArrowRight') {
        showNextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const showPreviousSlide = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
    setZoom(1);
  };

  const showNextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
    setZoom(1);
  };

  const replaySlideshow = () => {
    setActiveSlide(0);
    setHasCompleted(false);
    setIsPaused(false);
    setZoom(1);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
    setZoom(1);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setZoom(1);
  };

  return (
    <>
      <div ref={slideshowRef} className="w-full">
        <div className="relative aspect-[3840/2136] w-full overflow-hidden rounded-xl shadow-[0_0_16px_0_rgba(0,0,0,0.12)]">
          <button
            type="button"
            onClick={openFullscreen}
            className="block size-full text-left"
            aria-label="Открыть просмотр во весь экран"
          >
            <img
              alt=""
              aria-hidden
              className="absolute inset-0 size-full object-cover"
              src={slides[0]}
              loading="eager"
              decoding="sync"
            />
            {slides.map((slide, index) => (
              <img
                key={slide}
                alt={`${label}, шаг ${index + 1}`}
                className={`absolute inset-0 size-full object-cover ${
                  index === activeSlide ? 'opacity-100' : 'opacity-0'
                }`}
                src={slide}
                loading="eager"
                decoding="async"
              />
            ))}
          </button>
          {hasCompleted ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                replaySlideshow();
              }}
              className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full bg-white/90 text-[#191c1d] shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
              aria-label="Повторить слайдшоу"
            >
              <RotateCcw className="size-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setIsPaused((current) => !current);
              }}
              className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full bg-white/90 text-[#191c1d] shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
              aria-label={isPaused ? 'Продолжить слайдшоу' : 'Поставить слайдшоу на паузу'}
            >
              {isPaused ? <Play className="size-5" /> : <Pause className="size-5" />}
            </button>
          )}
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-black/92 text-white">
          <div className="flex items-center justify-between gap-3 p-3 md:p-5">
            <div className="font-['Google Sans',sans-serif] text-sm font-medium md:text-base">
              {activeSlide + 1} / {slides.length}
            </div>
            <div className="flex items-center gap-2">
              {hasCompleted ? (
                <button
                  type="button"
                  onClick={replaySlideshow}
                  className="flex size-10 items-center justify-center rounded-full bg-white/12 hover:bg-white/20"
                  aria-label="Повторить слайдшоу"
                >
                  <RotateCcw className="size-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPaused((current) => !current)}
                  className="flex size-10 items-center justify-center rounded-full bg-white/12 hover:bg-white/20"
                  aria-label={isPaused ? 'Продолжить слайдшоу' : 'Поставить слайдшоу на паузу'}
                >
                  {isPaused ? <Play className="size-5" /> : <Pause className="size-5" />}
                </button>
              )}
              <button
                type="button"
                onClick={() => setZoom((current) => Math.max(1, Number((current - 0.25).toFixed(2))))}
                className="flex size-10 items-center justify-center rounded-full bg-white/12 hover:bg-white/20"
                aria-label="Уменьшить"
              >
                <ZoomOut className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom((current) => Math.min(3, Number((current + 0.25).toFixed(2))))}
                className="flex size-10 items-center justify-center rounded-full bg-white/12 hover:bg-white/20"
                aria-label="Увеличить"
              >
                <ZoomIn className="size-5" />
              </button>
              <button
                type="button"
                onClick={closeFullscreen}
                className="flex size-10 items-center justify-center rounded-full bg-white/12 hover:bg-white/20"
                aria-label="Закрыть"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1 overflow-auto px-4 pb-4 md:px-8 md:pb-8">
            <button
              type="button"
              onClick={showPreviousSlide}
              className="fixed left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 hover:bg-white/20 md:left-6 md:size-12"
              aria-label="Предыдущая картинка"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={showNextSlide}
              className="fixed right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 hover:bg-white/20 md:right-6 md:size-12"
              aria-label="Следующая картинка"
            >
              <ChevronRight className="size-6" />
            </button>
            <div className="flex min-h-full items-center justify-center">
              <img
                alt={`${label}, шаг ${activeSlide + 1}`}
                className="max-h-none max-w-none rounded-xl"
                src={slides[activeSlide]}
                style={{
                  width: `${Math.round(90 * zoom)}vw`,
                  maxWidth: zoom === 1 ? '1500px' : 'none',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AdminPanelContent({ onNextCase }: { onNextCase: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-[1392px] flex-col gap-6">
      <header className="flex w-full flex-col items-start gap-3 text-[#191c1d]">
        <h1 className="font-['Google Sans',sans-serif] text-[28px] font-medium leading-[34px] tracking-[-0.3px] md:text-[40px] md:leading-[48px] md:tracking-[-1px]">
          {formatText('Управление релизами мобильного приложения')}
        </h1>
        <p className="font-['Google Sans',sans-serif] text-base font-medium leading-[22px] md:text-xl md:leading-[26px]">
          {formatText('Сделал сложную логику проще через дерево в таблице, чтобы команда легко и быстро управляла бета-версиями')}
        </p>
        <div className="flex flex-wrap gap-2">
          <TagBadge tone="web">WEB</TagBadge>
          <TagBadge tone="b2b">B2B</TagBadge>
        </div>
      </header>

      <CaseStudyImageBlock alt="Управление релизами мобильного приложения" />

      <section className="grid items-stretch gap-5 md:grid-cols-2 md:gap-6">
        <div className="h-full rounded-[28px] bg-[#f3f4f4] p-5 md:p-6">
          <RoutesTextPoint title="Что за продукт">
            <CaseStudyText>Изначально админ-панель создавалась как альтернатива системе удалённого управления мобильными устройствами (MDM)</CaseStudyText>
            <CaseStudyText>Через неё команда могла настраивать белые списки приложений и блокировать доступ для отдельных устройств</CaseStudyText>
            <CaseStudyText>Со временем панель превратилась во внутренний рабочий инструмент команды разработки. В неё начали переносить операции, которые раньше выполнялись напрямую в базе данных, чтобы сделать их быстрее, безопаснее и доступнее без ручной работы с данными. Продукт развивается параллельно с основными бизнес-задачами и помогает команде разработки решать собственные ежедневные задачи</CaseStudyText>
          </RoutesTextPoint>
        </div>
        <div className="h-full rounded-[28px] bg-[#f3f4f4] p-5 md:p-6">
          <RoutesTextPoint title="Проблема">
            <CaseStudyText>Для пилотных проектов и бета-тестирования команде периодически нужны отдельные сборки мобильного приложения с новым или ограниченным функционалом. Пользователи не могут самостоятельно переключаться между версиями, поэтому каждую дополнительную сборку приходится создавать и распространять вручную</CaseStudyText>
            <CaseStudyText>Пока таких релизов было немного, процесс оставался управляемым. Но с ростом числа пилотов стало сложно отслеживать, какая сборка предназначена для конкретной группы пользователей, какой функционал в неё входит и какая версия сейчас актуальна. Команде не хватало единой системы для управления параллельными релизами</CaseStudyText>
          </RoutesTextPoint>
        </div>
      </section>

      <section className="relative flex w-full flex-col gap-8 overflow-hidden rounded-[36px] bg-[radial-gradient(circle_at_10%_8%,rgba(219,234,254,0.95),transparent_34%),radial-gradient(circle_at_88%_42%,rgba(220,252,231,0.82),transparent_36%),linear-gradient(135deg,#fbfdff_0%,#f5f8ff_48%,#f8fbf7_100%)] px-4 py-10 md:gap-12 md:px-8 md:py-14">
        <h2 className="text-center font-['Google Sans',sans-serif] text-[32px] font-medium leading-[38px] tracking-[-0.5px] md:text-[40px] md:leading-[48px] md:tracking-[-1px]">
          {formatText('Ключевые решения')}
        </h2>

        <AdminStorySection
          eyebrow="Решение 1"
          title="Иерархия веток и версий"
          description="Древовидная структура показывает ветки на верхнем уровне, а связанные версии раскрывает внутри. Так команда быстрее понимает, к какой ветке относится каждая сборка"
          media={<CaseStudySlideshow slides={adminTreeSlides} label="Древовидная таблица веток и версий" />}
          visualPosition="left"
        />

        <AdminStorySection
          eyebrow="Решение 2"
          title="Управление ветками и версиями в одном интерфейсе"
          description="Создание веток, добавление версий и управление ими собраны в одном рабочем пространстве, чтобы пользователь не терял контекст выбранного релиза"
          media={<CaseStudySlideshow slides={adminEditSlides} label="Управление ветками и версиями" />}
          visualPosition="right"
        />

        <AdminStorySection
          eyebrow="Решение 3"
          title="Отдельная сущность для групп пользователей"
          description="Группы пользователей вынесены в отдельную вкладку и стали переиспользуемыми. Одну группу бета-тестеров можно назначать разным веткам без повторного заполнения списка"
          media={<CaseStudySlideshow slides={adminGroupSlides} label="Группы пользователей" />}
          visualPosition="left"
        />
      </section>

      <section className="grid items-stretch gap-5 md:grid-cols-2 md:gap-6">
        <div className="h-full rounded-[28px] bg-[#f3f4f4] p-5 md:p-6">
          <RoutesTextPoint title="Мой вклад">
            <CaseStudyText>Я проектировал интерфейс админ-панели с самого начала. В этой задаче проработал ключевые пользовательские сценарии и согласовал решение с командой</CaseStudyText>
            <CaseStudyText>Вместо обычной таблицы я предложил древовидную структуру: ветки отображаются на верхнем уровне, а связанные с ними версии — внутри. Такой подход позволяет в одном интерфейсе создавать ветки, добавлять версии и управлять ими, сохраняя понятную связь между релизами</CaseStudyText>
          </RoutesTextPoint>
        </div>
        <div className="routes-pride-card relative h-full overflow-hidden rounded-[28px] p-5 md:p-6">
          <div className="relative z-10">
            <RoutesTextPoint title="Чем я горжусь">
              <CaseStudyText>В этой задаче было важно снизить риск ошибок: действия администратора могут затронуть большое количество пользователей. Несмотря на высокий уровень экспертизы аудитории, интерфейс не должен требовать лишних усилий и перегружать пользователя деталями</CaseStudyText>
              <CaseStudyText>Я горжусь тем, что удалось сохранить сложную логику управления релизами, но представить её в простой и однозначной форме. Древовидная структура помогает быстро понимать связь между ветками и версиями, а сценарии управления остаются предсказуемыми и интуитивными</CaseStudyText>
            </RoutesTextPoint>
          </div>
          <style>{`
            .routes-pride-card {
              background:
                radial-gradient(circle at 15% 20%, rgba(219, 234, 254, 0.98), transparent 36%),
                radial-gradient(circle at 82% 78%, rgba(220, 252, 231, 0.9), transparent 38%),
                linear-gradient(120deg, #f3f4f4, #eef6ff 44%, #f4fbf5);
              background-size: 140% 140%;
              animation: routes-pride-gradient 12s ease-in-out infinite alternate;
            }

            @keyframes routes-pride-gradient {
              from {
                background-position: 0% 30%;
              }
              to {
                background-position: 100% 70%;
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .routes-pride-card {
                animation: none;
              }
            }
          `}</style>
        </div>
      </section>

      <CaseFooterActions
        adjacentCaseLabel="Продолжить"
        onAdjacentCase={onNextCase}
        className="w-full md:mx-auto md:w-[56%] md:max-w-[760px]"
      />
    </div>
  );
}

function PushupCounterContent({ onAdjacentCase }: { onAdjacentCase: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-[1392px] flex-col gap-6">
      <header className="flex w-full flex-col items-start gap-3 text-[#191c1d]">
        <h1 className="font-['Google Sans',sans-serif] text-[28px] font-medium leading-[34px] tracking-[-0.3px] md:text-[40px] md:leading-[48px] md:tracking-[-1px]">
          {formatText('Счетчик отжиманий')}
        </h1>
        <p className="font-['Google Sans',sans-serif] text-base font-medium leading-[22px] md:text-xl md:leading-[26px]">
          {formatText('Android-приложение, которое с помощью камеры распознаёт движение тела, считает повторения и помогает проходить ежедневный челлендж с постепенным увеличением нагрузки.')}
        </p>
        <div className="flex flex-wrap gap-2">
          <TagBadge tone="mobile">Mobile</TagBadge>
          <TagBadge tone="ai">AI</TagBadge>
          <TagBadge tone="pet">Pet project</TagBadge>
        </div>
      </header>

      <section className="relative grid items-center gap-8 overflow-hidden rounded-[36px] bg-[#f8fbff] p-5 md:grid-cols-[0.82fr_1.18fr] md:gap-10 md:p-8 lg:p-12">
        <img
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full scale-105 object-cover opacity-95 blur-[3px]"
          src={pushupWaveBgImage}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-white/18" aria-hidden="true" />
        <div className="relative z-10 flex justify-center">
          <PushupPhoneMockup className="max-w-[280px] md:max-w-[320px]" alt="Экран активного подхода со счётчиком" src={pushupCounterImage} />
        </div>
        <div className="relative z-10 flex flex-col gap-5 rounded-[32px] bg-white/88 p-5 text-[#191c1d] shadow-[0_18px_56px_rgba(25,28,29,0.12)] backdrop-blur md:p-7 lg:p-8">
          <RoutesTextPoint title="Идея проекта">
            <CaseStudyText>Я хотел сделать простой инструмент для личного челленджа: отжиматься каждый день и постепенно увеличивать нагрузку. Главная проблема была в том, что во время подхода неудобно считать повторения и следить за прогрессом.</CaseStudyText>
          </RoutesTextPoint>
          <RoutesTextPoint title="Реализация">
            <CaseStudyText>Я собрал Android-приложение с ML-счётчиком отжиманий. Камера отслеживает положение тела, приложение определяет фазы движения, считает повторения без ручного ввода и ведёт пользователя через ежедневный челлендж.</CaseStudyText>
            <CaseStudyText>В интерфейсе я сделал крупный счётчик, голосовые подсказки и режимы для разных условий тренировки, чтобы во время подхода не нужно было смотреть в экран.</CaseStudyText>
          </RoutesTextPoint>
          <a
            href="https://github.com/spacemanfromul/PushupCounter/tree/main"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-full bg-[#191c1d] px-5 font-['Google Sans',sans-serif] text-base font-semibold leading-5 text-white transition-colors hover:bg-[#303437]"
          >
            GitHub и APK
            <ArrowRight className="size-5" />
          </a>
        </div>
      </section>

      <section className="flex flex-col gap-6 py-8 text-[#191c1d] md:gap-8 md:py-12">
        <div className="relative rounded-[36px]">
          <PushupScreensShowcase />
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[36px] bg-[#f3f4f4] px-5 py-10 text-[#191c1d] md:px-8 md:py-12 lg:px-12 lg:py-16">
        <h2 className="text-center font-['Google Sans',sans-serif] text-[32px] font-medium leading-[38px] tracking-[-0.5px] md:text-[40px] md:leading-[48px] md:tracking-[-1px]">
          {formatText('С какими ограничениями столкнулся')}
        </h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.82fr_1fr] lg:items-center lg:gap-10">
          <div className="flex flex-col gap-6 lg:-translate-y-6">
            {[
              ['Быстрый концепт оказался недостаточным', 'Первый прототип удалось собрать быстро, но стабильное считывание потребовало отдельной работы с режимами камеры и состояниями интерфейса'],
              ['Ложные срабатывания портили результат', 'Пришлось добавить паузу между подходами и отсекать случайные движения, чтобы приложение не засчитывало их как повторения'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(25,28,29,0.08)] md:p-6">
                <h3 className="font-['Google Sans',sans-serif] text-xl font-medium leading-7 text-[#191c1d]">
                  {formatText(title)}
                </h3>
                <p className="mt-4 font-['Google Sans Flex','Google Sans',sans-serif] text-base font-normal leading-6 text-[#5f6368]">
                  {formatText(description)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <PushupPhoneMockup className="max-w-[280px] lg:max-w-[340px]">
              <PortfolioVideo
                className="size-full bg-black"
                videoClassName="object-cover"
                src={caseExperimentVideo}
                label="Первый прототип счётчика отжиманий"
                preload="metadata"
              />
            </PushupPhoneMockup>
          </div>

          <div className="flex flex-col gap-6 lg:translate-y-24">
            {[
              ['UX нужно было упростить', 'Пользователь не должен смотреть в экран во время подхода, поэтому появились голосовые подсказки, крупный счётчик и понятные состояния'],
              ['Фитнес-браслет не отдаёт данные сразу', 'Данные с браслета нельзя стабильно получать в реальном времени, поэтому эту часть пришлось оставить для будущих версий'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(25,28,29,0.08)] md:p-6">
                <h3 className="font-['Google Sans',sans-serif] text-xl font-medium leading-7 text-[#191c1d]">
                  {formatText(title)}
                </h3>
                <p className="mt-4 font-['Google Sans Flex','Google Sans',sans-serif] text-base font-normal leading-6 text-[#5f6368]">
                  {formatText(description)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 text-[#191c1d] md:grid-cols-2">
        <div className="rounded-[36px] bg-[#f3f4f4] p-6 md:p-10 lg:p-14">
          <h2 className="text-center font-['Google Sans',sans-serif] text-[32px] font-medium leading-[38px] tracking-[-0.5px] md:text-[40px] md:leading-[48px] md:tracking-[-1px]">
            {formatText('Что уже работает')}
          </h2>
          <div className="mt-8 rounded-[28px] bg-white p-5 md:p-7 lg:p-8">
            {[
              ['Автоматический счёт', 'Приложение считает повторения через камеру без ручного ввода'],
              ['Настройки экрана', 'Можно включить подсветку и выбрать размер счётчика'],
              ['Озвучка повторений', 'Приложение проговаривает счёт, чтобы не смотреть на экран'],
              ['Пауза между подходами', 'Случайные движения не засчитываются как повторения'],
            ].map(([title, description], index) => (
              <div key={title} className={index === 0 ? '' : 'mt-5'}>
                <h3 className="font-['Google Sans',sans-serif] text-xl font-medium leading-7 text-[#191c1d] md:text-[22px] md:leading-7">
                  {formatText(title)}
                </h3>
                <p className="mt-2 font-['Google Sans Flex','Google Sans',sans-serif] text-base font-normal leading-6 text-[#5f6368] md:text-[18px] md:leading-7">
                  {formatText(description)}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[36px] bg-[#fff7ed] p-6 md:p-10 lg:p-14">
          <h2 className="text-center font-['Google Sans',sans-serif] text-[32px] font-medium leading-[38px] tracking-[-0.5px] md:text-[40px] md:leading-[48px] md:tracking-[-1px]">
            {formatText('Что предстоит сделать')}
          </h2>
          <div className="mt-8 rounded-[28px] bg-white p-5 md:p-7 lg:p-8">
            {[
              ['Боковой режим камеры', 'Добавить точную оценку амплитуды движения и положения корпуса сбоку'],
              ['ИИ-тренер и техника', 'Научить приложение замечать ошибки и давать короткие подсказки во время тренировки'],
              ['Экспорт в соцсети', 'Сохранять видео подхода и делиться прогрессом'],
            ].map(([title, description], index) => (
              <div key={title} className={index === 0 ? '' : 'mt-5'}>
                <h3 className="font-['Google Sans',sans-serif] text-xl font-medium leading-7 text-[#191c1d] md:text-[22px] md:leading-7">
                  {formatText(title)}
                </h3>
                <p className="mt-2 font-['Google Sans Flex','Google Sans',sans-serif] text-base font-normal leading-6 text-[#5f6368] md:text-[18px] md:leading-7">
                  {formatText(description)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="text-[#191c1d]">
        <div className="pushup-pride-card relative mx-auto w-full overflow-hidden rounded-[36px] px-5 py-10 md:w-[74%] md:px-12 md:py-14 lg:px-16 lg:py-16">
          <div className="relative z-10 mx-auto flex max-w-[860px] flex-col gap-7">
            <h2 className="text-center font-['Google Sans',sans-serif] text-[32px] font-medium leading-[38px] tracking-[-0.5px] md:text-[40px] md:leading-[48px] md:tracking-[-1px]">
              {formatText('Чем я горжусь')}
            </h2>
            <CaseStudyText>Я начал этот pet project без опыта в мобильной разработке и довёл идею до рабочего прототипа: приложение считает отжимания, помогает проходить подход и показывает, как из личной задачи можно собрать работающий продукт.</CaseStudyText>
            <CaseStudyText>Для меня это был способ проверить, как быстро можно пройти путь от идеи до MVP: разобраться в ML-счётчике, ограничениях камеры, состояниях интерфейса и сценарии тренировки.</CaseStudyText>
          </div>
          <style>{`
            .pushup-pride-card {
              background:
                radial-gradient(circle at 12% 12%, rgba(219, 234, 254, 0.98), transparent 34%),
                radial-gradient(circle at 86% 18%, rgba(220, 252, 231, 0.95), transparent 38%),
                linear-gradient(120deg, #f5f9ff, #eef6ff 44%, #f1fff6);
              background-size: 140% 140%;
              animation: pushup-pride-gradient 12s ease-in-out infinite alternate;
            }

            @keyframes pushup-pride-gradient {
              from {
                background-position: 0% 30%;
              }
              to {
                background-position: 100% 70%;
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .pushup-pride-card {
                animation: none;
              }
            }
          `}</style>
        </div>
      </section>

      <CaseFooterActions
        adjacentCaseLabel="Следующий кейс"
        onAdjacentCase={onAdjacentCase}
        description="Можно посмотреть следующий кейс или написать мне в Telegram"
        className="w-full md:mx-auto md:w-[56%] md:max-w-[760px]"
      />
    </div>
  );
}

function RoutesContent({
  onAdjacentCase,
  onOpenPrototype,
}: {
  onAdjacentCase: () => void;
  onOpenPrototype: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1392px] flex-col gap-6">
      <div className="flex flex-col gap-3 text-[#191c1d]">
        <h1 className="font-['Google Sans',sans-serif] text-[28px] font-medium leading-[34px] tracking-[-0.3px] md:text-[40px] md:leading-[48px] md:tracking-[-1px]">
          {formatText('Система контроля транспортных расходов')}
        </h1>
        <p className="font-['Google Sans',sans-serif] text-base font-medium leading-[22px] md:text-xl md:leading-[26px]">
          {formatText('Собрал карту перемещений, чтобы быстрее находить поездки и контролировать спорные расходы')}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <TagBadge tone="web">WEB</TagBadge>
          <TagBadge tone="b2b">B2B</TagBadge>
          <TagBadge tone="data">Data-heavy</TagBadge>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px]">
        <RoutesMedia
          src={caseRoutesCoverVideo}
          label="Админ-панель для управления маршрутами"
        />
      </div>

      <div className="flex w-full flex-col gap-5 rounded-[28px] bg-[#e9f1ff] p-5 text-[#191c1d] md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex max-w-[760px] flex-col gap-1">
          <h2 className="font-['Google Sans',sans-serif] text-[24px] font-medium leading-[30px] tracking-[0]">
            {formatText('Посмотреть маршрут в интерактивном прототипе')}
          </h2>
          <p className="font-['Google Sans Flex','Google Sans',sans-serif] text-base font-normal leading-6 tracking-[0] text-[#5f6368]">
            {formatText('Можно выбрать поездку, посмотреть маршрут на карте, открыть таблицу заявок и проверить спорные участки так, как это делает руководитель или диспетчер')}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenPrototype}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#191c1d] px-5 font-['Google Sans',sans-serif] text-base font-semibold leading-5 text-white transition-colors hover:bg-[#303437]"
        >
          К прототипу
          <ArrowRight className="size-5" />
        </button>
      </div>

      <section className="routes-case-flow relative isolate w-full overflow-hidden text-[#191c1d]">
        <RoutesSolutionsBackground />
        <div className="relative z-10 flex flex-col gap-8 md:gap-12">
          <RoutesContextCard
            title="Что за продукт"
            preview={<RoutesContextVisualCard variant="product" />}
            previewPosition="left"
          >
            <RoutesTextPoint title="Разъездные сотрудники">
              <CaseStudyText>В компании есть разъездные сотрудники, которые обслуживают заявки на выезде и используют личный транспорт. Компания компенсирует им расходы по пробегу за месяц</CaseStudyText>
            </RoutesTextPoint>
            <RoutesTextPoint title="Контроль поездок">
              <CaseStudyText>Для этого используется система, которая автоматически фиксирует поездки и считает пробег. Руководители и диспетчеры проверяют данные, подтверждают компенсации и разбирают спорные ситуации, когда нужно детальнее посмотреть маршрут сотрудника</CaseStudyText>
            </RoutesTextPoint>
          </RoutesContextCard>
          <RoutesProblemSection />

          <div className="relative flex w-full flex-col gap-8 overflow-hidden rounded-[36px] bg-[radial-gradient(circle_at_10%_8%,rgba(219,234,254,0.95),transparent_34%),radial-gradient(circle_at_88%_42%,rgba(220,252,231,0.82),transparent_36%),linear-gradient(135deg,#fbfdff_0%,#f5f8ff_48%,#f8fbf7_100%)] px-4 py-10 md:gap-12 md:px-8 md:py-14">
            <h2 className="text-center font-['Google Sans',sans-serif] text-[32px] font-medium leading-[38px] tracking-[-0.5px] md:text-[40px] md:leading-[48px] md:tracking-[-1px]">
              {formatText('Ключевые решения')}
            </h2>

            <RoutesStorySection
              eyebrow="Решение 1"
              title="Карта и таблица в одном сценарии"
              description="Карта помогает быстро увидеть маршрут за смену, а таблица — проверить заявки, статусы и спорные участки без потери контекста"
              src={caseRoutesPrototypeDemoVideo}
              label="Карта и таблица в одном сценарии"
              visualPosition="left"
            />

            <RoutesStorySection
              eyebrow="Решение 2"
              title="Два режима под разные задачи"
              description="Для разбора конкретного маршрута удобнее карта, а для поиска, фильтрации и массовой проверки — реестр"
              src={caseRoutesPrototypeModesVideo}
              label="Переключение режимов карта и реестр"
              visualPosition="right"
            />

            <RoutesStorySection
              eyebrow="Решение 3"
              title="Геозоны как рабочий инструмент"
              description="Пользователь может включать нужные зоны, находить их через дерево и создавать новые прямо на карте"
              src={caseRoutesPrototypeGeozonesVideo}
              label="Геозоны как рабочий инструмент"
              visualPosition="left"
            />
          </div>

          <section className="flex min-w-0 flex-col gap-6 py-8 text-[#191c1d] md:gap-8 md:py-12">
            <h2 className="text-center font-['Google Sans',sans-serif] text-[32px] font-medium leading-[38px] tracking-[-0.5px] md:text-[40px] md:leading-[48px] md:tracking-[-1px]">
              {formatText('Мой вклад')}
            </h2>
            <div className="grid items-stretch gap-5 md:grid-cols-3 md:gap-6">
              <div className="h-full rounded-[28px] bg-[#f3f4f4] p-5 md:p-6">
                <RoutesTextPoint title="Собрал продуктовую логику">
                  <CaseStudyText>Я подключился к проекту на этапе, когда старую систему решили полностью заменить. Нужно было не просто перерисовать интерфейс, а заново собрать логику продукта: как руководитель проверяет пробег, где видит маршрут, как сопоставляет поездки с заявками и принимает решение по спорным участкам</CaseStudyText>
                </RoutesTextPoint>
              </div>
              <div className="h-full rounded-[28px] bg-[#f3f4f4] p-5 md:p-6">
                <RoutesTextPoint title="Разложил данные и сценарии">
                  <CaseStudyText>Чтобы не утонуть в объеме данных, я начал с информационной архитектуры: раскладывал каждый раздел на сценарии, сущности и данные, а потом вместе с командой мы отсекали лишнее. Так у всех появилось общее понимание, какой продукт мы строим и что действительно нужно пользователю</CaseStudyText>
                </RoutesTextPoint>
              </div>
              <div className="h-full rounded-[28px] bg-[#f3f4f4] p-5 md:p-6">
                <RoutesTextPoint title="Связал карту и таблицу">
                  <CaseStudyText>Главным решением стала связка карты и таблицы. Карта дает быстрый обзор смены и перемещений сотрудника, а таблица помогает спокойно разобрать детали: заявки, статусы и спорные участки маршрута. Параллельно я изучал возможности API Яндекс Карт, чтобы предлагать не абстрактные идеи, а решения, которые команда сможет реализовать</CaseStudyText>
                </RoutesTextPoint>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="flex min-w-0 flex-col gap-6 py-8 text-[#191c1d] md:gap-8 md:py-12">
        <h2 className="text-center font-['Google Sans',sans-serif] text-[32px] font-medium leading-[38px] tracking-[-0.5px] md:text-[40px] md:leading-[48px] md:tracking-[-1px]">
          {formatText('Чем я горжусь')}
        </h2>
        <div className="routes-pride-card relative w-full overflow-hidden rounded-[28px] p-5 md:mx-auto md:w-1/3 md:p-6">
          <div className="relative z-10 max-w-[820px]">
            <CaseStudyText>Горжусь тем, что этот проект стал для меня точкой роста: я не просто рисовал интерфейс, а проектировал систему с нуля — с логикой, сценариями, ограничениями и реальными пользователями. Продукт работает в той структуре, которую мы заложили, и продолжает развиваться, а для меня это стало первым большим подтверждением ценности продуктового подхода</CaseStudyText>
          </div>
          <style>{`
            .routes-pride-card {
              background:
                radial-gradient(circle at 15% 20%, rgba(219, 234, 254, 0.98), transparent 36%),
                radial-gradient(circle at 82% 78%, rgba(220, 252, 231, 0.9), transparent 38%),
                linear-gradient(120deg, #f3f4f4, #eef6ff 44%, #f4fbf5);
              background-size: 140% 140%;
              animation: routes-pride-gradient 12s ease-in-out infinite alternate;
            }

            @keyframes routes-pride-gradient {
              from {
                background-position: 0% 30%;
              }
              to {
                background-position: 100% 70%;
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .routes-pride-card {
                animation: none;
              }
            }
          `}</style>
        </div>
      </section>

      <CaseFooterActions
        adjacentCaseLabel="Продолжить"
        onAdjacentCase={onAdjacentCase}
        className="w-full md:mx-auto md:w-[56%] md:max-w-[760px]"
      />
    </div>
  );
}

