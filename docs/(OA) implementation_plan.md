Below is an implementation-oriented plan derived from the supplied requirements. I’m treating **React as the primary UI technology** and making the plan deliberately atomic: each task explains the implementation approach, expected artifacts, dependencies, and a concrete definition of done so a local LLM can execute it incrementally.

The source explicitly calls for a Tier A-only implementation plan, with static pages first, then news/admin publishing, then redirects/privacy/launch; Tier B/C should remain deferred. 

# Lubelski Klub Go — Atomic React Implementation Plan

## 0. Implementation contract for the local LLM

This should be treated as the **master implementation plan**, not as a checklist to execute in one pass.

### Execution rule

The implementing LLM should:

1. Execute **one subtask at a time**.
2. Before modifying code, inspect the current repository and identify existing conventions.
3. Never implement future milestones opportunistically.
4. After every subtask:

   * run relevant tests/checks;
   * inspect the resulting UI where applicable;
   * verify that previously completed functionality still works;
   * record what changed.
5. Only proceed when the current subtask's Definition of Done is satisfied.
6. If a requirement is ambiguous, preserve the existing architecture and mark the ambiguity rather than inventing a feature.
7. Keep Tier B and Tier C functionality out of the implementation unless a Tier A dependency genuinely requires a small architectural preparation.

### Product boundary

The website is the **front door**, not the community platform. Its purpose is to answer:

* What is this?
* Can I join?
* Where/when is it?
* Is the club alive?

Every implementation decision should be tested against those questions and the maintenance constraint of approximately **15 minutes/week for 1–2 volunteers**. 

### Required Tier A scope

The implementation must ultimately contain:

* Home
* Start Here
* About
* Contact
* News feed
* Minimal admin publishing
* Accurate meeting information from one source
* Real photography
* Mobile-first UX
* Static Go-rule diagrams
* Old URL redirects
* Accessibility/privacy basics
* i18n-ready architecture
* Basic SEO

These are explicitly Tier A requirements. 

---

# Milestone 0 — Repository and technical baseline

**Goal:** establish a boring, predictable React application before building product features.

## US-0.1 — Establish the application architecture

### Story

> As a developer, I want a clear React application structure so that subsequent features can be implemented independently without creating a tangled codebase.

### Subtasks

#### 0.1.1 — Inspect the existing repository

**Implementation**

* Identify:

  * package manager;
  * existing framework;
  * React version;
  * TypeScript usage;
  * routing;
  * styling approach;
  * existing assets;
  * deployment configuration;
  * current pages;
  * existing tests.
* Do **not** replace technologies merely for preference.
* Reuse working infrastructure where it satisfies requirements.

**Done when**

A short architecture note exists describing the existing stack and what will be retained/replaced.

---

#### 0.1.2 — Establish React application structure

Use a feature-oriented structure rather than putting everything into a single `App` component.

Suggested conceptual structure:

```text
src/
  app/
    router/
    layout/
    providers/
  components/
    ui/
  features/
    home/
    news/
    start/
    about/
    contact/
    admin/
  content/
  config/
  lib/
  styles/
  types/
```

The exact directory names may adapt to the existing project.

**Important:** don't create abstractions merely because they look architecturally elegant. A component should normally exist because it represents a reusable visual or behavioral unit.

---

#### 0.1.3 — Establish TypeScript domain types

Create explicit types for the core domain:

```ts
type MeetingInfo = {
  dayOfWeek: string
  startTime: string
  endTime: string
  venueName: string
  address: string
  room: string
}

type NewsPost = {
  id: string
  title: string
  body: string
  publishedAt: string
  tag?: PostTag
  images: PostImage[]
  externalUrl?: string
}

type PostTag =
  | "spotkanie"
  | "turniej"
  | "wydarzenie"
```

Do not over-model the system yet.

---

# Milestone 1 — Single source of truth for club information

**Goal:** eliminate duplicated meeting information.

The current site duplicates meeting information, creating a maintenance problem. 

## US-1.1 — Centralize meeting configuration

### Subtasks

#### 1.1.1 — Create site configuration

Create a central configuration object containing:

* meeting day;
* opening/meeting time;
* venue;
* address;
* room;
* free-entry status;
* map location;
* social URLs;
* club contact email;
* SEO defaults.

Example:

