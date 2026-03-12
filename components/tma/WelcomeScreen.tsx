'use client';

import Link from 'next/link';
import { useTma } from '@/lib/tma-context';
import { STAGES } from '@/lib/constants/stages';
import {
  Bell, Star, ArrowRight, ChevronRight,
  User, CheckCircle2, FolderOpen, FileText,
  ClipboardList, MessageCircle, HelpCircle, Handshake,
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

export default function WelcomeScreen() {
  const { profile, project } = useTma();

  const currentStage = project?.current_stage ?? 0;
  const stageInfo = STAGES[currentStage];
  const progress = Math.round(((currentStage + 1) / STAGES.length) * 100);
  const firstName = profile?.full_name?.split(' ')[0] || 'Клиент';

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
            <p className="text-[#666] text-xs font-light">Добрый день</p>
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

      {/* ═══════════════ PROGRESS CARD ═══════════════ */}
      <div className="mx-4 mb-5 mt-2">
        <div
          className="rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/[0.08] px-5 py-4"
          style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#666] text-xs">Прогресс проектов</span>
            <span className="text-white text-sm font-bold">{progress}%</span>
          </div>
          <div className="h-[6px] bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #fff 0%, #ccc 100%)',
              }}
            />
          </div>
          <p className="text-[#555] text-[11px] mt-2">
            Этап {currentStage + 1}: {stageInfo?.title}
          </p>
        </div>
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
