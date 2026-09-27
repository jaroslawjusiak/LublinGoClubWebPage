# Recovery and remaining work

**Baseline:** `main` at `5de3dfafffbe9d01f267b216348f9a4952836403`, reviewed 2026-09-27.  
**Purpose:** turn the current scaffold into the Tier A club website.  
**Product authority:** [WEBSITE_REBUILD_PLAN.md](WEBSITE_REBUILD_PLAN.md); [ULTIMATE_IMPLEMENTATION_PLAN.md](ULTIMATE_IMPLEMENTATION_PLAN.md) supplies the detailed task definitions. [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) is a snapshot, not a substitute for checking code and acceptance criteria.

The target is a welcoming front door: a newcomer on a phone can discover that the club is free and beginner-friendly, find the Wednesday 17:00–20:00 meeting at MDK nr 2, ul. Bernardyńska 14a, room 14, get directions, and know what happens on a first visit. Two or three approved volunteers should eventually be able to publish a short post with phone photos in under two minutes. Keep the maintenance budget near 15 minutes a week.

## Part 1 — Repair the work already started

The existing React/TypeScript/Vite/Tailwind foundation is usable. `npm run check` passed on the baseline (14 tests, lint, typecheck, build), but it does not exercise the essential visitor flows. Four temporary review checks for meeting time on Home, a mounted mobile menu, an actionable news link, and a deliberate unknown-route page all failed. The review checks were removed after the audit; they are not committed tests. Passing the existing check command therefore does **not** mean a page is complete.

Work in the order below. Complete and review each visitor-facing slice before beginning another. Do not mark a task done because its component exists; verify that it is mounted, has real content, and works in a browser at phone and desktop widths.

### R1. Reconcile facts and establish one source of truth

**Current state:** `src/data/club.ts` contains a placeholder phone and email, a canonical domain that differs from the rebuild document, an unverified entrance instruction, a shortened/incorrect venue expansion, and social URLs that differ from the old live site. The meeting facts are stored but are not shown where newcomers need them.

- Compare the old live pages with club organizers' approved current facts. In particular verify the official venue name, the entrance/room hint, the club contact address, canonical domain, Facebook/Discord/OGS destinations, and whether any additional social accounts are real. The old website is historical evidence, **not** proof that all links and contact details still work.
- Remove invented or placeholder public contact information until a real club channel is approved. Do not replace it with a personal phone or Gmail address as the primary channel.
- Keep schedule, venue, room, map/directions link, contact, and social links in typed data; make Home, Contact, and Footer read the same values. Do not hardcode an English weekday inside Polish prose.
- Preserve or copy the old pages, logo, rules diagrams, and event assets under `reference/legacy-site/` for editorial migration; do not serve that directory. Record asset provenance and photo-consent status before publishing photographs of people.

**Done when:** a maintainer can change a meeting fact once and see the same correct result everywhere; the publicly shown facts and destinations have been checked by a club organizer. Unknowns remain explicit rather than guessed.

### R2. Repair the shell, navigation, and route behavior

**Current state:** `src/components/MobileMenu.tsx` exists but is not rendered by `Header.tsx`. The main nav disappears on small screens. `src/components/AppLayout.tsx` and `Layout.tsx` duplicate an unused layout. The `PL` chip does not change language. `src/App.tsx` has five routes, no friendly fallback, privacy route, admin route, or locale-prefixed routes.

- Mount and verify the mobile navigation, with keyboard operation, close-on-navigation, correct hidden/focus behavior, and an unobstructed mobile meeting CTA. Reuse one layout and remove unused duplicate implementations.
- Add a deliberate not-found page. Introduce the `/prywatnosc` and `/admin` route shells when their content/workflows are ready; never advertise unfinished pages as complete.
- Settle the planned locale convention: Polish at `/`, later reviewed translations at `/en/...` and `/uk/...`. Keep route locale, translations, navigation, and `<html lang>` synchronized. Do not present the static `PL` badge as an operational switcher.
- Consolidate `src/locales/**` and `src/i18n/locales/**` into one resource tree. Move literal user-facing strings into the chosen translation structure where they need localization; Polish-only content may remain until approved translations exist.

