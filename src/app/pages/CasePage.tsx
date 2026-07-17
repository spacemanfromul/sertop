import { useEffect } from 'react';
import Header from '../components/Header';
import {
  AdminPanelContent,
  ChallengesContent,
  PushupCounterContent,
  RoutesContent,
} from './HomePage';

export type CaseSlug = 'releases' | 'routes' | 'pushup-counter' | 'design-challenges';

const cases: Record<CaseSlug, {
  title: string;
  description: string;
  canonical: string;
  content: () => React.ReactNode;
}> = {
  releases: {
    title: 'Кейс: управление релизами в админ-панели — Сергей Топорков',
    description: 'Кейс о проектировании админ-панели для управления ветками, версиями, beta-сборками и группами пользователей.',
    canonical: 'https://toporkovdsgnr.ru/cases/releases',
    content: () => <AdminPanelContent />,
  },
  routes: {
    title: 'Кейс: система анализа маршрутов — Сергей Топорков',
    description: 'Кейс о проектировании B2B-интерфейса для анализа маршрутов, пробега, заявок, геозон и спорных ситуаций на карте и в таблицах.',
    canonical: 'https://toporkovdsgnr.ru/cases/routes',
    content: () => <RoutesContent />,
  },
  'pushup-counter': {
    title: 'Кейс: ML-счётчик отжиманий — Сергей Топорков',
    description: 'Pet project: Android-приложение с ML-счётчиком отжиманий, распознаванием движения через камеру и ежедневным челленджем.',
    canonical: 'https://toporkovdsgnr.ru/cases/pushup-counter',
    content: () => <PushupCounterContent />,
  },
  'design-challenges': {
    title: 'Дизайн-челленджи — Сергей Топорков',
    description: 'UI/UX-челленджи, эксперименты и личные проекты для развития продуктового дизайна, интерфейсов и прототипирования.',
    canonical: 'https://toporkovdsgnr.ru/cases/design-challenges',
    content: () => <ChallengesContent />,
  },
};

export default function CasePage({ slug }: { slug: CaseSlug }) {
  const currentCase = cases[slug];

  useEffect(() => {
    document.title = currentCase.title;

    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const setPropertyTag = (property: string, content: string) => {
      let meta = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    setMetaTag('description', currentCase.description);
    setPropertyTag('og:title', currentCase.title);
    setPropertyTag('og:description', currentCase.description);
    setPropertyTag('og:type', 'article');
    setPropertyTag('og:url', currentCase.canonical);
    setPropertyTag('og:image', 'https://toporkovdsgnr.ru/og-image.jpg');
    setPropertyTag('og:image:width', '1200');
    setPropertyTag('og:image:height', '630');
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', currentCase.title);
    setMetaTag('twitter:description', currentCase.description);
    setMetaTag('twitter:image', 'https://toporkovdsgnr.ru/og-image.jpg');

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = currentCase.canonical;
  }, [currentCase]);

  return (
    <div className="min-h-screen bg-white">
      <Header showAvatar />

      <main className="px-4 pb-8 pt-28 md:px-8 md:pb-12 md:pt-32">
        {currentCase.content()}
      </main>
    </div>
  );
}
