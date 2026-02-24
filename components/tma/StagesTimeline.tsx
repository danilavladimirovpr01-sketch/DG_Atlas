'use client';

import { useState, useEffect } from 'react';
import { useTma } from '@/lib/tma-context';
import { STAGES } from '@/lib/constants/stages';
import StageCard from './StageCard';
import NpsWidget from './NpsWidget';
import type { StagePhoto, NpsResponse } from '@/types';
import { ArrowLeft, CheckCircle2, Clock, Layers } from 'lucide-react';
import Link from 'next/link';

export default function StagesTimeline() {
  const { profile, project } = useTma();
  const [photos, setPhotos] = useState<StagePhoto[]>([]);
  const [, setNpsResponses] = useState<NpsResponse[]>([]);
  const [npsStage, setNpsStage] = useState<number | null>(null);
  const [submittedStages, setSubmittedStages] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!project?.id) return;

    async function loadProjectData() {
      try {
        const res = await fetch(`/api/projects/${project!.id}`);
        const data = await res.json();
        const stagePhotos = Array.isArray(data.stage_photos) ? data.stage_photos : [];
        const npsData = Array.isArray(data.nps_responses) ? data.nps_responses : [];
        setPhotos(stagePhotos);
        setNpsResponses(npsData);

        const submitted = new Set<number>();
        npsData.forEach((nps: NpsResponse) => {
          submitted.add(nps.stage);
        });
        setSubmittedStages(submitted);
      } catch {
        // Failed to load — use defaults
      }
    }

    loadProjectData();
  }, [project?.id]);

  function handleNpsSubmitted(stage: number) {
    setSubmittedStages((prev) => new Set(Array.from(prev).concat(stage)));
  }

  const currentStage = project?.current_stage ?? 0;
  const completedCount = currentStage;
  const remainingCount = STAGES.length - currentStage - 1;
  const progress = Math.round(((currentStage + 1) / STAGES.length) * 100);

  /* Circular progress ring */
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      {/* ═══ Header ═══ */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/tma"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-white/[0.08] hover:bg-[#222] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Дорожная карта</h1>
          <p className="text-[#666] text-sm font-light">
            {STAGES[currentStage]?.title} — этап {currentStage + 1} из {STAGES.length}
          </p>
        </div>
      </div>

      {/* ═══ Infographic summary ═══ */}
      <div className="rounded-[24px] bg-[#0d0d0d] border border-white/[0.08] p-5 mb-6"
           style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
        <div className="flex items-center gap-5">
          {/* Circular progress */}
          <div className="relative w-24 h-24 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              <circle
                cx="48" cy="48" r="42" fill="none"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white text-xl font-bold tracking-tight">{progress}%</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4cd964]/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-[#4cd964]" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold tracking-tight">{completedCount}</p>
                <p className="text-[#666] text-[11px] font-light">завершено</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FF9800]/10 flex items-center justify-center">
                <Layers className="w-4 h-4 text-[#FF9800]" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold tracking-tight">
                  {STAGES[currentStage]?.title}
                </p>
                <p className="text-[#666] text-[11px] font-light">текущий этап</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#555]" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold tracking-tight">{remainingCount}</p>
                <p className="text-[#666] text-[11px] font-light">осталось</p>
              </div>
            </div>
          </div>
        </div>

        {/* Full progress bar */}
        <div className="mt-5">
          <div className="h-[6px] bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #fff 0%, #999 100%)',
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-[#555]">
            <span>Мечта</span>
            <span>Сервис</span>
          </div>
        </div>
      </div>

      {/* ═══ Timeline ═══ */}
      <div className="space-y-0">
        {STAGES.map((stage) => (
          <StageCard
            key={stage.number}
            stage={stage}
            currentStage={currentStage}
            photos={photos}
            onNpsClick={setNpsStage}
            npsSubmitted={submittedStages.has(stage.number)}
          />
        ))}
      </div>

      {/* NPS Modal */}
      {npsStage !== null && profile && project && (
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
