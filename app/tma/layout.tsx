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
          // Development / browser mode — use mock data
          setProfile({
            id: 'dev-user-001',
            full_name: 'Тестовый клиент',
            role: 'client',
            telegram_id: '123456789',
            phone: '+7 (999) 123-45-67',
            created_at: new Date().toISOString(),
          });
          setProject({
            id: 'dev-project-001',
            client_id: 'dev-user-001',
            manager_id: null,
            current_stage: 4,
            status: 'active',
            cover_photo_url: null,
            title: 'Дом в Подмосковье',
            created_at: new Date().toISOString(),
          });
          setTelegramUser({
            id: '123456789',
            firstName: 'Тестовый',
            lastName: 'Клиент',
            username: 'test_client',
          });
          setIsLoading(false);
          return;
        }

        const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
        const res = await fetch(`${base}/api/tma/auth`, {
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
