'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { STAGES } from '@/lib/constants/stages';

interface ClientRow {
  id: string;
  full_name: string;
  phone: string | null;
  telegram_id: string | null;
  created_at: string;
  project: {
    id: string;
    title: string;
    current_stage: number;
    status: string;
  } | null;
  avgNps: string | null;
}

export default function ClientsTableWrapper({
  initialClients,
}: {
  initialClients: ClientRow[];
}) {
  const [clients, setClients] = useState(initialClients);

  async function changeStage(projectId: string, clientIndex: number, delta: number) {
    const client = clients[clientIndex];
    if (!client.project) return;

    const newStage = Math.max(1, Math.min(14, client.project.current_stage + delta));
    if (newStage === client.project.current_stage) return;

    try {
      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_stage: newStage }),
      });

      setClients((prev) =>
        prev.map((c, i) =>
          i === clientIndex && c.project
            ? { ...c, project: { ...c.project, current_stage: newStage } }
            : c
        )
      );
    } catch {
      // Failed
    }
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
              Клиент
            </th>
            <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
              Проект
            </th>
            <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
              Этап
            </th>
            <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
              NPS
            </th>
            <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
              Telegram
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {clients.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-5 py-8 text-center text-zinc-500">
                Нет клиентов
              </td>
            </tr>
          ) : (
            clients.map((client, i) => (
              <tr key={client.id} className="hover:bg-zinc-800/50">
                <td className="px-5 py-3">
                  <p className="text-white text-sm">{client.full_name}</p>
                  <p className="text-zinc-500 text-xs">{client.phone || '—'}</p>
                </td>
                <td className="px-5 py-3 text-zinc-300 text-sm">
                  {client.project?.title || '—'}
                </td>
                <td className="px-5 py-3">
                  {client.project ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-zinc-500 hover:text-white"
                        onClick={() => changeStage(client.project!.id, i, -1)}
                        disabled={client.project.current_stage <= 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-white text-sm min-w-[100px] text-center">
                        {client.project.current_stage}/14{' '}
                        <span className="text-zinc-500 text-xs">
                          {STAGES[client.project.current_stage - 1]?.title}
                        </span>
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-zinc-500 hover:text-white"
                        onClick={() => changeStage(client.project!.id, i, 1)}
                        disabled={client.project.current_stage >= 14}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-zinc-500 text-sm">—</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  {client.avgNps ? (
                    <Badge
                      variant="secondary"
                      className={
                        parseFloat(client.avgNps) >= 8
                          ? 'bg-green-900 text-green-300'
                          : parseFloat(client.avgNps) >= 6
                          ? 'bg-yellow-900 text-yellow-300'
                          : 'bg-red-900 text-red-300'
                      }
                    >
                      {client.avgNps}
                    </Badge>
                  ) : (
                    <span className="text-zinc-500 text-sm">—</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  {client.telegram_id ? (
                    <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                      Подключён
                    </Badge>
                  ) : (
                    <span className="text-zinc-600 text-xs">Не подключён</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
