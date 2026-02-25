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

      // Calculate safe area: device notch + Telegram header
      const deviceTop = tg.safeAreaInset?.top ?? 0;
      const contentTop = tg.contentSafeAreaInset?.top ?? 0;
      setSafeTop(deviceTop + contentTop);

      // Listen for viewport changes
      tg.onEvent?.('contentSafeAreaChanged', () => {
        const d = tg.safeAreaInset?.top ?? 0;
        const c = tg.contentSafeAreaInset?.top ?? 0;
        setSafeTop(d + c);
      });
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
             paddingTop: safeTop > 0 ? safeTop : undefined,
           }}>
        {children}
      </div>
    </TmaContext.Provider>
  );
}
