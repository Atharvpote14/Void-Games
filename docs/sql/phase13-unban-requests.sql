-- ══════════════════════════════════════════════════════════════════════
-- VOID GAMES - PHASE 13 UNBAN REQUESTS SCHEMA
-- Run this once in Supabase Dashboard > SQL Editor > Run
-- Adds the unban_requests table used by banned users to appeal.
-- Idempotent: safe to run multiple times.
-- ══════════════════════════════════════════════════════════════════════

create table if not exists public.unban_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null default '',
  email text not null default '',
  avatar text,
  ban_reason text not null default '',
  explanation text not null default '',
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  admin_note text not null default '',
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- One pending request per user (new requests replace the review of old ones)
create unique index if not exists unban_requests_one_pending_per_user
  on public.unban_requests (user_id) where status = 'pending';

create index if not exists unban_requests_status_idx
  on public.unban_requests (status, created_at desc);
