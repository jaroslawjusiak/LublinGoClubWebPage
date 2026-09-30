-- 0004_news_images_jsonb.sql
-- Replace the plain `image_urls text[]` column with `images jsonb`, so each post
-- image can carry its own alternative text (`{url, alt}`). The seed posts have no
-- real photos yet (empty arrays), so there is nothing meaningful to convert — the
-- update below just maps any pre-existing URLs to `{url, alt: ''}` defensively.

alter table public.posts add column if not exists images jsonb not null default '[]'::jsonb;

update public.posts
set images = coalesce(
  (
    select jsonb_agg(jsonb_build_object('url', url, 'alt', ''))
    from unnest(image_urls) as url
  ),
  '[]'::jsonb
)
where image_urls is not null and cardinality(image_urls) > 0;

alter table public.posts drop column if exists image_urls;
