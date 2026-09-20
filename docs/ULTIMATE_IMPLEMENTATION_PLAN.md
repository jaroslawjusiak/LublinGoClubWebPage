# Lubelski Klub Go — Ultimate Implementation Plan

**Version:** 1.0  
**Scope:** Tier A launch only  
**Audience:** Human maintainer working with a local LLM  
**Primary source:** `docs/WEBSITE_REBUILD_PLAN.md`  
**Combines:** the operational and product guidance from the OA plan with the atomic, testable execution structure from the DS plan.

---

## 0. How to use this document

This is a dependency-ordered implementation plan, not a prompt to paste into an LLM in one pass.

The implementing LLM must execute **one task at a time**:

1. Read this plan's task and its prerequisites.
2. Inspect the current repository before changing anything.
3. Read only the files named by the task plus the relevant project instructions.
4. Make the smallest change that satisfies the task.
5. Run the task's validation commands.
6. Inspect the result in the browser when the task changes UI.
7. Report changed files, checks performed, and any unresolved issue.
8. Do not start the next task until the current task's Definition of Done is satisfied.

A task is allowed to adapt to the existing repository, but it must not silently change the architecture. If the repository already contains working infrastructure, preserve it unless this plan explicitly replaces it.

### Local-LLM rules

- One focused task per session.
- Do not implement Tier B/C features opportunistically.
- Do not introduce a dependency unless the task explicitly requires it.
- Do not hardcode meeting facts, social URLs, contact details, or route metadata in page components.
- Do not put literal user-facing UI strings in reusable components; use translation keys.
- Do not use a client-only authorization check as the security boundary.
- Do not store production content in a deployed serverless filesystem.
- Do not rewrite unrelated files or perform broad refactors.
- Every milestone ends with a human QA pass.

### Standard task format

Every task below has:

- **Purpose** — why it exists.
- **Files** — expected files to create or modify.
- **Depends on** — prerequisites.
- **Implementation** — what to do and how.
- **Done when** — observable acceptance criteria.
- **Validation** — commands or manual checks.

If a task needs more than approximately three files or 150 lines of new code, split it before implementation.

---

## 1. Product boundary and success criteria

The website is the club's **front door**, not its community platform. Its job is to answer four questions quickly:

1. What is this? A friendly Go club in Lublin.
2. Can I join? Yes; it is free, beginners are welcome, and visitors may come alone.
3. Where and when? Wednesday, 17:00–20:00, MDK nr 2, room 14, with usable directions.
4. Is the club alive? Yes; the site has recent posts and authentic photography.

### Tier A launch must include

- Home page with hero, CTA, meeting information, map and latest news.
- `/zacznij` Start Here page with beginner expectations, FAQ, first-visit story and polished static Go rules.
- `/o-klubie` About page with club story, people and typical meeting.
- `/kontakt` Contact page with club contact channels, meeting information and directions.
- `/aktualnosci` public news feed.
- Minimal protected admin publishing workflow usable from a phone.
- One source of truth for meeting and club configuration.
- Real, consented photography.
- Mobile-first responsive UX and accessible semantic markup.
- Old URL redirects.
- Privacy notice and photo-consent policy.
- i18n-ready architecture; Polish may launch first.
- Basic SEO, sitemap and robots rules.
- Access inventory, succession note and content ownership documentation.

### Tier A success test

A first-time visitor on a phone should be able to understand the club, confirm that they can come alone without knowing Go, find Wednesday's location, and reach a contact or directions link without searching the site.

The admin acceptance test is:

```text
Sign in
→ create a post
→ select up to four phone photos
→ publish
→ verify it appears publicly
→ edit it
→ verify the change
→ delete it
→ verify it disappears
```

---

## 2. Locked architecture decisions

These decisions are intentionally locked so the LLM does not make a different architectural choice halfway through the project.

