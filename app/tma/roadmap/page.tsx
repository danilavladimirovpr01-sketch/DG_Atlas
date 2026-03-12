'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, toArray } from '@/lib/laravel-client';
import { ArrowLeft, CheckCircle2, LayoutGrid, Clock } from 'lucide-react';

interface FunnelStatus {
  code: string;
  name: string;
  progress: number;
  stage_name?: string;
  has_card: boolean;
  weight: number;
}

export default function RoadmapPage() {
  const [statuses, setStatuses] = useState<FunnelStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/user/statuses')
      .then((res) => {
        const data = res?.data ?? res;
        setStatuses(toArray(data) as FunnelStatus[]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const completed = statuses.filter((s) => s.has_card && s.progress >= 100);
  const current = statuses.find((s) => s.has_card && s.progress > 0 && s.progress < 100);
  const remaining = statuses.filter((s) => !s.has_card || s.progress === 0);
  const totalStages = statuses.length;
  const currentIndex = current ? statuses.indexOf(current) + 1 : completed.length;

  // Overall weighted progress
  const totalWeight = statuses.reduce((sum, s) => sum + (s.weight || 1), 0);
  const weightedProgress = totalWeight > 0
    ? Math.round(statuses.reduce((sum, s) => sum + (s.progress * (s.weight || 1)) / totalWeight, 0))
    : 0;

  // Circle SVG params
  const circleRadius = 58;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (weightedProgress / 100) * circumference;


  return (
    <div className="min-h-screen bg-black px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/tma" className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/[0.08] flex items-center justify-center shrink-0">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div>
          <h1 className="text-white text-xl font-bold tracking-tight">Дорожная карта</h1>
          {current && (
            <p className="text-[#666] text-xs mt-0.5">
              {current.name} — этап {currentIndex} из {totalStages}
            </p>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-2xl bg-[#FF3B30]/10 text-[#FF3B30] text-sm mb-4">{error}</div>
      )}

      {!loading && statuses.length > 0 && (
        <>
          {/* Progress circle + summary */}
          <div
            className="rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08] p-5 mb-5"
            style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
          >
            <div className="flex items-center gap-5">
              {/* Circular progress */}
              <div className="relative w-[140px] h-[140px] shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r={circleRadius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                  <circle
                    cx="70" cy="70" r={circleRadius}
                    fill="none" stroke="#fff" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">{weightedProgress}%</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#4cd964]" />
                  <div>
                    <p className="text-[#4cd964] text-lg font-bold leading-none">{completed.length}</p>
                    <p className="text-[#666] text-[11px]">завершено</p>
                  </div>
                </div>
                {current && (
                  <div className="flex items-center gap-2.5">
                    <LayoutGrid className="w-5 h-5 text-white" />
                    <div>
                      <p className="text-white text-sm font-bold leading-none">{current.name}</p>
                      <p className="text-[#666] text-[11px]">текущий этап</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-[#666]" />
                  <div>
                    <p className="text-white text-lg font-bold leading-none">{remaining.length}</p>
                    <p className="text-[#666] text-[11px]">осталось</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Linear progress bar */}
            <div className="mt-5">
              <div className="h-[6px] bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${weightedProgress}%`,
                    background: 'linear-gradient(90deg, #fff 0%, #ccc 100%)',
                  }}
                />
              </div>
              {statuses.length >= 2 && (
                <div className="flex justify-between mt-1.5">
                  <span className="text-[#666] text-[10px]">{statuses[0].name}</span>
                  <span className="text-[#666] text-[10px]">{statuses[statuses.length - 1].name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stage cards */}
          <div className="space-y-2.5">
            {statuses.map((status, i) => {
              const isDone = status.has_card && status.progress >= 100;
              const isCurrent = status.has_card && status.progress > 0 && status.progress < 100;
              const isLocked = !status.has_card || status.progress === 0;

              return (
                <div
                  key={status.code || i}
                  className="rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08] p-4"
                  style={{
                    opacity: isLocked ? 0.4 : 1,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Status icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isDone ? 'bg-[#4cd964]/10' : isCurrent ? 'bg-white/10' : 'bg-white/[0.04]'
                    }`}>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-[#4cd964]" />
                      ) : (
                        <span className="text-[#666] text-xs font-bold">{i + 1}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-white text-[15px] font-semibold tracking-tight">{status.name}</p>
                        {isDone && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#4cd964]/10 text-[#4cd964] shrink-0">
                            Готово
                          </span>
                        )}
                        {isCurrent && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FF9800]/10 text-[#FF9800] shrink-0">
                            {Math.round(status.progress)}%
                          </span>
                        )}
                      </div>
                      {status.stage_name && (
                        <p className="text-[#666] text-xs mt-0.5">{status.stage_name}</p>
                      )}

                      {/* Progress bar for current */}
                      {isCurrent && (
                        <div className="h-[4px] bg-white/[0.08] rounded-full overflow-hidden mt-2">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${status.progress}%`,
                              background: 'linear-gradient(90deg, #FF9800, #FFB74D)',
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!loading && statuses.length === 0 && !error && (
        <div className="text-center text-[#666] py-12 text-sm">Нет данных</div>
      )}
    </div>
  );
}
