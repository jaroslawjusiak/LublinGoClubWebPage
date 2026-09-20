---
name: supabase-data-and-auth
description: Use when implementing Supabase Postgres tables, RLS policies, Storage buckets, the Supabase client, Google OAuth, or repository mappings in this React project — enforces admin-only writes and published-only public reads.
---

# Supabase Data, Auth & Storage

## When to use

Milestone 4 and 5 work: migrations, RLS, storage policies, the Supabase client, repository implementations, auth context and the admin gate.

## Security model (never bypass)

- **RLS is the boundary**, not the UI. Anonymous users may read **only published posts**; only allowlisted `admins` may insert/update/delete.
- Never trust a client-provided admin flag. Admin membership is verified in Postgres via the `admins` table linked to Supabase identities.
- Never expose the service-role key to the browser. Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` may be in the client bundle.
- Never write production content to JSON files or a deployed filesystem.

## Schema (Tier A minimum)

- `posts`: UUID, title, body, tag (constrained), image references, published date, optional external URL, `published` flag, timestamps. Indexes on published date and published status.
- `admins`: linked to Supabase identities.
- Storage bucket for news images with an image MIME allowlist and size limit; public reads only where intended, uploads/deletes only for allowlisted admins. Store references in `posts`, never binaries.

## Client & repository rules

- Fail clearly at startup when required env vars are missing; add them to `.env.example`.
- Map database rows into the `NewsPost` type at the repository boundary (`src/lib/news/repository.ts`). Components never see raw rows.
- Public feed reads published posts newest-first; expose `listPublished` and optional `getById`.
- Handle partial upload failures so a broken post is never published. Clean up or mark orphaned storage files.
- Auth context exposes session, user, sign-in, sign-out. Show login to anonymous, denial to authenticated non-admins, panel to admins — UX only.

## Verification (must be demonstrated)

1. Anonymous insert/update/delete fails.
2. Authenticated non-admin mutation fails.
3. Allowlisted admin mutation succeeds.
4. Unauthorized storage upload is rejected; authorized upload reads back publicly.
