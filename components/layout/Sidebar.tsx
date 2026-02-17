'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Phone,
  ClipboardCheck,
  Upload,
} from 'lucide-react';
import type { Role } from '@/types';

interface SidebarProps {
  role: Role;
}

const adminLinks = [
  { href: '/admin', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/admin/clients', label: 'Клиенты', icon: Users },
  { href: '/admin/managers', label: 'Менеджеры', icon: UserCog },
  { href: '/admin/calls', label: 'Звонки', icon: Phone },
  { href: '/admin/checklist', label: 'Чеклист', icon: ClipboardCheck },
];

const managerLinks = [
  { href: '/manager', label: 'Звонки', icon: Upload },
];

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const links = role === 'admin' ? adminLinks : managerLinks;

  return (
    <aside className="w-64 h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-zinc-800">
        <Link href={role === 'admin' ? '/admin' : '/manager'}>
          <h1 className="text-xl font-bold text-white tracking-tight">DG Atlas</h1>
          <p className="text-zinc-600 text-xs mt-0.5">
            {role === 'admin' ? 'Администратор' : 'Менеджер'}
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== '/admin' &&
              link.href !== '/manager' &&
              pathname.startsWith(link.href));
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
