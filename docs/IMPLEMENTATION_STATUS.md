# Lubelski Klub Go - Implementation Status Checklist

**Created:** 2026-09-20 · **Last updated:** 2026-09-30 (code-review fixes: image lifecycle, admin retry, URL validation, photo viewing, RLS guide)
**Purpose:** Single, honest snapshot of what is done vs. missing, measured against
`docs/ULTIMATE_IMPLEMENTATION_PLAN.md` and the actual code in this repository.

**How to read the status markers**

- `[x]` Done - matches the plan's "Done when" for that task.
- `[~]` Partial - some of the task exists, but one or more acceptance criteria are unmet.
- `[ ]` Not started - no meaningful implementation.

**This file is a status snapshot, not a task.** Update it after each milestone gate.

**Gate command for every task:** `npm run check` (lint → format:check → typecheck → test → build).

---

## Repository snapshot (verified 2026-09-30)

- Build gate: **green** - lint/format clean, `tsc --noEmit` clean, **102/102 tests pass**, `vite build` succeeds (V2, 2026-09-30).
- Papier i goban: **V2 complete** — local licensed Noto fonts, hero/brand assets, semantic tokens and shared primitives. [V2 evidence and limits](design/V2-zasoby-i-fundament.md); Home/shared-shell layout remains V3.
- Application location: **repository root** (`src/`, `public/`), not `web/`.
- Package manager: npm. Stack: React 18 + TypeScript 5.9 + Vite 8, Tailwind 3, react-router-dom 7, i18next.
- `public/assets/` (hero board image) and `reference/legacy-site/` (old site) now exist.
- Root `AGENTS.md` and a setup `README.md` now exist.
- Supabase: a live project is configured in the developer's environment — public feed
  (published-only), Google sign-in, admin allowlist and admin post writes are verified.
- Tier B "drafts + explicit publishing" is implemented (see the Tier B section below).
- Prettier configured (`.prettierrc.json` + `format`/`format:check` scripts; codebase formatted).
- i18n: PL (default/fallback) + EN + UK resources; pl↔en↔uk key-parity test; a flag-based
  language switcher (`LanguageSwitcher`, SVG flags in `public/flags/`) is always visible in the header.
- News images carry per-image `alt` (`NewsImage { url, alt }`), persisted as `images` jsonb
  (migration `0004`) and editable in the admin `ImagePicker`.
- A semantic typography scale (`display`/`h1`/`h2`/`h3`/`body`/`caption`) is defined in
  `tailwind.config.js` and applied as `@layer base` defaults.
- QA gate checklists written: `docs/qa-public-pages.md`, `docs/qa-news.md`, `docs/qa-admin.md`.
- Code-review defects fixed (with regression tests): deferred photo deletion (save/delete/cancel
  coordinated via session uploads), upload state shared with the form, storage deletion errors
  surfaced with distinct cleanup-failure messaging, admin list error + retry, optional-link URL
  validation, full-image links on news cards, and a corrected RLS verification guide in
  `docs/ADMIN_SETUP.md` §7.

---

## Milestone 0 - Baseline and tooling

- [x] **M0-T1 Inspect the repository** - `docs/ARCHITECTURE.md` corrected to describe the
      root-level app (no more `web/` / non-existent `reference/` claims).
- [x] **M0-T2 Scaffold/normalize the React app** - dev server and production build work.
- [x] **M0-T3 Quality tooling** - `check`/`lint`/`format:check`/`typecheck`/`test`/`build` all work
      (101 tests); Prettier added (`.prettierrc.json`, `format`/`format:check`).
- [x] **M0-T4 Project instructions for LLM sessions** - root `AGENTS.md` + setup `README.md`.
- [x] **M0-T5 Vendor the legacy site** - `reference/legacy-site/` holds the old HTML, CSS, logo,
      poster, rules diagrams and event photos, plus a provenance/consent note.

## Milestone 1 - Content, configuration, design foundation

- [x] **M1-T1 Define domain types** - `MeetingInfo`, `ClubConfig`, `SocialLinks`, `NavItem`,
      `Person`, `NewsPost`, `NewsImage`, `PostTag`, `Locale` all defined. `NewsImage { url, alt }`
      is modeled, rendered per-image (empty `alt` = decorative), persisted (`images` jsonb, migration
      `0004`) and editable in the admin form.
