'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/laravel-client';
import { ArrowLeft, Plus, X, ClipboardList } from 'lucide-react';

interface Request {
  id: number;
  request_type_label?: string;
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  created_at: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: 'В ожидании', color: '#FF9800' },
  in_progress: { label: 'В работе', color: '#5AC8FA' },
  completed: { label: 'Завершена', color: '#4cd964' },
  rejected: { label: 'Отклонена', color: '#FF3B30' },
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ request_type: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      const data = await api.get('/api/user/requests');
      setRequests(Array.isArray(data) ? data : data.data || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await api.post('/api/user/requests', formData);
      setShowForm(false);
      setFormData({ request_type: '', subject: '', message: '' });
      loadRequests();
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/tma" className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/[0.08] flex items-center justify-center shrink-0">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-white text-xl font-bold tracking-tight flex-1">Заявки</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-10 h-10 rounded-full bg-[#FF9800]/15 flex items-center justify-center"
        >
          {showForm ? <X className="w-5 h-5 text-[#FF9800]" /> : <Plus className="w-5 h-5 text-[#FF9800]" />}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08] p-5 mb-5 space-y-3" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
          <p className="text-white text-[15px] font-semibold">Новая заявка</p>
          <select
            value={formData.request_type}
            onChange={(e) => setFormData({ ...formData, request_type: e.target.value })}
            className="w-full h-12 px-4 rounded-2xl bg-[#0d0d0d] border border-white/[0.08] text-white text-sm focus:outline-none appearance-none"
          >
            <option value="">Тип заявки</option>
            <option value="question">Вопрос</option>
            <option value="complaint">Жалоба</option>
            <option value="suggestion">Предложение</option>
            <option value="warranty">Гарантия</option>
            <option value="other">Другое</option>
          </select>
          <input
            type="text"
            placeholder="Тема"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full h-12 px-4 rounded-2xl bg-[#0d0d0d] border border-white/[0.08] text-white text-sm focus:outline-none placeholder:text-[#444]"
          />
          <textarea
            placeholder="Сообщение"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-2xl bg-[#0d0d0d] border border-white/[0.08] text-white text-sm focus:outline-none resize-none placeholder:text-[#444]"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting || !formData.subject || !formData.message}
            className="w-full h-12 rounded-2xl bg-white text-black text-sm font-semibold disabled:opacity-50"
          >
            {submitting ? 'Отправка...' : 'Отправить'}
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-2xl bg-[#FF3B30]/10 text-[#FF3B30] text-sm mb-4">{error}</div>
      )}

      <div className="space-y-2.5">
        {requests.map((req) => {
          const st = STATUS_MAP[req.status] || STATUS_MAP.pending;
          return (
            <div key={req.id} className="px-4 py-3.5 rounded-2xl bg-[#1a1a1a] border border-white/[0.06]">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-[#666]" />
                  {req.request_type_label && (
                    <span className="text-[#666] text-[11px]">{req.request_type_label}</span>
                  )}
                </div>
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-medium"
                  style={{ background: `${st.color}15`, color: st.color }}
                >
                  {st.label}
                </span>
              </div>
              <p className="text-white text-sm font-medium">{req.subject}</p>
              <p className="text-[#666] text-xs mt-1 line-clamp-2">{req.message}</p>
              <p className="text-[#444] text-[10px] mt-2">
                {new Date(req.created_at).toLocaleDateString('ru-RU')}
              </p>
            </div>
          );
        })}
      </div>

      {!loading && requests.length === 0 && !error && (
        <div className="text-center text-[#666] py-12 text-sm">Нет заявок</div>
      )}
    </div>
  );
}
