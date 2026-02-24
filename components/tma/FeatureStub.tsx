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
        <p className="text-zinc-500">Функция не найдена</p>
      </div>
    );
  }

  const Icon = feature.icon;

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-12">
        <Link
          href="/tma"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-xl font-bold text-white">{feature.title}</h1>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center text-center px-6 pt-12">
        <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
          <Icon className="w-10 h-10 text-zinc-500" />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">{feature.title}</h2>
        <p className="text-zinc-500 text-sm leading-relaxed max-w-[280px] mb-8">
          {feature.description}
        </p>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800">
          <Clock className="w-4 h-4 text-zinc-500" />
          <span className="text-zinc-400 text-sm font-medium">Скоро</span>
        </div>
      </div>
    </div>
  );
}