```ts
export const clubConfig = {
  meeting: {
    day: "Wednesday",
    start: "17:00",
    end: "20:00",
    venue: "MDK nr 2",
    address: "ul. Bernardyńska 14a, Lublin",
    room: "14",
    free: true,
  },
}
```

Use the actual agreed Polish content for production-facing text.

#### 1.1.2 — Prohibit page-local meeting data

Home, Contact and future components must consume `clubConfig.meeting`.

Do not repeat:

```ts
"Wednesday 17:00–20:00"
```

inside multiple components.

#### 1.1.3 — Create reusable meeting component

Create a reusable presentation component:

```text
<MeetingInfo />
```

It should support:

* day/time;
* venue;
* address;
* room;
* free admission;
* CTA to directions.

**Done when**

Changing the meeting configuration changes every occurrence automatically.

---

# Milestone 2 — Global design system and responsive shell

**Goal:** establish the visual language before implementing individual pages.

The requirements call for minimal black/white styling, one warm accent, whitespace, typography-first design and mobile-first behavior. 

## US-2.1 — Build the application shell

### Subtasks

#### 2.1.1 — Define design tokens

Create CSS variables/tokens for:

* background;
* foreground;
* muted text;
* borders;
* accent;
* spacing;
* radius;
* typography sizes;
* content widths;
* shadows where necessary.

Do not introduce a large design framework unless the existing project already uses one.

#### 2.1.2 — Implement global typography

Establish:

* body font;
* heading hierarchy;
* paragraph width;
* line-height;
* mobile font scaling;
* focus styles.

Content should remain readable at normal phone widths.

#### 2.1.3 — Build responsive container

Create a consistent:

```text
PageContainer
```

with:

* mobile padding;
* tablet padding;
* desktop maximum width.

#### 2.1.4 — Build header

Header must contain:

* club identity/logo;
* navigation;
* language-switcher placeholder;
* mobile navigation;
* prominent Wednesday CTA where appropriate.

#### 2.1.5 — Build footer

Footer contains:

* Facebook;
* Discord;
* OGS;
* Polish Go Association;
* copyright/club information;
* privacy link.

#### 2.1.6 — Implement mobile sticky CTA

On mobile, provide persistent:

> Przyjdź w środę

CTA.

It should lead to the meeting/directions section rather than introducing a new workflow.

**Done when**

The application shell works at approximately 320px, 375px, tablet and desktop widths without horizontal scrolling.

---

# Milestone 3 — Routing and page skeleton

**Goal:** establish the five public routes plus admin route.

Required sitemap:

```text
/
 /aktualnosci
 /zacznij
 /o-klubie
 /kontakt
 /admin
```

This flat structure is explicitly required by the source. 

## US-3.1 — Implement routing

### Subtasks

#### 3.1.1 — Add route definitions

Create routes for:

```text
/
 /aktualnosci
 /zacznij
 /o-klubie
 /kontakt
 /admin
```

#### 3.1.2 — Add route-level layouts

Public pages share:

```text
Header
main content
Footer
```

Admin must use a separate layout.

#### 3.1.3 — Implement not-found page

Unknown routes must result in a useful 404.

Do not recreate the old collection of dead pages.

---

# Milestone 4 — Homepage

**Goal:** make the homepage answer the four fundamental newcomer questions immediately.

## US-4.1 — Hero

### Implementation

Create:

```text
Hero
 ├─ real club photograph
 ├─ headline
 ├─ supporting statement
 ├─ "Przyjdź w środę"
 └─ "Poznaj zasady w 5 minut"
```

The required concept is a real club photograph, a clear proposition, and two CTAs. 

### Rules

* Do not use the old poster as the hero.
* Image must have meaningful `alt`.
* CTA 1 scrolls/navigates to meeting information.
* CTA 2 navigates to `/zacznij`.

---

## US-4.2 — First-visit reassurance

Create four compact cards:

1. Don't know the rules? We'll teach you.
2. You don't need to bring anything.
3. Entry is free.
4. Children are welcome.

This directly addresses the anxieties identified in the requirements. 

---

## US-4.3 — Latest news

Create:

```text
LatestNews
```

which loads exactly the newest three posts.

Rules:

* newest first;
* title;
* date;
* short body;
* image;
* link to complete post/feed.

