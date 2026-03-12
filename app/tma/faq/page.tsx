'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/laravel-client';
import { ArrowLeft, ChevronDown } from 'lucide-react';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export default function FaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    api.get('/api/user/faqs')
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || [];
        setItems(list);
        if (list.length > 0) setOpenId(list[0].id);
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
        <h1 className="text-white text-xl font-bold tracking-tight">FAQ</h1>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-2xl bg-[#FF3B30]/10 text-[#FF3B30] text-sm mb-4">{error}</div>
      )}

      <div className="space-y-2.5">
        {items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08] overflow-hidden"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left active:bg-white/[0.03] transition-colors"
              >
                <p className="text-white text-sm font-medium pr-3">{item.question}</p>
                <ChevronDown
                  className={`w-5 h-5 text-[#444] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4">
                  <p className="text-[#999] text-sm leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!loading && items.length === 0 && !error && (
        <div className="text-center text-[#666] py-12 text-sm">Нет вопросов</div>
      )}
    </div>
  );
}
