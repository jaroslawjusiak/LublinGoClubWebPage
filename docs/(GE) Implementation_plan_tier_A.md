Here is a comprehensive, production-ready implementation plan for the Lubelski Klub Go website rebuild.

Architectural & Technology Stack Decisions
Framework: React 18+ with Vite (Single Page Application with client-side routing using react-router-dom).

Styling: Tailwind CSS (for low-overhead, utility-first responsive layout and design token management).

i18n: react-i18next with JSON translation files and language-prefixed routing (/, /en, /uk).

Backend & CMS: Supabase (Free Tier) — provides PostgreSQL database, built-in Auth (Google OAuth/Magic Link for designated admins), and Blob Storage for news photos.

Hosting: Vercel / Netlify (Free Tier) with automatic SPA fallback/redirects (_redirects or vercel.json).

Implementation Plan: Lubelski Klub Go Rebuild (Tier A)
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 MILESTONE MAP (TIER A)                                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ MS1: Project Setup & Core Design System                                               │
│ └── MS2: Public Static Pages & Content (PL)                                            │
│     └── MS3: i18n Architecture & Content Frame                                        │
│         └── MS4: News Feed & Supabase Admin CMS                                        │
│             └── MS5: SEO, Redirects, Legal & Launch Preparation                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
Milestone 1: Project Setup & Core Design System
Epic 1.1: Environment & Tooling Initialisation
User Story: As a developer, I want a bootstrapped React environment with Tailwind CSS and routing so that I can construct UI components efficiently.

Subtask 1.1.1: Bootstrap Vite React App
Action: Initialise Vite project with React + TypeScript template. Clean default boilerplate files.

Acceptance Criteria: npm run dev serves clean starter page without console errors.

Subtask 1.1.2: Tailwind CSS Setup & Theme Tokens
Action: Install and configure Tailwind CSS (tailwind.config.js). Define custom theme tokens matching Go aesthetics:

Primary background: #F8F9FA / #FFFFFF

Text primary: #1A1A1A (Go black stone accent)

Text secondary: #555555

Primary Accent: #D4A359 / #C28E3A (Kaya wood/goban warm amber tone)

Acceptance Criteria: Custom color classes like bg-goban-amber and text-stone-black resolve in a test component.

Subtask 1.1.3: React Router Setup
Action: Install react-router-dom. Define initial router shell with root layout (<Layout/>).

Acceptance Criteria: Navigating to / renders root placeholder; unmapped paths redirect to 404 page.

Epic 1.2: Core UI Components & Responsive Layout Frame
User Story: As a visitor, I want a clear navigation bar and footer across all pages so that I can easily move through the site on desktop or mobile.

Subtask 1.2.1: Header & Navigation Component
Action: Create <Header/> with brand logo placeholder, desktop navigation links (Home, Aktualności, Zacznij tutaj, O klubie, Kontakt), and mobile hamburger toggle state.

Acceptance Criteria: Mobile menu opens/closes cleanly; desktop links render horizontally.

Subtask 1.2.2: Footer Component
Action: Create <Footer/> component with quick links, social media icons (Facebook, Discord, OGS group, Polish Go Association link), and club email display.

Acceptance Criteria: Links render with target="_blank" rel="noopener noreferrer" for external platforms.

Subtask 1.2.3: Mobile Sticky CTA Bar
Action: Build <StickyMobileCTA/> component visible only on small screens (md:hidden) at bottom viewport position containing a button "Przyjdź w środę" that links to /kontakt#dojazd or scrolls to schedule on home.

Acceptance Criteria: Button stays fixed at bottom on mobile viewports and remains clickable above page content.

Milestone 2: Public Static Pages & Content (Polish Primary)
Epic 2.1: Home Page (/)
User Story: As a first-time visitor, I want to immediately see what the club is, when it meets, and where it is located so that I know I can join.

Subtask 2.1.1: Hero Section Component
Action: Build <HeroSection/> with high-contrast headline "Zagraj w Go w Lublinie — pierwsze spotkanie za darmo, zawsze w środę", background/side real photo, and two primary action buttons: "Przyjdź w środę" (scrolls to location block) and "Poznaj zasady w 5 minut" (links to /zacznij).

Acceptance Criteria: Clicking CTA buttons triggers smooth scroll or navigation.

Subtask 2.1.2: First Visit Reassurance Cards
Action: Build <FirstVisitCards/> grid displaying 4 key cards:

Nie znasz zasad? Nauczymy Cię w 15 minut.

Nic nie musisz przynosić.

Wstęp wolny.

Dzieci i rodziny mile widziane.

Acceptance Criteria: Responsive 1-column layout on mobile, 2 or 4 columns on desktop.

Subtask 2.1.3: Meeting Location & Interactive Map Card
Action: Build <MeetingLocationCard/> displaying schedule ("Środa 17:00–20:00"), exact address ("MDK nr 2, ul. Bernardyńska 14a, sala 14"), entrance hints, and an embedded OpenStreetMap/Google Maps iframe with link to external directions.

