'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import type { Project, Profile } from '@/types';

interface TmaContextType {
  profile: Profile | null;
  project: Project | null;
  telegramUser: { id: string; firstName: string; lastName: string; username: string } | null;
  isLoading: boolean;
  setProfile: (p: Profile | null) => void;
  setProject: (p: Project | null) => void;
}

const TmaContext = createContext<TmaContextType>({
  profile: null,
  project: null,
  telegramUser: null,
  isLoading: true,
  setProfile: () => {},
  setProject: () => {},
});

export const useTma = () => useContext(TmaContext);

export default function TmaLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [telegramUser, setTelegramUser] = useState<TmaContextType['telegramUser']>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Expand TMA to full screen
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.expand();
      tg.ready();
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
      <div className="min-h-screen bg-black text-white">
        {children}
      </div>
    </TmaContext.Provider>
  );
}
