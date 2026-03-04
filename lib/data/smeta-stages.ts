/* ═══════════════════════════════════════════════════════════════
   ЭТАПЫ СМЕТ — реестр всех этапов строительства
   ═══════════════════════════════════════════════════════════════ */

export type StageStatus = 'active' | 'in_progress' | 'soon' | 'locked';

export interface SmetaStage {
  id: string;
  label: string;
  sub: string;
  description: string;
  status: StageStatus;
  total: number | null;   // null = смета ещё не считалась
  paid: number;
  iconName: 'home' | 'brush' | 'zap' | 'layout';
  color: string;
  order: number;
}

export const SMETA_STAGES: SmetaStage[] = [
  {
    id: 'warm-frame',
    label: 'Тёплый контур',
    sub: 'Фундамент, стены, кровля, окна',
    description: 'Всё, что создаёт закрытый тёплый объём дома: земляные работы, плита, стены из газоблока, кровля, окна и терраса.',
    status: 'active',
    total: 11_271_154,
    paid: 3_380_000,
    iconName: 'home',
    color: '#FF9800',
    order: 1,
  },
  {
    id: 'exterior',
    label: 'Внешняя отделка',
    sub: 'Фасад, отмостка, благоустройство',
    description: 'Штукатурка или облицовка фасада, финишная отмостка, входная группа, озеленение и мощение.',
    status: 'active',
    total: 2_847_500,
    paid: 0,
    iconName: 'brush',
    color: '#5AC8FA',
    order: 2,
  },
  {
    id: 'engineering',
    label: 'Инженерные системы',
    sub: 'Электрика, водоснабжение, отопление',
    description: 'Электроразводка, щиток, водоснабжение и канализация, отопление (тёплые полы + радиаторы), вентиляция.',
    status: 'active',
    total: 3_565_500,
    paid: 0,
    iconName: 'zap',
    color: '#AF52DE',
    order: 3,
  },
  {
    id: 'interior',
    label: 'Внутренняя отделка',
    sub: 'По дизайн-проекту',
    description: 'Считается после утверждения дизайн-проекта. Полы, стены, потолки, двери, сантехника, освещение.',
    status: 'active',
    total: 5_196_050,
    paid: 0,
    iconName: 'layout',
    color: '#34C759',
    order: 4,
  },
];

export const STATUS_LABEL: Record<StageStatus, string> = {
  active:      'Актуальная',
  in_progress: 'Считается',
  soon:        'Скоро',
  locked:      'Ожидает этапа',
};

export const STATUS_COLOR: Record<StageStatus, string> = {
  active:      '#FF9800',
  in_progress: '#5AC8FA',
  soon:        '#666',
  locked:      '#333',
};
