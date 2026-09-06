-- civic-app Supabase schema
-- Apply to the project this app's NEXT_PUBLIC_SUPABASE_URL points at
-- (SQL editor or `supabase db push`). Additive and idempotent.

-- Training progress: one row per user; drives the dashboard, profile,
-- and the anonymized public leaderboard.
create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  xp integer not null default 0,
  streak integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

-- Leaderboard reads are public but expose only user_id/xp/streak
-- (the app renders a truncated id, never an email).
drop policy if exists "progress_public_read" on public.progress;
create policy "progress_public_read"
  on public.progress for select
  using (true);

drop policy if exists "progress_owner_write" on public.progress;
create policy "progress_owner_write"
  on public.progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "progress_owner_update" on public.progress;
create policy "progress_owner_update"
  on public.progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Q&A history: private to its owner.
create table if not exists public.history (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamptz not null default now()
);

create index if not exists history_user_created_idx
  on public.history (user_id, created_at desc);

alter table public.history enable row level security;

drop policy if exists "history_owner_read" on public.history;
create policy "history_owner_read"
  on public.history for select
  using (auth.uid() = user_id);

drop policy if exists "history_owner_insert" on public.history;
create policy "history_owner_insert"
  on public.history for insert
  with check (auth.uid() = user_id);
