-- ══════════════════════════════════════════════════════════════════════
-- VOID GAMES - GAMES BACKEND SEED DATA
-- Run AFTER games-backend-schema.sql
-- Clear anytime: delete from collection_games; delete from game_tags;
-- delete from screenshots; delete from download_links; delete from games;
-- delete from collections; delete from categories;
-- ══════════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────────────
-- CATEGORIES
-- ──────────────────────────────────────────────────────────────────────
insert into public.categories (name, slug, description, icon, color, sort_order) values
('Action',      'action',      'Fast-paced gameplay focused on combat and reflexes.', 'Swords',    '#2EA8FF', 1),
('RPG',         'rpg',         'Role-playing games with deep character progression.',  'Shield',    '#7B61FF', 2),
('FPS',         'fps',         'First-person shooters built around aiming skill.',     'Crosshair', '#22C55E', 3),
('Racing',      'racing',      'Speed, cars, and tracks from arcade to simulation.',   'Car',       '#F59E0B', 4),
('Horror',      'horror',      'Atmospheric games designed to unsettle and scare.',    'Ghost',     '#EF4444', 5),
('Adventure',   'adventure',   'Story-driven journeys of exploration and puzzles.',    'Map',       '#FFC857', 6),
('Sports',      'sports',      'Competitive games of football, racing, and more.',     'Dumbbell',  '#1493F7', 7),
('Open World',  'open-world',  'Expansive maps that let you go anywhere, do anything.','Globe',     '#22D3EE', 8);

-- ──────────────────────────────────────────────────────────────────────
-- COLLECTIONS
-- ──────────────────────────────────────────────────────────────────────
insert into public.collections (title, slug, description, thumbnail) values
('Editor''s Picks', 'editors-picks', 'The games our team keeps coming back to in 2026.', 'https://picsum.photos/seed/collection-editors/1920/720'),
('Best for Low-End PCs', 'best-for-low-end-pcs', 'Optimized titles that run great on modest hardware.', 'https://picsum.photos/seed/collection-lowend/1920/720');

