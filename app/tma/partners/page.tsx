'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/laravel-client';
import { ArrowLeft, Handshake, ExternalLink } from 'lucide-react';

interface Partner {
  id: number;
  name: string;
  description?: string;
  url?: string;
  logo_url?: string;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/user/partners')
      .then((data) => {
        setPartners(Array.isArray(data) ? data : data.data || []);
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
        <h1 className="text-white text-xl font-bold tracking-tight">Полезные партнёры</h1>
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
        {partners.map((partner) => (
          <a
            key={partner.id}
            href={partner.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-5 py-4 rounded-[20px] bg-[#1a1a1a] border border-white/[0.08] active:bg-[#222] transition-colors"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
          >
            <div className="w-11 h-11 rounded-2xl bg-[#4cd964]/10 flex items-center justify-center shrink-0">
              <Handshake className="w-[22px] h-[22px] text-[#4cd964]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[15px] font-semibold tracking-tight">{partner.name}</p>
              {partner.description && (
                <p className="text-[#666] text-xs leading-snug mt-0.5 font-light">{partner.description}</p>
              )}
            </div>
            {partner.url && <ExternalLink className="w-4 h-4 text-[#555] shrink-0" />}
          </a>
        ))}
      </div>

      {!loading && partners.length === 0 && !error && (
        <div className="text-center text-[#666] py-12 text-sm">Нет партнёров</div>
      )}
    </div>
  );
}
