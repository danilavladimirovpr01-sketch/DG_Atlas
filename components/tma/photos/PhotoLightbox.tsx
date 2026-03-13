'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import type { PhotoFile } from '@/types/photos';

interface PhotoLightboxProps {
  photos: PhotoFile[];
  initialIndex: number;
  onClose: () => void;
}

export default function PhotoLightbox({ photos, initialIndex, onClose }: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const touchStartX = useRef<number | null>(null);
  const photoAreaRef = useRef<HTMLDivElement>(null);

  const safeIndex = Math.min(currentIndex, photos.length - 1);
  const photo = photos[safeIndex];
  const hasPrev = safeIndex > 0;
  const hasNext = safeIndex < photos.length - 1;

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(photos.length - 1, i + 1));
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goPrev, goNext, onClose]);

  // Lock body scroll + prevent touchmove for reliable swipe in TMA WebView
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const el = photoAreaRef.current;
    const preventScroll = (e: TouchEvent) => e.preventDefault();
    el?.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      document.body.style.overflow = prev;
      el?.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  // Guard: if photos array is empty, close lightbox
  useEffect(() => {
    if (photos.length === 0) onClose();
  }, [photos.length, onClose]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -50) goNext();
    else if (delta > 50) goPrev();
    touchStartX.current = null;
  }

  function handleSendToTelegram() {
    const tg = (window as Record<string, unknown>).Telegram as
      | { WebApp?: { openLink?: (url: string) => void } }
      | undefined;
    if (tg?.WebApp?.openLink) {
      tg.WebApp.openLink(photo.download_url);
    } else {
      window.open(photo.download_url, '_blank');
    }
  }

  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <span className="text-[#666] text-sm">
          {safeIndex + 1} / {photos.length}
        </span>
        <span className="px-3 py-1 rounded-full bg-[#FF9800]/15 text-[#FF9800] text-xs font-medium">
          {photo.theme}
        </span>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-white/[0.08] hover:bg-[#222] transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Photo area */}
      <div
        ref={photoAreaRef}
        className="flex-1 flex items-center justify-center relative select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.download_url}
          alt={photo.name}
          className="max-h-full max-w-full object-contain"
          draggable={false}
        />

        {/* Prev arrow */}
        {hasPrev && (
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 border border-white/[0.08] hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Next arrow */}
        {hasNext && (
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 border border-white/[0.08] hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Bottom bar */}
      <div className="px-4 pb-6 pt-3 shrink-0">
        <p className="text-white text-sm font-medium truncate">{photo.name}</p>
        <p className="text-[#555] text-xs mt-0.5">
          {new Date(photo.created_at).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>

        <button
          onClick={handleSendToTelegram}
          className="w-full mt-3 py-3.5 rounded-2xl bg-[#FF9800] text-black text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Send className="w-4 h-4" />
          Отправить в Telegram
        </button>
      </div>
    </div>
  );
}
