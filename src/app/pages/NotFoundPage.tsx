import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import bathBackground from '../../assets/not-found-background.png';
import underwaterBackground from '../../assets/not-found-background-underwater.png';
import scooterBackground from '../../assets/not-found-background-scooter.png';

const backgrounds = [bathBackground, underwaterBackground, scooterBackground];

export default function NotFoundPage() {
  const [backgroundImage] = useState(
    () => backgrounds[Math.floor(Math.random() * backgrounds.length)],
  );

  useEffect(() => {
    const previousTitle = document.title;
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousRobots = robots?.content;

    document.title = 'Страница не найдена — Сергей Топорков';
    robots?.setAttribute('content', 'noindex, nofollow');

    return () => {
      document.title = previousTitle;
      if (robots && previousRobots) robots.content = previousRobots;
    };
  }, []);

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[#191c1d] px-4 py-4 font-['Google Sans',sans-serif] md:px-12 md:py-12">
      <img
        src={backgroundImage}
        alt=""
        className="absolute inset-0 size-full object-cover object-center"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/15 to-transparent" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-[1280px]">
        <section className="w-full max-w-[620px] bg-transparent p-0 text-left text-white">
          <h1 className="text-[40px] font-medium leading-[1.05] tracking-[-0.8px] md:text-[58px] md:tracking-[-1.5px]">
            404
          </h1>
          <p className="mt-4 max-w-[520px] text-[24px] font-medium leading-[1.25] text-white md:text-[30px]">
            Такой страницы нет, а дешевые билеты есть на Aviasales
          </p>
          <a
            href="https://www.aviasales.ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-14 items-center gap-2 rounded-full bg-white px-6 text-lg font-medium text-[#191c1d] transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            За билетами
            <ArrowRight className="size-5" />
          </a>
        </section>
      </div>
    </main>
  );
}
