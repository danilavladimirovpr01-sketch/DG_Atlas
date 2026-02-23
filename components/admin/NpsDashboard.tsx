'use client';

import { useState, useMemo } from 'react';
import { STAGES } from '@/lib/constants/stages';
import { POSITION_LABELS, NPS_QUESTIONS } from '@/lib/constants/nps-questions';
import type { EmployeePosition } from '@/types';
import {
  TrendingUp, TrendingDown, Users, AlertTriangle, Star, BarChart3,
  Activity, DollarSign, MessageCircleWarning, Info,
  ChevronDown, ChevronRight, Clock, CheckCircle2, AlertCircle,
  Zap,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, PieChart, Pie, Cell,
  Area, Line, ComposedChart,
} from 'recharts';

// ============================================================================
// TYPES
// ============================================================================

interface NpsResponseItem {
  id: string;
  clientId?: string;
  stage: number;
  score: number;
  comment: string | null;
  answers: Record<string, number | string>;
  employeeName: string | null;
  employeePosition: string | null;
  clientName: string | null;
  createdAt: string;
}

interface Props {
  responses: NpsResponseItem[];
  totalClients: number;
  totalProjects: number;
}

type Period = '7d' | '30d' | '90d' | 'all';

// ============================================================================
// DEMO DATA GENERATOR
// ============================================================================

function generateDemoData(): NpsResponseItem[] {
  const names = [
    'Алексей Иванов', 'Мария Козлова', 'Сергей Николаев', 'Ольга Петрова',
    'Дмитрий Сидоров', 'Елена Волкова', 'Андрей Морозов', 'Наталья Лебедева',
    'Игорь Новиков', 'Татьяна Соколова', 'Артём Кузнецов', 'Анна Попова',
    'Максим Васильев', 'Ирина Зайцева', 'Павел Голубев', 'Юлия Виноградова',
  ];
  const employees = [
    { name: 'Иван Строков', pos: 'foreman' },
    { name: 'Пётр Каменев', pos: 'foreman' },
    { name: 'Алексей Кровлёв', pos: 'foreman' },
    { name: 'Михаил Фасадов', pos: 'foreman' },
    { name: 'Сергей Планов', pos: 'manager' },
    { name: 'Ольга Проектова', pos: 'architect' },
    { name: 'Дмитрий Надзоров', pos: 'project_manager' },
    { name: 'Анна Сметина', pos: 'manager' },
  ];
  const comments: Record<string, string[]> = {
    good: [
      'Всё отлично, рекомендую!', 'Профессиональная команда', 'Быстро и качественно',
      'Очень доволен результатом', 'Превзошли ожидания', 'Спасибо за работу!',
      'Качество на высоте', 'Рекомендую знакомым',
    ],
    mid: [
      'В целом нормально, но есть мелкие недочёты', 'Можно было бы быстрее',
      'Качество хорошее, но коммуникация хромает', 'Есть к чему стремиться',
    ],
    bad: [
      'Задержка на 2 недели, никто не предупредил', 'Мусор не убрали после работ',
      'Не отвечали на звонки 3 дня', 'Пришлось переделывать штукатурку',
      'Материалы пришли с дефектом', 'Бригада опаздывала каждый день',
      'Сроки сорваны, качество низкое', 'Не соответствует проекту',
    ],
  };

  const demo: NpsResponseItem[] = [];
  const now = Date.now();

  for (let i = 0; i < 120; i++) {
    const stage = Math.floor(Math.random() * 15);
    // Weighted score: stages 5,6,8 tend to be lower (construction issues)
    let baseScore: number;
    if ([5, 6, 8].includes(stage)) {
      baseScore = Math.random() > 0.4 ? Math.floor(Math.random() * 4) + 5 : Math.floor(Math.random() * 3) + 8;
    } else if ([0, 1, 13, 14].includes(stage)) {
      baseScore = Math.random() > 0.2 ? Math.floor(Math.random() * 3) + 8 : Math.floor(Math.random() * 4) + 4;
    } else {
      baseScore = Math.floor(Math.random() * 5) + 5 + Math.floor(Math.random() * 2);
    }
    const score = Math.max(0, Math.min(10, baseScore));
    const emp = employees[Math.floor(Math.random() * employees.length)];
    const commentPool = score >= 9 ? comments.good : score >= 7 ? comments.mid : comments.bad;
    const hasComment = Math.random() > 0.3;
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date(now - daysAgo * 86400000);

    demo.push({
      id: `demo-${i}`,
      clientId: `demo-client-${i % names.length}`,
      stage,
      score,
      comment: hasComment ? commentPool[Math.floor(Math.random() * commentPool.length)] : null,
      answers: {},
      employeeName: emp.name,
      employeePosition: emp.pos,
      clientName: names[i % names.length],
      createdAt: date.toISOString(),
    });
  }
  return demo;
}

// ============================================================================
// HELPERS
// ============================================================================

const COLORS = {
  green: '#22c55e',
  lime: '#84cc16',
  yellow: '#eab308',
  orange: '#f97316',
  red: '#ef4444',
  blue: '#3b82f6',
  cyan: '#06b6d4',
  purple: '#a855f7',
  zinc: '#3f3f46',
  zinc700: '#3f3f46',
  zinc800: '#27272a',
  white: '#ffffff',
};

const PERIOD_LABELS: Record<Period, string> = {
  '7d': '7 дней',
  '30d': '30 дней',
  '90d': '90 дней',
  all: 'Всё время',
};

function stageName(stage: number) {
  return STAGES[stage]?.title || `Этап ${stage}`;
}

function stageShortName(stage: number) {
  const name = STAGES[stage]?.title || `${stage}`;
  return name.length > 12 ? name.slice(0, 12) + '…' : name;
}

function scoreColor(score: number) {
  if (score >= 8) return 'text-green-400';
  if (score >= 6) return 'text-yellow-400';
  return 'text-red-400';
}

