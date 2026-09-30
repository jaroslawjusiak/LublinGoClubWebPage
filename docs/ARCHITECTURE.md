# Lubelski Klub Go — Architecture Report

**Last updated:** 2026-09-30
**Scope:** Tier A launch (see `docs/WEBSITE_REBUILD_PLAN.md` and `docs/ULTIMATE_IMPLEMENTATION_PLAN.md`)

## 1. Where the application lives

The application lives at the **repository root** — `src/`, `public/`, `index.html`,
`vite.config.ts`, `tailwind.config.js`, etc. There is **no `web/` subdirectory** (a
stale `web/AGENTS.md` was removed). The plan's `web/` layout was superseded by a
root-level application.

## 2. Stack (locked decisions)

| Concern                  | Decision                                                                                                                                                  |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend                 | React 18 + TypeScript 5.9 + Vite 8                                                                                                                        |
| Routing                  | `react-router-dom` 7 (Polish routes at the root, `/en/...` and `/uk/...` prefixed)                                                                        |
| Styling                  | Tailwind CSS 3 + a small token layer (`paper`, `ink`, `muted-text`, `border`, `kaya`) + a semantic typography scale                                       |
| Public data              | Typed files in `src/data/` — the single source of truth for club facts                                                                                    |
| News DB / Auth / Storage | Supabase (Postgres + RLS + Storage) — migrations, RLS and the admin workflow are implemented; a live project is configured in the developer's environment |
| Map                      | OpenStreetMap link (no API key), localized via a `locale` query param                                                                                     |
| i18n                     | `i18next` + `react-i18next`, Polish default/fallback, EN/UK skeletons (unreviewed)                                                                        |
| Tests                    | Vitest + Testing Library                                                                                                                                  |
| Formatting               | ESLint (flat config) + Prettier                                                                                                                           |

## 3. Directory map

```text
LublinGoClubWebPage/
├─ docs/                     # Plans, status, QA notes, governance/runbook
├─ public/                   # Served static assets: hero board, rules diagrams, flags,
│                            #   favicon, robots.txt, sitemap.xml
├─ reference/legacy-site/    # Read-only copy of the old live site (NOT served)
├─ supabase/
│  ├─ migrations/            # 0001 posts, 0002 admins+RLS, 0003 storage, 0004 images jsonb
│  └─ seed/seed_posts.sql    # Historical posts (idempotent)
├─ src/
│  ├─ components/            # primitives.tsx + shared features (MeetingSection, NewsFeed,
│  │                         #   NewsPostCard, Header/Footer/MobileMenu/MobileCta, LanguageSwitcher,
│  │                         #   RulesSection, PageMeta) + admin/ (PostList, PostForm, ImagePicker)
│  ├─ data/                  # club.ts, site.ts, people.ts — single source of truth
│  ├─ i18n/                  # config.ts, locale.ts + locales/{pl,en,uk}/translation.json
│  ├─ lib/                   # news/repository.ts, news/seed.ts, news/image.ts,
│  │                         #   supabase/{client,auth,storage}.ts (data boundaries)
│  ├─ pages/                 # Home, Zacznij, OKlubie, Aktualnosci, Kontakt, Privacy,
│  │                         #   NotFound, Admin
│  ├─ styles/                # global.css
│  └─ types/                 # data_models.ts (MeetingInfo, ClubConfig, NewsPost, NewsImage, …)
├─ index.html
├─ vite.config.ts / vitest.config.ts / tailwind.config.js / postcss.config.js
├─ eslint.config.js / .prettierrc.json / vercel.json
```

## 4. Implemented (Tier A)

- **Five public pages** (`/`, `/zacznij`, `/o-klubie`, `/aktualnosci`, `/kontakt`) plus
  `/prywatnosc` and a deliberate 404 page, with locale-prefixed `/en/...` and `/uk/...` routes.
- **Single source of truth** in `src/data/` (`club.ts`, `site.ts`, `people.ts`); meeting facts
  are rendered by a shared `MeetingSection` used on Home, Contact and Start Here.
- **News domain**: one typed `NewsPost`/`NewsImage` model, one validated repository mapping, and
  one shared `NewsFeed` for the Home preview and `/aktualnosci` (distinguishes "unconfigured"
  from an empty feed). Per-image `alt` is modeled, persisted (`images` jsonb) and editable.
- **Supabase persistence/security**: `posts` + `admins` tables, RLS (public read of published
  only, admin-only writes), the `news-images` storage bucket, and a Supabase repository/client.
- **Protected mobile admin**: Google OAuth, an `admins` allowlist, and a create/edit/delete flow
  with draft-vs-publish, phone photo compression and orphan cleanup.
- **i18n**: consolidated into `src/i18n/` (`pl` default/fallback + `en`/`uk`), URL-driven
  language + `<html lang>` sync, a flag-based `LanguageSwitcher`, and a key-parity test.
- **Accessibility & SEO**: semantic landmarks/headings, keyboard/focus handling, reduced motion,
  per-route `PageMeta` (title/description/canonical/OpenGraph), `sitemap.xml`, `robots.txt`, and
  legacy redirects in `vercel.json`.
- **Governance/runbook**: `docs/GOVERNANCE.md`, `docs/ADMIN_SETUP.md`, `docs/RUNBOOK.md`, and
  QA checklists (`qa-public-pages`, `qa-news`, `qa-admin`, `qa-accessibility`, `qa-launch`).

## 5. Pending (human / club actions)

The code is complete for Tier A; the remaining work needs a named club representative or a live
environment, never invented facts:

- **Content approval** (`docs/CONTENT_APPROVAL.md`): confirm facts, photo consent, club email,
  story, and which Google accounts may administer posts.
- **Supabase production**: create the project, apply migrations (including `0004_news_images_jsonb.sql`),
  add admins, and verify the RLS boundary (`docs/ADMIN_SETUP.md` §7).
- **Vercel deployment**: create the project, set env vars, deploy a preview, run `docs/qa-launch.md`.
- **Human QA runs**: execute the `qa-*` checklists on a real device/browser.
- **EN/UK translation review** by named reviewers before treating them as final copy.

See `docs/IMPLEMENTATION_STATUS.md` for the detailed per-task snapshot.

## 6. Conventions

- Club facts (schedule, venue, links, contacts) live in `src/data/`; components never hardcode them.
- User-facing strings use i18n keys; Polish source strings live in the `pl` resource.
- Supabase RLS is the security boundary — never a client-only check.
- Only `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` may reach the browser; never the service-role key.
- `npm run check` (lint → format:check → typecheck → test → build) must pass before work is "done".
