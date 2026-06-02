import imgContainer from "./02203f4f61aa30d19120aa7df16dae07061dd01f.png";
import imgFrame270989294 from "./a83d6113c61a6a5429e4b85d05513e17e34b7d3a.png";
import imgContainer1 from "./5dfcbac1716ed4b7f6d200a9779b11a60077d470.png";

function Container() {
  return (
    <div className="aspect-[444.5/444.5] relative rounded-[28px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-col justify-center size-full">
        <div className="relative size-full" />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="flex-[1_0_0] min-h-px relative rounded-[28px] w-full" data-name="Container">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[28px]">
        <img alt="" className="absolute h-[101.33%] left-[-20.88%] max-w-none top-[-1.45%] w-[140.1%]" src={imgContainer} />
      </div>
      <div className="flex flex-col justify-center size-full">
        <div className="relative size-full" />
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] h-full items-start justify-center min-w-px relative">
      <Container />
      <Container1 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="aspect-[320/510] flex-[1_0_0] min-w-px relative rounded-[28px]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[28px]">
        <img alt="" className="absolute h-[230.2%] left-[-71.83%] max-w-none top-[-65.15%] w-[243.84%]" src={imgFrame270989294} />
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame3 />
      </div>
      <Frame4 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame5 />
    </div>
  );
}

function Container2() {
  return (
    <div className="aspect-[684/664] relative rounded-[28px] shrink-0 w-full" data-name="Container">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[28px]">
        <img alt="" className="absolute h-[211.04%] left-[-18.53%] max-w-none top-[-26.95%] w-[149.29%]" src={imgContainer1} />
      </div>
      <div className="flex flex-col justify-center size-full">
        <div className="relative size-full" />
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Google_Sans_Flex:Medium','Noto_Sans:Medium',sans-serif] font-medium justify-center leading-[0] min-w-px not-italic relative text-[#191c1d] text-[20px] whitespace-pre-wrap" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        <p className="leading-[26px] mb-0">{`Вне работы люблю исследовать этот мир, экстремальный отдых `}</p>
        <p className="leading-[26px]">и 3D-печать. Это помагает восстановить силы и набраться новыми идеями.</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col h-[144px] items-start justify-center relative shrink-0 w-full">
      <Frame2 />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative size-full">
      <Frame6 />
      <Container2 />
      <Frame1 />
    </div>
  );
}