- [x] **M1-T2 Single source of truth** - `club.ts` + `site.ts` + `people.ts`; placeholder phone/email
      removed; a test rejects personal phone/Gmail as the primary channel.
- [x] **M1-T3 Design tokens** - tokens + `global.css` exist; global `prefers-reduced-motion` rule
      added; an explicit semantic typography scale (`display`/`h1`/`h2`/`h3`/`body`/`caption`) is
      defined in `tailwind.config.js` and applied as base defaults for `body`/`h1`/`h2`/`h3`.
- [x] **M1-T4 Shared UI primitives** - `Container`/`Section`/`Button`/`Card`/`Chip`/`SmartImage`;
      `Button` renders `<button>`, `<Link>` or `<a>` (external).
- [x] **M1-T5 Application shell** - `MobileMenu` mounted in `Header`; `Layout`/`AppLayout` deleted;
      sticky mobile "Przyjdź w środę" CTA (`MobileCta`) and a flag-based language switcher
      (`LanguageSwitcher`, flags always visible in the header) added.

## Milestone 2 - Routing, i18n, public pages

- [x] **M2-T1 Routes and not-found** - 5 public routes + a deliberate 404 + a locale route wrapper
      (`/en/...`, `/uk/...`) that renders the same pages in another language. `/admin` and
      `/prywatnosc` are intentionally not advertised yet (their content/workflows are unfinished).
- [x] **M2-T2 i18n architecture** - consolidated into `src/i18n/` (`config.ts` + `locales/{pl,en,uk}`),
      Polish default/fallback, `supportedLngs ['pl','en','uk']`, URL-driven language + `<html lang>`
      sync (`useLocale`/`LocaleGate`); pl↔en↔uk key-parity test added. EN/UK wording is an unreviewed
      machine skeleton (human review deferred).
- [x] **M2-T3 Home hero and first-visit reassurance** - hero + value proposition + two CTAs + four
      reassurance cards + non-identifying board image.
- [x] **M2-T4 Meeting/location section** - shared `MeetingSection` (Home/Contact/Start Here) with
      OpenStreetMap map + directions links (localized).
- [x] **M2-T5 Start Here first-visit story and FAQ** - six-step story + accessible FAQ accordion +
      meeting CTA.
- [x] **M2-T6 Migrate and polish static rules content** - six short rules steps on `/zacznij`
      (board, liberties, capture/atari, territory, ko, eyes/life-death) with typo-fixed Polish and
      the original static diagrams (meaningful alt). Interactive board remains deferred.
- [~] **M2-T7 About page** - honest, minimal "purpose + typical meeting" content. Full club story,
  people bios and consented photos pending approval (N2).
- [x] **M2-T8 Contact and privacy pages** - Contact done (channels + shared meeting + OGS handles);
      `/prywatnosc` (privacy notice + photo-consent policy) done and linked from the footer.
- [~] **M2-T9 Public-pages milestone gate** - `docs/qa-public-pages.md` written; the human browser
  run (mobile + desktop) is still pending.

## Milestone 3 - News domain and public feed

- [x] **M3-T1 News repository contract** - one concrete `PostRow`, validated `mapRowToNewsPost`,
      `listPublished` with a discriminated `ok` vs `unconfigured` result. (`getById` removed — no
      detail route.)
- [~] **M3-T2 Seed data and migration format** - historical posts prepared in `src/lib/news/seed.ts`
  (correct 2023 dates, tags, external links); images intentionally empty pending photo consent
  and Supabase Storage upload.
- [x] **M3-T3 PostCard and simple image viewing** - `NewsPostCard` renders date, tag, title, body,
      0–4 images and an optional external link; `NewsCard.tsx` (unused duplicate) removed.
- [x] **M3-T4 Public feed and Home preview** - one shared `NewsFeed` for Home preview (3) and
      `/aktualnosci` (all); mock data and the dead "view all" button removed; newest-first. Pagination
      and a `/aktualnosci/:id` detail route are **deliberately out of scope** (full content in feed).
