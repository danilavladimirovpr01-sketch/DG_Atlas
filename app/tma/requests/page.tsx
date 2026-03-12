'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Clock, CheckCircle2, XCircle, Loader2,
  MessageSquare, FileText, HelpCircle, HardHat, Camera,
  ChevronRight, Filter,
} from 'lucide-react';

/* ── Типы заявок (соответствуют бэкенду) ── */
type RequestType =
  | 'question_to_management'
  | 'document_request'
  | 'general_question'
  | 'technical_supervision'
  | 'second_camera_request';

type RequestStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

interface Request {
  id: number;
  request_type: RequestType;
  subject: string;
  message: string;
  status: RequestStatus;
  created_at: string;
  attachments: string[];
}

/* ── Конфиг типов ── */
const REQUEST_TYPE_CONFIG: Record<RequestType, {
  label: string;
  shortLabel: string;
  icon: typeof MessageSquare;
  color: string;
}> = {
  question_to_management: {
    label: 'Вопрос руководству',
    shortLabel: 'Руководству',
    icon: MessageSquare,
    color: '#5AC8FA',
  },
  document_request: {
    label: 'Запрос документа',
    shortLabel: 'Документ',
    icon: FileText,
    color: '#AF52DE',
  },
  general_question: {
    label: 'Общий вопрос',
    shortLabel: 'Вопрос',
    icon: HelpCircle,
    color: '#FF9800',
  },
  technical_supervision: {
    label: 'Заявка технадзору',
    shortLabel: 'Технадзор',
    icon: HardHat,
    color: '#4cd964',
  },
  second_camera_request: {
    label: 'Запрос второй камеры',
    shortLabel: 'Камера',
    icon: Camera,
    color: '#FF3B30',
  },
};

/* ── Конфиг статусов ── */
const STATUS_CONFIG: Record<RequestStatus, {
  label: string;
  icon: typeof Clock;
  color: string;
  bg: string;
  border: string;
}> = {
  pending: {
    label: 'В ожидании',
    icon: Clock,
    color: 'text-[#FF9800]',
    bg: 'bg-[#FF9800]/10',
    border: 'border-[#FF9800]/20',
  },
  in_progress: {
    label: 'В работе',
    icon: Loader2,
    color: 'text-[#5AC8FA]',
    bg: 'bg-[#5AC8FA]/10',
    border: 'border-[#5AC8FA]/20',
  },
  completed: {
    label: 'Завершена',
    icon: CheckCircle2,
    color: 'text-[#4cd964]',
    bg: 'bg-[#4cd964]/10',
    border: 'border-[#4cd964]/20',
  },
  rejected: {
    label: 'Отклонена',
    icon: XCircle,
    color: 'text-[#FF3B30]',
    bg: 'bg-[#FF3B30]/10',
    border: 'border-[#FF3B30]/20',
  },
};

/* ── Мок-данные ── */
const MOCK_REQUESTS: Request[] = [
  {
    id: 1,
    request_type: 'technical_supervision',
    subject: 'Проверка армирования фундамента',
    message: 'Прошу организовать выезд технадзора для проверки армирования перед заливкой бетона.',
    status: 'in_progress',
    created_at: '2026-03-11T14:30:00',
    attachments: ['photo1.jpg', 'photo2.jpg'],
  },
  {
    id: 2,
    request_type: 'document_request',
    subject: 'Копия акта скрытых работ',
    message: 'Необходима копия акта скрытых работ по гидроизоляции фундамента.',
    status: 'pending',
    created_at: '2026-03-10T09:15:00',
    attachments: [],
  },
  {
    id: 3,
    request_type: 'question_to_management',
    subject: 'Сроки начала кладки стен',
    message: 'Когда планируется начало кладки стен? По графику было запланировано на 15 марта.',
    status: 'completed',
    created_at: '2026-03-08T11:00:00',
    attachments: [],
  },
  {
    id: 4,
    request_type: 'second_camera_request',
    subject: 'Камера на заднюю часть дома',
    message: 'Прошу установить вторую камеру с видом на заднюю часть участка, чтобы видеть ход работ по отмостке.',
    status: 'rejected',
    created_at: '2026-03-05T16:45:00',
    attachments: ['scheme.pdf'],
  },
  {
    id: 5,
    request_type: 'general_question',
    subject: 'Вопрос по материалу стен',
    message: 'Можно ли заменить газоблок D400 на D500 для несущих стен? Какая разница в цене?',
    status: 'completed',
    created_at: '2026-03-03T10:20:00',
    attachments: [],
  },
  {
    id: 6,
    request_type: 'technical_supervision',
    subject: 'Контроль заливки бетона',
    message: 'Нужен технадзор на этапе заливки фундаментной плиты. Дата заливки — 12 марта.',
    status: 'pending',
    created_at: '2026-03-01T08:00:00',
    attachments: ['photo3.jpg'],
  },
];