If no posts exist, render a deliberate empty state rather than a broken section.

---

## US-4.4 — Meeting/location section

Render:

* meeting information;
* map;
* directions CTA;
* entrance photograph;
* instruction to find room 14.

The entrance detail is specifically intended to reduce first-visit anxiety. 

---

## US-4.5 — Homepage final CTA

End the homepage with a direct invitation:

```text
Przyjdź w środę
```

It should not end in a generic "Learn more".

---

# Milestone 5 — Start Here page

**Goal:** transform the best existing content—the Go rules explanation—into a beginner journey.

The original rules content is explicitly identified as the site's strongest existing asset. 

## US-5.1 — Rules content model

Represent each lesson as structured content:

```ts
type RuleLesson = {
  id: string
  number: number
  title: string
  explanation: string
  image: string
  alt: string
  exercise?: {
    question: string
    answer: string
  }
}
```

Initial lessons:

1. Plansza i kamienie
2. Oddechy
3. Zbijanie i atari
4. Terytorium
5. Ko
6. Oczy

This preserves the specified pedagogical sequence. 

---

## US-5.2 — Migrate and polish existing rules content

### Implementation

Extract the useful content from `zasady.html`.

While migrating:

* fix the documented typos;
* split long paragraphs;
* preserve the beginner-oriented explanation;
* preserve diagrams;
* give each diagram descriptive alt text;
* turn each section into a self-contained learning unit.

Do **not** rewrite the educational meaning unnecessarily.

---

## US-5.3 — Make diagrams interactive-ready without implementing interaction

This is an important architectural requirement.

The static exercise should look conceptually like:

```text
Question
"Black to capture — where?"

[diagram]

Answer
"Place the stone here..."
```

Later an interactive board can replace the diagram while retaining:

```text
lesson.id
question
answer
```

Do **not** build the interactive Go engine in Tier A.

The requirements explicitly state that launch must not depend on it. 

---

## US-5.4 — Add "Why Go?"

Create a short introductory section covering:

* ancient origins;
* simple rules/deep strategy;
* AlphaGo;
* Hikaru no Go.

Keep it as a hook rather than a history lecture. 

---

## US-5.5 — First visit story

Implement the six-step story:

```text
1. Enter MDK nr 2.
2. Find room 14.
3. Say you're visiting for the first time.
4. Someone explains the basics and finds a partner.
5. Play a first game on a smaller board.
6. Stay as long as you like.
```

This should be visually presented as a journey/timeline, not buried in FAQ text. 

---

## US-5.6 — First-visit FAQ

Create FAQ entries covering:

* Do I need to know Go?
* Do I need to bring anything?
* Is it free?
* What age can participate?
* Can I come alone?
* How do I find room 14?

Use accessible expandable sections if appropriate.

---

## US-5.7 — Expectations section

Explicitly communicate:

* no Go experience required;
* no chess experience required;
* no anime knowledge required;
* no special mathematical ability required;
* tournament play exists, but ordinary meetings are primarily relaxed play and learning.

This prevents an incorrect mental model of the club. 

---

# Milestone 6 — About page

**Goal:** demonstrate that real people meet here.

## US-6.1 — Club story

Create structured content for:

* origin;
* relationship with MDK nr 2;
* who organizes the club.

Do not invent missing facts.

If facts aren't available, use explicit content placeholders for the club to supply.

---

## US-6.2 — People section

Create reusable person cards:

```ts
type Person = {
  name: string
  role?: string
  rank?: string
  ogsNick?: string
  image?: string
  bio?: string
}
```

Only publish photos/bios where consent exists.

---

## US-6.3 — Typical meeting

Create the priority section:

```text
Jak wygląda typowe spotkanie?
```

Include 2–3 genuine photographs showing:

* teaching;
* casual games;
* occasional tournaments.

This section is explicitly identified as priority content. 

---

# Milestone 7 — Contact page

**Goal:** make contacting the club and finding the venue effortless.

## US-7.1 — Club contact

Do **not** build a contact form.

The requirements explicitly reject a v1 form because it introduces spam protection, validation, email delivery, privacy and maintenance overhead. 

Implement:

```text
Masz pytanie? Napisz do nas

[club email]
[Facebook/Messenger]
[Discord]
```

---

## US-7.2 — Meeting/location

