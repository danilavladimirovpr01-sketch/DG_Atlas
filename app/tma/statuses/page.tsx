'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, toArray } from '@/lib/laravel-client';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface FunnelStatus {
  code: string;
  name: string;
  progress: number;
  stage_name?: string;
  has_card: boolean;
  weight: number;
}

export default function StatusesPage() {
  const [statuses, setStatuses] = useState<FunnelStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/user/statuses')
      .then((res) => {
        const data = res?.data ?? res;
        setStatuses(toArray(data) as FunnelStatus[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/tma" className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/[0.08] flex items-center justify-center shrink-0">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-white text-xl font-bold tracking-tight">Статусы</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : statuses.length === 0 ? (
        <div className="text-center text-[#666] py-12 text-sm">Нет данных</div>
      ) : (
        <div className="space-y-2.5">
          {statuses.map((s, i) => {
            const isDone = s.has_card && s.progress >= 100;
            const isCurrent = s.has_card && s.progress > 0 && s.progress < 100;
            const isLocked = !s.has_card || s.progress === 0;

            return (
              <div
                key={s.code || i}
                className="rounded-[20px] bg-[#1a1a1a] border border-white/[0.08] p-4"
                style={{ opacity: isLocked ? 0.4 : 1 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isDone ? 'bg-[#4cd964]/10' : isCurrent ? 'bg-[#FF9800]/10' : 'bg-white/[0.04]'
                  }`}>
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-[#4cd964]" />
                    ) : (
                      <span className="text-[#666] text-sm font-bold">{i + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[15px] font-semibold">{s.name}</p>
                    {s.stage_name && <p className="text-[#666] text-xs mt-0.5">{s.stage_name}</p>}
                  </div>
                  <div className="shrink-0">
                    {isDone && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#4cd964]/10 text-[#4cd964]">100%</span>
                    )}
                    {isCurrent && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#FF9800]/10 text-[#FF9800]">{Math.round(s.progress)}%</span>
                    )}
                    {isLocked && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/[0.04] text-[#666]">0%</span>
                    )}
                  </div>
                </div>
                {isCurrent && (
                  <div className="h-[4px] bg-white/[0.08] rounded-full overflow-hidden mt-3 ml-[52px]">
                    <div className="h-full rounded-full" style={{ width: `${s.progress}%`, background: 'linear-gradient(90deg, #FF9800, #FFB74D)' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
