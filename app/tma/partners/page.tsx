'use client';

import Link from 'next/link';
import { ArrowLeft, Handshake } from 'lucide-react';

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-black px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/tma" className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/[0.08] flex items-center justify-center shrink-0">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-white text-xl font-bold tracking-tight">Полезные партнёры</h1>
      </div>

      <div className="rounded-[20px] bg-[#1a1a1a] border border-white/[0.08] p-6 text-center">
        <Handshake className="w-12 h-12 text-[#4cd964] mx-auto mb-3" />
        <p className="text-white text-[15px] font-semibold mb-1">Скоро</p>
        <p className="text-[#666] text-sm">Раздел с партнёрами находится в разработке</p>
      </div>
    </div>
  );
}
