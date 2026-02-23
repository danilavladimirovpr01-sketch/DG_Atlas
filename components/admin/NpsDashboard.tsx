'use client';

import { useState, useMemo } from 'react';
import { STAGES } from '@/lib/constants/stages';
import { POSITION_LABELS } from '@/lib/constants/nps-questions';
import type { EmployeePosition } from '@/types';
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, Users, AlertTriangle, Star, BarChart3 } from 'lucide-react';
import { NPS_QUESTIONS } from '@/lib/constants/nps-questions';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, PieChart, Pie, Cell,
  AreaChart, Area,
} from 'recharts';

interface NpsResponseItem {
  id: string;
  stage: number;
  score: number;
  comment: string | null;
  answers: Record<string, number | string>;
  employeeName: string | null;
  employeePosition: string | null;
  clientName: string | null;
  createdAt: string;
}

interface StageStats {
  stage: number;
  count: number;
  avgScore: number;
}

interface EmployeeStats {
  id: string;
  name: string;
  position: string;
  count: number;
  avgScore: number;
}

interface KpiData {
  npsScore: number;
  avgScore: number;
  totalResponses: number;
  promoters: number;
  detractors: number;
  worstStage: StageStats | null;
}

interface Props {
  kpi: KpiData;
  byStage: StageStats[];
  byEmployee: EmployeeStats[];
  responses: NpsResponseItem[];
}

function scoreColor(score: number) {
  if (score >= 8) return 'text-green-400';
  if (score >= 6) return 'text-yellow-400';
  return 'text-red-400';
}

function scoreBg(score: number) {
  if (score >= 8) return 'bg-green-500/10 border-green-500/20';
  if (score >= 6) return 'bg-yellow-500/10 border-yellow-500/20';
  return 'bg-red-500/10 border-red-500/20';
}

function npsColor(score: number) {
  if (score >= 50) return 'text-green-400';
  if (score >= 0) return 'text-yellow-400';
  return 'text-red-400';
}

function npsBg(score: number) {
  if (score >= 50) return 'bg-green-500/10 border-green-500/20';
  if (score >= 0) return 'bg-yellow-500/10 border-yellow-500/20';
  return 'bg-red-500/10 border-red-500/20';
}

function stageName(stage: number) {
  return STAGES[stage]?.title || `Этап ${stage}`;
}

function stageShortName(stage: number) {
  const name = STAGES[stage]?.title || `${stage}`;
  return name.length > 10 ? name.slice(0, 10) + '...' : name;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getQuestionLabel(stage: number, key: string): string {
  const config = NPS_QUESTIONS[stage];
  if (!config) return key;
  const q = config.questions.find((q) => q.key === key);
  return q?.label || key;
}

const COLORS = {
  green: '#22c55e',
  yellow: '#eab308',
  red: '#ef4444',
  zinc: '#3f3f46',
  white: '#ffffff',
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-zinc-400 text-xs">{label}</p>
      <p className="text-white font-bold">{payload[0].value}</p>
    </div>
  );
}

