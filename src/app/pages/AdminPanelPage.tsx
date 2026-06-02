import { Link } from 'react-router';
import { useEffect } from 'react';
import Header from '../components/Header';
import imgImage3 from "figma:asset/88a6e07d56a27f755fa8f667d48d08fa90a211df.png";
import imgImage10 from "figma:asset/458f81f65860ef4f62aaa75b22daf2922cc76789.png";
import imgImage12 from "figma:asset/fc15bc7b37b3d3ad5ea8b0f2cfadea6c69a7ba5e.png";
import imgImage14 from "figma:asset/c40c03fee9e5bb9d86dc88b00dea9b4b0bf29f98.png";

export default function AdminPanelPage() {
  useEffect(() => {
    // SEO метатеги для страницы кейса
    document.title = 'Админ панель - кейс | Сергей Топорков';
    
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

    setMetaTag('description', 'Кейс: Разработка админ-панели для релиз-инженера. UX/UI дизайн сложных B2B систем.');
    setPropertyTag('og:title', 'Админ панель - кейс | Сергей Топорков');
    setPropertyTag('og:description', 'Разработка админ-панели для релиз-инженера');
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

function PageTitle() {
  return (
    <div className="content-stretch flex flex-col gap-4 items-start leading-[0] relative shrink-0 text-[#191919] max-w-[1392px] mx-auto px-4 md:px-8 mb-8">
      <div className="flex flex-col font-['Google Sans',sans-serif] font-black justify-center relative shrink-0 text-4xl md:text-6xl lg:text-[96px] w-full">
        <p className="leading-[0.9] whitespace-pre-wrap">Админ панель </p>
      </div>
      <div className="flex flex-col font-['Google Sans',sans-serif] font-medium justify-center relative shrink-0 text-base md:text-[19.2px] whitespace-nowrap">
        <p className="leading-[26.88px]">Инструмент для релиз инженера</p>
      </div>
    </div>
  );
}

function HeroImage() {
  return (
    <div className="w-full max-w-[1392px] mx-auto px-4 md:px-8 mb-8">
      <div className="relative overflow-clip rounded-lg md:rounded-[32px] bg-[#c5a5e4] h-[400px] md:h-[900px]">
        <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
          <img 
            alt="Админ панель" 
            className="max-w-full max-h-full object-contain" 
            src={imgImage3} 
          />
        </div>
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

function Content() {
  return (
    <div className="w-full max-w-[1583px] mx-auto px-4 md:px-8">
      <Section title="Контекст">
        <p className="mb-0 whitespace-pre-wrap">Внутреннее веб-приложение для релиз-инженеров, которое используется для подготовки и выпуска новых версий мобильного приложения.</p>
        <p className="mb-0 whitespace-pre-wrap">Инструмент объединяет:</p>
        <ul className="list-disc mb-0">
          <li className="mb-0 ms-[28.8px]">
            <span>управление версиями</span>
          </li>
          <li className="mb-0 ms-[28.8px]">
            <span>конфигурацию релиза</span>
          </li>
          <li className="ms-[28.8px]">
            <span>контроль статусов</span>
          </li>
        </ul>
        <p className="whitespace-pre-wrap">Аудитория — релиз-инженеры и DevOps-специалисты.</p>
      </Section>

      <Section title="Проблема">
        <p className="mb-0 whitespace-pre-wrap">Существующий процесс релизов был частично ручным и фрагментированным:</p>
        <ul className="list-disc mb-0">
          <li className="mb-0 ms-[28.8px]">
            <span>данные хранились в разных системах</span>
          </li>
          <li className="mb-0 ms-[28.8px]">
            <span>не было прозрачного статуса релиза</span>
          </li>
          <li className="ms-[28.8px]">
            <span>высокий риск человеческой ошибки</span>
          </li>
        </ul>
        <p className="whitespace-pre-wrap">Цель — создать единый веб-инструмент для управления релизами с понятной логикой и минимизацией ошибок. Сократить время для поиска и установки мобильного приложения для сотрудников</p>
      </Section>

      <Section title="Моя роль">
        <p className="mb-0 whitespace-pre-wrap">Вёл дизайн веб-интерфейса</p>
        <p className="mb-0 whitespace-pre-wrap">Работал в связке: дизайнер + продакт + DevOps + backend</p>
        <p className="mb-0 whitespace-pre-wrap">Формулировал гипотезы по упрощению сценариев</p>
        <p className="mb-0 whitespace-pre-wrap">Проектировал user flow и ключевые состояния</p>
        <p className="mb-0 whitespace-pre-wrap">Развивал компоненты дизайн-системы</p>
        <p className="whitespace-pre-wrap">Сопровождал реализацию</p>
      </Section>

      <Section title="Исследования">
        <p className="whitespace-pre-wrap">Провёл мини-интервью с релиз-инженерами, а также интервью с пользователями мобильного приложения. По резльтатам интервью были подтверждены гипотезы. Получили окончательный ответ о ценности данного функционала.</p>
      </Section>

      <Section title="Разработка">
        <p className="mb-0 whitespace-pre-wrap">Разработал информационную архитектуру</p>
        <p className="mb-0 whitespace-pre-wrap">Создал wireframes для ключевых сценариев</p>
        <p className="mb-4 whitespace-pre-wrap">Провёл валидацию сценариев с пользователями</p>
        <div className="w-full">
          <img alt="Разработка" className="w-full h-auto" src={imgImage10} />
        </div>
      </Section>

      <Section title="Результат">
        <p className="mb-0 whitespace-pre-wrap">Снизилось количество ошибок при подготовке релиза</p>
        <p className="mb-0 whitespace-pre-wrap">Процесс стал прозрачным для смежных команд</p>
        <p className="mb-0 whitespace-pre-wrap">Упростился онбординг новых релиз-инженеров</p>
        <p className="mb-0 whitespace-pre-wrap">Сценарий выпуска стал последовательным и предсказуемым</p>
        <p className="whitespace-pre-wrap">Раскатка и остановка бета-версий стал более простым</p>
      </Section>

      <Section title="Что дальше">
        <p className="mb-0 whitespace-pre-wrap">В дальнейшем можно:</p>
        <ul className="list-disc">
          <li className="mb-0 ms-[28.8px]">
            <span>добавить автоматические проверки перед релизом</span>
          </li>
          <li className="mb-0 ms-[28.8px]">
            <span>интегрировать AI-помощника для анализа рисков</span>
          </li>
          <li className="ms-[28.8px]">
            <span>улучшить аналитику по релизам</span>
          </li>
        </ul>
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