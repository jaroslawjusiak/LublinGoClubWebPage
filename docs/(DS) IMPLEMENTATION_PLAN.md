# Lubelski Klub Go — React Implementation Plan (Tier A)

Implementation plan for the rebuild described in `docs/WEBSITE_REBUILD_PLAN.md`.
**Scope: Tier A only.** Tier B/C are explicitly deferred (§7).

---

## 0. How to read this plan

- **Milestones** (M0–M7) group work by dependency order.
- Each milestone has **user stories** (who benefits) and **subtasks**.
- Every subtask is **atomic and thin**: one concern, **≤ 3 files, ≤ ~150 new lines**, sized for one local-LLM session with a small context window.
- Each subtask lists: `Files` · `Depends` · `Do` · `Done when` (acceptance criterion).
- ⚑ marks a subtask that implements a verified audit finding from the concept (§1/§3).

---

## 1. Locked technology stack

| Layer | Choice | Why (local-LLM + 15 min/week maintenance) |
|---|---|---|
| Framework | **React 18 + TypeScript + Vite** | The one firm requirement; SPA is easy to reason about and deploy. |
| Routing | **react-router-dom v6** (`createBrowserRouter`) | Standard, well-known, locale-prefix routes are trivial. |
| Styling | **Tailwind CSS 3.4** + design tokens in `tailwind.config.js` | Utility-first keeps components small; tokens centralise the Go black/white + kaya amber palette. |
| i18n | **i18next + react-i18next** (JSON resources, `/pl` `/en` `/uk` prefixes) | Architecture in v1, PL content only; coverage test prevents en/uk drift. |
| Static content | **`src/data/*.ts`** (club, people, events, site meta) | Single source of truth for meeting info; fixes duplicated blocks structurally. |
| News / CMS | **Supabase** (Postgres + Auth + Storage, free tier) | Lets non-technical admins publish from a phone **without a code deploy** — the core Tier A requirement. |
| Admin auth | **Supabase Auth (Google OAuth) + email allowlist enforced by RLS** | No passwords to reset/leak; 2–5 allowlisted accounts. |
| Images | **Supabase Storage** bucket + client-side compression (`browser-image-compression`) | Phone photos must upload in < 2 min on mobile data. |
| Meta/SEO | **react-helmet-async** + `scripts/gen-sitemap.mjs` | Per-route title/description/OG; static SEO basics. |
| Maps | **OpenStreetMap embed + plain link** | No API key, no cookie-consent obligation. |
| Tests | **Vitest + @testing-library/react** (logic + key components only) | `npm run check` is the gate after every task. |
| Lint/format | **ESLint + Prettier** | Deterministic style, one command. |
| Deploy | **Vercel** (free tier), SPA rewrite + legacy redirects via `vercel.json` | Static hosting of the built `dist/`. |

**Why Supabase and not "JSON in the repo":** the concept's Tier A #5 requires a *simple publishing workflow* that two non-technical people can use from a phone. File-in-repo publishing needs a git commit per post, which is exactly the friction that killed `wydarzenia.html`. A managed backend is the lowest-maintenance mechanism that satisfies it, and it stays on the free tier.

Repo layout (app lives in `web/`):

```
LublinGoClubWebPage/
├─ docs/                      # concept + this plan
├─ reference/legacy-site/     # vendored old site (read-only reference, M0-T8)
└─ web/                        # the React app (Vercel root dir)
   ├─ src/
   │  ├─ components/           # ui/ (primitives), layout/, home/, zacznij/, news/, admin/
   │  ├─ pages/                # one file per route
   │  ├─ data/                 # club.ts, people.ts, events.ts, site.ts  (single source of truth)
   │  ├─ lib/                  # next-meeting.ts, supabaseClient.ts, image.ts, seo.ts
   │  ├─ i18n/                 # config + locales/{pl,en,uk}/*.json
   │  ├─ app/router.tsx        # route table
   │  └─ styles/index.css      # Tailwind entry + token layer
   ├─ supabase/migrations/     # SQL schema + RLS (versioned)
   ├─ public/                  # images, og.png, robots.txt, sitemap.xml
   └─ scripts/                 # gen-sitemap.mjs
```

---

## 2. Working contract for local-LLM sessions

Every task is sized for **one session with a small local model**:

