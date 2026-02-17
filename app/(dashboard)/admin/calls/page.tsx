import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const statusLabels: Record<string, string> = {
  pending: 'Ожидает',
  transcribing: 'Транскрипция',
  analyzing: 'Анализ',
  done: 'Готово',
  error: 'Ошибка',
};

const statusColors: Record<string, string> = {
  pending: 'bg-zinc-700',
  transcribing: 'bg-blue-900',
  analyzing: 'bg-yellow-900',
  done: 'bg-green-900 text-green-300',
  error: 'bg-red-900 text-red-300',
};

function scoreColor(score: number | null) {
  if (score === null) return 'text-zinc-500';
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

async function getCalls() {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('calls')
    .select('*, profiles!calls_manager_id_fkey(full_name)')
    .order('created_at', { ascending: false });

  return data || [];
}

export default async function AdminCallsPage() {
  const calls = await getCalls();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Все звонки</h1>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                Дата
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                Менеджер
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                Статус
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                Оценка
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                Резюме
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {calls.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-zinc-500">
                  Нет звонков
                </td>
              </tr>
            ) : (
              calls.map((call: any) => (
                <tr key={call.id} className="hover:bg-zinc-800/50">
                  <td className="px-5 py-3 text-zinc-300 text-sm">
                    <Link
                      href={`/admin/calls/${call.id}`}
                      className="hover:text-white"
                    >
                      {new Date(call.created_at).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-white text-sm">
                    {call.profiles?.full_name || '—'}
                  </td>
                  <td className="px-5 py-3">
                    <Badge
                      variant="secondary"
                      className={`${statusColors[call.analysis_status] || 'bg-zinc-700'} text-white`}
                    >
                      {statusLabels[call.analysis_status] || call.analysis_status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-lg font-bold ${scoreColor(call.score)}`}>
                      {call.score !== null ? `${call.score}%` : '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-zinc-500 text-sm max-w-xs truncate">
                    {call.ai_summary || '—'}
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
