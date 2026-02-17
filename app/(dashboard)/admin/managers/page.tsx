import { createServiceRoleClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';

function scoreColor(score: number) {
  if (score >= 80) return 'bg-green-900 text-green-300';
  if (score >= 60) return 'bg-yellow-900 text-yellow-300';
  return 'bg-red-900 text-red-300';
}

async function getManagers() {
  const supabase = createServiceRoleClient();

  const { data: managers } = await supabase
    .from('profiles')
    .select('id, full_name, created_at')
    .eq('role', 'manager')
    .order('created_at', { ascending: false });

  // Get calls for each manager
  const managerIds = (managers || []).map((m) => m.id);
  const { data: calls } = await supabase
    .from('calls')
    .select('manager_id, score, analysis_status')
    .in('manager_id', managerIds.length > 0 ? managerIds : ['none']);

  return (managers || []).map((manager) => {
    const managerCalls = (calls || []).filter((c) => c.manager_id === manager.id);
    const doneCalls = managerCalls.filter((c) => c.analysis_status === 'done');
    const avgScore =
      doneCalls.length > 0
        ? Math.round(
            doneCalls.reduce((sum, c) => sum + (c.score || 0), 0) / doneCalls.length
          )
        : null;

    return {
      ...manager,
      totalCalls: managerCalls.length,
      avgScore,
    };
  });
}

export default async function ManagersPage() {
  const managers = await getManagers();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Менеджеры</h1>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                Менеджер
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                Звонков
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                Средняя оценка
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                Дата регистрации
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {managers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-zinc-500">
                  Нет менеджеров
                </td>
              </tr>
            ) : (
              managers.map((manager) => (
                <tr key={manager.id} className="hover:bg-zinc-800/50">
                  <td className="px-5 py-3 text-white text-sm">
                    {manager.full_name}
                  </td>
                  <td className="px-5 py-3 text-zinc-300 text-sm">
                    {manager.totalCalls}
                  </td>
                  <td className="px-5 py-3">
                    {manager.avgScore !== null ? (
                      <Badge
                        variant="secondary"
                        className={scoreColor(manager.avgScore)}
                      >
                        {manager.avgScore}%
                      </Badge>
                    ) : (
                      <span className="text-zinc-500 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-zinc-500 text-sm">
                    {new Date(manager.created_at).toLocaleDateString('ru-RU')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
