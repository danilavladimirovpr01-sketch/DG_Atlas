'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/laravel-client';
import { ArrowLeft, MessageCircle, ExternalLink, Users } from 'lucide-react';

interface SyncedChat {
  id: number;
  title: string;
  manager_name?: string;
  members_count?: number;
}

interface AdditionalChat {
  id: number;
  title: string;
  url?: string;
}

export default function ChatsPage() {
  const [syncedChats, setSyncedChats] = useState<SyncedChat[]>([]);
  const [additionalChats, setAdditionalChats] = useState<AdditionalChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/user/chats')
      .then((data) => {
        setSyncedChats(data.synced_chats || []);
        setAdditionalChats(data.additional_chats || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/tma" className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/[0.08] flex items-center justify-center shrink-0">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-white text-xl font-bold tracking-tight">Чаты</h1>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-2xl bg-[#FF3B30]/10 text-[#FF3B30] text-sm mb-4">{error}</div>
      )}

      {syncedChats.length > 0 && (
        <div className="mb-5">
          <p className="text-[#666] text-xs font-bold uppercase tracking-wider mb-3 px-1">Синхронизированные чаты</p>
          <div className="space-y-2.5">
            {syncedChats.map((chat) => (
              <div key={chat.id} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#1a1a1a] border border-white/[0.06]">
                <div className="w-10 h-10 rounded-xl bg-[#5AC8FA]/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-[#5AC8FA]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{chat.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {chat.manager_name && <span className="text-[#666] text-[11px]">{chat.manager_name}</span>}
                    {chat.members_count && (
                      <span className="flex items-center gap-0.5 text-[#555] text-[11px]">
                        <Users className="w-3 h-3" /> {chat.members_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {additionalChats.length > 0 && (
        <div>
          <p className="text-[#666] text-xs font-bold uppercase tracking-wider mb-3 px-1">Дополнительные чаты</p>
          <div className="space-y-2.5">
            {additionalChats.map((chat) => (
              <a
                key={chat.id}
                href={chat.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#1a1a1a] border border-white/[0.06] active:bg-[#222] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#4cd964]/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-[#4cd964]" />
                </div>
                <p className="text-white text-sm font-medium truncate flex-1">{chat.title}</p>
                {chat.url && <ExternalLink className="w-4 h-4 text-[#555] shrink-0" />}
              </a>
            ))}
          </div>
        </div>
      )}

      {!loading && syncedChats.length === 0 && additionalChats.length === 0 && !error && (
        <div className="text-center text-[#666] py-12 text-sm">Нет чатов</div>
      )}
    </div>
  );
}
