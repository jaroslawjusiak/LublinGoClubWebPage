# Admin setup — Supabase (news, auth, storage)

How to reproduce a clean database with the news posts, admin allowlist, row-level
security and image storage, and how to verify the security boundary.

## 1. Create a Supabase project

1. Create a project at <https://supabase.com> (free tier is fine).
2. Note the project URL and the **anon** public key (Project Settings → API).
   Never use the `service_role` key in the browser.

## 2. Run the migrations

Migrations live in `supabase/migrations/` and run in order:

| File                         | What it creates                                                       |
| ---------------------------- | --------------------------------------------------------------------- |
| `0001_posts.sql`             | `posts` table + indexes                                               |
| `0002_admins_and_rls.sql`    | `admins` allowlist + `is_admin()` + RLS on `posts`                    |
| `0003_storage.sql`           | `news-images` bucket + storage policies                               |
| `0004_news_images_jsonb.sql` | `posts.images` jsonb — per-image `{url, alt}` (replaces `image_urls`) |

Run them with the Supabase CLI, or paste each file into the SQL editor in order:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

## 3. Seed the historical posts (optional)

```bash
psql <connection-string> -f supabase/seed/seed_posts.sql
```

Or paste `supabase/seed/seed_posts.sql` into the SQL editor.

## 4. Add the local environment

Copy `.env.example` to `.env` and fill the public credentials:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

## 5. Add administrators

The `admins` table is the allowlist. It is managed **only** via the SQL editor or
service role (never the public API). To add an admin, first have them sign in
once with Google (see §6), then run:

```sql
insert into public.admins (user_id)
values ('<their auth user id>')
on conflict (user_id) do nothing;
```

Find their user id under Authentication → Users in the dashboard, or via
`select id from auth.users where email = '<their email>';`.

## 6. Configure Google sign-in (M5)

Authentication → Providers → Google → enable, and add the redirect URLs for
`http://localhost:5173`, the Vercel preview URL and the production domain. No
public registration flow is needed; only the allowlisted accounts may publish.

## 7. Verify the security boundary

RLS is the boundary, so verify it with the roles the app actually uses — **not** as the
SQL-editor `postgres` user, which bypasses row-level security and would make every check
look open. Two equivalent, reproducible approaches:

### A. Role impersonation in the SQL editor

Use `set local role` + `set local request.jwt.claims` so each statement runs as the real
role. `auth.uid()` (used by `is_admin()`) reads the `sub` claim you set. Replace the
placeholder uids with real ones: a normal user, and a user whose `id` is in `public.admins`.

```sql
-- 1) ANONYMOUS — what the public feed uses
set local role anon;
set local request.jwt.claims = '{}';
select count(*) from posts where published = true;   -- > 0 (published visible)
select count(*) from posts where published = false;  -- 0 (drafts hidden)
insert into posts (title, published_at, published) values ('x', now(), true);
-- → ERROR: new row violates row-level security policy
reset role;

-- 2) AUTHENTICATED, but NOT allowlisted
set local role authenticated;
set local request.jwt.claims = '{"sub":"<non-admin-auth-uid>"}';
insert into posts (title, published_at, published) values ('x', now(), true);
-- → ERROR (not an admin)
reset role;

-- 3) AUTHENTICATED, allowlisted admin
set local role authenticated;
set local request.jwt.claims = '{"sub":"<admin-auth-uid>"}';
insert into posts (title, published_at, published) values ('x', now(), true); -- succeeds
update posts set title = 'y' where id = '<inserted-id>';                       -- succeeds
delete from posts where id = '<inserted-id>';                                   -- succeeds
reset role;
```

Storage policies are checked the same way: as `anon`, an `insert`/`delete` on
`storage.objects` for `bucket_id = 'news-images'` is rejected; as an admin
`authenticated` role it succeeds.

### B. Real API sessions (most representative)

Use the anon key for anonymous reads and real JWTs for authenticated users:

- **Anonymous** — query published posts through the PostgREST endpoint with the anon key.
- **Non-admin** — sign in as a normal user, use their access token to `insert` on `posts`
  → `42501` (row-level security) is returned.
- **Admin** — sign in as an allowlisted user; `insert`/`update`/`delete` on `posts` and
  uploads to `news-images` succeed, and the uploaded object is publicly readable by URL.

These checks exercise the RLS/storage policies directly — hiding buttons in the UI is
not the security boundary.
