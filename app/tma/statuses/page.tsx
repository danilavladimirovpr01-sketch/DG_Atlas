'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, toArray } from '@/lib/laravel-client';
import { ArrowLeft, Lock } from 'lucide-react';

interface Status {
  name: string;
  stage_name?: string;
  progress: number;
  has_card: boolean;
}

export default function StatusesPage() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/user/statuses')
      .then((data) => {
        setStatuses(toArray(data));
      })
      .catch((e) => setError(e.message))
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

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-2xl bg-[#FF3B30]/10 text-[#FF3B30] text-sm">{error}</div>
      )}

      <div className="space-y-3">
        {statuses.map((status, i) => (
          <div
            key={i}
            className="rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08] p-5"
            style={{
              opacity: status.has_card ? 1 : 0.4,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-[15px] font-semibold tracking-tight">{status.name}</p>
              {!status.has_card && <Lock className="w-4 h-4 text-[#555]" />}
            </div>
            {status.stage_name && (
              <p className="text-[#666] text-xs mb-3">{status.stage_name}</p>
            )}
            <div className="h-[6px] bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${status.progress}%`,
                  background: status.progress === 100
                    ? 'linear-gradient(90deg, #4cd964 0%, #34C759 100%)'
                    : 'linear-gradient(90deg, #FF9800 0%, #FFB74D 100%)',
                }}
              />
            </div>
            <p className="text-[#555] text-[10px] mt-1.5 text-right">{status.progress}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