1. **Context pack** (paste exactly this, nothing else): ① the single task bullet from this file, ② `web/AGENTS.md`, ③ the files the task names, ④ `tailwind.config.js` tokens, ⑤ the test file when TDD order is given.
2. **Size limit:** ≤ 3 files, ≤ ~150 new lines. If a task wants more — split it.
3. **No new dependencies** unless the task says so. No "while we're here" refactors.
4. **TDD for `src/data/**` and `src/lib/**`:** session 1 writes the test only, session 2 implements until green. Small models implement-to-tests far better than design-from-prose.
5. **Gate:** `cd web && npm run check` (`typecheck && lint && test && build`) must pass before commit. Commit message = task ID: `M2-T4: next-meeting util + tests`.
6. **Never hardcode facts** (address, time, contacts, links) in components — read them from `src/data/**` or i18n dicts.
7. **Never put literal UI text in JSX** — i18n keys only (this makes M6 a pure JSON job).
8. **Board/game logic stays pure** in `src/lib/**`; components are dumb renderers.
9. After each milestone: a human (not the LLM) runs the milestone QA checklist.
10. `web/AGENTS.md` (written in M0-T7) restates these rules plus the directory map and the check command.

---

## 3. Milestones

### M0 — Foundation & tooling

> **US0.1** As a maintainer-session (human or LLM), the repo must be boring: fixed commands, fixed layout, nothing to guess.

- **M0-T1 — Scaffold Vite + React + TypeScript**
  - Files: `web/` (generated)
  - Depends: —
  - Do: `npm create vite@latest web -- --template react-ts`; remove demo boilerplate; confirm dev server.
  - Done when: `npm run dev` renders a clean page with zero console errors and `npm run build` emits `dist/`.

- **M0-T2 — Tailwind + design tokens**
  - Files: `web/tailwind.config.js`, `web/src/styles/index.css`
  - Depends: M0-T1
  - Do: install/configure Tailwind; add tokens: `paper #F8F9FA`, `ink #1A1A1A`, `stone-gray #555555`, `kaya #C28E3A` (accent), `kaya-light #D4A359`; base reset; sans + heading font stacks.
  - Done when: a demo element using `bg-kaya text-ink` renders with the expected colours.

- **M0-T3 — Path alias `@/`**
  - Files: `web/vite.config.ts`, `web/tsconfig.json`
  - Depends: M0-T1
  - Do: map `@/` → `src/` in Vite and TS.
  - Done when: `import { Button } from '@/components/ui/Button'` resolves after M1-T2.

- **M0-T4 — Quality scripts + gate**
  - Files: `web/package.json`, `web/.eslintrc.cjs`, `web/.prettierrc`, `web/vitest.config.ts`
  - Depends: M0-T1
  - Do: install ESLint, Prettier, Vitest, `@testing-library/react`, `jsdom`; scripts `typecheck`, `lint`, `test`, and `check = typecheck && lint && test && build`.
  - Done when: `npm run check` is green on the empty app; one throwaway `expect(true).toBe(true)` test demonstrates Vitest runs.

- **M0-T5 — Vercel project + SPA fallback**
  - Files: `web/vercel.json`
  - Depends: M0-T1
  - Do: create Vercel project with root dir `web`, build `npm run build`, output `dist`; add catch-all rewrite to `/index.html`.
  - Done when: a deep link (e.g. `/kontakt`) on the preview URL serves the app instead of a 404.

- **M0-T6 — Supabase env scaffolding**
  - Files: `web/.env.example`, `web/src/vite-env.d.ts`
  - Depends: —
  - Do: document `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_EMAILS`; add typed `ImportMetaEnv`. No client yet.
  - Done when: `.env.example` is committed and `.env.local` is git-ignored.

- **M0-T7 — `web/AGENTS.md` + README**
  - Files: `web/AGENTS.md`, `web/README.md`
  - Depends: M0-T4
  - Do: paste §2 rules verbatim + directory map + check command; README lists the 3 commands a human needs.
  - Done when: a fresh LLM session can start any later task knowing only `AGENTS.md` + the task bullet.

- **M0-T8 — Vendor the legacy site**
  - Files: `reference/legacy-site/**` (old HTML + `assets/` + `photo/`)
  - Depends: —
  - Do: copy the current site into `reference/` read-only; this is the copy/rules/photos source for M3.
  - Done when: all legacy pages and images are present and untouched.

**M0 DoD:** preview live, `npm run check` green, `AGENTS.md` exists, legacy content vendored.

---

### M1 — Design system & layout shell

> **US1.1** As a visitor, every page must feel like the same calm, deliberate site.
> **US1.2** As a mobile visitor, I can always reach the five pages and the "come on Wednesday" action.

