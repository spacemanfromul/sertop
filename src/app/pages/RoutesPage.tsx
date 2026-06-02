import { useEffect } from 'react';
import Header from '../components/Header';
import imgImage4 from "figma:asset/1491e78767295cee8997920ba3fd00bdc5d5ecd3.png";
import imgUntitled1 from "figma:asset/135baa3a3201b07dd545e70bc419fb50a67cd083.jpg";
import imgImage5 from "figma:asset/e8c846511aa03374308d4d0bdc22c5f832e00a3a.jpg";
import imgImage6 from "figma:asset/9155f2a5dd6b67a82f2e3b2e464f250a0d69327a.jpg";
import imgImage7 from "figma:asset/a8f4a43bc65a3564df1b44fdf7f8eaf424c9c6de.jpg";
import imgImage8 from "figma:asset/6f2a29bf14bfeaf82e47e74b71c327ae0a63e3dd.png";

function PageTitle() {
  return (
    <div className="content-stretch flex flex-col gap-4 items-start leading-[0] relative shrink-0 text-[#191919] max-w-[1392px] mx-auto px-4 md:px-8 mb-8">
      <div className="flex flex-col font-['Google Sans',sans-serif] font-black justify-center relative shrink-0 text-4xl md:text-6xl lg:text-[96px] w-full">
        <p className="leading-[0.9] whitespace-pre-wrap">Маршруты </p>
      </div>
      <div className="flex flex-col font-['Google Sans',sans-serif] font-medium justify-center relative shrink-0 text-base md:text-[19.2px] whitespace-nowrap">
        <p className="leading-[19.2px]">Сервис отображения истории поездок сотрудников на карте</p>
      </div>
    </div>
  );
}

function HeroImage() {
  return (
    <div className="w-full max-w-[1392px] mx-auto px-4 md:px-8 mb-8">
      <div className="relative overflow-clip rounded-lg md:rounded-[32px] bg-[#84c4a5] h-[400px] md:h-[900px]">
        <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
          <img 
            alt="Маршруты" 
            className="max-w-full max-h-full object-contain" 
            src={imgImage4} 
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="content-stretch flex flex-col gap-4 items-start py-6 md:py-[24px] relative shrink-0 text-[#191919] w-full">
      <div className="flex flex-col font-['Google Sans',sans-serif] font-black justify-center leading-[0] relative shrink-0 text-3xl md:text-[48px] w-full">
        <p className="leading-[43.2px]">{title}</p>
      </div>
      <div className="flex flex-col font-['Google Sans',sans-serif] font-medium justify-center leading-[26.88px] relative shrink-0 text-base md:text-[19.2px] w-full">
        {children}
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="w-full max-w-[1583px] mx-auto px-4 md:px-8">
      <Section title="Проблема">
        <p className="mb-0 whitespace-pre-wrap">В компании работают разъездные сотрудники, которые постоянно в дороге. Их задача своевременно провести тех. обслуживание по заявке. Сотрудник сам определяет оптимальный для себя маршрут, на основе знаний дорожной обстановки.</p>
        <p className="mb-0 whitespace-pre-wrap">Проблема заключается  в том, что существующий инструмент не дает пользователю наглядной информации о перемещениях сотрудника за  одну рабочую смену. Как следствие это не дает проследить реальную загруженность и оценить эффективность работы сотрудников., а также определить корректность выбранных маршрутов сотрудников. Компания компенсирует затраты сотрудников на использование личного транспорта., поэтому руководителю важно отслеживать перемещения.</p>
        <p className="whitespace-pre-wrap">Также требуется корректировать маршруты из-за изменения дорожной обстановки и отсутствия точных данных о местоположении объектов обслуживания.</p>
      </Section>

      <Section title="Исследования">
        <p className="mb-0 whitespace-pre-wrap">Исследования</p>
        <p className="mb-0 whitespace-pre-wrap">Провел несколько интервью с пользователями, чтобы узнать об их оптые работы с текущим инструментов. На интервью старался узнать как происходит процесс сейчас, с какими сложностями сталкиваются.</p>
        <p className="mb-0 whitespace-pre-wrap">В результате, получил ответы:</p>
        <ul className="list-disc mb-0">
          <li className="mb-0 ms-[28.8px]">
            <span>Что делаем? Инструмент для отображения маршрутов сотрудников</span>
          </li>
          <li className="mb-0 ms-[28.8px]">
            <span>Кто этим будет пользоваться? Руководители, тех. поддержка и сотрудники</span>
          </li>
          <li className="mb-0 ms-[28.8px]">
            <span>Как это должно работать? Руководитель может выбрать сотрудника и дату и просмотреть на карте маршрут сотрудника, тех поддержка может просмотреть реестр маршрутов сотруднику за период времени с возможностью переход к карте.</span>
          </li>
          <li className="ms-[28.8px]">
            <span>Почему это важно?  Компания сможет сократить расходы на компенсацию.</span>
          </li>
        </ul>
        <p className="mb-4 whitespace-pre-wrap">Провел анализ конкурентов</p>
        <div className="w-full">
          <img alt="Анализ конкурентов" className="w-full h-auto" src={imgUntitled1} loading="lazy" decoding="async" />
        </div>
      </Section>

      <Section title="Карта">
        <p className="mb-0 whitespace-pre-wrap">Так как опыта работы с  картами у меня не было, Я постарался углубиться в основные возможности API. Как результат это помогла определить основные инструменты для взаимодействия с картами</p>
        <p className="mb-4 whitespace-pre-wrap">Редактор стилей карты помог собрать макет Карты из векторных слоев</p>
        <div className="w-full mb-4">
          <img alt="Кара - стили" className="w-full h-auto" src={imgImage5} loading="lazy" decoding="async" />
        </div>
        <div className="w-full">
          <img alt="Карта - дизайн" className="w-full h-auto" src={imgImage6} loading="lazy" decoding="async" />
        </div>
      </Section>

      <Section title="Проектирование">
        <p className="mb-0 whitespace-pre-wrap">В проектировании использовал компоненты дизайн-системы AntDesign. Было решено выделить два представления: Реестр и Карта. Это решение обусловлено разными потребностями пользователей (руководители и тех. поддержка). Переход между представлениями происходит по переключателю</p>
        <p className="mb-4 whitespace-pre-wrap">Проектирование происходило в несколько итераций: каждую неделю я шел к пользователям с демонстрацией основных сценариев. На встречах получал обратную связь и возвращался к проектированию.</p>
        <div className="w-full">
          <img alt="Проектирование" className="w-full h-auto" src={imgImage7} loading="lazy" decoding="async" />
        </div>
      </Section>

      <Section title="Прототип">
        <p className="mb-0 whitespace-pre-wrap">На встречах я показывал интерактивный прототип, потому что это самый наглядный метод демонстрации.</p>
        <p className="mb-4 whitespace-pre-wrap">Во время разработки прототипа было принято решение использовать Variables для отображения сложной логики.</p>
        <div className="w-full flex justify-center">
          <img alt="Прототип" className="max-w-full h-auto" src={imgImage8} loading="lazy" decoding="async" />
        </div>
      </Section>

      <Section title="Выводы">
        <p className="mb-0 whitespace-pre-wrap">Благодаря постоянному общения с пользователями удалось спроектировать достаточно простой и удобный интерфейс.</p>
        <p className="mb-0 whitespace-pre-wrap">Результат оправдал все ожидания. Сервис продолжает развиваться обрастать функционалом, и принципы заложенные в начале пути помогают в этом. </p>
        <p className="whitespace-pre-wrap">Благодаря сервису компания сэкономила не один вагон с печеньками)</p>
      </Section>
    </div>
  );
}

