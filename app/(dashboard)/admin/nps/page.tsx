import { createServiceRoleClient } from '@/lib/supabase/server';
import NpsDashboard from '@/components/admin/NpsDashboard';

interface NpsRow {
  id: string;
  client_id: string;
  stage: number;
  score: number;
  comment: string | null;
  answers: Record<string, number | string>;
  employee_id: string | null;
  created_at: string;
  employees: { full_name: string; position: string } | null;
  profiles: { full_name: string } | null;
}

async function getNpsData() {
  const supabase = createServiceRoleClient();

  const { data: responses } = await supabase
    .from('nps_responses')
    .select('*, employees(full_name, position), profiles!nps_responses_client_id_fkey(full_name)')
    .order('created_at', { ascending: false });

  const all = (Array.isArray(responses) ? responses : []) as NpsRow[];

  // KPI
  const promoters = all.filter((r) => r.score >= 9).length;
  const detractors = all.filter((r) => r.score <= 6).length;
  const total = all.length;
  const npsScore = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0;
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

  // All responses formatted for client
  const formattedResponses = all.map((r) => ({
    id: r.id,
    stage: r.stage,
    score: r.score,
    comment: r.comment,
    answers: r.answers || {},
    employeeName: r.employees?.full_name || null,
    employeePosition: r.employees?.position || null,
    clientName: r.profiles?.full_name || null,
    createdAt: r.created_at,
  }));

  return {
    kpi: { npsScore, avgScore, totalResponses: total, promoters, detractors, worstStage },
    byStage,
    byEmployee,
    responses: formattedResponses,
  };
}

export default async function AdminNpsPage() {
  const data = await getNpsData();
  return <NpsDashboard {...data} />;
}
