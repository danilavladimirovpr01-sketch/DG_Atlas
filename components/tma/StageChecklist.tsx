'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Circle,
  Clock,
  ChevronDown,
  ListChecks,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useTma } from '@/lib/tma-context';
import {
  STAGE_CHECKLISTS,
  getChecklistStats,
  type StageChecklist as StageChecklistType,
  type StageChecklistItem,
  type ChecklistItemStatus,
} from '@/lib/constants/checklist-items';

/* ─── Summary card ─── */
function SummaryCard({ currentStage }: { currentStage: number }) {
  const stats = getChecklistStats(currentStage);
  const pct = Math.round((stats.done / stats.total) * 100);

  return (
    <div
      className="px-5 py-5 rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08]"
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-white text-2xl font-bold tracking-tight">
            {stats.done}
            <span className="text-[#666] text-lg font-normal"> / {stats.total}</span>
          </p>
          <p className="text-[#666] text-xs mt-0.5">задач выполнено</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-[#FF9800]/10">
            <span className="text-[#FF9800] text-xs font-semibold">{stats.active}</span>
            <span className="text-[#FF9800]/60 text-[10px] ml-1">активных</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/[0.05]">
            <span className="text-[#666] text-xs font-semibold">{stats.upcoming}</span>
            <span className="text-[#555] text-[10px] ml-1">впереди</span>
          </div>
        </div>
      </div>
      <div className="h-[5px] bg-white/[0.08] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #4cd964 0%, #7ee08a 100%)',
          }}
        />
      </div>
      <p className="text-[#555] text-[10px] mt-1.5 text-right">{pct}% завершено</p>
    </div>
  );
}

/* ─── Filter tabs ─── */
type FilterMode = 'current' | 'all' | 'active';

