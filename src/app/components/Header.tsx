import { useEffect, useState } from 'react';
import { Axe } from 'lucide-react';

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

function Left({ showLogo }: { showLogo: boolean }) {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleClick}
      className="hidden flex-[1_0_0] items-center gap-2 md:flex"
      data-name="left"
      aria-label="Наверх"
    >
      <div className={`flex items-center gap-2 transition-all duration-300 ${showLogo ? 'opacity-100' : 'w-0 overflow-hidden opacity-0'}`}>
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#e9f1ff] text-[#191c1d]" data-name="Logo">
          <Axe className="size-7" strokeWidth={2} />
        </div>
        <NameCity />
      </div>
    </button>
  );
}

function Buttons() {
  return (
    <div className="flex w-full shrink-0 items-center justify-center gap-2 md:w-auto" data-name="Buttons">
      <a
        href="/cv.pdf"
        download="Sergey-Toporkov-CV.pdf"
        className="flex h-14 min-h-10 min-w-20 flex-1 shrink-0 items-center justify-center rounded-full border border-[#79747e] px-6 py-4 font-['Google Sans',sans-serif] text-base font-medium leading-6 tracking-[0.1px] text-black transition-colors hover:bg-[#f5f5f5] md:flex-none"
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

function Right() {
  return (
    <div className="flex w-full min-w-px items-center justify-center md:flex-[1_0_0] md:justify-end" data-name="right">
      <Buttons />
    </div>
  );
}

export default function Header({ showAvatar: showAvatarProp }: { showAvatar?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showLogo = showAvatarProp !== undefined ? showAvatarProp : isScrolled;

  return (
    <div className="sticky top-4 z-50 mb-0 w-full">
      <div className="mx-auto max-w-[1392px] px-4 md:px-8">
        <div
          className={`relative flex h-[70px] items-center justify-between overflow-hidden rounded-[28px] bg-white px-2 transition-all duration-300 md:rounded-[32px] md:px-1 ${
            isScrolled ? 'shadow-[0_2px_10px_0_rgba(0,0,0,0.15)]' : ''
          }`}
          data-name="Header"
        >
          <Left showLogo={showLogo} />
          <Right />
        </div>
      </div>
    </div>
  );
}