- **M1-T1 — Container & Section primitives**
  - Files: `web/src/components/ui/Container.tsx`, `web/src/components/ui/Section.tsx`
  - Depends: M0-T2
  - Done when: `Container` centres content at a max width; `Section` provides vertical rhythm and an optional heading slot.

- **M1-T2 — Button primitive**
  - Files: `web/src/components/ui/Button.tsx`
  - Depends: M0-T2
  - Do: variants `primary` (kaya), `secondary` (ink outline), `ghost`; renders `<Link>` when `to` is given, else `<button>`.
  - Done when: all three variants and both render modes work; focus ring visible.

- **M1-T3 — Card primitive**
  - Files: `web/src/components/ui/Card.tsx`
  - Depends: M0-T2
  - Done when: padded, rounded, subtle-border surface with optional `as` element.

- **M1-T4 — Chip / Badge primitive**
  - Files: `web/src/components/ui/Chip.tsx`
  - Depends: M0-T2
  - Done when: small pill for labels like `WSTĘP WOLNY`, `DZIECI MILE WIDZIANE`.

- **M1-T5 — SmartImage primitive** ⚑
  - Files: `web/src/components/ui/SmartImage.tsx`
  - Depends: M0-T2
  - Do: wraps `<img>` with required `alt` prop, `loading="lazy"`, `decoding="async"`, fixed aspect wrapper to avoid layout shift.
  - Done when: TypeScript refuses an `<SmartImage>` without `alt`, and a missing image falls back to a placeholder.

- **M1-T6 — Header / Nav + mobile menu** ⚑
  - Files: `web/src/components/layout/Header.tsx`, `web/src/components/layout/MobileMenu.tsx`
  - Depends: M1-T2, M0-T3
  - Do: logo + club name + 5 links (Start, Aktualności, Zacznij, O klubie, Kontakt) + language slot (M6) + Discord icon; hamburger toggle on mobile.
  - Done when: mobile menu opens/closes cleanly, desktop shows horizontal links, no images used as nav icons.

- **M1-T7 — Footer**
  - Files: `web/src/components/layout/Footer.tsx`
  - Depends: M2-T5 (meeting line) — may temporarily accept props
  - Do: quick links, Facebook / Discord / OGS / Polish Go Association external links (`target="_blank" rel="noopener noreferrer"`), meeting line, privacy link.
  - Done when: all external links carry the correct `rel`; the meeting line comes from the shared component, not a literal.

- **M1-T8 — Sticky mobile CTA**
  - Files: `web/src/components/layout/StickyCta.tsx`
  - Depends: M1-T2
  - Do: `md:hidden` fixed-bottom bar with "Przyjdź w środę" scrolling to the schedule block on home.
  - Done when: bar stays above content on a 360 px viewport and does not cover the footer's last line on desktop.

- **M1-T9 — App shell + route skeleton**
  - Files: `web/src/app/router.tsx`, `web/src/components/layout/AppLayout.tsx`
  - Depends: M1-T6, M1-T7, M1-T8
  - Do: `createBrowserRouter` with placeholder routes `/`, `/aktualnosci`, `/zacznij`, `/o-klubie`, `/kontakt`, `/admin`, `*`; `AppLayout` renders Header + `<Outlet/>` + Footer + StickyCta.
  - Done when: every route renders inside the shell; unknown path shows the 404 placeholder.

**M1 DoD:** consistent shell, all primitives reusable, no literals in JSX, `npm run check` green.

---

### M2 — Single source of truth (data layer)

> **US2.1** As a returning member I want one place where venue/time/contacts live, so pages never disagree.
> **US2.2** As a newcomer the site always shows the *next real* meeting date, so I know the club is alive.
> **US2.3** As the club, we must never publish personal Gmail/phone again.

- **M2-T1 — `club.ts` (venue, schedule, contact)** ⚑
  - Files: `web/src/data/club.ts`, `web/src/data/club.test.ts`
  - Depends: M0-T4
  - Do: `venue {name, street, city, room, entranceHint, osmEmbed, mapLink}`, `schedule {weekday:3, start:"17:00", end:"20:00", breaks:[{from,to,why}]}`, `contact {email (club alias), facebook, discordInvite, ogs}` (use the **working** invite; the old `xeaQ8uMy` is dead).
  - Done when: test asserts no `gmail.com` address and no `tel`/phone field exists in the export.

- **M2-T2 — `people.ts` (contact persons)** ⚑
  - Files: `web/src/data/people.ts`
  - Depends: M0-T4
  - Do: `{name, role, rank, ogs, bio}` array, no personal emails or phones.
  - Done when: type-checks and contains only public club-facing info.

