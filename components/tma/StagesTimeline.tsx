'use client';

import { useState, useEffect } from 'react';
import { useTma } from '@/lib/tma-context';
import { STAGES } from '@/lib/constants/stages';
import StageCard from './StageCard';
import NpsWidget from './NpsWidget';
import type { StagePhoto, NpsResponse } from '@/types';
import { ArrowLeft } from 'lucide-react';
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

        // Mark already submitted NPS stages
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

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/tma"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Прогресс строительства</h1>
          <p className="text-zinc-500 text-sm">
            Этап {currentStage + 1} из {STAGES.length} — {STAGES[currentStage]?.title}
          </p>
        </div>
      </div>

      {/* Timeline */}
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
