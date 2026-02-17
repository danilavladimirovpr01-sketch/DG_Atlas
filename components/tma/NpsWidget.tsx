'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

interface NpsWidgetProps {
  stage: number;
  clientId: string;
  projectId: string;
  onClose: () => void;
  onSubmitted: (stage: number) => void;
}

export default function NpsWidget({
  stage,
  clientId,
  projectId,
  onClose,
  onSubmitted,
}: NpsWidgetProps) {
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (score === null) return;
    setLoading(true);

    try {
      await fetch('/api/nps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          projectId,
          stage,
          score,
          comment: comment || null,
        }),
      });

      setSubmitted(true);
      onSubmitted(stage);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6">
        <div className="bg-zinc-900 rounded-2xl p-8 w-full max-w-sm text-center space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="text-5xl">&#10003;</div>
          <h3 className="text-xl font-medium text-white">Спасибо!</h3>
          <p className="text-zinc-400">Ваша оценка принята</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 px-4 pb-6">
      <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-sm space-y-5 animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">
            Оцените этап {stage}
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-zinc-400 text-sm">
          Насколько вы довольны результатом этого этапа?
        </p>

        {/* Score buttons 0-10 */}
        <div className="grid grid-cols-11 gap-1">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              onClick={() => setScore(i)}
              className={`h-10 rounded-lg text-sm font-medium transition-colors ${
                score === i
                  ? 'bg-white text-black'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {i}
            </button>
          ))}
        </div>

        <div className="flex justify-between text-xs text-zinc-600">
          <span>Совсем нет</span>
          <span>Отлично</span>
        </div>

        {/* Comment */}
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Комментарий (необязательно)"
          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 resize-none"
          rows={3}
        />

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={score === null || loading}
          className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-medium disabled:opacity-30"
        >
          {loading ? 'Отправляем...' : 'Отправить оценку'}
        </Button>
      </div>
    </div>
  );
}
