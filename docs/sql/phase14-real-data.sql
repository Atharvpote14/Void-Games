-- ============================================================
-- PHASE 14 — REAL DATA CLEANUP
-- Removes sample games (keeping only the 3 featured ones) and
-- resets counters so dashboard stats reflect real activity.
-- Safe to run: all child rows (screenshots, download_links,
-- game_tags, collection_games, favorites, download_history,
-- comments, ratings) cascade on game deletion.
-- ============================================================

-- Remove sample games except the featured ones
delete from public.games
where is_featured = false;

-- Reset counters to zero so they grow from real activity
-- (game page views via GET /api/v1/games/:slug, downloads
--  via GET /api/v1/download/:game_slug)
update public.games
set views = 0,
    downloads = 0;

-- Sanity check: only the 3 featured games should remain
select title, slug, is_featured, views, downloads
from public.games
order by title;
