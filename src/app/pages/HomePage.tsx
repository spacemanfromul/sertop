import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AboutMe from '../components/AboutMe';
import Modal from '../components/Modal';
import { ChevronLeft, ChevronRight, Pause, Play, X, ZoomIn, ZoomOut } from 'lucide-react';
import imgImage3 from "figma:asset/88a6e07d56a27f755fa8f667d48d08fa90a211df.png";
import imgImage4 from "figma:asset/1491e78767295cee8997920ba3fd00bdc5d5ecd3.png";
import imgImage10 from "figma:asset/458f81f65860ef4f62aaa75b22daf2922cc76789.png";
import imgImage12 from "figma:asset/866a53f627e8f3bc6a6770edc44c46647d97cd95.png";
import imgImage14 from "figma:asset/458f81f65860ef4f62aaa75b22daf2922cc76789.png";
import imgUntitled1 from "figma:asset/135baa3a3201b07dd545e70bc419fb50a67cd083.jpg";
import imgImage5 from "figma:asset/e8c846511aa03374308d4d0bdc22c5f832e00a3a.jpg";
import imgImage6 from "figma:asset/9155f2a5dd6b67a82f2e3b2e464f250a0d69327a.jpg";
import imgImage7 from "figma:asset/a8f4a43bc65a3564df1b44fdf7f8eaf424c9c6de.jpg";
import imgImage8 from "figma:asset/6f2a29bf14bfeaf82e47e74b71c327ae0a63e3dd.png";
import caseAdminImage from "../../assets/cases/case-admin.png";
import caseAiMobileImage from "../../assets/cases/case-ai-mobile.jpg";
import caseAiWebImage from "../../assets/cases/case-ai-web.jpg";
import caseRoutesImage from "../../assets/cases/case-routes.jpg";
import caseExperimentVideo from "../../assets/cases/case-experiment.mp4";
import caseAdminGroup1 from "../../assets/cases/case-admin-group-1.jpg";
import caseAdminGroup2 from "../../assets/cases/case-admin-group-2.jpg";
import caseAdminGroup3 from "../../assets/cases/case-admin-group-3.jpg";
import caseAdminGroup4 from "../../assets/cases/case-admin-group-4.jpg";
import caseAdminGroup5 from "../../assets/cases/case-admin-group-5.jpg";
import caseAdminGroup6 from "../../assets/cases/case-admin-group-6.jpg";

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
        <AdminPanelContent />
      </Modal>

      <Modal isOpen={activeModal === 'routes'} onClose={() => setActiveModal(null)}>
        <RoutesContent />
      </Modal>
    </div>
  );
}

function ProjectCard({
  onClick,
  bgColor,
  image,
  title,
  tags
}: {
  onClick: () => void;
  bgColor: string;
  image: string;
  title: string;
  tags: string;
}) {
  return (
    <div className="flex flex-col w-full min-w-0">
      <button onClick={onClick} className="block relative overflow-clip rounded-lg md:rounded-[28px] aspect-square group cursor-pointer w-full">
        <div className={`${bgColor} absolute inset-0 transition-opacity group-hover:opacity-90`} />
        <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
          <img
            alt={title}
            className="max-w-[88%] max-h-[88%] h-auto w-auto object-contain rounded-lg md:rounded-[20px] transition-transform duration-300 group-hover:scale-[1.03]"
            src={image}
            loading="lazy"
            decoding="async"
          />
        </div>
      </button>
      <div className="flex flex-col py-6 md:py-[24px]">
        <div className="flex flex-col font-['Google Sans',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#191919] text-[0px] w-full">
          <p className="text-base md:text-[19.2px]">
            <span className="leading-[26.88px] text-[#191919]">{title} </span>
            <span className="leading-[26.88px] text-[#999]">✦ {tags}</span>
          </p>
        </div>
      </div>
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
          {keepShortWords(title)}
        </h2>
        <p className="max-w-[560px] font-['Google Sans',sans-serif] text-base font-medium leading-[22px] text-[#747775] md:text-xl md:leading-[28px]">
          {keepShortWords(description)}
        </p>
      </div>
    </section>
  );
}

