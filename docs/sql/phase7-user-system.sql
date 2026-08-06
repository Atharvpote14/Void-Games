-- ══════════════════════════════════════════════════════════════════════
-- VOID GAMES - PHASE 7 USER SYSTEM SCHEMA
-- Run this entire script once in Supabase Dashboard > SQL Editor > Run
-- ══════════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────────────
-- 1. USERS
-- Profile data linked 1:1 to Supabase Auth (auth.users)
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  google_id text,
  name text not null default '',
  username text,
  email text,
  avatar text,
  role text not null default 'user' check (role in ('user', 'admin')),
  bio text not null default '',
  country text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Unique username (allows multiple NULLs before usernames are set)
create unique index if not exists users_username_unique
  on public.users (username) where username is not null;

create index if not exists users_email_idx on public.users (email);

-- ──────────────────────────────────────────────────────────────────────
-- 2. FAVORITES
-- game_id + denormalized game snapshot so the Favorites page can render
-- even before the games table exists (Phase 9 adds the FK + join).
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  game_id uuid not null,
  game_title text not null default '',
  game_slug text not null default '',
  game_cover text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, game_id)
);

-- When the games table is created (Phase 9):
--   alter table public.favorites
--     add constraint favorites_game_id_fkey
--     foreign key (game_id) references public.games (id) on delete cascade;

create index if not exists favorites_user_idx on public.favorites (user_id);

-- ──────────────────────────────────────────────────────────────────────
-- 3. DOWNLOAD HISTORY
-- One row per game per user (re-download updates the timestamp).
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.download_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  game_id uuid not null,
  game_title text not null default '',
  game_slug text not null default '',
  game_cover text not null default '',
  downloaded_at timestamptz not null default now(),
  ip_address text,
  unique (user_id, game_id)
);

create index if not exists download_history_user_idx
  on public.download_history (user_id);

-- ──────────────────────────────────────────────────────────────────────
-- 4. AUTO-CREATE PROFILE ON SIGNUP
-- Fires whenever Supabase Auth creates a user (Google login, etc.)
-- ──────────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, google_id, name, username, email, avatar)
  values (
    new.id,
    (new.raw_user_meta_data ->> 'google_id'),
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      ''
    ),
    null,
    new.email,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ──────────────────────────────────────────────────────────────────────
-- 5. ROW LEVEL SECURITY (defense in depth; the server uses the service
-- role key which bypasses RLS, but policies keep the publishable key safe)
-- ──────────────────────────────────────────────────────────────────────
alter table public.users enable row level security;
alter table public.favorites enable row level security;
alter table public.download_history enable row level security;

-- users: read + update only your own profile
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- favorites: full control over your own rows
drop policy if exists "favorites_select_own" on public.favorites;
create policy "favorites_select_own" on public.favorites
  for select using (auth.uid() = user_id);

drop policy if exists "favorites_insert_own" on public.favorites;
create policy "favorites_insert_own" on public.favorites
  for insert with check (auth.uid() = user_id);

drop policy if exists "favorites_delete_own" on public.favorites;
create policy "favorites_delete_own" on public.favorites
  for delete using (auth.uid() = user_id);

-- download history: read + insert your own rows
drop policy if exists "download_history_select_own" on public.download_history;
create policy "download_history_select_own" on public.download_history
  for select using (auth.uid() = user_id);

drop policy if exists "download_history_insert_own" on public.download_history;
create policy "download_history_insert_own" on public.download_history
  for insert with check (auth.uid() = user_id);

drop policy if exists "download_history_delete_own" on public.download_history;
create policy "download_history_delete_own" on public.download_history
  for delete using (auth.uid() = user_id);