Reuse:

```text
<MeetingInfo />
```

rather than recreating meeting data.

---

## US-7.3 — Directions

Provide:

* map;
* address;
* room number;
* transit hints;
* parking information if confirmed.

Do not invent transport information.

---

# Milestone 8 — News domain and public feed

**Goal:** replace the abandoned static events page with a sustainable news mechanism.

The requirements define a post as title + short text + photos + date, optionally a link/tag, displayed newest-first. 

## US-8.1 — Define NewsPost model

Minimum fields:

```ts
type NewsPost = {
  id: string
  title: string
  body: string
  publishedAt: string
  tag?: "spotkanie" | "turniej" | "wydarzenie"
  images: NewsImage[]
  externalUrl?: string
}
```

Keep the schema deliberately small.

---

## US-8.2 — Implement post repository abstraction

Do not let React components know whether posts come from:

* database;
* API;
* static seed;
* future CMS.

Create an interface such as:

```ts
interface NewsRepository {
  listPublished(): Promise<NewsPost[]>
  getById(id: string): Promise<NewsPost | null>
}
```

The actual implementation can initially use the chosen persistence mechanism.

This makes the frontend independent of storage.

---

## US-8.3 — Build news card

A card contains:

* date;
* tag;
* title;
* body;
* photos;
* optional external link.

---

## US-8.4 — Build news feed

Requirements:

* newest first;
* mobile-first;
* image gallery inside each post;
* no separate gallery page.

---

## US-8.5 — Migrate historical posts

Migrate the 2023:

* China Town Cup;
* Akira Hello World

material as historical posts.

The requirements specifically recommend these as seed content. 

Do not present historical posts as recent activity.

---

# Milestone 9 — Persistence and image handling

**Goal:** make publishing possible without requiring developers.

This milestone should be implemented only after the public news model is stable.

## US-9.1 — Choose persistence mechanism

The requirement is **mechanism-neutral**: 2–3 non-technical club members must be able to publish safely from a phone. 

The LLM must evaluate options against:

| Requirement            | Must satisfy |
| ---------------------- | ------------ |
| Free/very low cost     | Yes          |
| Mobile publishing      | Yes          |
| Minimal maintenance    | Yes          |
| Authentication         | Yes          |
| Image storage          | Yes          |
| Editing                | Yes          |
| Deletion               | Yes          |
| Access restricted      | Yes          |
| No public registration | Yes          |

Do not select OAuth merely because the original document mentions it as a candidate.

---

## US-9.2 — Define storage boundary

Separate:

```text
Post metadata
```

from:

```text
Image binary storage
```

A post should store image references/URLs, not large binary data in the post document itself.

---

## US-9.3 — Implement image processing

Upload pipeline:

```text
phone image
   ↓
validate file type
   ↓
validate maximum input size
   ↓
resize
   ↓
compress
   ↓
store optimized image
   ↓
return stable image reference
```

The admin should not need image-editing software.

---

## US-9.4 — Implement safe deletion

Deleting a post must define what happens to its images.

Preferred behavior:

```text
delete post
→ delete/mark associated images
→ update feed
```

Do not leave uncontrolled orphaned uploads if the chosen storage supports cleanup.

---

# Milestone 10 — Authentication and admin access

**Goal:** make publishing restricted and simple.

## US-10.1 — Define admin allowlist

No public registration.

Create an allowlist of approved admin identities.

The source calls for roughly 2–5 admin accounts. 

---

## US-10.2 — Implement authentication

The implementation must:

1. authenticate user;
2. determine identity;
3. verify identity against allowlist;
4. reject everyone else;
5. protect every admin API operation server-side.

**Critical:** hiding `/admin` from navigation is not security.

Authorization must happen on the backend/API/data layer.

---

## US-10.3 — Implement admin shell

Admin has only:

```text
Posts
  [New post]

Existing posts
  Edit
  Delete
```

Do not create:

* dashboards;
* statistics;
* settings;
* media libraries;
* role-management UI;
* CMS abstractions.

---

# Milestone 11 — Two-minute publishing workflow

**Goal:** optimize for the actual volunteer workflow.

The explicit requirement is publishing a post from a phone in under two minutes. 

## US-11.1 — New post form

Fields:

```text
Title
Text
Photos
Date
Tag
Optional link
Publish
```