| Concern | Decision | Reason |
|---|---|---|
| Frontend | React + TypeScript + Vite | Simple, familiar, easy to deploy as a static frontend |
| Routing | `react-router-dom` | Explicit route table and locale-prefixed routes |
| Styling | Tailwind CSS plus a small token layer | Fast local-LLM implementation without losing visual consistency |
| Public data | Typed files in `src/data/` | Meeting/configuration data remains versioned and easy to review |
| News database | Supabase Postgres | Persistent, free-tier-compatible publishing without code deploys |
| Authentication | Supabase Auth with Google OAuth | No password reset burden for volunteers |
| Authorization | Supabase `admins` table plus Postgres RLS | Enforced at the data layer, not merely in the UI |
| Image storage | Supabase Storage | Persistent image URLs and access policies in the same platform |
| Map | OpenStreetMap embed or link | Avoids API keys and unnecessary tracking |
| Hosting | Vercel free tier | Static deployment, preview URLs and redirect support |
| i18n | `i18next` + `react-i18next` | Locale resources and fallback behavior are explicit |
| SEO | `react-helmet-async`, generated sitemap and robots | Appropriate for a Vite SPA with basic metadata requirements |
| Tests | Vitest, Testing Library, accessibility checks where practical | Fast feedback for a local LLM |
| Formatting | ESLint + Prettier | Deterministic checks after every task |

### Route convention

Use Polish as the default canonical route and language:

```text
/                 Polish home
/aktualnosci      Polish news
/zacznij          Polish Start Here
/o-klubie        Polish About
/kontakt          Polish Contact

/en/...           English routes
/uk/...           Ukrainian routes
```

`/pl/...` is optional, but if implemented it must redirect or resolve consistently. Do not support multiple competing route conventions without a clear reason.

### Repository layout

Adapt this layout to the existing repository after the inspection task:

```text
LublinGoClubWebPage/
├─ docs/
│  ├─ WEBSITE_REBUILD_PLAN.md
│  ├─ ULTIMATE_IMPLEMENTATION_PLAN.md
│  ├─ ADMIN_SETUP.md
│  ├─ GOVERNANCE.md
│  └─ qa-*.md
├─ reference/legacy-site/       # read-only copy of old HTML/assets
└─ web/                         # Vercel project root
   ├─ src/
   │  ├─ app/
   │  ├─ components/
   │  ├─ pages/
   │  ├─ data/
   │  ├─ features/
   │  ├─ i18n/
   │  ├─ lib/
   │  ├─ types/
   │  └─ styles/
   ├─ public/
   ├─ supabase/migrations/
   ├─ scripts/
   └─ AGENTS.md
```

---

## 3. Milestone 0 — inspect and establish the baseline

### M0-T1 — Inspect the repository

**Purpose:** avoid replacing working infrastructure based on assumptions.

**Files:** `docs/ARCHITECTURE.md`  
**Depends on:** none

**Implementation:** inspect package manager, framework, React/TypeScript versions, routes, styling, assets, tests, deployment config and legacy pages. Record what will be retained, changed or added. Do not implement product features yet.

**Done when:** `docs/ARCHITECTURE.md` accurately describes the starting repository and confirms whether the application will live in `web/` or the repository root.

**Validation:** run the existing install, test, build and lint commands if available.

### M0-T2 — Scaffold or normalize the React application

**Files:** application package files and entry point  
**Depends on:** M0-T1

**Implementation:** create or normalize a React + TypeScript + Vite app only if one does not already exist. Remove demo boilerplate without deleting useful project assets.

**Done when:** development server renders a clean shell and production build succeeds.

**Validation:** `npm run dev`, `npm run build`.

### M0-T3 — Establish quality tooling

**Files:** package scripts, ESLint, Prettier, Vitest and test configuration  
**Depends on:** M0-T2

**Implementation:** provide `typecheck`, `lint`, `test`, `build` and `check` scripts. `check` must run the non-interactive type, lint, test and build gates.

**Done when:** `npm run check` succeeds on the baseline app and one demonstration test runs.

### M0-T4 — Add project instructions for future LLM sessions

**Files:** `web/AGENTS.md` or repository-level `AGENTS.md`, README  
**Depends on:** M0-T3

**Implementation:** document directory map, commands, architecture decisions, task execution rules, forbidden scope and how to report completed work.

**Done when:** a new LLM session can implement a later task using the instructions and the task itself without reading the entire repository.

### M0-T5 — Vendor the legacy site for reference

**Files:** `reference/legacy-site/**`  
**Depends on:** M0-T1

