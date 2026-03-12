/**
 * Чек-листы задач клиента по этапам строительства.
 * Каждый этап (0-14) содержит список задач, которые клиент должен выполнить.
 */

export type ChecklistItemStatus = 'done' | 'active' | 'upcoming';

export interface StageChecklistItem {
  id: string;
  text: string;
  status: ChecklistItemStatus;
  deadline?: string; // "2 дня", "5 дней", etc.
  note?: string;
}

export interface StageChecklist {
  stageNumber: number;
  stageTitle: string;
  items: StageChecklistItem[];
}

export const STAGE_CHECKLISTS: StageChecklist[] = [
  {
    stageNumber: 0,
    stageTitle: 'Мечта',
    items: [
      { id: '0-1', text: 'Определить бюджет на строительство', status: 'done' },
      { id: '0-2', text: 'Выбрать тип дома (газобетон / каркас)', status: 'done' },
      { id: '0-3', text: 'Определить желаемую площадь', status: 'done' },
      { id: '0-4', text: 'Собрать пожелания семьи', status: 'done' },
    ],
  },
  {
    stageNumber: 1,
    stageTitle: 'Участок',
    items: [
      { id: '1-1', text: 'Предоставить кадастровый номер участка', status: 'done' },
      { id: '1-2', text: 'Загрузить ГПЗУ', status: 'done' },
      { id: '1-3', text: 'Согласовать посадку дома на участке', status: 'done' },
    ],
  },
  {
    stageNumber: 2,
    stageTitle: 'Компания',
    items: [
      { id: '2-1', text: 'Посмотреть видео-обзоры объектов', status: 'done' },
      { id: '2-2', text: 'Посетить строящийся объект', status: 'done' },
      { id: '2-3', text: 'Подписать договор', status: 'done' },
    ],
  },
  {
    stageNumber: 3,
    stageTitle: 'Проектирование',
    items: [
      { id: '3-1', text: 'Выбрать проект дома', status: 'done' },
      { id: '3-2', text: 'Утвердить планировку этажей', status: 'done' },
      { id: '3-3', text: 'Согласовать фасадные решения', status: 'done' },
      { id: '3-4', text: 'Подписать проектную документацию', status: 'done' },
    ],
  },
  {
    stageNumber: 4,
    stageTitle: 'Смета',
    items: [
      { id: '4-1', text: 'Изучить разбивку сметы по этапам', status: 'done' },
      { id: '4-2', text: 'Задать вопросы по позициям', status: 'done' },
      { id: '4-3', text: 'Утвердить итоговую смету', status: 'done' },
    ],
  },
  {
    stageNumber: 5,
    stageTitle: 'Фундамент и стены',
    items: [
      { id: '5-1', text: 'Внести первый платёж', status: 'done' },
      { id: '5-2', text: 'Утвердить схему электрики', status: 'active', deadline: '5 дней' },
      { id: '5-3', text: 'Выбрать цвет фасада', status: 'active', deadline: '2 дня' },
      { id: '5-4', text: 'Подписать акт скрытых работ (фундамент)', status: 'active', deadline: '3 дня' },
      { id: '5-5', text: 'Согласовать расположение розеток', status: 'upcoming' },
      { id: '5-6', text: 'Принять кладку 1-го этажа', status: 'upcoming' },
    ],
  },
  {
    stageNumber: 6,
    stageTitle: 'Крыша',
    items: [
      { id: '6-1', text: 'Утвердить цвет металлочерепицы', status: 'upcoming' },
      { id: '6-2', text: 'Согласовать водосточную систему', status: 'upcoming' },
      { id: '6-3', text: 'Подписать акт приёмки кровли', status: 'upcoming' },
    ],
  },
  {
    stageNumber: 7,
    stageTitle: 'Тёплый контур',
    items: [
      { id: '7-1', text: 'Проверить герметичность окон', status: 'upcoming' },
      { id: '7-2', text: 'Принять установку входной двери', status: 'upcoming' },
      { id: '7-3', text: 'Подписать акт тёплого контура', status: 'upcoming' },
    ],
  },
  {
    stageNumber: 8,
    stageTitle: 'Отделка фасада',
    items: [
      { id: '8-1', text: 'Финально утвердить цвет фасада', status: 'upcoming' },
      { id: '8-2', text: 'Выбрать тип отделки цоколя', status: 'upcoming' },
      { id: '8-3', text: 'Принять фасадные работы', status: 'upcoming' },
    ],
  },
  {
    stageNumber: 9,
    stageTitle: 'Дизайн-проект',
    items: [
      { id: '9-1', text: 'Заполнить бриф на дизайн интерьера', status: 'upcoming' },
      { id: '9-2', text: 'Согласовать 3D-визуализации', status: 'upcoming' },
      { id: '9-3', text: 'Утвердить спецификацию материалов', status: 'upcoming' },
    ],
  },
  {
    stageNumber: 10,
    stageTitle: 'Внутренняя отделка',
    items: [
      { id: '10-1', text: 'Выбрать плитку и напольное покрытие', status: 'upcoming' },
      { id: '10-2', text: 'Согласовать укладку тёплого пола', status: 'upcoming' },
      { id: '10-3', text: 'Принять штукатурные работы', status: 'upcoming' },
      { id: '10-4', text: 'Принять чистовую отделку', status: 'upcoming' },
    ],
  },
  {
    stageNumber: 11,
    stageTitle: 'Инженерные коммуникации',
    items: [
      { id: '11-1', text: 'Согласовать схему отопления', status: 'upcoming' },
      { id: '11-2', text: 'Утвердить точки подключения сантехники', status: 'upcoming' },
      { id: '11-3', text: 'Принять электромонтажные работы', status: 'upcoming' },
      { id: '11-4', text: 'Принять систему вентиляции', status: 'upcoming' },
    ],
  },
  {
    stageNumber: 12,
    stageTitle: 'Ландшафтный дизайн',
    items: [
      { id: '12-1', text: 'Утвердить план благоустройства', status: 'upcoming' },
      { id: '12-2', text: 'Выбрать растения для озеленения', status: 'upcoming' },
      { id: '12-3', text: 'Согласовать дорожки и освещение', status: 'upcoming' },
    ],
  },
  {
    stageNumber: 13,
    stageTitle: 'Заезд',
    items: [
      { id: '13-1', text: 'Пройти финальную приёмку с прорабом', status: 'upcoming' },
      { id: '13-2', text: 'Подписать акт приёмки дома', status: 'upcoming' },
      { id: '13-3', text: 'Получить ключи и документацию', status: 'upcoming' },
    ],
  },
  {
    stageNumber: 14,
    stageTitle: 'Сервис',
    items: [
      { id: '14-1', text: 'Активировать гарантийное обслуживание', status: 'upcoming' },
      { id: '14-2', text: 'Ознакомиться с инструкцией по эксплуатации', status: 'upcoming' },
      { id: '14-3', text: 'Оставить отзыв о строительстве', status: 'upcoming' },
    ],
  },
];

/** Get checklist for a specific stage */
export function getChecklistByStage(stageNumber: number): StageChecklist | undefined {
  return STAGE_CHECKLISTS.find((c) => c.stageNumber === stageNumber);
}

/** Get summary stats across all stages */
export function getChecklistStats(_currentStage?: number) {
  const all = STAGE_CHECKLISTS.flatMap((c) => c.items);
  const done = all.filter((i) => i.status === 'done').length;
  const active = all.filter((i) => i.status === 'active').length;
  const upcoming = all.filter((i) => i.status === 'upcoming').length;
  return { total: all.length, done, active, upcoming };
}