function npsColor(score: number) {
  if (score >= 50) return 'text-green-400';
  if (score >= 0) return 'text-yellow-400';
  return 'text-red-400';
}

function npsBgGradient(score: number) {
  if (score >= 50) return 'from-green-500/10 to-green-500/5 border-green-500/20';
  if (score >= 0) return 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/20';
  return 'from-red-500/10 to-red-500/5 border-red-500/20';
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });
}

function getQuestionLabel(stage: number, key: string): string {
  const config = NPS_QUESTIONS[stage];
  if (!config) return key;
  const q = config.questions.find((q) => q.key === key);
  return q?.label || key;
}

function filterByPeriod(responses: NpsResponseItem[], period: Period): NpsResponseItem[] {
  if (period === 'all') return responses;
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const cutoff = Date.now() - days * 86400000;
  return responses.filter((r) => new Date(r.createdAt).getTime() >= cutoff);
}

function calcNps(responses: NpsResponseItem[]) {
  const total = responses.length;
  if (total === 0) return { npsScore: 0, avgScore: 0, promoters: 0, passives: 0, detractors: 0, total: 0 };
  const promoters = responses.filter((r) => r.score >= 9).length;
  const detractors = responses.filter((r) => r.score <= 6).length;
  const passives = total - promoters - detractors;
  const npsScore = Math.round(((promoters - detractors) / total) * 100);
  const avgScore = Math.round((responses.reduce((s, r) => s + r.score, 0) / total) * 10) / 10;
  return { npsScore, avgScore, promoters, passives, detractors, total };
}

// ============================================================================
// CUSTOM TOOLTIP
// ============================================================================

// ============================================================================
// INFO TOOLTIP
// ============================================================================

function InfoTooltip({ title, text }: { title: string; text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex">
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(!open)}
        className="w-4 h-4 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors cursor-help"
        aria-label="Подробнее"
      >
        <Info className="w-3 h-3 text-zinc-500" />
      </button>
      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 pointer-events-none">
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 shadow-2xl text-left">
            <p className="text-zinc-200 text-xs font-semibold mb-1">{title}</p>
            <p className="text-zinc-400 text-xs leading-relaxed whitespace-pre-line">{text}</p>
          </div>
          <div className="w-2 h-2 bg-zinc-800 border-r border-b border-zinc-700 rotate-45 mx-auto -mt-1" />
        </div>
      )}
    </div>
  );
}

function SectionInfo({ title, text }: { title: string; text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex">
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(!open)}
        className="w-5 h-5 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors cursor-help ml-1.5"
        aria-label="Подробнее"
      >
        <Info className="w-3.5 h-3.5 text-zinc-500" />
      </button>
      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 pointer-events-none">
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 shadow-2xl text-left">
            <p className="text-zinc-200 text-xs font-semibold mb-1">{title}</p>
            <p className="text-zinc-400 text-xs leading-relaxed whitespace-pre-line">{text}</p>
          </div>
          <div className="w-2 h-2 bg-zinc-800 border-r border-b border-zinc-700 rotate-45 mx-auto -mt-1" />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// KPI CARD
// ============================================================================

function KpiCard({
  icon: Icon, label, value, sub, trend, colorClass, bgClass, info,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  sub?: string | null;
  trend?: { value: number; label: string } | null;
  colorClass: string;
  bgClass: string;
  info?: { title: string; text: string };
}) {
  return (
    <div className={`rounded-2xl p-5 border bg-gradient-to-br ${bgClass} relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-full -translate-y-8 translate-x-8" />
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <p className="text-zinc-400 text-sm font-medium">{label}</p>
          {info && <InfoTooltip title={info.title} text={info.text} />}
        </div>
        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center backdrop-blur-sm">
          <Icon className="w-4.5 h-4.5 text-zinc-400" />
        </div>
      </div>
      <p className={`text-3xl font-bold tracking-tight ${colorClass}`}>{value}</p>
      <div className="flex items-center gap-2 mt-1.5">
        {sub && <p className="text-zinc-500 text-sm">{sub}</p>}
        {trend && (
          <span className={`text-xs font-medium flex items-center gap-0.5 ${trend.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend.value >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value >= 0 ? '+' : ''}{trend.value} {trend.label}
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// NPS GAUGE (modern)
// ============================================================================

function NpsGauge({ score }: { score: number }) {
  const normalizedScore = Math.max(-100, Math.min(100, score));
  const percentage = ((normalizedScore + 100) / 200) * 100;
  const color = normalizedScore >= 50 ? COLORS.green : normalizedScore >= 0 ? COLORS.yellow : COLORS.red;
  const data = [{ value: percentage, fill: color }];

  return (
    <div className="relative w-full h-44">
      <ResponsiveContainer>
        <RadialBarChart
          cx="50%" cy="85%"
          innerRadius="65%" outerRadius="95%"
          startAngle={180} endAngle={0}
          barSize={14}
          data={data}
        >
          <RadialBar
            background={{ fill: COLORS.zinc800 }}
            dataKey="value"
            cornerRadius={7}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-6">
        <span className="text-5xl font-black tracking-tight" style={{ color }}>{score}</span>
        <span className="text-zinc-500 text-xs font-medium mt-0.5">NPS SCORE</span>
      </div>
      {/* Scale labels */}
      <div className="absolute bottom-2 left-[10%] text-zinc-600 text-[10px]">-100</div>
      <div className="absolute bottom-2 right-[10%] text-zinc-600 text-[10px]">+100</div>
    </div>
  );
}

// ============================================================================
// SCORE DISTRIBUTION HISTOGRAM (0-10)
// ============================================================================

function ScoreHistogram({ responses }: { responses: NpsResponseItem[] }) {
  const data = useMemo(() => {
    const counts = Array(11).fill(0);
    for (const r of responses) counts[r.score]++;
    return counts.map((count, score) => ({
      score: String(score),
      count,
      fill: score >= 9 ? COLORS.green : score >= 7 ? COLORS.yellow : COLORS.red,
    }));
  }, [responses]);

  return (
    <div className="h-52">
      <ResponsiveContainer>
        <BarChart data={data} barCategoryGap="15%">
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis dataKey="score" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
          <Tooltip content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            const score = Number(label);
            const cat = score >= 9 ? 'Промоутер' : score >= 7 ? 'Нейтральный' : 'Критик';
            return (
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 shadow-2xl">
                <p className="text-zinc-400 text-xs">Оценка {label} — {cat}</p>
                <p className="text-white font-bold text-lg">{payload[0].value} ответов</p>
              </div>
            );
          }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============================================================================
// NPS TREND LINE (actual NPS over time, not avg score)
// ============================================================================

function NpsTrendChart({ responses }: { responses: NpsResponseItem[] }) {
  const data = useMemo(() => {
    if (responses.length === 0) return [];
    const sorted = [...responses].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const weekMap: Record<string, NpsResponseItem[]> = {};
    for (const r of sorted) {
      const d = new Date(r.createdAt);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().split('T')[0];
      if (!weekMap[key]) weekMap[key] = [];
      weekMap[key].push(r);
    }
    return Object.entries(weekMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-16)
      .map(([, items]) => {
        const { npsScore, avgScore } = calcNps(items);
        const label = new Date(items[0].createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        return { name: label, nps: npsScore, avg: avgScore, count: items.length };
      });
  }, [responses]);

  if (data.length < 2) return <div className="h-56 flex items-center justify-center text-zinc-500 text-sm">Недостаточно данных</div>;

  return (
    <div className="h-56">
      <ResponsiveContainer>
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="npsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.cyan} stopOpacity={0.2} />
              <stop offset="100%" stopColor={COLORS.cyan} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="nps" domain={[-100, 100]} tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
          <YAxis yAxisId="avg" orientation="right" domain={[0, 10]} tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} width={25} />
          <Tooltip content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 shadow-2xl">
                <p className="text-zinc-400 text-xs mb-1">{label}</p>
                {payload.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color as string }} />
                    <span className="text-white font-semibold">{String(p.value)}</span>
                    <span className="text-zinc-500 text-xs">{p.name === 'nps' ? 'NPS' : 'Ср. оценка'}</span>
                  </div>
                ))}
              </div>
            );
          }} />
          <Area yAxisId="nps" type="monotone" dataKey="nps" stroke={COLORS.cyan} fill="url(#npsGrad)" strokeWidth={2.5} name="nps" dot={false} />
          <Line yAxisId="avg" type="monotone" dataKey="avg" stroke={COLORS.purple} strokeWidth={2} strokeDasharray="4 4" name="avg" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 rounded bg-cyan-500" />
          <span className="text-zinc-500 text-xs">NPS Score</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 rounded bg-purple-500 opacity-60" style={{ borderTop: '1px dashed' }} />
          <span className="text-zinc-500 text-xs">Ср. оценка</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STACKED BAR BY STAGES
