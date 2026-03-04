'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ChevronRight, AlertTriangle, Sparkles,
  Info, Building, Layers, Triangle, Sun,
  Droplets, AppWindow, Calendar,
} from 'lucide-react';
import {
  CATEGORIES, UPGRADES, MARKET_COMPARISON, SMETA_META,
  TOTAL, HIDDEN_TOTAL,
  type SmetaCategory,
} from '@/lib/data/smeta-mock';

function fmt(n: number) { return n.toLocaleString('ru-RU'); }
function fmtM(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace('.', ',')} M`;
  return `${Math.round(n / 1_000)} K`;
}

const ICON_MAP = { Building, Layers, Triangle, Sun, Droplets, AppWindow };

function AiModal({ text, onClose }: { text: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div
        className="relative w-full rounded-t-[28px] bg-[#111] border border-white/[0.08] p-6 pb-10"
        style={{ boxShadow: '0 -20px 60px rgba(0,0,0,0.7)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#FF9800]/15 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-[#FF9800]" />
          </div>
          <div>
            <p className="text-[#FF9800] text-xs font-semibold uppercase tracking-wider">AI‑объяснение</p>
            <p className="text-white text-[15px] font-semibold mt-0.5">Почему это нужно?</p>
          </div>
        </div>
        <p className="text-[#ccc] text-[15px] leading-relaxed font-light">{text}</p>
        <button
          onClick={onClose}
          className="mt-6 w-full py-3.5 rounded-2xl bg-[#1a1a1a] border border-white/[0.08] text-white text-sm font-medium active:bg-[#222] transition-colors"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}

function DonutChart({
  highlightId, onSegmentClick, upgradeExtra,
}: {
  highlightId: string | null;
  onSegmentClick: (id: string) => void;
  upgradeExtra: number;
}) {
  const total = TOTAL + upgradeExtra;
  let cursor = 0;
  const segments = CATEGORIES.map((cat) => {
    const deg = (cat.total / total) * 360;
    const start = cursor;
    cursor += deg;
    return { ...cat, deg, start };
  });
  const gradient = segments
    .map((s) => `${s.color} ${s.start.toFixed(1)}deg ${(s.start + s.deg).toFixed(1)}deg`)
    .join(', ');
  const active = segments.find((s) => s.id === highlightId);

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: `conic-gradient(${gradient})`, filter: 'blur(18px)', opacity: 0.18, transform: 'scale(1.12)' }}
          />
          <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(${gradient})` }} />
          <div className="absolute inset-[30px] rounded-full bg-black flex flex-col items-center justify-center">
            {active ? (
              <>
                <p className="text-white text-lg font-bold leading-tight">{fmtM(active.total)}</p>
                <p className="text-[#666] text-[10px] mt-0.5 text-center px-2 leading-tight">{active.label}</p>
                <p className="text-[#555] text-[9px] mt-0.5">{Math.round((active.total / total) * 100)}%</p>
              </>
            ) : (
              <>
                <p className="text-white text-xl font-bold leading-tight">{fmtM(total)}</p>
                <p className="text-[#666] text-[10px] mt-0.5">теплый контур</p>
                <p className="text-[#444] text-[9px] mt-0.5">{SMETA_META.pricePerSqm.toLocaleString('ru-RU')} ₽/м²</p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {segments.map((seg) => {
          const pct = Math.round((seg.total / total) * 100);
          const isActive = highlightId === seg.id;
          return (
            <button
              key={seg.id}
              onClick={() => onSegmentClick(seg.id)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all active:scale-[0.98] text-left"
              style={{
                background: isActive ? `${seg.color}12` : '#1a1a1a',
                borderColor: isActive ? `${seg.color}40` : 'rgba(255,255,255,0.06)',
              }}
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: seg.color, boxShadow: `0 0 6px ${seg.color}80` }} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-[12px] font-medium truncate leading-tight">{seg.label}</p>
                <p className="text-[#555] text-[10px] leading-tight mt-0.5">{pct}% · {fmtM(seg.total)}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MarketComparison() {
  return (
    <div className="rounded-[20px] bg-[#1a1a1a] border border-white/[0.08] px-5 py-5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-[#4cd964]" />
        <p className="text-white text-sm font-semibold">Сравнение с рынком</p>
        <span className="ml-auto text-[#555] text-[10px]">СПб, фев. 2025</span>
      </div>
      <div className="space-y-4">
        {MARKET_COMPARISON.map((row, i) => {
          const pct = Math.max(4, Math.min(96, ((row.ours - row.min) / (row.max - row.min)) * 100));
          const isLow = pct < 40;
          const isMid = pct >= 40 && pct <= 65;
          const dotColor = isLow || isMid ? '#4cd964' : '#FF9800';
          return (
            <div key={i}>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-[#999] text-xs">{row.label}</span>
                <span className="text-white text-xs font-semibold">{fmt(row.ours)} {row.unit}</span>
              </div>
              <div
                className="relative h-1.5 rounded-full overflow-visible"
                style={{ background: 'linear-gradient(90deg, rgba(76,217,100,0.25) 0%, rgba(255,152,0,0.25) 100%)' }}
              >
                <div
                  className="absolute w-3 h-3 rounded-full border-2 border-black -top-[3px] transition-all"
                  style={{ left: `${pct}%`, transform: 'translateX(-50%)', background: dotColor, boxShadow: `0 0 6px ${dotColor}80` }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[#444] text-[10px]">{fmt(row.min)}</span>
                <span className="text-[10px] font-medium" style={{ color: dotColor }}>
                  {isMid || isLow ? 'в рынке ✓' : 'выше среднего'}
                </span>
                <span className="text-[#444] text-[10px]">{fmt(row.max)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CategoryDetail({ cat, onAi }: { cat: SmetaCategory; onAi: (text: string) => void }) {
  const Icon = ICON_MAP[cat.iconName];
  const worksPct = cat.works > 0 ? Math.round((cat.works / cat.total) * 100) : 0;
  const matPct = 100 - worksPct;
  const hiddenItems = cat.items.filter((i) => i.hidden);
  const visibleItems = cat.items.filter((i) => !i.hidden);

  return (
    <div className="space-y-4">
      <div className="rounded-[20px] bg-[#1a1a1a] border border-white/[0.08] overflow-hidden" style={{ boxShadow: `0 0 40px ${cat.color}15` }}>
        <div className="h-1" style={{ background: cat.color }} />
        <div className="px-5 py-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#555] text-[11px] mb-1 uppercase tracking-wider">{cat.label}</p>
              <p className="text-white text-[28px] font-bold tracking-tight leading-none">{fmt(cat.total)} ₽</p>
              {cat.isHiddenCost && (
                <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-[#FF3B30]/15 text-[#FF3B30] text-[11px] font-semibold">
                  <AlertTriangle className="w-3 h-3" /> Скрытый расход
                </span>
              )}
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${cat.color}20`, border: `1px solid ${cat.color}30` }}>
              <Icon className="w-6 h-6" style={{ color: cat.color }} />
            </div>
          </div>
          {cat.works > 0 && (
            <div className="mt-5">
              <div className="flex rounded-lg overflow-hidden h-2 mb-2">
                <div style={{ width: `${worksPct}%`, background: cat.color }} />
                <div className="flex-1" style={{ background: 'rgba(255,255,255,0.10)' }} />
              </div>
              <div className="flex justify-between text-[11px]">
                <span style={{ color: cat.color }}>Работы {worksPct}% · {fmt(cat.works)} ₽</span>
                <span className="text-[#555]">Материалы {matPct}% · {fmt(cat.materials)} ₽</span>
              </div>
            </div>
          )}
          {cat.daysFrom && cat.daysTo && (
            <div className="flex items-center gap-2 mt-4 px-3 py-2 rounded-xl bg-white/[0.04]">
              <Calendar className="w-3.5 h-3.5 text-[#666]" />
              <span className="text-[#666] text-xs">День {cat.daysFrom}–{cat.daysTo} от старта · ~{cat.daysTo - cat.daysFrom} дней</span>
            </div>
          )}
        </div>
      </div>

      {cat.isHiddenCost && cat.hiddenExplain && (
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-[#FF3B30]/[0.08] border border-[#FF3B30]/25">
          <Info className="w-4 h-4 text-[#FF3B30] mt-0.5 shrink-0" />
          <p className="text-[#FF9999] text-[13px] leading-relaxed font-light">{cat.hiddenExplain}</p>
        </div>
      )}

      {visibleItems.length > 0 && (
        <div>
          <p className="text-[#666] text-xs font-bold uppercase tracking-wider mb-2 px-1">Состав</p>
          <div className="space-y-1.5">
            {visibleItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#1a1a1a] border border-white/[0.06]">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{item.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[#666] text-xs">{item.qty} {item.unit}</span>
                    {item.unitPrice && (<><span className="text-[#333] text-xs">·</span><span className="text-[#555] text-xs">{fmt(item.unitPrice)} ₽/{item.unit}</span></>)}
                  </div>
                </div>
                {item.amount && <span className="text-white text-sm font-semibold shrink-0 mr-1">{fmt(item.amount)} ₽</span>}
                <button onClick={() => onAi(item.aiText)} className="w-8 h-8 rounded-full bg-[#FF9800]/10 border border-[#FF9800]/20 flex items-center justify-center shrink-0 active:bg-[#FF9800]/20 transition-colors">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF9800]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {hiddenItems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <AlertTriangle className="w-3 h-3 text-[#FF9800]" />
            <p className="text-[#FF9800] text-xs font-bold uppercase tracking-wider">Скрытые позиции · {hiddenItems.length} шт</p>
          </div>
          <div className="space-y-1.5">
            {hiddenItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#1a1a1a] border border-[#FF9800]/[0.25]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF9800] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{item.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[#666] text-xs">{item.qty} {item.unit}</span>
                    {item.unitPrice && (<><span className="text-[#333] text-xs">·</span><span className="text-[#555] text-xs">{fmt(item.unitPrice)} ₽/{item.unit}</span></>)}
                  </div>
                </div>
                {item.amount && <span className="text-white text-sm font-semibold shrink-0 mr-1">{fmt(item.amount)} ₽</span>}
                <button onClick={() => onAi(item.aiText)} className="w-8 h-8 rounded-full bg-[#FF9800]/10 border border-[#FF9800]/20 flex items-center justify-center shrink-0 active:bg-[#FF9800]/20 transition-colors">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF9800]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SMETA WARM FRAME — основной компонент
   backHref: куда вести стрелку "назад"
   ═══════════════════════════════════════════════════════ */
export default function SmetaWarmFrame({ backHref }: { backHref: string }) {
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [aiText, setAiText] = useState<string | null>(null);
  const [enabledUpgrades, setEnabledUpgrades] = useState<Set<string>>(new Set());
  const [visible, setVisible] = useState(true);

  const upgradeExtra = Array.from(enabledUpgrades).reduce(
    (sum, id) => sum + (UPGRADES.find((u) => u.id === id)?.amount ?? 0), 0
  );
  const totalWithUpgrades = TOTAL + upgradeExtra;
  const paidPct = Math.round((SMETA_META.paid / totalWithUpgrades) * 100);
  const activeCat = CATEGORIES.find((c) => c.id === activeCategory) ?? null;

  function navigateTo(id: string | null) {
    setVisible(false);
    setTimeout(() => {
      setActiveCategory(id);
      if (id) setHighlightId(id);
      setVisible(true);
    }, 160);
  }

  function toggleUpgrade(id: string) {
    setEnabledUpgrades((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-black pb-10">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4">
        <div className="flex items-center gap-3">
          {activeCat ? (
            <button onClick={() => navigateTo(null)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-white/[0.08]">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          ) : (
            <Link href={backHref} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-white/[0.08]">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
          )}
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
              {activeCat ? activeCat.label : 'Тёплый контур'}
            </h1>
            {!activeCat && (
              <p className="text-[#555] text-[11px] mt-0.5">
                {SMETA_META.object} · {SMETA_META.version} · {SMETA_META.date}
              </p>
            )}
          </div>
        </div>
        {!activeCat && (
          <button
            onClick={() => navigateTo('engineering')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF3B30]/15 border border-[#FF3B30]/25 active:bg-[#FF3B30]/25"
          >
            <AlertTriangle className="w-3 h-3 text-[#FF3B30]" />
            <span className="text-[#FF3B30] text-[11px] font-semibold">Скрытые</span>
          </button>
        )}
      </div>

      {/* ANIMATED CONTENT */}
      <div
        className="px-4 space-y-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : (activeCat ? 'translateX(8px)' : 'translateX(-8px)'),
          transition: 'opacity 0.15s ease, transform 0.15s ease',
        }}
      >
        {activeCat ? (
          <CategoryDetail cat={activeCat} onAi={setAiText} />
        ) : (
          <>
            {/* SUMMARY CARD */}
            <div className="rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08] px-5 py-5" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-[#555] text-[11px] uppercase tracking-wider">{SMETA_META.object} · {SMETA_META.area} м²</p>
                  <p className="text-white text-[28px] font-bold tracking-tight leading-none mt-1">
                    {fmt(upgradeExtra > 0 ? totalWithUpgrades : TOTAL)} ₽
                  </p>
                  <p className="text-[#666] text-xs mt-1">{SMETA_META.pricePerSqm.toLocaleString('ru-RU')} ₽/м² · теплый контур</p>
                  {upgradeExtra > 0 && <p className="text-[#FF9800] text-xs mt-0.5">+{fmt(upgradeExtra)} ₽ с апгрейдами</p>}
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-[#4cd964] text-xs font-medium uppercase tracking-wide">Оплачено</p>
                  <p className="text-white text-xl font-bold mt-0.5">{fmt(SMETA_META.paid)} ₽</p>
                  <p className="text-[#555] text-xs mt-0.5">Остаток: {fmt(totalWithUpgrades - SMETA_META.paid)} ₽</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-white/[0.07] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${paidPct}%`, background: 'linear-gradient(90deg, #4cd964 0%, #34C759 100%)' }} />
                </div>
                <p className="text-[#4cd964] text-xs font-medium mt-1.5">{paidPct}% оплачено</p>
              </div>
            </div>

            {/* HIDDEN COSTS BANNER */}
            <div className="rounded-[20px] bg-[#FF3B30]/[0.08] border border-[#FF3B30]/25 px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-[#FF3B30]" />
                <p className="text-[#FF3B30] text-sm font-bold">Конкуренты скрывают от вас</p>
              </div>
              <p className="text-white text-[28px] font-bold tracking-tight">{fmt(HIDDEN_TOTAL)} ₽</p>
              <p className="text-[#999] text-[13px] mt-1.5 leading-relaxed font-light">
                Дренаж, ливнёвка и отмостка — в чужих сметах этого нет. Поэтому их цена выглядит дешевле.
              </p>
              <button onClick={() => navigateTo('engineering')} className="flex items-center gap-1 mt-3 text-[#FF3B30] text-xs font-semibold active:opacity-70">
                Посмотреть детали <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* DONUT */}
            <DonutChart
              highlightId={highlightId}
              onSegmentClick={(id) => setHighlightId((p) => (p === id ? null : id))}
              upgradeExtra={upgradeExtra}
            />

            {/* CATEGORY LIST */}
            <div>
              <p className="text-[#666] text-xs font-bold uppercase tracking-wider mb-2 px-1">Разбивка по разделам</p>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => {
                  const pct = Math.round((cat.total / TOTAL) * 100);
                  const hiddenCount = cat.items.filter((i) => i.hidden).length;
                  const Icon = ICON_MAP[cat.iconName];
                  const isActive = highlightId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => navigateTo(cat.id)}
                      className="w-full text-left rounded-[20px] bg-[#1a1a1a] overflow-hidden active:scale-[0.99] transition-all border"
                      style={{
                        borderColor: cat.isHiddenCost ? 'rgba(255,59,48,0.3)' : 'rgba(255,255,255,0.07)',
                        boxShadow: isActive ? `0 0 0 1.5px ${cat.color}50` : 'none',
                      }}
                    >
                      <div className="flex items-center gap-3 px-4 py-4">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${cat.color}18` }}>
                          <Icon className="w-[18px] h-[18px]" style={{ color: cat.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-white text-[15px] font-semibold tracking-tight">{cat.label}</span>
                            {cat.isHiddenCost && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#FF3B30]/15 text-[#FF3B30] text-[10px] font-bold">
                                <AlertTriangle className="w-2.5 h-2.5" /> скрытый
                              </span>
                            )}
                            {!cat.isHiddenCost && hiddenCount > 0 && (
                              <span className="px-1.5 py-0.5 rounded-full bg-[#FF9800]/15 text-[#FF9800] text-[10px] font-semibold">!{hiddenCount}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cat.color }} />
                            </div>
                            <span className="text-[#555] text-[10px] shrink-0 w-6 text-right">{pct}%</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-1">
                          <p className="text-white text-sm font-bold">{fmt(cat.total)} ₽</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#555] shrink-0" />
                      </div>
                      {cat.isHiddenCost && (
                        <div className="mx-4 mb-3 -mt-1 px-3 py-2 rounded-xl bg-[#FF3B30]/[0.08] border border-[#FF3B30]/15">
                          <p className="text-[#FF9090] text-[11px] leading-relaxed">Конкуренты не включают это в базовую цену.</p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* UPGRADES */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-[#666] text-xs font-bold uppercase tracking-wider">Можно добавить</p>
                {upgradeExtra > 0 && <span className="text-[#FF9800] text-xs font-semibold">+{fmt(upgradeExtra)} ₽</span>}
              </div>
              <div className="space-y-2">
                {UPGRADES.map((u) => {
                  const on = enabledUpgrades.has(u.id);
                  const relCat = CATEGORIES.find((c) => c.id === u.categoryId);
                  return (
                    <div key={u.id} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#1a1a1a] border transition-all" style={{ borderColor: on ? 'rgba(255,152,0,0.3)' : 'rgba(255,255,255,0.06)' }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium">{u.label}</span>
                          {u.popular && <span className="px-1.5 py-0.5 rounded-full bg-[#FF9800]/15 text-[#FF9800] text-[10px] font-semibold">топ</span>}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <p className="text-[#666] text-xs">{u.sub}</p>
                          {relCat && (<><span className="text-[#333] text-[10px]">·</span><span className="text-[#444] text-[10px]">{relCat.label}</span></>)}
                        </div>
                      </div>
                      <span className="text-[#999] text-sm font-medium shrink-0">+{fmt(u.amount)} ₽</span>
                      <button
                        onClick={() => toggleUpgrade(u.id)}
                        className="w-12 h-6 rounded-full transition-all shrink-0 relative"
                        style={{ background: on ? '#FF9800' : '#2a2a2a', border: on ? '1px solid rgba(255,152,0,0.4)' : '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200" style={{ left: on ? '23px' : '2px' }} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MARKET COMPARISON */}
            <MarketComparison />
          </>
        )}
      </div>

      {aiText && <AiModal text={aiText} onClose={() => setAiText(null)} />}
    </div>
  );
}
