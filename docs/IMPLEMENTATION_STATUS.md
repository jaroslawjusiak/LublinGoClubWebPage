# Lubelski Klub Go - Implementation Status Checklist

**Created:** 2026-09-20 · **Last updated:** 2026-09-27 (after R1–R5)
**Purpose:** Single, honest snapshot of what is done vs. missing, measured against
`docs/ULTIMATE_IMPLEMENTATION_PLAN.md` and the actual code in this repository.

**How to read the status markers**

- `[x]` Done - matches the plan's "Done when" for that task.
- `[~]` Partial - some of the task exists, but one or more acceptance criteria are unmet.
- `[ ]` Not started - no meaningful implementation.

**This file is a status snapshot, not a task.** Update it after each milestone gate.

**Gate command for every task:** `npm run check` (lint -> typecheck -> test -> build).

---

## Repository snapshot (verified 2026-09-27)

- Build gate: **green** - lint clean, `tsc --noEmit` clean, **41/41 tests pass**, `vite build` succeeds.
- Application location: **repository root** (`src/`, `public/`), not `web/`.
- Package manager: npm. Stack: React 18 + TypeScript 5.9 + Vite 8, Tailwind 3, react-router-dom 7, i18next.
- `public/assets/` (hero board image) and `reference/legacy-site/` (old site) now exist.
- Root `AGENTS.md` and a setup `README.md` now exist.
- Missing for later tasks: `supabase/`, `vercel.json`, Prettier, a real favicon.

---

## Milestone 0 - Baseline and tooling

- [x] **M0-T1 Inspect the repository** - `docs/ARCHITECTURE.md` corrected to describe the
      root-level app (no more `web/` / non-existent `reference/` claims).