Defaults should minimize typing.

For example:

* date defaults to today;
* tag is optional;
* photos can be selected directly from phone gallery.

---

## US-11.2 — Image upload UX

The user should be able to:

1. tap upload;
2. select multiple photos;
3. see thumbnails;
4. remove unwanted images;
5. publish.

Avoid multi-page upload workflows.

---

## US-11.3 — Mobile admin UX

Test at approximately:

* 320px;
* 375px;
* 390px;
* 430px.

Buttons should be finger-sized and inputs should not require zooming.

---

## US-11.4 — Edit/delete

Editing should reuse the same form.

Deletion must require a confirmation step.

---

## US-11.5 — End-to-end publishing test

Automated/manual acceptance test:

```text
Login
→ create post
→ select 3 phone-sized photos
→ publish
→ open public news
→ verify post appears
→ edit post
→ verify changes
→ delete post
→ verify disappearance
```

The complete workflow should be practical on mobile.

---

# Milestone 12 — i18n-ready architecture

**Goal:** make translation possible without making translation a launch blocker.

The requirement says architecture must support `/en/...` and `/uk/...`, while Polish can launch first. 

## US-12.1 — Define locale model

Supported locales:

```ts
type Locale = "pl" | "en" | "uk"
```

Default:

```text
pl
```

---

## US-12.2 — Implement locale-aware routing

Conceptually:

```text
/pl/...
/en/...
/uk/...
```

If the desired canonical Polish URLs are unprefixed, use:

```text
/...
/en/...
/uk/...
```

with Polish as default.

The implementation should choose one convention and use it consistently.

---

## US-12.3 — Separate UI strings from components

Do not write reusable UI like:

```tsx
<button>Przyjdź w środę</button>
```

in every component.

Use translation keys:

```tsx
t("cta.comeWednesday")
```

---

## US-12.4 — Keep news language-independent

News posts remain in their original language.

Do not automatically duplicate every post into three languages.

This is explicitly outside sustainable v1 scope. 

---

# Milestone 13 — Privacy and photo governance

**Goal:** satisfy hard launch requirements.

Privacy and photo consent are explicitly hard v1 requirements. 

## US-13.1 — Create privacy notice

Document:

* what data the website processes;
* admin login identities;
* optional analytics;
* GDPR contact point.

Do not claim data processing that the application does not actually perform.

---

## US-13.2 — Define photo consent policy

Create a repository document explaining:

* what consent is required;
* how consent is collected;
* where it is recorded;
* what happens for minors;
* how withdrawal is handled.

For minors, require explicit parental consent.

When consent is uncertain, favor:

* hands;
* boards;
* crowd shots;
* non-identifying photography.

---

## US-13.3 — Connect publishing workflow to consent policy

The admin publishing process should include a lightweight reminder such as:

> Confirm that published photos comply with the club's photo-consent policy.

Do not build a complicated consent management CMS unless required by the club's actual process.

---

# Milestone 14 — Accessibility

**Goal:** make the public site usable by a broad audience.

## US-14.1 — Semantic structure

Verify:

```text
header
nav
main
section
article
footer
```

are used meaningfully.

---

## US-14.2 — Keyboard operation

Verify:

* navigation;
* menus;
* buttons;
* FAQ;
* image controls;
* admin form

are keyboard accessible.

---

## US-14.3 — Images

Every informative image has meaningful alt text.

Decorative images use empty alt text where appropriate.

---

## US-14.4 — Contrast and focus

Verify:

* body text contrast;
* CTA contrast;
* link distinction;
* visible focus indicators.

---

## US-14.5 — Reduced motion

If animations are introduced, honor:

```css
prefers-reduced-motion
```

Avoid animation entirely unless it adds genuine value.

---

# Milestone 15 — SEO and metadata

**Goal:** establish basic search visibility without building an SEO project.

The requirements specifically call for basic titles, descriptions and sitemap in v1. 

## US-15.1 — Page metadata

Every public page gets:

* unique `<title>`;
* meta description;
* canonical URL where appropriate;
* correct language metadata.

---

## US-15.2 — Sitemap

Generate sitemap containing public routes.

Do not expose admin pages.

---

## US-15.3 — Robots

Ensure:

```text
/admin
```

is not intended for search indexing.

