import { createServiceRoleClient } from '@/lib/supabase/server';
import ClientsTableWrapper from '@/components/admin/ClientsTableWrapper';

async function getClients() {
  const supabase = createServiceRoleClient();

  const { data: clients } = await supabase
    .from('profiles')
    .select('id, full_name, phone, telegram_id, created_at')
    .eq('role', 'client')
    .order('created_at', { ascending: false });

  // Get projects for each client
  const clientIds = (clients || []).map((c) => c.id);
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .in('client_id', clientIds.length > 0 ? clientIds : ['none']);

  // Get NPS for each client
  const { data: npsResponses } = await supabase
    .from('nps_responses')
    .select('client_id, score')
    .in('client_id', clientIds.length > 0 ? clientIds : ['none']);

  return (clients || []).map((client) => {
    const project = (projects || []).find((p) => p.client_id === client.id);
    const nps = (npsResponses || []).filter((n) => n.client_id === client.id);
    const avgNps =
      nps.length > 0
        ? (nps.reduce((sum, n) => sum + n.score, 0) / nps.length).toFixed(1)
        : null;

    return {
      ...client,
      project,
      avgNps,
    };
  });
}

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Клиенты</h1>
      <ClientsTableWrapper initialClients={clients} />
    </div>
  );
}
