-- ══════════════════════════════════════════════════════════════════════
-- VOID GAMES - PHASE 12 ADMIN USERS / REPORTS SCHEMA
-- Run this once in Supabase Dashboard > SQL Editor > Run
-- Adds: reports table + users.is_banned column.
-- Idempotent: safe to run multiple times.
-- ══════════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────────────
-- 1. USERS: banned flag (admin ban / unban)
-- ──────────────────────────────────────────────────────────────────────
alter table public.users
  add column if not exists is_banned boolean not null default false;

create index if not exists users_is_banned_idx on public.users (is_banned);

-- ──────────────────────────────────────────────────────────────────────
-- 2. REPORTS
-- One row per user-submitted problem report about a game.
-- user_id is optional (guests can report) and kept on user deletion
-- so the report history is preserved.
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete set null,
  game_id uuid not null references public.games (id) on delete cascade,
  reason text not null,
  message text not null default '',
  status text not null default 'pending' check (status in ('pending', 'solved')),
  created_at timestamptz not null default now()
);

create index if not exists reports_status_idx on public.reports (status);
create index if not exists reports_game_idx on public.reports (game_id);
create index if not exists reports_created_at_idx on public.reports (created_at desc);