Authentication remains the real protection.

---

## US-15.4 — Basic target queries

Metadata/content should naturally support:

* `go klub Lublin`
* `nauka go Lublin`
* `gra go Lublin`
* `weiqi baduk Lublin`

Do not keyword-stuff pages.

---

# Milestone 16 — Legacy URL migration

**Goal:** prevent existing links from becoming dead links.

The old URLs are explicitly a Tier A requirement. 

## US-16.1 — Define redirects

At minimum:

```text
/zasady.html      → /zacznij
/kontakt.html     → /kontakt
/wydarzenia.html  → /aktualnosci
```

Also identify any existing links to:

```text
galeria.html
```

and decide whether they should redirect to `/aktualnosci` or another relevant destination.

---

## US-16.2 — Verify redirect behavior

For each old URL:

1. request old URL;
2. verify redirect status;
3. verify final destination;
4. verify no redirect loop;
5. verify query strings behave acceptably.

---

# Milestone 17 — Content migration

**Goal:** transfer valuable old content without transferring old information architecture.

## US-17.1 — Migrate logo/assets

Identify:

* logo;
* useful Go diagrams;
* existing club photographs;
* historical event photographs.

Do not automatically migrate every asset.

---

## US-17.2 — Migrate rules

Move the existing educational content into the new structured lesson model.

---

## US-17.3 — Migrate event material

Create historical posts from the useful 2023 event material.

---

## US-17.4 — Replace obsolete poster

The old static poster must not remain the homepage hero. 

It may be retained as an archival asset if there is a legitimate reason, but not as the primary homepage presentation.

---

# Milestone 18 — Continuity and ownership

**Goal:** ensure the club doesn't recreate the original site's maintenance failure.

The requirements call for at least two people to have access to the domain/DNS, hosting, GitHub, club email and admin panel, plus a succession note. 

## US-18.1 — Access inventory document

Create:

```text
docs/access-inventory.md
```

with entries for:

```text
Domain/DNS
Hosting
Git repository
Club email
Admin panel
```

Do not put passwords or secrets in Git.

---

## US-18.2 — Succession document

Create:

```text
docs/succession.md
```

For each system document:

* what it is;
* where it lives;
* who owns it;
* how another volunteer takes over;
* what needs to be checked after transfer.

---

## US-18.3 — Content ownership matrix

Create:

```text
docs/content-ownership.md
```

with ownership for:

| Content             | Owner                          |
| ------------------- | ------------------------------ |
| Meeting information | Named person                   |
| News                | Any admin                      |
| EN                  | Named reviewer                 |
| UK                  | Named reviewer                 |
| About               | Organizer                      |
| Contact             | Organizer                      |
| Photos              | Publisher under consent policy |

The launch gate is that no ownership cell is empty. 

---

# Milestone 19 — Deployment

**Goal:** deploy using the free-tier constraint.

The requirements specifically state that hosting should remain in a free tier such as Vercel or similar. 

## US-19.1 — Production configuration

Define environment variables for:

* database/storage;
* authentication;
* image storage;
* public URLs.

Never commit secrets.

---

## US-19.2 — Production build

Verify:

```text
install
→ typecheck
→ lint
→ tests
→ production build
```

must succeed without warnings that indicate functional problems.

---

## US-19.3 — Deployment

Deploy to staging first.

Verify:

* routes;
* assets;
* authentication;
* uploads;
* images;
* redirects;
* metadata.

Then production.

---

# Milestone 20 — Launch acceptance

This is the final gate, not another feature milestone.

## US-20.1 — New visitor test

A person who has never played Go should be able to answer within seconds:

```text
What is this?
Can I join?
When is it?
Where is it?
Is it free?
Can I come alone?
Do I need to know Go?
```

---

## US-20.2 — First-visit simulation

Perform the complete scenario:

```text
Facebook link
    ↓
Homepage
    ↓
"Przyjdź w środę"
    ↓
meeting information
    ↓
map
    ↓
entrance photo
    ↓
room 14
```

No copying/pasting the address into Google should be necessary.

---

## US-20.3 — Admin simulation

A volunteer using only a phone:

```text
Open admin
→ sign in
→ new post
→ write title
→ write 3–4 sentences
→ select photos
→ choose tag
→ publish
```

Target:

**under 2 minutes**.

