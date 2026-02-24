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
        <div className="animate-pulse text-zinc-400 text-lg">Загрузка...</div>
      </div>
    );
  }

  if (!profile || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-zinc-400">Сначала войдите в систему</p>
      </div>
    );
  }

  const currentStage = project.current_stage ?? 0;
  const completedStages = STAGES.filter((s) => s.number < currentStage);
  const activeStage = STAGES[currentStage];

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/tma"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Ваш голос</h1>
          <p className="text-zinc-500 text-sm">Оцените качество на каждом этапе</p>
        </div>
      </div>

      {/* Active stage */}
      {activeStage && (
        <div className="mb-6">
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-3 px-1">Текущий этап</p>
          <div className="px-4 py-4 rounded-2xl border border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-white text-sm font-bold">{activeStage.number}</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{activeStage.title}</p>
                <p className="text-zinc-500 text-xs">{activeStage.description}</p>
              </div>
              <span className="text-zinc-600 text-xs">в процессе</span>
            </div>
          </div>
        </div>
      )}

      {/* Completed stages */}
      {completedStages.length > 0 ? (
        <div>
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-3 px-1">
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
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border transition-colors text-left ${
                    isSubmitted
                      ? 'border-zinc-800/50 bg-zinc-900/30 opacity-60'
                      : 'border-zinc-800 bg-zinc-900/50 active:bg-zinc-800/70'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isSubmitted ? 'bg-green-500/10' : 'bg-amber-500/10'
                  }`}>
                    {isSubmitted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Star className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">{stage.title}</p>
                    <p className="text-zinc-500 text-xs">{stage.description}</p>
                  </div>
                  {isSubmitted ? (
                    <span className="text-green-600 text-xs shrink-0">Оценено</span>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-zinc-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-zinc-600" />
          </div>
          <p className="text-zinc-400 text-sm">Пока нет завершённых этапов для оценки</p>
          <p className="text-zinc-600 text-xs mt-1">Оценка станет доступна после завершения первого этапа</p>
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
