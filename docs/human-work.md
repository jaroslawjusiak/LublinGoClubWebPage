Remaining is human/club work (not agent work)

1. Fill names into docs/GOVERNANCE.md + docs/CONTENT_APPROVAL.md.
2. Create the Supabase project → run supabase/migrations → add admins → smoke-test the publish flow (docs/ADMIN_SETUP.md).
3. Create the Vercel project → set env vars → deploy a preview → run docs/qa-launch.md.
4. Production launch + smoke test.

## Pending Supabase action (from the alt-text work)

The news-post images now carry per-image alt text. This required a schema change shipped as a new
migration (`supabase/migrations/0004_news_images_jsonb.sql`): the `posts` table's `image_urls text[]`
column is replaced by `images jsonb` (an array of `{url, alt}` objects).

**Action needed:** apply `0004_news_images_jsonb.sql` to the Supabase project **before** deploying
the code that writes the new column (otherwise the admin form will fail when saving a post):

```bash
supabase link --project-ref <project-ref>
supabase db push
```

Or paste the file into the Supabase **SQL Editor**. There is no real photo data to convert yet, so
this is a low-risk one-time step. It is already listed in `docs/ADMIN_SETUP.md` §2.