**Implementation:** copy old HTML, images and relevant assets into a read-only reference directory. Preserve original files; do not serve this directory publicly.

**Done when:** legacy `index.html`, `zasady.html`, `kontakt.html`, `wydarzenia.html`, `galeria.html` if present, logo and photos can be inspected locally.

---

## 4. Milestone 1 — content, configuration and design foundation

### M1-T1 — Define domain types

**Files:** `src/types/club.ts`, `src/types/news.ts` and tests if appropriate  
**Depends on:** M0-T2

**Implementation:** define small types for `MeetingInfo`, `ClubConfig`, `Person`, `NewsPost`, `NewsImage`, `PostTag` and `Locale`. Do not model members, comments or a general CMS.

**Done when:** types express all Tier A data without optional fields that have no implementation purpose.

### M1-T2 — Create the single source of truth

**Files:** `src/data/club.ts`, `src/data/site.ts`, `src/data/people.ts`, tests  
**Depends on:** M1-T1

**Implementation:** store meeting day/time, venue, address, room, entrance hint, map link/embed, free-entry status, club email, social links, canonical domain and public navigation metadata. Do not store personal phone numbers or personal Gmail addresses as the primary contact channel.

**Done when:** Home, Contact and Footer can consume this data without duplicating facts. Tests reject accidental personal phone/Gmail fields if practical.

### M1-T3 — Define design tokens

**Files:** Tailwind config and global stylesheet  
**Depends on:** M0-T2

**Implementation:** define paper/background, ink, muted text, borders and one warm kaya/goban accent. Add typography scale, focus styles, responsive container and reduced-motion behavior. Keep the aesthetic calm, spacious and readable rather than decorative.

**Done when:** a test/demo component renders token colors and typography at mobile and desktop widths.

### M1-T4 — Build shared UI primitives

**Files:** `Container`, `Section`, `Button`, `Card`, `Chip`, `SmartImage`  
**Depends on:** M1-T3

**Implementation:** use small typed components. `SmartImage` requires `alt`, supports lazy loading and prevents layout shift. `Button` supports links and buttons with visible focus states.

**Done when:** primitives are reusable, keyboard-visible and have no page-specific club facts.

### M1-T5 — Build application shell

**Files:** `Header`, `MobileMenu`, `Footer`, `AppLayout`, mobile CTA  
**Depends on:** M1-T2, M1-T4

**Implementation:** add navigation to the five public pages, external club links, language-switcher slot and a mobile sticky “Przyjdź w środę” CTA. Ensure the CTA does not cover content.

**Done when:** navigation works by keyboard, mobile menu opens/closes, and the CTA remains usable at 320–430px widths.

---

## 5. Milestone 2 — routing, i18n foundation and public pages

### M2-T1 — Configure routes and not-found behavior

**Files:** router and route-level page files  
**Depends on:** M1-T5

**Implementation:** define `/`, `/aktualnosci`, `/zacznij`, `/o-klubie`, `/kontakt`, `/admin`, `/prywatnosc` and a friendly not-found route. Add the locale route wrapper without duplicating page implementations.

**Done when:** every public route renders a deliberate page and unknown routes do not show a blank screen.

### M2-T2 — Configure i18n architecture

**Files:** `src/i18n/config.ts`, locale resources and locale utility  
**Depends on:** M2-T1

**Implementation:** configure `pl` as fallback/default and create namespaces for common UI, home, start, about, contact and news. Use Polish content initially; create parity-tested EN/UK resource skeletons where content is not yet reviewed.

**Done when:** route locale, translation language and `<html lang>` agree. Missing keys fall back safely to Polish.

### M2-T3 — Implement Home hero and first-visit reassurance

**Files:** Home feature components  
**Depends on:** M1-T2, M1-T4, M2-T1

**Implementation:** add a real-photo slot, clear Polish value proposition, CTA to meeting information, CTA to `/zacznij`, and four reassurance cards: beginners welcome, nothing required, free entry, children/families welcome.

**Done when:** the four newcomer questions are answered above or near the fold and both CTAs work on mobile.

### M2-T4 — Implement meeting/location section

**Files:** shared meeting component and Home page  
**Depends on:** M1-T2, M2-T3

