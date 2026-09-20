# Lubelski Klub Go - Implementation Status Checklist

**Created:** 2026-09-20
**Purpose:** Single, honest snapshot of what is done vs. missing, measured against
`docs/ULTIMATE_IMPLEMENTATION_PLAN.md` and the actual code in this repository.

**How to read the status markers**

- `[x]` Done - matches the plan's "Done when" for that task.
- `[~]` Partial - some of the task exists, but one or more acceptance criteria are unmet.
- `[ ]` Not started - no meaningful implementation.

**This file is a status snapshot, not a task.** Update it after each milestone gate.

**Gate command for every task:** `npm run check` (lint -> typecheck -> test -> build).

---

## Repository snapshot (verified 2026-09-20)

- Build gate: **green** - lint clean, `tsc --noEmit` clean, 14/14 tests pass, `vite build` succeeds.
- Application location: **repository root** (`src/`), not `web/src/` as `docs/ARCHITECTURE.md` describes.
- Package manager: npm. Stack: React 18 + TypeScript 5.9 + Vite 8, Tailwind 3, react-router-dom 7, i18next 14.
- Tests present: `src/components/primitives.test.tsx`, `src/lib/news/repository.test.ts`, `src/App.test.tsx`.
- `web/` contains only `AGENTS.md` (no application code).
- Missing top-level folders required by later tasks: `public/`, `supabase/`, `reference/`.
- No `AGENTS.md` at repository root; no `vercel.json`; no Prettier.

---

## Milestone 0 - Baseline and tooling

- [~] **M0-T1 Inspect the repository** - `docs/ARCHITECTURE.md` exists but is stale and partly wrong
      (claims `reference/legacy-site/` exists and that the app will live in `web/`; neither is true).
- [x] **M0-T2 Scaffold/normalize the React app** - `index.html` + `src/main.tsx` + `src/App.tsx`;
      dev server and production build work. (Historically it shipped with **no entry `<script>`**, which is fixed.)
