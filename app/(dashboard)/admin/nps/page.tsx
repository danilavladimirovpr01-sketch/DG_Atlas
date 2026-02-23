import { createServiceRoleClient } from '@/lib/supabase/server';
import NpsDashboard from '@/components/admin/NpsDashboard';

export const dynamic = 'force-dynamic';

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

  // Fetch NPS responses
  const { data: responses } = await supabase
    .from('nps_responses')
    .select('*, employees(full_name, position), profiles!nps_responses_client_id_fkey(full_name)')
    .order('created_at', { ascending: false });

  // Fetch total clients count for response rate
  const { count: totalClients } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'client');

  // Fetch projects for revenue context
  const { data: projects } = await supabase
    .from('projects')
    .select('id, client_id, title, current_stage, status');

  const all = (Array.isArray(responses) ? responses : []) as NpsRow[];

  // Format responses
  const formattedResponses = all.map((r) => ({
    id: r.id,
    clientId: r.client_id,
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
    responses: formattedResponses,
    totalClients: totalClients || 0,
    totalProjects: (projects || []).length,
  };
}

export default async function AdminNpsPage() {
  const data = await getNpsData();
  return <NpsDashboard {...data} />;
}
