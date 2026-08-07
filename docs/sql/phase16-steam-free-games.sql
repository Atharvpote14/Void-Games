-- ══════════════════════════════════════════════════════════════════════
-- VOID GAMES - PHASE 16 STEAM FREE GAMES SCHEMA
-- Run this once in Supabase Dashboard > SQL Editor > Run
-- Adds: steam_free_content (video link) + steam_free_steps (steps with links).
-- Idempotent: safe to run multiple times.
-- ══════════════════════════════════════════════════════════════════════

create table if not exists public.steam_free_content (
  id integer primary key check (id = 1),
  video_url text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.steam_free_content (id, video_url)
values (1, '')
on conflict (id) do nothing;

create table if not exists public.steam_free_steps (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  description text not null default '',
  link_label text not null default '',
  link_url text not null default '',
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists steam_free_steps_position_idx
  on public.steam_free_steps (position, created_at);
