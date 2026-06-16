import PortfolioVideo from "./PortfolioVideo";
import imgContainer from "../../imports/Frame270989289-4/02203f4f61aa30d19120aa7df16dae07061dd01f.jpg";
import imgFrame270989294 from "../../imports/Frame270989289-4/a83d6113c61a6a5429e4b85d05513e17e34b7d3a.jpg";
import imgContainer2 from "../../imports/Frame270989289-4/5dfcbac1716ed4b7f6d200a9779b11a60077d470.jpg";
import videoHobby from "../../imports/_______2026-06-02_122524.mp4";

// Текст
function TextBlock() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Google Sans',sans-serif] font-medium justify-center leading-[0] min-w-px not-italic relative text-[#191c1d] text-[20px] whitespace-pre-wrap">
        <p className="leading-[26px] mb-0">Вне работы люблю исследовать этот мир, экстремальный отдых и&nbsp;3D-печать</p>
        <p className="leading-[26px]">Это помогает восстановить силы и&nbsp;набраться новыми идеями</p>
      </div>
    </div>
  );
}

export default function AboutMe() {
  return (
    <div className="content-stretch relative w-full max-w-[1392px] mx-auto px-4 md:px-8 py-8">
      {/* Мобильная версия (< 1280px) */}
      <div className="flex xl:hidden flex-col gap-[24px] items-center">
        {/* Первая строка: (видео + маленькое фото) + вертикальное фото */}
        <div className="content-stretch flex gap-[12px] md:gap-[24px] items-stretch w-full">
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] md:gap-[24px] items-start justify-center min-w-px">
            <PortfolioVideo
              className="aspect-[444.5/444.5] shrink-0 w-full rounded-[28px]"
              src={videoHobby}
              label="Видео о хобби"
              preload="metadata"
            />
            <div className="flex-[1_0_0] min-h-px relative rounded-[28px] w-full">
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[28px]">
                <img alt="" className="absolute h-[101.33%] left-[-20.88%] max-w-none top-[-1.45%] w-[140.1%]" src={imgContainer} loading="lazy" decoding="async" />
              </div>
              <div className="flex flex-col justify-center size-full">
                <div className="relative size-full" />
              </div>
            </div>
          </div>
          <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
            <div className="aspect-[320/510] flex-[1_0_0] min-w-px relative rounded-[28px]">
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[28px]">
                <img alt="" className="absolute h-[230.2%] left-[-71.83%] max-w-none top-[-65.15%] w-[243.84%]" src={imgFrame270989294} loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>
        {/* Большое фото */}
        <div className="aspect-[684/664] relative rounded-[28px] shrink-0 w-full">
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[28px]">
            <img alt="" className="absolute h-[211.04%] left-[-18.53%] max-w-none top-[-26.95%] w-[149.29%]" src={imgContainer2} loading="lazy" decoding="async" />
          </div>
        </div>
        {/* Текст */}
        <div className="content-stretch flex flex-col h-[144px] items-start justify-center w-full">
          <TextBlock />
        </div>
      </div>

      {/* Десктопная версия (>= 1280px) */}
      <div className="hidden xl:flex content-start flex-wrap gap-[24px] items-start justify-center">
        {/* Левая колонка */}
        <div className="aspect-[684/664] content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-w-px">
          {/* Фото в ряд */}
          <div className="content-stretch flex gap-[24px] items-center shrink-0 w-full">
            <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] h-full items-start justify-center min-w-px">
                <PortfolioVideo
                  className="aspect-[320/320] shrink-0 w-full rounded-[28px]"
                  src={videoHobby}
                  label="Видео о хобби"
                  preload="metadata"
                />
                <div className="flex-[1_0_0] min-h-px relative rounded-[28px] w-full">
                  <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[28px]">
                    <div className="absolute bg-[#e9f1ff] inset-0 rounded-[28px]" />
                    <img alt="" className="absolute max-w-none object-cover rounded-[28px] size-full" src={imgContainer} loading="lazy" decoding="async" />
                  </div>
                </div>
              </div>
            </div>
            <div className="aspect-[134/213] flex-[1_0_0] min-w-px relative rounded-[28px]">
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[28px]">
                <img alt="" className="absolute h-[230.2%] left-[-71.83%] max-w-none top-[-65.15%] w-[243.84%]" src={imgFrame270989294} loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
          {/* Текст */}
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px w-full">
            <TextBlock />
          </div>
        </div>
        {/* Большое фото справа */}
        <div className="aspect-[684/664] flex-[1_0_0] min-w-px relative rounded-[28px]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[28px]">
            <img alt="" className="absolute h-[211.04%] left-[-18.53%] max-w-none top-[-26.95%] w-[149.29%]" src={imgContainer2} loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </div>
  );
}
