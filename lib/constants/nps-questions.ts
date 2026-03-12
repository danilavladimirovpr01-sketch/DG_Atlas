import type { EmployeePosition } from '@/types';

export interface NpsQuestion {
  key: string;
  label: string;
  type: 'rating' | 'text';
}

export interface StageNpsConfig {
  employeePosition: EmployeePosition;
  questions: NpsQuestion[];
}

export const POSITION_LABELS: Record<EmployeePosition, string> = {
  manager: 'Менеджер',
  architect: 'Архитектор',
  foreman: 'Прораб',
  project_manager: 'Менеджер проекта',
};

/**
 * NPS-вопросы по 8 воронкам (1 в 1 с бэкендом FunnelStatusService).
 * Ключ — номер воронки (0–7).
 */
export const NPS_QUESTIONS: Record<number, StageNpsConfig> = {
  // 0 — Проектирование АР/КР (Архитектор)
  0: {
    employeePosition: 'architect',
    questions: [
      { key: 'q1', label: 'Насколько архитектор учёл ваши пожелания и требования при разработке проекта?', type: 'rating' },
      { key: 'q2', label: 'Насколько понятно и подробно специалист объяснял решения по планировке?', type: 'rating' },
      { key: 'q3', label: 'Насколько вежливым и доброжелательным был архитектор?', type: 'rating' },
      { key: 'q4', label: 'Насколько оперативно архитектор отвечал на ваши вопросы?', type: 'rating' },
      { key: 'q5', label: 'Насколько наглядно были представлены чертежи и визуализации?', type: 'rating' },
      { key: 'q6', label: 'Насколько вы в целом довольны результатом проектирования АР/КР?', type: 'rating' },
      { key: 'comment', label: 'Что можно улучшить на этом этапе?', type: 'text' },
    ],
  },

  // 1 — Стройка ОБЩ (Прораб)
  1: {
    employeePosition: 'foreman',
    questions: [
      { key: 'q1', label: 'Насколько качественно выполнены работы по фундаменту и стенам?', type: 'rating' },
      { key: 'q2', label: 'Насколько качественно выполнен монтаж кровли?', type: 'rating' },
      { key: 'q3', label: 'Насколько вежливым и доброжелательным был прораб на площадке?', type: 'rating' },
      { key: 'q4', label: 'Насколько оперативно вас информировали о ходе строительства?', type: 'rating' },
      { key: 'q5', label: 'Насколько соблюдались заявленные сроки?', type: 'rating' },
      { key: 'q6', label: 'Насколько вы в целом довольны результатом этапа «Тёплый контур»?', type: 'rating' },
      { key: 'comment', label: 'Что можно улучшить на этом этапе?', type: 'text' },
    ],
  },

  // 2 — Дизайн проект (Архитектор)
  2: {
    employeePosition: 'architect',
    questions: [
      { key: 'q1', label: 'Насколько дизайнер учёл ваши пожелания и стиль жизни при разработке интерьера?', type: 'rating' },
      { key: 'q2', label: 'Насколько понятно и наглядно были представлены визуализации интерьера?', type: 'rating' },
      { key: 'q3', label: 'Насколько вежливым и доброжелательным был дизайнер?', type: 'rating' },
      { key: 'q4', label: 'Насколько оперативно дизайнер вносил корректировки?', type: 'rating' },
      { key: 'q5', label: 'Насколько вы довольны подбором материалов и цветовых решений?', type: 'rating' },
      { key: 'q6', label: 'Насколько вы в целом довольны итоговым дизайн-проектом?', type: 'rating' },
      { key: 'comment', label: 'Что можно улучшить?', type: 'text' },
    ],
  },

  // 3 — Инженерный проект (Архитектор)
  3: {
    employeePosition: 'architect',
    questions: [
      { key: 'q1', label: 'Насколько полно специалист учёл ваши требования к инженерным системам?', type: 'rating' },
      { key: 'q2', label: 'Насколько понятно были объяснены схемы коммуникаций?', type: 'rating' },
      { key: 'q3', label: 'Насколько вежливым и доброжелательным был специалист?', type: 'rating' },
      { key: 'q4', label: 'Насколько оперативно были подготовлены проектные документы?', type: 'rating' },
      { key: 'q5', label: 'Насколько вы в целом довольны инженерным проектом?', type: 'rating' },
      { key: 'comment', label: 'Что можно улучшить?', type: 'text' },
    ],
  },

  // 4 — Стройка ИНЖ (Прораб)
  4: {
    employeePosition: 'foreman',
    questions: [
      { key: 'q1', label: 'Насколько качественно смонтированы инженерные системы (электрика, отопление, водоснабжение)?', type: 'rating' },
      { key: 'q2', label: 'Насколько понятно вам объяснили схемы коммуникаций и правила эксплуатации?', type: 'rating' },
      { key: 'q3', label: 'Насколько вежливым и доброжелательным был прораб?', type: 'rating' },
      { key: 'q4', label: 'Насколько оперативно выполнялись работы?', type: 'rating' },
      { key: 'q5', label: 'Насколько соблюдались заявленные сроки?', type: 'rating' },
      { key: 'q6', label: 'Насколько вы в целом довольны инженерными коммуникациями?', type: 'rating' },
      { key: 'comment', label: 'Что можно улучшить?', type: 'text' },
    ],
  },

  // 5 — Стройка ОТД (Прораб)
  5: {
    employeePosition: 'foreman',
    questions: [
      { key: 'q1', label: 'Насколько качественно выполнены отделочные работы (стены, потолки, полы)?', type: 'rating' },
      { key: 'q2', label: 'Насколько результат соответствует утверждённому дизайн-проекту?', type: 'rating' },
      { key: 'q3', label: 'Насколько вежливым и доброжелательным был прораб?', type: 'rating' },
      { key: 'q4', label: 'Насколько оперативно вас информировали о ходе работ?', type: 'rating' },
      { key: 'q5', label: 'Насколько соблюдались заявленные сроки?', type: 'rating' },
      { key: 'q6', label: 'Насколько вы в целом довольны результатом внутренней отделки?', type: 'rating' },
      { key: 'comment', label: 'Что можно улучшить?', type: 'text' },
    ],
  },

  // 6 — Стройка фасад (Прораб)
  6: {
    employeePosition: 'foreman',
    questions: [
      { key: 'q1', label: 'Насколько качественно выполнена отделка фасада?', type: 'rating' },
      { key: 'q2', label: 'Насколько результат соответствует выбранному вами варианту (материал, цвет)?', type: 'rating' },
      { key: 'q3', label: 'Насколько вежливым и доброжелательным был прораб?', type: 'rating' },
      { key: 'q4', label: 'Насколько оперативно вас информировали о ходе работ?', type: 'rating' },
      { key: 'q5', label: 'Насколько соблюдались заявленные сроки?', type: 'rating' },
      { key: 'q6', label: 'Насколько вы в целом довольны внешним видом фасада?', type: 'rating' },
      { key: 'comment', label: 'Что можно улучшить?', type: 'text' },
    ],
  },

  // 7 — Ландшафт (Прораб)
  7: {
    employeePosition: 'foreman',
    questions: [
      { key: 'q1', label: 'Насколько качественно выполнено благоустройство участка?', type: 'rating' },
      { key: 'q2', label: 'Насколько результат соответствует согласованному плану?', type: 'rating' },
      { key: 'q3', label: 'Насколько вежливым и доброжелательным был специалист по ландшафту?', type: 'rating' },
      { key: 'q4', label: 'Насколько оперативно выполнялись работы?', type: 'rating' },
      { key: 'q5', label: 'Насколько вы довольны качеством дорожек, отмостки, забора?', type: 'rating' },
      { key: 'q6', label: 'Насколько вы в целом довольны внешним видом участка?', type: 'rating' },
      { key: 'comment', label: 'Что можно улучшить?', type: 'text' },
    ],
  },
};
