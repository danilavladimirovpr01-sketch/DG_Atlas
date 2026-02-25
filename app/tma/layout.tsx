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

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();

      // Make TG header blend with our black background
      if (typeof tg.setHeaderColor === 'function') {
        tg.setHeaderColor('#000000');
      }
      if (typeof tg.setBackgroundColor === 'function') {
        tg.setBackgroundColor('#000000');
      }
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
      <div className={`${inter.variable} font-sans min-h-screen bg-black text-white tma-container`}
           style={{
             fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
           }}>
        {children}
      </div>
    </TmaContext.Provider>
  );
}