Acceptance Criteria: Address text is easy to copy; map iframe scales responsively without horizontal overflow.

Epic 2.2: "Start Here" Page (/zacznij)
User Story: As a beginner, I want a simplified rule overview and a step-by-step description of my first visit so that I feel comfortable attending.

Subtask 2.2.1: First Visit Story Sequence (Part B)
Action: Build <FirstVisitStory/> component rendering a 6-step visual timeline:

Wejdź do MDK nr 2.

Znajdź salę 14 (galeria na górze).

Powiedz, że jesteś pierwszy raz.

Ktoś z klubu wytłumaczy Ci podstawy.

Zagrasz pierwszą partię na małej planszy.

Zostań, jak długo chcesz.

Acceptance Criteria: Clear step numbering with responsive card/timeline layout.

Subtask 2.2.2: Beginner FAQ & Expectation Setting Component (Part C)
Action: Build <BeginnerFAQ/> accordion/list addressing common anxieties (equipment, age limits, solo attendance) and explicit positive framing ("Nie musisz być szachistą...").

Acceptance Criteria: Questions toggle smoothly or present cleanly as formatted Q&A blocks.

Subtask 2.2.3: Rules Overview Section (Part A - Step 1: Board & Stones)
Action: Create <RuleStep1Board/> rendering explanation of grid, intersections, and black/white turns with high-resolution static SVG/PNG diagram.

Acceptance Criteria: Content matches edited text from old zasady.html; diagram contains accessible alt text.

Subtask 2.2.4: Rules Overview Section (Part A - Step 2: Liberties & Capture)
Action: Create <RuleStep2Captures/> explaining liberties ("oddechy"), capturing mechanism, and Atari with static diagrams.

Acceptance Criteria: Correct Japanese/Polish terminology used without typos (oddechu instead of oddechy).

Subtask 2.2.5: Rules Overview Section (Part A - Step 3: Territory, Ko & Life/Death)
Action: Create <RuleStep3Territory/> explaining territory scoring, the Ko rule, and basic eyes/life-and-death concept with static diagrams and self-contained exercise questions.

Acceptance Criteria: Clear distinction between territory and captures; external practice links (e.g., OGS Learn) included.

Epic 2.3: About Page (/o-klubie) & Contact Page (/kontakt)
User Story: As a visitor, I want to read about the club's background and contact organizers via official channels so that I can ask specific questions.

Subtask 2.3.1: Club History & Typical Meeting Component
Action: Build <AboutClub/> page section with club backstory, connection to MDK nr 2, and "Jak wygląda typowe spotkanie?" with real photos.

Acceptance Criteria: Page loads photos efficiently with responsive image tags.

Subtask 2.3.2: Organizers & Regulars Section
Action: Build <ClubMembersList/> rendering organizer bios, ranks, and OGS nicknames.