- [~] **M3-T5 News milestone gate** - `docs/qa-news.md` written; the human run is still pending.

## Milestone 4 - Supabase persistence, storage, security

- [x] **M4-T1 `posts` migration** - `supabase/migrations/0001_posts.sql` (posts table matching
      `PostRow`, indexes on published date/status).
- [x] **M4-T2 `admins` table and RLS policies** - `0002_admins_and_rls.sql` (allowlist, `is_admin()`,
      public-read-published + admin-only write RLS).
- [x] **M4-T3 Image bucket and storage policies** - `0003_storage.sql` (`news-images` bucket, image
      MIME allowlist + size limit, public reads + admin-only writes).
- [x] **M4-T4 Supabase client and repository implementation** - client getter, `.env.example`, row
      mapping, null-safety and tests (descending order, error propagation) done. A live Supabase
      project is configured in the developer's environment, so "public feed reads published posts"
      is verified in a real DB (RLS is the security boundary).
- [x] **M4-T5 Seed migrated posts** - `src/lib/news/seed.ts` (typed) + `supabase/seed/seed_posts.sql`
      (historical posts, correct dates). Images empty pending consent + Storage upload.

`docs/ADMIN_SETUP.md` documents the reproducible setup and the RLS verification steps.

## Milestone 5 - Protected mobile admin workflow

- [x] **M5-T1 Google OAuth configuration** - auth code + `docs/ADMIN_SETUP.md` §6 (provider + redirect
      URLs). Verified in the developer's live project (Google sign-in + admin allowlist work);
      production admins still to be added by the club.
- [x] **M5-T2 Auth context and protected gate** - `AuthProvider` (session, `is_admin` RPC, sign-in/out);
      anonymous → login, non-admin → denial, admin → panel.
- [x] **M5-T3 Admin post list** - title, date, tag, post status (draft/published), edit action,
      "new post" CTA.
- [x] **M5-T4 Post form and validation** - title/body/date/tag/link/photos with concise inline errors.
- [x] **M5-T5 Mobile image picker and compression** - multi-select, type/size validation, canvas
      resize + compress to JPEG, previews + remove.
- [x] **M5-T6 Create/edit/delete and cleanup** - repository mutations (`listAll`/`create`/`update`/
      `remove`), storage upload/remove, orphan cleanup on cancel/delete/partial-upload.
- [~] **M5-T7 Two-minute publishing verification** - `docs/qa-admin.md` written; the live Supabase
  project + real phone test is still pending.

## Milestone 6 - Accessibility, SEO, legacy compatibility

- [x] **M6-T1 Accessibility pass** - `docs/qa-accessibility.md` documents landmarks/headings/keyboard/
      focus/contrast/reduced-motion; no critical issues found.
- [x] **M6-T2 Metadata and social sharing** - `react-helmet-async` + `PageMeta` set per-route title/
      description/canonical/OpenGraph (and `noindex` on `/admin`).
- [x] **M6-T3 Sitemap and robots** - `public/robots.txt` + `public/sitemap.xml` (public routes only),
      valid `favicon.png`.
- [x] **M6-T4 Legacy redirects** - `vercel.json` with permanent redirects for `/index.html`,
      `/zasady.html`, `/kontakt.html`, `/wydarzenia.html`, `/galeria.html` + SPA deep-link fallback.

## Milestone 7 - Content, governance, deployment

- [~] **M7-T1 Replace placeholders with approved assets** - code uses honest, non-identifying
  content; real consented photos + club story await club input (`docs/CONTENT_APPROVAL.md`).
- [x] **M7-T2 Governance documentation** - `docs/GOVERNANCE.md` (two-person access inventory,
      succession, content-ownership table) with cells to fill in.
- [x] **M7-T3 Runbook and admin guide** - `docs/ADMIN_SETUP.md` (Supabase) + `docs/RUNBOOK.md`
      (publish/edit/delete, facts, deploy, rollback).
- [~] **M7-T4 Production configuration and preview deployment** - `vercel.json` done; an actual
  Vercel project + preview deployment awaits a Vercel account (club input).
- [~] **M7-T5 Launch acceptance test** - `docs/qa-launch.md` checklist written; the human run is
  pending a deployed preview.
