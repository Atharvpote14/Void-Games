-- ══════════════════════════════════════════════════════════════════════
-- VOID GAMES - HERO UPGRADE (logo_image, publisher, developer)
-- Run this once after games-backend-seed.sql (or after re-running a fresh seed).
-- ══════════════════════════════════════════════════════════════════════

alter table public.games
  add column if not exists logo_image text not null default '',
  add column if not exists publisher text not null default '',
  add column if not exists developer text not null default '';

update public.games g
set logo_image = v.logo,
    publisher = v.publisher,
    developer = v.developer
from (values
  ('shadow-protocol', 'https://placehold.co/320x160/151A26/00D4FF?text=SHADOW+PROTOCOL&font=montserrat', 'VoidWorks Interactive', 'VoidWorks Interactive'),
  ('neon-drift',      'https://placehold.co/320x160/151A26/7B5CFF?text=NEON+DRIFT&font=montserrat',     'Driftware',            'Driftware'),
  ('kingdom-of-ashes','https://placehold.co/320x160/151A26/FFC857?text=KINGDOM+OF+ASHES&font=montserrat','Ashfall Studios',      'Ashfall Studios'),
  ('frostbound',      'https://placehold.co/320x160/151A26/00D4FF?text=FROSTBOUND&font=montserrat',      'Northreach Studio',    'Northreach Studio'),
  ('cyber-heist',     'https://placehold.co/320x160/151A26/7B5CFF?text=CYBER+HEIST&font=montserrat',     'Neonline Games',       'Neonline Games'),
  ('rift-raiders',    'https://placehold.co/320x160/151A26/16E05A?text=RIFT+RAIDERS&font=montserrat',    'Riftware',             'Riftware'),
  ('whisper-of-the-void', 'https://placehold.co/320x160/151A26/EF4444?text=WHISPER+OF+THE+VOID&font=montserrat', 'Dreadlight', 'Dreadlight'),
  ('isle-of-embers',  'https://placehold.co/320x160/151A26/FFC857?text=ISLE+OF+EMBERS&font=montserrat',  'Emberforge',           'Emberforge'),
  ('iron-league',     'https://placehold.co/320x160/151A26/22C55E?text=IRON+LEAGUE&font=montserrat',     'Ironline Sports',      'Ironline Sports'),
  ('stellar-frontier','https://placehold.co/320x160/151A26/00D4FF?text=STELLAR+FRONTIER&font=montserrat','Stellar Bay Games',    'Stellar Bay Games')
) as v(slug, logo, publisher, developer)
where g.slug = v.slug;