**Implementation:** render Wednesday 17:00–20:00, MDK nr 2, Bernardyńska 14a, room 14, entrance hint, map embed/link and directions CTA from `club.ts`. Prefer OpenStreetMap and a plain external directions link.

**Done when:** the location is legible, copyable, responsive and never duplicated as hardcoded page text.

### M2-T5 — Implement Start Here first-visit story and FAQ

**Files:** Start Here feature components  
**Depends on:** M1-T4, M2-T2

**Implementation:** add a numbered story covering entrance, finding room 14, identifying oneself as a first-time visitor, receiving an introduction, playing a first game and staying as long as desired. Add accessible FAQ covering knowledge, equipment, age, coming alone, cost and finding the room.

**Done when:** content is readable at 320px, FAQ is keyboard-operable and the page ends with a Wednesday CTA.

### M2-T6 — Migrate and polish static rules content

**Files:** rules content components and static diagrams  
**Depends on:** M0-T5, M1-T4, M2-T2

**Implementation:** migrate the pedagogical sequence from `zasady.html`: board, liberties, capture, atari, territory, ko, eyes and life/death. Fix known Polish errors, split wall-of-text sections, preserve correct explanations, and use meaningful image alt text. Use static diagrams in Tier A; keep components easy to replace with an interactive board later.

**Done when:** the rules page is complete, factually reviewed, typo-corrected, accessible and does not require game logic.

### M2-T7 — Implement About page

**Files:** About page and components  
**Depends on:** M1-T2, M1-T4

**Implementation:** add a concise club story, values, typical meeting description, consented real photos and public organizer/people information with OGS links where available.

**Done when:** the page communicates what a normal meeting feels like without inventing facts or exposing personal contact data.

### M2-T8 — Implement Contact and privacy pages

**Files:** Contact, Privacy and photo-policy content  
**Depends on:** M1-T2, M2-T4

**Implementation:** Contact contains club email, Facebook/Messenger, Discord/OGS links, directions and shared meeting information. Do not add a contact form in Tier A. Privacy explains actual processing only. Photo policy covers consent, minors, recording, withdrawal and uncertain cases.

**Done when:** footer links to privacy, Contact has no raw personal phone/Gmail primary channel, and policy claims match the actual application.

### M2-T9 — Public-pages milestone gate

**Files:** `docs/qa-public-pages.md`  
**Depends on:** M2-T3 through M2-T8

**Implementation:** record mobile and desktop checks, keyboard navigation, image alt review, content accuracy, map behavior and route checks.

**Done when:** a human approves the public site before dynamic news work begins.

---

## 6. Milestone 3 — news domain and public feed

### M3-T1 — Define the news repository contract

**Files:** `src/lib/news/repository.ts`, types and tests  
**Depends on:** M1-T1

**Implementation:** define `listPublished`, optional `getById`, and a mapping boundary so components do not know whether data comes from seed files or Supabase.

**Done when:** repository consumers operate on typed `NewsPost` objects only.

### M3-T2 — Build seed data and migration format

**Files:** seed data or migration preparation  
**Depends on:** M3-T1, M0-T5

**Implementation:** prepare historically accurate China Town Cup and Akira Hello World posts with dates, tags, short summaries and migrated photos. Mark them as archived/history, not upcoming activity.

**Done when:** historical dates are accurate and seed records can be inserted into the final repository without manual rewriting.

### M3-T3 — Build PostCard and simple image viewing

**Files:** news card, thumbnail/gallery component  
**Depends on:** M1-T4, M3-T1

**Implementation:** render date, optional tag, title, body, up to four photos and optional external link. Use a simple accessible image viewer only; advanced gallery features remain deferred.

**Done when:** 0, 1 and 4-image posts render without layout overflow and controls work with keyboard and touch.

### M3-T4 — Build public news feed and Home preview

**Files:** News page and Home latest-news component  
**Depends on:** M3-T1, M3-T3

**Implementation:** render newest-first feed with loading, empty and error states. Home shows the three newest posts and links to the complete feed.

**Done when:** the feed has deliberate states and historical posts are clearly dated.

### M3-T5 — News milestone gate

**Files:** `docs/qa-news.md`  
**Depends on:** M3-T2 through M3-T4

