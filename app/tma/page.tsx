'use client';

import { useTma } from '@/lib/tma-context';
import WelcomeScreen from '@/components/tma/WelcomeScreen';
import OnboardingScreen from '@/components/tma/OnboardingScreen';

export default function TmaPage() {
  const { profile, project, isLoading } = useTma();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-pulse text-zinc-400 text-lg">Загрузка...</div>
      </div>
    );
  }

  // Not onboarded yet — show phone input
  if (!profile || !project) {
    return <OnboardingScreen />;
  }

  return <WelcomeScreen />;
}
