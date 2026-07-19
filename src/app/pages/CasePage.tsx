import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import Header from '../components/Header';
import { setJsonLd } from '../utils/structuredData';
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
    setPropertyTag('og:type', 'website');
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

    const caseName = document.querySelector<HTMLElement>('main h1')?.textContent
      ?.replace(/\s+/g, ' ')
      .trim() || currentCase.title;

    const removeCreativeWorkSchema = setJsonLd('creative-work', {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: caseName,
      description: currentCase.description,
      url: currentCase.canonical,
      image: 'https://toporkovdsgnr.ru/og-image.jpg',
      author: {
        '@type': 'Person',
        name: 'Сергей Топорков',
      },
    });

    const removeBreadcrumbSchema = setJsonLd('breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Главная',
          item: 'https://toporkovdsgnr.ru/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Кейсы',
          item: 'https://toporkovdsgnr.ru/#cases',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: caseName,
          item: currentCase.canonical,
        },
      ],
    });

    return () => {
      removeCreativeWorkSchema();
      removeBreadcrumbSchema();
    };
  }, [currentCase]);

  return (
    <div className="min-h-screen bg-white">
      <div className="hidden md:block">
        <Header showAvatar />
      </div>

      <Link
        to="/"
        aria-label="Вернуться на главную"
        className="fixed left-4 top-4 z-50 flex size-12 items-center justify-center rounded-full border border-black/10 bg-white/90 text-[#191c1d] shadow-[0_6px_20px_rgba(25,28,29,0.16)] backdrop-blur-md transition-transform active:scale-95 md:hidden"
      >
        <ArrowLeft className="size-5" strokeWidth={2.2} />
      </Link>

      <main className="px-4 pb-8 pt-20 md:px-8 md:pb-12 md:pt-32">
        {currentCase.content()}
      </main>
    </div>
  );
}
