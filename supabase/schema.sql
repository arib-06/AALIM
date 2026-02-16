-- ============================================================
--  AALIM — Supabase Database Schema
--  Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Profiles ────────────────────────────────────────────────
-- Extends Supabase auth.users with learning preferences
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  username        text unique,
  font_scale      integer   default 100,
  line_height     numeric   default 1.6,
  tts_enabled     boolean   default true,
  reduce_motion   boolean   default false,
  dyslexia_font   boolean   default false,
  streak_days     integer   default 0,
  last_active     date,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Topics ──────────────────────────────────────────────────
create table if not exists public.topics (
  id          uuid primary key default uuid_generate_v4(),
  key         text unique not null,
  label       text not null,
  description text,
  total       integer default 10,
  sort_order  integer default 0
);

-- ── Lessons ─────────────────────────────────────────────────
create table if not exists public.lessons (
  id          uuid primary key default uuid_generate_v4(),
  topic_id    uuid references public.topics(id) on delete cascade,
  title       text not null,
  content     jsonb,           -- structured lesson content
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

-- ── User Progress ────────────────────────────────────────────
create table if not exists public.user_progress (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade,
  topic_key   text not null,
  progress    integer default 0,
  completed   boolean default false,
  updated_at  timestamptz default now(),
  unique(user_id, topic_key)
);

-- ── Badges ──────────────────────────────────────────────────
create table if not exists public.badges (
  id          uuid primary key default uuid_generate_v4(),
  key         text unique not null,
  label       text not null,
  description text,
  xp          integer default 0,
  rarity      text check (rarity in ('common','rare','epic','legendary')),
  goal        integer default 1
);

-- ── User Badges ──────────────────────────────────────────────
create table if not exists public.user_badges (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade,
  badge_key   text not null,
  progress    integer default 0,
  unlocked    boolean default false,
  unlocked_at timestamptz,
  unique(user_id, badge_key)
);

-- ── Chat History ─────────────────────────────────────────────
create table if not exists public.chat_history (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade,
  title       text not null,
  messages    jsonb default '[]',
  topic_key   text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── Row Level Security ───────────────────────────────────────
alter table public.profiles       enable row level security;
alter table public.user_progress  enable row level security;
alter table public.user_badges    enable row level security;
alter table public.chat_history   enable row level security;

-- Profiles: users can only read/write their own
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Progress: users can read/write their own
create policy "Users can view own progress"
  on public.user_progress for select using (auth.uid() = user_id);
create policy "Users can upsert own progress"
  on public.user_progress for all using (auth.uid() = user_id);

-- Badges: public read, own write
create policy "Anyone can view badge definitions"
  on public.badges for select using (true);
create policy "Users can view own badge progress"
  on public.user_badges for select using (auth.uid() = user_id);
create policy "Users can upsert own badge progress"
  on public.user_badges for all using (auth.uid() = user_id);

-- Chat history: private to user
create policy "Users can view own chats"
  on public.chat_history for select using (auth.uid() = user_id);
create policy "Users can manage own chats"
  on public.chat_history for all using (auth.uid() = user_id);

-- Topics & Lessons: public read
alter table public.topics  enable row level security;
alter table public.lessons enable row level security;
create policy "Topics are public" on public.topics  for select using (true);
create policy "Lessons are public" on public.lessons for select using (true);
