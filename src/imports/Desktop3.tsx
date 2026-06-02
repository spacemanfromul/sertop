import imgToporkovSergei from "figma:asset/abec5a835e37d56de6c7ff0c4746ec7251e93219.png";
import imgImage4 from "figma:asset/1491e78767295cee8997920ba3fd00bdc5d5ecd3.png";
import imgUntitled1 from "figma:asset/135baa3a3201b07dd545e70bc419fb50a67cd083.png";
import imgImage5 from "figma:asset/e8c846511aa03374308d4d0bdc22c5f832e00a3a.png";
import imgImage6 from "figma:asset/9155f2a5dd6b67a82f2e3b2e464f250a0d69327a.png";
import imgImage7 from "figma:asset/a8f4a43bc65a3564df1b44fdf7f8eaf424c9c6de.png";
import imgImage8 from "figma:asset/6f2a29bf14bfeaf82e47e74b71c327ae0a63e3dd.png";

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
      <div className="flex flex-col font-['Geist:Black',sans-serif] font-black justify-center min-w-full relative shrink-0 text-[96px] w-[min-content]">
        <p className="leading-[86.4px] whitespace-pre-wrap">{`Маршруты `}</p>
      </div>
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[19.2px] whitespace-nowrap">
        <p className="leading-[19.2px]">Сервис отображения истории поездок сотрудников на карте</p>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#84c4a5] flex-[1_0_0] h-[900px] min-h-px min-w-px relative" data-name="Background">
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
            <g filter="url(#filter0_f_1_234)" id="Ellipse 1">
              <ellipse cx="544.4" cy="22.4" fill="var(--fill-0, black)" fillOpacity="0.12" rx="533" ry="11" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="44.8" id="filter0_f_1_234" width="1088.8" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur_1_234" stdDeviation="5.7" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute h-[775px] left-1/2 top-[101.12px] w-[920px]" data-name="image 4">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage4} />
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
    <div className="content-stretch flex flex-col gap-[16px] items-start mb-[-0.01px] py-[24px] relative shrink-0 text-[#191919] w-[1583px]" data-name="Container">
      <div className="flex flex-col font-['Geist:Black',sans-serif] font-black justify-center leading-[0] relative shrink-0 text-[48px] w-full">
        <p className="leading-[43.2px] whitespace-pre-wrap">Проблема</p>
      </div>
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[26.88px] relative shrink-0 text-[19.2px] w-full whitespace-pre-wrap">
        <p className="mb-0">В компании работают разъездные сотрудники, которые постоянно в дороге. Их задача своевременно провести тех. обслуживание по заявке. Сотрудник сам определяет оптимальный для себя маршрут, на основе знаний дорожной обстановки.</p>
        <p className="mb-0">{`Проблема заключается  в том, что существующий инструмент не дает пользователю наглядной информации о перемещениях сотрудника за  одну рабочую смену. Как следствие это не дает проследить реальную загруженность и оценить эффективность работы сотрудников., а также определить корректность выбранных маршрутов сотрудников. Компания компенсирует затраты сотрудников на использование личного транспорта., поэтому руководителю важно отслеживать перемещения.`}</p>
        <p>Также требуется корректировать маршруты из-за изменения дорожной обстановки и отсутствия точных данных о местоположении объектов обслуживания.</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center mb-[-0.01px] py-[24px] relative shrink-0 w-[1583px]" data-name="Container">
      <div className="flex flex-col font-['Geist:Black',sans-serif] font-black justify-center leading-[0] relative shrink-0 text-[#191919] text-[48px] w-full">
        <p className="leading-[43.2px] whitespace-pre-wrap">Исследования</p>
      </div>
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#191919] text-[19.2px] w-full whitespace-pre-wrap">
        <p className="leading-[26.88px] mb-0">Исследования</p>
        <p className="leading-[26.88px] mb-0">Провел несколько интервью с пользователями, чтобы узнать об их оптые работы с текущим инструментов. На интервью старался узнать как происходит процесс сейчас, с какими сложностями сталкиваются.</p>
        <p className="leading-[26.88px] mb-0">В результате, получил ответы:</p>
        <ul className="list-disc mb-0">
          <li className="mb-0 ms-[28.799999999999997px]">
            <span className="leading-[26.88px]">Что делаем? Инструмент для отображения маршрутов сотрудников</span>
          </li>
          <li className="mb-0 ms-[28.799999999999997px]">
            <span className="leading-[26.88px]">Кто этим будет пользоваться? Руководители, тех. поддержка и сотрудники</span>
          </li>
          <li className="mb-0 ms-[28.799999999999997px]">
            <span className="leading-[26.88px]">Как это должно работать? Руководитель может выбрать сотрудника и дату и просмотреть на карте маршрут сотрудника, тех поддержка может просмотреть реестр маршрутов сотруднику за период времени с возможностью переход к карте.</span>
          </li>
          <li className="ms-[28.799999999999997px]">
            <span className="leading-[26.88px]">{`Почему это важно?  Компания сможет сократить расходы на компенсацию.`}</span>
          </li>
        </ul>
        <p className="leading-[26.88px]">Провел анализ конкурентов</p>
      </div>
      <div className="aspect-[1067/496] relative shrink-0 w-full" data-name="Untitled 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUntitled1} />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center mb-[-0.01px] py-[24px] relative shrink-0 w-[1583px]" data-name="Container">
      <div className="flex flex-col font-['Geist:Black',sans-serif] font-black justify-center leading-[0] relative shrink-0 text-[#191919] text-[48px] w-full">
        <p className="leading-[43.2px] whitespace-pre-wrap">Карта</p>
      </div>
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[26.88px] relative shrink-0 text-[#191919] text-[19.2px] w-full whitespace-pre-wrap">
        <p className="mb-0">{`Так как опыта работы с  картами у меня не было, Я постарался углубиться в основные возможности API. Как результат это помогла определить основные инструменты для взаимодействия с картами`}</p>
        <p>Редактор стилей карты помог собрать макет Карты из векторных слоев</p>
      </div>
      <div className="aspect-[2048/467] relative shrink-0 w-full" data-name="image 5">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage5} />
      </div>
      <div className="aspect-[3843/2570] relative shrink-0 w-full" data-name="image 6">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center mb-[-0.01px] py-[24px] relative shrink-0 w-[1583px]" data-name="Container">
      <div className="flex flex-col font-['Geist:Black',sans-serif] font-black justify-center leading-[0] relative shrink-0 text-[#191919] text-[48px] w-full">
        <p className="leading-[43.2px] whitespace-pre-wrap">Проектирование</p>
      </div>
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#191919] text-[19.2px] w-full">
        <p className="leading-[26.88px] whitespace-pre-wrap">В проектировании использовал компоненты дизайн-системы AntDesign. Было решено выделить два представления: Реестр и Карта. Это решение обусловлено разными потребностями пользователей (руководители и тех. поддержка). Переход между представлениями происходит по переключателю</p>
      </div>
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#191919] text-[19.2px] w-full">
        <p className="leading-[26.88px] whitespace-pre-wrap">Проектирование происходило в несколько итераций: каждую неделю я шел к пользователям с демонстрацией основных сценариев. На встречах получал обратную связь и возвращался к проектированию.</p>
      </div>
      <div className="aspect-[1991/1001] relative shrink-0 w-full" data-name="image 7">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage7} />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center mb-[-0.01px] py-[24px] relative shrink-0 w-[1583px]" data-name="Container">
      <div className="flex flex-col font-['Geist:Black',sans-serif] font-black justify-center leading-[0] min-w-full relative shrink-0 text-[#191919] text-[48px] w-[min-content]">
        <p className="leading-[43.2px] whitespace-pre-wrap">Прототип</p>
      </div>
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[26.88px] min-w-full relative shrink-0 text-[#191919] text-[19.2px] w-[min-content] whitespace-pre-wrap">
        <p className="mb-0">На встречах я показывал интерактивный прототип, потому что это самый наглядный метод демонстрации.</p>
        <p>Во время разработки прототипа было принято решение использовать Variables для отображения сложной логики.</p>
      </div>
      <div className="h-[733px] relative shrink-0 w-[813px]" data-name="image 8">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage8} />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center mb-[-0.01px] py-[24px] relative shrink-0 text-[#191919] w-[1583px]" data-name="Container">
      <div className="flex flex-col font-['Geist:Black',sans-serif] font-black justify-center leading-[0] relative shrink-0 text-[48px] w-full">
        <p className="leading-[43.2px] whitespace-pre-wrap">Выводы</p>
      </div>
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[19.2px] w-full">
        <p className="leading-[26.88px] whitespace-pre-wrap">Благодаря постоянному общения с пользователями удалось спроектировать достаточно простой и удобный интерфейс.</p>
      </div>
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[26.88px] relative shrink-0 text-[19.2px] w-full whitespace-pre-wrap">
        <p className="mb-0">{`Результат оправдал все ожидания. Сервис продолжает развиваться обрастать функционалом, и принципы заложенные в начале пути помогают в этом. `}</p>
        <p>Благодаря сервису компания сэкономила не один вагон с печеньками)</p>
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

function Container11() {
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
      <Container11 />
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
    <div className="bg-white relative size-full" data-name="Desktop - 3">
      <Frame />
    </div>
  );
}