Acceptance Criteria: Displays OGS nicknames with direct profile links ([https://online-go.com/player/](https://online-go.com/player/)...).

Subtask 2.3.3: Contact Channels Component (/kontakt)
Action: Build <ContactPage/> displaying primary club email (mailto: link), prominent Facebook/Messenger button, Discord invite link, and transit/parking directions.

Acceptance Criteria: No complex contact form present (per Tier A decision); direct links functional.

Milestone 3: i18n Architecture & Multilingual Frame
Epic 3.1: i18n Setup & Language Routing
User Story: As an international student or Ukrainian resident, I want to view the website in English or Ukrainian so that language is not a barrier.

Subtask 3.1.1: react-i18next Configuration
Action: Install i18next and react-i18next. Create translation resource dictionary structure (/src/locales/pl.json, en.json, uk.json).

Acceptance Criteria: Fallback language set to pl; translation keys resolve successfully in UI components.

Subtask 3.1.2: Language Switcher & URL Router Sync
Action: Build <LanguageSwitcher/> component in header (PL / EN / УК). Configure route wrapper to sync locale with path prefix (/, /en, /uk).

Acceptance Criteria: Switching language updates URL path and updates static text instantly.

Subtask 3.1.3: English & Ukrainian Translation Dictionary Files
Action: Populate en.json and uk.json with translated UI keys for navigation, CTA buttons, schedule, home hero, and contact info. Include explicit Ukrainian welcoming line ("Запрошуємо українців — мова не є бар'єром у Go").

Acceptance Criteria: Static UI elements translate correctly when switching to /en or /uk.

Milestone 4: News Feed & Supabase Admin CMS
Epic 4.1: Supabase Backend Integration
User Story: As a developer, I want a light backend for storing posts and hosting photos so that administrators can post updates without code deployments.

Subtask 4.1.1: Supabase Project & Table Schema
Action: Create Supabase project. Define SQL schema for posts table:

id (uuid, primary key)

title (text)

content (text)

image_urls (text array / JSON)

tag (enum/text: spotkanie, turniej, wydarzenie)

created_at (timestamp with timezone)

Acceptance Criteria: Table created with public read access policy enabled.

Subtask 4.1.2: Supabase Storage Bucket Setup
Action: Create a public Supabase Storage bucket named news-photos with image file-type restriction (max 5MB). Create RLS policies allowing public reads and authenticated inserts.

Acceptance Criteria: Public image URL generated by bucket opens correctly in browser.

Subtask 4.1.3: Client Supabase Connection Initialization
Action: Install @supabase/supabase-js. Create /src/lib/supabaseClient.ts initialized with environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).

Acceptance Criteria: Client successfully queries posts table without throw errors.

Epic 4.2: Public News Feed (/aktualnosci)
User Story: As a visitor, I want to see recent news posts with photos so that I know the club is active.

Subtask 4.2.1: News Feed Fetching Component
Action: Build <NewsFeed/> page component querying posts table ordered by created_at descending.

Acceptance Criteria: Renders loading skeleton, empty state message, or vertical feed of post cards.

Subtask 4.2.2: Post Card & Lightbox/Gallery Component
Action: Build <PostCard/> component displaying date, tag badge, title, text paragraphs, and image thumbnails. Add simple modal lightbox when clicking photos.

Acceptance Criteria: Images expand on click; post layout behaves responsively on mobile.

Subtask 4.2.3: Historical Posts Data Migration
Action: Insert historical seed posts (2023 China Town Cup, Akira festival) into Supabase database to ensure feed is populated on launch.

Acceptance Criteria: Historical posts visible at bottom of news feed with correct dates.

Epic 4.3: Admin Auth & Post Creation Panel (/admin)
User Story: As a club administrator, I want to log in via Google/Magic Link on my phone and publish a short post with photos in under 2 minutes.

Subtask 4.3.1: Admin Authentication Gate
Action: Build <AdminLogin/> page supporting Supabase Auth (Google OAuth or Magic Link) restricted to an allowlist of admin email addresses.

Acceptance Criteria: Unauthenticated users reaching /admin are prompted to log in; unauthorized emails are rejected.

Subtask 4.3.2: Mobile-Friendly Post Form Component
Action: Build <CreatePostForm/> inside /admin with fields: Title, Content, Tag dropdown, File input (multi-photo selector).

Acceptance Criteria: Form fields function smoothly on touch/mobile screens.

Subtask 4.3.3: Image Compression & Upload Handler
Action: Implement client-side image compression (using browser-image-resizer or Canvas API) before uploading to Supabase Storage news-photos bucket.

Acceptance Criteria: Uploaded images are compressed under 1MB and return valid storage URLs.

Subtask 4.3.4: Post Submission & List Management Component
Action: Wire form submit to insert row into posts table. Display list of existing posts below form with "Edit" and "Delete" actions.

Acceptance Criteria: Creating a post immediately updates public /aktualnosci feed.

Milestone 5: SEO, Redirects, Legal & Launch Preparation
Epic 5.1: Legacy Redirects & Meta Information
User Story: As a returning user or search engine, I want old links to redirect to new pages so that no dead ends exist.

Subtask 5.1.1: Hosting Routing & Legacy HTML Redirect Rules
Action: Configure vercel.json or _redirects file with HTTP 301 redirects:

/zasady.html → /zacznij

/kontakt.html → /kontakt

/wydarzenia.html → /aktualnosci

/galeria.html → /aktualnosci

/index.html → /

Acceptance Criteria: Visiting https://domain/zasady.html returns 301 and lands on /zacznij.

Subtask 5.1.2: SEO Meta Tags & Dynamic Head Management
Action: Integrate react-helmet-async. Configure meta title, description, canonical link, and language attributes targeted at search keywords ("go klub Lublin", "nauka go Lublin").

Acceptance Criteria: Page <title> and <meta name="description"> update correctly per route.

Subtask 5.1.3: Sitemap & robots.txt Generation
Action: Create public /sitemap.xml and /robots.txt referencing core routes (/, /aktualnosci, /zacznij, /o-klubie, /kontakt).

Acceptance Criteria: Search engine crawlers can fetch /sitemap.xml without errors.

Epic 5.2: Privacy, Policy & Operational Governance
User Story: As a user, I want to view privacy details and photo consent policies so that my data rights are protected.

Subtask 5.2.1: Privacy Notice & Consent Policy Page (/prywatnosc)
Action: Build static <PrivacyPolicy/> page outlining cookie-free privacy approach, GDPR contact point, and photo publication consent rules (stricter rules for minors / parental consent).

Acceptance Criteria: Footer links to Privacy Policy page; content covers GDPR compliance for admin logins and photos.

Subtask 5.2.2: Access Inventory & Succession Documentation
Action: Create GOVERNANCE.md file in repository documenting:

Named holders for domain/DNS, hosting account, GitHub repo, Supabase project, and club email.

Content ownership table.

Succession instructions for taking over accounts.

Acceptance Criteria: File exists in repository root with no empty access rows.