'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Upload, Loader2 } from 'lucide-react';
import Link from 'next/link';

const statusLabels: Record<string, string> = {
  pending: 'Ожидает',
  transcribing: 'Транскрипция',
  analyzing: 'Анализ',
  done: 'Готово',
  error: 'Ошибка',
};

const statusColors: Record<string, string> = {
  pending: 'bg-zinc-700',
  transcribing: 'bg-blue-900',
  analyzing: 'bg-yellow-900',
  done: 'bg-green-900 text-green-300',
  error: 'bg-red-900 text-red-300',
};

function scoreColor(score: number | null) {
  if (score === null) return 'text-zinc-500';
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

interface CallRow {
  id: string;
  created_at: string;
  profiles?: { full_name: string };
  analysis_status: string;
  score: number | null;
  ai_summary: string | null;
}

interface ClientOption {
  id: string;
  full_name: string;
  phone: string | null;
}

export default function AdminCallsPage() {
  const [calls, setCalls] = useState<CallRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');

  useEffect(() => {
    async function loadClients() {
      try {
        const res = await fetch('/api/clients');
        const data = await res.json();
        if (Array.isArray(data)) setClients(data);
      } catch {
        // silently fail
      }
    }
    loadClients();
  }, []);

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

    const supabase = createClient();
    const channel = supabase
      .channel('admin-calls-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'calls' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCalls((prev) => [payload.new as CallRow, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setCalls((prev) =>
              prev.map((c) =>
                c.id === payload.new.id ? { ...c, ...payload.new } : c
              )
            );
          }
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
        if (selectedClient) formData.append('client_id', selectedClient);

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
      <h1 className="text-2xl font-bold text-white">Все звонки</h1>

      {/* Client selector + Upload zone */}
      <div className="flex items-center gap-4">
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2.5 min-w-[200px]"
        >
          <option value="">Без привязки к клиенту</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name}{c.phone ? ` (${c.phone})` : ''}
            </option>
          ))}
        </select>
      </div>

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

      {/* Calls table */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="px-5 py-8 text-center text-zinc-500">Загрузка звонков...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                  Дата
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                  Менеджер
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                  Статус
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                  Оценка
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                  Резюме
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {calls.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-zinc-500">
                    Нет звонков
                  </td>
                </tr>
              ) : (
                calls.map((call) => (
                  <tr key={call.id} className="hover:bg-zinc-800/50">
                    <td className="px-5 py-3 text-zinc-300 text-sm">
                      <Link
                        href={`/admin/calls/${call.id}`}
                        className="hover:text-white"
                      >
                        {new Date(call.created_at).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-white text-sm">
                      {call.profiles?.full_name || '—'}
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        variant="secondary"
                        className={`${statusColors[call.analysis_status] || 'bg-zinc-700'} text-white`}
                      >
                        {statusLabels[call.analysis_status] || call.analysis_status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-lg font-bold ${scoreColor(call.score)}`}>
                        {call.score !== null ? `${call.score}%` : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-zinc-500 text-sm max-w-xs truncate">
                      {call.ai_summary || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