- **M2-T3 — `events.ts` (seed + types)** ⚑
  - Files: `web/src/data/events.ts`, `web/src/data/events.test.ts`
  - Depends: M0-T4, M0-T8
  - Do: `Event {slug,title,date,year,tag,summary,photos[]}` with the 2023 Akira and China Town Cup entries marked `status:"archived"`; `getUpcoming(now)` / `getArchived()`.
  - Done when: tests prove a past event never appears in `upcoming` and that archives sort newest-first.

- **M2-T4 — `next-meeting.ts`** ⚑
  - Files: `web/src/lib/next-meeting.ts`, `web/src/lib/next-meeting.test.ts`
  - Depends: M2-T1
  - Do: `nextMeeting(now, club) → {date, isToday, doorsAt}`; Europe/Warsaw-safe; skip `schedule.breaks`.
  - Done when: 8 tests pass — Tue / Wed-before-17:00 / Wed-during / Wed-after-20:00 / break-spanning / DST boundary.

- **M2-T5 — `MeetingInfo` shared component** ⚑
  - Files: `web/src/components/shared/MeetingInfo.tsx`
  - Depends: M2-T1, M2-T4
  - Do: renders "najbliższe spotkanie" date, weekly schedule, room, address; used by Home, Contact, Footer.
  - Done when: changing a value in `club.ts` changes it in all three places with no code edit.

- **M2-T6 — `site.ts` (meta & links)**
  - Files: `web/src/data/site.ts`
  - Depends: —
  - Do: canonical domain, default title/description, social URLs, nav items, route paths.
  - Done when: Nav and SEO tasks read their values from here, not literals.

**M2 DoD:** `npm run check` green; grep for `Bernardyńska|sala 14|discord` finds matches only in `src/data/**`.

---

### M3 — Static PL pages

> **US3.1** As an anxious first-timer I get "just show up on Wednesday" answered above the fold.
> **US3.2** As a parent I know children are welcome and what actually happens there.
> **US3.3** As a beginner I can learn the rules in 5 minutes and know exactly what my first visit looks like.
> **US3.4** As a Go player new to Lublin I can find schedule, address, level and Discord in 30 seconds.

Pages contain **dict lookups only** (literal text is replaced by i18n keys from the start), so M6 is a pure JSON job.

**Home**
- **M3-T1 — Hero** — `web/src/components/home/Hero.tsx` · deps M1-T2 · headline, sub, CTAs `[Przyjdź w środę][Poznaj zasady w 5 minut]`, real photo slot. Done when both CTAs act (scroll / navigate).
- **M3-T2 — First-visit reassurance cards** — `web/src/components/home/FirstVisitCards.tsx` · deps M1-T3,M1-T4 · 4 cards (no rules needed / bring nothing / free / kids welcome). Done when 1-col mobile, 2–4 col desktop.
- **M3-T3 — When & where card + map** — `web/src/components/home/MeetingLocationCard.tsx` · deps M2-T5 · schedule, address, entrance hint, OSM embed, external directions link. Done when the map scales with no horizontal overflow.
- **M3-T4 — Latest news preview (temporary)** — `web/src/components/home/LatestNewsPreview.tsx` · deps M1-T3, M2-T3 · 3 newest `events` as cards. Done when data-driven and replaced by M4-T8 without touching `HomePage`.
- **M3-T5 — HomePage assembly** — `web/src/pages/HomePage.tsx` · deps M3-T1..T4 · Done when all sections render in order with no hardcoded facts.

**Start here (`/zacznij`)**
- **M3-T6 — First-visit story timeline (Part B)** — `web/src/components/zacznij/FirstVisitStory.tsx` · 6-step numbered story from §4.3. Done when steps are ordered and readable at 360 px.
- **M3-T7 — Rules: board & stones (step 1)** — `web/src/components/zacznij/RuleStepBoard.tsx` · static diagram + caption. Done when diagram has meaningful `alt` and text matches the edited legacy copy.
- **M3-T8 — Rules: liberties & capture (step 2)** — `web/src/components/zacznij/RuleStepLiberties.tsx` · fix typo `oddechy → oddechu`. Done when terminology is consistent and one self-contained exercise ("Czarny bije — gdzie?") is present with its answer.
- **M3-T9 — Rules: atari (step 3)** — `web/src/components/zacznij/RuleStepAtari.tsx` · exercise + answer, CTA to future interactive board. Done when self-contained and swappable 1:1 later.
- **M3-T10 — Rules: territory, ko & eyes (steps 4–6)** — `web/src/components/zacznij/RuleStepTerritory.tsx` · split legacy text into three short subsections. Done when typo `byc → być` is fixed and each concept has one diagram.
- **M3-T11 — Beginner FAQ + expectation setting (Part C)** — `web/src/components/zacznij/BeginnerFAQ.tsx` · 8 Q/A accordion + "Nie musisz być szachistą…" block. Done when keyboard-operable and answers cover equipment/age/solo/cost/finding room 14.
- **M3-T12 — ZacznijPage assembly** — `web/src/pages/ZacznijPage.tsx` · deps M3-T6..T11 · plus "want more?" links (OGS learn) and closing CTA. Done when the page ends with "przyjdź w środę".