---

## US-20.4 — Regression test

Verify:

* `/`
* `/aktualnosci`
* `/zacznij`
* `/o-klubie`
* `/kontakt`
* `/admin`
* old `.html` URLs
* unknown URLs
* mobile navigation
* sticky CTA
* images
* map
* authentication
* news CRUD

---

# Final implementation order

For a local LLM, I would enforce this exact sequence:

```text
PHASE 1 — FOUNDATION
01 Repository inspection
02 React architecture
03 Domain types
04 Club configuration
05 Routing
06 Design tokens
07 Global shell

PHASE 2 — PUBLIC SITE
08 Homepage
09 Start Here
10 About
11 Contact
12 Accessibility

PHASE 3 — NEWS
13 News domain model
14 News repository
15 News feed
16 Historical content migration

PHASE 4 — ADMIN
17 Persistence
18 Image storage
19 Image optimization
20 Authentication
21 Admin shell
22 Create post
23 Edit post
24 Delete post
25 Mobile publishing workflow

PHASE 5 — PLATFORM REQUIREMENTS
26 i18n architecture
27 Privacy notice
28 Photo-consent governance
29 SEO
30 Sitemap
31 Legacy redirects

PHASE 6 — CONTINUITY
32 Access inventory
33 Succession documentation
34 Content ownership

PHASE 7 — RELEASE
35 Production configuration
36 Staging deployment
37 Full acceptance testing
38 Production deployment
39 Post-launch smoke test
```

## Explicitly NOT to implement in this sequence

The local LLM should create tickets for these, but leave them **out of the Tier A implementation**:

```text
Interactive Go board
Problem of the week
Newsletter
Messenger/Discord reminders
Club ladder
Where else to play page
GoLessons integration
Club statistics
Contact form
RSS
Post scheduling/drafts
Dark mode
Structured LocalBusiness/Event schema
Advanced galleries/lightbox
Full EN translation
Full UK translation
```

These belong to the documented Tier B/C roadmap rather than the launch implementation. 

---

# Recommended LLM task format

For the actual implementation backlog, each atomic task should be represented in this form:

```text
TASK ID:
M04.03

TITLE:
Implement homepage first-visit reassurance cards

PURPOSE:
Reduce first-visit anxiety by explicitly answering the four most
important newcomer concerns.

PREREQUISITES:
- M02 design tokens completed
- M03 routing completed

INPUTS:
- Requirements §4.1
- Approved Polish copy
- Design tokens

IMPLEMENTATION:
1. Create FirstVisitCards component.
2. Define four card data objects.
3. Render cards from data rather than duplicating markup.
4. Use semantic heading hierarchy.
5. Make cards responsive.
6. Ensure card text remains readable at 320px.
7. Do not introduce a carousel.
8. Link no card to another page unless explicitly required.

FILES EXPECTED:
- src/features/home/FirstVisitCards.tsx
- relevant styles
- test file if project has component tests

ACCEPTANCE CRITERIA:
- Four required messages are visible.
- Layout works on mobile and desktop.
- No horizontal scrolling.
- Text is readable without interaction.
- Component does not contain duplicated card markup.

VALIDATION:
- npm run typecheck
- npm run lint
- relevant test command
- manual mobile viewport inspection

DO NOT:
- add analytics
- add CMS functionality
- add animation
- add a carousel
- implement Tier B/C features

DEPENDENTS:
- Homepage completion
```

That format is important because **“Implement homepage” is not an atomic instruction**. A local LLM can reliably execute `M04.03` because it knows the purpose, prerequisites, implementation method, boundaries and observable completion criteria.

The resulting project should therefore be treated as a **dependency-ordered execution graph**, rather than simply a list of features. The critical path is:

```text
Architecture
    ↓
Shared configuration + design system
    ↓
Routing + shell
    ↓
Public pages
    ↓
News domain
    ↓
Persistence
    ↓
Authentication
    ↓
Admin publishing
    ↓
Privacy / redirects / SEO
    ↓
Continuity
    ↓
Acceptance
    ↓
Launch
```

This ordering also deliberately keeps the riskiest part—the admin/storage/authentication mechanism—**behind a stable public `NewsRepository` abstraction**, so the local LLM can implement and test the public site without prematurely coupling the UI to a particular backend.
