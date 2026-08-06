-- ══════════════════════════════════════════════════════════════════════
-- VOID GAMES - GAMES BACKEND SCHEMA (Phases 3-6 server-side)
-- Run this entire script once in Supabase Dashboard > SQL Editor > Run
-- ══════════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────────────
-- CATEGORIES (doubles as the game genre table)
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  icon text not null default '',
  color text not null default '#2EA8FF',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists categories_slug_idx on public.categories (slug);
create index if not exists categories_sort_order_idx
  on public.categories (sort_order);

-- ──────────────────────────────────────────────────────────────────────
-- COLLECTIONS
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  thumbnail text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists collections_slug_idx on public.collections (slug);

-- ──────────────────────────────────────────────────────────────────────
-- COLLECTION GAMES (many-to-many)
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.collection_games (
  collection_id uuid not null references public.collections (id) on delete cascade,
  game_id uuid not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (collection_id, game_id)
);

create index if not exists collection_games_game_idx
  on public.collection_games (game_id);

-- ──────────────────────────────────────────────────────────────────────
-- GAMES
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null default '',
  description text not null default '',
  cover_image text not null default '',
  banner_image text not null default '',
  version text not null default '',
  size_bytes bigint not null default 0,
  release_date date,
  video_url text not null default '',
  website_url text not null default '',
  features text[] not null default '{}',
  installation_instructions text not null default '',
  system_requirements jsonb not null default '{}'::jsonb,
  genre_id uuid references public.categories (id) on delete set null,
  is_featured boolean not null default false,
  is_trending boolean not null default false,
  is_active boolean not null default true,
  views bigint not null default 0,
  downloads bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists games_slug_idx on public.games (slug);
create index if not exists games_genre_idx on public.games (genre_id);
create index if not exists games_created_at_idx on public.games (created_at desc);
create index if not exists games_downloads_idx on public.games (downloads desc);
create index if not exists games_views_idx on public.games (views desc);

-- ──────────────────────────────────────────────────────────────────────
-- GAME TAGS
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.game_tags (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games (id) on delete cascade,
  tag_name text not null,
  created_at timestamptz not null default now(),
  unique (game_id, tag_name)
);

-- ──────────────────────────────────────────────────────────────────────
-- SCREENSHOTS
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.screenshots (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games (id) on delete cascade,
  image_url text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists screenshots_game_idx
  on public.screenshots (game_id, position);

-- ──────────────────────────────────────────────────────────────────────
-- DOWNLOAD LINKS (mirrors)
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.download_links (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games (id) on delete cascade,
  provider text not null default 'Terabox',
  mirror_name text not null default '',
  download_url text not null,
  file_size bigint not null default 0,
  password text not null default '',
  is_active boolean not null default true,
  clicks bigint not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists download_links_game_idx
  on public.download_links (game_id, sort_order);

-- ──────────────────────────────────────────────────────────────────────
-- RATINGS (one per user per game)
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.ratings (
  game_id uuid not null references public.games (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  primary key (game_id, user_id)
);

-- ──────────────────────────────────────────────────────────────────────
-- COMMENTS
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  parent_id uuid references public.comments (id) on delete cascade,
  content text not null,
  status text not null default 'approved',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists comments_game_idx
  on public.comments (game_id, created_at desc);

-- ──────────────────────────────────────────────────────────────────────
-- LINK GUIDES / FIXES TO GAMES (completes the Phase 8 comments)
-- ──────────────────────────────────────────────────────────────────────
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'guides_game_id_fkey'
  ) then
    alter table public.guides
      add constraint guides_game_id_fkey
      foreign key (game_id) references public.games (id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'fix_articles_game_id_fkey'
  ) then
    alter table public.fix_articles
      add constraint fix_articles_game_id_fkey
      foreign key (game_id) references public.games (id) on delete set null;
  end if;
end $$;

-- ──────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- Content is public-read; writes via the service role key (admin panel)
-- Ratings/comments allow authenticated users to write their own rows.
-- ──────────────────────────────────────────────────────────────────────
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.collection_games enable row level security;
alter table public.games enable row level security;
alter table public.game_tags enable row level security;
alter table public.screenshots enable row level security;
alter table public.download_links enable row level security;
alter table public.ratings enable row level security;
alter table public.comments enable row level security;

drop policy if exists "categories_read_public" on public.categories;
create policy "categories_read_public" on public.categories
  for select using (true);

drop policy if exists "collections_read_public" on public.collections;
create policy "collections_read_public" on public.collections
  for select using (true);

drop policy if exists "collection_games_read_public" on public.collection_games;
create policy "collection_games_read_public" on public.collection_games
  for select using (true);

drop policy if exists "games_read_public" on public.games;
create policy "games_read_public" on public.games
  for select using (true);

drop policy if exists "game_tags_read_public" on public.game_tags;
create policy "game_tags_read_public" on public.game_tags
  for select using (true);

drop policy if exists "screenshots_read_public" on public.screenshots;
create policy "screenshots_read_public" on public.screenshots
  for select using (true);

drop policy if exists "download_links_read_public" on public.download_links;
create policy "download_links_read_public" on public.download_links
  for select using (true);

drop policy if exists "ratings_read_public" on public.ratings;
create policy "ratings_read_public" on public.ratings
  for select using (true);

drop policy if exists "ratings_write_own" on public.ratings;
create policy "ratings_write_own" on public.ratings
  for insert with check (auth.uid() = user_id);

drop policy if exists "ratings_update_own" on public.ratings;
create policy "ratings_update_own" on public.ratings
  for update using (auth.uid() = user_id);

drop policy if exists "ratings_delete_own" on public.ratings;
create policy "ratings_delete_own" on public.ratings
  for delete using (auth.uid() = user_id);

drop policy if exists "comments_read_public" on public.comments;
create policy "comments_read_public" on public.comments
  for select using (true);

drop policy if exists "comments_write_own" on public.comments;
create policy "comments_write_own" on public.comments
  for insert with check (auth.uid() = user_id and status = 'approved');

drop policy if exists "comments_update_own" on public.comments;
create policy "comments_update_own" on public.comments
  for update using (auth.uid() = user_id);

drop policy if exists "comments_delete_own" on public.comments;
create policy "comments_delete_own" on public.comments
  for delete using (auth.uid() = user_id);