**About / Contact / other**
- **M3-T13 — AboutPage** — `web/src/pages/AboutPage.tsx` + `web/src/components/about/TypicalMeeting.tsx` · club story, "Jak wygląda typowe spotkanie?" with 2–3 photos, people grid from `people.ts`. Done when people link to OGS profiles.
- **M3-T14 — ContactPage** — `web/src/pages/ContactPage.tsx` · deps M2-T5 · club `mailto:`, Facebook/Messenger + Discord buttons, transit/parking tips, `MeetingInfo`. Done when **no contact form** and no personal data is rendered.
- **M3-T15 — PrivacyNoticePage (`/prywatnosc`)** — `web/src/pages/PrivacyPage.tsx` · admin-login data, cookie-free approach, GDPR contact, photo-consent policy incl. stricter minor rules. Done when linked from the footer.
- **M3-T16 — NotFoundPage** — `web/src/pages/NotFoundPage.tsx` · friendly 404 with schedule line + links. Done when no route falls through to a blank screen.
- **M3-T17 — Page-level `generateMetadata` equivalent (Helmet)** — `web/src/lib/seo.ts` + wiring in each page · deps M0-T4 · per-route title/description/OG placeholder. Done when every route has a unique `<title>` and `description`.

**M3 DoD:** complete PL static site; all ⚑ M3 items resolved; `npm run check` green; mobile QA checklist `docs/qa-m3.md` signed off.

---

### M4 — News feed (read-only, Supabase)

> **US4.1** As a visitor I see recent posts with photos, so I know the club is alive.
> **US4.2** As the club, the 2023 events appear honestly as history so the feed is not empty at launch.

- **M4-T1 — `posts` table migration + public-read RLS**
  - Files: `supabase/migrations/0001_posts.sql`
  - Depends: M0-T6
  - Do: `posts(id uuid pk, title text, body text, tag text check in (spotkanie,turniej,wydarzenie), photos text[], created_at timestamptz, published boolean default true)`; RLS: public `select` where `published`.
  - Done when: an anon query returns rows; an anon insert is rejected.

- **M4-T2 — Storage bucket + RLS**
  - Files: `supabase/migrations/0002_storage.sql`
  - Depends: M4-T1
  - Do: public bucket `news-photos`, 5 MB limit, image MIME allowlist; public read, authenticated-allowlisted insert.
  - Done when: a manually uploaded file opens via its public URL.

- **M4-T3 — Supabase client**
  - Files: `web/src/lib/supabaseClient.ts`
  - Depends: M0-T6, M4-T1
  - Do: singleton client from `VITE_*` env; throw a clear error if env is missing.
  - Done when: a smoke query to `posts` runs without error.

- **M4-T4 — `Post` type + `usePosts` hook**
  - Files: `web/src/lib/posts.ts`, `web/src/lib/posts.test.ts`
  - Depends: M4-T3
  - Do: map DB rows → `Post`; `fetchPosts()` ordered newest-first; test the mapper with a fixed payload.
  - Done when: mapper test passes and descending order is asserted.

- **M4-T5 — `PostCard`**
  - Files: `web/src/components/news/PostCard.tsx`
  - Depends: M1-T3, M1-T4, M1-T5
  - Do: date, tag chip, title, 3–4 sentences, photo thumbnails.
  - Done when: renders correctly with 0, 1 and 4 photos.

- **M4-T6 — Photo lightbox**
  - Files: `web/src/components/news/Lightbox.tsx`
  - Depends: M4-T5
  - Do: click thumbnail → modal, ESC/arrow navigation, focus trap.
  - Done when: closable by keyboard and on mobile tap-outside.

- **M4-T7 — NewsFeedPage (`/aktualnosci`)**
  - Files: `web/src/pages/NewsPage.tsx`
  - Depends: M4-T4, M4-T5, M4-T6
  - Do: loading skeleton, empty state, vertical feed of `PostCard`.
  - Done when: all three states can be observed.

