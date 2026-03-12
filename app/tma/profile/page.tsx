'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTma } from '@/lib/tma-context';
import { api, clearToken } from '@/lib/laravel-client';
import { ArrowLeft, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { profile } = useTma();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    api.get('/api/user/profile').then((data) => {
      setFirstName(data.first_name || '');
      setLastName(data.last_name || '');
      setPhone(data.phone || '');
    }).catch(() => {
      // fallback to context
      if (profile) {
        const parts = (profile.full_name || '').split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
        setPhone(profile.phone || '');
      }
    });
  }, [profile]);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      await api.put('/api/user/profile', { first_name: firstName, last_name: lastName });
      setMessage({ type: 'success', text: 'Профиль сохранён' });
    } catch {
      setMessage({ type: 'error', text: 'Ошибка сохранения' });
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    clearToken();
    window.location.href = '/tma';
  }

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/tma" className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/[0.08] flex items-center justify-center shrink-0">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-white text-xl font-bold tracking-tight">Мой профиль</h1>
      </div>

      {/* Form */}
      <div className="rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08] p-5 space-y-4" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
        {message && (
          <div className={`px-4 py-3 rounded-2xl text-sm ${message.type === 'success' ? 'bg-[#4cd964]/10 text-[#4cd964]' : 'bg-[#FF3B30]/10 text-[#FF3B30]'}`}>
            {message.text}
          </div>
        )}

        <div>
          <label className="text-[#666] text-xs mb-1.5 block">Имя</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full h-12 px-4 rounded-2xl bg-[#0d0d0d] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-white/[0.2]"
          />
        </div>

        <div>
          <label className="text-[#666] text-xs mb-1.5 block">Фамилия</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full h-12 px-4 rounded-2xl bg-[#0d0d0d] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-white/[0.2]"
          />
        </div>

        <div>
          <label className="text-[#666] text-xs mb-1.5 block">Телефон</label>
          <input
            type="text"
            value={phone}
            readOnly
            className="w-full h-12 px-4 rounded-2xl bg-[#0d0d0d] border border-white/[0.06] text-[#666] text-sm"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-12 rounded-2xl bg-white text-black text-sm font-semibold active:bg-white/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>

        <button
          onClick={handleLogout}
          className="w-full h-12 rounded-2xl border border-white/[0.08] text-[#666] text-sm font-medium flex items-center justify-center gap-2 active:bg-white/[0.03] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Выйти
        </button>
      </div>
    </div>
  );
}