-- ──────────────────────────────────────────────────────────────────────
-- GAMES
-- ──────────────────────────────────────────────────────────────────────
insert into public.games (
  title, slug, short_description, description, cover_image, banner_image,
  version, size_bytes, release_date, video_url, website_url, features,
  installation_instructions, system_requirements, is_featured, is_trending,
  views, downloads, created_at
) values
(
  'Shadow Protocol',
  'shadow-protocol',
  'A tactical FPS where every shot tells a story.',
  $g$Shadow Protocol drops you into a fractured megacity where a shadowy syndicate controls the streets. As an elite operative, every mission is a choice between stealth, sabotage, and open fire.

The game blends tight gunplay with light stealth mechanics. Weapons are fully modular, and the city reacts to how you play: break the truce and entire districts go dark.

Played solo or in four-player co-op, Shadow Protocol rewards planning as much as aim. The procedurally placed objective towers keep every run fresh.$g$,
  'https://picsum.photos/seed/cover-shadow/900/1200',
  'https://picsum.photos/seed/banner-shadow/1920/720',
  '2.4.1',
  41266833408,
  '2025-11-18',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://void-games.example.com/shadow-protocol',
  '{"Full co-op campaign", "Modular weapon system", "Dynamic night cycle", "Steam Cloud saves", "Controller support"}',
  '1. Extract the archive with 7-Zip or WinRAR.
2. Run Setup.exe as administrator.
3. Install to a simple path like D:\Games\ShadowProtocol.
4. Add the install folder to your antivirus exclusions.
5. Launch ShadowProtocol.exe from the folder, not a shortcut.',
  '{"minimum": {"os": "Windows 10 64-bit", "processor": "Intel i5-8400 / AMD Ryzen 5 2600", "memory": "8 GB RAM", "graphics": "GTX 1060 6GB / RX 580", "storage": "45 GB", "directx": "Version 12"}, "recommended": {"os": "Windows 11 64-bit", "processor": "Intel i7-12700K / AMD Ryzen 7 5800X", "memory": "16 GB RAM", "graphics": "RTX 3070 / RX 6800", "storage": "45 GB SSD", "directx": "Version 12"}}',
  true,
  true,
  48213,
  12054,
  now() - interval '40 days'
),
(
  'Neon Drift',
  'neon-drift',
  'Arcade racing through rain-soaked neon streets.',
  $g$Neon Drift is a love letter to 90s arcade racers. Pick a machine, tune it, and drift through the glowing streets of a city that never sleeps.

The physics sit between arcade and simulation: easy to learn, endlessly deep to master. Chain drifts to fill your boost meter, then punch through traffic at 300 km/h.

Online leaderboards and ghost replays keep every track a competition. Local split-screen makes it a party game too.$g$,
  'https://picsum.photos/seed/cover-neon/900/1200',
  'https://picsum.photos/seed/banner-neon/1920/720',
  '1.8.3',
  26843545600,
  '2025-09-02',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://void-games.example.com/neon-drift',
  '{"40+ cars", "12 neon cities", "Drift-based boost system", "Split-screen multiplayer", "Ghost replays"}',
  '1. Extract the archive.
2. Run the installer as administrator.
3. Let the installer add the game folder to your firewall exceptions.
4. Launch from the desktop shortcut or the game folder.',
  '{"minimum": {"os": "Windows 10 64-bit", "processor": "Intel i5-6500 / AMD FX-8350", "memory": "8 GB RAM", "graphics": "GTX 1050 Ti / RX 570", "storage": "30 GB", "directx": "Version 11"}, "recommended": {"os": "Windows 11 64-bit", "processor": "Intel i5-11400 / AMD Ryzen 5 3600", "memory": "16 GB RAM", "graphics": "RTX 2060 / RX 6600", "storage": "30 GB SSD", "directx": "Version 12"}}',
  false,
  true,
  31450,
  9821,
  now() - interval '31 days'
),
(
  'Kingdom of Ashes',
  'kingdom-of-ashes',
  'A dark fantasy RPG where choices burn bridges.',
  $g$The kingdom fell a century ago, but its embers still glow. You are the last flamekeeper, hunting the truth behind the fire that consumed the old world.

Kingdom of Ashes pairs a branching narrative with tactical combat. Every faction has a price, every ally a debt, and every quest a consequence that echoes into the final act.

Over 60 hours of content, fully voiced characters, and a crafting system that turns even scraps of the old kingdom into weapons.$g$,
  'https://picsum.photos/seed/cover-kingdom/900/1200',
  'https://picsum.photos/seed/banner-kingdom/1920/720',
  '3.1.0',
  75161927680,
  '2025-07-14',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://void-games.example.com/kingdom-of-ashes',
  '{"60+ hour campaign", "Branching storylines", "Tactical turn-based combat", "Deep crafting", "Multiple endings"}',
  '1. Mount or extract the ISO.
2. Run the setup executable.
3. Install with the installer''s default options.
4. Copy the crack from the CODEX folder into the install directory if prompted.
5. Launch the game from KingdomOfAshes.exe.',
  '{"minimum": {"os": "Windows 10 64-bit", "processor": "Intel i5-9600K / AMD Ryzen 5 3600", "memory": "12 GB RAM", "graphics": "GTX 1660 Super / RX 5600 XT", "storage": "80 GB", "directx": "Version 12"}, "recommended": {"os": "Windows 11 64-bit", "processor": "Intel i7-11700 / AMD Ryzen 7 5800X3D", "memory": "16 GB RAM", "graphics": "RTX 3060 Ti / RX 6700 XT", "storage": "80 GB SSD", "directx": "Version 12"}}',
  true,
  false,
  58720,
  8760,
  now() - interval '28 days'
),
(
  'Frostbound',
  'frostbound',
  'Survive an endless winter in an open frozen world.',
  $g$A solar event tipped the planet into an ice age. Frostbound drops you into a living wilderness where warmth is currency and every expedition can be your last.

Hunt, craft, and build across a 40 km² map of frozen forests, abandoned cities, and glacier caves. Weather is dynamic: blizzards change the hunting grounds every day.

Your camp is the heart of survival. Upgrade it, stock it, and defend it from the creatures that hunger for heat.$g$,
  'https://picsum.photos/seed/cover-frostbound/900/1200',
  'https://picsum.photos/seed/banner-frostbound/1920/720',
  '1.2.0',
  55834574848,
  '2025-10-05',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://void-games.example.com/frostbound',
  '{"40 km² open world", "Dynamic weather", "Base building", "Co-op survival", "Crafting system"}',
  '1. Extract the archive.
2. Run Frostbound_Setup.exe as administrator.
3. Install the game and required DirectX components.
4. Launch Frostbound.exe from the install folder.',
  '{"minimum": {"os": "Windows 10 64-bit", "processor": "Intel i5-8400 / AMD Ryzen 5 2600", "memory": "8 GB RAM", "graphics": "GTX 1060 / RX 580", "storage": "60 GB", "directx": "Version 12"}, "recommended": {"os": "Windows 11 64-bit", "processor": "Intel i7-9700K / AMD Ryzen 5 5600X", "memory": "16 GB RAM", "graphics": "RTX 3060 / RX 6600 XT", "storage": "60 GB SSD", "directx": "Version 12"}}',
  true,
  true,
  42398,
  7450,
  now() - interval '22 days'
),
(
  'Cyber Heist',
  'cyber-heist',
  'Plan the perfect heist in a neon cyberpunk city.',
  $g$Every vault has a flaw. Cyber Heist gives you the tools to find it: drones, EMPs, hacking rigs, and a crew with very different skills and very messy pasts.

Scout the target, pick your entry point, and execute. Go silent or go loud, the game adapts: alarm levels change patrols, guards, and the final escape route.

The heists are the core, but the city around them is a character too. Bribe, blackmail, or befriend the people who run the underworld.$g$,
  'https://picsum.photos/seed/cover-heist/900/1200',
  'https://picsum.photos/seed/banner-heist/1920/720',
  '2.0.0',
  32212254720,
  '2026-01-20',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://void-games.example.com/cyber-heist',
  '{"10 handcrafted heists", "Stealth or loud gameplay", "Hacking mini-games", "Crew system", "Dynamic alarms"}',
  '1. Extract the archive to your games drive.
2. Run the installer as administrator.
3. Disable your antivirus during installation only.
4. Launch via CyberHeist.exe and sign in to save online.',
  '{"minimum": {"os": "Windows 10 64-bit", "processor": "Intel i5-7500 / AMD Ryzen 3 3300X", "memory": "8 GB RAM", "graphics": "GTX 1050 Ti / RX 570", "storage": "35 GB", "directx": "Version 11"}, "recommended": {"os": "Windows 11 64-bit", "processor": "Intel i5-10400 / AMD Ryzen 5 3600", "memory": "16 GB RAM", "graphics": "RTX 2060 / RX 6600", "storage": "35 GB SSD", "directx": "Version 12"}}',
  false,
  true,
  35610,
  6210,
  now() - interval '15 days'
),
(
  'Rift Raiders',
  'rift-raiders',
  'Co-op dungeon crawling across shattered worlds.',
  $g$The multiverse is collapsing into itself, and only raiders fast enough to steal treasure from dying worlds can save it. Rift Raiders is a co-op action dungeon crawler for up to four players.

Pick a raider, each with unique skills, then dive into procedurally generated rifts. Every run changes the layout, the enemies, and the loot that drops.

Between rifts, upgrade your ship, your gear, and your hub. Death is cheap, but the best loot is never easy to grab.$g$,
  'https://picsum.photos/seed/cover-rift/900/1200',
  'https://picsum.photos/seed/banner-rift/1920/720',
  '1.5.2',
  21474836480,
  '2025-12-10',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerSunsets.mp4',
  'https://void-games.example.com/rift-raiders',
  '{"4-player online co-op", "Procedural rifts", "6 unique raiders", "Ship upgrades", "Endless loot"}',
  '1. Extract the archive.
2. Run the setup as administrator.
3. Launch the game and create a lobby.
4. Host or join a friend''s game to start raiding.',
  '{"minimum": {"os": "Windows 10 64-bit", "processor": "Intel i5-6500 / AMD FX-8350", "memory": "8 GB RAM", "graphics": "GTX 960 / RX 470", "storage": "25 GB", "directx": "Version 11"}, "recommended": {"os": "Windows 11 64-bit", "processor": "Intel i5-10400 / AMD Ryzen 5 3600", "memory": "16 GB RAM", "graphics": "RTX 2060 / RX 5700", "storage": "25 GB SSD", "directx": "Version 12"}}',
  false,
  true,
  28940,
  5410,
  now() - interval '12 days'
),
(
  'Whisper of the Void',
  'whisper-of-the-void',
  'A psychological horror game that hears you.',
  $g$You wake up in an abandoned research station with no memory of how you got there. The station''s AI claims you are the only survivor. It is wrong.

Whisper of the Void uses directional audio and a reactive horror engine: the game watches how you play and changes its scares. Doors you never opened, voices in your headphones, rooms that should not be there.

No combat, no safety. Just you, a flashlight, and the void that whispers back.$g$,
  'https://picsum.photos/seed/cover-whisper/900/1200',
  'https://picsum.photos/seed/banner-whisper/1920/720',
  '1.0.4',
  19327352832,
  '2025-08-21',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerSanDiego.mp4',
  'https://void-games.example.com/whisper-of-the-void',
  '{"Reactive horror engine", "Headphone-optimized audio", "8-10 hour campaign", "Multiple endings", "No jumpscare crutches"}',
  '1. Extract the archive.
2. Run the installer as administrator.
3. Install to a path without special characters.
4. Launch the game with headphones on.',
  '{"minimum": {"os": "Windows 10 64-bit", "processor": "Intel i3-9100 / AMD Ryzen 3 3200G", "memory": "8 GB RAM", "graphics": "GTX 1050 Ti / RX 560", "storage": "20 GB", "directx": "Version 11"}, "recommended": {"os": "Windows 11 64-bit", "processor": "Intel i5-10400 / AMD Ryzen 5 3600", "memory": "16 GB RAM", "graphics": "RTX 2060 / RX 5600 XT", "storage": "20 GB SSD", "directx": "Version 12"}}',
  false,
  false,
  26710,
  4380,
  now() - interval '30 days'
),
(
  'Isle of Embers',
  'isle-of-embers',
  'A story-driven adventure across a volcanic island.',
  $g$Your grandmother left you a lighthouse and a map to an island that does not exist on any chart. Isle of Embers is a hand-painted adventure of puzzles, memory, and fire.

Explore a volcanic island that shifts with the tide, solve environmental puzzles, and piece together the story of the village that vanished a generation ago.

The island is fully explorable without combat or timers. Breathe, look around, and let the mystery pull you deeper.$g$,
  'https://picsum.photos/seed/cover-isle/900/1200',
  'https://picsum.photos/seed/banner-isle/1920/720',
  '1.3.1',
  12884901888,
  '2025-06-30',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://void-games.example.com/isle-of-embers',
  '{"Hand-painted visuals", "Story-driven puzzles", "No combat", "Dynamic tides", "Original soundtrack"}',
  '1. Extract the archive.
2. Run IsleOfEmbers.exe directly, no install needed.
3. If the game complains about runtimes, install the bundled VC++ package.',
  '{"minimum": {"os": "Windows 10 64-bit", "processor": "Intel i3-8100 / AMD Ryzen 3 2200G", "memory": "8 GB RAM", "graphics": "GTX 1050 / RX 560", "storage": "15 GB", "directx": "Version 11"}, "recommended": {"os": "Windows 11 64-bit", "processor": "Intel i5-9400 / AMD Ryzen 5 2600", "memory": "12 GB RAM", "graphics": "GTX 1660 / RX 580", "storage": "15 GB SSD", "directx": "Version 11"}}',
  false,
  false,
  19240,
  3120,
  now() - interval '45 days'
),
(
  'Iron League',
  'iron-league',
  'Competitive football with a hardcore manager sim.',
  $g$Own the club, manage the tactics, and win the league. Iron League combines deep football management with matchday controls that put every pass in your hands.

Build your squad through transfers, youth academies, and a training system that grows players over seasons. Then step onto the pitch and control your team in real time.

Online seasons, draft leagues, and weekly events keep the competition alive all year.$g$,
  'https://picsum.photos/seed/cover-iron/900/1200',
  'https://picsum.photos/seed/banner-iron/1920/720',
  '2026.1.0',
  26843545600,
  '2026-02-05',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://void-games.example.com/iron-league',
  '{"Matchday controls", "Deep manager sim", "Youth academy", "Online seasons", "400+ clubs"}',
  '1. Extract the archive.
2. Run the installer as administrator.
3. Install the required DirectX and .NET runtimes.
4. Launch IronLeague.exe from the install folder.',
  '{"minimum": {"os": "Windows 10 64-bit", "processor": "Intel i5-6500 / AMD FX-8350", "memory": "8 GB RAM", "graphics": "GTX 960 / RX 470", "storage": "30 GB", "directx": "Version 11"}, "recommended": {"os": "Windows 11 64-bit", "processor": "Intel i5-11400 / AMD Ryzen 5 3600", "memory": "16 GB RAM", "graphics": "RTX 2060 / RX 6600", "storage": "30 GB SSD", "directx": "Version 12"}}',
  false,
  false,
  15830,
  2940,
  now() - interval '8 days'
),
(
  'Stellar Frontier',
  'stellar-frontier',
  'Space exploration and colony building at the galaxy''s edge.',
  $g$The frontier is open. Stellar Frontier sends you to a procedurally generated galaxy where every star system hides resources, ruins, and risk.

Build your colony, mine asteroids, research alien tech, and trade with factions across the sector. Expand too fast and the hostile xenoflora will push back; expand too slow and the rival corporations will eat your market.

Multiplayer lets you share colonies, form alliances, and fight for control of contested systems.$g$,
  'https://picsum.photos/seed/cover-stellar/900/1200',
  'https://picsum.photos/seed/banner-stellar/1920/720',
  '0.9.7',
  40802189312,
  '2025-05-12',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
  'https://void-games.example.com/stellar-frontier',
  '{"Procedural galaxy", "Colony building", "Faction diplomacy", "Co-op multiplayer", "Space combat"}',
  '1. Extract the archive.
2. Run StellarFrontier_Setup.exe as administrator.
3. Install the game to your SSD for faster galaxy loading.
4. Launch the game and create your save profile.',
  '{"minimum": {"os": "Windows 10 64-bit", "processor": "Intel i5-8400 / AMD Ryzen 5 2600", "memory": "8 GB RAM", "graphics": "GTX 1060 / RX 580", "storage": "45 GB", "directx": "Version 12"}, "recommended": {"os": "Windows 11 64-bit", "processor": "Intel i7-10700 / AMD Ryzen 7 3700X", "memory": "16 GB RAM", "graphics": "RTX 3060 / RX 6700 XT", "storage": "45 GB SSD", "directx": "Version 12"}}',
  false,
  false,
  22150,
  1870,
  now() - interval '50 days'
);

