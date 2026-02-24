'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTma } from '@/lib/tma-context';
import { STAGES } from '@/lib/constants/stages';
import NpsWidget from '@/components/tma/NpsWidget';
import type { NpsResponse } from '@/types';
import { ArrowLeft, Star, CheckCircle2, ChevronRight } from 'lucide-react';

export default function FeedbackPage() {
  const { profile, project, isLoading } = useTma();
  const [npsStage, setNpsStage] = useState<number | null>(null);
  const [submittedStages, setSubmittedStages] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!project?.id) return;

    async function loadNps() {
      try {
        const res = await fetch(`/api/projects/${project!.id}`);
        const data = await res.json();
        const npsData = Array.isArray(data.nps_responses) ? data.nps_responses : [];
        const submitted = new Set<number>();
        npsData.forEach((nps: NpsResponse) => submitted.add(nps.stage));
        setSubmittedStages(submitted);
      } catch {
        // ignore
      }
    }

    loadNps();
  }, [project?.id]);

  function handleNpsSubmitted(stage: number) {
    setSubmittedStages((prev) => new Set(Array.from(prev).concat(stage)));
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-pulse text-[#666] text-lg">Загрузка...</div>
      </div>
    );
  }

  if (!profile || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-[#666]">Сначала войдите в систему</p>
      </div>
    );
  }

  const currentStage = project.current_stage ?? 0;
  const completedStages = STAGES.filter((s) => s.number < currentStage);
  const activeStage = STAGES[currentStage];

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/tma"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-white/[0.08] hover:bg-[#222] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Ваш голос</h1>
          <p className="text-[#666] text-sm font-light">Оцените качество на каждом этапе</p>
        </div>
      </div>

      {/* Active stage */}
      {activeStage && (
        <div className="mb-6">
          <p className="text-[#666] text-xs font-medium uppercase tracking-wider mb-3 px-1">Текущий этап</p>
          <div className="px-5 py-4 rounded-[20px] border border-white/[0.08] bg-[#0d0d0d]"
               style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF9800]/10 flex items-center justify-center">
                <span className="text-[#FF9800] text-sm font-bold">{activeStage.number}</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold tracking-tight">{activeStage.title}</p>
                <p className="text-[#666] text-xs font-light">{activeStage.description}</p>
              </div>
              <span className="text-[#FF9800] text-[11px] font-medium">в процессе</span>
            </div>
          </div>
        </div>
      )}

      {/* Completed stages */}
      {completedStages.length > 0 ? (
        <div>
          <p className="text-[#666] text-xs font-medium uppercase tracking-wider mb-3 px-1">
            Завершённые этапы ({completedStages.length})
          </p>
          <div className="space-y-2">
            {completedStages.map((stage) => {
              const isSubmitted = submittedStages.has(stage.number);

              return (
                <button
                  key={stage.number}
                  onClick={() => !isSubmitted && setNpsStage(stage.number)}
                  disabled={isSubmitted}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-[20px] border transition-colors text-left ${
                    isSubmitted
                      ? 'border-white/[0.04] bg-[#0d0d0d] opacity-60'
                      : 'border-white/[0.08] bg-[#0d0d0d] active:bg-[#1a1a1a]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isSubmitted ? 'bg-[#4cd964]/10' : 'bg-[#FF9800]/10'
                  }`}>
                    {isSubmitted ? (
                      <CheckCircle2 className="w-5 h-5 text-[#4cd964]" />
                    ) : (
                      <Star className="w-5 h-5 text-[#FF9800]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm tracking-tight">{stage.title}</p>
                    <p className="text-[#666] text-xs font-light">{stage.description}</p>
                  </div>
                  {isSubmitted ? (
                    <span className="text-[#4cd964]/70 text-xs shrink-0 font-medium">Оценено</span>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[#444] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-[20px] bg-[#1a1a1a] border border-white/[0.08] flex items-center justify-center mb-4"
               style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
            <Star className="w-8 h-8 text-[#444]" />
          </div>
          <p className="text-[#999] text-sm">Пока нет завершённых этапов для оценки</p>
          <p className="text-[#555] text-xs mt-1 font-light">Оценка станет доступна после завершения первого этапа</p>
        </div>
      )}

      {/* NPS Modal */}
      {npsStage !== null && (
        <NpsWidget
          stage={npsStage}
          clientId={profile.id}
          projectId={project.id}
          onClose={() => setNpsStage(null)}
          onSubmitted={handleNpsSubmitted}
        />
      )}
    </div>
  );
}
