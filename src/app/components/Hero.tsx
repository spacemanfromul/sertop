import { useState, useEffect } from 'react';
import { RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import imgContainer from "../../imports/Hero/58b059b979a564c3f70557c331cb54b5e258dd48.jpg";

function Container() {
  return (
    <div className="relative rounded-[20px] md:rounded-[28px] w-full md:w-[320px] md:flex-none aspect-square md:aspect-auto md:h-[320px]" data-name="Container">
      <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[20px] md:rounded-[28px]">
        <div className="absolute bg-[#e9f1ff] inset-0 rounded-[20px] md:rounded-[28px]" />
        <img alt="" className="absolute max-w-none object-cover rounded-[20px] md:rounded-[28px] size-full" src={imgContainer} fetchPriority="high" decoding="async" />
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="[word-break:break-word] flex flex-col font-['Google Sans',sans-serif] justify-center leading-[0] relative shrink-0 text-[#191c1d] text-[14px] tracking-[0.25px]">
        <p className="leading-[20px]">Продуктовый дизайнер, Санкт-Петербург</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <div className="[word-break:break-word] flex flex-col font-['Google Sans',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1d] text-[20px] whitespace-nowrap">
        <p className="leading-[26px]">Сергей Топорков</p>
      </div>
      <Frame2 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <div className="[word-break:break-word] flex flex-col font-['Google Sans',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1d] text-[20px]">
        <p className="leading-[26px]">Админки, FMS, мобильные трекеры и RAG/AI-агенты</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[#e9f1ff] content-stretch flex flex-col gap-[12px] h-auto md:h-[320px] items-start justify-center px-[32px] py-[32px] md:py-0 relative rounded-[20px] md:rounded-[28px] w-full md:flex-1 md:min-w-0" data-name="Container">
      <Frame3 />
      <div className="[word-break:break-word] flex flex-col font-['Google Sans',sans-serif] font-medium justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[40px] tracking-[-1px] w-[min-content] whitespace-pre-wrap">
        <p className="leading-[48px] mb-0">Делаю сложные </p>
        <p className="leading-[48px]">B2B-системы понятными</p>
      </div>
      <Frame4 />
    </div>
  );
}

function Container2() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const achievements = [
    <>спроектировал <span className="whitespace-nowrap">админ-панель</span> для&nbsp;управления релизами мобильного приложения</>,
    <>разработал систему мониторинга и&nbsp;перемещений мобильных сотрудников</>,
    <>внедрял <span className="whitespace-nowrap">AI-функции</span> в&nbsp;мобильное приложение</>,
    <>проектировал концепт <span className="whitespace-nowrap">RAG-помощника</span> для&nbsp;сотрудников</>
  ];

  useEffect(() => {
    if (isFlipped) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % achievements.length);
      }, 4500);
      return () => clearInterval(interval);
    }
  }, [isFlipped, achievements.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + achievements.length) % achievements.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % achievements.length);
  };

  return (
    <div
      className="w-full xl:w-[370px] xl:flex-none h-auto md:h-[320px] cursor-pointer"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => {
        setIsFlipped(false);
        setCurrentIndex(0);
      }}
      data-name="Container"
    >
      <div
        className="w-full h-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          position: 'relative',
          minHeight: '320px'
        }}
      >
        {/* Передняя сторона */}
        <div
          className="[word-break:break-word] bg-[rgba(170,255,187,0.92)] content-stretch flex flex-col h-full items-start justify-center leading-[0] not-italic px-[32px] py-[32px] md:py-0 rounded-[20px] md:rounded-[28px] text-[#0f5223] tracking-[-1px] w-full absolute inset-0"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <RotateCw className="absolute top-4 right-4 w-6 h-6 opacity-50" />
          <div className="flex flex-col font-['Google Sans',sans-serif] font-bold justify-center relative shrink-0 text-[64px] whitespace-nowrap">
            <p className="leading-[96px]">3+ года</p>
          </div>
          <div className="flex flex-col font-['Google Sans',sans-serif] font-medium justify-center min-w-full relative shrink-0 text-[40px] w-[min-content]">
            <p className="leading-[48px]">коммерческого опыта</p>
          </div>
        </div>

        {/* Задняя сторона */}
        <div
          onClick={() => setIsFlipped(false)}
          className="bg-[rgba(170,255,187,0.92)] content-stretch flex flex-col h-full items-center justify-between px-[32px] py-[32px] md:py-[24px] rounded-[20px] md:rounded-[28px] text-[#0f5223] w-full absolute inset-0 cursor-pointer md:cursor-default"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
                  index === currentIndex
                    ? 'opacity-100 translate-x-0'
                    : index === (currentIndex - 1 + achievements.length) % achievements.length
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <p className="font-['Google Sans',sans-serif] font-medium text-[18px] md:text-[24px] leading-[28px] md:leading-[36px] text-center px-4">
                  {achievement}
                </p>
              </div>
            ))}
          </div>

          {/* Навигация */}
          <div className="flex items-center justify-center gap-4 mt-4 bg-white rounded-full px-4 py-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="text-[#0f5223] hover:opacity-70 transition-opacity"
              aria-label="Предыдущий"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-['Google Sans',sans-serif] font-medium text-[14px] text-[#0f5223] min-w-[40px] text-center">
              {currentIndex + 1} / {achievements.length}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="text-[#0f5223] hover:opacity-70 transition-opacity"
              aria-label="Следующий"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-wrap gap-[24px] relative w-full">
      <Container />
      <Container1 />
      <Container2 />
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[#fafbec] content-stretch flex flex-col items-center justify-center px-[12px] md:px-[16px] relative rounded-[16px] md:rounded-[28px] shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Google Sans',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#52520f] text-[24px] md:text-[32px] tracking-[-0.5px] md:tracking-[-1px] whitespace-nowrap">
        <p className="leading-[48px] md:leading-[64px]">WEB</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[rgba(238,232,249,0.92)] content-stretch flex flex-col items-center justify-center px-[12px] md:px-[16px] relative rounded-[16px] md:rounded-[28px] shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Google Sans',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#490f52] text-[24px] md:text-[32px] tracking-[-0.5px] md:tracking-[-1px] whitespace-nowrap">
        <p className="leading-[48px] md:leading-[64px]">Mobile</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-[#eaf9ec] content-stretch flex flex-col items-center justify-center px-[12px] md:px-[16px] relative rounded-[16px] md:rounded-[28px] shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Google Sans',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0f5223] text-[24px] md:text-[32px] tracking-[-0.5px] md:tracking-[-1px] whitespace-nowrap">
        <p className="leading-[48px] md:leading-[64px]">B2B</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-[#f9eaea] content-stretch flex flex-col items-center justify-center px-[12px] md:px-[16px] relative rounded-[16px] md:rounded-[28px] shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Google Sans',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#52170f] text-[24px] md:text-[32px] tracking-[-0.5px] md:tracking-[-1px] whitespace-nowrap">
        <p className="leading-[48px] md:leading-[64px]">Data-heavy</p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="flex flex-wrap gap-[12px] md:gap-[16px_24px] items-center justify-center relative w-full">
      <Container3 />
      <Container4 />
      <Container5 />
      <Container6 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full">
      <Frame5 />
    </div>
  );
}

export default function Hero() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] md:gap-[24px] items-start relative w-full max-w-[1392px] mx-auto px-4 md:px-8 py-4 md:py-8" data-name="HERO">
      <Frame />
      <Frame1 />
    </div>
  );
}
