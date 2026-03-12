'use client';

import Link from 'next/link';
import { useTma } from '@/lib/tma-context';
import { STAGES } from '@/lib/constants/stages';
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  CircleDollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  Hammer,
  FileText,
  ChevronRight,
  Zap,
} from 'lucide-react';

/* ── Mock data (replace with real API later) ── */
const WEEKLY_ACTIVITY = [
  { week: 'Н1', photos: 8, events: 3 },
  { week: 'Н2', photos: 15, events: 5 },
  { week: 'Н3', photos: 12, events: 4 },
  { week: 'Н4', photos: 22, events: 7 },
  { week: 'Н5', photos: 18, events: 5 },
  { week: 'Н6', photos: 28, events: 8 },
  { week: 'Н7', photos: 20, events: 6 },
  { week: 'Н8', photos: 32, events: 9 },
];

const BUDGET_SEGMENTS = [
  { label: 'Фундамент', value: 820000, color: '#5AC8FA' },
  { label: 'Стены', value: 650000, color: '#FF9800' },
  { label: 'Материалы', value: 430000, color: '#AF52DE' },
  { label: 'Работа', value: 200000, color: '#4cd964' },
];

const RECENT_EVENTS = [
  { icon: Camera, text: 'Загружено 6 фото', detail: 'Этап: Фундамент', time: '2 ч назад', color: '#AF52DE' },
  { icon: CheckCircle2, text: 'Этап завершён', detail: 'Земляные работы', time: 'Вчера', color: '#4cd964' },
  { icon: CircleDollarSign, text: 'Оплата 820K ₽', detail: 'Фундамент', time: '3 дня', color: '#FF9800' },
  { icon: FileText, text: 'Подписан договор', detail: 'Доп. соглашение №2', time: '5 дней', color: '#5AC8FA' },
  { icon: Hammer, text: 'Начат новый этап', detail: 'Стены и перекрытия', time: '1 нед', color: '#FF9800' },
];