- [x] **M0-T2 Scaffold/normalize the React app** - dev server and production build work.
- [~] **M0-T3 Quality tooling** - `check`/`lint`/`typecheck`/`test`/`build` all work (41 tests).
      **Missing: Prettier** (the plan's locked stack is "ESLint + Prettier").
- [x] **M0-T4 Project instructions for LLM sessions** - root `AGENTS.md` + setup `README.md`.
- [x] **M0-T5 Vendor the legacy site** - `reference/legacy-site/` holds the old HTML, CSS, logo,
      poster, rules diagrams and event photos, plus a provenance/consent note.

## Milestone 1 - Content, configuration, design foundation

- [~] **M1-T1 Define domain types** - `MeetingInfo`, `ClubConfig`, `SocialLinks`, `NavItem`,
      `Person`, `NewsPost`, `PostTag`, `Locale` all defined. **`NewsImage` is not modeled** — post
      images are `string[]` URLs (no per-image alt); a decision on per-photo alt/captions is deferred.
- [x] **M1-T2 Single source of truth** - `club.ts` + `site.ts` + `people.ts`; placeholder phone/email
      removed; a test rejects personal phone/Gmail as the primary channel.
- [~] **M1-T3 Design tokens** - tokens + `global.css` exist. **Missing:** explicit typography scale
      and a global reduced-motion rule (only the Home scroll-to-meeting respects it today).
- [x] **M1-T4 Shared UI primitives** - `Container`/`Section`/`Button`/`Card`/`Chip`/`SmartImage`;
      `Button` renders `<button>`, `<Link>` or `<a>` (external).
- [~] **M1-T5 Application shell** - `MobileMenu` mounted in `Header`; `Layout`/`AppLayout` deleted.
      **Remaining:** the sticky mobile "Przyjdź w środę" CTA is not added yet (deferred polish).

## Milestone 2 - Routing, i18n, public pages

- [~] **M2-T1 Routes and not-found** - 5 public routes + a deliberate 404. `/admin` and `/prywatnosc`
      are intentionally not advertised yet (their content/workflows are unfinished). No locale route
      wrapper until EN/UK content is reviewed.
- [~] **M2-T2 i18n architecture** - consolidated into `src/i18n/` (`config.ts` + `locales/{pl,en}`),
      Polish default/fallback, `supportedLngs ['pl','en','uk']`, `<html lang>` synced. **Missing:**
      locale-prefixed routes, a `uk` resource, and a key-parity test.
- [x] **M2-T3 Home hero and first-visit reassurance** - hero + value proposition + two CTAs + four
      reassurance cards + non-identifying board image.
- [x] **M2-T4 Meeting/location section** - shared `MeetingSection` (Home/Contact/Start Here) with
      OpenStreetMap map + directions links (localized).
- [x] **M2-T5 Start Here first-visit story and FAQ** - six-step story + accessible FAQ accordion +
      meeting CTA.
- [ ] **M2-T6 Migrate and polish static rules content** - not started; now **unblocked** (legacy
      `zasady.html` and diagrams are vendored).
- [~] **M2-T7 About page** - honest, minimal "purpose + typical meeting" content. Full club story,
      people bios and consented photos pending approval (N2).
- [~] **M2-T8 Contact and privacy pages** - Contact done (channels + shared meeting + OGS handles).
      **`/prywatnosc` and the photo-consent policy do not exist yet.**
- [ ] **M2-T9 Public-pages milestone gate** - `docs/qa-public-pages.md` not created (browser checks
      were done informally as part of R3/R4/R5).

## Milestone 3 - News domain and public feed

- [x] **M3-T1 News repository contract** - one concrete `PostRow`, validated `mapRowToNewsPost`,
      `listPublished` with a discriminated `ok` vs `unconfigured` result. (`getById` removed — no
      detail route.)
- [ ] **M3-T2 Seed data and migration format** - historical China Town Cup / Akira posts not prepared.
- [x] **M3-T3 PostCard and simple image viewing** - `NewsPostCard` renders date, tag, title, body,
      0–4 images and an optional external link; `NewsCard.tsx` (unused duplicate) removed.
- [x] **M3-T4 Public feed and Home preview** - one shared `NewsFeed` for Home preview (3) and
      `/aktualnosci` (all); mock data and the dead "view all" button removed; newest-first. Pagination
      and a `/aktualnosci/:id` detail route are **deliberately out of scope** (full content in feed).
- [ ] **M3-T5 News milestone gate** - `docs/qa-news.md` not created (checks done informally).

## Milestone 4 - Supabase persistence, storage, security

- [ ] **M4-T1 `posts` migration** - no `supabase/migrations/` directory.
- [ ] **M4-T2 `admins` table and RLS policies** - not started.
- [ ] **M4-T3 Image bucket and storage policies** - not started.
- [~] **M4-T4 Supabase client and repository implementation** - client getter, `.env.example`, row
      mapping and null-safety done; **now includes tests for descending order and error propagation.**
      No live Supabase project / `.env` yet.
- [ ] **M4-T5 Seed migrated posts** - not started.

## Milestone 5 - Protected mobile admin workflow

All tasks **not started** (M5-T1 … M5-T7).

## Milestone 6 - Accessibility, SEO, legacy compatibility

- [ ] **M6-T1 Accessibility pass** - no `docs/qa-accessibility.md`; primitives/menu/FAQ/image controls
      are keyboard-operable but no systematic audit yet.
- [ ] **M6-T2 Metadata and social sharing** - `react-helmet-async` not installed; no per-route
      titles/descriptions/canonical.
- [ ] **M6-T3 Sitemap and robots** - no `robots.txt`/sitemap (Footer links to them; they 404).
- [ ] **M6-T4 Legacy redirects** - no `vercel.json` for `/index.html`, `/zasady.html`, etc.

## Milestone 7 - Content, governance, deployment

All tasks **not started** (M7-T1 … M7-T6).

---

## Cross-cutting issues and architecture drift

1. ~~`docs/ARCHITECTURE.md` is stale~~ — **fixed** (rewritten for the root-level app).
2. ~~`web/AGENTS.md` is orphaned~~ — **fixed** (moved to root `AGENTS.md`, `web/` removed).
3. ~~Two locale trees~~ — **fixed** (consolidated into `src/i18n/`).
4. ~~i18n config path drift~~ — **fixed** (`src/i18n/config.ts`).
5. ~~Unused components~~ — **fixed** (`Layout.tsx`, `AppLayout.tsx`, `NewsCard.tsx` removed).
6. **Hardcoded user-facing strings** — **mostly fixed** (`MobileMenu`, `Zacznij`, `Aktualnosci`,
   `Home`, `Contact`, `OKlubie` use i18n keys). The `Footer` still contains a few literal Polish
   headings/nav labels.
7. **Missing favicon** — `index.html` references `/vite.svg` (still 404s).
8. ~~Placeholder contact data~~ — **fixed** (removed; `clubConfig.email` unset until approved).
9. ~~News is empty without env vars~~ — **fixed** (now distinct "unconfigured" vs empty states).
10. **No Prettier** — still missing.

---

## Recommended next task

Part 1 (R1–R5) is complete. Part 2 remains, dependency-ordered:

1. **N1 — Migrate the Go rules** (now unblocked: `zasady.html` + diagrams are vendored).
2. **N3 — Supabase migrations, RLS and storage** (posts table, admin allowlist, policies).

Several Part 2 items need **club input** before their dependent work (canonical domain/DNS, official
email + social links, venue/entrance wording, photo consent, admin Google accounts, EN/UK reviewers,
second access holders). Do not fill those with invented facts.