function keepShortWords(text: string) {
  return text.replace(/(^|[\s(])(и|в|во|на|к|ко|с|со|по|для|под|над|от|до|из|у|а|но|за|без|при|о|об|обо)\s+/giu, '$1$2\u00a0');
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
    <span className={`${tones[tone]} rounded-lg px-2 py-1 font-['Google Sans',sans-serif] text-xs font-medium leading-[18px] tracking-[0.1px]`}>
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
        {keepShortWords(title)}
      </h2>
      <p className="font-['Google Sans',sans-serif] text-base font-medium leading-[22px] text-[#191c1d] md:text-xl md:leading-[26px]">
        {keepShortWords(description)}
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

function Projects({ onProjectClick }: { onProjectClick: (project: 'admin-panel' | 'routes') => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start py-4 md:py-8 relative shrink-0 w-full max-w-[1392px] mx-auto px-4 md:px-8">
      <ProjectCard
        onClick={() => onProjectClick('admin-panel')}
        bgColor="bg-[#c5a5e4]"
        image={imgImage3}
        title="Админ панель - инструмент для релиз инженера"
        tags="UX, B2B, 2025"
      />
      <ProjectCard
        onClick={() => onProjectClick('routes')}
        bgColor="bg-[#84c4a5]"
        image={imgImage4}
        title="Маршруты - сервис отображения истории поездок сотрудников на карте"
        tags="UX, B2B, 2024"
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
          title="Админ панель для управления мобильным приложением"
          description="Развитие нового внутреннего продукта для команды разработки"
          tags={[
            { label: 'WEB', tone: 'web' },
            { label: 'B2B', tone: 'b2b' },
          ]}
        >
          <CaseImage src={caseAdminImage} alt="Админ панель" />
        </CaseCard>
        <CaseCard
          onClick={() => onProjectClick('routes')}
          title="Система контроля транспортных расходов"
          description="Спроектировал с нуля продукт для отслеживания перемещений сотрудников"
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
          description="Сборка концептов и их защита перед заказчиком"
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
          description="Вайбкодинг продуктов под личные задачи"
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="content-stretch flex flex-col gap-4 items-start leading-[0] py-6 md:py-[24px] relative shrink-0 text-[#191919] w-full">
      <div className="flex flex-col font-['Google Sans',sans-serif] font-black justify-center relative shrink-0 text-3xl md:text-[48px] w-full">
        <p className="leading-[43.2px]">{title}</p>
      </div>
      <div className="flex flex-col font-['Google Sans',sans-serif] font-medium justify-center leading-[26.88px] relative shrink-0 text-base md:text-[19.2px] w-full">
        {children}
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
      {keepShortWords(children)}
    </p>
  );
}

function CaseDecisionTitle({ children }: { children: string }) {
  return (
    <h3
      className="font-['Google Sans Flex','Google Sans',sans-serif] text-xl font-medium leading-[26px] tracking-[0] text-[#191c1d] lg:text-2xl lg:leading-[30px]"
      style={{ fontOpticalSizing: 'auto' }}
    >
      {keepShortWords(children)}
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
        {keepShortWords(title)}
      </h2>
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </section>
  );
}

function CaseStudyImageBlock({ alt }: { alt: string }) {
  return (
    <div className="w-full rounded-[28px] bg-[#fafbec] p-4 md:p-12 lg:p-16">
      <div className="aspect-[3840/2136] w-full overflow-hidden rounded-xl shadow-[0_0_16px_0_rgba(0,0,0,0.12)]">
        <img
          alt={alt}
          className="size-full object-cover"
          src={caseAdminImage}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

const adminGroupSlides = [
  caseAdminGroup1,
  caseAdminGroup2,
  caseAdminGroup3,
  caseAdminGroup5,
  caseAdminGroup6,
];

function AdminGroupSlideshow() {
  const slideshowRef = useRef<HTMLDivElement | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [areSlidesReady, setAreSlidesReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    let isCancelled = false;

    const preloadSlides = adminGroupSlides.map((slide) => new Promise<void>((resolve) => {
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
  }, []);

  useEffect(() => {
    const node = slideshowRef.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!areSlidesReady || isPaused || (!isInView && !isFullscreen)) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % adminGroupSlides.length);
    }, 1800);

    return () => window.clearInterval(interval);
  }, [areSlidesReady, isPaused, isInView, isFullscreen]);

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
    setActiveSlide((current) => (current - 1 + adminGroupSlides.length) % adminGroupSlides.length);
    setZoom(1);
  };

  const showNextSlide = () => {
    setActiveSlide((current) => (current + 1) % adminGroupSlides.length);
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
              src={adminGroupSlides[0]}
              loading="eager"
              decoding="sync"
            />
            {adminGroupSlides.map((slide, index) => (
              <img
                key={slide}
                alt={`Группы пользователей, шаг ${index + 1}`}
                className={`absolute inset-0 size-full object-cover ${
                  index === activeSlide ? 'opacity-100' : 'opacity-0'
                }`}
                src={slide}
                loading="eager"
                decoding="async"
              />
            ))}
          </button>
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
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-black/92 text-white">
          <div className="flex items-center justify-between gap-3 p-3 md:p-5">
            <div className="font-['Google Sans',sans-serif] text-sm font-medium md:text-base">
              {activeSlide + 1} / {adminGroupSlides.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPaused((current) => !current)}
                className="flex size-10 items-center justify-center rounded-full bg-white/12 hover:bg-white/20"
                aria-label={isPaused ? 'Продолжить слайдшоу' : 'Поставить слайдшоу на паузу'}
              >
                {isPaused ? <Play className="size-5" /> : <Pause className="size-5" />}
              </button>
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
                alt={`Группы пользователей, шаг ${activeSlide + 1}`}
                className="max-h-none max-w-none rounded-xl"
                src={adminGroupSlides[activeSlide]}
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

function AdminPanelContent() {
  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-6">
      <header className="flex w-full flex-col items-start gap-3 text-[#191c1d]">
        <h1 className="font-['Google Sans',sans-serif] text-[36px] font-medium leading-[42px] tracking-[-0.5px] md:text-[40px] md:leading-[48px] md:tracking-[-1px]">
          {keepShortWords('Админ панель для управления мобильным приложением')}
        </h1>
        <p className="font-['Google Sans',sans-serif] text-base font-medium leading-[22px] md:text-xl md:leading-[26px]">
          {keepShortWords('Развитие нового внутреннего продукта для команды разработки')}
        </p>
        <div className="flex flex-wrap gap-2">
          <CaseTag label="WEB" tone="web" />
          <CaseTag label="B2B" tone="b2b" />
        </div>
      </header>

      <CaseStudyImageBlock alt="Админ панель для управления мобильным приложением" />

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
        <CaseStudyImageBlock alt="Древовидная таблица веток и версий" />
        <CaseDecisionTitle>1. Древовидная таблица вместо плоского списка</CaseDecisionTitle>
        <CaseStudyText>Ветки и версии связаны между собой: одна ветка может содержать несколько последовательных сборок. В обычной таблице эта связь была бы неочевидна, особенно при большом количестве параллельных релизов</CaseStudyText>
        <CaseStudyText>Я предложил древовидную структуру, в которой ветки находятся на верхнем уровне, а версии раскрываются внутри них. Так пользователь сразу видит иерархию релизов и быстрее понимает, к какой ветке относится каждая сборка</CaseStudyText>

        <CaseStudyImageBlock alt="Управление ветками и версиями" />
        <CaseDecisionTitle>2. Управление ветками и версиями в одном интерфейсе</CaseDecisionTitle>
        <CaseStudyText>Раньше работа с отдельными сборками требовала ручных действий и не давала команде единой картины происходящего</CaseStudyText>
        <CaseStudyText>Я объединил создание веток, добавление версий и управление ими в одном рабочем пространстве. Пользователю не нужно переключаться между разными разделами или терять контекст выбранного релиза</CaseStudyText>

        <AdminGroupSlideshow />
        <CaseDecisionTitle>3. Отдельная сущность для групп пользователей</CaseDecisionTitle>
        <CaseStudyText>Изначально список пользователей предполагалось хранить внутри каждой ветки. Это означало, что при создании нового пилота или бета-релиза команде пришлось бы заново собирать одну и ту же группу тестировщиков</CaseStudyText>
        <CaseStudyText>Я предложил вынести группы пользователей в отдельную вкладку и сделать их переиспользуемой сущностью. Системный аналитик поддержал идею, и в результате одну группу бета-тестеров можно назначать разным веткам без повторного заполнения списка</CaseStudyText>
        <CaseStudyText>Такое решение сокращает ручную работу, снижает риск ошибок и упрощает управление параллельными релизами</CaseStudyText>
      </CaseStudySection>

      <CaseStudySection title="Чем я горжусь">
        <CaseStudyText>В этой задаче было важно снизить риск ошибок: действия администратора могут затронуть большое количество пользователей. Несмотря на высокий уровень экспертизы аудитории, интерфейс не должен требовать лишних усилий и перегружать пользователя деталями</CaseStudyText>
        <CaseStudyText>Я горжусь тем, что удалось сохранить сложную логику управления релизами, но представить её в простой и однозначной форме. Древовидная структура помогает быстро понимать связь между ветками и версиями, а сценарии управления остаются предсказуемыми и интуитивными</CaseStudyText>
      </CaseStudySection>
    </div>
  );
}

function RoutesContent() {
  return (
    <div className="w-full">
      <div className="content-stretch flex flex-col gap-4 items-start leading-[0] relative shrink-0 text-[#191919] mb-8">
        <div className="flex flex-col font-['Google Sans',sans-serif] font-black justify-center relative shrink-0 text-4xl md:text-6xl lg:text-[96px] w-full">
          <p className="leading-[0.9] whitespace-pre-wrap">Маршруты </p>
        </div>
        <div className="flex flex-col font-['Google Sans',sans-serif] font-medium justify-center relative shrink-0 text-base md:text-[19.2px] whitespace-nowrap">
          <p className="leading-[19.2px]">Сервис отображения истории поездок сотрудников на карте</p>
        </div>
      </div>

      <div className="w-full mb-8">
        <div className="relative overflow-clip rounded-lg md:rounded-[32px] bg-[#84c4a5] h-[400px] md:h-[900px]">
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
            <img alt="Маршруты" className="max-w-full max-h-full object-contain" src={imgImage4} loading="lazy" decoding="async" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1583px] mx-auto">
        <Section title="Контекст">
          <p className="whitespace-pre-wrap">Внутренний веб-сервис для логистов и операторов, который отображает историю поездок сотрудников на карте в реальном времени. Помогает отслеживать перемещения, анализировать маршруты и оптимизировать логистику.</p>
        </Section>

        <Section title="Проблема">
          <p className="mb-0 whitespace-pre-wrap">До внедрения сервиса:</p>
          <ul className="list-disc mb-0">
            <li className="mb-0 ms-[28.8px]"><span>не было визуализации маршрутов</span></li>
            <li className="mb-0 ms-[28.8px]"><span>сложно было отследить историю поездок</span></li>
            <li className="ms-[28.8px]"><span>отсутствовала аналитика по маршрутам</span></li>
          </ul>
          <p className="whitespace-pre-wrap">Цель — создать удобный инструмент для визуализации и анализа маршрутов сотрудников.</p>
        </Section>

        <Section title="Моя роль">
          <p className="mb-0 whitespace-pre-wrap">Проектировал интерфейс карты и элементов управления</p>
          <p className="mb-0 whitespace-pre-wrap">Разработал систему фильтров и поиска</p>
          <p className="mb-0 whitespace-pre-wrap">Создал дизайн информационных карточек</p>
          <p className="whitespace-pre-wrap">Участвовал в разработке мобильной версии</p>
        </Section>

        <Section title="Результат">
          <p className="mb-0 whitespace-pre-wrap">Логисты получили наглядный инструмент для отслеживания</p>
          <p className="mb-0 whitespace-pre-wrap">Сократилось время на поиск нужной поездки</p>
          <p className="whitespace-pre-wrap">Появилась возможность анализировать эффективность маршрутов</p>
        </Section>

        <div className="w-full mb-8"><img alt="Скриншот 1" className="w-full h-auto" src={imgUntitled1} loading="lazy" decoding="async" /></div>
        <div className="w-full mb-8"><img alt="Скриншот 2" className="w-full h-auto" src={imgImage5} loading="lazy" decoding="async" /></div>
        <div className="w-full mb-8"><img alt="Скриншот 3" className="w-full h-auto" src={imgImage6} loading="lazy" decoding="async" /></div>
        <div className="w-full mb-8"><img alt="Скриншот 4" className="w-full h-auto" src={imgImage7} loading="lazy" decoding="async" /></div>
        <div className="w-full mb-8"><img alt="Скриншот 5" className="w-full h-auto" src={imgImage8} loading="lazy" decoding="async" /></div>
      </div>
    </div>
  );
}