// ============================================================================

function StagesStackedChart({ responses }: { responses: NpsResponseItem[] }) {
  const data = useMemo(() => {
    const map: Record<number, { promoters: number; passives: number; detractors: number }> = {};
    for (const r of responses) {
      if (!map[r.stage]) map[r.stage] = { promoters: 0, passives: 0, detractors: 0 };
      if (r.score >= 9) map[r.stage].promoters++;
      else if (r.score >= 7) map[r.stage].passives++;
      else map[r.stage].detractors++;
    }
    return Object.entries(map)
      .map(([stage, counts]) => ({
        stage: Number(stage),
        name: stageShortName(Number(stage)),
        fullName: stageName(Number(stage)),
        ...counts,
        total: counts.promoters + counts.passives + counts.detractors,
      }))
      .sort((a, b) => a.stage - b.stage);
  }, [responses]);

  if (data.length === 0) return <div className="h-72 flex items-center justify-center text-zinc-500">Нет данных</div>;

  return (
    <div className="h-72">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
          <XAxis type="number" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={false} tickLine={false} width={100} />
          <Tooltip content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0]?.payload;
            if (!d) return null;
            return (
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 shadow-2xl">
                <p className="text-zinc-300 text-sm font-medium mb-1">{d.fullName}</p>
                <div className="space-y-0.5 text-xs">
                  <p className="text-green-400">Промоутеры: {d.promoters}</p>
                  <p className="text-yellow-400">Нейтральные: {d.passives}</p>
                  <p className="text-red-400">Критики: {d.detractors}</p>
                </div>
              </div>
            );
          }} />
          <Bar dataKey="promoters" stackId="a" fill={COLORS.green} fillOpacity={0.8} radius={[0, 0, 0, 0]} name="Промоутеры" />
          <Bar dataKey="passives" stackId="a" fill={COLORS.yellow} fillOpacity={0.8} name="Нейтральные" />
          <Bar dataKey="detractors" stackId="a" fill={COLORS.red} fillOpacity={0.8} radius={[0, 4, 4, 0]} name="Критики" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============================================================================
// HEATMAP — STAGES x EMPLOYEES
// ============================================================================

