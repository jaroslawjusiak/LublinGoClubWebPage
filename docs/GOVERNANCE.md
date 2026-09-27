# Governance & continuity

The site must survive the departure of any single volunteer. This file records who owns each
system and each piece of content, and how access is handed over.

> **Fill in every `[name]` before launch.** No launch-critical cell may stay empty.

## Access inventory — two named holders per system

| System | Primary | Secondary | Notes |
| --- | --- | --- | --- |
| Domain registrar / DNS (`lubelski-klub-go.pl`) | [name] | [name] | registrar account |
| Hosting (Vercel) | [name] | [name] | Vercel team |
| GitHub repository | [name] | [name] | repo admin |
| Supabase (database / auth / storage) | [name] | [name] | Supabase org |
| Club email | [name] | [name] | mailbox / provider |
| Admin panel (Google accounts in `admins`) | [name] | [name] | see `docs/ADMIN_SETUP.md` §5 |

## Succession — how to hand over each system

- **Domain / DNS** — log in to the registrar and add the successor as an account admin.
- **Vercel** — invite the successor to the team (Project → Settings → Members).
- **GitHub** — add the successor as a repository collaborator/owner.
- **Supabase** — invite the successor to the organization (Settings → Team).
- **Club email** — delegate the mailbox or share credentials securely.
- **Admin panel** — add the successor's `auth.uid()` to the `admins` table (see
  `docs/ADMIN_SETUP.md` §5); remove them when no longer needed.

## Content ownership — one named maintainer per piece

| Content | Maintainer |
| --- | --- |
| Meeting time / location (`src/data/club.ts`) | [name] |
| News posts | any admin |
| Club story / About page | [name] |
| Contact information / social links | [name] |
| Go rules (`/zacznij`) | [name] |
| EN translation (reviewer) | [name] |
| UK translation (reviewer) | [name] |
| Photos in posts | whoever publishes (bound by the photo-consent policy) |
