-- ══════════════════════════════════════════════════════════════════════
-- VOID GAMES - PHASE 17 FIX ARTICLE LINKS SCHEMA
-- Run this once in Supabase Dashboard > SQL Editor > Run
-- Adds: optional links column on fix_articles (JSON array of
--   { label, url } entries) so admins can attach download links to fixes.
-- Idempotent: safe to run multiple times.
-- ══════════════════════════════════════════════════════════════════════

alter table public.fix_articles
  add column if not exists links jsonb not null default '[]'::jsonb;
