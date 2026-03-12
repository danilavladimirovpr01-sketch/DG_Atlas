'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/laravel-client';
import { ArrowLeft, FileText, Download, Send } from 'lucide-react';

interface Document {
  id: number;
  name: string;
  deal_title?: string;
  file_url?: string;
  deal_id?: number;
  file_id?: number;
}

interface ChatMedia {
  id: number;
  name: string;
  url?: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [chatMedia, setChatMedia] = useState<ChatMedia[]>([]);
  const [tab, setTab] = useState<'docs' | 'media'>('docs');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/api/user/documents').catch(() => []),
      api.get('/api/user/chat-media').catch(() => []),
    ])
      .then(([docs, media]) => {
        setDocuments(Array.isArray(docs) ? docs : docs.data || []);
        setChatMedia(Array.isArray(media) ? media : media.data || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function sendToTelegram(dealId: number, fileId: number) {
    try {
      await api.post(`/api/user/documents/${dealId}/file/${fileId}/send-to-telegram`);
    } catch {
      // silent
    }
  }

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/tma" className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/[0.08] flex items-center justify-center shrink-0">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-white text-xl font-bold tracking-tight">Документы</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { id: 'docs' as const, label: 'Мои документы' },
          { id: 'media' as const, label: 'Материалы чатов' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
              tab === t.id
                ? 'bg-white text-black'
                : 'bg-[#1a1a1a] text-[#666] border border-white/[0.08]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-2xl bg-[#FF3B30]/10 text-[#FF3B30] text-sm mb-4">{error}</div>
      )}

      {tab === 'docs' && (
        <div className="space-y-2.5">
          {documents.length === 0 && !loading && (
            <div className="text-center text-[#666] py-12 text-sm">Нет документов</div>
          )}
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#1a1a1a] border border-white/[0.06]">
              <div className="w-10 h-10 rounded-xl bg-[#AF52DE]/10 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-[#AF52DE]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{doc.name}</p>
                {doc.deal_title && <p className="text-[#555] text-[11px] mt-0.5">{doc.deal_title}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                {doc.file_url && (
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                    <Download className="w-4 h-4 text-[#666]" />
                  </a>
                )}
                {doc.deal_id && doc.file_id && (
                  <button onClick={() => sendToTelegram(doc.deal_id!, doc.file_id!)} className="w-8 h-8 rounded-lg bg-[#5AC8FA]/10 flex items-center justify-center">
                    <Send className="w-4 h-4 text-[#5AC8FA]" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'media' && (
        <div className="space-y-2.5">
          {chatMedia.length === 0 && !loading && (
            <div className="text-center text-[#666] py-12 text-sm">Нет материалов</div>
          )}
          {chatMedia.map((m) => (
            <div key={m.id} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#1a1a1a] border border-white/[0.06]">
              <div className="w-10 h-10 rounded-xl bg-[#5AC8FA]/10 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-[#5AC8FA]" />
              </div>
              <p className="text-white text-sm font-medium truncate flex-1">{m.name}</p>
              {m.url && (
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4 text-[#666]" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
