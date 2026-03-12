'use client';

import Link from 'next/link';
import { ArrowLeft, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  { q: 'Как отслеживать прогресс строительства?', a: 'Перейдите в раздел «Дорожная карта» на главном экране. Там отображается прогресс по каждому этапу.' },
  { q: 'Как связаться с менеджером?', a: 'Используйте раздел «Чаты» для связи с вашим персональным менеджером.' },
  { q: 'Где найти мои документы?', a: 'Все документы доступны в разделе «Документы» главного меню.' },
  { q: 'Как оставить отзыв?', a: 'Нажмите «Ваш голос» на главном экране или перейдите в раздел «Заявки».' },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-black px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/tma" className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/[0.08] flex items-center justify-center shrink-0">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-white text-xl font-bold tracking-tight">FAQ</h1>
      </div>

      <div className="space-y-2.5">
        {FAQ_ITEMS.map((item, i) => (
          <details key={i} className="rounded-[20px] bg-[#1a1a1a] border border-white/[0.08] overflow-hidden group">
            <summary className="px-5 py-4 flex items-center gap-3 cursor-pointer list-none">
              <HelpCircle className="w-5 h-5 text-[#FF9800] shrink-0" />
              <span className="text-white text-[15px] font-semibold flex-1">{item.q}</span>
            </summary>
            <div className="px-5 pb-4 pl-[52px]">
              <p className="text-[#999] text-sm leading-relaxed">{item.a}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
