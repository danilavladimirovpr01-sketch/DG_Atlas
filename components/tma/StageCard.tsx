'use client';

import { Check } from 'lucide-react';
import type { Stage, StagePhoto } from '@/types';

interface StageCardProps {
  stage: Stage;
  currentStage: number;
  photos: StagePhoto[];
  onNpsClick?: (stageNumber: number) => void;
  npsSubmitted?: boolean;
}

export default function StageCard({
  stage,
  currentStage,
  photos,
  onNpsClick,
  npsSubmitted,
}: StageCardProps) {
  const isCompleted = stage.number < currentStage;
  const isActive = stage.number === currentStage;
  const isUpcoming = stage.number > currentStage;

  // Use uploaded photo if available, otherwise default
  const stagePhotos = photos.filter((p) => p.stage === stage.number);
  const photoUrl = stagePhotos.length > 0
    ? stagePhotos[stagePhotos.length - 1].photo_url
    : stage.defaultPhoto;

  const progress = isActive ? 60 : isCompleted ? 100 : 0;

  return (
    <div className="flex gap-4">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            isCompleted
              ? 'bg-white'
              : isActive
              ? 'bg-white/20 border-2 border-white'
              : 'bg-zinc-800 border border-zinc-700'
          }`}
        >
          {isCompleted ? (
            <Check className="w-4 h-4 text-black" />
          ) : (
            <span
              className={`text-xs font-medium ${
                isActive ? 'text-white' : 'text-zinc-500'
              }`}
            >
              {stage.number}
            </span>
          )}
        </div>
        <div
          className={`w-px flex-1 mt-2 ${
            isCompleted ? 'bg-white/30' : 'bg-zinc-800'
          }`}
        />
      </div>

      {/* Content */}
      <div className={`pb-8 flex-1 ${isUpcoming ? 'opacity-50' : ''}`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3
              className={`font-medium ${
                isActive ? 'text-white text-lg' : 'text-zinc-300'
              }`}
            >
              {stage.title}
            </h3>
            <p className="text-zinc-500 text-sm">{stage.description}</p>
          </div>
        </div>

        {/* Photo */}
        <div
          className={`relative rounded-lg overflow-hidden mt-3 ${
            isActive ? 'h-48' : 'h-32'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${photoUrl})` }}
          />
          {!isCompleted && !isActive && (
            <div className="absolute inset-0 bg-zinc-900/60" />
          )}

          {/* Status badge */}
          {isActive && (
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-white/70">в процессе</span>
                <span className="text-white font-medium">{progress}%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="absolute top-3 right-3">
              <span className="bg-white/90 text-black text-xs px-2 py-1 rounded-full font-medium">
                Завершён
              </span>
            </div>
          )}
        </div>

        {/* NPS button for completed stages */}
        {isCompleted && onNpsClick && !npsSubmitted && (
          <button
            onClick={() => onNpsClick(stage.number)}
            className="mt-3 text-sm text-zinc-400 hover:text-white transition-colors underline underline-offset-4"
          >
            Оценить этап
          </button>
        )}

        {isCompleted && npsSubmitted && (
          <p className="mt-3 text-sm text-zinc-600">Оценка отправлена</p>
        )}
      </div>
    </div>
  );
}
