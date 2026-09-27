# Admin setup — Supabase (news, auth, storage)

How to reproduce a clean database with the news posts, admin allowlist, row-level
security and image storage, and how to verify the security boundary.

## 1. Create a Supabase project

1. Create a project at <https://supabase.com> (free tier is fine).
2. Note the project URL and the **anon** public key (Project Settings → API).
   Never use the `service_role` key in the browser.

## 2. Run the migrations

Migrations live in `supabase/migrations/` and run in order:

| File | What it creates |
| --- | --- |
| `0001_posts.sql` | `posts` table + indexes |
| `0002_admins_and_rls.sql` | `admins` allowlist + `is_admin()` + RLS on `posts` |
| `0003_storage.sql` | `news-images` bucket + storage policies |

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

Run these against the database (SQL editor or `supabase db`), or via the API with
the anon key. They must behave exactly as described.

```sql
-- Anonymous read of published posts succeeds:
select * from posts where published = true;   -- returns rows

-- Anonymous read of unpublished posts must be empty:
select * from posts where published = false;  -- 0 rows

-- Anonymous write must fail (RLS blocks insert):
insert into posts (title, published_at, published) values ('x', now(), true);
-- → error: new row violates row-level security policy
```

For an authenticated non-admin and an allowlisted admin, use two test sessions
(one signed in as a normal user, one whose `auth.uid()` is in `admins`):

- Non-admin `insert/update/delete` on `posts` → fails.
- Admin `insert/update/delete` → succeeds.
- Non-admin upload to `news-images` bucket → rejected.
- Admin upload → succeeds and the object is publicly readable by URL.

These checks exercise the RLS/storage policies directly — the UI hiding buttons is
not the security boundary.