function Heatmap({ responses }: { responses: NpsResponseItem[] }) {
  const { employees, stages, matrix } = useMemo(() => {
    const empSet = new Set<string>();
    const stageSet = new Set<number>();
    const map: Record<string, Record<number, { total: number; count: number }>> = {};

    for (const r of responses) {
      const emp = r.employeeName || 'Неизвестен';
      empSet.add(emp);
      stageSet.add(r.stage);
      if (!map[emp]) map[emp] = {};
      if (!map[emp][r.stage]) map[emp][r.stage] = { total: 0, count: 0 };
      map[emp][r.stage].total += r.score;
      map[emp][r.stage].count++;
    }

    return {
      employees: Array.from(empSet).sort(),
      stages: Array.from(stageSet).sort((a, b) => a - b),
      matrix: map,
    };
  }, [responses]);

  if (employees.length === 0 || stages.length === 0) {
    return <div className="h-48 flex items-center justify-center text-zinc-500">Нет данных</div>;
  }

  function heatColor(avg: number): string {
    if (avg >= 9) return 'bg-green-500/80';
    if (avg >= 8) return 'bg-green-500/50';
    if (avg >= 7) return 'bg-yellow-500/50';
    if (avg >= 6) return 'bg-yellow-500/30';
    if (avg >= 4) return 'bg-orange-500/50';
    return 'bg-red-500/60';
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-left text-zinc-500 font-medium py-2 pr-3 sticky left-0 bg-zinc-900">Сотрудник</th>
            {stages.map((s) => (
              <th key={s} className="text-center text-zinc-500 font-medium py-2 px-1 min-w-[36px]">
                <span className="block truncate max-w-[50px]" title={stageName(s)}>{s}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp}>
              <td className="text-zinc-300 py-1.5 pr-3 sticky left-0 bg-zinc-900 font-medium whitespace-nowrap max-w-[120px] truncate" title={emp}>
                {emp.split(' ').slice(0, 2).join(' ')}
              </td>
              {stages.map((s) => {
                const cell = matrix[emp]?.[s];
                if (!cell) return <td key={s} className="p-1"><div className="w-8 h-8 rounded-md bg-zinc-800/50" /></td>;
                const avg = Math.round((cell.total / cell.count) * 10) / 10;
                return (
                  <td key={s} className="p-1">
                    <div
                      className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-white ${heatColor(avg)} transition-all hover:scale-110 cursor-default`}
                      title={`${emp} — ${stageName(s)}: ${avg} (${cell.count} отв.)`}
                    >
                      {avg.toFixed(0)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// EMPLOYEE RANKING
// ============================================================================

function EmployeeRanking({ responses }: { responses: NpsResponseItem[] }) {
  const employees = useMemo(() => {
    const map: Record<string, { pos: string; total: number; count: number }> = {};
    for (const r of responses) {
      if (!r.employeeName) continue;
      if (!map[r.employeeName]) map[r.employeeName] = { pos: r.employeePosition || '', total: 0, count: 0 };
      map[r.employeeName].total += r.score;
      map[r.employeeName].count++;
    }
    return Object.entries(map)
      .map(([name, s]) => ({
        name,
        position: s.pos,
        avg: Math.round((s.total / s.count) * 10) / 10,
        count: s.count,
        nps: (() => {
          const empResponses = responses.filter((r) => r.employeeName === name);
          const p = empResponses.filter((r) => r.score >= 9).length;
          const d = empResponses.filter((r) => r.score <= 6).length;
          return empResponses.length > 0 ? Math.round(((p - d) / empResponses.length) * 100) : 0;
        })(),
      }))
      .sort((a, b) => b.nps - a.nps);
  }, [responses]);

  if (employees.length === 0) return <div className="h-48 flex items-center justify-center text-zinc-500">Нет данных</div>;

  return (
    <div className="space-y-2">
      {employees.map((emp, i) => (
        <div key={emp.name} className="flex items-center gap-3 py-2 px-1 rounded-lg hover:bg-zinc-800/50 transition-colors">
          <span className={`w-6 text-center font-bold text-sm ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-zinc-300' : i === 2 ? 'text-orange-400' : 'text-zinc-600'}`}>
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-200 text-sm font-medium">{emp.name}</p>
                <p className="text-zinc-600 text-xs">
                  {POSITION_LABELS[emp.position as EmployeePosition] || emp.position} · {emp.count} оценок
                </p>
              </div>
              <div className="text-right">
                <span className={`text-lg font-bold ${npsColor(emp.nps)}`}>{emp.nps}</span>
                <p className="text-zinc-600 text-[10px]">NPS</p>
              </div>
            </div>
            <div className="mt-1.5 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.max(5, ((emp.nps + 100) / 200) * 100)}%`,
                  backgroundColor: emp.nps >= 50 ? COLORS.green : emp.nps >= 0 ? COLORS.yellow : COLORS.red,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// DETRACTOR COMMENTS (Closed-Loop)
// ============================================================================

function DetractorPanel({ responses }: { responses: NpsResponseItem[] }) {
  const detractors = useMemo(() =>
    responses
      .filter((r) => r.score <= 6)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 15),
    [responses]
  );

  if (detractors.length === 0) {
    return (
      <div className="h-48 flex flex-col items-center justify-center text-zinc-500 gap-2">
        <CheckCircle2 className="w-8 h-8 text-green-500/50" />
        <span className="text-sm">Нет критиков — отличная работа!</span>
      </div>
    );
  }

  // Simulate closed-loop statuses for demo
  const statuses = ['new', 'in_progress', 'resolved'] as const;
  const statusConfig = {
    new: { label: 'Новый', icon: AlertCircle, color: 'text-red-400 bg-red-500/10' },
    in_progress: { label: 'В работе', icon: Clock, color: 'text-yellow-400 bg-yellow-500/10' },
    resolved: { label: 'Решён', icon: CheckCircle2, color: 'text-green-400 bg-green-500/10' },
  };

  return (
    <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
      {detractors.map((r, i) => {
        const status = statuses[i % 3]; // Demo rotation
        const cfg = statusConfig[status];
        const StatusIcon = cfg.icon;
        return (
          <div key={r.id} className="px-4 py-3 rounded-xl bg-zinc-800/30 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-red-400 font-bold text-lg">{r.score}</span>
                  <span className="text-zinc-300 text-sm font-medium">{r.clientName || 'Клиент'}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${cfg.color}`}>
                    <StatusIcon className="w-3 h-3" /> {cfg.label}
                  </span>
                </div>
                <p className="text-zinc-500 text-xs mt-0.5">
                  {stageName(r.stage)} · {r.employeeName || '—'} · {formatShortDate(r.createdAt)}
                </p>
                {r.comment && (
                  <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed">&laquo;{r.comment}&raquo;</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// DISTRIBUTION PIE (modern donut)
// ============================================================================

function DistributionDonut({ promoters, passives, detractors }: { promoters: number; passives: number; detractors: number }) {
  const total = promoters + passives + detractors;
  const data = [
    { name: 'Промоутеры', value: promoters, fill: COLORS.green },
    { name: 'Нейтральные', value: passives, fill: COLORS.yellow },
    { name: 'Критики', value: detractors, fill: COLORS.red },
  ].filter(d => d.value > 0);

  if (data.length === 0) return <div className="h-52 flex items-center justify-center text-zinc-500">Нет данных</div>;

  return (
    <div className="h-52 relative">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0];
            const pct = total > 0 ? Math.round((Number(d.value) / total) * 100) : 0;
            return (
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 shadow-2xl">
                <p className="text-zinc-300 text-xs">{d.name}</p>
                <p className="text-white font-bold">{String(d.value)} ({pct}%)</p>
              </div>
            );
          }} />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-white">{total}</span>
        <span className="text-zinc-500 text-[10px]">ОТВЕТОВ</span>
      </div>
    </div>
  );
}

// ============================================================================
// RESPONSE CARD (expandable)
// ============================================================================

function ResponseCard({ r }: { r: NpsResponseItem }) {
  const [expanded, setExpanded] = useState(false);
  const answerEntries = Object.entries(r.answers || {}).filter(
    ([, v]) => v !== null && v !== undefined && v !== ''
  );
  const hasDetails = answerEntries.length > 0;

  return (
    <div className="px-5 py-3 hover:bg-zinc-800/30 transition-colors">
      <button onClick={() => hasDetails && setExpanded(!expanded)} className="w-full text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
              r.score >= 9 ? 'bg-green-500/15 text-green-400' :
              r.score >= 7 ? 'bg-yellow-500/15 text-yellow-400' :
              'bg-red-500/15 text-red-400'
            }`}>
              {r.score}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{r.clientName || 'Клиент'}</p>
              <p className="text-zinc-500 text-xs">
                {stageName(r.stage)}
                {r.employeeName && ` · ${r.employeeName}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-600 text-xs">{formatDate(r.createdAt)}</span>
            {hasDetails && (
              expanded
                ? <ChevronDown className="w-4 h-4 text-zinc-500" />
                : <ChevronRight className="w-4 h-4 text-zinc-500" />
            )}
          </div>
        </div>
        {r.comment && (
          <p className="text-zinc-400 text-sm mt-1 ml-[52px]">&laquo;{r.comment}&raquo;</p>
        )}
      </button>

      {expanded && (
        <div className="ml-[52px] mt-3 space-y-2 border-l-2 border-zinc-700 pl-4">
          {answerEntries.map(([key, value]) => (
            <div key={key}>
              <p className="text-zinc-400 text-xs">{getQuestionLabel(r.stage, key)}</p>
              {typeof value === 'number' ? (
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="h-1.5 bg-zinc-800 rounded-full flex-1 max-w-48 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${value >= 8 ? 'bg-green-500' : value >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${(value / 10) * 100}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold ${scoreColor(value)}`}>{value}</span>
                </div>
              ) : (
                <p className="text-zinc-300 text-sm mt-0.5">&laquo;{value}&raquo;</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN DASHBOARD
// ============================================================================

export default function NpsDashboard({ responses: realResponses, totalClients }: Props) {
  const [period, setPeriod] = useState<Period>('all');
  const [showDemo, setShowDemo] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'stages' | 'employees' | 'responses'>('overview');

  // Merge real + demo data
  const demoData = useMemo(() => generateDemoData(), []);
  const allResponses = useMemo(() =>
    showDemo ? [...realResponses, ...demoData] : realResponses,
    [realResponses, demoData, showDemo]
  );

  // Filter by period
  const filtered = useMemo(() => filterByPeriod(allResponses, period), [allResponses, period]);

  // Previous period for trend comparison
  const prevFiltered = useMemo(() => {
    if (period === 'all') return [];
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const cutoff = Date.now() - days * 86400000;
    const prevCutoff = cutoff - days * 86400000;
    return allResponses.filter((r) => {
      const t = new Date(r.createdAt).getTime();
      return t >= prevCutoff && t < cutoff;
    });
  }, [allResponses, period]);

  // KPI calculations
  const kpi = useMemo(() => calcNps(filtered), [filtered]);
  const prevKpi = useMemo(() => calcNps(prevFiltered), [prevFiltered]);
  const npsTrend = prevKpi.total > 0 ? { value: kpi.npsScore - prevKpi.npsScore, label: 'vs пред.' } : null;

  // Response rate
  const responseRate = useMemo(() => {
    const clients = showDemo ? totalClients + 16 : totalClients;
    const uniqueClients = new Set(filtered.map((r) => r.clientId || r.clientName)).size;
    return clients > 0 ? Math.round((uniqueClients / clients) * 100) : 0;
  }, [filtered, totalClients, showDemo]);

  // Revenue at risk (demo: avg 5M per project, detractors' projects)
  const revenueAtRisk = useMemo(() => {
    const detractorClients = new Set(filtered.filter((r) => r.score <= 6).map((r) => r.clientId || r.clientName));
    const avgProjectCost = 5_200_000; // 5.2M demo
    return detractorClients.size * avgProjectCost;
  }, [filtered]);

  // Worst stage
  const worstStage = useMemo(() => {
    const map: Record<number, { total: number; count: number }> = {};
    for (const r of filtered) {
      if (!map[r.stage]) map[r.stage] = { total: 0, count: 0 };
      map[r.stage].total += r.score;
      map[r.stage].count++;
    }
    let worst: { stage: number; avg: number } | null = null;
    for (const [stage, s] of Object.entries(map)) {
      const avg = s.total / s.count;
      if (!worst || avg < worst.avg) worst = { stage: Number(stage), avg: Math.round(avg * 10) / 10 };
    }
    return worst;
  }, [filtered]);

  const tabs = [
    { key: 'overview' as const, label: 'Обзор', icon: Activity },
    { key: 'stages' as const, label: 'Этапы', icon: BarChart3 },
    { key: 'employees' as const, label: 'Сотрудники', icon: Users },
    { key: 'responses' as const, label: 'Ответы', icon: MessageCircleWarning },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">NPS Аналитика</h1>
          <p className="text-zinc-500 text-sm mt-0.5">{kpi.total} ответов · Обновлено сейчас</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Demo toggle */}
          <button
            onClick={() => setShowDemo(!showDemo)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showDemo ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
            }`}
          >
            <Zap className="w-3 h-3" />
            Demo
          </button>
          {/* Period filter */}
          <div className="flex bg-zinc-900 rounded-xl border border-zinc-800 p-1">
            {(['7d', '30d', '90d', 'all'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  period === p ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-900 rounded-xl border border-zinc-800 p-1">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setSelectedTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
              selectedTab === key ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KpiCard
          icon={TrendingUp}
          label="NPS Score"
          value={kpi.npsScore}
          sub={`${kpi.promoters} пром. / ${kpi.detractors} крит.`}
          trend={npsTrend}
          colorClass={npsColor(kpi.npsScore)}
          bgClass={npsBgGradient(kpi.npsScore)}
          info={{
            title: 'Net Promoter Score (NPS)',
            text: 'Главный показатель лояльности клиентов.\n\nКак считается: (% промоутеров − % критиков) × 100\n• Промоутеры (9-10) — рекомендуют вас\n• Нейтральные (7-8) — довольны, но не фанаты\n• Критики (0-6) — недовольны, могут уйти\n\nШкала: от −100 до +100\n• > 50 — отлично\n• 0–50 — хорошо\n• < 0 — требует внимания\n\nВлияет на: повторные заказы, рекомендации, репутацию компании.',
          }}
        />
        <KpiCard
          icon={Activity}
          label="Response Rate"
          value={`${responseRate}%`}
          sub={`${kpi.total} из ${showDemo ? totalClients + 16 : totalClients} клиентов`}
          colorClass={responseRate >= 60 ? 'text-green-400' : responseRate >= 30 ? 'text-yellow-400' : 'text-red-400'}
          bgClass="from-zinc-900 to-zinc-900 border-zinc-800"
          info={{
            title: 'Response Rate (Процент отклика)',
            text: 'Доля клиентов, которые прошли NPS-опрос.\n\nКак считается: (кол-во ответивших / всего клиентов) × 100%\n\n• > 60% — отличный отклик, данные надёжные\n• 30–60% — нормально, но есть куда расти\n• < 30% — мало данных, выводы могут быть неточными\n\nВлияет на: достоверность NPS. При низком отклике NPS может не отражать реальную картину. Чем больше ответов — тем точнее аналитика.',
          }}
        />
        <KpiCard
          icon={Star}
          label="Средняя оценка"
          value={kpi.avgScore}
          sub="из 10"
          colorClass={scoreColor(kpi.avgScore)}
          bgClass={kpi.avgScore >= 8 ? 'from-green-500/10 to-green-500/5 border-green-500/20' : kpi.avgScore >= 6 ? 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/20' : 'from-red-500/10 to-red-500/5 border-red-500/20'}
          info={{
            title: 'Средняя оценка',
            text: 'Среднее арифметическое всех оценок клиентов по шкале от 0 до 10.\n\nКак считается: сумма всех оценок / количество ответов\n\n• 8–10 — клиенты очень довольны\n• 6–8 — есть зоны для улучшения\n• < 6 — серьёзные проблемы с качеством\n\nОтличие от NPS: средняя оценка показывает общий уровень удовлетворённости, а NPS — баланс между фанатами и критиками. Средняя может быть 7.5, но при этом NPS отрицательный, если много критиков.',
          }}
        />
        <KpiCard
          icon={DollarSign}
          label="Выручка под угрозой"
          value={`${(revenueAtRisk / 1_000_000).toFixed(1)}M ₽`}
          sub={`${new Set(filtered.filter((r) => r.score <= 6).map((r) => r.clientId || r.clientName)).size} детракторов`}
          colorClass="text-red-400"
          bgClass="from-red-500/10 to-red-500/5 border-red-500/20"
          info={{
            title: 'Выручка под угрозой',
            text: 'Сумма контрактов клиентов-критиков (оценка 0-6), которые могут уйти или оставить негативный отзыв.\n\nКак считается: количество уникальных клиентов-критиков × средняя стоимость проекта\n\nПочему важно: критики в 3 раза чаще отказываются от допродаж и рекомендаций. Конвертация всего 5% критиков в промоутеров может вернуть миллионы.\n\nЧто делать: связаться с каждым критиком в течение 24 часов, выяснить проблему и предложить решение.',
          }}
        />
        <KpiCard
          icon={AlertTriangle}
          label="Проблемный этап"
          value={worstStage ? stageName(worstStage.stage) : '—'}
          sub={worstStage ? `Ср. ${worstStage.avg} из 10` : null}
          colorClass={worstStage ? 'text-red-400 text-lg' : 'text-zinc-500'}
          bgClass="from-zinc-900 to-zinc-900 border-zinc-800"
          info={{
            title: 'Проблемный этап',
            text: 'Этап строительства с самой низкой средней оценкой от клиентов.\n\nКак определяется: сравниваются средние оценки по всем этапам, выбирается этап с наименьшей.\n\nПочему важно: показывает, где в процессе строительства клиенты чаще всего недовольны. Это «слабое звено» в цепочке.\n\nЧто делать: проанализировать комментарии критиков на этом этапе, проверить бригаду/прораба, улучшить процесс или коммуникацию с клиентом.',
          }}
        />
      </div>

      {/* ===================== TAB: OVERVIEW ===================== */}
      {selectedTab === 'overview' && (
        <>
          {/* Row 1: Gauge + Distribution + Histogram */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
              <h3 className="text-zinc-400 text-sm font-medium mb-2 flex items-center">NPS Gauge<SectionInfo title="NPS Gauge (Спидометр)" text="Визуальное отображение текущего NPS Score на шкале от −100 до +100.\n\nЗелёная зона (50+): клиенты — ваши фанаты.\nЖёлтая зона (0-50): есть лояльность, но можно лучше.\nКрасная зона (<0): критиков больше, чем промоутеров — срочно работать над качеством.\n\nПроцент промоутеров, нейтральных и критиков показан под спидометром." /></h3>
              <NpsGauge score={kpi.npsScore} />
              <div className="flex justify-center gap-4 mt-3">
                <div className="text-center">
                  <p className="text-green-400 font-bold text-xl">{kpi.total > 0 ? Math.round((kpi.promoters / kpi.total) * 100) : 0}%</p>
                  <p className="text-zinc-600 text-[10px]">ПРОМОУТЕРЫ</p>
                </div>
                <div className="text-center">
                  <p className="text-yellow-400 font-bold text-xl">{kpi.total > 0 ? Math.round((kpi.passives / kpi.total) * 100) : 0}%</p>
                  <p className="text-zinc-600 text-[10px]">НЕЙТРАЛЬНЫЕ</p>
                </div>
                <div className="text-center">
                  <p className="text-red-400 font-bold text-xl">{kpi.total > 0 ? Math.round((kpi.detractors / kpi.total) * 100) : 0}%</p>
                  <p className="text-zinc-600 text-[10px]">КРИТИКИ</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
              <h3 className="text-zinc-400 text-sm font-medium mb-2 flex items-center">Распределение оценок<SectionInfo title="Распределение по категориям" text="Круговая диаграмма показывает соотношение трёх групп клиентов:\n\n🟢 Промоутеры (9-10) — лояльные клиенты, которые рекомендуют вас знакомым. Каждый промоутер приводит в среднем 2-3 новых клиента.\n\n🟡 Нейтральные (7-8) — довольны, но не привязаны. Легко могут уйти к конкуренту.\n\n🔴 Критики (0-6) — недовольные клиенты. Каждый критик рассказывает о негативном опыте 9-15 людям.\n\nЦель: максимизировать зелёный сегмент, минимизировать красный." /></h3>
              <DistributionDonut promoters={kpi.promoters} passives={kpi.passives} detractors={kpi.detractors} />
            </div>

            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
              <h3 className="text-zinc-400 text-sm font-medium mb-2 flex items-center">Гистограмма (0–10)<SectionInfo title="Детальное распределение оценок" text="Показывает сколько клиентов поставили каждую конкретную оценку от 0 до 10.\n\nЗачем: NPS группирует оценки в 3 категории, а гистограмма показывает точную картину. Например:\n• Много оценок «6» — клиенты на грани, их можно перевести в нейтральных\n• Много оценок «8» — одно улучшение может сделать их промоутерами\n• Оценки «0-3» — серьёзные проблемы, нужно срочно разбираться\n\nЦвета: зелёный (9-10), жёлтый (7-8), красный (0-6)" /></h3>
              <ScoreHistogram responses={filtered} />
            </div>
          </div>

          {/* Row 2: NPS Trend */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                NPS Тренд
                <SectionInfo title="NPS Тренд по неделям" text="Два показателя на одном графике:\n\n🔵 Голубая линия (левая ось) — NPS Score по неделям (-100 до +100). Показывает динамику лояльности во времени.\n\n🟣 Фиолетовая пунктирная (правая ось) — средняя оценка (0-10). Помогает сравнить NPS с общей удовлетворённостью.\n\nЗачем: отслеживать, растёт или падает лояльность. Резкое падение NPS = сигнал к немедленным действиям. Рост = ваши улучшения работают.\n\nСовет: сравнивайте с событиями — смена бригады, новый этап, сезонность." />
              </h3>
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <span>Левая ось: NPS (−100…+100)</span>
                <span>Правая: Ср. оценка (0–10)</span>
              </div>
            </div>
            <NpsTrendChart responses={filtered} />
          </div>

          {/* Row 3: Detractor panel */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium flex items-center gap-2">
                <MessageCircleWarning className="w-4 h-4 text-red-400" />
                Критики — Closed Loop
                <SectionInfo title="Закрытие обратной связи (Closed Loop)" text="Список клиентов, поставивших оценку 0-6 (критики), с отслеживанием статуса работы по каждому.\n\nСтатусы:\n• Новый — обратная связь получена, ещё не обработана\n• В работе — менеджер связался с клиентом, решает проблему\n• Решён — проблема устранена, клиент доволен\n\nЗачем: компании, которые реагируют на критиков в течение 24 часов, повышают NPS на 6 пунктов. Конвертация 5% критиков в промоутеров приносит миллионы.\n\nПравило: каждый критик должен получить ответ в течение 24 часов." />
              </h3>
              <span className="text-zinc-500 text-xs">{filtered.filter((r) => r.score <= 6).length} критиков</span>
            </div>
            <DetractorPanel responses={filtered} />
          </div>
        </>
      )}

      {/* ===================== TAB: STAGES ===================== */}
      {selectedTab === 'stages' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
              <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-zinc-400" />
                Распределение по этапам
                <SectionInfo title="Stacked Bar — этапы строительства" text="Горизонтальная диаграмма показывает по каждому этапу строительства, сколько клиентов попали в каждую категорию:\n\n🟢 Зелёный — промоутеры (9-10)\n🟡 Жёлтый — нейтральные (7-8)\n🔴 Красный — критики (0-6)\n\nЗачем: средняя оценка скрывает проблемы. Этап со средней 7.5 может иметь 40% критиков — это видно только на stacked bar.\n\nЧто искать: этапы с большой красной полосой — приоритет для улучшений." />
              </h3>
              <StagesStackedChart responses={filtered} />
              <div className="flex justify-center gap-6 mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-green-500/80" />
                  <span className="text-zinc-500 text-xs">Промоутеры (9-10)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-yellow-500/80" />
                  <span className="text-zinc-500 text-xs">Нейтральные (7-8)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-red-500/80" />
                  <span className="text-zinc-500 text-xs">Критики (0-6)</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
              <h3 className="text-white font-medium mb-4 flex items-center">Тепловая карта: Этапы × Сотрудники<SectionInfo title="Heatmap (Тепловая карта)" text="Матрица, где строки — сотрудники, столбцы — этапы строительства. Цвет ячейки — средняя оценка.\n\n🟢 Зелёный (9-10) — отличная работа\n🟡 Жёлтый (7-8) — нормально\n🟠 Оранжевый (4-6) — проблемы\n🔴 Красный (0-3) — критично\n\nЗачем: мгновенно видно, кто из сотрудников проседает на каком этапе. Например, прораб отлично справляется с фундаментом, но плохо с крышей — нужно обучение или замена.\n\nНаведите на ячейку для деталей." /></h3>
              <Heatmap responses={filtered} />
              <div className="flex justify-center gap-2 mt-4">
                {[
                  { label: '9-10', color: 'bg-green-500/80' },
                  { label: '7-8', color: 'bg-yellow-500/50' },
                  { label: '4-6', color: 'bg-orange-500/50' },
                  { label: '0-3', color: 'bg-red-500/60' },
                ].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-1">
                    <div className={`w-4 h-4 rounded ${color}`} />
                    <span className="text-zinc-500 text-[10px]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stage detail cards */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800">
            <div className="px-5 py-4 border-b border-zinc-800">
              <h3 className="text-white font-medium flex items-center">NPS по каждому этапу<SectionInfo title="NPS по 15 этапам строительства" text="Каждая карточка — один из 15 этапов строительного процесса (от «Мечта» до «Сервис»).\n\nЧисло справа — NPS Score этого этапа (−100 до +100).\nПолоска внизу — соотношение промоутеров/нейтральных/критиков.\n\nЗачем: видно, на каких этапах клиенты довольны, а где теряем лояльность. Позволяет точечно улучшать процесс.\n\nТипичные проблемные этапы: монтаж (задержки), коммуникации (сложность), фасад (качество)." /></h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800">
              {STAGES.map((stage) => {
                const stageResponses = filtered.filter((r) => r.stage === stage.number);
                const stats = calcNps(stageResponses);
                return (
                  <div key={stage.number} className="bg-zinc-900 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-zinc-300 text-sm font-medium">{stage.title}</p>
                        <p className="text-zinc-600 text-xs">{stats.total} ответов</p>
                      </div>
                      {stats.total > 0 && (
                        <span className={`text-xl font-bold ${npsColor(stats.npsScore)}`}>{stats.npsScore}</span>
                      )}
                    </div>
                    {stats.total > 0 ? (
                      <div className="flex gap-0.5 h-2 rounded-full overflow-hidden">
                        {stats.promoters > 0 && (
                          <div className="bg-green-500" style={{ width: `${(stats.promoters / stats.total) * 100}%` }} />
                        )}
                        {stats.passives > 0 && (
                          <div className="bg-yellow-500" style={{ width: `${(stats.passives / stats.total) * 100}%` }} />
                        )}
                        {stats.detractors > 0 && (
                          <div className="bg-red-500" style={{ width: `${(stats.detractors / stats.total) * 100}%` }} />
                        )}
                      </div>
                    ) : (
                      <div className="h-2 bg-zinc-800 rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ===================== TAB: EMPLOYEES ===================== */}
      {selectedTab === 'employees' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
              <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-zinc-400" />
                Рейтинг сотрудников по NPS
                <SectionInfo title="Рейтинг сотрудников" text="Ранжирование сотрудников по их персональному NPS Score.\n\nКак считается: для каждого сотрудника берутся все оценки от его клиентов и считается NPS (% промоутеров − % критиков).\n\nЗачем:\n• Выявить лучших — для премирования и примера\n• Выявить отстающих — для обучения и поддержки\n• Объективная основа для кадровых решений\n\nВажно: учитывайте количество оценок. NPS 100 при 2 ответах менее надёжен, чем NPS 60 при 30 ответах." />
              </h3>
              <EmployeeRanking responses={filtered} />
            </div>

            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
              <h3 className="text-white font-medium mb-4 flex items-center">Тепловая карта: Сотрудники × Этапы<SectionInfo title="Heatmap (Тепловая карта)" text="Та же матрица сотрудников и этапов, что и на вкладке «Этапы».\n\nПозволяет увидеть сильные и слабые стороны каждого сотрудника по конкретным этапам строительства.\n\nИспользуйте для:\n• Подбора оптимальной бригады под проект\n• Планирования обучения\n• Ротации сотрудников между этапами" /></h3>
              <Heatmap responses={filtered} />
            </div>
          </div>
        </>
      )}

      {/* ===================== TAB: RESPONSES ===================== */}
      {selectedTab === 'responses' && (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800">
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-white font-medium">Все ответы ({filtered.length})</h2>
          </div>
          {filtered.length === 0 ? (
            <div className="px-5 py-12 text-center text-zinc-500">Нет ответов за выбранный период</div>
          ) : (
            <div className="divide-y divide-zinc-800/50">
              {filtered.slice(0, 50).map((r) => (
                <ResponseCard key={r.id} r={r} />
              ))}
              {filtered.length > 50 && (
                <div className="px-5 py-4 text-center text-zinc-500 text-sm">
                  Показано 50 из {filtered.length} ответов
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
