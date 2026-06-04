import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="relative flex h-[calc(100dvh-32px)] w-full max-w-[1392px] flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_2px_10px_0_rgba(0,0,0,0.15)] md:h-[calc(100dvh-64px)] md:rounded-[32px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex size-12 items-center justify-center rounded-full bg-white/90 text-[#191c1d] shadow-[0_2px_10px_0_rgba(0,0,0,0.15)] backdrop-blur-sm transition-colors hover:bg-white md:right-8 md:top-6"
          aria-label="Закрыть"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-8 md:px-8 md:pt-8">
          {children}
        </div>
      </div>
    </div>
  );
}
