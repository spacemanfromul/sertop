import { useEffect, useRef, useState } from 'react';
import { Axe } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router';
import caseRoutesVideo from '../../assets/cases/routes-prototype-cover.mp4';
import caseAdminImage from '../../assets/cases/case-admin.png';
import pushupCounterImage from '../../assets/cases/pushup-counter.webp';
import pushupGymBgImage from '../../assets/cases/pushup-gym-bg.webp';
import phoneMockupImage from '../../assets/cases/phone-mockup.png';
import caseChallengesImage from '../../assets/cases/case-challenges.webp';
import serviceSprintCoverImage from '../../assets/cases/service-sprint-cover.png';
import aboutAdventureImage from '../../imports/Frame270989289-4/02203f4f61aa30d19120aa7df16dae07061dd01f.jpg';
import aboutPortraitImage from '../../imports/Frame270989289-4/a83d6113c61a6a5429e4b85d05513e17e34b7d3a.jpg';
import aboutWorkshopImage from '../../imports/Frame270989289-4/5dfcbac1716ed4b7f6d200a9779b11a60077d470.jpg';

function NameCity() {
  return (
    <div className="hidden flex-col items-start pb-1 pt-2 md:flex">
      <div className="font-['Google Sans',sans-serif] text-sm font-medium leading-5 tracking-[0.25px] text-[#191c1d]">
        Сергей Топорков
      </div>
      <div className="font-['Google Sans',sans-serif] text-xs leading-[18px] tracking-[0.1px] text-[rgba(25,28,29,0.7)]">
        Санкт-Петербург
      </div>
    </div>
  );
}

type CaseHeaderInfo = {
  title: string;
  subtitle?: string;
};

function Left({ showLogo }: { showLogo: boolean }) {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NavLink
      to="/"
      onClick={handleClick}
      className="hidden shrink-0 items-center gap-2 md:flex"
      data-name="left"
      aria-label="Наверх"
    >
      <div className={`flex items-center gap-2 transition-all duration-300 ${showLogo ? 'opacity-100' : 'w-0 overflow-hidden opacity-0'}`}>
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#e9f1ff] text-[#191c1d]" data-name="Logo">
          <Axe className="size-7" strokeWidth={2} />
        </div>
        <NameCity />
      </div>
    </NavLink>
  );
}

