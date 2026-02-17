'use client';

import { useTma } from '../layout';
import StagesTimeline from '@/components/tma/StagesTimeline';

export default function StagesPage() {
  const { isLoading, profile, project } = useTma();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-pulse text-zinc-400 text-lg">Загрузка...</div>
      </div>
    );
  }

  if (!profile || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-zinc-400">Сначала войдите в систему</p>
      </div>
    );
  }

  return <StagesTimeline />;
}
