import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AboutMe from '../components/AboutMe';
import Modal from '../components/Modal';
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
      <Projects onProjectClick={setActiveModal} />
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

function AdminPanelContent() {
  return (
    <div className="w-full">
      <div className="content-stretch flex flex-col gap-4 items-start leading-[0] relative shrink-0 text-[#191919] mb-8">
        <div className="flex flex-col font-['Google Sans',sans-serif] font-black justify-center relative shrink-0 text-4xl md:text-6xl lg:text-[96px] w-full">
          <p className="leading-[0.9] whitespace-pre-wrap">Админ панель </p>
        </div>
        <div className="flex flex-col font-['Google Sans',sans-serif] font-medium justify-center relative shrink-0 text-base md:text-[19.2px] whitespace-nowrap">
          <p className="leading-[26.88px]">Инструмент для релиз инженера</p>
        </div>
      </div>

      <div className="w-full mb-8">
        <div className="relative overflow-clip rounded-lg md:rounded-[32px] bg-[#c5a5e4] h-[400px] md:h-[900px]">
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
            <img alt="Админ панель" className="max-w-full max-h-full object-contain" src={imgImage3} loading="lazy" decoding="async" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1583px] mx-auto">
        <Section title="Контекст">
          <p className="mb-0 whitespace-pre-wrap">Внутреннее веб-приложение для релиз-инженеров, которое используется для подготовки и выпуска новых версий мобильного приложения.</p>
          <p className="mb-0 whitespace-pre-wrap">Инструмент объединяет:</p>
          <ul className="list-disc mb-0">
            <li className="mb-0 ms-[28.8px]"><span>управление версиями</span></li>
            <li className="mb-0 ms-[28.8px]"><span>конфигурацию релиза</span></li>
            <li className="ms-[28.8px]"><span>контроль статусов</span></li>
          </ul>
          <p className="whitespace-pre-wrap">Аудитория — релиз-инженеры и DevOps-специалисты.</p>
        </Section>

        <Section title="Проблема">
          <p className="mb-0 whitespace-pre-wrap">Существующий процесс релизов был частично ручным и фрагментированным:</p>
          <ul className="list-disc mb-0">
            <li className="mb-0 ms-[28.8px]"><span>данные хранились в разных системах</span></li>
            <li className="mb-0 ms-[28.8px]"><span>не было прозрачного статуса релиза</span></li>
            <li className="ms-[28.8px]"><span>высокий риск человеческой ошибки</span></li>
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
          <div className="w-full"><img alt="Разработка" className="w-full h-auto" src={imgImage10} loading="lazy" decoding="async" /></div>
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
            <li className="mb-0 ms-[28.8px]"><span>добавить автоматические проверки перед релизом</span></li>
            <li className="mb-0 ms-[28.8px]"><span>интегрировать AI-помощника для анализа рисков</span></li>
            <li className="ms-[28.8px]"><span>улучшить аналитику по релизам</span></li>
          </ul>
        </Section>

        <div className="w-full mb-8"><img alt="Скриншот 1" className="w-full h-auto" src={imgImage12} loading="lazy" decoding="async" /></div>
        <div className="w-full mb-8"><img alt="Скриншот 2" className="w-full h-auto" src={imgImage14} loading="lazy" decoding="async" /></div>
      </div>
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
