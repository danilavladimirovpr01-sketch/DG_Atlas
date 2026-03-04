'use client';

import Link from 'next/link';
import { ArrowLeft, ChevronRight, Lock, Home, Brush, Zap, LayoutDashboard } from 'lucide-react';
import { SMETA_STAGES, STATUS_LABEL, STATUS_COLOR, type SmetaStage } from '@/lib/data/smeta-stages';

function fmt(n: number) { return n.toLocaleString('ru-RU'); }

const ICON_MAP = {
  home: Home,
  brush: Brush,
  zap: Zap,
  layout: LayoutDashboard,
};

function StageCard({ stage, index }: { stage: SmetaStage; index: number }) {
  const Icon = ICON_MAP[stage.iconName];
  const isActive = stage.status === 'active';
  const isLocked = stage.status === 'locked';
  const statusColor = STATUS_COLOR[stage.status];

  const inner = (
    <div
      className="rounded-[20px] bg-[#1a1a1a] border overflow-hidden transition-all active:scale-[0.99]"
      style={{
        borderColor: isActive ? `${stage.color}35` : 'rgba(255,255,255,0.06)',
        boxShadow: isActive ? `0 0 30px ${stage.color}12` : 'none',
        opacity: isLocked ? 0.5 : 1,
      }}
    >
      {/* Color stripe */}
      {isActive && <div className="h-0.5" style={{ background: stage.color }} />}

      <div className="flex items-center gap-3.5 px-4 py-4">
        {/* Order + icon */}
        <div className="relative shrink-0">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: isLocked ? 'rgba(255,255,255,0.04)' : `${stage.color}18` }}
          >
            {isLocked
              ? <Lock className="w-4 h-4 text-[#444]" />
              : <Icon className="w-5 h-5" style={{ color: stage.color }} />
            }
          </div>
          <div
            className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-black"
            style={{ background: isLocked ? '#222' : stage.color, color: isLocked ? '#555' : '#000' }}
          >
            {index + 1}
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[15px] font-semibold tracking-tight"
              style={{ color: isLocked ? '#555' : 'white' }}
            >
              {stage.label}
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{
                background: `${statusColor}18`,
                color: statusColor,
                border: `1px solid ${statusColor}30`,
              }}
            >
              {STATUS_LABEL[stage.status]}
            </span>
          </div>
          <p className="text-[#555] text-xs mt-0.5 truncate">{stage.sub}</p>
          {stage.total !== null ? (
            <p className="text-[#888] text-xs mt-1 font-medium">{fmt(stage.total)} ₽</p>
          ) : (
            <p className="text-[#333] text-xs mt-1">Смета не рассчитана</p>
          )}
        </div>

        {/* Right */}
        {isActive
          ? <ChevronRight className="w-4 h-4 text-[#555] shrink-0" />
          : isLocked
            ? null
            : <ChevronRight className="w-4 h-4 text-[#333] shrink-0" />
        }
      </div>
    </div>
  );

  if (isActive) {
    return <Link href={`/tma/budget/${stage.id}`}>{inner}</Link>;
  }
  return <div>{inner}</div>;
}

export default function BudgetHubPage() {
  const confirmedTotal = SMETA_STAGES.reduce((s, st) => s + (st.total ?? 0), 0);
  const confirmedPaid = SMETA_STAGES.reduce((s, st) => s + st.paid, 0);
  const paidPct = confirmedTotal > 0 ? Math.round((confirmedPaid / confirmedTotal) * 100) : 0;
  const stagesWithData = SMETA_STAGES.filter((s) => s.total !== null).length;

  return (
    <div className="min-h-screen bg-black pb-10">

      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <Link href="/tma" className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-white/[0.08] shrink-0">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight leading-tight">Сметы</h1>
          <p className="text-[#555] text-[11px] mt-0.5">Коркино МС · 4 этапа</p>
        </div>
      </div>

      <div className="px-4 space-y-4">

        {/* TOTAL SUMMARY CARD */}
        <div
          className="rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08] px-5 py-5"
          style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
        >
          <p className="text-[#555] text-[11px] uppercase tracking-wider mb-1">
            Подтверждено · {stagesWithData} из {SMETA_STAGES.length} этапов
          </p>
          <p className="text-white text-[30px] font-bold tracking-tight leading-none">
            {fmt(confirmedTotal)} ₽
          </p>
          <p className="text-[#555] text-xs mt-1">Итого по всем рассчитанным сметам</p>

          <div className="mt-4">
            <div className="h-2 bg-white/[0.07] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${paidPct}%`, background: 'linear-gradient(90deg, #4cd964 0%, #34C759 100%)' }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <p className="text-[#4cd964] text-xs font-medium">{paidPct}% оплачено · {fmt(confirmedPaid)} ₽</p>
              <p className="text-[#444] text-xs">Остаток: {fmt(confirmedTotal - confirmedPaid)} ₽</p>
            </div>
          </div>
        </div>

        {/* STAGE LIST */}
        <div>
          <p className="text-[#666] text-xs font-bold uppercase tracking-wider mb-3 px-1">Этапы строительства</p>
          <div className="space-y-2.5">
            {SMETA_STAGES.map((stage, i) => (
              <StageCard key={stage.id} stage={stage} index={i} />
            ))}
          </div>
        </div>

        {/* INFO */}
        <div className="px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
          <p className="text-[#444] text-xs leading-relaxed">
            Сметы по следующим этапам появятся после завершения текущего и подготовки проектной документации.
          </p>
        </div>

      </div>
    </div>
  );
}
