-- ══════════════════════════════════════════════════════════════════════
-- VOID GAMES - PHASE 11: GAME BADGES LIST
-- Replaces the two fixed badge label columns with a flexible list of
-- badges shown on the game details page.
-- Run this once in Supabase Dashboard > SQL Editor > Run
-- ══════════════════════════════════════════════════════════════════════

alter table public.games
  add column if not exists badges text[] not null default '{}';

-- Backfill existing badge labels so nothing changes until edited
update public.games
set badges = array_remove(array_remove(array_remove(
  array[open_world_label, featured_label], ''), null), '')
where badges = '{}'
  and (open_world_label <> '' or featured_label <> '');