-- ──────────────────────────────────────────────────────────────────────
-- LINK GENRES
-- ──────────────────────────────────────────────────────────────────────
update public.games g
set genre_id = c.id
from (values
  ('shadow-protocol', 'fps'),
  ('neon-drift', 'racing'),
  ('kingdom-of-ashes', 'rpg'),
  ('frostbound', 'open-world'),
  ('cyber-heist', 'action'),
  ('rift-raiders', 'action'),
  ('whisper-of-the-void', 'horror'),
  ('isle-of-embers', 'adventure'),
  ('iron-league', 'sports'),
  ('stellar-frontier', 'open-world')
) as v(slug, genre_slug)
join public.categories c on c.slug = v.genre_slug
where g.slug = v.slug;

-- ──────────────────────────────────────────────────────────────────────
-- SCREENSHOTS
-- ──────────────────────────────────────────────────────────────────────
insert into public.screenshots (game_id, image_url, position)
select g.id, s.url, s.pos
from (values
  ('shadow-protocol', 'https://picsum.photos/seed/shot-shadow-1/1280/720', 0),
  ('shadow-protocol', 'https://picsum.photos/seed/shot-shadow-2/1280/720', 1),
  ('shadow-protocol', 'https://picsum.photos/seed/shot-shadow-3/1280/720', 2),
  ('shadow-protocol', 'https://picsum.photos/seed/shot-shadow-4/1280/720', 3),
  ('neon-drift', 'https://picsum.photos/seed/shot-neon-1/1280/720', 0),
  ('neon-drift', 'https://picsum.photos/seed/shot-neon-2/1280/720', 1),
  ('neon-drift', 'https://picsum.photos/seed/shot-neon-3/1280/720', 2),
  ('kingdom-of-ashes', 'https://picsum.photos/seed/shot-kingdom-1/1280/720', 0),
  ('kingdom-of-ashes', 'https://picsum.photos/seed/shot-kingdom-2/1280/720', 1),
  ('kingdom-of-ashes', 'https://picsum.photos/seed/shot-kingdom-3/1280/720', 2),
  ('frostbound', 'https://picsum.photos/seed/shot-frost-1/1280/720', 0),
  ('frostbound', 'https://picsum.photos/seed/shot-frost-2/1280/720', 1),
  ('frostbound', 'https://picsum.photos/seed/shot-frost-3/1280/720', 2),
  ('cyber-heist', 'https://picsum.photos/seed/shot-heist-1/1280/720', 0),
  ('cyber-heist', 'https://picsum.photos/seed/shot-heist-2/1280/720', 1),
  ('cyber-heist', 'https://picsum.photos/seed/shot-heist-3/1280/720', 2),
  ('rift-raiders', 'https://picsum.photos/seed/shot-rift-1/1280/720', 0),
  ('rift-raiders', 'https://picsum.photos/seed/shot-rift-2/1280/720', 1),
  ('rift-raiders', 'https://picsum.photos/seed/shot-rift-3/1280/720', 2),
  ('whisper-of-the-void', 'https://picsum.photos/seed/shot-whisper-1/1280/720', 0),
  ('whisper-of-the-void', 'https://picsum.photos/seed/shot-whisper-2/1280/720', 1),
  ('whisper-of-the-void', 'https://picsum.photos/seed/shot-whisper-3/1280/720', 2),
  ('isle-of-embers', 'https://picsum.photos/seed/shot-isle-1/1280/720', 0),
  ('isle-of-embers', 'https://picsum.photos/seed/shot-isle-2/1280/720', 1),
  ('isle-of-embers', 'https://picsum.photos/seed/shot-isle-3/1280/720', 2),
  ('iron-league', 'https://picsum.photos/seed/shot-iron-1/1280/720', 0),
  ('iron-league', 'https://picsum.photos/seed/shot-iron-2/1280/720', 1),
  ('iron-league', 'https://picsum.photos/seed/shot-iron-3/1280/720', 2),
  ('stellar-frontier', 'https://picsum.photos/seed/shot-stellar-1/1280/720', 0),
  ('stellar-frontier', 'https://picsum.photos/seed/shot-stellar-2/1280/720', 1),
  ('stellar-frontier', 'https://picsum.photos/seed/shot-stellar-3/1280/720', 2)
) as s(slug, url, pos)
join public.games g on g.slug = s.slug;

-- ──────────────────────────────────────────────────────────────────────
-- DOWNLOAD LINKS
-- ──────────────────────────────────────────────────────────────────────
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

-- ──────────────────────────────────────────────────────────────────────
-- GAME TAGS
-- ──────────────────────────────────────────────────────────────────────
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

-- ──────────────────────────────────────────────────────────────────────
-- COLLECTION GAMES
-- ──────────────────────────────────────────────────────────────────────
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
