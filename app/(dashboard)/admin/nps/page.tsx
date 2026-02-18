import { createServiceRoleClient } from '@/lib/supabase/server';
import { STAGES } from '@/lib/constants/stages';
import { POSITION_LABELS } from '@/lib/constants/nps-questions';
import type { EmployeePosition } from '@/types';

interface NpsRow {
  id: string;
  client_id: string;
  stage: number;
  score: number;
  comment: string | null;
  employee_id: string | null;
  created_at: string;
  employees: { full_name: string; position: string } | null;
  profiles: { full_name: string } | null;
}

async function getNpsStats() {
  const supabase = createServiceRoleClient();

  const { data: responses } = await supabase
    .from('nps_responses')
    .select('*, employees(full_name, position), profiles!nps_responses_client_id_fkey(full_name)')
    .order('created_at', { ascending: false });

  const all = (responses || []) as NpsRow[];

  // NPS Score: % promoters (9-10) - % detractors (0-6)
  const promoters = all.filter((r) => r.score >= 9).length;
  const detractors = all.filter((r) => r.score <= 6).length;
  const total = all.length;
  const npsScore = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0;

  // Average score
  const avgScore = total > 0 ? Math.round((all.reduce((sum, r) => sum + r.score, 0) / total) * 10) / 10 : 0;

  // Per stage
  const stageMap: Record<number, { count: number; totalScore: number }> = {};
  for (const r of all) {
    if (!stageMap[r.stage]) stageMap[r.stage] = { count: 0, totalScore: 0 };
    stageMap[r.stage].count++;
    stageMap[r.stage].totalScore += r.score;
  }
  const byStage = Object.entries(stageMap)
    .map(([stage, s]) => ({
      stage: Number(stage),
      count: s.count,
      avgScore: Math.round((s.totalScore / s.count) * 10) / 10,
    }))
    .sort((a, b) => a.stage - b.stage);

  // Per employee
  const empMap: Record<string, { name: string; position: string; count: number; totalScore: number }> = {};
  for (const r of all) {
    if (!r.employee_id || !r.employees) continue;
    const eid = r.employee_id;
    if (!empMap[eid]) {
      empMap[eid] = { name: r.employees.full_name, position: r.employees.position, count: 0, totalScore: 0 };
    }
    empMap[eid].count++;
    empMap[eid].totalScore += r.score;
  }
  const byEmployee = Object.entries(empMap)
    .map(([id, s]) => ({
      id,
      name: s.name,
      position: s.position,
      count: s.count,
      avgScore: Math.round((s.totalScore / s.count) * 10) / 10,
    }))
    .sort((a, b) => b.avgScore - a.avgScore);

  // Worst stage
  const worstStage = byStage.length > 0
    ? byStage.reduce((min, s) => (s.avgScore < min.avgScore ? s : min), byStage[0])
    : null;

  // Recent 20
  const recent = all.slice(0, 20).map((r) => ({
    id: r.id,
    stage: r.stage,
    score: r.score,
    comment: r.comment,
    employeeName: r.employees?.full_name || null,
    clientName: r.profiles?.full_name || null,
    createdAt: r.created_at,
  }));

  return { npsScore, avgScore, totalResponses: total, promoters, detractors, worstStage, byStage, byEmployee, recent };
}

function npsColor(score: number) {
  if (score >= 50) return 'text-green-400';
  if (score >= 0) return 'text-yellow-400';
  return 'text-red-400';
}

function scoreColor(score: number) {
  if (score >= 8) return 'text-green-400';
  if (score >= 6) return 'text-yellow-400';
  return 'text-red-400';
}

function stageName(stage: number) {
  return STAGES[stage]?.title || `Этап ${stage}`;
}

export default async function AdminNpsPage() {
  const stats = await getNpsStats();

  const kpiCards = [
    {
      label: 'NPS Score',
      value: stats.npsScore,
      suffix: '',
      color: npsColor(stats.npsScore),
      sub: `${stats.promoters} промоутеров / ${stats.detractors} критиков`,
    },
    {
      label: 'Всего ответов',
      value: stats.totalResponses,
      color: 'text-white',
      sub: null,
    },
    {
      label: 'Средняя оценка',
      value: stats.avgScore,
      color: scoreColor(stats.avgScore),
      sub: 'из 10',
    },
    {
      label: 'Проблемный этап',
      value: stats.worstStage ? stageName(stats.worstStage.stage) : '—',
      color: stats.worstStage ? 'text-red-400' : 'text-zinc-500',
      sub: stats.worstStage ? `Ср. оценка: ${stats.worstStage.avgScore}` : null,
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

      {/* Two columns: stages + employees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Stage */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="px-5 py-4 border-b border-zinc-800">
            <h2 className="text-white font-medium">По этапам</h2>
          </div>
          {stats.byStage.length === 0 ? (
            <div className="px-5 py-8 text-center text-zinc-500">Нет данных</div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {stats.byStage.map((s) => (
                <div key={s.stage} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm">{stageName(s.stage)}</p>
                    <p className="text-zinc-500 text-xs">{s.count} ответов</p>
                  </div>
                  <span className={`text-lg font-bold ${scoreColor(s.avgScore)}`}>
                    {s.avgScore}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* By Employee */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="px-5 py-4 border-b border-zinc-800">
            <h2 className="text-white font-medium">По сотрудникам</h2>
          </div>
          {stats.byEmployee.length === 0 ? (
            <div className="px-5 py-8 text-center text-zinc-500">Нет данных</div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {stats.byEmployee.map((emp) => (
                <div key={emp.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm">{emp.name}</p>
                    <p className="text-zinc-500 text-xs">
                      {POSITION_LABELS[emp.position as EmployeePosition] || emp.position} &middot; {emp.count} оценок
                    </p>
                  </div>
                  <span className={`text-lg font-bold ${scoreColor(emp.avgScore)}`}>
                    {emp.avgScore}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Responses */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h2 className="text-white font-medium">Последние ответы</h2>
        </div>
        {stats.recent.length === 0 ? (
          <div className="px-5 py-8 text-center text-zinc-500">Пока нет ответов</div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {stats.recent.map((r) => (
              <div key={r.id} className="px-5 py-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${scoreColor(r.score)}`}>{r.score}</span>
                    <span className="text-white text-sm">{r.clientName || 'Клиент'}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-400 text-xs">{stageName(r.stage)}</p>
                    <p className="text-zinc-600 text-xs">
                      {new Date(r.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                {r.employeeName && (
                  <p className="text-zinc-500 text-xs">Сотрудник: {r.employeeName}</p>
                )}
                {r.comment && (
                  <p className="text-zinc-400 text-sm mt-1">&laquo;{r.comment}&raquo;</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
