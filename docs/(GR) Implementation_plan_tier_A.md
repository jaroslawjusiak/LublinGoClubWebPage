Implementation Plan: Lubelski Klub Go Website (React, Tier A only)
Tech stack recommendation (Tier A)

Frontend: React 18 + TypeScript + Vite
Routing: React Router v6 (with i18n-ready path structure /, /en/..., /uk/...)
Styling: Tailwind CSS (mobile-first, black/white + one accent)
i18n: react-i18next (architecture ready; PL content ships first)
CMS / News: Simple JSON/Markdown files in repo or lightweight headless (e.g. Contentlayer / local MDX) for v1; admin panel as a protected React route that writes to the same source (or uses a free backend like Supabase/Firebase with allowlist)
Auth for admin: Google OAuth (or GitHub) with hard-coded allowlist of 2–5 emails (simplest safe option for non-technical users)
Images: Local /public or Cloudflare R2 / Vercel Blob with automatic resize on upload
Map: OpenStreetMap + Leaflet (no API key) or Google Maps embed
Hosting: Vercel (free tier)
SEO: react-helmet-async + sitemap generation
Redirects: Vercel vercel.json for old .html URLs

All decisions stay inside the 15-min/week maintenance budget and free-tier constraints.

Milestone 1: Project foundation & design system
Goal: Runnable React app with routing, i18n skeleton, design tokens, and mobile-first layout shell.

Duration estimate: 3–5 days (thin tasks)
User Story 1.1 – As a developer I can start the project and see a working shell.

Subtask 1.1.1: Create Vite + React + TypeScript project
Subtask 1.1.2: Install and configure Tailwind CSS
Subtask 1.1.3: Install React Router v6 and create basic route skeleton (/, /aktualnosci, /zacznij, /o-klubie, /kontakt, /admin)
Subtask 1.1.4: Add language-prefixed routes (/en/..., /uk/...) that currently fall back to PL
Subtask 1.1.5: Set up react-i18next with PL namespace only

User Story 1.2 – As a visitor I see a consistent visual language on every page.

Subtask 1.2.1: Define color tokens (black, white, one warm accent e.g. kaya amber)
Subtask 1.2.2: Define typography scale (clean sans, generous sizes)
Subtask 1.2.3: Create Layout component (header + footer + main)
Subtask 1.2.4: Implement sticky “Przyjdź w środę” CTA for mobile
Subtask 1.2.5: Add language switcher (PL / EN / УК) that changes URL prefix

User Story 1.3 – As a developer I have reusable UI primitives.

Subtask 1.3.1: Button component (primary / secondary)
Subtask 1.3.2: Card component
Subtask 1.3.3: Section heading + container components
Subtask 1.3.4: Image component with required alt and lazy loading


Milestone 2: Static public pages (content-first)
Goal: All five public pages render with real PL content, real photos placeholders, map, and CTAs. No admin yet.
User Story 2.1 – Homepage answers the four core questions.

Subtask 2.1.1: Hero section (photo, headline, two buttons)
Subtask 2.1.2: “Twoja pierwsza wizyta” 3–4 cards
Subtask 2.1.3: Latest-news placeholder (hard-coded 3 cards for now)
Subtask 2.1.4: When & where block + embedded map + entrance photo note
Subtask 2.1.5: Footer with social links (Facebook, Discord, OGS, Polish Go Association)

User Story 2.2 – /zacznij reduces first-visit anxiety.

Subtask 2.2.1: Part A – static rules steps (1–6) with polished diagrams (images + captions)
Subtask 2.2.2: Part B – numbered “Co się stanie kiedy przyjdę” story
Subtask 2.2.3: Part C – first-visit FAQ + positive expectation-setting text
Subtask 2.2.4: CTA at the bottom of the page

User Story 2.3 – /o-klubie shows the club is real.

Subtask 2.3.1: Short club story section
Subtask 2.3.2: “Jak wygląda typowe spotkanie” with 2–3 photo placeholders
Subtask 2.3.3: People bios placeholders (name + OGS nick + short text)

User Story 2.4 – /kontakt gives clear contact paths.

Subtask 2.4.1: Club email (mailto:) + Facebook / Discord / Messenger links
Subtask 2.4.2: Contact persons block (names + OGS nicks only)
Subtask 2.4.3: Map + transit / parking hints
Subtask 2.4.4: Meeting time/location (single source of truth component)