**Done when:** a newcomer can navigate every finished public page at 320–430px and desktop widths; keyboard users can use the menu; an unknown URL has a useful destination; language URLs behave consistently without inventing untranslated content.

### R3. Finish the already-started public pages around the first visit

**Current state:** Home shows a generic hero and a news preview but no meeting section, map, real photo, or direct directions CTA. Its “Sprawdź najbliższe spotkanie” button goes to `/zacznij`. `/zacznij` has three generic cards instead of the promised arrival story and FAQ. `/o-klubie` and `/kontakt` are placeholders.

- Make Home answer **what, who, when, where, and how to come**. Put accurate Wednesday details, free entry, beginner/solo/family reassurance, a directions link, and a clear meeting CTA on the page. Prefer a real consented club photo; use a non-identifying board/hands photo if consent is unresolved.
- Make the meeting CTA lead directly to the meeting section or directions; keep a separate route to learning the rules. Share the meeting/location component with Contact. Use a map link/embed that works without an API key.
- Replace `/zacznij` cards with the six-step first-visit story and a concise accessible FAQ: rules, equipment, cost, children, arriving alone, and finding room 14. Its rules/diagrams are separate new content in Part 2.
- Replace About and Contact placeholders with approved club story, typical-meeting description, public organizers/OGS links where approved, club contact channel, social links, and directions. Do not fabricate biographies or events.

**Done when:** a first-time visitor on a phone can decide to attend and open directions without searching through the site; the practical facts are accurate and consistent on Home and Contact. Check the actual browser, not just unit tests.

### R4. Make news honest and consistent

**Current state:** Home reads `src/lib/news/repository.ts` and displays an empty state if Supabase is unconfigured; `/aktualnosci` renders invented 2026 posts with missing images. `NewsPostCard` shows a non-clickable “Czytaj dalej”, while another unused card links to an unimplemented detail route. The “view all” button on the news page does nothing.

- Use one typed news model, one repository, and one card/feed implementation for both Home preview and `/aktualnosci`. Remove fictional posts and controls with no action; show publication dates, especially for historical content.
- Choose **one** post-reading flow: full post content in the feed, or a real `/aktualnosci/:id` page. A detail route is required only if a card promises it. Render 0–4 images and optional links in the chosen flow with keyboard/touch-accessible controls and meaningful image alternatives where appropriate.
- Define one concrete database row shape before adding the migration. Replace silent fallbacks such as empty IDs/dates and several speculative column aliases with validated mapping. Treat missing configuration distinctly from a legitimate empty published feed during development/deployment.
- Keep intentional loading, empty, and error states. Verify that Home and the feed show the same newest-first posts; add meaningful tests for ordering and the shared behavior.

**Done when:** no visitor sees invented club activity or a decorative link/button; a published post appears consistently on Home and in the feed. Dynamic persistence and historical seed records are completed in Part 2.

### R5. Restore reliable delivery discipline

**Current state:** `docs/ARCHITECTURE.md` incorrectly places the application under `web/` and describes a reference directory that does not exist. `web/AGENTS.md` is orphaned; the app lives at repository root. Tests cover primitives and mapping but not the visitor journey. The status checklist already recognizes much of this drift.

- Update the architecture report to match the actual root-level app, or explicitly decide and document a move before further implementation. Move/adapt agent instructions to the repository root and write a short setup README. Remove stale references and dead files only after verifying they are unused.
- Keep `npm run check` green. Add a small set of acceptance-level checks for the failure modes above: meeting time and directions on Home, working mobile navigation, route fallback, live news link/feed consistency, and a change to shared facts appearing in Home and Contact.
- After each UI slice, inspect at 320–430px and desktop widths, use keyboard navigation, follow CTAs, and review real text/links. Record what was actually checked. A green build is one gate, not a replacement for a product review.
- Update [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) after verified milestones. Treat its mentions of pagination and a separate news detail route as optional implementation choices, not new launch requirements. The rebuild concept and Tier A success criteria decide scope.

