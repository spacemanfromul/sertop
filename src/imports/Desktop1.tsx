import imgToporkovSergei from "figma:asset/abec5a835e37d56de6c7ff0c4746ec7251e93219.png";
import imgImage3 from "figma:asset/866a53f627e8f3bc6a6770edc44c46647d97cd95.png";
import imgImage4 from "figma:asset/1491e78767295cee8997920ba3fd00bdc5d5ecd3.png";

function ToporkovSergei() {
  return (
    <div className="absolute left-0 rounded-[20px] size-[40px] top-[-8px]" data-name="Toporkov Sergei">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" src={imgToporkovSergei} />
    </div>
  );
}

function ImgAlekseiGrigorevHandsOnHeadOfDesignMargin() {
  return (
    <div className="h-[26px] relative shrink-0 w-[40px]" data-name="Img - Aleksei Grigorev - Hands-on Head of Design:margin">
      <ToporkovSergei />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-h-px min-w-px relative" data-name="Container">
      <ImgAlekseiGrigorevHandsOnHeadOfDesignMargin />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#191919] text-[19.2px] whitespace-nowrap">
        <p className="leading-[19.2px]">Сергей Топорков</p>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex items-start justify-end relative shrink-0" data-name="Component 1">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[0px] text-[blue] text-right whitespace-nowrap">
        <a className="block cursor-pointer leading-[26.88px] text-[19.2px]" href="https://t.me/spacemanfromul">
          Telegram
        </a>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-h-px min-w-px pb-[0.88px] relative" data-name="Container">
      <Component />
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex items-center justify-between pb-[40px] relative shrink-0 w-full" data-name="Header">
      <Container />
      <Container1 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 text-[#191919] whitespace-nowrap">
      <div className="flex flex-col font-['Geist:Black',sans-serif] font-black justify-center leading-[86.4px] relative shrink-0 text-[96px]">
        <p className="mb-0">«Порядок</p>
        <p>освобождает мысль»</p>
      </div>
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[19.2px]">
        <p className="leading-[19.2px]">Сергей Павлович Королёв — конструктор ракетно-космических систем</p>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#c5a5e4] flex-[1_0_0] h-[901.88px] min-h-px min-w-px relative" data-name="Background">
      <div className="size-full" />
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start justify-center min-h-px min-w-px overflow-clip relative" data-name="Link">
      <Background />
      <div className="absolute h-[1004px] left-[104px] rounded-[32px] top-[102.12px] w-[1641px]" data-name="image 3">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[32px] size-full" src={imgImage3} />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex h-[900px] items-start justify-center mb-[-0.01px] relative shrink-0 w-full z-[2]" data-name="Container">
      <Link />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-0.01px] pb-[24px] pt-[8px] relative shrink-0 w-full z-[1]" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium','Noto_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#191919] text-[0px] w-full">
        <p className="text-[19.2px] whitespace-pre-wrap">
          <span className="leading-[26.88px] text-[#191919]">{`Админ панель - инструмент для релиз инженера  `}</span>
          <span className="leading-[26.88px] text-[#999]">✦ UX, B2B, 2025</span>
        </p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col isolate items-start pb-[0.01px] relative self-stretch shrink-0 w-[908.8px]" data-name="Container">
      <Container4 />
      <Container5 />
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#84c4a5] flex-[1_0_0] h-[900px] min-h-px min-w-px relative" data-name="Background">
      <div className="size-full" />
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[900px] items-start justify-center min-h-px min-w-px overflow-clip relative" data-name="Link">
      <Background1 />
      <div className="absolute h-[22px] left-[80.81px] top-[854.12px] w-[1066px]">
        <div className="absolute inset-[-51.82%_-1.07%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1088.8 44.8">
            <g filter="url(#filter0_f_1_230)" id="Ellipse 1">
              <ellipse cx="544.4" cy="22.4" fill="var(--fill-0, black)" fillOpacity="0.12" rx="533" ry="11" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="44.8" id="filter0_f_1_230" width="1088.8" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur_1_230" stdDeviation="5.7" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute h-[775px] left-[103.81px] top-[101.12px] w-[920px]" data-name="image 4">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage4} />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex h-[900px] items-start justify-center mb-[-0.01px] relative shrink-0 w-full" data-name="Container">
      <Link1 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-0.01px] pb-[24px] pt-[8px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium','Noto_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#191919] text-[0px] w-full">
        <p className="text-[19.2px] whitespace-pre-wrap">
          <span className="leading-[26.88px] text-[#191919]">{`Маршруты - сервис отображения истории поездок сотрудников на карте `}</span>
          <span className="leading-[26.88px] text-[#999]">✦ UX, B2B, 2024</span>
        </p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.01px] relative self-stretch shrink-0 w-[908.81px]" data-name="Container">
      <Container7 />
      <Container8 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[38.39px] items-start justify-center py-[32px] relative shrink-0 w-[1856px]" data-name="Container">
      <Container3 />
      <Container6 />
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex flex-col h-[62.88px] items-center px-[34px] py-[18px] relative rounded-[9999px] shrink-0" data-name="Component 3">
      <div aria-hidden="true" className="absolute border-2 border-[blue] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-col font-['Geist:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[0px] text-[blue] text-center whitespace-nowrap">
        <a className="block cursor-pointer leading-[26.88px] text-[19.2px]" href="https://t.me/spacemanfromul">
          Telegram
        </a>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="content-start flex flex-wrap items-start justify-center pb-[40px] pt-[103.99px] relative shrink-0 w-full" data-name="Footer">
      <Component1 />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[0.19px] pt-[31px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999] text-[13px] text-center whitespace-nowrap">
        <p className="leading-[18.2px]">Спасибо за просмотр)</p>
      </div>
    </div>
  );
}

function SectionHeading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Section → Heading 1">
      <Frame1 />
      <Container2 />
      <Footer />
      <Container9 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col h-[364px] items-start left-0 p-[32px] top-0 w-[1920px]">
      <Header />
      <SectionHeading />
    </div>
  );
}

export default function Desktop() {
  return (
    <div className="bg-white relative size-full" data-name="Desktop - 1">
      <Frame />
    </div>
  );
}