function Footer() {
  return (
    <div className="content-start flex flex-wrap items-start justify-center pb-10 pt-[104px] relative shrink-0 w-full max-w-[1392px] mx-auto px-4 md:px-8">
      <a
        href="https://t.me/spacemanfromul"
        target="_blank"
        rel="noopener noreferrer"
        className="content-stretch flex h-[56px] items-center justify-center min-h-[40px] min-w-[80px] px-[25.67px] py-[16px] relative rounded-[100px] shrink-0 bg-[#0b57d0] hover:bg-[#0842a0] transition-colors"
      >
        <div className="flex flex-col font-['Google Sans',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white tracking-[0.1px] whitespace-nowrap">
          <p className="leading-[24px]">Связаться</p>
        </div>
      </a>
    </div>
  );
}

function ThankYou() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[0.19px] pt-[31px] relative shrink-0 w-full max-w-[1392px] mx-auto px-4 md:px-8">
      <div className="flex flex-col font-['Google Sans',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999] text-[13px] text-center whitespace-nowrap">
        <p className="leading-[18.2px]">Спасибо за просмотр)</p>
      </div>
    </div>
  );
}

export default function RoutesPage() {
  useEffect(() => {
    // SEO метатеги для страницы кейса
    document.title = 'Маршруты - кейс | Сергей Топорков';
    
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

    setMetaTag('description', 'Кейс: Разработка сервиса для отображения истории поездок сотрудников на карте. UX/UI дизайн B2B систем.');
    setPropertyTag('og:title', 'Маршруты - кейс | Сергей Топорков');
    setPropertyTag('og:description', 'Сервис отображения истории поездок сотрудников на карте');
  }, []);

  return (
    <div className="bg-white min-h-screen w-full pt-8">
      <Header showAvatar={true} />
      <PageTitle />
      <HeroImage />
      <Content />
      <Footer />
      <ThankYou />
    </div>
  );
}
