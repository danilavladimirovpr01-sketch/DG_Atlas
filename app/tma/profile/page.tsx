'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTma } from '@/lib/tma-context';
import { api } from '@/lib/laravel-client';
import { ArrowLeft, User, Phone, Mail } from 'lucide-react';

export default function ProfilePage() {
  const { profile } = useTma();
  const [data, setData] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/user/profile')
      .then((res) => {
        const d = res?.data ?? res;
        setData(d || {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const name = data.full_name || profile?.full_name || 'Клиент';
  const phone = data.phone || '';
  const email = data.email || '';

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/tma" className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/[0.08] flex items-center justify-center shrink-0">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-white text-xl font-bold tracking-tight">Мой профиль</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-[20px] bg-[#1a1a1a] border border-white/[0.08] p-5 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/[0.08] flex items-center justify-center">
              <User className="w-8 h-8 text-[#5AC8FA]" />
            </div>
            <div>
              <p className="text-white text-lg font-bold">{name}</p>
              <p className="text-[#666] text-xs">Клиент DomGazobeton</p>
            </div>
          </div>

          {phone && (
            <div className="rounded-[20px] bg-[#1a1a1a] border border-white/[0.08] p-4 flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#4cd964]" />
              <div>
                <p className="text-[#666] text-xs">Телефон</p>
                <p className="text-white text-sm font-medium">{phone}</p>
              </div>
            </div>
          )}

          {email && (
            <div className="rounded-[20px] bg-[#1a1a1a] border border-white/[0.08] p-4 flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#5AC8FA]" />
              <div>
                <p className="text-[#666] text-xs">Email</p>
                <p className="text-white text-sm font-medium">{email}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