- [ ] **M7-T6 Production launch and smoke test** - not started (needs a live deployment).

## Tier B - drafts and explicit publishing (added after Tier A)

Implemented as one Tier B task (previously a Tier A non-goal: "post scheduling or drafts").
New posts are drafts by default; the admin can **save draft** or **publish**; editing an
already-published post cannot accidentally turn it into a draft; the admin list shows each
post's status; the public feed still shows only published posts (RLS + `listPublished`).

- [x] **Model + repository** - `NewsPost.published` and `NewsPostInput.published` thread the flag
      through `mapRowToNewsPost` and `toRow`; `create`/`update` no longer hardcode `published: true`.
      No migration was needed (the `published` column already existed, default `false`).
- [x] **Admin form** - draft-by-default with explicit "Zapisz szkic" / "Opublikuj" actions; editing a
      published post offers only "Zapisz" (preserves `published: true`).
- [x] **Admin list** - shows "Szkic" / "Opublikowany" per post.
- [x] **i18n** - PL/EN keys (`save_draft`, `publish`, `status_draft`, `status_published`).
- [x] **Tests** - repository + `PostForm`/`PostList` component tests for save-draft, publish and
      status preservation on edit (101 tests total).
- [x] **Docs** - `docs/RUNBOOK.md` updated with the draft-vs-publish flow.

---

## Cross-cutting issues and architecture drift

1. ~~`docs/ARCHITECTURE.md` is stale~~ — **fixed** (rewritten for the root-level app).
2. ~~`web/AGENTS.md` is orphaned~~ — **fixed** (moved to root `AGENTS.md`, `web/` removed).
3. ~~Two locale trees~~ — **fixed** (consolidated into `src/i18n/`).
4. ~~i18n config path drift~~ — **fixed** (`src/i18n/config.ts`).
5. ~~Unused components~~ — **fixed** (`Layout.tsx`, `AppLayout.tsx`, `NewsCard.tsx` removed).
6. ~~Hardcoded user-facing strings~~ — **fixed** (all shared components now use i18n keys, including
   the Footer; `NewsPostCard` dates are locale-aware).
7. ~~Missing favicon~~ — **fixed** (valid `public/favicon.png` from the club logo).
8. ~~Placeholder contact data~~ — **fixed** (removed; `clubConfig.email` unset until approved).
9. ~~News is empty without env vars~~ — **fixed** (now distinct "unconfigured" vs empty states).
10. ~~No Prettier~~ — **fixed** (`.prettierrc.json` + `format`/`format:check`; codebase formatted).

---

## Next session

**Remaining code (unblocked, no club input):** none — the session's code backlog is complete.

**Done this session (2026-09-30):**

- **`dayOfWeek` → i18n key** — the weekday is now rendered from the `meeting:day_of_week` key
  ("środa" / "Wednesday" / "середа"); the `dayOfWeek` field was removed from `MeetingInfo`/`club.ts`.
- **Typography scale (M1-T3)** — semantic `display`/`h1`/`h2`/`h3`/`body`/`caption` font sizes added
  to `tailwind.config.js` and applied as `@layer base` defaults.
- **`NewsImage` + per-image alt (M1-T1)** — `NewsImage { url, alt }` modeled, threaded through the
  read model (`NewsPost.images`), and rendered with its own alt in `NewsPostCard`.
- **Persist/editable per-image alt** — `posts.images` jsonb column (migration `0004`), repository
  read/write of `{url, alt}`, and an alt-text input in the admin `ImagePicker`. Applying `0004` to
  the live Supabase project is a manual step (see `docs/human-work.md`).
- **QA gate checklists (M2-T9 / M3-T5 / M5-T7)** — `docs/qa-public-pages.md`, `docs/qa-news.md` and
  `docs/qa-admin.md` written for the future human acceptance pass.

**Club/human work (blocked — needs a named club representative):**

- Fill `docs/GOVERNANCE.md` (named holders) and `docs/CONTENT_APPROVAL.md` (facts, consent,
  club email, story).
- Production Supabase + Vercel preview + `docs/qa-launch.md`; production launch (M7-T6).

Do not fill these with invented facts.
