import { type PointerEvent as ReactPointerEvent, type ReactNode, useEffect, useRef, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

function ModalScrollArea({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({ startY: 0, startScrollTop: 0 });
  const [metrics, setMetrics] = useState({ clientHeight: 0, scrollHeight: 0, scrollTop: 0 });

  function updateMetrics() {
    const element = contentRef.current;
    if (!element) {
      return;
    }

    setMetrics({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      scrollTop: element.scrollTop,
    });
  }

  useEffect(() => {
    const element = contentRef.current;
    if (!element) {
      return;
    }

    updateMetrics();
    const resizeObserver = new ResizeObserver(updateMetrics);
    resizeObserver.observe(element);
    if (element.firstElementChild) {
      resizeObserver.observe(element.firstElementChild);
    }
    element.addEventListener('scroll', updateMetrics, { passive: true });
    window.addEventListener('resize', updateMetrics);

    return () => {
      resizeObserver.disconnect();
      element.removeEventListener('scroll', updateMetrics);
      window.removeEventListener('resize', updateMetrics);
    };
  }, [children]);

  const canScroll = metrics.scrollHeight > metrics.clientHeight + 1;
  const thumbHeight = canScroll
    ? Math.max(36, (metrics.clientHeight / metrics.scrollHeight) * metrics.clientHeight)
    : 0;
  const thumbTop = canScroll
    ? (metrics.scrollTop / (metrics.scrollHeight - metrics.clientHeight)) * (metrics.clientHeight - thumbHeight)
    : 0;

  function startThumbDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const element = contentRef.current;
    if (!element) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      startY: event.clientY,
      startScrollTop: element.scrollTop,
    };
  }

  function moveThumb(event: ReactPointerEvent<HTMLDivElement>) {
    const element = contentRef.current;
    if (!element || event.buttons === 0 || !canScroll) {
      return;
    }

    const trackTravel = metrics.clientHeight - thumbHeight;
    const scrollTravel = metrics.scrollHeight - metrics.clientHeight;
    const nextScrollTop = dragRef.current.startScrollTop + ((event.clientY - dragRef.current.startY) / trackTravel) * scrollTravel;
    element.scrollTop = Math.min(Math.max(nextScrollTop, 0), scrollTravel);
  }

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      <div ref={contentRef} className="modal-overlay-scroll-content h-full overflow-auto px-4 pb-8 pt-8 md:px-8 md:pt-8">
        {children}
      </div>
      {canScroll ? (
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 flex w-4 justify-center" aria-hidden="true">
          <div
            className="pointer-events-auto absolute top-0 w-1.5 cursor-grab rounded-full bg-black/45 hover:bg-black/60 active:cursor-grabbing active:bg-black/70"
            style={{ height: `${thumbHeight}px`, transform: `translate3d(0, ${thumbTop}px, 0)` }}
            onPointerDown={startThumbDrag}
            onPointerMove={moveThumb}
          />
        </div>
      ) : null}
    </div>
  );
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
        <style>{`
          .modal-overlay-scroll-content {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .modal-overlay-scroll-content::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
        `}</style>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex size-12 items-center justify-center rounded-full bg-white/90 text-[#191c1d] shadow-[0_2px_10px_0_rgba(0,0,0,0.15)] backdrop-blur-sm transition-colors hover:bg-white md:right-8 md:top-6"
          aria-label="Закрыть"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <ModalScrollArea>
          {children}
        </ModalScrollArea>
      </div>
    </div>
  );
}
