-- ══════════════════════════════════════════════════════════════════════
-- VOID GAMES - PHASE 15 GAME SUGGESTIONS SCHEMA
-- Run this once in Supabase Dashboard > SQL Editor > Run
-- Adds: game_suggestions table for user-submitted game requests.
-- Idempotent: safe to run multiple times.
-- ══════════════════════════════════════════════════════════════════════

create table if not exists public.game_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete set null,
  game_name text not null,
  genre text not null default '',
  description text not null default '',
  download_links text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note text not null default '',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- One pending suggestion per user (prevents spam).
-- Guests (user_id null) are not affected since nulls never collide.
create unique index if not exists game_suggestions_one_pending_per_user
  on public.game_suggestions (user_id) where status = 'pending';

create index if not exists game_suggestions_status_idx on public.game_suggestions (status);
create index if not exists game_suggestions_created_at_idx on public.game_suggestions (created_at desc);
