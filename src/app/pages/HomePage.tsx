import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AboutMe from '../components/AboutMe';
import Modal from '../components/Modal';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import caseAdminImage from "../../assets/cases/case-admin.png";
import caseAiMobileImage from "../../assets/cases/case-ai-mobile.jpg";
import caseAiWebImage from "../../assets/cases/case-ai-web.jpg";
import caseRoutesImage from "../../assets/cases/case-routes.jpg";
import caseExperimentVideo from "../../assets/cases/case-experiment.mp4";
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

export default function HomePage() {
  const [activeModal, setActiveModal] = useState<'admin-panel' | 'routes' | null>(null);

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
    <div className="bg-white min-h-screen w-full pt-4 md:pt-8">
      <Header />
      <Hero />
      <SectionIntro
        title="Кейсы"
        description="Сложные B2B-интерфейсы, AI-сценарии, мобильные продукты и эксперименты"
      />
      <CasesBlock onProjectClick={setActiveModal} />
      <SectionIntro
        title="Обо мне"
        description="Чем я живу вне работы и что помогает возвращаться к продуктовым задачам со свежей головой"
      />
      <AboutMe />
      <ThankYou />

      <Modal isOpen={activeModal === 'admin-panel'} onClose={() => setActiveModal(null)}>
        <AdminPanelContent onNextCase={() => setActiveModal('routes')} />
      </Modal>

      <Modal isOpen={activeModal === 'routes'} onClose={() => setActiveModal(null)}>
        <RoutesContent onOpenPrototype={() => window.open('/#routes-prototype', '_blank', 'noopener,noreferrer')} />
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
    .replace(/([A-Za-zА-Яа-яЁё0-9])[-–]([A-Za-zА-Яа-яЁё0-9])/g, '$1\u2011$2');
}

function formatParagraph(text: string) {
  const formatted = formatText(text);
  return /[.!?…]$/.test(formatted.trim()) ? formatted : `${formatted}.`;
}

function CaseTag({ label, tone }: { label: string; tone: 'web' | 'b2b' | 'data' | 'ai' | 'mobile' }) {
  const tones = {
    web: 'bg-[#fafbec] text-[#52520f]',
    b2b: 'bg-[#c4eed0] text-[#0f5223]',
    data: 'bg-[#f9eaea] text-[#52170f]',
    ai: 'bg-[#e8f0ff] text-[#0b57d0]',
    mobile: 'bg-[#eee8f9] text-[#490f52]',
  };

  return (
    <span className={`${tones[tone]} rounded-[10px] px-3 py-2 font-['Google Sans',sans-serif] text-sm font-medium leading-5 tracking-[0]`}>
      {label}
    </span>
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
  tags: Array<{ label: string; tone: 'web' | 'b2b' | 'data' | 'ai' | 'mobile' }>;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      onClick={onClick}
      className={`group flex w-full min-w-0 flex-col items-start gap-3 rounded-[28px] bg-[#f5f5f5] p-5 text-left md:p-8 ${onClick ? 'cursor-pointer' : ''} ${className}`}
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
          <CaseTag key={tag.label} {...tag} />
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
    <div className="h-[235px] w-[104px] overflow-hidden rounded-xl shadow-[0_0_16px_0_rgba(0,0,0,0.18)] md:h-[341px] md:w-[151px]">
      <video
        className="size-full object-cover"
        src={caseExperimentVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    </div>
  );
}

function CasesBlock({ onProjectClick }: { onProjectClick: (project: 'admin-panel' | 'routes') => void }) {
  return (
    <div className="mx-auto flex w-full max-w-[1392px] shrink-0 flex-col gap-6 px-4 py-4 md:px-8 md:py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
          onClick={() => onProjectClick('routes')}
          title="Система контроля транспортных расходов"
          description="Собрал карту перемещений, чтобы быстрее находить поездки и контролировать спорные расходы"
          tags={[
            { label: 'WEB', tone: 'web' },
            { label: 'B2B', tone: 'b2b' },
            { label: 'Data-heavy', tone: 'data' },
          ]}
        >
          <CaseImage src={caseRoutesImage} alt="Система контроля транспортных расходов" />
        </CaseCard>
      </div>
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
    </div>
  );
}

function ThankYou() {
  return (
    <div className="content-stretch flex flex-col items-center pb-4 md:pb-[0.19px] pt-6 md:pt-[31px] relative shrink-0 w-full max-w-[1392px] mx-auto px-4 md:px-8">
      <div className="flex flex-col font-['Google Sans',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999] text-[13px] text-center whitespace-nowrap">
        <p className="leading-[18.2px]">Спасибо за просмотр)</p>
      </div>
    </div>
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
    <section className="flex w-full flex-col gap-4 py-6 text-[#191c1d]">
      <h2 className="font-['Google Sans',sans-serif] text-[32px] font-medium leading-[38px] tracking-[-0.5px] md:text-[40px] md:leading-[48px] md:tracking-[-1px]">
        {formatText(title)}
      </h2>
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </section>
  );
}

