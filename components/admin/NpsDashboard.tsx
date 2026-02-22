'use client';

import { useState } from 'react';
import { STAGES } from '@/lib/constants/stages';
import { POSITION_LABELS } from '@/lib/constants/nps-questions';
import type { EmployeePosition } from '@/types';
import { ChevronDown, ChevronRight } from 'lucide-react';

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

function npsColor(score: number) {
  if (score >= 50) return 'text-green-400';
  if (score >= 0) return 'text-yellow-400';
  return 'text-red-400';
}

function stageName(stage: number) {
  return STAGES[stage]?.title || `Этап ${stage}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ResponseCard({ r }: { r: NpsResponseItem }) {
  const [expanded, setExpanded] = useState(false);
  const answerEntries = Object.entries(r.answers || {}).filter(
    ([, v]) => v !== null && v !== undefined && v !== ''
  );

  return (
    <div className="px-5 py-3 hover:bg-zinc-800/50 transition-colors">
      <button
        onClick={() => setExpanded(!expanded)}
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
                  Сотрудник: {r.employeeName}
                  {r.employeePosition && ` (${POSITION_LABELS[r.employeePosition as EmployeePosition] || r.employeePosition})`}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-600 text-xs">{formatDate(r.createdAt)}</span>
            {answerEntries.length > 0 && (
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

      {expanded && answerEntries.length > 0 && (
        <div className="ml-11 mt-2 space-y-1 border-l-2 border-zinc-800 pl-3">
          {answerEntries.map(([key, value]) => (
            <div key={key} className="flex items-start gap-2 text-xs">
              <span className="text-zinc-500 shrink-0">{key}:</span>
              <span className={typeof value === 'number' ? scoreColor(value) + ' font-medium' : 'text-zinc-400'}>
                {typeof value === 'number' ? `${value}/10` : value}
              </span>
            </div>
          ))}
        </div>
      )}
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

  const kpiCards = [
    {
      label: 'NPS Score',
      value: kpi.npsScore,
      color: npsColor(kpi.npsScore),
      sub: `${kpi.promoters} промоутеров / ${kpi.detractors} критиков`,
      isText: false,
    },
    { label: 'Всего ответов', value: kpi.totalResponses, color: 'text-white', sub: null, isText: false },
    { label: 'Средняя оценка', value: kpi.avgScore, color: scoreColor(kpi.avgScore), sub: 'из 10', isText: false },
    {
      label: 'Проблемный этап',
      value: kpi.worstStage ? stageName(kpi.worstStage.stage) : '—',
      color: kpi.worstStage ? 'text-red-400' : 'text-zinc-500',
      sub: kpi.worstStage ? `Ср. оценка: ${kpi.worstStage.avgScore}` : null,
      isText: true,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">NPS</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
            <p className="text-zinc-400 text-sm mb-2">{card.label}</p>
            <p className={`${card.isText ? 'text-xl' : 'text-3xl'} font-bold ${card.color}`}>
              {card.value}
            </p>
            {card.sub && <p className="text-zinc-500 text-sm mt-1">{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Stage */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="px-5 py-4 border-b border-zinc-800">
            <h2 className="text-white font-medium">По этапам</h2>
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
                  <div className="flex items-center gap-2">
                    {selectedStage === s.stage
                      ? <ChevronDown className="w-4 h-4 text-zinc-400" />
                      : <ChevronRight className="w-4 h-4 text-zinc-600" />
                    }
                    <div className="text-left">
                      <p className="text-white text-sm">{stageName(s.stage)}</p>
                      <p className="text-zinc-500 text-xs">{s.count} ответов</p>
                    </div>
                  </div>
                  <span className={`text-lg font-bold ${scoreColor(s.avgScore)}`}>
                    {s.avgScore}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* By Employee */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="px-5 py-4 border-b border-zinc-800">
            <h2 className="text-white font-medium">По сотрудникам</h2>
          </div>
          {byEmployee.length === 0 ? (
            <div className="px-5 py-8 text-center text-zinc-500">Нет данных</div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {byEmployee.map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => {
                    setSelectedEmployee(selectedEmployee === emp.name ? null : emp.name);
                    setSelectedStage(null);
                  }}
                  className={`w-full px-5 py-3 flex items-center justify-between hover:bg-zinc-800/50 transition-colors ${
                    selectedEmployee === emp.name ? 'bg-zinc-800' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {selectedEmployee === emp.name
                      ? <ChevronDown className="w-4 h-4 text-zinc-400" />
                      : <ChevronRight className="w-4 h-4 text-zinc-600" />
                    }
                    <div className="text-left">
                      <p className="text-white text-sm">{emp.name}</p>
                      <p className="text-zinc-500 text-xs">
                        {POSITION_LABELS[emp.position as EmployeePosition] || emp.position} &middot; {emp.count} оценок
                      </p>
                    </div>
                  </div>
                  <span className={`text-lg font-bold ${scoreColor(emp.avgScore)}`}>
                    {emp.avgScore}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail panel — responses for selected stage or employee */}
      {(selectedStage !== null || selectedEmployee !== null) && (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-white font-medium">
              {selectedStage !== null
                ? `Оценки: ${stageName(selectedStage)}`
                : `Оценки: ${selectedEmployee}`
              }
            </h2>
            <span className="text-zinc-500 text-sm">
              {(selectedStage !== null ? stageResponses : employeeResponses).length} ответов
            </span>
          </div>
          <div className="divide-y divide-zinc-800">
            {(selectedStage !== null ? stageResponses : employeeResponses).map((r) => (
              <ResponseCard key={r.id} r={r} />
            ))}
          </div>
        </div>
      )}

      {/* Recent (only when nothing selected) */}
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
