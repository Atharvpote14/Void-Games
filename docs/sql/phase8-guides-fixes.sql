-- ══════════════════════════════════════════════════════════════════════
-- VOID GAMES - PHASE 8 GUIDES & FIX CENTER SCHEMA
-- Run this entire script once in Supabase Dashboard > SQL Editor > Run
-- ══════════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────────────
-- 11. GUIDES
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  thumbnail text not null default '',
  content text not null default '',
  author text not null default 'Void Games Team',
  game_id uuid,
  game_title text not null default '',
  game_slug text not null default '',
  category text not null default '',
  is_featured boolean not null default false,
  views bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- When the games table is created (Phase 9):
--   alter table public.guides
--     add constraint guides_game_id_fkey
--     foreign key (game_id) references public.games (id) on delete set null;

create index if not exists guides_slug_idx on public.guides (slug);
create index if not exists guides_category_idx on public.guides (category);
create index if not exists guides_created_at_idx on public.guides (created_at desc);

-- ──────────────────────────────────────────────────────────────────────
-- 12. FIX ARTICLES
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.fix_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  thumbnail text not null default '',
  game_id uuid,
  game_title text not null default '',
  game_slug text not null default '',
  category text not null default '',
  problem text not null default '',
  symptoms text not null default '',
  solution text not null default '',
  views bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- alter table public.fix_articles
--   add constraint fix_articles_game_id_fkey
--   foreign key (game_id) references public.games (id) on delete set null;

create index if not exists fix_articles_slug_idx on public.fix_articles (slug);
create index if not exists fix_articles_category_idx on public.fix_articles (category);
create index if not exists fix_articles_created_at_idx
  on public.fix_articles (created_at desc);

-- ──────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- Content is public-read; writes happen via the service role key
-- (admin panel, Phase 9).
-- ──────────────────────────────────────────────────────────────────────
alter table public.guides enable row level security;
alter table public.fix_articles enable row level security;

drop policy if exists "guides_read_public" on public.guides;
create policy "guides_read_public" on public.guides
  for select using (true);

drop policy if exists "fix_articles_read_public" on public.fix_articles;
create policy "fix_articles_read_public" on public.fix_articles
  for select using (true);