function CaseStudyImageBlock({ alt, src = caseAdminImage }: { alt: string; src?: string }) {
  return (
    <div className="w-full rounded-[28px] bg-[#fafbec] p-4 md:p-12 lg:p-16">
      <div className="aspect-[3840/2136] w-full overflow-hidden rounded-xl shadow-[0_0_16px_0_rgba(0,0,0,0.12)]">
        <img
          alt={alt}
          className="size-full object-cover"
          src={src}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

function CaseFooterActions({ onNextCase }: { onNextCase?: () => void }) {
  return (
    <section className="mt-8 flex flex-col gap-6 rounded-[28px] bg-[#e9f1ff] p-6 text-[#191c1d] md:mt-12 md:flex-row md:items-center md:justify-between md:p-8">
      <div className="flex max-w-[560px] flex-col gap-2">
        <h2 className="font-['Google Sans',sans-serif] text-[28px] font-medium leading-[34px] tracking-[-0.5px] md:text-[40px] md:leading-[48px] md:tracking-[-1px]">
            {formatText(onNextCase ? 'Продолжить или посмотреть' : 'Обсудить похожую задачу')}
        </h2>
        <p className="font-['Google Sans',sans-serif] text-base font-medium leading-[22px] text-[#5f6368] md:text-xl md:leading-[26px]">
          {formatText(onNextCase ? 'Можно продолжить смотреть портфолио или сразу написать мне в Telegram' : 'Если нужно разобрать сложный B2B-сценарий, я открыт к разговору')}
        </p>
      </div>
      <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto md:items-center md:justify-end">
        {onNextCase && (
          <button
            type="button"
            onClick={onNextCase}
            className="flex h-14 min-w-[132px] items-center justify-center rounded-full bg-[#191c1d] px-6 text-center font-['Google Sans',sans-serif] text-base font-semibold leading-5 text-white transition-colors hover:bg-[#303437]"
          >
            Продолжить
          </button>
        )}
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
      <div ref={slideshowRef} className="w-full rounded-[28px] bg-[#fafbec] p-4 md:p-12 lg:p-16">
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
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-6">
      <header className="flex w-full flex-col items-start gap-3 text-[#191c1d]">
        <h1 className="font-['Google Sans',sans-serif] text-[28px] font-medium leading-[34px] tracking-[-0.3px] md:text-[40px] md:leading-[48px] md:tracking-[-1px]">
          {formatText('Управление релизами мобильного приложения')}
        </h1>
        <p className="font-['Google Sans',sans-serif] text-base font-medium leading-[22px] md:text-xl md:leading-[26px]">
          {formatText('Сделал сложную логику проще через дерево в таблице, чтобы команда легко и быстро управляла бета-версиями')}
        </p>
        <div className="flex flex-wrap gap-2">
          <CaseTag label="WEB" tone="web" />
          <CaseTag label="B2B" tone="b2b" />
        </div>
      </header>

      <CaseStudyImageBlock alt="Управление релизами мобильного приложения" />

      <CaseStudySection title="Что за продукт">
        <CaseStudyText>Изначально админ-панель создавалась как альтернатива системе удалённого управления мобильными устройствами (MDM)</CaseStudyText>
        <CaseStudyText>Через неё команда могла настраивать белые списки приложений и блокировать доступ для отдельных устройств</CaseStudyText>
        <CaseStudyText>Со временем панель превратилась во внутренний рабочий инструмент команды разработки. В неё начали переносить операции, которые раньше выполнялись напрямую в базе данных, чтобы сделать их быстрее, безопаснее и доступнее без ручной работы с данными. Продукт развивается параллельно с основными бизнес-задачами и помогает команде разработки решать собственные ежедневные задачи</CaseStudyText>
      </CaseStudySection>

      <CaseStudySection title="Проблема">
        <CaseStudyText>Для пилотных проектов и бета-тестирования команде периодически нужны отдельные сборки мобильного приложения с новым или ограниченным функционалом. Пользователи не могут самостоятельно переключаться между версиями, поэтому каждую дополнительную сборку приходится создавать и распространять вручную</CaseStudyText>
        <CaseStudyText>Пока таких релизов было немного, процесс оставался управляемым. Но с ростом числа пилотов стало сложно отслеживать, какая сборка предназначена для конкретной группы пользователей, какой функционал в неё входит и какая версия сейчас актуальна. Команде не хватало единой системы для управления параллельными релизами</CaseStudyText>
      </CaseStudySection>

      <CaseStudySection title="Мой вклад">
        <CaseStudyText>Я проектировал интерфейс админ-панели с самого начала. В этой задаче проработал ключевые пользовательские сценарии и согласовал решение с командой</CaseStudyText>
        <CaseStudyText>Вместо обычной таблицы я предложил древовидную структуру: ветки отображаются на верхнем уровне, а связанные с ними версии — внутри. Такой подход позволяет в одном интерфейсе создавать ветки, добавлять версии и управлять ими, сохраняя понятную связь между релизами</CaseStudyText>
      </CaseStudySection>

      <CaseStudySection title="Ключевые решения">
        <CaseDecisionTitle>1. Иерархия веток и версий</CaseDecisionTitle>
        <CaseStudySlideshow slides={adminTreeSlides} label="Древовидная таблица веток и версий" />
        <CaseStudyText>Ветки и версии связаны между собой: одна ветка может содержать несколько последовательных сборок. В обычной таблице эта связь была бы неочевидна, особенно при большом количестве параллельных релизов</CaseStudyText>
        <CaseStudyText>Я предложил древовидную структуру, в которой ветки находятся на верхнем уровне, а версии раскрываются внутри них. Так пользователь сразу видит иерархию релизов и быстрее понимает, к какой ветке относится каждая сборка</CaseStudyText>

        <CaseDecisionTitle>2. Управление ветками и версиями в одном интерфейсе</CaseDecisionTitle>
        <CaseStudySlideshow slides={adminEditSlides} label="Управление ветками и версиями" />
        <CaseStudyText>Раньше работа с отдельными сборками требовала ручных действий и не давала команде единой картины происходящего</CaseStudyText>
        <CaseStudyText>Я объединил создание веток, добавление версий и управление ими в одном рабочем пространстве. Пользователю не нужно переключаться между разными разделами или терять контекст выбранного релиза</CaseStudyText>

        <CaseDecisionTitle>3. Отдельная сущность для групп пользователей</CaseDecisionTitle>
        <CaseStudySlideshow slides={adminGroupSlides} label="Группы пользователей" />
        <CaseStudyText>Изначально список пользователей предполагалось хранить внутри каждой ветки. Это означало, что при создании нового пилота или бета-релиза команде пришлось бы заново собирать одну и ту же группу тестировщиков</CaseStudyText>
        <CaseStudyText>Я предложил вынести группы пользователей в отдельную вкладку и сделать их переиспользуемой сущностью. Системный аналитик поддержал идею, и в результате одну группу бета-тестеров можно назначать разным веткам без повторного заполнения списка</CaseStudyText>
        <CaseStudyText>Такое решение сокращает ручную работу, снижает риск ошибок и упрощает управление параллельными релизами</CaseStudyText>
      </CaseStudySection>

      <CaseStudySection title="Чем я горжусь">
        <CaseStudyText>В этой задаче было важно снизить риск ошибок: действия администратора могут затронуть большое количество пользователей. Несмотря на высокий уровень экспертизы аудитории, интерфейс не должен требовать лишних усилий и перегружать пользователя деталями</CaseStudyText>
        <CaseStudyText>Я горжусь тем, что удалось сохранить сложную логику управления релизами, но представить её в простой и однозначной форме. Древовидная структура помогает быстро понимать связь между ветками и версиями, а сценарии управления остаются предсказуемыми и интуитивными</CaseStudyText>
      </CaseStudySection>

      <CaseFooterActions onNextCase={onNextCase} />
    </div>
  );
}

function RoutesContent({ onOpenPrototype }: { onOpenPrototype: () => void }) {
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
          <CaseTag label="WEB" tone="web" />
          <CaseTag label="B2B" tone="b2b" />
          <CaseTag label="Data-heavy" tone="data" />
        </div>
      </div>

      <CaseStudyImageBlock alt="Админ-панель для управления маршрутами" src={caseRoutesImage} />

      <div className="flex flex-col gap-3 rounded-[28px] bg-[#e9f1ff] p-5 text-[#191c1d] md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex max-w-[680px] flex-col gap-1">
          <h2 className="font-['Google Sans',sans-serif] text-[24px] font-medium leading-[30px] tracking-[0]">
            {formatText('Интерактивный прототип маршрута')}
          </h2>
          <p className="font-['Google Sans Flex','Google Sans',sans-serif] text-base font-normal leading-6 tracking-[0] text-[#5f6368]">
            {formatParagraph('Можно посмотреть, как машина движется по маршруту и как карта помогает считывать поездку в динамике')}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenPrototype}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#191c1d] px-5 font-['Google Sans',sans-serif] text-base font-semibold leading-5 text-white transition-colors hover:bg-[#303437]"
        >
          Открыть прототип
          <ArrowRight className="size-5" />
        </button>
      </div>

      <CaseStudySection title="Что за продукт">
        <CaseStudyText>В компании есть разъездные сотрудники, которые обслуживают заявки на выезде и используют личный транспорт. Компания компенсирует им расходы по пробегу за месяц</CaseStudyText>
        <CaseStudyText>Для этого используется система, которая автоматически фиксирует поездки и считает пробег. Руководители и диспетчеры проверяют данные, подтверждают компенсации и разбирают спорные ситуации, когда нужно детальнее посмотреть маршрут сотрудника</CaseStudyText>
      </CaseStudySection>

      <CaseStudySection title="Проблема">
        <CaseStudyText>Старая legacy-система не давала наглядно анализировать маршруты сотрудников и зависела от Google Maps API, который не подходил компании по требованиям лицензирования и надежности. Нужно было с нуля спроектировать новый интерфейс на Яндекс Картах, где карта, таблицы и данные о заявках помогают быстро проверять пробеги и разбирать спорные ситуации</CaseStudyText>
      </CaseStudySection>

      <CaseStudySection title="Мой вклад">
        <CaseStudyText>Я подключился к проекту на этапе, когда старую систему решили полностью заменить. Нужно было не просто перерисовать интерфейс, а заново собрать логику продукта: как руководитель проверяет пробег, где видит маршрут, как сопоставляет поездки с заявками и принимает решение по спорным участкам</CaseStudyText>
        <CaseStudyText>Чтобы не утонуть в объеме данных, я начал с информационной архитектуры: раскладывал каждый раздел на сценарии, сущности и данные, а потом вместе с командой мы отсекали лишнее. Так у всех появилось общее понимание, какой продукт мы строим и что действительно нужно пользователю</CaseStudyText>
        <CaseStudyText>Главным решением стала связка карты и таблицы. Карта дает быстрый обзор смены и перемещений сотрудника, а таблица помогает спокойно разобрать детали: заявки, статусы и спорные участки маршрута. Параллельно я изучал возможности API Яндекс Карт, чтобы предлагать не абстрактные идеи, а решения, которые команда сможет реализовать</CaseStudyText>
      </CaseStudySection>

      <CaseStudySection title="Ключевые решения">
        <CaseDecisionTitle>1. Связал карту и таблицу в одном рабочем сценарии</CaseDecisionTitle>
        <CaseStudyImageBlock alt="Карта и таблица маршрутов в одном сценарии" src={caseRoutesImage} />
        <CaseStudyText>Проверка маршрута требует одновременно видеть общую картину и детали. Поэтому экран разделён на две зоны: карта показывает перемещения сотрудника за смену, а таблица помогает разобрать заявки, статусы, время и спорные участки</CaseStudyText>
        <CaseStudyText>Так руководитель не переключается между разными источниками данных и быстрее понимает, где именно возникла проблема</CaseStudyText>

        <CaseDecisionTitle>2. Разделил сценарии через режимы «Карта» и «Реестр»</CaseDecisionTitle>
        <CaseStudyImageBlock alt="Режимы карты и реестра маршрутов" src={caseRoutesImage} />
        <CaseStudyText>Не все задачи удобно решать на карте. Для анализа конкретного маршрута нужен визуальный режим, а для массовой проверки, поиска и фильтрации — табличный</CaseStudyText>
        <CaseStudyText>Переключатель «Карта / Реестр» разделяет эти сценарии и не перегружает один экран лишними функциями. Пользователь выбирает режим под задачу, а не адаптируется к универсальному интерфейсу</CaseStudyText>

        <CaseDecisionTitle>3. Спроектировал работу с геозонами</CaseDecisionTitle>
        <CaseStudyImageBlock alt="Работа с геозонами на карте" src={caseRoutesImage} />
        <CaseStudyText>Геозоны нужны не только как технические данные, но и как рабочий инструмент для анализа маршрутов. Поэтому я вынес их в понятный сценарий: существующие зоны можно находить через дерево в фильтрах, а новые — создавать прямо на карте через рисование</CaseStudyText>
        <CaseStudyText>Это помогает быстрее работать с объектами обслуживания и держать структуру зон понятной даже при большом объёме данных</CaseStudyText>
      </CaseStudySection>

      <CaseStudySection title="Чем я горжусь">
        <CaseStudyText>Горжусь тем, что этот проект стал для меня точкой роста: я не просто рисовал интерфейс, а проектировал систему с нуля — с логикой, сценариями, ограничениями и реальными пользователями. Продукт работает в той структуре, которую мы заложили, и продолжает развиваться, а для меня это стало первым большим подтверждением ценности продуктового подхода</CaseStudyText>
      </CaseStudySection>

      <CaseFooterActions />
    </div>
  );
}




