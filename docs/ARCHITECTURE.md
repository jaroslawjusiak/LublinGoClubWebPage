# Lubelski Klub Go — Architecture Report

**Last updated:** 2026-09-27
**Scope:** Tier A launch (see `docs/WEBSITE_REBUILD_PLAN.md` and `docs/ULTIMATE_IMPLEMENTATION_PLAN.md`)

## 1. Where the application lives

The application lives at the **repository root** — `src/`, `public/`, `index.html`,
`vite.config.ts`, `tailwind.config.js`, etc. There is **no `web/` subdirectory** (a
stale `web/AGENTS.md` was removed). The plan's `web/` layout was superseded by a
root-level application.

## 2. Stack (locked decisions)

| Concern                  | Decision                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------- |
| Frontend                 | React 18 + TypeScript 5.9 + Vite 8                                                    |
| Routing                  | `react-router-dom` 7 (Polish routes at the root, no `/pl` prefix)                     |
| Styling                  | Tailwind CSS 3 + a small token layer (`paper`, `ink`, `muted-text`, `border`, `kaya`) |
| Public data              | Typed files in `src/data/` — the single source of truth for club facts                |
| News DB / Auth / Storage | Supabase (Postgres + RLS + Storage) — **client wired, project not yet configured**    |
| Map                      | OpenStreetMap link (no API key), localized via a `locale` query param                 |
| i18n                     | `i18next` + `react-i18next`, Polish default/fallback                                  |
| Tests                    | Vitest + Testing Library                                                              |
| Formatting               | ESLint (flat config)                                                                  |

## 3. Directory map

```text
LublinGoClubWebPage/
├─ docs/                     # Plans, status, QA notes
├─ public/                   # Served static assets (hero board image)
│  └─ assets/
├─ reference/legacy-site/    # Read-only copy of the old live site (NOT served)
├─ src/
│  ├─ components/            # Shared primitives + shared features (MeetingSection, NewsFeed, …)
│  ├─ data/                  # club.ts, site.ts, people.ts — single source of truth
│  ├─ i18n/                  # config.ts + locales/{pl,en}/translation.json
│  ├─ lib/                   # supabase/client.ts, news/repository.ts (data boundaries)
│  ├─ pages/                 # Route-level page components
│  ├─ styles/                # global.css
│  └─ types/                 # data_models.ts (MeetingInfo, ClubConfig, NewsPost, …)
├─ index.html
├─ vite.config.ts / vitest.config.ts / tailwind.config.js / postcss.config.js
└─ eslint.config.js
```

## 4. Implemented (Tier A public site — R1–R4)

- Five public pages (`/`, `/zacznij`, `/o-klubie`, `/aktualnosci`, `/kontakt`) + a
  deliberate 404 page.
- Single source of truth in `src/data/` (`club.ts`, `site.ts`, `people.ts`); meeting
  facts are rendered by a shared `MeetingSection` used on Home, Contact and Start Here.
- News domain: one typed `NewsPost` model, one validated repository mapping, and one
  shared `NewsFeed` used by both the Home preview and `/aktualnosci` (distinguishes
  "unconfigured" from an empty feed).
- Mobile navigation (mounted in the header), i18n consolidation into `src/i18n/`, and
  `<html lang>` synchronization.

## 5. Not yet implemented

- Supabase migrations, RLS, storage policies and the protected admin publishing
  workflow (Milestones 4–5).
- Static Go rules migration (N1) and approved real content / photo consent (N2).
- SEO/sitemap/robots/redirects (M6), governance and launch (M7).

See `docs/IMPLEMENTATION_STATUS.md` for the detailed per-task snapshot.

## 6. Conventions

- Club facts (schedule, venue, links, contacts) live in `src/data/`; components never
  hardcode them.
- User-facing strings use i18n keys; Polish source strings live in the `pl` resource.
- Supabase RLS is the security boundary — never a client-only check.
- `npm run check` (lint → typecheck → test → build) must pass before work is "done".
