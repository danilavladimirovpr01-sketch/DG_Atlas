'use client';

import { useState, useEffect, use } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface CriterionScore {
  id: string;
  passed: boolean;
  ai_comment: string | null;
  checklist_items: {
    category: string;
    criterion: string;
  };
}

interface CallDetail {
  id: string;
  audio_url: string;
  transcript: string | null;
  score: number | null;
  analysis_status: string;
  ai_summary: string | null;
  created_at: string;
  call_criterion_scores: CriterionScore[];
}

function scoreColor(score: number | null) {
  if (score === null) return 'text-zinc-500';
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

function scoreBg(score: number | null) {
  if (score === null) return 'bg-zinc-800';
  if (score >= 80) return 'bg-green-950 border-green-900';
  if (score >= 60) return 'bg-yellow-950 border-yellow-900';
  return 'bg-red-950 border-red-900';
}

export default function CallDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [call, setCall] = useState<CallDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);

  useEffect(() => {
    async function loadCall() {
      try {
        const res = await fetch(`/api/calls/${id}`);
        if (res.ok) {
          setCall(await res.json());
        }
      } catch {
        // Failed
      } finally {
        setLoading(false);
      }
    }
    loadCall();
  }, [id]);

  async function handleReanalyze() {
    setReanalyzing(true);
    try {
      await fetch(`/api/calls/${id}/analyze`, { method: 'POST' });
      // Reload after analysis
      const res = await fetch(`/api/calls/${id}`);
      if (res.ok) setCall(await res.json());
    } catch {
      // Failed
    } finally {
      setReanalyzing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-500">
        Загрузка...
      </div>
    );
  }

  if (!call) {
    return (
      <div className="text-center py-20 text-zinc-500">Звонок не найден</div>
    );
  }

  // Group criteria by category
  const grouped: Record<string, CriterionScore[]> = {};
  (call.call_criterion_scores || []).forEach((cs) => {
    const cat = cs.checklist_items?.category || 'Другое';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(cs);
  });

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/manager"
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Анализ звонка</h1>
          <p className="text-zinc-500 text-sm">
            {new Date(call.created_at).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReanalyze}
          disabled={reanalyzing}
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          <RotateCcw className={`w-4 h-4 mr-2 ${reanalyzing ? 'animate-spin' : ''}`} />
          Перезапустить
        </Button>
      </div>

      {/* Score + Summary */}
      <div className={`rounded-xl border p-6 ${scoreBg(call.score)}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white">Общая оценка</h2>
          <span className={`text-4xl font-bold ${scoreColor(call.score)}`}>
            {call.score !== null ? `${call.score}%` : '—'}
          </span>
        </div>
        {call.ai_summary && (
          <p className="text-zinc-300 leading-relaxed">{call.ai_summary}</p>
        )}
      </div>

      {/* Audio player */}
      <div className="bg-zinc-900 rounded-xl p-4">
        <p className="text-zinc-400 text-sm mb-3">Аудиозапись</p>
        <audio controls className="w-full" src={call.audio_url}>
          Ваш браузер не поддерживает аудио
        </audio>
      </div>

      {/* Criteria breakdown */}
      {Object.keys(grouped).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-white">Детализация по чеклисту</h2>
          {Object.entries(grouped).map(([category, scores]) => (
            <div key={category} className="bg-zinc-900 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                {category}
              </h3>
              {scores.map((cs) => (
                <div key={cs.id} className="flex items-start gap-3">
                  {cs.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-white text-sm">
                      {cs.checklist_items?.criterion}
                    </p>
                    {cs.ai_comment && (
                      <p className="text-zinc-500 text-xs mt-0.5">{cs.ai_comment}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Transcript */}
      {call.transcript && (
        <div className="bg-zinc-900 rounded-xl p-4">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">
            Транскрипт
          </h2>
          <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
            {call.transcript}
          </p>
        </div>
      )}
    </div>
  );
}
