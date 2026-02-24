'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTma } from '@/lib/tma-context';
import { STAGES } from '@/lib/constants/stages';
import { TMA_CATEGORIES } from '@/lib/constants/tma-features';
import type { FeatureCategory } from '@/lib/constants/tma-features';
import {
  ChevronDown, Bell, Star, ArrowRight, ChevronRight,
  Clock, Camera, Trophy, Layers, TrendingUp,
} from 'lucide-react';

/* ── Category visual config (matching landing page) ── */
const CATEGORY_STYLE: Record<FeatureCategory, {
  gradient: string;
  iconBg: string;
  iconColor: string;
  preview: React.ReactNode;
}> = {
  progress: {
    gradient: 'from-[#1a1a1a] to-[#111]',
    iconBg: 'bg-white/10',
    iconColor: 'text-white',
    preview: (
      <div className="flex items-end gap-1 h-8 mt-2">
        {[40, 65, 50, 80, 70, 90, 60].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm bg-white/20" style={{ height: `${h}%` }} />
        ))}
      </div>
    ),
  },
  finance: {
    gradient: 'from-[#1a1a1a] to-[#111]',
    iconBg: 'bg-white/10',
    iconColor: 'text-white',
    preview: (
      <div className="relative w-12 h-12 mt-2 mx-auto">
        <div
          className="w-full h-full rounded-full"
          style={{
            background: 'conic-gradient(#fff 0deg 216deg, #888 216deg 288deg, #555 288deg 342deg, #333 342deg 360deg)',
          }}
        />
        <div className="absolute inset-[6px] rounded-full bg-[#1a1a1a]" />
      </div>
    ),
  },
  media: {
    gradient: 'from-[#1a1a1a] to-[#111]',
    iconBg: 'bg-white/10',
    iconColor: 'text-white',
    preview: (
      <div className="grid grid-cols-3 gap-1 mt-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square rounded-[4px] bg-white/15" />
        ))}
      </div>
    ),
  },
  support: {
    gradient: 'from-[#1a1a1a] to-[#111]',
    iconBg: 'bg-white/10',
    iconColor: 'text-white',
    preview: (
      <div className="space-y-1.5 mt-2">
        <div className="flex gap-1.5">
          <div className="h-2.5 rounded-full bg-white/15 w-3/4" />
        </div>
        <div className="flex justify-end gap-1.5">
          <div className="h-2.5 rounded-full bg-white/25 w-2/3" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-2.5 rounded-full bg-white/15 w-1/2" />
        </div>
      </div>
    ),
  },
};

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

  /* Quick stats — matching landing's stat screen (#16) */
  const stats = [
    { label: 'Уровень', value: `${currentStage + 1}/${STAGES.length}`, icon: Layers, bg: 'from-blue-500/10 to-blue-600/5', color: 'text-blue-400' },
    { label: 'Прогресс', value: `${progress}%`, icon: TrendingUp, bg: 'from-emerald-500/10 to-emerald-600/5', color: 'text-emerald-400' },
    { label: 'Фото', value: '--', icon: Camera, bg: 'from-purple-500/10 to-purple-600/5', color: 'text-purple-400' },
    { label: 'Награды', value: '--', icon: Trophy, bg: 'from-orange-500/10 to-orange-600/5', color: 'text-orange-400' },
  ];

  return (
    <div className="min-h-screen bg-black pb-8">

      {/* ═══════════════ HEADER ═══════════════ */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <img
            src="/logo-dg.svg"
            alt="DG"
            className="w-10 h-10 rounded-full"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}
          />
          <div>
            <p className="text-[#666] text-xs font-light">Добрый день</p>
            <p className="text-white text-sm font-semibold tracking-tight">{firstName}</p>
          </div>
        </div>
        <Link
          href="/tma/notifications"
          className="relative w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-white/[0.08]"
        >
          <Bell className="w-[18px] h-[18px] text-[#666]" />
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#FF3B30] rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1">
            3
          </span>
        </Link>
      </div>

      {/* ═══════════════ HERO PROJECT CARD ═══════════════ */}
      <Link href="/tma/stages" className="block mx-4 mb-5 mt-2">
        <div className="relative rounded-[24px] overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          {/* Background photo (if available) */}
          {(project?.cover_photo_url || stageInfo?.defaultPhoto) && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${project?.cover_photo_url || stageInfo?.defaultPhoto})`,
              }}
            />
          )}

          {/* Gradient overlay — works with or without photo */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#111] to-black" />

          {/* Decorative circle — like landing's rotating design circle */}
          <div className="absolute top-4 right-4 w-24 h-24 rounded-full border border-white/[0.06]" />
          <div className="absolute top-8 right-8 w-16 h-16 rounded-full border border-white/[0.04]" />

          {/* Content */}
          <div className="relative z-10 p-6 pt-8 min-h-[200px] flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF9800]/15 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF9800]" />
                <span className="text-[#FF9800] text-[11px] font-semibold">
                  Этап {currentStage + 1}: {stageInfo?.title}
                </span>
              </div>
              <h1 className="text-[26px] font-bold text-white leading-tight tracking-tight">
                {project?.title || 'Мой проект'}
              </h1>
              <p className="text-[#666] text-sm mt-1 font-light">
                {stageInfo?.description}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#666] text-xs">Прогресс строительства</span>
                <span className="text-white text-sm font-bold">{progress}%</span>
              </div>
              <div className="h-[6px] bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #fff 0%, #ccc 100%)',
                  }}
                />
              </div>
              <div className="flex items-center gap-1 mt-3 text-[#666] text-xs">
                <span>Дорожная карта</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* ═══════════════ QUICK STATS ═══════════════ */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-4 gap-2">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`rounded-2xl bg-gradient-to-br ${stat.bg} border border-white/[0.06] p-3 text-center`}
              >
                <Icon className={`w-[18px] h-[18px] ${stat.color} mx-auto mb-1.5`} />
                <p className="text-white text-sm font-bold tracking-tight">{stat.value}</p>
                <p className="text-[#666] text-[10px] mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════ ВАШ ГОЛОС ═══════════════ */}
      <div className="mx-4 mb-6">
        <Link
          href="/tma/feedback"
          className="flex items-center gap-4 px-5 py-4 rounded-[20px] bg-[#1a1a1a] border border-white/[0.08] active:bg-[#222] transition-colors"
          style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FF9800]/10 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 text-[#FF9800]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[15px] font-semibold tracking-tight">Ваш голос</p>
            <p className="text-[#666] text-xs leading-snug mt-0.5 font-light">
              Оцените качество на каждом этапе
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-[#444] shrink-0" />
        </Link>
      </div>

      {/* ═══════════════ CATEGORY SECTIONS ═══════════════ */}
      <div className="space-y-3 px-4 pb-4">
        {TMA_CATEGORIES.map((category) => {
          const isOpen = openCategory === category.id;
          const style = CATEGORY_STYLE[category.id];

          return (
            <div
              key={category.id}
              className="rounded-[20px] border border-white/[0.08] overflow-hidden bg-[#0d0d0d]"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
            >
              {/* Category header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-5 py-4 active:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl ${style.iconBg} flex items-center justify-center`}>
                    {/* Category preview miniature */}
                    <span className="text-[13px]">
                      {category.id === 'progress' && <Layers className="w-4 h-4 text-white/70" />}
                      {category.id === 'finance' && (
                        <div className="w-4 h-4 rounded-full" style={{ background: 'conic-gradient(#fff 0deg 216deg, #666 216deg 288deg, #444 288deg)' }}>
                          <div className="w-2 h-2 rounded-full bg-[#0d0d0d] absolute inset-0 m-auto" />
                        </div>
                      )}
                      {category.id === 'media' && <Camera className="w-4 h-4 text-white/70" />}
                      {category.id === 'support' && (
                        <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      )}
                    </span>
                  </div>
                  <span className="text-white text-[15px] font-semibold tracking-tight">
                    {category.title}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-[#444] transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Feature items — expandable */}
              {isOpen && (
                <div className="px-3 pb-3">
                  {/* Horizontal scroll of feature cards */}
                  <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
                    {category.features.map((feature) => {
                      const Icon = feature.icon;
                      return (
                        <Link
                          key={feature.id}
                          href={feature.route}
                          className="flex-shrink-0 w-[130px] rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.06] p-4 active:scale-[0.97] transition-transform"
                        >
                          <div className={`w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center mb-3`}>
                            <Icon className="w-5 h-5 text-white/80" />
                          </div>
                          <p className="text-white text-[13px] font-medium leading-tight tracking-tight">
                            {feature.title}
                          </p>
                          {!feature.ready ? (
                            <span className="inline-flex items-center gap-1 text-[#555] text-[10px] mt-1.5">
                              <Clock className="w-2.5 h-2.5" />
                              скоро
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-white/50 text-[10px] mt-1.5 font-medium">
                              Открыть
                              <ChevronRight className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
