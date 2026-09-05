-- Supabase schema for Know Your Rights AI
-- Run in the Supabase SQL editor (or via the CLI) to create the tables the app
-- reads and writes. Auth users come from Supabase Auth (auth.users).

-- ---------------------------------------------------------------------------
-- users: public profile + gamification state (read by the leaderboard)
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id      uuid primary key references auth.users (id) on delete cascade,
  email   text,
  xp      integer not null default 0,
  streak  integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;

-- Anyone (even anonymous) may read the leaderboard.
drop policy if exists "users are readable by everyone" on public.users;
create policy "users are readable by everyone"
  on public.users for select
  using (true);

-- A user may create/update only their own row.
drop policy if exists "users manage own row" on public.users;
create policy "users manage own row"
  on public.users for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Populate public.users automatically when someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- history: saved AI Q&A per user (written by /api/ask)
-- ---------------------------------------------------------------------------
create table if not exists public.history (
  id         bigint generated always as identity primary key,
  user_id    uuid references auth.users (id) on delete cascade,
  question   text not null,
  answer     text not null,
  created_at timestamptz not null default now()
);

alter table public.history enable row level security;

drop policy if exists "history is private to its owner" on public.history;
create policy "history is private to its owner"
  on public.history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
