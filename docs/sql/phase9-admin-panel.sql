-- ══════════════════════════════════════════════════════════════════════
-- VOID GAMES - PHASE 9A ADMIN PANEL SCHEMA
-- Run this once in Supabase Dashboard > SQL Editor > Run
-- Adds the columns required by the Phase 9a admin panel.
-- Idempotent: safe to run multiple times.
-- ══════════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────────────
-- GAMES: developer / publisher / logo_image
-- (normally added by games-hero-upgrade.sql; the admin game form
--  writes these fields, so they must exist)
-- ──────────────────────────────────────────────────────────────────────
alter table public.games
  add column if not exists logo_image text not null default '',
  add column if not exists publisher text not null default '',
  add column if not exists developer text not null default '';
