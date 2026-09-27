-- 0003_storage.sql
-- News image bucket: public reads, admin-only uploads/deletes, image MIME
-- allowlist and a 5 MB size limit. Posts store references (URLs), never binaries.

insert into storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
values (
  'news-images',
  'news-images',
  true,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  5242880
)
on conflict (id) do nothing;

-- Public read: published images are reachable by their URL.
create policy "News images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'news-images');

-- Admin-only writes.
create policy "Admins can upload news images"
  on storage.objects for insert
  with check (bucket_id = 'news-images' and public.is_admin());

create policy "Admins can update news images"
  on storage.objects for update
  using (bucket_id = 'news-images' and public.is_admin());

create policy "Admins can delete news images"
  on storage.objects for delete
  using (bucket_id = 'news-images' and public.is_admin());
