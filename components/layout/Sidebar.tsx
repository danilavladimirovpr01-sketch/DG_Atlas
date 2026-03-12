'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Phone,
  ClipboardCheck,
  Star,
  Upload,
  ListChecks,
  BarChart3,
} from 'lucide-react';
import type { Role } from '@/types';

interface SidebarProps {
  role: Role;
}

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
}

const adminLinks: NavLink[] = [
  { href: '/admin', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/admin/clients', label: 'Клиенты', icon: Users },
  { href: '/admin/managers', label: 'Менеджеры', icon: UserCog },
  { href: '/admin/calls', label: 'Звонки', icon: Phone },
  { href: '/admin/checklist', label: 'Чеклист', icon: ClipboardCheck },
  {
    href: '/admin/nps',
    label: 'NPS',
    icon: Star,
    children: [
      { href: '/admin/nps', label: 'Аналитика', icon: BarChart3 },
      { href: '/admin/nps/surveys', label: 'Опросы', icon: ListChecks },
      { href: '/admin/nps/surveys/results', label: 'Результаты', icon: BarChart3 },
    ],
  },
];

const managerLinks: NavLink[] = [
  { href: '/manager', label: 'Звонки', icon: Upload },
];

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const links = role === 'admin' ? adminLinks : managerLinks;

  const isNpsSection = pathname.startsWith('/admin/nps');

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
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive =
            link.children
              ? pathname.startsWith(link.href)
              : pathname === link.href ||
                (link.href !== '/admin' &&
                  link.href !== '/manager' &&
                  pathname.startsWith(link.href));
          const Icon = link.icon;

          return (
            <div key={link.href}>
              <Link
                href={link.children ? link.href : link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>

              {/* Sub-links for NPS */}
              {link.children && isNpsSection && (
                <div className="ml-4 mt-1 space-y-0.5 border-l border-zinc-800 pl-3">
                  {link.children.map((child) => {
                    const isChildActive = pathname === child.href ||
                      (child.href !== '/admin/nps' && pathname.startsWith(child.href));
                    const ChildIcon = child.icon;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors ${
                          isChildActive
                            ? 'text-white bg-zinc-800/60'
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                        }`}
                      >
                        <ChildIcon className="w-3.5 h-3.5" />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