**Implementation:** verify date ordering, empty state, broken image behavior, alt text, mobile layout and Home/feed consistency.

**Done when:** a human approves the public feed before persistence and admin work.

---

## 7. Milestone 4 — Supabase persistence, storage and security

### M4-T1 — Create the posts migration

**Files:** `supabase/migrations/0001_posts.sql`  
**Depends on:** M3-T1

**Implementation:** create a minimal `posts` table containing UUID, title, body, tag constraint, image references, published date, optional external URL, `published` flag and timestamps. Add indexes for published date and published status.

**Done when:** migration runs cleanly and the schema matches the TypeScript model.

### M4-T2 — Create the admins table and RLS policies

**Files:** `supabase/migrations/0002_admins_and_rls.sql`, security tests/docs  
**Depends on:** M4-T1

**Implementation:** create an `admins` table linked to Supabase identities. Add policies so anonymous users can read only published posts, while only allowlisted admins can insert, update and delete posts. Do not trust a client-provided admin flag.

**Done when:** anonymous insert/update/delete fails; authenticated non-admin mutation fails; allowlisted admin mutation succeeds.

### M4-T3 — Create the image bucket and storage policies

**Files:** `supabase/migrations/0003_storage.sql`, `docs/ADMIN_SETUP.md`  
**Depends on:** M4-T2

**Implementation:** create a news image bucket with image MIME allowlist and size limit. Permit public reads only where intended and uploads/deletes only for allowlisted admins. Store references in posts, never image binaries.

**Done when:** a valid image can be uploaded by an admin, read publicly, and removed according to policy; unauthorized upload is rejected.

### M4-T4 — Add Supabase client and repository implementation

**Files:** client, repository implementation, environment typing  
**Depends on:** M4-T1, M4-T2