- **M4-T8 — Wire latest 3 posts into Home**
  - Files: `web/src/components/home/LatestNewsPreview.tsx` (replace M3-T4 internals)
  - Depends: M4-T4, M4-T7
  - Done when: Home shows the 3 newest live posts and falls back gracefully when empty.

- **M4-T9 — Seed historical posts**
  - Files: `supabase/seed/seed_posts.sql`
  - Depends: M4-T1, M0-T8
  - Do: insert the 2023 Akira + China Town Cup posts with correct dates and migrated photos.
  - Done when: feed shows both with accurate historical dates.

**M4 DoD:** `/aktualnosci` renders real data from Supabase; the mapper/RLS behaviour is verified.

---

### M5 — Admin publishing

> **US5.1** As an admin I sign in with Google on my phone and am rejected if I'm not allowlisted.
> **US5.2** As an admin I can create, edit and delete a post in under 2 minutes.
> **US5.3** As an admin I can attach several phone photos and they upload compressed.

- **M5-T1 — Enable Google OAuth (Supabase)**
  - Files: `docs/ADMIN_SETUP.md`
  - Depends: M4-T1
  - Do: configure provider + redirect URLs in the Supabase dashboard; document the steps.
  - Done when: a Google sign-in redirect completes and returns a session.

- **M5-T2 — Admin allowlist + write RLS**
  - Files: `supabase/migrations/0003_admin.sql`
  - Depends: M5-T1
  - Do: `admins(email)` table; policies granting insert/update/delete on `posts` and insert on storage only when `auth.jwt()->>'email'` is in `admins`.
  - Done when: a non-admin authenticated user is rejected; an admin succeeds.

- **M5-T3 — Auth context**
  - Files: `web/src/lib/auth.tsx`
  - Depends: M4-T3, M5-T1
  - Do: `AuthProvider` + `useAuth()` exposing `session`, `user`, `signInWithGoogle`, `signOut`; subscribe to auth changes.
  - Done when: session persists across reload.

- **M5-T4 — Protected `/admin` gate**
  - Files: `web/src/components/admin/AdminGate.tsx`, `web/src/pages/AdminPage.tsx`
  - Depends: M5-T3
  - Do: redirect unauthenticated users to a login screen; show "not authorised" for logged-in non-admins.
  - Done when: anonymous → login; non-admin → denied; admin → panel.

- **M5-T5 — Admin post list**
  - Files: `web/src/components/admin/PostList.tsx`
  - Depends: M4-T4, M5-T4
  - Do: title, date, tag, edit/delete actions.
  - Done when: list reflects live data after create/edit/delete.

- **M5-T6 — New post form**
  - Files: `web/src/components/admin/PostForm.tsx`
  - Depends: M5-T4
  - Do: title, body textarea, tag dropdown, date; validation messages; no photo handling yet.
  - Done when: a valid submit reports success (wired in M5-T10).

- **M5-T7 — Edit mode for PostForm**
  - Files: `web/src/components/admin/PostForm.tsx` (extend)
  - Depends: M5-T6, M5-T5
  - Done when: opening a post pre-fills all fields and updates the same row.

- **M5-T8 — Delete confirmation**
  - Files: `web/src/components/admin/ConfirmDialog.tsx`
  - Depends: M5-T5
  - Done when: deletion requires explicit confirmation and refreshes the list.

- **M5-T9 — Image picker + client compression**
  - Files: `web/src/components/admin/ImagePicker.tsx`, `web/src/lib/image.ts`
  - Depends: M5-T6
  - Do: multi-select, previews, `browser-image-compression` to < 1 MB before upload.
  - Done when: a 5 MB phone photo previews and is compressed below 1 MB.

- **M5-T10 — Upload + save**
  - Files: `web/src/lib/posts.ts` (extend), `web/src/components/admin/PostForm.tsx` (extend)
  - Depends: M5-T9, M5-T2
  - Do: upload images to `news-photos`, collect public URLs, insert/update the row.
  - Done when: a published post appears on `/aktualnosci` immediately.

- **M5-T11 — Mobile polish**
  - Files: `web/src/components/admin/PostForm.tsx` (extend), `web/src/components/admin/AdminPage.tsx`
  - Depends: M5-T10
  - Do: large touch targets, sticky save, redirect to the feed after save.
  - Done when: a full post is published from a real phone in < 2 minutes.

**M5 DoD:** allowlisted admin can publish/edit/delete from a phone without a deploy; `docs/qa-m5.md` records the attempt time.

---

### M6 — i18n architecture (PL content only)