/* ── Хелперы ── */
function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Вчера';
  if (diffDays < 7) return `${diffDays} дн. назад`;

  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function RequestsPage() {
  const [activeFilter, setActiveFilter] = useState<RequestStatus | 'all'>('all');
  const [showTypes, setShowTypes] = useState(false);

  const filtered = activeFilter === 'all'
    ? MOCK_REQUESTS
    : MOCK_REQUESTS.filter((r) => r.status === activeFilter);

  const statusCounts = {
    all: MOCK_REQUESTS.length,
    pending: MOCK_REQUESTS.filter((r) => r.status === 'pending').length,
    in_progress: MOCK_REQUESTS.filter((r) => r.status === 'in_progress').length,
    completed: MOCK_REQUESTS.filter((r) => r.status === 'completed').length,
    rejected: MOCK_REQUESTS.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-black pb-8">

      {/* ═══════ HEADER ═══════ */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/tma"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-white/[0.08] active:bg-[#222] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Заявки</h1>
            <p className="text-[#666] text-xs font-light">{MOCK_REQUESTS.length} обращений</p>
          </div>
        </div>
        <Link
          href="/tma/requests/new"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white active:bg-white/90 transition-colors"
          style={{ boxShadow: '0 4px 15px rgba(255,255,255,0.15)' }}
        >
          <Plus className="w-5 h-5 text-black" />
        </Link>
      </div>

      {/* ═══════ STATS CARDS ═══════ */}
      <div className="px-4 mb-5">
        <div className="grid grid-cols-4 gap-2">
          {([
            { key: 'pending' as const, label: 'Ожидание', count: statusCounts.pending, color: '#FF9800' },
            { key: 'in_progress' as const, label: 'В работе', count: statusCounts.in_progress, color: '#5AC8FA' },
            { key: 'completed' as const, label: 'Решены', count: statusCounts.completed, color: '#4cd964' },
            { key: 'rejected' as const, label: 'Отклонены', count: statusCounts.rejected, color: '#FF3B30' },
          ]).map((stat) => {
            const Cfg = STATUS_CONFIG[stat.key];
            const Icon = Cfg.icon;
            return (
              <button
                key={stat.key}
                onClick={() => setActiveFilter(activeFilter === stat.key ? 'all' : stat.key)}
                className={`rounded-2xl border p-3 text-center transition-all active:scale-[0.97] ${
                  activeFilter === stat.key
                    ? `${Cfg.bg} ${Cfg.border}`
                    : 'bg-[#1a1a1a] border-white/[0.06]'
                }`}
              >
                <Icon className={`w-4 h-4 mx-auto mb-1.5 ${activeFilter === stat.key ? Cfg.color : 'text-[#666]'}`} />
                <p className={`text-lg font-bold tracking-tight ${activeFilter === stat.key ? Cfg.color : 'text-white'}`}>
                  {stat.count}
                </p>
                <p className="text-[#666] text-[9px] mt-0.5">{stat.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════ TYPE FILTER ═══════ */}
      <div className="px-4 mb-4">
        <button
          onClick={() => setShowTypes(!showTypes)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1a1a1a] border border-white/[0.06] active:bg-[#222] transition-colors"
        >
          <Filter className="w-3.5 h-3.5 text-[#666]" />
          <span className="text-[#999] text-xs font-medium">Типы заявок</span>
        </button>

        {showTypes && (
          <div className="flex gap-2 flex-wrap mt-3">
            {(Object.entries(REQUEST_TYPE_CONFIG) as [RequestType, typeof REQUEST_TYPE_CONFIG[RequestType]][]).map(
              ([type, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <div
                    key={type}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.06] bg-[#1a1a1a]"
                  >
                    <Icon className="w-3 h-3" style={{ color: cfg.color }} />
                    <span className="text-[#999] text-[11px] font-medium">{cfg.shortLabel}</span>
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>

      {/* ═══════ REQUESTS LIST ═══════ */}
      <div className="px-4 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-white/[0.06] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#4cd964]/40" />
            </div>
            <p className="text-[#666] text-sm font-light">Нет заявок с таким статусом</p>
          </div>
        ) : (
          filtered.map((request) => {
            const typeCfg = REQUEST_TYPE_CONFIG[request.request_type];
            const statusCfg = STATUS_CONFIG[request.status];
            const TypeIcon = typeCfg.icon;
            const StatusIcon = statusCfg.icon;

            return (
              <div
                key={request.id}
                className="rounded-[20px] bg-[#1a1a1a] border border-white/[0.06] p-4 active:bg-[#222] transition-colors"
                style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
              >
                {/* Top: type badge + date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: `${typeCfg.color}15` }}>
                    <TypeIcon className="w-3 h-3" style={{ color: typeCfg.color }} />
                    <span className="text-[11px] font-medium" style={{ color: typeCfg.color }}>
                      {typeCfg.shortLabel}
                    </span>
                  </div>
                  <span className="text-[#555] text-[11px]">{formatDate(request.created_at)}</span>
                </div>

                {/* Subject */}
                <p className="text-white text-[15px] font-semibold tracking-tight leading-snug mb-1.5">
                  {request.subject}
                </p>

                {/* Message preview */}
                <p className="text-[#666] text-xs leading-relaxed line-clamp-2 font-light mb-3">
                  {request.message}
                </p>

                {/* Bottom: status + attachments + arrow */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Status badge */}
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${statusCfg.bg} border ${statusCfg.border}`}>
                      <StatusIcon className={`w-3 h-3 ${statusCfg.color}`} />
                      <span className={`text-[10px] font-semibold ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                    </div>

                    {/* Attachments count */}
                    {request.attachments.length > 0 && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
                        <Camera className="w-3 h-3 text-[#666]" />
                        <span className="text-[#666] text-[10px] font-medium">{request.attachments.length}</span>
                      </div>
                    )}
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#444]" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ═══════ CTA — New Request ═══════ */}
      <div className="px-4 mt-6">
        <Link
          href="/tma/requests/new"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-white active:bg-white/90 transition-colors"
          style={{ boxShadow: '0 4px 20px rgba(255,255,255,0.1)' }}
        >
          <Plus className="w-5 h-5 text-black" />
          <span className="text-black text-[15px] font-semibold">Создать заявку</span>
        </Link>
      </div>
    </div>
  );
}
