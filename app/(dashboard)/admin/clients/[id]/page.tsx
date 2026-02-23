'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Phone, Star, MessageSquare, User, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { STAGES } from '@/lib/constants/stages';
import { NPS_QUESTIONS, POSITION_LABELS } from '@/lib/constants/nps-questions';
import type { EmployeePosition } from '@/types';

interface ClientProfile {
  id: string;
  full_name: string;
  phone: string | null;
  telegram_id: string | null;
  created_at: string;
}

interface ProjectItem {
  id: string;
  title: string;
  current_stage: number;
  status: string;
  created_at: string;
}

interface NpsItem {
  id: string;
  stage: number;
  score: number;
  answers: Record<string, number | string>;
  comment: string | null;
  created_at: string;
  employees: { full_name: string; position: string } | null;
}

interface CallItem {
  id: string;
  score: number | null;
  analysis_status: string;
  ai_summary: string | null;
  created_at: string;
  profiles: { full_name: string } | null;
}

interface ClientData {
  profile: ClientProfile;
  projects: ProjectItem[];
  npsResponses: NpsItem[];
  calls: CallItem[];
}

type TimelineEvent =
  | { type: 'nps'; date: string; data: NpsItem }
  | { type: 'call'; date: string; data: CallItem };

function npsScoreColor(score: number) {
  if (score >= 8) return 'text-green-400';
  if (score >= 6) return 'text-yellow-400';
  return 'text-red-400';
}

