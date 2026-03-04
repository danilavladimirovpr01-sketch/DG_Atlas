/* ═══════════════════════════════════════════════════════════════
   SMETA DATA — Болотова, Коркино МС, 148.75 м², СПб
   Источник: 24.02 - Болотова Коркино МС - ТТХ.csv
   TODO: заменить на Google Sheets API (FR-SMETA-01)
   ═══════════════════════════════════════════════════════════════ */

export interface LineItem {
  name: string;
  unit: string;
  qty: number;
  unitPrice?: number; // ₽ за единицу
  amount?: number;    // итог по позиции
  hidden: boolean;    // скрытый расход
  aiText: string;
}

export interface SmetaCategory {
  id: string;
  label: string;
  color: string;
  iconName: 'Building' | 'Layers' | 'Triangle' | 'Sun' | 'Droplets' | 'AppWindow' | 'Brush' | 'Zap' | 'LayoutDashboard';
  total: number;
  works: number;
  materials: number;
  isHiddenCost: boolean;
  hiddenExplain?: string;
  daysFrom?: number; // день от старта проекта
  daysTo?: number;
  items: LineItem[];
}

export interface Upgrade {
  id: string;
  label: string;
  sub: string;
  amount: number;
  popular: boolean;
  categoryId: string; // к какому разделу относится
}

export interface MarketRow {
  label: string;
  unit: string;
  ours: number;
  min: number;
  max: number;
}

/* ── МЕТА ── */
export const SMETA_META = {
  version: 'v3',
  date: '24 февраля 2025',
  object: 'Коркино МС',
  area: 148.75,
  pricePerSqm: 63_920, // теплый контур, СПб (из ТТХ)
  city: 'СПб',
  paid: 3_380_000,     // TODO: из финансового модуля
};

