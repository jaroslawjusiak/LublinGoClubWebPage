-- 0001_posts.sql
-- News posts table. Columns mirror `src/lib/news/repository.ts` `PostRow` exactly,
-- so the repository mapping never needs to guess or alias columns.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  tag text check (tag in ('spotkanie', 'turniej', 'wydarzenie')),
  image_urls text[],
  external_url text,
  published_at timestamptz not null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The public feed reads newest-first published posts.
create index if not exists posts_published_at_idx on public.posts (published_at desc);
create index if not exists posts_published_idx on public.posts (published);
