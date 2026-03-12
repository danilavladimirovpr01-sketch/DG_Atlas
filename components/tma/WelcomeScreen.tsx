'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTma } from '@/lib/tma-context';
import { api } from '@/lib/laravel-client';
import {
  Bell, Star, ArrowRight, ChevronRight,
  User, CheckCircle2, FolderOpen, FileText,
  ClipboardList, MessageCircle, HelpCircle, Handshake,
  LayoutGrid, TrendingUp, Image, Award,
  type LucideIcon,
} from 'lucide-react';

/* ── Menu items matching Laravel Mini App ── */
const MENU_ITEMS: { title: string; subtitle: string; icon: LucideIcon; route: string; color: string }[] = [
  { title: 'Мой профиль', subtitle: 'Редактирование профиля', icon: User, route: '/tma/profile', color: '#5AC8FA' },
  { title: 'Статусы', subtitle: 'Прогресс по воронкам', icon: CheckCircle2, route: '/tma/statuses', color: '#4cd964' },
  { title: 'Мой Проект', subtitle: 'Информация о строительстве', icon: FolderOpen, route: '/tma/project', color: '#FF9800' },
  { title: 'Документы', subtitle: 'Мои документы и материалы чатов', icon: FileText, route: '/tma/documents', color: '#AF52DE' },
  { title: 'Заявки', subtitle: 'Мои заявки', icon: ClipboardList, route: '/tma/requests', color: '#FF3B30' },
  { title: 'Чаты', subtitle: 'Мои чаты и каналы', icon: MessageCircle, route: '/tma/chat', color: '#5AC8FA' },
  { title: 'FAQ', subtitle: 'Часто задаваемые вопросы', icon: HelpCircle, route: '/tma/faq', color: '#FF9800' },
  { title: 'Полезные партнёры', subtitle: 'Рекомендации', icon: Handshake, route: '/tma/partners', color: '#4cd964' },
];

/* ── Quick stats ── */
const QUICK_STATS: { label: string; icon: LucideIcon; color: string; borderColor: string; key: string }[] = [
  { label: 'Уровень', icon: LayoutGrid, color: '#5AC8FA', borderColor: '#5AC8FA', key: 'level' },
  { label: 'Прогресс', icon: TrendingUp, color: '#4cd964', borderColor: '#4cd964', key: 'progress' },
  { label: 'Фото', icon: Image, color: '#5AC8FA', borderColor: '#5AC8FA', key: 'photos' },
  { label: 'Награды', icon: Award, color: '#FF9800', borderColor: '#FF9800', key: 'rewards' },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Доброе утро';
  if (h >= 12 && h < 18) return 'Добрый день';
  if (h >= 18 && h < 23) return 'Добрый вечер';
  return 'Доброй ночи';
}

export default function WelcomeScreen() {
  const { profile } = useTma();
  const [overallProgress, setOverallProgress] = useState(0);

  const firstName = profile?.full_name?.split(' ')[0] || 'Клиент';

  useEffect(() => {
    api.get('/api/user/projects/progress/overall')
      .then((res) => {
        const data = res?.data ?? res;
        if (data?.overall_progress != null) {
          setOverallProgress(Math.round(data.overall_progress));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-black pb-8">

      {/* ═══════════════ HEADER ═══════════════ */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <img
            src="/logo-dg.svg"
            alt="DG"
            className="w-10 h-10 rounded-full"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}
          />
          <div>
            <p className="text-[#666] text-xs font-light">{getGreeting()}</p>
            <p className="text-white text-sm font-semibold tracking-tight">{firstName}</p>
          </div>
        </div>
        <Link
          href="/tma/notifications"
          className="relative w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-white/[0.08]"
        >
          <Bell className="w-[18px] h-[18px] text-[#666]" />
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#FF3B30] rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1">
            3
          </span>
        </Link>
      </div>

      {/* ═══════════════ PROJECT CARD ═══════════════ */}
      <div className="mx-4 mb-4 mt-2">
        <div
          className="rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08] px-5 py-5"
          style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
        >
          <div className="flex items-center gap-1.5 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#4cd964]" />
            <span className="text-[#4cd964] text-xs font-medium">Строительство</span>
          </div>
          <h2 className="text-white text-2xl font-bold tracking-tight mb-1">Мой проект</h2>
          <p className="text-[#666] text-sm mb-4">Отслеживайте прогресс строительства</p>

          <div className="flex justify-between items-center mb-2">
            <span className="text-[#999] text-xs">Прогресс строительства</span>
            <span className="text-white text-sm font-bold">{overallProgress}%</span>
          </div>
          <div className="h-[6px] bg-white/[0.08] rounded-full overflow-hidden mb-4">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${overallProgress}%`,
                background: 'linear-gradient(90deg, #fff 0%, #ccc 100%)',
              }}
            />
          </div>

          <Link href="/tma/roadmap" className="flex items-center gap-1 group">
            <span className="text-white text-sm font-medium group-active:text-[#ccc]">Дорожная карта</span>
            <ChevronRight className="w-4 h-4 text-[#666] group-active:text-[#999]" />
          </Link>
        </div>
      </div>

      {/* ═══════════════ QUICK STATS ═══════════════ */}
      <div className="grid grid-cols-4 gap-2.5 px-4 mb-4">
        {QUICK_STATS.map((stat) => {
          const Icon = stat.icon;
          const value = stat.key === 'progress' ? `${overallProgress}%` : '--';
          return (
            <div
              key={stat.key}
              className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-[#1a1a1a] border border-white/[0.08]"
              style={{ boxShadow: `0 0 0 1px ${stat.borderColor}20` }}
            >
              <Icon className="w-5 h-5" style={{ color: stat.color }} />
              <span className="text-white text-xs font-semibold">{value}</span>
              <span className="text-[#666] text-[10px]">{stat.label}</span>
            </div>
          );
        })}
      </div>

      {/* ═══════════════ ВАШ ГОЛОС ═══════════════ */}
      <div className="mx-4 mb-3">
        <Link
          href="/tma/feedback"
          className="flex items-center gap-4 px-5 py-4 rounded-[20px] bg-[#1a1a1a] border border-white/[0.08] active:bg-[#222] transition-colors"
          style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FF9800]/10 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 text-[#FF9800]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[15px] font-semibold tracking-tight">Ваш голос</p>
            <p className="text-[#666] text-xs leading-snug mt-0.5 font-light">
              Оцените качество на каждом этапе
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-[#444] shrink-0" />
        </Link>
      </div>

      {/* ═══════════════ MENU ITEMS ═══════════════ */}
      <div className="space-y-2.5 px-4 pb-4">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.route}
              className="flex items-center gap-4 px-5 py-4 rounded-[20px] bg-[#1a1a1a] border border-white/[0.08] active:bg-[#222] transition-colors"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `${item.color}15` }}
              >
                <Icon className="w-[22px] h-[22px]" style={{ color: item.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[15px] font-semibold tracking-tight">{item.title}</p>
                <p className="text-[#666] text-xs leading-snug mt-0.5 font-light">{item.subtitle}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#444] shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
