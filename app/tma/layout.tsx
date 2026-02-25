'use client';

import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import type { Project, Profile } from '@/types';
import { TmaContext, type TmaContextType } from '@/lib/tma-context';

const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
});

export default function TmaLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [telegramUser, setTelegramUser] = useState<TmaContextType['telegramUser']>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [safeTop, setSafeTop] = useState(0);

  useEffect(() => {
    // Expand TMA to full screen
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.expand();
      tg.ready();

      // Request fullscreen if available (Bot API 8.0+)
      if (typeof tg.requestFullscreen === 'function') {
        try { tg.requestFullscreen(); } catch {}
      }

      // Calculate safe area: device notch + Telegram header
      const calcSafe = () => {
        const deviceTop = tg.safeAreaInset?.top ?? 0;
        const contentTop = tg.contentSafeAreaInset?.top ?? 0;
        let total = deviceTop + contentTop;

        // Fallback: if API returns 0 but we're in fullscreen/expanded,
        // use headerColor presence or screen check to estimate safe area
        if (total === 0 && tg.isExpanded) {
          // iPhone with notch/dynamic island: ~54px, without: ~20px
          const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
          if (isIOS) {
            // Check for notch: screen height > 800 means modern iPhone with notch
            total = window.screen.height > 800 ? 54 : 20;
          }
        }

        if (total > 0) {
          setSafeTop(total);
          document.documentElement.style.setProperty('--tg-safe-top', `${total}px`);
        }
      };

      // Run after a small delay to let TG settle
      calcSafe();
      setTimeout(calcSafe, 300);

      // Listen for viewport/safe-area changes
      tg.onEvent?.('contentSafeAreaChanged', calcSafe);
      tg.onEvent?.('safeAreaChanged', calcSafe);
      tg.onEvent?.('viewportChanged', calcSafe);
    }

    async function init() {
      try {
        const initData = tg?.initData;
        if (!initData) {
          // Development mode — use mock data
          setIsLoading(false);
          return;
        }

        const res = await fetch('/api/tma/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData }),
        });

        const data = await res.json();

        if (data.telegramUser) {
          setTelegramUser(data.telegramUser);
        }

        if (data.status === 'authenticated') {
          setProfile(data.profile);
          setProject(data.project);
        }
        // If 'needs_onboarding' — user stays on current page (onboarding)
      } catch (error) {
        console.error('TMA init error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, []);

  return (
    <TmaContext.Provider
      value={{ profile, project, telegramUser, isLoading, setProfile, setProject }}
    >
      <div className={`${inter.variable} font-sans min-h-screen bg-black text-white`}
           style={{
             fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
             paddingTop: safeTop,
           }}>
        {children}
      </div>
    </TmaContext.Provider>
  );
}
