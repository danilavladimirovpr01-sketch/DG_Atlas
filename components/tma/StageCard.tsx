'use client';

import { Check, Star } from 'lucide-react';
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

  const stagePhotos = photos.filter((p) => p.stage === stage.number);
  const photoUrl = stagePhotos.length > 0
    ? stagePhotos[stagePhotos.length - 1].photo_url
    : stage.defaultPhoto;

  const progress = isActive ? 60 : isCompleted ? 100 : 0;

  return (
    <div className="flex gap-4">
      {/* ── Timeline line + dot ── */}
      <div className="flex flex-col items-center w-10 shrink-0">
        {/* Dot */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
            isCompleted
              ? 'bg-white'
              : isActive
              ? 'bg-[#FF9800]/15 border-2 border-[#FF9800]'
              : 'bg-[#1a1a1a] border border-white/[0.08]'
          }`}
          style={
            isCompleted
              ? { boxShadow: '0 0 12px rgba(255,255,255,0.15)' }
              : isActive
              ? { boxShadow: '0 0 16px rgba(255,152,0,0.2)' }
              : undefined
          }
        >
          {isCompleted ? (
            <Check className="w-5 h-5 text-black" strokeWidth={3} />
          ) : (
            <span
              className={`text-xs font-bold ${
                isActive ? 'text-[#FF9800]' : 'text-[#555]'
              }`}
            >
              {stage.number}
            </span>
          )}
        </div>
        {/* Line */}
        <div
          className={`w-[2px] flex-1 mt-0 ${
            isCompleted
              ? 'bg-gradient-to-b from-white/40 to-white/10'
              : isActive
              ? 'bg-gradient-to-b from-[#FF9800]/30 to-white/[0.04]'
              : 'bg-white/[0.04]'
          }`}
        />
      </div>

      {/* ── Content ── */}
      <div className={`pb-5 flex-1 min-w-0 ${isUpcoming ? 'opacity-40' : ''}`}>
        {/* Title + description */}
        <div className="flex items-start justify-between mb-2 pt-2">
          <div className="min-w-0 flex-1">
            <h3
              className={`font-semibold tracking-tight ${
                isActive
                  ? 'text-white text-[17px]'
                  : isCompleted
                  ? 'text-white text-[15px]'
                  : 'text-[#666] text-[15px]'
              }`}
            >
              {stage.title}
            </h3>
            <p className="text-[#666] text-[13px] font-light mt-0.5">{stage.description}</p>
          </div>

          {/* Status badge */}
          {isCompleted && (
            <span className="shrink-0 ml-3 bg-[#4cd964]/10 text-[#4cd964] text-[11px] px-2.5 py-1 rounded-full font-medium">
              Готово
            </span>
          )}
          {isActive && (
            <span className="shrink-0 ml-3 bg-[#FF9800]/10 text-[#FF9800] text-[11px] px-2.5 py-1 rounded-full font-medium">
              Сейчас
            </span>
          )}
        </div>

        {/* Photo card — only for active and completed */}
        {(isActive || isCompleted) && (
          <div
            className={`relative rounded-[16px] overflow-hidden mt-2 border border-white/[0.06] ${
              isActive ? 'h-44' : 'h-28'
            }`}
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${photoUrl})` }}
            />
            {/* Fallback gradient when no photo loads */}
            <div className={`absolute inset-0 ${
              isActive
                ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent'
                : 'bg-gradient-to-t from-black/60 to-transparent'
            }`} />

            {/* Active stage progress overlay */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#FF9800] text-[11px] font-medium">В процессе</span>
                  <span className="text-white text-[13px] font-bold">{progress}%</span>
                </div>
                <div className="h-[5px] bg-white/[0.12] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #FF9800 0%, #FFB74D 100%)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* NPS actions for completed stages */}
        {isCompleted && onNpsClick && !npsSubmitted && (
          <button
            onClick={() => onNpsClick(stage.number)}
            className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF9800]/10 border border-[#FF9800]/20 active:bg-[#FF9800]/15 transition-colors"
          >
            <Star className="w-4 h-4 text-[#FF9800]" />
            <span className="text-[#FF9800] text-[13px] font-medium">Оценить этап</span>
          </button>
        )}

        {isCompleted && npsSubmitted && (
          <div className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4cd964]/5 border border-[#4cd964]/10">
            <Check className="w-4 h-4 text-[#4cd964]" />
            <span className="text-[#4cd964]/70 text-[13px] font-medium">Оценка отправлена</span>
          </div>
        )}
      </div>
    </div>
  );
}