// --- KPI Card ---
function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  colorClass,
  bgClass,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  sub?: string | null;
  colorClass: string;
  bgClass: string;
}) {
  return (
    <div className={`rounded-xl p-5 border ${bgClass}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-zinc-400 text-sm">{label}</p>
        <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-zinc-400" />
        </div>
      </div>
      <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
      {sub && <p className="text-zinc-500 text-sm mt-1">{sub}</p>}
    </div>
  );
}

// --- Response Card ---
function ResponseCard({ r }: { r: NpsResponseItem }) {
  const [expanded, setExpanded] = useState(false);
  const answerEntries = Object.entries(r.answers || {}).filter(
    ([, v]) => v !== null && v !== undefined && v !== ''
  );
  const hasDetails = answerEntries.length > 0;

  return (
    <div className="px-5 py-3 hover:bg-zinc-800/50 transition-colors">
      <button
        onClick={() => hasDetails && setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`text-xl font-bold w-8 ${scoreColor(r.score)}`}>
              {r.score}
            </span>
            <div>
              <p className="text-white text-sm">{r.clientName || 'Клиент'}</p>
              {r.employeeName && (
                <p className="text-zinc-500 text-xs">
                  {r.employeeName}
                  {r.employeePosition && ` (${POSITION_LABELS[r.employeePosition as EmployeePosition] || r.employeePosition})`}
                </p>
              )}
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
          <p className="text-zinc-400 text-sm mt-1 ml-11">&laquo;{r.comment}&raquo;</p>
        )}
      </button>

      {expanded && (
        <div className="ml-11 mt-3 space-y-2 border-l-2 border-zinc-700 pl-4">
          {answerEntries.map(([key, value]) => (
            <div key={key}>
              <p className="text-zinc-400 text-xs leading-relaxed">
                {getQuestionLabel(r.stage, key)}
              </p>
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

// --- NPS Gauge ---
function NpsGauge({ score }: { score: number }) {
  const normalizedScore = Math.max(-100, Math.min(100, score));
  const percentage = ((normalizedScore + 100) / 200) * 100;
  const data = [{ value: percentage, fill: normalizedScore >= 50 ? COLORS.green : normalizedScore >= 0 ? COLORS.yellow : COLORS.red }];

  return (
    <div className="relative w-full h-40">
      <ResponsiveContainer>
        <RadialBarChart
          cx="50%" cy="80%"
          innerRadius="60%" outerRadius="90%"
          startAngle={180} endAngle={0}
          barSize={12}
          data={data}
        >
          <RadialBar
            background={{ fill: COLORS.zinc }}
            dataKey="value"
            cornerRadius={6}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
        <span className={`text-4xl font-bold ${npsColor(score)}`}>{score}</span>
        <span className="text-zinc-500 text-xs">NPS Score</span>
      </div>
    </div>
  );
}

// --- Distribution Pie ---
function DistributionPie({ promoters, passives, detractors }: { promoters: number; passives: number; detractors: number }) {
  const data = [
    { name: 'Промоутеры (9-10)', value: promoters, fill: COLORS.green },
    { name: 'Нейтральные (7-8)', value: passives, fill: COLORS.yellow },
    { name: 'Критики (0-6)', value: detractors, fill: COLORS.red },
  ].filter(d => d.value > 0);

  if (data.length === 0) return <div className="h-48 flex items-center justify-center text-zinc-500">Нет данных</div>;

  return (
    <div className="h-48">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={45}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0];
              return (
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl">
                  <p className="text-zinc-300 text-xs">{d.name}</p>
                  <p className="text-white font-bold">{String(d.value)}</p>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function NpsDashboard({ kpi, byStage, byEmployee, responses }: Props) {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const stageResponses = selectedStage !== null
    ? responses.filter((r) => r.stage === selectedStage)
    : [];

  const employeeResponses = selectedEmployee !== null
    ? responses.filter((r) => r.employeeName === selectedEmployee)
    : [];

  const passives = kpi.totalResponses - kpi.promoters - kpi.detractors;

  // Stage chart data
  const stageChartData = useMemo(() =>
    byStage.map((s) => ({
      name: stageShortName(s.stage),
      fullName: stageName(s.stage),
      score: s.avgScore,
      count: s.count,
      fill: s.avgScore >= 8 ? COLORS.green : s.avgScore >= 6 ? COLORS.yellow : COLORS.red,
    })),
    [byStage]
  );

  // Trend data (responses over time by week)
  const trendData = useMemo(() => {
    if (responses.length === 0) return [];
    const weekMap: Record<string, { count: number; totalScore: number; label: string }> = {};
    for (const r of responses) {
      const d = new Date(r.createdAt);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().split('T')[0];
      const label = weekStart.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
      if (!weekMap[key]) weekMap[key] = { count: 0, totalScore: 0, label };
      weekMap[key].count++;
      weekMap[key].totalScore += r.score;
    }
    return Object.entries(weekMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([, w]) => ({
        name: w.label,
        avg: Math.round((w.totalScore / w.count) * 10) / 10,
        count: w.count,
      }));
  }, [responses]);

  // Employee ranking for horizontal bars
  const employeeChartData = useMemo(() =>
    byEmployee.slice(0, 8).map((e) => ({
      name: e.name.split(' ').slice(0, 2).join(' '),
      score: e.avgScore,
      count: e.count,
      fill: e.avgScore >= 8 ? COLORS.green : e.avgScore >= 6 ? COLORS.yellow : COLORS.red,
    })),
    [byEmployee]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">NPS Аналитика</h1>
        <span className="text-zinc-500 text-sm">{kpi.totalResponses} ответов</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={TrendingUp}
          label="NPS Score"
          value={kpi.npsScore}
          sub={`${kpi.promoters} промоутеров / ${kpi.detractors} критиков`}
          colorClass={npsColor(kpi.npsScore)}
          bgClass={npsBg(kpi.npsScore)}
        />
        <KpiCard
          icon={Users}
          label="Всего ответов"
          value={kpi.totalResponses}
          sub={`${kpi.promoters} / ${passives} / ${kpi.detractors}`}
          colorClass="text-white"
          bgClass="bg-zinc-900 border-zinc-800"
        />
        <KpiCard
          icon={Star}
          label="Средняя оценка"
          value={kpi.avgScore}
          sub="из 10"
          colorClass={scoreColor(kpi.avgScore)}
          bgClass={scoreBg(kpi.avgScore)}
        />
        <KpiCard
          icon={AlertTriangle}
          label="Проблемный этап"
          value={kpi.worstStage ? stageName(kpi.worstStage.stage) : '—'}
          sub={kpi.worstStage ? `Ср. оценка: ${kpi.worstStage.avgScore}` : null}
          colorClass={kpi.worstStage ? 'text-red-400 text-xl' : 'text-zinc-500'}
          bgClass={kpi.worstStage ? 'bg-red-500/10 border-red-500/20' : 'bg-zinc-900 border-zinc-800'}
        />
      </div>

      {/* Charts row 1: NPS Gauge + Distribution + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* NPS Gauge */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
          <h3 className="text-zinc-400 text-sm mb-2">NPS Score</h3>
          <NpsGauge score={kpi.npsScore} />
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-zinc-400 text-xs">Промоутеры {kpi.promoters}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-zinc-400 text-xs">Нейтральные {passives}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-zinc-400 text-xs">Критики {kpi.detractors}</span>
            </div>
          </div>
        </div>

        {/* Distribution */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
          <h3 className="text-zinc-400 text-sm mb-2">Распределение оценок</h3>
          <DistributionPie promoters={kpi.promoters} passives={passives} detractors={kpi.detractors} />
          <div className="flex justify-center gap-4 mt-2">
            <div className="text-center">
              <p className="text-green-400 font-bold text-lg">{kpi.totalResponses > 0 ? Math.round((kpi.promoters / kpi.totalResponses) * 100) : 0}%</p>
              <p className="text-zinc-500 text-xs">9-10</p>
            </div>
            <div className="text-center">
              <p className="text-yellow-400 font-bold text-lg">{kpi.totalResponses > 0 ? Math.round((passives / kpi.totalResponses) * 100) : 0}%</p>
              <p className="text-zinc-500 text-xs">7-8</p>
            </div>
            <div className="text-center">
              <p className="text-red-400 font-bold text-lg">{kpi.totalResponses > 0 ? Math.round((kpi.detractors / kpi.totalResponses) * 100) : 0}%</p>
              <p className="text-zinc-500 text-xs">0-6</p>
            </div>
          </div>
        </div>

        {/* Trend */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
          <h3 className="text-zinc-400 text-sm mb-4">Динамика средней оценки</h3>
          {trendData.length > 1 ? (
            <div className="h-52">
              <ResponsiveContainer>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.green} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={COLORS.green} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} width={25} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="avg" stroke={COLORS.green} fill="url(#gradientGreen)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-52 flex items-center justify-center text-zinc-500 text-sm">
              Недостаточно данных для графика
            </div>
          )}
        </div>
      </div>

      {/* Charts row 2: By Stage + By Employee */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Stage bar chart */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-zinc-400" /> Оценки по этапам
            </h3>
          </div>
          {stageChartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={stageChartData} layout="vertical" margin={{ left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                  <XAxis type="number" domain={[0, 10]} tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl">
                          <p className="text-zinc-300 text-xs">{d.fullName}</p>
                          <p className="text-white font-bold">Оценка: {d.score}</p>
                          <p className="text-zinc-400 text-xs">{d.count} ответов</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={16}>
                    {stageChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-zinc-500">Нет данных</div>
          )}
        </div>

        {/* Employee ranking */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-zinc-400" /> Рейтинг сотрудников
            </h3>
          </div>
          {employeeChartData.length > 0 ? (
            <div className="space-y-3">
              {employeeChartData.map((emp, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedEmployee(selectedEmployee === emp.name ? null : emp.name);
                    setSelectedStage(null);
                  }}
                  className={`w-full text-left ${selectedEmployee === emp.name ? 'opacity-100' : 'opacity-80 hover:opacity-100'} transition-opacity`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-zinc-300 text-sm">{emp.name}</span>
                    <span className={`text-sm font-bold ${scoreColor(emp.score)}`}>{emp.score}</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(emp.score / 10) * 100}%`,
                        backgroundColor: emp.fill,
                        opacity: selectedEmployee === emp.name ? 1 : 0.7,
                      }}
                    />
                  </div>
                  <p className="text-zinc-600 text-xs mt-0.5">{emp.count} оценок</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-zinc-500">Нет данных</div>
          )}
        </div>
      </div>

      {/* Clickable stages list */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h2 className="text-white font-medium">Детализация по этапам</h2>
        </div>
        {byStage.length === 0 ? (
          <div className="px-5 py-8 text-center text-zinc-500">Нет данных</div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {byStage.map((s) => (
              <button
                key={s.stage}
                onClick={() => {
                  setSelectedStage(selectedStage === s.stage ? null : s.stage);
                  setSelectedEmployee(null);
                }}
                className={`w-full px-5 py-3 flex items-center justify-between hover:bg-zinc-800/50 transition-colors ${
                  selectedStage === s.stage ? 'bg-zinc-800' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {selectedStage === s.stage
                    ? <ChevronDown className="w-4 h-4 text-zinc-400" />
                    : <ChevronRight className="w-4 h-4 text-zinc-600" />
                  }
                  <div className="text-left">
                    <p className="text-white text-sm">{stageName(s.stage)}</p>
                    <p className="text-zinc-500 text-xs">{s.count} ответов</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(s.avgScore / 10) * 100}%`,
                        backgroundColor: s.avgScore >= 8 ? COLORS.green : s.avgScore >= 6 ? COLORS.yellow : COLORS.red,
                      }}
                    />
                  </div>
                  <span className={`text-lg font-bold min-w-[2rem] text-right ${scoreColor(s.avgScore)}`}>
                    {s.avgScore}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail panel */}
      {(selectedStage !== null || selectedEmployee !== null) && (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-white font-medium">
              {selectedStage !== null
                ? `Оценки: ${stageName(selectedStage)}`
                : `Оценки: ${selectedEmployee}`
              }
            </h2>
            <button
              onClick={() => { setSelectedStage(null); setSelectedEmployee(null); }}
              className="text-zinc-500 text-sm hover:text-white"
            >
              Закрыть
            </button>
          </div>
          <div className="divide-y divide-zinc-800">
            {(selectedStage !== null ? stageResponses : employeeResponses).map((r) => (
              <ResponseCard key={r.id} r={r} />
            ))}
          </div>
        </div>
      )}

      {/* Recent responses */}
      {selectedStage === null && selectedEmployee === null && (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="px-5 py-4 border-b border-zinc-800">
            <h2 className="text-white font-medium">Последние ответы</h2>
          </div>
          {responses.length === 0 ? (
            <div className="px-5 py-8 text-center text-zinc-500">Пока нет ответов</div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {responses.slice(0, 20).map((r) => (
                <ResponseCard key={r.id} r={r} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