> **US6.1** As an exchange student or Ukrainian resident, I can switch to `/en` or `/uk`, and language is not a barrier.

- **M6-T1 — i18next init**
  - Files: `web/src/i18n/config.ts`, `web/src/i18n/locales/pl/common.json`
  - Depends: M1-T9
  - Do: initialise i18next with JSON resources, `fallbackLng:'pl'`, namespaces per page area.
  - Done when: `t('nav.home')` resolves.

- **M6-T2 — Locale-prefixed routes**
  - Files: `web/src/app/router.tsx` (extend), `web/src/lib/locale.ts`
  - Depends: M6-T1
  - Do: `/`, `/pl/*`, `/en/*`, `/uk/*`; unknown locale → PL; keep paths shareable.
  - Done when: `/en/kontakt` and `/kontakt` both render the contact page; `lang` reflects the prefix.

- **M6-T3 — LanguageSwitcher**
  - Files: `web/src/components/layout/LanguageSwitcher.tsx`
  - Depends: M6-T2, M2-T6
  - Do: `PL / EN / УК` control that swaps the URL prefix and preserves the current route.
  - Done when: switching updates the URL and the visible text.

- **M6-T4 — Extract PL strings (repeatable per page)**
  - Files: `web/src/i18n/locales/pl/{home,zacznij,about,contact,news,common}.json`
  - Depends: M6-T1, M3
  - Do: move all literal JSX text into dicts, page by page (one file per session).
  - Done when: `grep` finds no Polish sentence literals in components/pages.

- **M6-T5 — `html lang` + locale meta**
  - Files: `web/src/lib/seo.ts` (extend), `web/src/components/layout/AppLayout.tsx`
  - Depends: M6-T2
  - Done when: `<html lang>` matches the active locale and `hreflang` alternates are emitted.

- **M6-T6 — EN skeleton + coverage test**
  - Files: `web/src/i18n/locales/en/*.json`, `web/src/i18n/i18n.test.ts`
  - Depends: M6-T4
  - Do: create EN files (may be machine-drafted, human-reviewed later); test fails if any PL key is missing in EN/UK.
  - Done when: coverage test enforces key-tree parity across locales.

**M6 DoD:** architecture complete and enforced; **EN/UK content quality is deferred to Tier B** (§7).

---

### M7 — SEO, redirects, accessibility, launch

> **US7.1** As the club we want the site to look deliberate, load fast, and survive being forgotten for six months.
> **US7.2** As a returning visitor or search engine, old links never dead-end.

- **M7-T1 — Legacy URL redirects** ⚑
  - Files: `web/vercel.json` (extend)
  - Do: `301` for `/zasady.html → /zacznij`, `/kontakt.html → /kontakt`, `/wydarzenia.html → /aktualnosci`, `/galeria.html → /aktualnosci`, `/index.html → /`.
  - Done when: each old URL redirects and lands on the new page.

- **M7-T2 — Sitemap + robots**
  - Files: `web/scripts/gen-sitemap.mjs`, `web/public/robots.txt`
  - Depends: M6-T2, M7-T1
  - Done when: `sitemap.xml` lists all locales/routes and is fetchable in production.

- **M7-T3 — OG share card** ⚑
  - Files: `web/public/og.png`, `web/src/lib/seo.ts` (extend)
  - Depends: M3-T17
  - Done when: pasting the homepage URL into a chatbot/social preview shows title + image, not a grey box.

- **M7-T4 — Accessibility pass**
  - Files: `docs/qa-m7.md`
  - Do: skip-link, focus rings, contrast AA, alt texts, keyboard-operable FAQ/menu/lightbox.
  - Done when: checklist fully ticked and no axe violations on the five pages.

- **M7-T5 — Runbook**
  - Files: `docs/runbook.md`
  - Do: how to add a post, change the schedule, deploy (push → Vercel). Aimed at the 2028 admin.
  - Done when: a non-author can follow it to publish a test post.

- **M7-T6 — Governance & ownership**
  - Files: `docs/GOVERNANCE.md`
  - Do: access inventory (domain/DNS, hosting, GitHub, Supabase, club email — **≥ 2 named holders each**), succession note, content-ownership table with **no empty cells at launch**.
  - Done when: document is complete and reviewed.

- **M7-T7 — Real photos + consent** ⚑
  - Files: `web/public/img/**`
  - Do: replace placeholders with consented club photos; default to crowd/hands-and-boards where consent is unclear.
  - Done when: every photo has a recorded consent status.

