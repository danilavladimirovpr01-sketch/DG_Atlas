'use client';

import Link from 'next/link';
import { useTma } from '@/lib/tma-context';
import { STAGES } from '@/lib/constants/stages';
import { ArrowRight } from 'lucide-react';

export default function WelcomeScreen() {
  const { profile, project } = useTma();

  const currentStage = project?.current_stage || 1;
  const stageInfo = STAGES[currentStage - 1];
  const progress = Math.round((currentStage / 14) * 100);
  const firstName = profile?.full_name?.split(' ')[0] || 'Клиент';

  return (
    <div className="relative min-h-screen flex flex-col justify-end">
      {/* Background photo with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: project?.cover_photo_url
            ? `url(${project.cover_photo_url})`
            : `url(${stageInfo?.defaultPhoto})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

      {/* Content */}
      <div className="relative z-10 px-6 pb-12 space-y-6">
        {/* Project title */}
        <div className="space-y-2">
          <p className="text-zinc-400 text-sm uppercase tracking-widest">
            DG Atlas
          </p>
          <h1 className="text-3xl font-bold text-white">
            Привет, {firstName}
          </h1>
          <p className="text-xl text-zinc-300">
            {project?.title || 'Ваш проект'}
          </p>
        </div>

        {/* Stage info */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-400">
              Этап {currentStage} из 14
            </span>
            <span className="text-white font-medium">
              {progress}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-zinc-500 text-sm">
            {stageInfo?.title} — {stageInfo?.description}
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/tma/stages"
          className="flex items-center justify-center gap-2 w-full h-14 bg-white text-black rounded-lg text-lg font-medium hover:bg-zinc-200 transition-colors"
        >
          Смотреть прогресс
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
