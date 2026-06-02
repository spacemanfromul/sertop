import imgToporkovSergei from "figma:asset/abec5a835e37d56de6c7ff0c4746ec7251e93219.png";
import imgImage3 from "figma:asset/866a53f627e8f3bc6a6770edc44c46647d97cd95.png";
import imgImage10 from "figma:asset/458f81f65860ef4f62aaa75b22daf2922cc76789.png";

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
        <p className="leading-[26.88px] text-[19.2px]">Главная</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[36.67px] items-start justify-end min-h-px min-w-px pb-[0.88px] relative" data-name="Container">
      <Component />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[0px] text-[blue] text-right whitespace-nowrap">
        <a className="block cursor-pointer leading-[26.88px] text-[19.2px]" href="https://t.me/spacemanfromul">
          Telegram
        </a>
      </div>
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
    <div className="content-stretch flex flex-col gap-[16px] items-start leading-[0] relative shrink-0 text-[#191919]">
      <div className="flex flex-col font-['Geist:Black',sans-serif] font-black justify-center relative shrink-0 text-[96px] w-[824px]">
        <p className="leading-[86.4px] whitespace-pre-wrap">{`Админ панель `}</p>
      </div>
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[19.2px] whitespace-nowrap">
        <p className="leading-[26.88px]">Инструмент для релиз инженера</p>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#c5a5e4] flex-[1_0_0] h-[900px] min-h-px min-w-px relative" data-name="Background">
      <div className="size-full" />
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[900px] items-start justify-center min-h-px min-w-px overflow-clip relative" data-name="Link">
      <Background />
      <div className="-translate-x-1/2 absolute h-[22px] left-1/2 top-[854.12px] w-[1066px]">
        <div className="absolute inset-[-51.82%_-1.07%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1088.8 44.8">
            <g filter="url(#filter0_f_1_232)" id="Ellipse 1">
              <ellipse cx="544.4" cy="22.4" fill="var(--fill-0, black)" fillOpacity="0.12" rx="533" ry="11" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="44.8" id="filter0_f_1_232" width="1088.8" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur_1_232" stdDeviation="5.7" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute h-[1004px] left-1/2 rounded-[32px] top-[101.12px] w-[1641px]" data-name="image 3">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[32px] size-full" src={imgImage3} />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex h-[900px] items-start justify-center mb-[-0.01px] relative shrink-0 w-full" data-name="Container">
      <Link />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start leading-[0] mb-[-0.01px] py-[24px] relative shrink-0 text-[#191919] w-[1583px]" data-name="Container">
      <div className="flex flex-col font-['Geist:Black',sans-serif] font-black justify-center relative shrink-0 text-[48px] w-full">
        <p className="leading-[43.2px] whitespace-pre-wrap">Контекст</p>
      </div>
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[19.2px] w-full whitespace-pre-wrap">
        <p className="leading-[26.88px] mb-0">Внутреннее веб-приложение для релиз-инженеров, которое используется для подготовки и выпуска новых версий мобильного приложения.</p>
        <p className="leading-[26.88px] mb-0">Инструмент объединяет:</p>
        <ul className="list-disc mb-0">
          <li className="mb-0 ms-[28.799999999999997px]">
            <span className="leading-[26.88px]">управление версиями</span>
          </li>
          <li className="mb-0 ms-[28.799999999999997px]">
            <span className="leading-[26.88px]">конфигурацию релиза</span>
          </li>
          <li className="ms-[28.799999999999997px]">
            <span className="leading-[26.88px]">контроль статусов</span>
          </li>
        </ul>
        <p className="leading-[26.88px]">Аудитория — релиз-инженеры и DevOps-специалисты.</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start leading-[0] mb-[-0.01px] py-[24px] relative shrink-0 text-[#191919] w-[1583px]" data-name="Container">
      <div className="flex flex-col font-['Geist:Black',sans-serif] font-black justify-center relative shrink-0 text-[48px] w-full">
        <p className="leading-[43.2px] whitespace-pre-wrap">Проблема</p>
      </div>
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[19.2px] w-full whitespace-pre-wrap">
        <p className="leading-[26.88px] mb-0">Существующий процесс релизов был частично ручным и фрагментированным:</p>
        <ul className="list-disc mb-0">
          <li className="mb-0 ms-[28.799999999999997px]">
            <span className="leading-[26.88px]">данные хранились в разных системах</span>
          </li>
          <li className="mb-0 ms-[28.799999999999997px]">
            <span className="leading-[26.88px]">не было прозрачного статуса релиза</span>
          </li>
          <li className="ms-[28.799999999999997px]">
            <span className="leading-[26.88px]">высокий риск человеческой ошибки</span>
          </li>
        </ul>
        <p className="leading-[26.88px]">Цель — создать единый веб-инструмент для управления релизами с понятной логикой и минимизацией ошибок. Сократить время для поиска и установки мобильного приложения для сотрудников</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center mb-[-0.01px] py-[24px] relative shrink-0 text-[#191919] w-[1583px]" data-name="Container">
      <div className="flex flex-col font-['Geist:Black',sans-serif] font-black justify-center leading-[0] relative shrink-0 text-[48px] w-full">
        <p className="leading-[43.2px] whitespace-pre-wrap">Моя роль</p>
      </div>
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[26.88px] relative shrink-0 text-[19.2px] w-full whitespace-pre-wrap">
        <p className="mb-0">Вёл дизайн веб-интерфейса</p>
        <p className="mb-0">Работал в связке: дизайнер + продакт + DevOps + backend</p>
        <p className="mb-0">Формулировал гипотезы по упрощению сценариев</p>
        <p className="mb-0">Проектировал user flow и ключевые состояния</p>
        <p className="mb-0">Развивал компоненты дизайн-системы</p>
        <p>Сопровождал реализацию</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center leading-[0] mb-[-0.01px] py-[24px] relative shrink-0 text-[#191919] w-[1583px]" data-name="Container">
      <div className="flex flex-col font-['Geist:Black',sans-serif] font-black justify-center relative shrink-0 text-[48px] w-full">
        <p className="leading-[43.2px] whitespace-pre-wrap">Исследования</p>
      </div>
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[19.2px] w-full">
        <p className="leading-[26.88px] whitespace-pre-wrap">Провёл мини-интервью с релиз-инженерами, а также интервью с пользователями мобильного приложения. По резльтатам интервью были подтверждены гипотезы. Получили окончательный ответ о ценности данного функционала.</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center mb-[-0.01px] py-[24px] relative shrink-0 w-[1583px]" data-name="Container">
      <div className="flex flex-col font-['Geist:Black',sans-serif] font-black justify-center leading-[0] relative shrink-0 text-[#191919] text-[48px] w-full">
        <p className="leading-[43.2px] whitespace-pre-wrap">Разработка</p>
      </div>
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[26.88px] relative shrink-0 text-[#191919] text-[19.2px] w-full whitespace-pre-wrap">
        <p className="mb-0">Разработал информационную архитектуру</p>
        <p className="mb-0">Создал wireframes для ключевых сценариев</p>
        <p>Провёл валидацию сценариев с пользователями</p>
      </div>
      <div className="aspect-[1920/840] relative shrink-0 w-full" data-name="image 10">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage10} />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center mb-[-0.01px] py-[24px] relative shrink-0 text-[#191919] w-[1583px]" data-name="Container">
      <div className="flex flex-col font-['Geist:Black',sans-serif] font-black justify-center leading-[0] relative shrink-0 text-[48px] w-full">
        <p className="leading-[43.2px] whitespace-pre-wrap">Результат</p>
      </div>
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[26.88px] relative shrink-0 text-[19.2px] w-full whitespace-pre-wrap">
        <p className="mb-0">Снизилось количество ошибок при подготовке релиза</p>
        <p className="mb-0">Процесс стал прозрачным для смежных команд</p>
        <p className="mb-0">Упростился онбординг новых релиз-инженеров</p>
        <p className="mb-0">Сценарий выпуска стал последовательным и предсказуемым</p>
        <p>Раскатка и остановка бета-версий стал более простым</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center leading-[0] mb-[-0.01px] py-[24px] relative shrink-0 text-[#191919] w-[1583px]" data-name="Container">
      <div className="flex flex-col font-['Geist:Black',sans-serif] font-black justify-center relative shrink-0 text-[48px] w-full">
        <p className="leading-[43.2px] whitespace-pre-wrap">Что дальше</p>
      </div>
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[19.2px] w-full whitespace-pre-wrap">
        <p className="leading-[26.88px] mb-0">В дальнейшем можно:</p>
        <ul className="list-disc">
          <li className="mb-0 ms-[28.799999999999997px]">
            <span className="leading-[26.88px]">добавить автоматические проверки перед релизом</span>
          </li>
          <li className="mb-0 ms-[28.799999999999997px]">
            <span className="leading-[26.88px]">интегрировать AI-помощника для анализа рисков</span>
          </li>
          <li className="ms-[28.799999999999997px]">
            <span className="leading-[26.88px]">улучшить аналитику по релизам</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-h-px min-w-px pb-[0.01px] relative self-stretch" data-name="Container">
      <Container4 />
      <Container5 />
      <Container6 />
      <Container7 />
      <Container8 />
      <Container9 />
      <Container10 />
      <Container11 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex items-start justify-center py-[32px] relative shrink-0 w-[1856px]" data-name="Container">
      <Container3 />
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

function Container12() {
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
      <Container12 />
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
    <div className="bg-white relative size-full" data-name="Desktop - 2">
      <Frame />
    </div>
  );
}