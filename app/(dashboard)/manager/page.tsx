'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Upload, FileAudio, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import type { Call } from '@/types';

const statusMap: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'Ожидает', color: 'bg-zinc-700', icon: Clock },
  transcribing: { label: 'Транскрипция...', color: 'bg-blue-900', icon: Loader2 },
  analyzing: { label: 'Анализ...', color: 'bg-yellow-900', icon: Loader2 },
  done: { label: 'Готово', color: 'bg-green-900', icon: CheckCircle },
  error: { label: 'Ошибка', color: 'bg-red-900', icon: XCircle },
};

function scoreColor(score: number | null) {
  if (score === null) return 'text-zinc-500';
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

export default function ManagerPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadCalls() {
    try {
      const res = await fetch('/api/calls');
      const data = await res.json();
      if (Array.isArray(data)) setCalls(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCalls();

    // Subscribe to realtime updates
    const supabase = createClient();
    const channel = supabase
      .channel('calls-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'calls' },
        (payload) => {
          setCalls((prev) =>
            prev.map((c) => (c.id === payload.new.id ? { ...c, ...payload.new } : c))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    try {
      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append('audio', file);

        const res = await fetch('/api/calls', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const call = await res.json();
          setCalls((prev) => [call, ...prev]);

          // Start analysis
          fetch(`/api/calls/${call.id}/analyze`, { method: 'POST' });
        }
      }
    } catch {
      // silently fail
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.webm'],
    },
    disabled: uploading,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Звонки</h1>

      {/* Upload zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-white bg-zinc-900'
            : 'border-zinc-800 hover:border-zinc-600'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-zinc-400" />
          )}
          <div>
            <p className="text-white font-medium">
              {uploading
                ? 'Загрузка...'
                : isDragActive
                ? 'Отпустите файл'
                : 'Перетащите аудио или нажмите для выбора'}
            </p>
            <p className="text-zinc-500 text-sm mt-1">MP3, WAV, M4A до 25MB</p>
          </div>
        </div>
      </div>

      {/* Calls list */}
      {loading ? (
        <div className="text-center text-zinc-500 py-8">Загрузка звонков...</div>
      ) : calls.length === 0 ? (
        <div className="text-center text-zinc-500 py-8">
          Пока нет загруженных звонков
        </div>
      ) : (
        <div className="space-y-3">
          {calls.map((call) => {
            const status = statusMap[call.analysis_status] || statusMap.pending;
            const StatusIcon = status.icon;

            return (
              <Link
                key={call.id}
                href={`/manager/calls/${call.id}`}
                className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <FileAudio className="w-5 h-5 text-zinc-500" />
                  <div>
                    <p className="text-white text-sm">
                      {new Date(call.created_at).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {call.ai_summary && (
                      <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1 max-w-md">
                        {call.ai_summary}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {call.score !== null && (
                    <span className={`text-lg font-bold ${scoreColor(call.score)}`}>
                      {call.score}%
                    </span>
                  )}
                  <Badge variant="secondary" className={`${status.color} text-white`}>
                    <StatusIcon className={`w-3 h-3 mr-1 ${
                      call.analysis_status === 'transcribing' || call.analysis_status === 'analyzing'
                        ? 'animate-spin'
                        : ''
                    }`} />
                    {status.label}
                  </Badge>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