function CaseIdentity({ caseInfo, show }: { caseInfo: CaseHeaderInfo; show: boolean }) {
  return (
    <div
      className={`absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 transition-[opacity,transform] duration-300 ease-out md:flex ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <span className="whitespace-nowrap font-['Google Sans',Roboto,Arial,sans-serif] text-xl font-medium leading-[26px] tracking-[0] text-[#191c1d]">
          {caseInfo.title}
        </span>
        {caseInfo.subtitle ? (
          <span className="whitespace-nowrap font-['Google Sans',Roboto,Arial,sans-serif] text-xs font-normal leading-[18px] tracking-[0.1px] text-[rgba(25,28,29,0.7)]">
            {caseInfo.subtitle}
          </span>
        ) : null}
      </div>
    </div>
  );
}

const caseItems = [
  { title: 'Сервисные команды', description: 'Задачи и контроль выездных работ', to: '/cases/service-sprint', cover: 'service' },
  { title: 'Контроль поездок', description: 'Контроль транспортных расходов', to: '/cases/routes', cover: 'routes' },
  { title: 'Ветки и версии', description: 'Управление версиями приложения', to: '/cases/releases', cover: 'releases' },
  { title: 'Счетчик отжиманий', description: 'ML-счётчик отжиманий', to: '/cases/pushup-counter', cover: 'pushup' },
  { title: 'Дизайн-челленджи', description: 'UI/UX-эксперименты и проекты', to: '/cases/design-challenges', cover: 'challenges' },
];

type OpenMenu = 'cases' | 'about' | null;

function MainNavigation({ openMenu, setOpenMenu }: { openMenu: OpenMenu; setOpenMenu: (menu: OpenMenu) => void }) {
  const chipClassName =
    "relative flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#eff1f2] px-4 py-3 font-['Google Sans',sans-serif] text-base font-medium leading-6 text-[#191c1d] transition-colors hover:bg-[rgba(60,64,67,0.08)]";

  return (
    <nav className="hidden min-w-0 items-center gap-2 md:flex md:flex-none" aria-label="Основная навигация">
      <Link to="/" onMouseEnter={() => setOpenMenu(null)} className={chipClassName}>
        Главная
      </Link>
      <button type="button" onMouseEnter={() => setOpenMenu('cases')} className={chipClassName} aria-expanded={openMenu === 'cases'}>
        Кейсы
      </button>
      <button type="button" onMouseEnter={() => setOpenMenu('about')} className={chipClassName} aria-expanded={openMenu === 'about'}>
        Обо мне
      </button>
    </nav>
  );
}

function CaseMenuCover({ cover }: { cover: string }) {
  if (cover === 'service') {
    return <img src={serviceSprintCoverImage} alt="" className="size-full object-cover" />;
  }

  if (cover === 'routes') {
    return <video src={caseRoutesVideo} className="size-full object-cover" autoPlay muted loop playsInline preload="metadata" />;
  }

  if (cover === 'pushup') {
    return (
      <div className="relative size-full overflow-hidden">
        <img src={pushupGymBgImage} alt="" className="absolute inset-0 size-full object-cover" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-[90%] aspect-[928/1962] drop-shadow-[0_12px_20px_rgba(0,0,0,0.4)]">
            <img src={phoneMockupImage} alt="" className="absolute inset-0 size-full" loading="lazy" decoding="async" />
            <div className="absolute left-[4.09%] top-[1.12%] h-[97.66%] w-[92.03%] overflow-hidden bg-black" style={{ borderRadius: '15.46% / 6.89%' }}>
              <img src={pushupCounterImage} alt="" className="size-full object-cover" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const image = cover === 'releases' ? caseAdminImage : caseChallengesImage;
  return <img src={image} alt="" className="size-full object-cover" loading="lazy" decoding="async" />;
}

function CasesMegaMenu({ closeMenu }: { closeMenu: () => void }) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {caseItems.map((item) => (
        <Link key={item.to} to={item.to} onClick={closeMenu} className="group rounded-[24px] bg-[#f7f8f9] p-3 transition-colors hover:bg-[#eff1f2]">
          <div className="aspect-video overflow-hidden rounded-[18px] bg-[#e8edf3]">
            <div className="size-full transition-transform duration-300 group-hover:scale-[1.03]">
              <CaseMenuCover cover={item.cover} />
            </div>
          </div>
          <h3 className="mt-3 font-['Google Sans',sans-serif] text-lg font-medium leading-6 text-[#191c1d]">{item.title}</h3>
          <p className="mt-1 font-['Google Sans Flex','Google Sans',sans-serif] text-sm leading-5 text-[#5f6368]">{item.description}</p>
        </Link>
      ))}
    </div>
  );
}

function AboutMegaMenu() {
  const images = [aboutAdventureImage, aboutPortraitImage, aboutWorkshopImage];

  return (
    <div className="grid grid-cols-[1.1fr_0.9fr] gap-6">
      <div className="grid grid-cols-3 gap-3">
        {images.map((src, index) => (
          <div key={src} className="aspect-[4/3] overflow-hidden rounded-[20px] bg-[#eff1f2]">
            <img src={src} alt="" className="size-full object-cover" loading="lazy" decoding="async" style={{ objectPosition: index === 1 ? '50% 42%' : 'center' }} />
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-center p-6 text-[#191c1d]">
        <p className="font-['Google Sans',sans-serif] text-xl font-medium leading-[26px]">Вне работы исследую мир, люблю активный отдых и 3D-печать.</p>
        <p className="mt-3 font-['Google Sans Flex','Google Sans',sans-serif] text-base leading-6 text-[#5f6368]">Это помогает переключаться, восстанавливать силы и возвращаться к продуктовым задачам с новыми идеями.</p>
      </div>
    </div>
  );
}

function Buttons({ isScrolled }: { isScrolled: boolean }) {
  return (
    <div className="flex w-full shrink-0 items-center justify-center gap-2 md:w-auto" data-name="Buttons">
      <a
        href="/cv.pdf"
        download="Sergey-Toporkov-CV.pdf"
        className={`flex h-14 min-h-10 min-w-20 flex-1 shrink-0 items-center justify-center rounded-full border bg-white px-6 py-4 font-['Google Sans',sans-serif] text-base font-medium leading-6 tracking-[0.1px] text-black transition-colors hover:bg-[#f5f5f5] md:flex-none ${
          isScrolled ? 'border-[#79747e]' : 'border-transparent'
        }`}
      >
        Скачать CV
      </a>
      <a
        href="https://t.me/spacemanfromul"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 min-h-10 min-w-20 flex-1 shrink-0 items-center justify-center rounded-full bg-[#0b57d0] px-6 py-4 font-['Google Sans',sans-serif] text-base font-medium leading-6 tracking-[0.1px] text-white transition-colors hover:bg-[#0842a0] md:flex-none"
      >
        Связаться
      </a>
    </div>
  );
}

function Right({ isScrolled }: { isScrolled: boolean }) {
  return (
    <div className="flex w-full min-w-px items-center justify-end md:ml-auto md:w-auto md:flex-none" data-name="right">
      <Buttons isScrolled={isScrolled} />
    </div>
  );
}

export default function Header({ showAvatar: showAvatarProp }: { showAvatar?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [displayedMenu, setDisplayedMenu] = useState<Exclude<OpenMenu, null>>('cases');
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { pathname } = useLocation();
  const caseInfo: CaseHeaderInfo | undefined = pathname === '/cases/routes'
    ? { title: 'Контроль поездок', subtitle: 'Продуктовый кейс' }
    : pathname === '/cases/releases'
      ? { title: 'Ветки и версии', subtitle: 'Продуктовый кейс' }
      : pathname === '/cases/pushup-counter'
        ? { title: 'Счетчик отжиманий', subtitle: 'Пет-проект' }
        : pathname === '/cases/design-challenges'
          ? { title: 'Дизайн-челленджи' }
          : pathname === '/cases/service-sprint'
            ? { title: 'Сервисные команды', subtitle: 'Продуктовый кейс' }
            : undefined;
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
  }, []);

  const showLogo = showAvatarProp !== undefined ? showAvatarProp : isScrolled;
  const changeMenu = (menu: OpenMenu) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (menu) {
      setDisplayedMenu(menu);
    }
    setOpenMenu(menu);
  };
  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setOpenMenu(null);
      closeTimerRef.current = null;
    }, 180);
  };

  return (
    <>
      <button
        type="button"
        className={`fixed inset-0 z-[990] hidden cursor-default bg-black/70 transition-opacity duration-300 ease-out md:block ${
          openMenu ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpenMenu(null)}
        aria-label="Закрыть меню"
        aria-hidden={!openMenu}
      />

      <div
        className="fixed left-0 right-0 top-4 z-[1000] mb-0 w-full"
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        <div className="relative mx-auto max-w-[1280px] px-4 md:px-0">
        <div
          className={`relative flex h-[70px] items-center justify-between overflow-hidden rounded-[28px] px-2 transition-all duration-300 md:rounded-[32px] md:px-1 ${
            isScrolled || openMenu ? 'bg-white shadow-[0_2px_10px_0_rgba(0,0,0,0.15)]' : 'bg-transparent'
          }`}
          data-name="Header"
        >
          {caseInfo ? (
            <>
              <MainNavigation openMenu={openMenu} setOpenMenu={changeMenu} />
              <CaseIdentity caseInfo={caseInfo} show={isScrolled} />
            </>
          ) : (
            <Left showLogo={showLogo} />
          )}
          <Right isScrolled={isScrolled} />
        </div>

          <div
            className={`absolute inset-x-0 top-[82px] hidden origin-top rounded-[32px] bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.24)] transition-[opacity,transform] duration-300 ease-out md:block ${
              openMenu
                ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                : 'pointer-events-none -translate-y-3 scale-[0.985] opacity-0'
            }`}
            aria-hidden={!openMenu}
            onMouseEnter={cancelClose}
          >
            {displayedMenu === 'cases' ? <CasesMegaMenu closeMenu={() => setOpenMenu(null)} /> : <AboutMegaMenu />}
          </div>
        </div>
      </div>
    </>
  );
}