/* ── Circular progress ring ── */
function ProgressRing({ percent, size = 140, stroke = 8 }: { percent: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={stroke}
      />
      {/* Progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#progressGradient)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-1000"
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#999999" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Donut chart for budget ── */
function BudgetDonut({ segments, size = 120 }: { segments: typeof BUDGET_SEGMENTS; size?: number }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={stroke}
      />
      {/* Segments */}
      {segments.map((seg, i) => {
        const segPercent = seg.value / total;
        const dashLength = segPercent * circumference;
        const gapLength = circumference - dashLength;
        const currentOffset = cumulativeOffset;
        cumulativeOffset += segPercent * circumference;

        return (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeLinecap="butt"
            strokeDasharray={`${dashLength} ${gapLength}`}
            strokeDashoffset={-currentOffset}
            className="transition-all duration-700"
          />
        );
      })}
    </svg>
  );
}

export default function ProjectStats() {
  const { project } = useTma();

  const currentStage = project?.current_stage ?? 3;
  const stageInfo = STAGES[currentStage];
  const totalStages = STAGES.length;
  const completedStages = currentStage;
  const progress = Math.round(((currentStage + 1) / totalStages) * 100);

  const daysInConstruction = 47;
  const totalPhotos = 247;
  const totalBudget = 5200000;
  const spent = BUDGET_SEGMENTS.reduce((s, seg) => s + seg.value, 0);
  const spentPercent = Math.round((spent / totalBudget) * 100);

  const maxActivity = Math.max(...WEEKLY_ACTIVITY.map((w) => w.photos));

  /* ── KPI cards ── */
  const kpis = [
    {
      label: 'Дней в стройке',
      value: daysInConstruction.toString(),
      sub: '~120 осталось',
      icon: CalendarDays,
      color: '#5AC8FA',
    },
    {
      label: 'Фото загружено',
      value: totalPhotos.toString(),
      sub: '+12 за неделю',
      icon: Camera,
      color: '#AF52DE',
    },
    {
      label: 'Потрачено',
      value: `${(spent / 1_000_000).toFixed(1)}M ₽`,
      sub: `${spentPercent}% бюджета`,
      icon: CircleDollarSign,
      color: '#FF9800',
    },
    {
      label: 'Прогресс',
      value: `${progress}%`,
      sub: `${completedStages} из ${totalStages} этапов`,
      icon: TrendingUp,
      color: '#4cd964',
    },
  ];

  return (
    <div className="min-h-screen bg-black px-4 py-6 pb-10">
      {/* ═══════════ HEADER ═══════════ */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/tma"
          className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/[0.08] flex items-center justify-center shrink-0 active:bg-[#222] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div>
          <h1 className="text-white text-xl font-bold tracking-tight">Статистика</h1>
          <p className="text-[#666] text-xs font-light">Обзор вашего проекта</p>
        </div>
      </div>

      {/* ═══════════ HERO: PROGRESS RING ═══════════ */}
      <div
        className="rounded-[24px] bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08] p-6 mb-5"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
      >
        <div className="flex items-center gap-6">
          {/* Ring */}
          <div className="relative shrink-0">
            <ProgressRing percent={progress} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white text-[30px] font-extrabold tracking-tight">{progress}%</span>
              <span className="text-[#666] text-[10px] mt-0.5">готовность</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-white text-[17px] font-semibold tracking-tight leading-tight">
              {project?.title || 'Мой проект'}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF9800]" />
              <span className="text-[#FF9800] text-xs font-medium">
                Этап {currentStage + 1}
              </span>
            </div>
            <p className="text-[#666] text-xs mt-1 font-light leading-snug">
              {stageInfo?.title}
            </p>

            {/* Mini stage progress */}
            <div className="flex gap-[3px] mt-3">
              {STAGES.slice(0, 10).map((_, i) => (
                <div
                  key={i}
                  className="h-[4px] flex-1 rounded-full"
                  style={{
                    background:
                      i < currentStage
                        ? '#4cd964'
                        : i === currentStage
                          ? '#FF9800'
                          : 'rgba(255,255,255,0.08)',
                  }}
                />
              ))}
              {totalStages > 10 && (
                <span className="text-[#555] text-[8px] ml-0.5 self-center">+{totalStages - 10}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ KPI GRID ═══════════ */}
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="px-4 py-4 rounded-2xl bg-[#1a1a1a] border border-white/[0.06]"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${kpi.color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                </div>
                <span className="text-[#666] text-[10px] font-medium">{kpi.label}</span>
              </div>
              <p className="text-white text-xl font-bold tracking-tight">{kpi.value}</p>
              <p className="text-[#555] text-[10px] mt-0.5">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ═══════════ BUDGET BREAKDOWN ═══════════ */}
      <div
        className="rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08] p-5 mb-5"
        style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-white text-[15px] font-semibold tracking-tight">Бюджет</p>
          <span className="text-[#666] text-xs">{(totalBudget / 1_000_000).toFixed(1)}M ₽ всего</span>
        </div>

        <div className="flex items-center gap-5">
          {/* Donut */}
          <div className="relative shrink-0">
            <BudgetDonut segments={BUDGET_SEGMENTS} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white text-lg font-bold">{spentPercent}%</span>
              <span className="text-[#666] text-[9px]">потрачено</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2.5">
            {BUDGET_SEGMENTS.map((seg) => (
              <div key={seg.label} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium">{seg.label}</p>
                </div>
                <span className="text-[#999] text-xs font-medium">
                  {seg.value >= 1_000_000
                    ? `${(seg.value / 1_000_000).toFixed(1)}M`
                    : `${Math.round(seg.value / 1_000)}K`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Spent bar */}
        <div className="mt-4">
          <div className="h-[6px] bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${spentPercent}%`,
                background: 'linear-gradient(90deg, #FF9800 0%, #FFB74D 100%)',
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[#666] text-[10px]">{(spent / 1_000_000).toFixed(1)}M ₽ потрачено</span>
            <span className="text-[#555] text-[10px]">
              {((totalBudget - spent) / 1_000_000).toFixed(1)}M ₽ осталось
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════ WEEKLY ACTIVITY CHART ═══════════ */}
      <div
        className="rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08] p-5 mb-5"
        style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
      >
        <div className="flex items-center justify-between mb-1">
          <p className="text-white text-[15px] font-semibold tracking-tight">Активность</p>
          <div className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-[#FF9800]" />
            <span className="text-[#FF9800] text-xs font-medium">+24%</span>
          </div>
        </div>
        <p className="text-[#666] text-[10px] mb-4">Фото за последние 8 недель</p>

        {/* Bar chart */}
        <div className="flex items-end gap-2 h-28">
          {WEEKLY_ACTIVITY.map((week, i) => {
            const height = (week.photos / maxActivity) * 100;
            const isLast = i === WEEKLY_ACTIVITY.length - 1;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <span
                  className={`text-[9px] font-bold ${isLast ? 'text-white' : 'text-[#555]'}`}
                >
                  {week.photos}
                </span>
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-[4px] transition-all duration-500"
                    style={{
                      height: `${height}%`,
                      background: isLast
                        ? 'linear-gradient(180deg, #FF9800 0%, #FF980060 100%)'
                        : 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 100%)',
                    }}
                  />
                </div>
                <span className={`text-[9px] ${isLast ? 'text-[#999]' : 'text-[#444]'}`}>
                  {week.week}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════ STAGES COMPLETION ═══════════ */}
      <div
        className="rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08] p-5 mb-5"
        style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-white text-[15px] font-semibold tracking-tight">Этапы</p>
          <span className="text-[#666] text-xs">
            {completedStages}/{totalStages} завершено
          </span>
        </div>

        <div className="space-y-3">
          {STAGES.slice(0, 6).map((stage, i) => {
            const isCompleted = i < currentStage;
            const isCurrent = i === currentStage;
            const stageProgress = isCompleted ? 100 : isCurrent ? 65 : 0;

            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: isCompleted
                          ? '#4cd96420'
                          : isCurrent
                            ? '#FF980020'
                            : 'rgba(255,255,255,0.06)',
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3 h-3 text-[#4cd964]" />
                      ) : isCurrent ? (
                        <Clock className="w-3 h-3 text-[#FF9800]" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium truncate ${
                        isCompleted
                          ? 'text-[#4cd964]'
                          : isCurrent
                            ? 'text-white'
                            : 'text-[#555]'
                      }`}
                    >
                      {stage.title}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-medium shrink-0 ml-2 ${
                      isCompleted
                        ? 'text-[#4cd964]'
                        : isCurrent
                          ? 'text-[#FF9800]'
                          : 'text-[#444]'
                    }`}
                  >
                    {stageProgress}%
                  </span>
                </div>
                <div className="h-[4px] bg-white/[0.06] rounded-full overflow-hidden ml-7">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${stageProgress}%`,
                      background: isCompleted
                        ? 'linear-gradient(90deg, #4cd964 0%, #34C759 100%)'
                        : isCurrent
                          ? 'linear-gradient(90deg, #FF9800 0%, #FFB74D 100%)'
                          : 'transparent',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {totalStages > 6 && (
          <Link
            href="/tma/stages"
            className="flex items-center justify-center gap-1 mt-4 text-[#666] text-xs active:text-white transition-colors"
          >
            <span>Все {totalStages} этапов</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* ═══════════ RECENT EVENTS ═══════════ */}
      <div className="mb-2">
        <p className="text-[#666] text-xs font-bold uppercase tracking-wider mb-3 px-1">
          Последние события
        </p>

        <div className="space-y-2">
          {RECENT_EVENTS.map((event, i) => {
            const Icon = event.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#1a1a1a] border border-white/[0.06]"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${event.color}15` }}
                >
                  <Icon className="w-[18px] h-[18px]" style={{ color: event.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{event.text}</p>
                  <p className="text-[#555] text-[11px] mt-0.5">{event.detail}</p>
                </div>
                <span className="text-[#555] text-xs shrink-0">{event.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
