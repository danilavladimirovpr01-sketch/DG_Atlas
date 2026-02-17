import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Users, UserCog, Phone, Star } from 'lucide-react';

async function getStats() {
  const supabase = await createServerSupabaseClient();

  const [clients, managers, calls, nps] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'client'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'manager'),
    supabase.from('calls').select('id, score', { count: 'exact' }),
    supabase.from('nps_responses').select('score'),
  ]);

  const totalCalls = calls.count || 0;
  const avgScore =
    calls.data && calls.data.length > 0
      ? Math.round(
          calls.data.filter((c) => c.score !== null).reduce((sum, c) => sum + (c.score || 0), 0) /
            (calls.data.filter((c) => c.score !== null).length || 1)
        )
      : 0;

  const avgNps =
    nps.data && nps.data.length > 0
      ? (nps.data.reduce((sum, n) => sum + n.score, 0) / nps.data.length).toFixed(1)
      : '—';

  // Recent calls
  const { data: recentCalls } = await supabase
    .from('calls')
    .select('*, profiles!calls_manager_id_fkey(full_name)')
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    clientsCount: clients.count || 0,
    managersCount: managers.count || 0,
    totalCalls,
    avgScore,
    avgNps,
    recentCalls: recentCalls || [],
  };
}

function scoreColor(score: number | null) {
  if (score === null) return 'text-zinc-500';
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      label: 'Клиенты',
      value: stats.clientsCount,
      icon: Users,
    },
    {
      label: 'Менеджеры',
      value: stats.managersCount,
      icon: UserCog,
    },
    {
      label: 'Звонки',
      value: stats.totalCalls,
      subValue: `Ср. оценка: ${stats.avgScore}%`,
      icon: Phone,
    },
    {
      label: 'NPS',
      value: stats.avgNps,
      icon: Star,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Дашборд</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-zinc-900 rounded-xl p-5 border border-zinc-800"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-zinc-400 text-sm">{card.label}</span>
                <Icon className="w-4 h-4 text-zinc-600" />
              </div>
              <p className="text-3xl font-bold text-white">{card.value}</p>
              {card.subValue && (
                <p className="text-zinc-500 text-sm mt-1">{card.subValue}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent calls */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h2 className="text-white font-medium">Последние звонки</h2>
        </div>
        <div className="divide-y divide-zinc-800">
          {stats.recentCalls.length === 0 ? (
            <div className="px-5 py-8 text-center text-zinc-500">
              Пока нет звонков
            </div>
          ) : (
            stats.recentCalls.map((call: any) => (
              <div key={call.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">
                    {call.profiles?.full_name || 'Менеджер'}
                  </p>
                  <p className="text-zinc-500 text-xs">
                    {new Date(call.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {call.score !== null && (
                    <span className={`text-lg font-bold ${scoreColor(call.score)}`}>
                      {call.score}%
                    </span>
                  )}
                  <span className="text-zinc-600 text-xs capitalize">
                    {call.analysis_status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
