-- ============================================
-- Migration 002: Update stages (0-14) + Employees + Extended NPS
-- ============================================

-- 1. Employees table
create table public.employees (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  position text not null check (position in ('manager', 'architect', 'foreman', 'project_manager')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.employees enable row level security;

create policy "Service role full access"
  on public.employees for all
  using (auth.role() = 'service_role');

create policy "Anyone can read employees"
  on public.employees for select
  using (true);

-- 2. Seed employees (4 per role)
INSERT INTO public.employees (full_name, position) VALUES
  -- Менеджеры (этапы 0-Мечта, 1-Участок, 2-Компания, 4-Смета, 14-Сервис)
  ('Алексей Петров', 'manager'),
  ('Дмитрий Козлов', 'manager'),
  ('Елена Смирнова', 'manager'),
  ('Виктория Орлова', 'manager'),
  -- Архитекторы (этапы 3-Проектирование, 9-Дизайн-проект)
  ('Андрей Волков', 'architect'),
  ('Мария Белова', 'architect'),
  ('Сергей Новиков', 'architect'),
  ('Анна Климова', 'architect'),
  -- Прорабы (этапы 5-Фундамент, 6-Крыша, 8-Фасад, 10-Отделка, 11-Коммуникации, 12-Ландшафт)
  ('Иван Сидоров', 'foreman'),
  ('Николай Кузнецов', 'foreman'),
  ('Павел Морозов', 'foreman'),
  ('Максим Громов', 'foreman'),
  -- Менеджеры проекта (этапы 7-Тёплый контур, 13-Заезд)
  ('Ольга Васильева', 'project_manager'),
  ('Артём Лебедев', 'project_manager'),
  ('Татьяна Фёдорова', 'project_manager'),
  ('Дарья Соколова', 'project_manager');

-- 3. Update stage constraints: 1-14 → 0-14
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_current_stage_check;
ALTER TABLE public.projects ADD CONSTRAINT projects_current_stage_check CHECK (current_stage BETWEEN 0 AND 14);
UPDATE public.projects SET current_stage = current_stage - 1 WHERE current_stage > 0;

ALTER TABLE public.stage_photos DROP CONSTRAINT IF EXISTS stage_photos_stage_check;
ALTER TABLE public.stage_photos ADD CONSTRAINT stage_photos_stage_check CHECK (stage BETWEEN 0 AND 14);
UPDATE public.stage_photos SET stage = stage - 1 WHERE stage > 0;

ALTER TABLE public.nps_responses DROP CONSTRAINT IF EXISTS nps_responses_stage_check;
ALTER TABLE public.nps_responses ADD CONSTRAINT nps_responses_stage_check CHECK (stage BETWEEN 0 AND 14);
UPDATE public.nps_responses SET stage = stage - 1 WHERE stage > 0;

-- 4. Extend nps_responses
ALTER TABLE public.nps_responses
  ADD COLUMN IF NOT EXISTS employee_id uuid references public.employees(id) on delete set null,
  ADD COLUMN IF NOT EXISTS answers jsonb DEFAULT '{}';

-- 5. Fix default current_stage: 1 → 0
ALTER TABLE public.projects ALTER COLUMN current_stage SET DEFAULT 0;