**Done when:** a new contributor can identify the active app, run it, follow accurate instructions, and distinguish completed behavior from scaffolding.

## Part 2 — Tier A work not yet implemented

These are the remaining deliverables from the rebuild plan. Start dependent work only when its preceding slice is usable. Revisit this list after Part 1, because finishing a page may naturally complete some items here.

| Order | Work | Completion evidence |
| --- | --- | --- |
| N1 | **Migrate the existing Go rules.** Copy and edit the old `zasady.html` explanation and diagrams; cover board, liberties, capture/atari, territory, ko, eyes, and life/death in short readable steps. Fix known typos and fact-check the explanation. Keep the static diagrams; an interactive board is deferred. | `/zacznij` teaches the game clearly with correct, accessible diagrams and a Wednesday invitation. |
| N2 | **Approve and publish real content.** Gather consented photos, a truthful club story and organizer information, historical 2023 Akira/China Town Cup material with correct dates, a usable club-level contact channel, and the location image/hint if available. Do not present archive items as recent activity. | No launch-critical placeholder, fictional post, broken image, or unapproved photo of an identifiable person remains. |
| N3 | **Create persistent news and security rules.** Add repeatable Supabase migrations for posts, an admin allowlist, row-level security, and image storage policies. Anonymous visitors may read published posts; only approved admins may mutate posts or upload/delete photos. Seed the verified historical posts. | A clean setup can be reproduced; anonymous and non-admin writes fail; approved admin writes and public published reads succeed. These outcomes are checked against the database/storage policies, not just hidden UI controls. |
| N4 | **Build the minimal phone publishing workflow.** Configure approved Google sign-in/redirects, admin access states, and one mobile-friendly create/edit/delete flow with title, short text, date, optional tag/link, up to four compressed photos, preview, validation, and cleanup for failed uploads or deletions. | An approved volunteer completes sign-in → create with phone photos → public verification → edit → public verification → delete → disappearance in under two minutes after login; an unapproved user cannot publish. |
| N5 | **Add privacy, accessibility, and search basics.** Publish an accurate privacy notice and photo-consent policy (including minors and withdrawal), review landmarks/heading structure/keyboard/focus/contrast/reduced motion, add unique page titles/descriptions/canonical and language metadata, valid favicon, `robots.txt`, and a sitemap of public routes. | Public pages and admin controls pass a manual keyboard/mobile check; policies describe actual processing; public pages have appropriate metadata and working sitemap/robots endpoints. |
| N6 | **Preserve links and prepare deployment.** Configure permanent redirects from `/index.html`, `/zasady.html`, `/kontakt.html`, `/wydarzenia.html`, and `/galeria.html`; configure Vercel SPA deep-link fallback, environment variables, and preview behavior. Keep the old site live until the new preview passes acceptance. | Direct deep links and every old URL resolve to their intended finished page on a deployed preview, without redirect loops. |
| N7 | **Document ownership and launch.** Add admin setup/runbook, rollback procedure, named maintainers for meeting facts/news/content, and a two-person access/succession inventory for domain, hosting, GitHub, Supabase, club email, and admin. Run newcomer, first-visit, admin, and regression acceptance checks with a human club representative. | A different volunteer can publish and maintain the site from the runbook, the owner signs off the facts/content and workflows, and the production smoke test passes. |

**Decisions needing club input before their dependent tasks:** confirm canonical domain and DNS control; official club email and social links; exact venue/entrance wording; photo rights (especially minors); which Google accounts may administer posts; who reviews EN/UK translations and owns the content; and the second access holder for each system. Work on unrelated slices can proceed while these are resolved. Never fill a missing answer with invented public facts.

**Scope discipline:** the Tier A plan permits Polish-only content at launch if the architecture can later serve reviewed EN/UK pages. Do not block launch on full translations. Interactive Go board, newsletter, ranking, contact form, complex gallery, analytics, and general CMS features remain deferred. The launch gate is the newcomer and volunteer publishing journeys above, not the number of components or passing unit tests alone.
