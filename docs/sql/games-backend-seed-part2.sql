-- ══════════════════════════════════════════════════════════════════════
-- VOID GAMES - GAMES BACKEND SEED (PART 2 - CONTINUATION)
-- Run this ONLY if games-backend-seed.sql already inserted games,
-- genres and screenshots, but failed at the download links step.
-- It fills in download_links, game_tags and collection_games.
-- ══════════════════════════════════════════════════════════════════════

insert into public.download_links (game_id, provider, mirror_name, download_url, file_size, password, is_active, sort_order)
select g.id, v.provider, v.mirror_name, v.download_url, v.file_size, v.password, v.is_active, v.sort_order
from (values
  ('shadow-protocol',   'Terabox',    'Terabox - Fast',      'https://www.terabox.com/s/1shadow01', 41266833408, 'vg123',  true, 0),
  ('shadow-protocol',   'Pixeldrain', 'Pixeldrain Mirror',   'https://pixeldrain.com/u/1shadow01',  41266833408, '',      true, 1),
  ('neon-drift',        'Terabox',    'Terabox - Fast',      'https://www.terabox.com/s/1neon01',   26843545600, 'vg123',  true, 0),
  ('neon-drift',        'GoFile',     'GoFile Mirror',       'https://gofile.io/d/neon01',          26843545600, '',      true, 1),
  ('kingdom-of-ashes',  'Terabox',    'Terabox - Fast',      'https://www.terabox.com/s/1king01',   75161927680, 'vg123',  true, 0),
  ('kingdom-of-ashes',  'MEGA',       'MEGA Mirror',         'https://mega.nz/file/1king01',        75161927680, '',      true, 1),
  ('frostbound',        'Terabox',    'Terabox - Fast',      'https://www.terabox.com/s/1frost01',  55834574848, 'vg123',  true, 0),
  ('frostbound',        'Pixeldrain', 'Pixeldrain Mirror',   'https://pixeldrain.com/u/1frost01',   55834574848, '',      true, 1),
  ('cyber-heist',       'Terabox',    'Terabox - Fast',      'https://www.terabox.com/s/1heist01',  32212254720, 'vg123',  true, 0),
  ('cyber-heist',       'Google Drive','Google Drive Mirror','https://drive.google.com/drive/folders/1heist01', 32212254720, '', true, 1),
  ('rift-raiders',      'Terabox',    'Terabox - Fast',      'https://www.terabox.com/s/1rift01',   21474836480, 'vg123',  true, 0),
  ('rift-raiders',      'GoFile',     'GoFile Mirror',       'https://gofile.io/d/rift01',          21474836480, '',      true, 1),
  ('whisper-of-the-void','Terabox',   'Terabox - Fast',      'https://www.terabox.com/s/1whisp01',  19327352832, 'vg123',  true, 0),
  ('whisper-of-the-void','MediaFire', 'MediaFire Mirror',    'https://www.mediafire.com/folder/1whisp01', 19327352832, '', true, 1),
  ('isle-of-embers',    'Terabox',    'Terabox - Fast',      'https://www.terabox.com/s/1isle01',   12884901888, 'vg123',  true, 0),
  ('isle-of-embers',    'Pixeldrain', 'Pixeldrain Mirror',   'https://pixeldrain.com/u/1isle01',    12884901888, '',      true, 1),
  ('iron-league',       'Terabox',    'Terabox - Fast',      'https://www.terabox.com/s/1iron01',   26843545600, 'vg123',  true, 0),
  ('iron-league',       'MEGA',       'MEGA Mirror',         'https://mega.nz/file/1iron01',        26843545600, '',      true, 1),
  ('stellar-frontier',  'Terabox',    'Terabox - Fast',      'https://www.terabox.com/s/1stellar01', 40802189312, 'vg123', true, 0),
  ('stellar-frontier',  'GoFile',     'GoFile Mirror',       'https://gofile.io/d/stellar01',       40802189312, '',      true, 1)
) as v(slug, provider, mirror_name, download_url, file_size, password, is_active, sort_order)
join public.games g on g.slug = v.slug;

insert into public.game_tags (game_id, tag_name)
select g.id, t.tag
from (values
  ('shadow-protocol', 'FPS'), ('shadow-protocol', 'Co-op'), ('shadow-protocol', 'Stealth'), ('shadow-protocol', 'Multiplayer'),
  ('neon-drift', 'Racing'), ('neon-drift', 'Arcade'), ('neon-drift', 'Split-screen'),
  ('kingdom-of-ashes', 'RPG'), ('kingdom-of-ashes', 'Dark Fantasy'), ('kingdom-of-ashes', 'Turn-based'),
  ('frostbound', 'Survival'), ('frostbound', 'Open World'), ('frostbound', 'Co-op'), ('frostbound', 'Crafting'),
  ('cyber-heist', 'Action'), ('cyber-heist', 'Stealth'), ('cyber-heist', 'Cyberpunk'),
  ('rift-raiders', 'Action'), ('rift-raiders', 'Roguelike'), ('rift-raiders', 'Co-op'),
  ('whisper-of-the-void', 'Horror'), ('whisper-of-the-void', 'Psychological'), ('whisper-of-the-void', 'Singleplayer'),
  ('isle-of-embers', 'Adventure'), ('isle-of-embers', 'Puzzle'), ('isle-of-embers', 'Story-driven'),
  ('iron-league', 'Sports'), ('iron-league', 'Football'), ('iron-league', 'Management'),
  ('stellar-frontier', 'Open World'), ('stellar-frontier', 'Space'), ('stellar-frontier', 'Base Building')
) as t(slug, tag)
join public.games g on g.slug = t.slug;

insert into public.collection_games (collection_id, game_id, position)
select col.id, g.id, v.pos
from (values
  ('editors-picks', 'shadow-protocol', 0),
  ('editors-picks', 'kingdom-of-ashes', 1),
  ('editors-picks', 'frostbound', 2),
  ('editors-picks', 'rift-raiders', 3),
  ('best-for-low-end-pcs', 'isle-of-embers', 0),
  ('best-for-low-end-pcs', 'cyber-heist', 1),
  ('best-for-low-end-pcs', 'whisper-of-the-void', 2),
  ('best-for-low-end-pcs', 'neon-drift', 3)
) as v(collection_slug, game_slug, pos)
join public.collections col on col.slug = v.collection_slug
join public.games g on g.slug = v.game_slug;