/* ── КАТЕГОРИИ ── */
export const CATEGORIES: SmetaCategory[] = [
  {
    id: 'foundation',
    label: 'Фундамент',
    color: '#FF9800',
    iconName: 'Building',
    total: 2_535_710,
    works: 989_570,
    materials: 1_546_140,
    isHiddenCost: false,
    daysFrom: 1,
    daysTo: 21,
    items: [
      {
        name: 'Котлован',
        unit: 'м²', qty: 267, unitPrice: 750, amount: 200_250,
        hidden: false,
        aiText: 'Котлован — выемка грунта под плиту. Без него плита ляжет на нестабильный слой и даст трещину через 2–3 года.',
      },
      {
        name: 'Засыпка песком',
        unit: 'м³', qty: 180, unitPrice: 1_800, amount: 324_000,
        hidden: false,
        aiText: 'Песчаная подушка равномерно распределяет нагрузку по площади плиты и дренирует воду от основания.',
      },
      {
        name: 'Плита монолитная',
        unit: 'м²', qty: 175.7, unitPrice: 7_200, amount: 1_265_040,
        hidden: false,
        aiText: 'Монолитная плита — самый надёжный фундамент для газобетонных домов. Исключает неравномерную осадку и трещины в стенах.',
      },
      {
        name: 'Бетон В25',
        unit: 'м³', qty: 46.12, unitPrice: 8_500, amount: 392_020,
        hidden: false,
        aiText: 'Марка В25 — обязательный минимум для несущей плиты. Более дешёвый бетон не выдержит нагрузку 200+ тонн.',
      },
      {
        name: 'Арматура Ø10–12 мм',
        unit: 'т', qty: 2.86, unitPrice: 85_000, amount: 243_100,
        hidden: false,
        aiText: 'Арматура придаёт плите устойчивость к растяжению. Бетон хорошо работает на сжатие, металл — на растяжение.',
      },
      {
        name: 'Утепление ЭППС под плитой',
        unit: 'м³', qty: 0.5, unitPrice: 50_000, amount: 25_000,
        hidden: true,
        aiText: 'Снижает теплопотери через пол на 15–20% и предотвращает промерзание грунта под плитой зимой. Конкуренты часто не включают.',
      },
      {
        name: 'Закладные для канализации',
        unit: 'шт', qty: 7, unitPrice: 12_500, amount: 87_500,
        hidden: true,
        aiText: 'Бетонируются ДО заливки плиты. Прорезать потом — от 30K ₽ и опасно для армирования. Нужно делать сразу.',
      },
    ],
  },
  {
    id: 'walls',
    label: 'Стены и перекрытия',
    color: '#4cd964',
    iconName: 'Layers',
    total: 4_008_127,
    works: 1_963_637,
    materials: 2_044_490,
    isHiddenCost: false,
    daysFrom: 22,
    daysTo: 75,
    items: [
      {
        name: 'Газоблоки D400 (наружные, 400 мм)',
        unit: 'м³', qty: 58.62, unitPrice: 5_800, amount: 340_000,
        hidden: false,
        aiText: 'D400 — оптимальный газоблок для несущих стен. Тёплый, прочный, паропроницаемый. Дом "дышит" без конденсата.',
      },
      {
        name: 'Газоблоки D500 (внутренние)',
        unit: 'м³', qty: 15.83, unitPrice: 6_200, amount: 98_100,
        hidden: false,
        aiText: 'Более плотные блоки для несущих внутренних стен — выдерживают нагрузку перекрытия.',
      },
      {
        name: 'Перегородки из газоблока',
        unit: 'м²', qty: 114, unitPrice: 5_450, amount: 621_000,
        hidden: false,
        aiText: 'Газоблок 100–150 мм лучше гипсокартона по звукоизоляции и не прогибается при ударе.',
      },
      {
        name: 'Монолитное перекрытие',
        unit: 'м²', qty: 172.2, unitPrice: 9_900, amount: 1_705_000,
        hidden: false,
        aiText: 'Монолитная плита между этажами обеспечивает жёсткость всего здания — дом не "гуляет".',
      },
      {
        name: 'Бетон В25 (перекрытие)',
        unit: 'м³', qty: 36.66, unitPrice: 8_500, amount: 311_600,
        hidden: false,
        aiText: 'Тот же стандарт В25 — обязательное требование для монолитных перекрытий.',
      },
      {
        name: 'Монолитный армопояс',
        unit: 'м.пог', qty: 63, unitPrice: 1_480, amount: 93_240,
        hidden: true,
        aiText: 'Армопояс — бетонный пояс по верху стен, который связывает их в единое кольцо. Без него стены расходятся при осадке.',
      },
    ],
  },
  {
    id: 'roof',
    label: 'Кровля',
    color: '#5AC8FA',
    iconName: 'Triangle',
    total: 2_262_273,
    works: 1_134_788,
    materials: 1_127_485,
    isHiddenCost: false,
    daysFrom: 76,
    daysTo: 105,
    items: [
      {
        name: 'ПВХ-мембрана (плоская кровля)',
        unit: 'м²', qty: 167.9, unitPrice: 4_000, amount: 671_600,
        hidden: false,
        aiText: 'ПВХ мембрана — современное решение для плоских кровель. Служит 25–30 лет без ремонта при правильном монтаже.',
      },
      {
        name: 'Аэраторы кровельные',
        unit: 'шт', qty: 4, unitPrice: 4_500, amount: 18_000,
        hidden: true,
        aiText: 'Выводят водяной пар из кровельного пирога. Без аэраторов мембрана вздуется пузырями уже через 3–5 лет.',
      },
      {
        name: 'Воронки парапетные',
        unit: 'шт', qty: 2, unitPrice: 8_500, amount: 17_000,
        hidden: true,
        aiText: 'Единственный выход воды с плоской кровли. Без воронок при первом ливне потечёт прямо в дом.',
      },
      {
        name: 'Водосточная система',
        unit: 'м.пог', qty: 8, unitPrice: 5_650, amount: 45_200,
        hidden: false,
        aiText: 'Организованный отвод воды от фасада и фундамента продлевает срок службы обоих.',
      },
    ],
  },
  {
    id: 'terrace',
    label: 'Терраса',
    color: '#AF52DE',
    iconName: 'Sun',
    total: 816_592,
    works: 495_457,
    materials: 321_135,
    isHiddenCost: false,
    daysFrom: 76,
    daysTo: 105,
    items: [
      {
        name: 'Каркас террасы (42.9 м²)',
        unit: 'м²', qty: 42.89, unitPrice: 9_000, amount: 386_000,
        hidden: false,
        aiText: 'Деревянный каркас открытой террасы из сухой строганой доски.',
      },
      {
        name: 'Клееный брус (столбы)',
        unit: 'м³', qty: 1.06, unitPrice: 50_000, amount: 53_000,
        hidden: false,
        aiText: 'Клееный брус не крутится и не трескается в отличие от обычного — важно для открытой улицы.',
      },
      {
        name: 'Сваи Ø108 мм',
        unit: 'шт', qty: 8, unitPrice: 15_000, amount: 120_000,
        hidden: false,
        aiText: 'Металлические винтовые сваи — фундамент под террасу без земляных работ.',
      },
    ],
  },
  {
    id: 'engineering',
    label: 'Инженерные работы',
    color: '#FF3B30',
    iconName: 'Droplets',
    total: 901_182,
    works: 487_869,
    materials: 413_313,
    isHiddenCost: true,
    hiddenExplain: 'Большинство конкурентов не включают дренаж и ливнёвку в базовую цену — они появляются потом как "доп. работы" на финальном этапе.',
    daysFrom: 22,
    daysTo: 45,
    items: [
      {
        name: 'Дренаж',
        unit: 'м.пог', qty: 82.98, unitPrice: 3_900, amount: 323_600,
        hidden: true,
        aiText: 'Дренажная труба отводит грунтовые воды от фундамента. Без неё вода подмывает основание — через 5–10 лет плита тонет.',
      },
      {
        name: 'Ливневая канализация',
        unit: 'м.пог', qty: 70.98, unitPrice: 3_600, amount: 255_500,
        hidden: true,
        aiText: 'Отводит дождевую воду с участка. Без ливнёвки — постоянные лужи у дома и влажный подпол.',
      },
      {
        name: 'Цоколь и отмостка',
        unit: 'м.пог', qty: 63.18, unitPrice: 5_100, amount: 322_200,
        hidden: true,
        aiText: 'Бетонная отмостка по периметру защищает фундамент от промокания. Без неё вода идёт прямо под плиту.',
      },
    ],
  },
  {
    id: 'windows',
    label: 'Окна',
    color: '#34C759',
    iconName: 'AppWindow',
    total: 747_270,
    works: 0,
    materials: 747_270,
    isHiddenCost: false,
    daysFrom: 90,
    daysTo: 105,
    items: [
      {
        name: 'Окна ПВХ',
        unit: 'м²', qty: 36.1, unitPrice: 20_700, amount: 747_270,
        hidden: false,
        aiText: 'Двухкамерные стеклопакеты в ПВХ-профиле. Адаптированы под монтаж в газобетонные стены.',
      },
    ],
  },
];