function FilterTabs({
  mode,
  onChange,
  activeCount,
}: {
  mode: FilterMode;
  onChange: (m: FilterMode) => void;
  activeCount: number;
}) {
  const tabs: { id: FilterMode; label: string }[] = [
    { id: 'current', label: 'Текущий этап' },
    { id: 'active', label: `Срочные (${activeCount})` },
    { id: 'all', label: 'Все этапы' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors ${
            mode === tab.id
              ? 'bg-white text-black'
              : 'bg-[#1a1a1a] text-[#999] border border-white/[0.06] active:bg-[#222]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Single checklist item ─── */
function ChecklistRow({ item }: { item: StageChecklistItem }) {
  const statusConfig: Record<
    ChecklistItemStatus,
    { icon: JSX.Element; textClass: string; bgClass: string; borderClass: string }
  > = {
    done: {
      icon: <CheckCircle2 className="w-5 h-5 text-[#4cd964]" />,
      textClass: 'text-[#666] line-through',
      bgClass: 'bg-[#0d0d0d]',
      borderClass: 'border-white/[0.04]',
    },
    active: {
      icon: <Circle className="w-5 h-5 text-[#FF9800]/70" />,
      textClass: 'text-white',
      bgClass: 'bg-[#1a1a1a]',
      borderClass: 'border-white/[0.06]',
    },
    upcoming: {
      icon: <Circle className="w-5 h-5 text-[#333]" />,
      textClass: 'text-[#555]',
      bgClass: 'bg-[#0d0d0d]',
      borderClass: 'border-white/[0.04]',
    },
  };

  const cfg = statusConfig[item.status];

  return (
    <div
      className={`flex items-center justify-between px-4 py-3.5 rounded-2xl ${cfg.bgClass} border ${cfg.borderClass} transition-colors`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="shrink-0">{cfg.icon}</div>
        <div className="min-w-0 flex-1">
          <span className={`text-sm font-medium block truncate ${cfg.textClass}`}>
            {item.text}
          </span>
          {item.note && (
            <span className="text-[#555] text-xs block mt-0.5">{item.note}</span>
          )}
        </div>
      </div>
      {item.deadline && item.status === 'active' && (
        <div className="flex items-center gap-1.5 shrink-0 ml-3 px-2.5 py-1 rounded-full bg-[#FF9800]/10">
          <Clock className="w-3 h-3 text-[#FF9800]" />
          <span className="text-[#FF9800] text-[11px] font-medium">{item.deadline}</span>
        </div>
      )}
      {item.status === 'done' && (
        <Check className="w-4 h-4 text-[#4cd964]/50 shrink-0 ml-3" />
      )}
    </div>
  );
}

/* ─── Stage section (collapsible) ─── */
function StageSection({
  checklist,
  currentStage,
  defaultOpen,
}: {
  checklist: StageChecklistType;
  currentStage: number;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const isCompleted = checklist.stageNumber < currentStage;
  const isActive = checklist.stageNumber === currentStage;
  const isUpcoming = checklist.stageNumber > currentStage;

  const doneCount = checklist.items.filter((i) => i.status === 'done').length;
  const total = checklist.items.length;

  return (
    <div className={isUpcoming ? 'opacity-50' : ''}>
      {/* Section header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#111] border border-white/[0.06] active:bg-[#1a1a1a] transition-colors"
      >
        {/* Stage dot */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            isCompleted
              ? 'bg-white'
              : isActive
              ? 'bg-[#FF9800]/15 border-2 border-[#FF9800]'
              : 'bg-[#1a1a1a] border border-white/[0.08]'
          }`}
        >
          {isCompleted ? (
            <Check className="w-4 h-4 text-black" strokeWidth={3} />
          ) : (
            <span
              className={`text-[10px] font-bold ${
                isActive ? 'text-[#FF9800]' : 'text-[#555]'
              }`}
            >
              {checklist.stageNumber}
            </span>
          )}
        </div>

        {/* Title + progress */}
        <div className="flex-1 min-w-0 text-left">
          <p
            className={`text-sm font-semibold tracking-tight ${
              isActive ? 'text-white' : isCompleted ? 'text-white/80' : 'text-[#666]'
            }`}
          >
            {checklist.stageTitle}
          </p>
          <p className="text-[#555] text-[11px]">
            {doneCount} из {total} выполнено
          </p>
        </div>

        {/* Status badge */}
        {isCompleted && (
          <span className="shrink-0 bg-[#4cd964]/10 text-[#4cd964] text-[10px] px-2 py-0.5 rounded-full font-medium">
            Готово
          </span>
        )}
        {isActive && (
          <span className="shrink-0 bg-[#FF9800]/10 text-[#FF9800] text-[10px] px-2 py-0.5 rounded-full font-medium">
            Сейчас
          </span>
        )}

        {/* Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-[#555] shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Items */}
      {open && (
        <div className="space-y-1.5 mt-2 ml-2">
          {checklist.items.map((item) => (
            <ChecklistRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Urgent items panel ─── */
function UrgentPanel() {
  const urgentItems = STAGE_CHECKLISTS.flatMap((c) =>
    c.items
      .filter((i) => i.status === 'active')
      .map((i) => ({ ...i, stageTitle: c.stageTitle }))
  );

  if (urgentItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div
          className="w-16 h-16 rounded-[16px] bg-[#4cd964]/10 flex items-center justify-center mb-4"
        >
          <CheckCircle2 className="w-8 h-8 text-[#4cd964]" />
        </div>
        <p className="text-white text-lg font-semibold mb-1">Всё выполнено!</p>
        <p className="text-[#666] text-sm font-light">Нет задач, требующих внимания</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Alert banner */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-[#FF9800]/5 border border-[#FF9800]/15">
        <AlertCircle className="w-5 h-5 text-[#FF9800] mt-0.5 shrink-0" />
        <div>
          <p className="text-[#FF9800] text-sm font-semibold">
            {urgentItems.length} {urgentItems.length === 1 ? 'задача требует' : 'задач требуют'} внимания
          </p>
          <p className="text-[#999] text-xs mt-0.5">
            Выполните эти задачи, чтобы стройка шла без задержек
          </p>
        </div>
      </div>

      {/* Items grouped by stage */}
      <div className="space-y-1.5">
        {urgentItems.map((item) => (
          <div key={item.id}>
            <div className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-[#1a1a1a] border border-white/[0.06]">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Circle className="w-5 h-5 text-[#FF9800]/70 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-white text-sm font-medium block truncate">
                    {item.text}
                  </span>
                  <span className="text-[#555] text-[11px] block">{item.stageTitle}</span>
                </div>
              </div>
              {item.deadline && (
                <div className="flex items-center gap-1.5 shrink-0 ml-3 px-2.5 py-1 rounded-full bg-[#FF9800]/10">
                  <Clock className="w-3 h-3 text-[#FF9800]" />
                  <span className="text-[#FF9800] text-[11px] font-medium">
                    {item.deadline}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function StageChecklist() {
  const { project } = useTma();
  const currentStage = project?.current_stage ?? 5;

  const [filter, setFilter] = useState<FilterMode>('current');

  const activeCount = STAGE_CHECKLISTS.flatMap((c) => c.items).filter(
    (i) => i.status === 'active'
  ).length;

  // Current stage checklist
  const currentChecklist = STAGE_CHECKLISTS.find((c) => c.stageNumber === currentStage);

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/tma"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-white/[0.08] hover:bg-[#222] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white tracking-tight">Чек-листы</h1>
          <p className="text-[#666] text-xs">Задачи по этапам строительства</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#FF9800]/10 flex items-center justify-center">
          <ListChecks className="w-5 h-5 text-[#FF9800]" />
        </div>
      </div>

      {/* Summary */}
      <SummaryCard currentStage={currentStage} />

      {/* Filters */}
      <div className="mt-5 mb-5">
        <FilterTabs mode={filter} onChange={setFilter} activeCount={activeCount} />
      </div>

      {/* Content */}
      {filter === 'active' && <UrgentPanel />}

      {filter === 'current' && currentChecklist && (
        <div className="space-y-4">
          {/* Active items first */}
          {currentChecklist.items.some((i) => i.status === 'active') && (
            <div>
              <p className="text-[#FF9800] text-xs font-bold uppercase tracking-wider mb-3 px-1">
                Требуют действия
              </p>
              <div className="space-y-1.5">
                {currentChecklist.items
                  .filter((i) => i.status === 'active')
                  .map((item) => (
                    <ChecklistRow key={item.id} item={item} />
                  ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {currentChecklist.items.some((i) => i.status === 'upcoming') && (
            <div>
              <p className="text-[#666] text-xs font-bold uppercase tracking-wider mb-3 px-1">
                Предстоит
              </p>
              <div className="space-y-1.5">
                {currentChecklist.items
                  .filter((i) => i.status === 'upcoming')
                  .map((item) => (
                    <ChecklistRow key={item.id} item={item} />
                  ))}
              </div>
            </div>
          )}

          {/* Done */}
          {currentChecklist.items.some((i) => i.status === 'done') && (
            <div>
              <p className="text-[#4cd964]/60 text-xs font-bold uppercase tracking-wider mb-3 px-1">
                Выполнено
              </p>
              <div className="space-y-1.5">
                {currentChecklist.items
                  .filter((i) => i.status === 'done')
                  .map((item) => (
                    <ChecklistRow key={item.id} item={item} />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {filter === 'all' && (
        <div className="space-y-3">
          {STAGE_CHECKLISTS.map((checklist) => (
            <StageSection
              key={checklist.stageNumber}
              checklist={checklist}
              currentStage={currentStage}
              defaultOpen={checklist.stageNumber === currentStage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
