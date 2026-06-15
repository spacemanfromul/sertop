import { MapPin } from 'lucide-react';
import TagBadge from './TagBadge';
import imgContainer from "../../imports/Hero/58b059b979a564c3f70557c331cb54b5e258dd48.jpg";

function formatText(text: string) {
  return text
    .replace(/(^|[\s(])(и|в|во|на|к|ко|с|со|по|для|под|над|от|до|из|у|а|но|за|без|при|о|об|обо)\s+/giu, '$1$2\u00a0')
    .replace(/([A-Za-zА-Яа-яЁё0-9])[-–]([A-Za-zА-Яа-яЁё0-9])/g, '$1\u2011$2');
}

function PhotoCard() {
  const floatingBadgeClass = 'shadow-[0_4px_18px_rgba(0,0,0,0.12)] backdrop-blur-md';

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[300px] overflow-hidden rounded-[20px] md:max-w-[320px] md:rounded-[28px]"
      data-name="Container"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[20px] md:rounded-[28px]">
        <div className="absolute inset-0 rounded-[20px] bg-[#e9f1ff] md:rounded-[28px]" />
        <img
          alt=""
          className="absolute size-full max-w-none rounded-[20px] object-cover md:rounded-[28px]"
          src={imgContainer}
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className="absolute left-3 top-3 z-10 md:left-4 md:top-4">
        <TagBadge tone="ai" icon={<MapPin className="size-3.5" strokeWidth={2.2} />} className={floatingBadgeClass}>
          Санкт-Петербург
        </TagBadge>
      </div>
      <div className="absolute bottom-3 left-3 z-10 md:bottom-4 md:left-4">
        <TagBadge tone="b2b" className={floatingBadgeClass}>
          3 года опыта
        </TagBadge>
      </div>
    </div>
  );
}

function ProfileCaption() {
  return (
    <div className="mx-auto flex flex-col items-center gap-1 text-center font-['Google Sans',sans-serif] text-[#191c1d]">
      <p className="text-[22px] font-medium leading-[28px] tracking-[-0.2px] md:text-[28px] md:leading-[34px]">
        Сергей Топорков
      </p>
      <p className="text-base font-medium leading-[22px] text-[#747775] md:text-xl md:leading-[28px]">
        Продуктовый дизайнер
      </p>
    </div>
  );
}

function HeroText() {
  return (
    <div className="mx-auto flex max-w-[860px] flex-col items-center gap-3 text-center">
      <h1 className="font-['Google Sans',sans-serif] text-[40px] font-medium leading-[44px] tracking-[-0.5px] text-[#191c1d] md:text-[54px] md:leading-[58px]">
        {formatText('Делаю сложное понятным')}
      </h1>
      <p className="max-w-[680px] font-['Google Sans',sans-serif] text-base font-medium leading-[22px] text-[#191c1d] md:text-[21px] md:leading-[30px]">
        {formatText('Помогаю превращать сложные B2B-процессы, таблицы и данные в удобные продукты для ежедневной работы')}
      </p>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      className="mx-auto flex w-full max-w-[1392px] flex-col items-center gap-5 px-4 py-4 md:gap-6 md:px-8 md:py-8"
      data-name="HERO"
    >
      <PhotoCard />
      <div className="flex flex-col items-center gap-5 md:gap-6">
        <ProfileCaption />
        <HeroText />
      </div>
    </section>
  );
}
