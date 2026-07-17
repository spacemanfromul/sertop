import { MapPin } from 'lucide-react';
import TagBadge from '../components/TagBadge';
import portraitImage from '../../imports/Hero/58b059b979a564c3f70557c331cb54b5e258dd48.jpg';
import backgroundImage from '../../assets/og-preview-background.png';

function HeroPhotoCard() {
  return (
    <div className="relative z-10 h-[320px] w-[320px] shrink-0 overflow-hidden rounded-[28px] bg-[#e9f1ff]">
      <img
        src={portraitImage}
        alt=""
        className="absolute size-full object-cover"
        fetchPriority="high"
        decoding="sync"
      />
    </div>
  );
}

export default function OgPreviewPage() {
  return (
    <main
      className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-white px-10 font-['Google Sans',sans-serif] text-[#191c1d]"
      data-og-preview
    >
      <img src={backgroundImage} alt="" className="absolute inset-0 size-full object-cover" decoding="sync" />

      <div className="relative z-10 flex w-full items-center gap-12 overflow-hidden rounded-[44px] border border-white/40 bg-white/10 p-8 shadow-[inset_1px_1px_0_rgba(255,255,255,0.65),inset_-1px_-1px_0_rgba(255,255,255,0.12),0_24px_80px_rgba(54,50,48,0.16)] backdrop-blur-[18px] backdrop-saturate-150">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-px rounded-[43px] bg-[linear-gradient(120deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.08)_34%,transparent_58%,rgba(255,255,255,0.12)_100%)]"
        />
        <HeroPhotoCard />

        <section className="relative z-10 flex h-[320px] min-w-0 flex-1 flex-col justify-end">
          <h1 className="text-[74px] font-medium leading-[0.98] tracking-[-2.5px]">
            Сергей Топорков
          </h1>
          <p className="mt-4 text-[38px] font-medium leading-[1.2] text-[#5f6368]">
            Продуктовый дизайнер B2B
          </p>
          <div className="mt-4 flex gap-3">
            <TagBadge
              tone="ai"
              icon={<MapPin className="size-5" strokeWidth={2.2} />}
              className="h-14 px-5 text-[22px]"
            >
              Санкт-Петербург
            </TagBadge>
            <TagBadge tone="b2b" className="h-14 px-5 text-[22px]">
              3 года опыта
            </TagBadge>
          </div>
        </section>
      </div>
    </main>
  );
}