- **M7-T8 — Perf pass**
  - Files: `docs/qa-m7.md` (extend)
  - Do: optimise/compress photos, record Lighthouse mobile/desktop scores.
  - Done when: mobile Lighthouse ≥ 90 (performance + accessibility) recorded.

- **M7-T9 — Final gate & production deploy**
  - Files: `docs/qa-m7.md` (extend)
  - Depends: all
  - Done when: `npm run check` green, QA docs signed, production deploy to `lubelski-klub-go.vercel.app`, club socials updated.

**M7 DoD:** launched on the canonical domain, redirects live, privacy/consent/governance in place.

---

## 4. Traceability — Tier A requirement → tasks

| Tier A requirement (concept §6) | Tasks |
|---|---|
| 1. Homepage with hero, CTA, when/where + map | M3-T1..T5 |
| 2. First-visit explanation (story + FAQ + expectations) | M3-T6, M3-T11, M3-T12 |
| 3. Accurate meeting info, single source of truth | M2-T1, M2-T4, M2-T5 |
| 4. Real photography | M1-T5, M3-T13, M7-T7 |
| 5. Recent news feed + simple publishing | M4 (all), M5 (all) |
| 6. Improved rules with polished static diagrams | M3-T7..T10 |
| 7. About page + "typical meeting" | M3-T13 |
| 8. Contact page (email + socials, no form) | M3-T14 |
| 9. Mobile-first UX + sticky CTA | M1-T6, M1-T8, M5-T11 |
| 10. Old URL redirects | M7-T1 |
| 11. Accessibility & privacy basics | M3-T15, M7-T4 |
| 12. i18n-ready architecture | M6 (all) |
| 13. Basic SEO (titles, descriptions, sitemap) | M3-T17, M7-T2, M7-T3 |

| Verified audit finding | Tasks |
|---|---|
| Dead Discord invite on 4/5 pages | M2-T1 |
| Raw personal phone + Gmails public | M2-T1, M2-T2, M3-T14 |
| Meeting block duplicated | M2-T5 |
| 2023 events shown in present tense | M2-T3, M4-T9 |
| Insider phrasing "Galeria na górze" | M1-T3 (entrance hint), M3-T3 |
| Identical titles / no OG | M3-T17, M7-T3 |
| Rules wall-of-text | M3-T7..T11 |
| Shouty "DARMOWE !!!" | M1-T4, M3-T2 |
| Typos `bezpośednie`, `oddechy`, `byc` | M3-T8, M3-T10 |

---

## 5. Sequencing & effort

```
M0 → M1 → M2 → M3 → M4 → M5
                      ↘ M6 (after M3 pages exist)
                           ↘ M7 (last, needs everything)
```

- **~70 subtasks**, each ≈ one 20–60 min local-LLM session; a human reviews and commits per task.
- A solo developer with local LLMs: roughly **6–9 focused weekends** for all of Tier A.
- **Cut line is legal at any milestone:** M0–M3 alone already ship a better-than-today site; M4+M5 add proof-of-life and publishing.
- **Parallelisable:** M4/M5 (Supabase) can proceed alongside M3 (pages) by a second session with no shared files.
- M0-T8 must precede any M3 copy task.

---

## 6. Explicit non-goals (v1)

Forums · member accounts · club ladder · newsletter · file-upload contact form · live OGS/KGS widgets · post scheduling/drafts · RSS · dark mode · structured data · `LocalBusiness`/`Event` JSON-LD.

---

## 7. Deferred — Tier B / C

- **Tier B (v1.x):** reviewed EN/UK content, upcoming-events box editable in admin, richer OG per post, lightbox galleries, post drafts/scheduling, RSS, structured data, dark mode.
- **Tier C (v2+):** interactive Go board (swaps the static rule diagrams 1:1), tsumego problem of the week, reminders (Messenger/Discord), club ladder, "where else to play" page, GoLessons materials, contact form (only if the club email proves insufficient).

---

## 8. Assumptions & open items (resolve before/with the PR)

1. **Domain:** `lubelski-klub-go.pl` is canonical; who controls DNS? (feeds M7-T6)
2. **Photos & consent:** consent exists for member/minor photos? (feeds M7-T7, M3-T13)
3. **Admin users:** how many, and which Google accounts? (feeds M5-T1/T2)
4. **Club email:** does an alias exist, or must one be created? (feeds M2-T1)
5. **Translation reviewers:** named EN/UK reviewers for Tier B.
6. **Facebook:** site feed replaces FB posting, or mirror? (recommendation: post on site, share link on FB)
7. **Access inventory:** two named holders per system; where the succession note lives. (feeds M7-T6)
