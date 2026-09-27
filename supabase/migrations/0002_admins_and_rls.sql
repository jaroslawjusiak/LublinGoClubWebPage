-- 0002_admins_and_rls.sql
-- Admin allowlist + row-level security on posts.
-- Security boundary: RLS (not the UI). Anonymous users may read only published
-- posts; only allowlisted admins may insert/update/delete.

-- Allowlisted administrators, linked to Supabase auth identities.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- The allowlist is managed only via the service role (or SQL editor), never by
-- the public API. No RLS policies => anonymous/authenticated cannot read or
-- write this table directly.
alter table public.admins enable row level security;

-- Helper: is the current user an admin?
-- `security definer` lets the function read `admins` even with RLS on; an empty
-- `search_path` forces fully-qualified references to prevent spoofing.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Posts: row-level security.
alter table public.posts enable row level security;

-- Public read: published posts only.
create policy "Published posts are publicly readable"
  on public.posts for select
  using (published = true);

-- Admin read: all posts (including unpublished drafts).
create policy "Admins can read all posts"
  on public.posts for select
  using (public.is_admin());

-- Admin write.
create policy "Admins can insert posts"
  on public.posts for insert
  with check (public.is_admin());

create policy "Admins can update posts"
  on public.posts for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete posts"
  on public.posts for delete
  using (public.is_admin());