**Implementation:** add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.example`. Fail clearly when required environment variables are absent. Map database rows into `NewsPost`; do not leak service-role keys into the browser.

**Done when:** public feed reads published posts and repository tests verify mapping and descending order.

### M4-T5 — Seed migrated posts

**Files:** `supabase/seed/seed_posts.sql` or documented import script  
**Depends on:** M4-T4, M3-T2

**Implementation:** insert the two historical posts and their image references. Preserve dates and historical wording.

**Done when:** a clean Supabase project can be populated repeatably and the public feed displays both posts.

---

## 8. Milestone 5 — protected mobile admin workflow

### M5-T1 — Configure Supabase Google OAuth

**Files:** `docs/ADMIN_SETUP.md`, auth configuration  
**Depends on:** M4-T2

**Implementation:** document provider setup, redirect URLs for local/preview/production environments and the identities of the intended administrators. No public registration workflow is needed.

**Done when:** an approved Google identity can complete login and return to `/admin`.

### M5-T2 — Build auth context and protected gate

**Files:** auth provider, admin gate, login state  
**Depends on:** M5-T1, M4-T4

**Implementation:** expose session, user, sign-in and sign-out. Anonymous users see login; authenticated non-admins see a clear denial; admins see the panel. Treat this as UX only; RLS remains the real security boundary.

**Done when:** anonymous, non-admin and admin behavior is verified after reload and direct URL access.

### M5-T3 — Build admin post list

**Files:** admin list page/components  
**Depends on:** M5-T2, M4-T4

**Implementation:** show title, date, tag, published state and edit/delete actions. Avoid dashboards, analytics, media libraries, role management and general CMS settings.

**Done when:** list reflects live data and is usable at 320–430px widths.

### M5-T4 — Build post form and validation

**Files:** post form, validation schema and tests  
**Depends on:** M5-T3

**Implementation:** fields are title, short text, date defaulting to today, optional tag, optional link and photos. Use a textarea rather than a rich-text editor. Display concise mobile validation errors.

**Done when:** invalid submissions are blocked and valid metadata can be submitted without a page reload.

### M5-T5 — Build mobile image picker and compression

**Files:** image picker, image utility and tests  
**Depends on:** M5-T4, M4-T3

**Implementation:** support selecting several phone photos, previews, removal, type/size validation, resizing and compression before upload. Keep the total workflow simple.

**Done when:** a large phone photo previews, compresses below the configured limit and can be uploaded without freezing the UI.

### M5-T6 — Wire create, edit, delete and cleanup

**Files:** repository mutations, form, confirmation dialog and storage cleanup  
**Depends on:** M5-T4, M5-T5, M4-T3

**Implementation:** create a post, upload images, save references, edit the same form, confirm deletion, and remove or mark associated storage files according to the storage policy. Handle partial upload failures without publishing a broken post.

**Done when:** create/edit/delete works for an admin, unauthorized mutations fail, and no uncontrolled orphaned images are created in the normal flow.

### M5-T7 — Verify the two-minute publishing workflow

**Files:** `docs/qa-admin.md`  
**Depends on:** M5-T6

**Implementation:** test on real or emulated phone widths using the complete login/create/photos/publish/edit/delete flow. Record timing, blockers and any follow-up fixes.

**Done when:** an ordinary approved admin can publish a short post with photos without a code deploy in under two minutes after login.

---

## 9. Milestone 6 — accessibility, SEO and legacy compatibility

### M6-T1 — Accessibility pass

**Files:** affected components and `docs/qa-accessibility.md`  
**Depends on:** M2-T9, M3-T5, M5-T7

**Implementation:** verify semantic landmarks, heading hierarchy, keyboard navigation, focus states, accessible FAQ/menu/image controls, meaningful alt text, contrast and reduced motion. Use automated checks where available, followed by manual keyboard testing.

**Done when:** no known critical accessibility issue remains on the five public pages and admin controls are keyboard usable.

### M6-T2 — Metadata and social sharing basics

**Files:** SEO utility and page metadata  
**Depends on:** M2-T1, M3-T4

**Implementation:** provide unique Polish titles/descriptions, canonical URLs, language metadata and a default social image. Do not add structured data unless explicitly promoted into scope.

**Done when:** every public route has deliberate metadata and no admin route is promoted as public content.

### M6-T3 — Generate sitemap and robots

**Files:** sitemap script, `public/robots.txt`, deployment config  
**Depends on:** M6-T2

**Implementation:** include public canonical routes only; exclude `/admin` and private paths. Use the production domain configuration.

**Done when:** generated sitemap is valid and accessible after build.

### M6-T4 — Add legacy redirects

**Files:** `vercel.json` or equivalent hosting configuration  
**Depends on:** M2-T1

**Implementation:** configure permanent redirects:

```text
/index.html       → /
/zasady.html      → /zacznij
/kontakt.html     → /kontakt
/wydarzenia.html  → /aktualnosci
/galeria.html     → /aktualnosci
```

Verify query strings and avoid redirect loops.

**Done when:** each old URL returns the intended redirect and final page.

---

## 10. Milestone 7 — content, governance and deployment

### M7-T1 — Replace placeholders with approved assets

**Files:** public image assets and content data  
**Depends on:** M2-T3 through M2-T8

**Implementation:** use real, consented club photography. Where consent is unclear, use hands, boards or non-identifying crowd views. Record consent status outside public page copy.

**Done when:** no important launch section depends on an obviously fake placeholder and every published person-identifying image has a recorded consent status.

### M7-T2 — Create governance documentation

**Files:** `docs/GOVERNANCE.md`  
**Depends on:** M5-T1

**Implementation:** record at least two named holders for domain/DNS, hosting, GitHub, Supabase, club email and admin access. Add succession instructions and a content ownership table with no empty launch-critical cells.

**Done when:** another volunteer can identify who owns each system and how to take it over.

### M7-T3 — Create runbook and admin guide

**Files:** `docs/ADMIN_SETUP.md`, `docs/RUNBOOK.md`  
**Depends on:** M5-T7, M6-T4

**Implementation:** document publishing a post, removing a post/photo, changing meeting information, updating social links, local development, deployment, environment variables and rollback/ownership contacts.

**Done when:** a non-author can publish a test post by following the guide.

### M7-T4 — Production configuration and preview deployment

**Files:** Vercel config, environment documentation and deployment scripts  
**Depends on:** all previous milestones

**Implementation:** configure Vercel root directory, build command, output directory, SPA fallback, redirects and environment variables. Never commit secrets or Supabase service-role keys.

**Done when:** preview deployment supports deep links, locale routes, public feed and admin redirect behavior.

### M7-T5 — Launch acceptance test

**Files:** `docs/qa-launch.md`  
**Depends on:** M7-T1 through M7-T4

**Implementation:** run four simulations:

1. **New visitor:** identify club, confirm free entry, find Wednesday/location, open directions.
2. **First visit:** understand what to expect, whether equipment/rules are needed and how to find room 14.
3. **Admin:** complete create/edit/delete with phone photos.
4. **Regression:** check all legacy redirects, five public routes, mobile navigation, privacy page and metadata.

**Done when:** all critical scenarios pass on the deployed preview and a human signs the checklist.

### M7-T6 — Production launch and smoke test

**Files:** launch checklist and documentation  
**Depends on:** M7-T5

**Implementation:** deploy production, verify canonical domain, test a public post read, test admin login without exposing credentials, verify redirects, and update club social links with the new site.

**Done when:** production smoke tests pass and two responsible people know how to maintain the deployment.

---

## 11. Traceability matrix

| Master requirement | Tasks |
|---|---|
| Homepage, CTA, meeting/location/map | M1-T2, M2-T3, M2-T4 |
| First-visit story and FAQ | M2-T5 |
| Improved static Go rules | M2-T6 |
| About and typical meeting | M2-T7 |
| Contact without Tier A form | M2-T8 |
| Single source of truth | M1-T2, M2-T4 |
| Recent news feed | M3-T1 through M3-T5, M4-T5 |
| Mobile admin publishing | M5-T1 through M5-T7 |
| Real photography and consent | M2-T7, M7-T1 |
| Accessibility | M1-T4, M1-T5, M6-T1 |
| Privacy and photo policy | M2-T8, M7-T2 |
| i18n-ready architecture | M2-T2 |
| SEO and sitemap | M6-T2, M6-T3 |
| Legacy redirects | M6-T4 |
| Governance and continuity | M7-T2, M7-T3 |
| Deployment and launch verification | M7-T4 through M7-T6 |

---

## 12. Explicit non-goals and deferrals

Do not implement these in Tier A:

- interactive Go board;
- problem of the week;
- newsletter;
- automated Messenger/Discord reminders;
- club ladder or rankings;
- member accounts;
- forums or comments;
- contact form;
- post scheduling or drafts;
- RSS;
- advanced gallery/lightbox system;
- full EN/UK translation without human review;
- dark mode unless it is genuinely free and does not delay launch;
- LocalBusiness/Event structured data unless separately approved;
- analytics beyond a privacy-compatible, explicitly approved solution;
- general-purpose CMS settings or role-management UI.

---

## 13. Known risks and mitigations

| Risk | Mitigation |
|---|---|
| CMS work delays launch | Finish public pages and seed read-only feed before admin work |
| Local LLM changes architecture | Lock decisions in this document and `AGENTS.md` |
| Unauthorized admin mutation | Enforce Supabase RLS and test anonymous/non-admin mutations |
| Persistent storage mistake | Never write production content to JSON or deployed filesystem |
| Photo/privacy issue | Require recorded consent and default to non-identifying images |
| Stale meeting information | Keep all facts in `club.ts` and test shared rendering |
| Scope expansion | Treat Tier B/C list as a hard boundary |
| Volunteer departure | Maintain two-person access inventory and succession note |
| Translation quality problem | Ship architecture first; require human EN/UK reviewers |
| Deployment route failures | Test deep links and redirects on the actual preview domain |

---

## 14. Recommended implementation order

```text
M0 Foundation and repository inspection
  ↓
M1 Data/configuration/design system
  ↓
M2 Public pages and i18n architecture
  ↓
M3 Read-only news feed and historical seed content
  ↓
M4 Supabase schema, storage and security
  ↓
M5 Mobile admin publishing
  ↓
M6 Accessibility, SEO and redirects
  ↓
M7 Governance, deployment and launch acceptance
```

A useful early checkpoint is after M3: the project should already be a valuable static website with accurate meeting information, rules, contact details and a populated historical feed even if the admin system is not finished.

The final implementation must be judged not by how many features exist, but by whether the club can keep the site accurate and alive with approximately 15 minutes of volunteer work per week.
