import type { Stage } from '@/types';
import type { EmployeePosition } from '@/types';

export interface StageConfig extends Stage {
  employeePosition: EmployeePosition;
  /** Код воронки из Laravel FunnelStatusService */
  funnelCode: string;
  /** Вес воронки для расчёта общего прогресса */
  weight: number;
  /** ID смарт-процесса в Bitrix24 */
  smartProcessId: number | null;
  /** ID категории в Bitrix24 */
  categoryId: number | null;
}

/**
 * 8 воронок — 1 в 1 с FunnelStatusService на бэкенде (Laravel).
 * Порядок, названия, коды и веса совпадают.
 */
export const STAGES: StageConfig[] = [
  {
    number: 0,
    slug: 'design_ar_kr',
    funnelCode: 'design_ar_kr',
    title: 'Проектирование АР/КР',
    description: 'Архитектурный и конструктивный разделы проекта',
    defaultPhoto: '/stages/00-design-ar-kr.jpg',
    employeePosition: 'architect',
    weight: 10,
    smartProcessId: 133,
    categoryId: 11,
  },
  {
    number: 1,
    slug: 'construction_common',
    funnelCode: 'construction_common',
    title: 'Стройка ОБЩ',
    description: 'Фундамент, стены, кровля — тёплый контур',
    defaultPhoto: '/stages/01-construction-common.jpg',
    employeePosition: 'foreman',
    weight: 30,
    smartProcessId: 184,
    categoryId: 25,
  },
  {
    number: 2,
    slug: 'design_project',
    funnelCode: 'design_project',
    title: 'Дизайн проект',
    description: 'Проект интерьера и дизайн-решения',
    defaultPhoto: '/stages/02-design-project.jpg',
    employeePosition: 'architect',
    weight: 5,
    smartProcessId: 133,
    categoryId: 21,
  },
  {
    number: 3,
    slug: 'engineering_project',
    funnelCode: 'engineering_project',
    title: 'Инженерный проект',
    description: 'Проект инженерных систем',
    defaultPhoto: '/stages/03-engineering-project.jpg',
    employeePosition: 'architect',
    weight: 5,
    smartProcessId: 133,
    categoryId: 19,
  },
  {
    number: 4,
    slug: 'construction_engineering',
    funnelCode: 'construction_engineering',
    title: 'Стройка ИНЖ',
    description: 'Электрика, отопление, водоснабжение, канализация',
    defaultPhoto: '/stages/04-construction-engineering.jpg',
    employeePosition: 'foreman',
    weight: 15,
    smartProcessId: 184,
    categoryId: 27,
  },
  {
    number: 5,
    slug: 'construction_finishing',
    funnelCode: 'construction_finishing',
    title: 'Стройка ОТД',
    description: 'Внутренняя отделка помещений',
    defaultPhoto: '/stages/05-construction-finishing.jpg',
    employeePosition: 'foreman',
    weight: 15,
    smartProcessId: 184,
    categoryId: 29,
  },
  {
    number: 6,
    slug: 'construction_facade',
    funnelCode: 'construction_facade',
    title: 'Стройка фасад',
    description: 'Отделка фасада: штукатурка, клинкер, панели',
    defaultPhoto: '/stages/06-construction-facade.jpg',
    employeePosition: 'foreman',
    weight: 10,
    smartProcessId: null,
    categoryId: null,
  },
  {
    number: 7,
    slug: 'landscape',
    funnelCode: 'landscape',
    title: 'Ландшафт',
    description: 'Благоустройство участка, озеленение, дорожки',
    defaultPhoto: '/stages/07-landscape.jpg',
    employeePosition: 'foreman',
    weight: 10,
    smartProcessId: null,
    categoryId: null,
  },
];
