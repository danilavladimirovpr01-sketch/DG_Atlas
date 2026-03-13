'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, Banknote, FileText, User } from 'lucide-react';
import type { ComponentType } from 'react';

interface NavItem {
  label: string;
  icon: ComponentType<{ className?: string }>;
  route: string;
  match: (path: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Главная',
    icon: Home,
    route: '/tma',
    match: (p) => p === '/tma' || p === '/tma/',
  },
  {
    label: 'Стройка',
    icon: Layers,
    route: '/tma/stages',
    match: (p) => p.startsWith('/tma/stages') || p.startsWith('/tma/roadmap') || p.startsWith('/tma/photos'),
  },
  {
    label: 'Финансы',
    icon: Banknote,
    route: '/tma/budget',
    match: (p) => p.startsWith('/tma/budget') || p.startsWith('/tma/payments') || p.startsWith('/tma/calculator') || p.startsWith('/tma/compare'),
  },
  {
    label: 'Документы',
    icon: FileText,
    route: '/tma/documents',
    match: (p) => p.startsWith('/tma/documents'),
  },
  {
    label: 'Профиль',
    icon: User,
    route: '/tma/profile',
    match: (p) => p.startsWith('/tma/profile') || p.startsWith('/tma/requests') || p.startsWith('/tma/chat') || p.startsWith('/tma/faq') || p.startsWith('/tma/partners'),
  },
];

export default function BottomNav() {
  const pathname = usePathname() ?? '';

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.match(pathname);

          return (
            <Link
              key={item.route}
              href={item.route}
              className="flex flex-col items-center justify-center gap-0.5 w-full h-full active:opacity-70 transition-opacity"
            >
              <Icon
                className={`w-[22px] h-[22px] transition-colors ${
                  isActive ? 'text-white' : 'text-[#555]'
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-[#555]'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
