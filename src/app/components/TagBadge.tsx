import type { ReactNode } from 'react';

export type TagBadgeTone = 'neutral' | 'web' | 'b2b' | 'data' | 'ai' | 'mobile';

type TagBadgeProps = {
  children: ReactNode;
  tone?: TagBadgeTone;
  size?: 'sm' | 'lg';
  icon?: ReactNode;
  className?: string;
};

const toneClasses: Record<TagBadgeTone, string> = {
  neutral: 'bg-white/92 text-[#191c1d]',
  web: 'bg-[#fafbec] text-[#52520f]',
  b2b: 'bg-[#eaf9ec] text-[#0f5223]',
  data: 'bg-[#f9eaea] text-[#52170f]',
  ai: 'bg-[#e8f0ff] text-[#0b57d0]',
  mobile: 'bg-[#eee8f9] text-[#490f52]',
};

const sizeClasses = {
  sm: "h-8 px-3 text-sm font-medium leading-5",
  lg: "h-12 px-4 text-[24px] font-bold leading-[48px] tracking-[-0.5px] md:h-16 md:px-4 md:text-[32px] md:leading-[64px] md:tracking-[-1px]",
};

export default function TagBadge({
  children,
  tone = 'neutral',
  size = 'sm',
  icon,
  className = '',
}: TagBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full font-['Google Sans',sans-serif] tracking-[0]",
        icon ? 'gap-1.5' : '',
        toneClasses[tone],
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {icon}
      {children}
    </span>
  );
}
