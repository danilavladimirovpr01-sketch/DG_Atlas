import {
  LayoutGrid, Layers, Medal, BarChart3,
  CircleDollarSign, CalendarDays, Calculator, Maximize2,
  Image, Play, FileText, CheckCircle2,
  MessageCircle, Bell, CheckSquare, BookOpen,
} from 'lucide-react';
import type { ComponentType } from 'react';

export type FeatureCategory = 'progress' | 'finance' | 'media' | 'support';

export interface TmaFeature {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  route: string;
  category: FeatureCategory;
  ready: boolean;
}

export interface TmaCategory {
  id: FeatureCategory;
  title: string;
  features: TmaFeature[];
}

const ALL_FEATURES: TmaFeature[] = [
  // ── Прогресс ──
  {
    id: 'dashboard',
    title: 'Главный экран',
    description: 'Весь проект на одном экране: прогресс, бюджет, сроки, уведомления',
    icon: LayoutGrid,
    route: '/tma/dashboard',
    category: 'progress',
    ready: false,
  },
  {
    id: 'stages',
    title: '14 уровней пути',
    description: 'Визуальная карта от выбора участка до заезда. Каждый этап — отдельный уровень',
    icon: Layers,
    route: '/tma/stages',
    category: 'progress',
    ready: true,
  },
  {
    id: 'achievements',
    title: 'Достижения',
    description: 'Геймификация строительства. Награды за этапы снижают тревожность клиента',
    icon: Medal,
    route: '/tma/achievements',
    category: 'progress',
    ready: false,
  },
  {
    id: 'stats',
    title: 'Статистика проекта',
    description: 'Аналитика в реальном времени: дней в стройке, фото, затраты, прогресс',
    icon: BarChart3,
    route: '/tma/stats',
    category: 'progress',
    ready: false,
  },

  // ── Финансы ──
  {
    id: 'budget',
    title: 'Интерактивная смета',
    description: 'Круговая диаграмма вместо PDF. 3 уровня детализации. AI объясняет каждую позицию',
    icon: CircleDollarSign,
    route: '/tma/budget',
    category: 'finance',
    ready: false,
  },
  {
    id: 'payments',
    title: 'График платежей',
    description: 'Календарь оплат с push-напоминаниями. Видишь когда и сколько платить',
    icon: CalendarDays,
    route: '/tma/payments',
    category: 'finance',
    ready: false,
  },
  {
    id: 'calculator',
    title: 'AI-калькулятор бюджета',
    description: 'Рассчитай примерную стоимость дома до начала стройки. Учитывает регион и материалы',
    icon: Calculator,
    route: '/tma/calculator',
    category: 'finance',
    ready: false,
  },
  {
    id: 'compare',
    title: 'Сравнение смет',
    description: 'Загрузи смету конкурента — AI найдёт скрытые расходы и покажет разницу',
    icon: Maximize2,
    route: '/tma/compare',
    category: 'finance',
    ready: false,
  },

  // ── Медиа ──
  {
    id: 'photos',
    title: 'Фото каждый день',
    description: 'Автоматическая доставка фото со стройки. Прораб делает — ты смотришь в телефоне',
    icon: Image,
    route: '/tma/photos',
    category: 'media',
    ready: false,
  },
  {
    id: 'timelapse',
    title: 'Таймлапс стройки',
    description: 'Автоматическое видео из всех фото. Покажи друзьям как рос твой дом за 30 секунд',
    icon: Play,
    route: '/tma/timelapse',
    category: 'media',
    ready: false,
  },
  {
    id: 'documents',
    title: 'Документы и акты',
    description: 'Договоры, чертежи, акты приёмки — всё в одном месте. Скачивай в любой момент',
    icon: FileText,
    route: '/tma/documents',
    category: 'media',
    ready: false,
  },
  {
    id: 'quality',
    title: 'Контроль качества',
    description: 'Фото с отметками проверки. Видишь что принято, что нужно исправить',
    icon: CheckCircle2,
    route: '/tma/quality',
    category: 'media',
    ready: false,
  },

  // ── Поддержка ──
  {
    id: 'chat',
    title: 'AI помощник 24/7',
    description: 'Мгновенные ответы на 70% вопросов. Понимает контекст твоего проекта',
    icon: MessageCircle,
    route: '/tma/chat',
    category: 'support',
    ready: false,
  },
  {
    id: 'notifications',
    title: 'Push-уведомления',
    description: 'Залили фундамент, загружены новые фото, пора платить — всё придёт в телефон',
    icon: Bell,
    route: '/tma/notifications',
    category: 'support',
    ready: false,
  },
  {
    id: 'tasks',
    title: 'Чек-листы задач',
    description: 'Знаешь что от тебя требуется на каждом этапе. Отмечаешь выполненное',
    icon: CheckSquare,
    route: '/tma/tasks',
    category: 'support',
    ready: false,
  },
  {
    id: 'education',
    title: 'База знаний',
    description: 'Видео-гайды, глоссарий терминов, база типичных ошибок — станешь экспертом',
    icon: BookOpen,
    route: '/tma/education',
    category: 'support',
    ready: false,
  },
];

export const TMA_CATEGORIES: TmaCategory[] = [
  { id: 'progress', title: 'Прогресс', features: ALL_FEATURES.filter((f) => f.category === 'progress') },
  { id: 'finance', title: 'Финансы', features: ALL_FEATURES.filter((f) => f.category === 'finance') },
  { id: 'media', title: 'Медиа', features: ALL_FEATURES.filter((f) => f.category === 'media') },
  { id: 'support', title: 'Поддержка', features: ALL_FEATURES.filter((f) => f.category === 'support') },
];

export function getFeatureById(id: string): TmaFeature | undefined {
  return ALL_FEATURES.find((f) => f.id === id);
}
