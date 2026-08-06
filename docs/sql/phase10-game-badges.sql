-- ══════════════════════════════════════════════════════════════════════
-- VOID GAMES - PHASE 10: GAME BADGE LABELS
-- Adds admin-editable text labels for the "Open World" and "Featured"
-- badges shown on the game details page.
-- Run this once in Supabase Dashboard > SQL Editor > Run
-- ══════════════════════════════════════════════════════════════════════

alter table public.games
  add column if not exists open_world_label text not null default '',
  add column if not exists featured_label text not null default '';

-- Backfill defaults from existing data so nothing changes until edited
update public.games
set open_world_label = 'Open World'
where open_world_label = ''
  and 'Open World' = any(features);

update public.games
set featured_label = 'Featured'
where featured_label = ''
  and is_featured;
