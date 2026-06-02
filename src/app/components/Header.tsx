import { useState, useEffect } from 'react';
import ScrollProgress from './ScrollProgress';

function Container() {
  return (
    <div className="content-stretch flex h-[18px] items-center relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Google Sans',sans-serif] h-full justify-center leading-[0] relative shrink-0 text-[12px] text-[rgba(25,28,29,0.7)] text-left tracking-[0.1px] w-[102px]">
        <p className="leading-[18px]">Санкт-Петербург </p>
      </div>
    </div>
  );
}

function NameCity() {
  return (
    <div className="content-stretch hidden md:flex flex-col items-start max-w-[684px] pb-[4px] pt-[8px] relative shrink-0" data-name="NameCity">
      <div className="flex flex-col font-['Google Sans',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#191c1d] text-[14px] text-left tracking-[0.25px] whitespace-nowrap">
        <p className="leading-[20px]">Сергей Топорков</p>
      </div>
      <Container />
    </div>
  );
}

function Left({ showAvatar }: { showAvatar: boolean }) {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button onClick={handleClick} className="content-stretch flex flex-[1_0_0] gap-[4px] items-center min-w-px relative cursor-default" data-name="left">
      <div className={`flex gap-[4px] items-center transition-all duration-300 ${showAvatar ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
        <div className="relative shrink-0 h-[56px] aspect-square" data-name="Progress">
          <ScrollProgress />
        </div>
        <NameCity />
      </div>
    </button>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Google Sans',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center tracking-[0.1px] whitespace-nowrap">
        <p className="leading-[24px]">Скачать CV</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Google Sans',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white tracking-[0.1px] whitespace-nowrap">
        <p className="leading-[24px]">Связаться</p>
      </div>
    </div>
  );
}

function Buttons() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0" data-name="Buttons">
      <a
        href="/cv.pdf"
        download="Sergey-Toporkov-CV.pdf"
        className="content-stretch flex h-[56px] items-center justify-center min-h-[40px] min-w-[80px] px-[25.67px] py-[16px] relative rounded-[100px] shrink-0 border border-[#79747e] hover:bg-[#f5f5f5] transition-colors"
        data-name="Component 3"
      >
        <Container1 />
      </a>
      <a
        href="https://t.me/spacemanfromul"
        target="_blank"
        rel="noopener noreferrer"
        className="content-stretch flex h-[56px] items-center justify-center min-h-[40px] min-w-[80px] px-[25.67px] py-[16px] relative rounded-[100px] shrink-0 bg-[#0b57d0] hover:bg-[#0842a0] transition-colors"
        data-name="Component 4"
      >
        <Container2 />
      </a>
    </div>
  );
}

function Right() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-end min-w-px pb-[0.88px] relative" data-name="right">
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Если showAvatarProp не указан (главная страница), показываем аватар при скролле
  // Если указан (страницы кейсов), используем переданное значение
  const showAvatar = showAvatarProp !== undefined ? showAvatarProp : isScrolled;

  return (
    <div className="sticky top-0.5 md:top-4 z-50 w-full mb-0">
      <div className="max-w-[1392px] mx-auto px-4 md:px-8">
        <div
          className={`bg-white content-stretch flex items-center justify-between overflow-clip px-1 md:px-[4px] relative h-[70px] transition-all duration-300 ${
            isScrolled ? 'shadow-[0_2px_10px_0_rgba(0,0,0,0.15)] rounded-[20px] md:rounded-[32px]' : ''
          }`}
          data-name="Header"
        >
          <Left showAvatar={showAvatar} />
          <Right />
        </div>
      </div>
    </div>
  );
}
