'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTma } from '@/lib/tma-context';
import { STAGES } from '@/lib/constants/stages';
import { TMA_CATEGORIES } from '@/lib/constants/tma-features';
import type { FeatureCategory } from '@/lib/constants/tma-features';
import { ChevronDown, Bell, Star, ArrowRight } from 'lucide-react';

export default function WelcomeScreen() {
  const { profile, project } = useTma();
  const [openCategory, setOpenCategory] = useState<FeatureCategory | null>('progress');

  const currentStage = project?.current_stage ?? 0;
  const stageInfo = STAGES[currentStage];
  const progress = Math.round(((currentStage + 1) / STAGES.length) * 100);
  const firstName = profile?.full_name?.split(' ')[0] || 'Клиент';

  function toggleCategory(id: FeatureCategory) {
    setOpenCategory(openCategory === id ? null : id);
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <span className="text-white text-sm font-bold tracking-widest uppercase">DG Atlas</span>
        <Link
          href="/tma/notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900"
        >
          <Bell className="w-4 h-4 text-zinc-400" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            3
          </span>
        </Link>
      </div>

      {/* Hero card */}
      <div className="mx-4 mb-5">
        <div className="relative rounded-2xl overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: project?.cover_photo_url
                ? `url(${project.cover_photo_url})`
                : `url(${stageInfo?.defaultPhoto})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />

          {/* Content */}
          <div className="relative z-10 px-5 pt-16 pb-5 space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Привет, {firstName}
              </h1>
              <p className="text-zinc-300 text-base mt-0.5">
                {project?.title || 'Мой проект'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">
                  Этап {currentStage + 1} из {STAGES.length}
                </span>
                <span className="text-white font-medium">{progress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-zinc-500 text-xs">
                {stageInfo?.title} — {stageInfo?.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ваш голос — NPS feedback block */}
      <div className="mx-4 mb-5">
        <Link
          href="/tma/feedback"
          className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 active:bg-zinc-800/70 transition-colors"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-base font-semibold">Ваш голос</p>
            <p className="text-zinc-500 text-xs leading-snug">
              Оцените качество на каждом этапе строительства
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-zinc-600 shrink-0" />
        </Link>
      </div>

      {/* Category accordion menu */}
      <div className="px-4 pb-8 space-y-2">
        {TMA_CATEGORIES.map((category) => {
          const isOpen = openCategory === category.id;

          return (
            <div
              key={category.id}
              className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900/50"
            >
              {/* Category header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-5 py-4"
              >
                <span className="text-white text-base font-semibold uppercase tracking-wider">
                  {category.title}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-500 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Feature items */}
              {isOpen && (
                <div className="px-3 pb-3 space-y-1">
                  {category.features.map((feature) => {
                    const Icon = feature.icon;

                    return (
                      <Link
                        key={feature.id}
                        href={feature.route}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                          <Icon className="w-[18px] h-[18px] text-zinc-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium">
                            {feature.title}
                          </p>
                          <p className="text-zinc-500 text-xs leading-snug">
                            {feature.description}
                          </p>
                        </div>
                        {!feature.ready && (
                          <span className="text-zinc-600 text-[10px] font-medium shrink-0">
                            скоро
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
