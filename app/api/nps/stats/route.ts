import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServiceRoleClient();

  // Fetch all NPS responses with employee and client data
  const { data: responses } = await supabase
    .from('nps_responses')
    .select('*, employees(full_name, position), profiles!nps_responses_client_id_fkey(full_name)')
    .order('created_at', { ascending: false });

  const all = responses || [];

  // NPS Score calculation: % promoters (9-10) - % detractors (0-6)
  const promoters = all.filter((r) => r.score >= 9).length;
  const detractors = all.filter((r) => r.score <= 6).length;
  const total = all.length;
  const npsScore = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0;

  // Average score
  const avgScore = total > 0 ? Math.round((all.reduce((sum, r) => sum + r.score, 0) / total) * 10) / 10 : 0;

  // Stats per stage
  const stageStats: Record<number, { count: number; totalScore: number }> = {};
  for (const r of all) {
    if (!stageStats[r.stage]) stageStats[r.stage] = { count: 0, totalScore: 0 };
    stageStats[r.stage].count++;
    stageStats[r.stage].totalScore += r.score;
  }
  const byStage = Object.entries(stageStats).map(([stage, s]) => ({
    stage: Number(stage),
    count: s.count,
    avgScore: Math.round((s.totalScore / s.count) * 10) / 10,
  })).sort((a, b) => a.stage - b.stage);

  // Stats per employee
  const employeeStats: Record<string, { name: string; position: string; count: number; totalScore: number }> = {};
  for (const r of all) {
    if (!r.employee_id || !r.employees) continue;
    const eid = r.employee_id;
    if (!employeeStats[eid]) {
      employeeStats[eid] = {
        name: r.employees.full_name,
        position: r.employees.position,
        count: 0,
        totalScore: 0,
      };
    }
    employeeStats[eid].count++;
    employeeStats[eid].totalScore += r.score;
  }
  const byEmployee = Object.entries(employeeStats).map(([id, s]) => ({
    id,
    name: s.name,
    position: s.position,
    count: s.count,
    avgScore: Math.round((s.totalScore / s.count) * 10) / 10,
  })).sort((a, b) => b.avgScore - a.avgScore);

  // Worst stage
  const worstStage = byStage.length > 0
    ? byStage.reduce((min, s) => (s.avgScore < min.avgScore ? s : min), byStage[0])
    : null;

  // Recent responses (last 20)
  const recent = all.slice(0, 20).map((r) => ({
    id: r.id,
    stage: r.stage,
    score: r.score,
    comment: r.comment,
    employeeName: r.employees?.full_name || null,
    clientName: r.profiles?.full_name || null,
    createdAt: r.created_at,
  }));

  return NextResponse.json({
    npsScore,
    avgScore,
    totalResponses: total,
    promoters,
    detractors,
    neutrals: total - promoters - detractors,
    worstStage,
    byStage,
    byEmployee,
    recent,
  });
}
