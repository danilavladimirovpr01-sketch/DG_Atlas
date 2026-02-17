'use client';

import { createContext, useContext } from 'react';
import type { Project, Profile } from '@/types';

export interface TmaContextType {
  profile: Profile | null;
  project: Project | null;
  telegramUser: { id: string; firstName: string; lastName: string; username: string } | null;
  isLoading: boolean;
  setProfile: (p: Profile | null) => void;
  setProject: (p: Project | null) => void;
}

export const TmaContext = createContext<TmaContextType>({
  profile: null,
  project: null,
  telegramUser: null,
  isLoading: true,
  setProfile: () => {},
  setProject: () => {},
});

export const useTma = () => useContext(TmaContext);
