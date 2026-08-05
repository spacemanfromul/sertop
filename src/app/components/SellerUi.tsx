import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function SellerCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border-0 bg-white md:border md:border-[#d8dde4] ${className}`}>{children}</section>;
}

export function SellerButton({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`h-11 rounded-xl bg-[#95a6b62d] px-4 text-[15px] font-semibold leading-6 text-[#001122f2] transition-colors hover:bg-[#7c9bb53a] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