function callScoreColor(score: number | null) {
  if (score === null) return 'text-zinc-500';
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

function stageName(stage: number) {
  return STAGES[stage]?.title || `Этап ${stage}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const statusLabels: Record<string, string> = {
  active: 'Активный',
  completed: 'Завершён',
  paused: 'Пауза',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-900 text-green-300',
  completed: 'bg-zinc-700 text-zinc-300',
  paused: 'bg-yellow-900 text-yellow-300',
};

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/clients/${id}`);
        if (res.ok) setClient(await res.json());
      } catch {
        // Failed
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  const timeline = useMemo<TimelineEvent[]>(() => {
    if (!client) return [];
    const events: TimelineEvent[] = [
      ...(Array.isArray(client.npsResponses)
        ? client.npsResponses.map((n) => ({ type: 'nps' as const, date: n.created_at, data: n }))
        : []),
      ...(Array.isArray(client.calls)
        ? client.calls.map((c) => ({ type: 'call' as const, date: c.created_at, data: c }))
        : []),
    ];
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [client]);

  if (loading) {
    return <div className="py-20 text-center text-zinc-500">Загрузка...</div>;
  }

  if (!client) {
    return <div className="py-20 text-center text-zinc-500">Клиент не найден</div>;
  }

  const { profile, projects } = client;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/clients"
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-zinc-900 hover:bg-zinc-800"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-xl font-bold text-white">Карточка клиента</h1>
      </div>

      {/* Client info */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center">
            <User className="w-7 h-7 text-zinc-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{profile.full_name}</h2>
            <div className="flex items-center gap-4 mt-1">
              {profile.phone && (
                <span className="text-zinc-400 text-sm flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {profile.phone}
                </span>
              )}
              {profile.telegram_id ? (
                <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                  Telegram
                </Badge>
              ) : (
                <span className="text-zinc-600 text-xs">Telegram не подключён</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-zinc-500 text-xs">В системе с</p>
            <p className="text-zinc-400 text-sm">
              {new Date(profile.created_at).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Projects */}
      {projects.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-white">Проекты</h2>
          {projects.map((project) => (
            <div key={project.id} className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white font-medium">{project.title || 'Без названия'}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    {stageName(project.current_stage)}
                  </p>
                </div>
                <Badge variant="secondary" className={statusColors[project.status] || 'bg-zinc-700'}>
                  {statusLabels[project.status] || project.status}
                </Badge>
              </div>
              {/* Stage progress */}
              <div className="flex gap-0.5">
                {Array.from({ length: 15 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i <= project.current_stage ? 'bg-white' : 'bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
              <p className="text-zinc-500 text-xs mt-1.5">
                Этап {project.current_stage + 1} из {STAGES.length}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-3">
        <h2 className="text-lg font-medium text-white">
          История ({timeline.length})
        </h2>

        {timeline.length === 0 ? (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 px-5 py-8 text-center text-zinc-500">
            Нет событий
          </div>
        ) : (
          <div className="space-y-2">
            {timeline.map((event, i) => (
              <div
                key={`${event.type}-${i}`}
                className="bg-zinc-900 rounded-xl border border-zinc-800 px-5 py-4"
              >
                {event.type === 'nps' ? (
                  <NpsTimelineItem data={event.data} />
                ) : (
                  <CallTimelineItem data={event.data} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getQuestionLabel(stage: number, key: string): string {
  const config = NPS_QUESTIONS[stage];
  if (!config) return key;
  const q = config.questions.find((q) => q.key === key);
  return q?.label || key;
}

function ratingBarColor(value: number) {
  if (value >= 8) return 'bg-green-500';
  if (value >= 6) return 'bg-yellow-500';
  return 'bg-red-500';
}

function NpsTimelineItem({ data }: { data: NpsItem }) {
  const [expanded, setExpanded] = useState(false);

  const answerEntries = Object.entries(data.answers || {}).filter(
    ([, v]) => v !== null && v !== undefined && v !== ''
  );

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left flex items-start gap-3"
      >
        <div className="w-8 h-8 rounded-lg bg-yellow-900/50 flex items-center justify-center shrink-0 mt-0.5">
          <Star className="w-4 h-4 text-yellow-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">
                NPS: {stageName(data.stage)}
              </p>
              {data.employees && (
                <p className="text-zinc-500 text-xs">
                  Сотрудник: {data.employees.full_name}
                  {data.employees.position && ` (${POSITION_LABELS[data.employees.position as EmployeePosition] || data.employees.position})`}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className={`text-xl font-bold ${npsScoreColor(data.score)}`}>
                  {data.score}
                </span>
                <span className="text-zinc-600 text-xs">/10</span>
              </div>
              {answerEntries.length > 0 && (
                expanded
                  ? <ChevronUp className="w-4 h-4 text-zinc-500" />
                  : <ChevronDown className="w-4 h-4 text-zinc-500" />
              )}
            </div>
          </div>
          {data.comment && (
            <p className="text-zinc-400 text-sm mt-1">&laquo;{data.comment}&raquo;</p>
          )}
          <p className="text-zinc-600 text-xs mt-1">{formatDate(data.created_at)}</p>
        </div>
      </button>

      {expanded && answerEntries.length > 0 && (
        <div className="mt-3 ml-11 space-y-2 border-t border-zinc-800 pt-3">
          {answerEntries.map(([key, value]) => (
            <div key={key}>
              <p className="text-zinc-400 text-xs mb-1">
                {getQuestionLabel(data.stage, key)}
              </p>
              {typeof value === 'number' ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${ratingBarColor(value)}`}
                      style={{ width: `${value * 10}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold ${npsScoreColor(value)}`}>
                    {value}
                  </span>
                </div>
              ) : (
                <p className="text-zinc-300 text-sm">&laquo;{value}&raquo;</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CallTimelineItem({ data }: { data: CallItem }) {
  return (
    <Link href={`/admin/calls/${data.id}`} className="flex items-start gap-3 group">
      <div className="w-8 h-8 rounded-lg bg-blue-900/50 flex items-center justify-center shrink-0 mt-0.5">
        <MessageSquare className="w-4 h-4 text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-medium group-hover:underline">
              Звонок
              {data.profiles?.full_name && (
                <span className="text-zinc-500 font-normal"> — {data.profiles.full_name}</span>
              )}
            </p>
            {data.ai_summary && (
              <p className="text-zinc-400 text-xs mt-0.5 line-clamp-2">
                {data.ai_summary}
              </p>
            )}
          </div>
          <span className={`text-xl font-bold ${callScoreColor(data.score)}`}>
            {data.score !== null ? `${data.score}%` : '—'}
          </span>
        </div>
        <p className="text-zinc-600 text-xs mt-1">{formatDate(data.created_at)}</p>
      </div>
    </Link>
  );
}