- [~] **M0-T3 Quality tooling** - `lint` / `typecheck` / `test` / `build` / `check` scripts all work,
      ESLint 9 flat config, Vitest + v8 coverage, 14 tests.
      **Missing: Prettier is not installed** (the plan's locked stack is "ESLint + Prettier").
- [~] **M0-T4 Project instructions for LLM sessions** - `web/AGENTS.md` exists and is good, but it is
      orphaned in an empty `web/` folder. No root `AGENTS.md`. `README.md` is a 2-line stub.
- [ ] **M0-T5 Vendor the legacy site** - `reference/legacy-site/` does not exist. No legacy
      `index.html` / `zasady.html` / `kontakt.html` / `wydarzenia.html` / `galeria.html` vendored,
      so M2-T6 (rules migration) has no source material.

---

## Milestone 1 - Content, configuration, design foundation

- [~] **M1-T1 Define domain types** - `src/types/data_models.ts` defines `MeetingInfo`, `ClubConfig`,
      `Person`, `NewsPost`, `Locale`. Missing `NewsImage` and `PostTag`. File naming differs from the
      plan's `src/types/club.ts` / `src/types/news.ts` (acceptable adaptation, but note it).
- [~] **M1-T2 Single source of truth** - `src/data/club.ts` holds `clubConfig`, `meetingInfo`,
      `socialLinks`. Gaps:
      - no `src/data/site.ts` (navigation metadata, map link/embed);
      - no `src/data/people.ts`;
      - `clubConfig.phone` / `clubConfig.email` are **placeholders**;
      - no test asserting personal phone/Gmail is not used as the primary channel.
- [~] **M1-T3 Design tokens** - Tailwind tokens (`paper`, `ink`, `muted-text`, `border`, `kaya`) and
      `src/styles/global.css` exist; PostCSS + Tailwind pipeline works.
      **Missing: explicit typography scale and reduced-motion handling.**
- [x] **M1-T4 Shared UI primitives** - `Container`, `Section`, `Button`, `Card`, `Chip`, `SmartImage`
      in `src/components/primitives.tsx`; typed, focus-visible styles, coverable by tests.
- [~] **M1-T5 Application shell** - `Header`, `Footer`, `MobileMenu`, `AppLayout`, `Layout` exist.
      Gaps:
      - **`MobileMenu` is never mounted** in `Header` (no mobile navigation on the real page);
      - no mobile sticky "Przyjdź w środę" CTA;
      - `Layout.tsx` and `AppLayout.tsx` are unused duplicates.

---

## Milestone 2 - Routing, i18n, public pages

- [~] **M2-T1 Routes and not-found** - 5 public routes render. **Missing:** `/admin`, `/prywatnosc`,
      a friendly 404 route, and the locale route wrapper.
- [~] **M2-T2 i18n architecture** - Polish default + fallback, namespaces `common`, `hero`, `homepage`,
      `oklubie`, `aktualnosci`. Gaps:
      - config lives at `src/config/i18n.ts`, not `src/i18n/config.ts` as the plan specifies;
      - no locale-prefixed routes; `<html lang="pl">` is hardcoded and never synced;
      - missing namespaces for `start`, `about`, `contact`, `news`;
      - no EN/UK resource skeletons and no key-parity tests;
      - **dead duplicate locale tree** at `src/i18n/locales/**` (unused, confusing).
- [~] **M2-T3 Home hero and first-visit reassurance** - hero + value proposition + CTA to `/zacznij`
      exist; Home now also renders a repository-backed news preview.
      **Missing:** real-photo slot and the four reassurance cards (beginners welcome / nothing
      required / free entry / children welcome).
- [ ] **M2-T4 Meeting/location section** - no shared meeting component, no OpenStreetMap embed/link,
      no directions CTA. `meetingInfo` is not rendered on Home or Contact.
- [ ] **M2-T5 Start Here first-visit story and FAQ** - `/zacznij` is three static cards; no story, no FAQ.
- [ ] **M2-T6 Migrate and polish static rules content** - not started (also blocked by M0-T5).
- [ ] **M2-T7 About page** - `/o-klubie` is a two-key placeholder; no story, people or photos.
- [ ] **M2-T8 Contact and privacy pages** - `/kontakt` is a hardcoded placeholder;
      `/prywatnosc` and the photo-consent policy do not exist.
- [ ] **M2-T9 Public-pages milestone gate** - `docs/qa-public-pages.md` does not exist.

---

## Milestone 3 - News domain and public feed

- [x] **M3-T1 News repository contract** - `src/lib/news/repository.ts` exposes
      `listPublished` / `getById`, a `mapRowToNewsPost` mapping boundary, `INewsRepository`,
      a null-safe Supabase client (`src/lib/supabase/client.ts`) and unit tests.
- [ ] **M3-T2 Seed data and migration format** - historical China Town Cup / Akira Hello World posts
      not prepared.
- [~] **M3-T3 PostCard and simple image viewing** - `NewsPostCard` renders tag/title/summary/image.
      Gaps: no publication date, no multi-image support, no accessible image viewer, no external link.
      `NewsCard.tsx` is an unused near-duplicate.
- [~] **M3-T4 Public feed and Home preview** - Home fetches from the repository with loading/empty/
      error states. Gaps:
      - **`/aktualnosci` still uses inline mock data** instead of the repository (inconsistent);
      - no `/aktualnosci/:id` detail route;
      - "view all articles" button is non-functional;
      - no pagination.
- [ ] **M3-T5 News milestone gate** - `docs/qa-news.md` does not exist.

---

## Milestone 4 - Supabase persistence, storage, security

- [ ] **M4-T1 `posts` migration** - no `supabase/migrations/` directory.
- [ ] **M4-T2 `admins` table and RLS policies** - not started.
- [ ] **M4-T3 Image bucket and storage policies** - not started.
- [~] **M4-T4 Supabase client and repository implementation** - client getter, `.env.example`
      (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), row mapping and null-safety are done.
      Gaps: no live Supabase project, no `.env`, and **no test asserting descending published order**.
- [ ] **M4-T5 Seed migrated posts** - not started.

---

## Milestone 5 - Protected mobile admin workflow

- [ ] **M5-T1 Google OAuth configuration** - not started.
- [ ] **M5-T2 Auth context and protected gate** - not started.
- [ ] **M5-T3 Admin post list** - not started.
- [ ] **M5-T4 Post form and validation** - not started.
- [ ] **M5-T5 Mobile image picker and compression** - not started.
- [ ] **M5-T6 Create/edit/delete and cleanup** - not started.
- [ ] **M5-T7 Two-minute publishing verification** - `docs/qa-admin.md` does not exist.

---

## Milestone 6 - Accessibility, SEO, legacy compatibility

- [ ] **M6-T1 Accessibility pass** - no `docs/qa-accessibility.md`; no systematic audit
      (primitives have focus styles, but FAQ/menu/image controls do not exist yet).
- [ ] **M6-T2 Metadata and social sharing** - `react-helmet-async` is **not installed**;
      no canonical URLs, titles/descriptions, or social image. `index.html` has one static description.
- [ ] **M6-T3 Sitemap and robots** - no `public/` directory, no `robots.txt`, no sitemap script.
      (Note: the Footer already links `/robots.txt` and `/sitemap.xml`, which currently 404.)
- [ ] **M6-T4 Legacy redirects** - no `vercel.json` / hosting redirect config for
      `/index.html`, `/zasady.html`, `/kontakt.html`, `/wydarzenia.html`, `/galeria.html`.

---

## Milestone 7 - Content, governance, deployment

- [ ] **M7-T1 Replace placeholders with approved assets** - no real photography or consent records.
- [ ] **M7-T2 Governance documentation** - `docs/GOVERNANCE.md` does not exist.
- [ ] **M7-T3 Runbook and admin guide** - `docs/ADMIN_SETUP.md` / `docs/RUNBOOK.md` do not exist.
- [ ] **M7-T4 Production configuration and preview deployment** - no Vercel config,
      no SPA fallback, no env documentation beyond `.env.example`.
- [ ] **M7-T5 Launch acceptance test** - `docs/qa-launch.md` does not exist.
- [ ] **M7-T6 Production launch and smoke test** - not started.

---

## Cross-cutting issues and architecture drift

These are not plan tasks, but they will cause confusion or defects if left unaddressed.

1. **`docs/ARCHITECTURE.md` is stale** - it describes the app as living in `web/` and claims
   `reference/legacy-site/` exists. Neither is true. It should be corrected or superseded by this file.
2. **`web/AGENTS.md` is orphaned** - the guide is good but sits in a folder with no code.
   Move it to the repository root (or add a root `AGENTS.md` that points to it).
3. **Two locale trees** - `src/locales/**` (used) and `src/i18n/locales/**` (dead). Remove the dead one.
4. **i18n config path** - `src/config/i18n.ts` vs. the plan's `src/i18n/config.ts`. Pick one and document it.
5. **Unused components** - `Layout.tsx`, `AppLayout.tsx`, `NewsCard.tsx` are not referenced anywhere.
6. **Hardcoded user-facing strings in components** - `ZacznijPage`, `Footer`, `MobileMenu`,
   `AktualnosciPage` contain literal Polish text, violating "no literal UI strings in reusable components".
7. **Missing favicon** - `index.html` references `/vite.svg`, but there is no `public/` folder, so it 404s.
8. **Placeholder contact data** - `clubConfig.phone` / `clubConfig.email` are fake and must be replaced.
9. **News is empty without env vars** - by design (null-safe client), but there is no `.env`, so the live
   feed shows the empty state until M4 is configured.
10. **No Prettier** - plan lists it as part of the locked formatting toolchain.

---

## Recommended next task

The dependency-ordered next step is **M1-T2 completion**, then **M1-T5**:

1. **M1-T2** - add `src/data/site.ts` (navigation metadata + map link/embed) and `src/data/people.ts`,
   replace placeholder contact values, and add a small test that rejects personal phone/Gmail fields.
2. **M1-T5** - mount `MobileMenu` in `Header`, add the mobile sticky "Przyjdź w środę" CTA,
   and delete the unused `Layout.tsx` / `AppLayout.tsx` duplicates.

Keep `npm run check` green after each of these, and update this checklist when the task is done.
