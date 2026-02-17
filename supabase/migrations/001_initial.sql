-- DG Atlas MVP: Initial Schema

-- Profiles (extends Supabase Auth users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null default '',
  role text not null default 'client' check (role in ('client', 'manager', 'admin')),
  telegram_id text unique,
  phone text unique,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Service role full access"
  on public.profiles for all
  using (auth.role() = 'service_role');

-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles(id) on delete cascade not null,
  manager_id uuid references public.profiles(id) on delete set null,
  title text not null default '',
  current_stage int not null default 1 check (current_stage between 1 and 14),
  status text not null default 'active' check (status in ('active', 'completed', 'paused')),
  cover_photo_url text,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Clients see own projects"
  on public.projects for select
  using (auth.uid() = client_id);

create policy "Managers see assigned projects"
  on public.projects for select
  using (auth.uid() = manager_id);

create policy "Service role full access"
  on public.projects for all
  using (auth.role() = 'service_role');

-- Stage Photos
create table public.stage_photos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  stage int not null check (stage between 1 and 14),
  photo_url text not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.stage_photos enable row level security;

create policy "Project participants see photos"
  on public.stage_photos for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = stage_photos.project_id
        and (projects.client_id = auth.uid() or projects.manager_id = auth.uid())
    )
  );

create policy "Service role full access"
  on public.stage_photos for all
  using (auth.role() = 'service_role');

-- NPS Responses
create table public.nps_responses (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  stage int not null check (stage between 1 and 14),
  score int not null check (score between 0 and 10),
  comment text,
  created_at timestamptz not null default now(),
  unique (client_id, project_id, stage)
);

alter table public.nps_responses enable row level security;

create policy "Clients manage own NPS"
  on public.nps_responses for all
  using (auth.uid() = client_id);

create policy "Service role full access"
  on public.nps_responses for all
  using (auth.role() = 'service_role');

-- Calls
create table public.calls (
  id uuid primary key default gen_random_uuid(),
  manager_id uuid references public.profiles(id) on delete cascade not null,
  audio_url text not null,
  transcript text,
  score int,
  analysis_status text not null default 'pending' check (analysis_status in ('pending', 'transcribing', 'analyzing', 'done', 'error')),
  ai_summary text,
  created_at timestamptz not null default now()
);

alter table public.calls enable row level security;

create policy "Managers see own calls"
  on public.calls for select
  using (auth.uid() = manager_id);

create policy "Managers insert own calls"
  on public.calls for insert
  with check (auth.uid() = manager_id);

create policy "Service role full access"
  on public.calls for all
  using (auth.role() = 'service_role');

-- Checklist Items
create table public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  criterion text not null,
  weight int not null default 1,
  is_active boolean not null default true,
  order_index int not null default 0
);

alter table public.checklist_items enable row level security;

create policy "Anyone can read active checklist"
  on public.checklist_items for select
  using (is_active = true);

create policy "Service role full access"
  on public.checklist_items for all
  using (auth.role() = 'service_role');

-- Call Criterion Scores
create table public.call_criterion_scores (
  id uuid primary key default gen_random_uuid(),
  call_id uuid references public.calls(id) on delete cascade not null,
  criterion_id uuid references public.checklist_items(id) on delete cascade not null,
  passed boolean not null default false,
  ai_comment text
);

alter table public.call_criterion_scores enable row level security;

create policy "Service role full access"
  on public.call_criterion_scores for all
  using (auth.role() = 'service_role');

-- Seed: Default Checklist Items
insert into public.checklist_items (category, criterion, weight, order_index) values
  -- Приветствие
  ('Приветствие', 'Представился по имени', 1, 1),
  ('Приветствие', 'Назвал компанию', 1, 2),
  ('Приветствие', 'Спросил как обращаться к клиенту', 1, 3),
  -- Выявление потребностей
  ('Выявление потребностей', 'Уточнил бюджет', 1, 4),
  ('Выявление потребностей', 'Уточнил сроки', 1, 5),
  ('Выявление потребностей', 'Спросил про участок', 1, 6),
  ('Выявление потребностей', 'Выяснил кто принимает решение', 1, 7),
  -- Презентация
  ('Презентация', 'Рассказал про платформу и 14 этапов', 1, 8),
  ('Презентация', 'Показал преимущества компании', 1, 9),
  ('Презентация', 'Привёл примеры реализованных проектов', 1, 10),
  -- Работа с возражениями
  ('Работа с возражениями', 'Не давил на клиента', 1, 11),
  ('Работа с возражениями', 'Ответил на все вопросы', 1, 12),
  ('Работа с возражениями', 'Привёл аргументы и примеры', 1, 13),
  -- Закрытие
  ('Закрытие', 'Назначил следующий шаг', 1, 14),
  ('Закрытие', 'Взял контактные данные / обозначил дедлайн', 1, 15);

-- Enable Realtime for calls table
alter publication supabase_realtime add table public.calls;
