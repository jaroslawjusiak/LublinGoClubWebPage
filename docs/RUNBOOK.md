# Runbook

Day-to-day operations for the club site. Content changes need **no code deployment**; only
edits to `src/` require a deploy.

## Publish a post (from a phone, < 2 minutes)

1. Open `/admin`.
2. Sign in with Google (an allowlisted account — see `docs/ADMIN_SETUP.md` §5).
3. Tap **Nowy wpis**.
4. Fill **Tytuł** and **Treść**, the date (defaults to today), an optional tag and link.
5. Add up to 4 photos (they are validated, compressed and uploaded automatically).
6. Tap **Zapisz**. The post is published immediately.

## Edit or delete a post

1. `/admin` → tap **Edytuj** on the post.
2. Change the fields/photos, then **Zapisz**.
3. To remove, tap **Usuń** and confirm — the post and its stored photos are removed.

## Change meeting information (single source of truth)

Edit `src/data/club.ts` (`meetingInfo`). The change appears everywhere — Home, Contact and
Start Here — after the next deploy. Do not edit it in the page components.

## Update social links / club email

Edit `socialLinks` and `clubConfig.email` in `src/data/club.ts`.

## Local development

```bash
npm install
npm run dev          # dev server
npm run check        # lint → typecheck → test → build (run before every change)
```

## Deploy

- Push to `main` — Vercel builds and deploys automatically.
- Open a pull request to get a preview URL first.
- `vercel.json` handles the SPA fallback and the legacy redirects.

## Environment variables

Vercel → Project → Settings → Environment Variables (Production **and** Preview):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Only `VITE_`-prefixed values reach the browser. Never commit the Supabase `service_role` key.

## Rollback

- **Code** — revert the merge/push in GitHub; Vercel redeploys the previous commit.
- **Content (a post)** — re-edit it in `/admin`, or delete it.
- **Database** — restore from Supabase → Database → Backups (if scheduled backups are enabled).
- **Ownership contacts** — see `docs/GOVERNANCE.md`.
