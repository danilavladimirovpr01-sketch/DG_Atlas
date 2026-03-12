'use client';

import { useState } from 'react';
import { useTma } from '@/lib/tma-context';
import WelcomeScreen from '@/components/tma/WelcomeScreen';
import OnboardingScreen from '@/components/tma/OnboardingScreen';
import SplashScreen from '@/components/tma/SplashScreen';

export default function TmaPage() {
  const { profile, isLoading } = useTma();
  const [splashDone, setSplashDone] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('splashDone') === '1';
    }
    return false;
  });

  function handleSplashComplete() {
    sessionStorage.setItem('splashDone', '1');
    setSplashDone(true);
  }

  // Пока идёт авторизация — спиннер
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Не прошёл онбординг — показываем ввод телефона
  if (!profile) {
    return <OnboardingScreen />;
  }

  // Авторизован — сплеш один раз, потом главный экран
  if (!splashDone) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return <WelcomeScreen />;
}