/* ── АПГРЕЙДЫ ── */
export const UPGRADES: Upgrade[] = [
  { id: 'heated_floors', label: 'Тёплый пол', sub: 'Все жилые комнаты', amount: 280_000, popular: true, categoryId: 'walls' },
  { id: 'extra_insulation', label: 'Доп. утепление фасада', sub: 'Минвата 100 мм', amount: 320_000, popular: true, categoryId: 'walls' },
  { id: 'smart_home', label: 'Умный дом', sub: 'Базовый пакет', amount: 180_000, popular: false, categoryId: 'engineering' },
  { id: 'heated_driveway', label: 'Обогрев отмостки', sub: 'Кабельный', amount: 95_000, popular: false, categoryId: 'engineering' },
];

/* ── СРАВНЕНИЕ С РЫНКОМ ── */
export const MARKET_COMPARISON: MarketRow[] = [
  { label: 'Фундамент монолит', unit: '₽/м²', ours: 14_432, min: 11_000, max: 20_000 },
  { label: 'Кровля ПВХ плоская', unit: '₽/м²', ours: 13_474, min: 9_000, max: 18_000 },
  { label: 'Окна ПВХ', unit: '₽/м²', ours: 20_700, min: 14_000, max: 28_000 },
  { label: 'Теплый контур под ключ', unit: '₽/м²', ours: 63_920, min: 48_000, max: 85_000 },
];

/* ── ВЫЧИСЛЕННЫЕ КОНСТАНТЫ ── */
export const TOTAL = CATEGORIES.reduce((s, c) => s + c.total, 0);
export const HIDDEN_TOTAL = CATEGORIES.filter(c => c.isHiddenCost).reduce((s, c) => s + c.total, 0);
