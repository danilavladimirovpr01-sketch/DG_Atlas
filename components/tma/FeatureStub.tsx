'use client';

import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { getFeatureById } from '@/lib/constants/tma-features';

interface FeatureStubProps {
  featureId: string;
}

export default function FeatureStub({ featureId }: FeatureStubProps) {
  const feature = getFeatureById(featureId);

  if (!feature) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-[#666]">Функция не найдена</p>
      </div>
    );
  }

  const Icon = feature.icon;

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-16">
        <Link
          href="/tma"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-white/[0.08] hover:bg-[#222] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-xl font-bold text-white tracking-tight">{feature.title}</h1>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center text-center px-6 pt-8">
        {/* Icon with decorative rings */}
        <div className="relative mb-8">
          <div className="absolute inset-0 w-28 h-28 -m-4 rounded-full border border-white/[0.04]" />
          <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08] flex items-center justify-center"
               style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
            <Icon className="w-10 h-10 text-white/60" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight mb-3">{feature.title}</h2>
        <p className="text-[#666] text-sm leading-relaxed max-w-[280px] mb-10 font-light">
          {feature.description}
        </p>

        <div className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#1a1a1a] border border-white/[0.08]"
             style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          <Clock className="w-4 h-4 text-[#FF9800]" />
          <span className="text-[#999] text-sm font-medium">Скоро будет доступно</span>
        </div>
      </div>
    </div>
  );
}
