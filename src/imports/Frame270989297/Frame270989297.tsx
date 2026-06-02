import svgPaths from "./svg-pspr5uf36z";

function MaskGroup() {
  return (
    <div className="absolute left-0 size-[70px] top-0" data-name="Mask group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 70 70">
        <g id="Mask group">
          <mask height="70" id="mask0_52_433" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="70" x="0" y="0">
            <circle cx="35" cy="35" fill="var(--fill-0, #D9D9D9)" id="Ellipse 3" r="35" />
          </mask>
          <g mask="url(#mask0_52_433)">
            <path d={svgPaths.pe8a5d80} fill="var(--fill-0, #B1FFC0)" id="Rectangle 1" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="relative size-full">
      <div className="absolute left-0 size-[70px] top-0">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 70 70">
          <circle cx="35" cy="35" fill="var(--fill-0, white)" id="Ellipse 2" r="35" />
        </svg>
      </div>
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Google_Sans_Flex:Medium',sans-serif] font-medium justify-center leading-[0] left-[calc(50%-21px)] not-italic text-[#0f5223] text-[20px] top-[35px] whitespace-nowrap" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        <p className="leading-[26px]">10 %</p>
      </div>
      <MaskGroup />
    </div>
  );
}