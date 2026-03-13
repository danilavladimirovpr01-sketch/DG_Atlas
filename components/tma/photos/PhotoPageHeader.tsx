import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { PhotoStats } from '@/types/photos';

interface PhotoPageHeaderProps {
  stats: PhotoStats;
}

export default function PhotoPageHeader({ stats }: PhotoPageHeaderProps) {
  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center gap-3 mb-5">
        <Link
          href="/tma"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-white/[0.08] hover:bg-[#222] transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Фото стройки</h1>
          <p className="text-[#666] text-sm font-light">Автоматическая доставка фото от прораба</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 px-4 py-3 rounded-2xl bg-[#1a1a1a] border border-white/[0.06] text-center">
          <p className="text-white text-xl font-bold">{stats.total}</p>
          <p className="text-[#666] text-[10px]">всего фото</p>
        </div>
        <div className="flex-1 px-4 py-3 rounded-2xl bg-[#1a1a1a] border border-white/[0.06] text-center">
          <p className="text-white text-xl font-bold">{stats.thisWeek}</p>
          <p className="text-[#666] text-[10px]">за неделю</p>
        </div>
      </div>
    </div>
  );
}