User Story 2.5 – Single source of truth for meeting data.

Subtask 2.5.1: Create meetingInfo.ts (day, time, address, room, free, family-friendly)
Subtask 2.5.2: Use the same component on Home and Contact


Milestone 3: News feed (read-only)
Goal: /aktualnosci shows a vertical feed of posts (seeded with 2023 events).
User Story 3.1 – Visitor sees recent club life.

Subtask 3.1.1: Define Post type (id, title, body, date, tag?, photos[])
Subtask 3.1.2: Create seed data file with China Town Cup + Akira posts
Subtask 3.1.3: NewsFeed page that lists posts newest-first as cards
Subtask 3.1.4: PostCard component (title, 3–4 sentences, date, tag, photo thumbnails)
Subtask 3.1.5: Simple lightbox / gallery for photos inside a card (static for now)
Subtask 3.1.6: Show latest 3 posts on Homepage (reuse PostCard)


Milestone 4: Admin panel (minimal publishing)
Goal: 2–3 non-technical members can create / edit / delete a post from a phone in < 2 min.
User Story 4.1 – Admin can sign in safely.

Subtask 4.1.1: Add Google (or GitHub) OAuth provider
Subtask 4.1.2: Hard-coded allowlist of admin emails
Subtask 4.1.3: Protect /admin route; redirect unauthenticated users

User Story 4.2 – Admin sees and manages posts.

Subtask 4.2.1: Admin list view (title, date, edit / delete buttons)
Subtask 4.2.2: “New post” form (title, body textarea, date, optional tag dropdown, photo upload)
Subtask 4.2.3: Edit existing post form (pre-filled)
Subtask 4.2.4: Delete confirmation

User Story 4.3 – Photos are usable on mobile.

Subtask 4.3.1: Image upload component (accept multiple, show previews)
Subtask 4.3.2: Client-side resize / compression before upload
Subtask 4.3.3: Store images and update post data (local JSON or chosen backend)

User Story 4.4 – Publishing works on a phone.

Subtask 4.4.1: Make admin forms fully mobile-friendly (large inputs, sticky save)
Subtask 4.4.2: After save, redirect to the public post or list


Milestone 5: i18n architecture, SEO, redirects, polish
Goal: Site is launch-ready (PL content), i18n-ready, old URLs redirect, basic SEO & accessibility.
User Story 5.1 – Language infrastructure is ready.

Subtask 5.1.1: Extract all static strings into i18n keys
Subtask 5.1.2: Ensure language switcher updates URL and content
Subtask 5.1.3: Add lang attribute and proper <html lang>

User Story 5.2 – Basic SEO works.

Subtask 5.2.1: Per-page titles and meta descriptions
Subtask 5.2.2: Generate sitemap.xml
Subtask 5.2.3: Add Open Graph tags for homepage and posts (minimal)

User Story 5.3 – Old site does not break.

Subtask 5.3.1: Configure Vercel redirects:
/zasady.html → /zacznij
/kontakt.html → /kontakt
/wydarzenia.html → /aktualnosci
/galeria.html → /aktualnosci


User Story 5.4 – Accessibility & privacy basics.

Subtask 5.4.1: Semantic HTML, focus states, contrast check
Subtask 5.4.2: All images have meaningful alt
Subtask 5.4.3: Privacy notice page (what data is processed)
Subtask 5.4.4: Photo-consent policy note (linked from admin and footer)

User Story 5.5 – Final launch checklist.

Subtask 5.5.1: Replace all placeholder photos with real consented photos
Subtask 5.5.2: Fill ownership table and access inventory (document in repo)
Subtask 5.5.3: Test on real mobile devices
Subtask 5.5.4: Deploy to production domain


Explicitly deferred (Tier B / C)

Full EN / UK translations
Interactive Go board
Contact form
Post scheduling / drafts
RSS, richer galleries, structured data, dark mode, club ladder, etc.


Recommended order of work

Milestone 1 (foundation)
Milestone 2 (static pages – highest value for newcomers)
Milestone 3 (news read-only)
Milestone 4 (admin)
Milestone 5 (polish & launch)

Every subtask is intentionally thin (one file or one clear concern) so a local LLM with limited context can implement it in a single focused session.