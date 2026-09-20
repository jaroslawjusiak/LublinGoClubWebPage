# Lubelski Klub Go — Website Analysis & Rebuild Concept


---

## 0. Central principle

**The site is the front door, not the living room.** The community lives on Facebook, Discord
and OGS; the website's only job is to get a curious person through the door on a Wednesday.
It must answer four questions exceptionally well:

1. **What is this?** — A friendly Go club in Lublin.
2. **Can I join?** — Yes. It's free, beginners are welcome, you can come alone.
3. **Where and when?** — Wednesday 17:00–20:00, MDK nr 2, room 14 — with map and directions.
4. **Is the club actually alive?** — Yes: recent photos, recent posts, next meeting.

Every proposed feature must justify itself against these four questions **and** against the
maintenance budget in §7 (1–2 volunteers, ~15 minutes/week). Everything else is secondary.

---

## 1. Audit of the current site

Live site: <https://lubelski-klub-go.vercel.app/> (also reachable via `lubelski-klub-go.pl`).

### 1.1 Page inventory

| Page | Content found | State / verdict |
|---|---|---|
| `index.html` | Club logo, poster image, meeting info (Wednesdays 17:00–20:00, MDK nr 2, ul. Bernardyńska 14a, room 14), "meetings are free", invitation for kids/teens/adults/families, link to rules | **Core info is valuable**, but the page is a static poster — no call to action, no photos of real people, nothing that answers "what will my first visit look like?" |
| `zasady.html` | Illustrated explanation of Go rules: board, liberties ("oddechy"), atari, capturing, territory, dead stones, ko, eyes, life & death — with 4 diagrams | **Best content on the site.** Well written, beginner-oriented, in Polish. Worth keeping almost as-is, with editorial polish (typos: *bezpośednie*, *oddechy* → *oddechu*, *byc*, *się się*) and restructuring into shorter sections |
| `kontakt.html` | Two contact persons (emails, one phone number, OGS nicknames) + meeting info repeated | **Keep the data**, rethink the presentation. Publishing raw personal emails/phone invites spam — switch to a club-level contact channel (see §4.5) |
| `wydarzenia.html` | Two events from **2023** (Akira Hello World festival, 3rd China Town Weiqi Cup) with photo carousel | Content is stale (2 years old) and reads as "the club stopped existing". **This page is the strongest argument for the admin-panel/news-feed idea** — event coverage must be effortless to publish or it dies |
| `galeria.html` | "Strona w trakcie przygotowania. Zapraszamy niebawem!" | Placeholder since launch. **Drop as a separate page** — fold photos into news posts (see §4.1) |
| everything else | 404 | Dead/misleading links must not exist in the new site |

### 1.2 Key problems (beyond outdated content)

1. **No answer to the newcomer's real questions.** Someone who has never played Go wants to know:
   *Is it for me? Will I feel awkward showing up alone? Do I need to know the rules first? Do I need
   to buy anything? Is it OK to bring a child?* None of this is addressed explicitly.
2. **No proof of life.** The freshest visible content is from 2023. For a club site, a single recent
   photo with a date is worth more than any amount of static text.
3. **No call to action.** There is no "Come this Wednesday — here's the map" button, no link to
   Facebook/Messenger where the actual community lives.
4. **Duplicated, unstructured info.** Meeting details are copy-pasted on two pages; if the schedule
   changes, someone must remember to edit both.
5. **No mobile-first thinking, no map, no directions.** The address is plain text; a first-time
   visitor has to copy it into Google Maps manually.
6. **Rules page is a wall of text.** Great material, but 4 long paragraphs with static images is
   hard to absorb. Go rules are inherently interactive — this is a huge missed opportunity (see §4.3).
7. **Polish only.** Lublin has a large Ukrainian community and international students (UMCS, KUL,
   Politechnika, medical university) — exactly the demographic that joins board-game clubs.

---

## 2. What is worth keeping

### Content to keep (after editing)

- ✅ **The rules explanation** (`zasady.html`) — the single best asset. Keep the pedagogical
  sequence (liberties → capture → atari → territory → ko → eyes/life-and-death), fix typos,
  split into digestible steps, ideally make it interactive.
- ✅ **Meeting information** — day, time, venue, "free of charge", family-friendly framing.
  The warm tone ("uczymy się i bawimy razem, często całymi rodzinami") is exactly right — amplify it.
- ✅ **Contact persons with OGS nicknames** — the OGS nicks are a nice touch (visitors can find you
  online before visiting). Keep, but with a club email as the public channel (§4.5).
- ✅ **Event photos** (China Town Cup, Akira) — perfect seed content for the new news feed:
  migrate them as the first 2–3 historical posts so the feed isn't empty at launch.
- ✅ **Logo and visual identity seed** — keep the logo (possibly refreshed), keep the Go-stone
  black/white motif as the design anchor.

### Ideas to keep (that the old site attempted but never finished)

- ✅ Events / club-life page → reborn as the **news feed** powered by the admin panel.
- ✅ Gallery → reborn as **photos inside posts** (no separate orphan page to maintain).

### To drop

- ❌ All dead links and placeholder pages — the new site launches only with finished pages.
- ❌ The static poster (`Plakat.jpg`) as the hero of the homepage — replace with real photos +
  clear value proposition + CTA.
- ❌ Raw personal email/phone as the primary public contact (keep them, but one level deeper or
  behind a form).

---

## 3. Target audience & site goals

**Primary persona:** an adult or parent in Lublin who has *never played Go* — heard about it from a
friend, a manga/anime (Hikaru no Go), the AlphaGo story, or a festival stand. They need reassurance
and a low-friction path to the first visit.

**Secondary personas:**
1. A parent looking for a logic/strategy activity for their child.
2. A player who already plays online (OGS/Fox) and just moved to Lublin — needs schedule, address, level of play.
3. Ukrainian residents and international students — need EN/UK content.
4. Returning members — check news, events, tournament announcements.

**Goal of the site:** convert a curious visitor into a person who shows up on Wednesday.
Every page should be judged against that goal.

**Hard success metric (so we can tell if the rebuild worked):**

- **Primary:** number of first-time visitors per month who say they found the club through the
  website — measured the simplest possible way: *ask newcomers at the door* and keep a tally.
- **Secondary (optional, privacy-friendly analytics only):** clicks on "Przyjdź w środę",
  map/directions clicks, contact clicks, traffic from Facebook. No invasive tracking, no cookie
  banners if avoidable.

---

## 4. Proposed structure & new content

### Proposed sitemap (flat, small, finishable)

```
/            Home (hero, "first visit" section, latest 3 news posts, map, CTA)
/aktualnosci News feed (facebook-style posts from the admin panel)
/zacznij     "Start here" — interactive intro to Go rules + FAQ for the first visit
/o-klubie    About the club — story, people, values, photos
/kontakt     Contact — form, map, socials, contact persons
/admin       Admin panel (hidden from navigation, OAuth-protected)
```

Five public pages. Nothing more at launch — better a small finished site than a large unfinished one.

### 4.1 Home page

- **Hero:** one strong real photo from a club meeting (people at boards, ideally with kids and
  adults visible), headline like *"Zagraj w Go w Lublinie — pierwsze spotkanie za darmo, zawsze w
  środę"*, and two buttons: **"Przyjdź w środę"** (scrolls to when/where + map) and
  **"Poznaj zasady w 5 minut"** (→ `/zacznij`).
- **"Twoja pierwsza wizyta" strip:** 3–4 cards answering the newcomer's fears:
  *Nie znasz zasad? Nauczymy Cię w 15 minut. — Nic nie musisz przynosić. — Wstęp wolny. —
  Dzieci mile widziane.*
- **Latest news:** the 3 most recent posts from the feed (proves the club is alive).
- **When & where:** schedule + embedded map (Google Maps / OpenStreetMap) + photo of the building
  entrance ("szukaj sali 14, galeria na górze") — small detail, huge for first-visit anxiety.
- **Footer:** Facebook, Discord (Szaleni Samuraje), OGS group, Polish Go Association link.

### 4.2 News feed (`/aktualnosci`) — the admin-panel-powered page

Exactly the format you described, and it's the right call:

- A post = **title + 3–4 sentences + up to a few photos + date** (+ optional link, e.g. tournament page).
- Rendered as a vertical feed of cards, newest first; photos as a small gallery/lightbox inside the card.
- Optional post tags: `spotkanie`, `turniej`, `wydarzenie` — one dropdown, nothing more.
- **Seed content:** migrate the 2023 China Town Cup and Akira posts as the first entries.
- Nice-to-have later: an RSS feed and OpenGraph tags so posts share nicely on Facebook.

**Admin panel:**

- **The requirement, stated mechanism-neutrally:** *two or three non-technical club members must
  be able to publish a post safely from a phone.* That — not any particular auth technology — is
  what the implementation must satisfy.
- Google/GitHub OAuth (as originally proposed) with an allowlist of 2–5 admin accounts and no
  public registration remains the leading candidate — managed "sign in with Google" is often the
  *lowest*-maintenance option (no passwords to store, reset, or leak). But the stack decision in
  step 2 should pick the simplest mechanism that satisfies the requirement above, not start from
  "we need OAuth".
- One screen: list of posts + "new post" form (title, text, photo upload with automatic
  resize/compression, date, tag). Edit & delete. Nothing else in v1.
- Design principle: **publishing a post from a phone, right after the meeting, in under 2 minutes.**
  If it's harder than posting on Facebook, it won't be used — that's what killed `wydarzenia.html`.

### 4.3 "Start here" (`/zacznij`) — the flagship page for newcomers

Rework of `zasady.html` into a two-part page:

**Part A — the game (excellent static diagrams at launch, interactive later):**
- Keep the existing pedagogical sequence, split into short steps
  (1. plansza i kamienie → 2. oddechy → 3. zbijanie i atari → 4. terytorium → 5. ko → 6. oczy).
- **Launch with polished static diagrams.** An interactive board widget (visitor places the
  stone, sees the capture happen) is pedagogically superior and stays on the roadmap (Tier C,
  §6) — but a custom board is exactly the kind of "little JavaScript widget" that turns into
  "why does capture state misbehave on mobile?". **The launch must not depend on it.**
- Author the content so that each static diagram is a self-contained exercise ("Black to
  capture — where?" with the answer shown below) that can later be *swapped 1:1* for an
  interactive version without rewriting the page.
- A 30-second pitch of *why* Go is special (4000 years old, simple rules / deep strategy,
  AlphaGo, Hikaru no Go) — a hook, not a lecture.
- "Want more?" links: interactive tutorials (e.g. online-go.com/learn-to-play-go), OGS, and…
  the club itself: *"najlepiej nauczysz się u nas — przyjdź w środę"*.

**Part B — "Co się stanie, kiedy przyjdę pierwszy raz?" (the mini-story):**

Turn "reducing first-visit anxiety" into an actual numbered story, not just an FAQ:

> 1. Wejdź do MDK nr 2 przy ul. Bernardyńskiej 14a.
> 2. Znajdź salę 14 (galeria na górze — oznaczymy drogę na zdjęciach).
> 3. Powiedz, że jesteś pierwszy raz.
> 4. Ktoś z klubu wytłumaczy Ci podstawy i znajdzie partnera do gry.
> 5. Zagrasz pierwszą partię (na małej planszy — to szybkie i przyjemne).
> 6. Zostań, jak długo chcesz.

This is likely the single most useful piece of new content on the site: an FAQ answers
questions, the story removes the need to ask them.

**Part C — the first visit FAQ + expectation setting:**
- Czy muszę znać zasady? / Czy muszę coś przynieść? / Ile to kosztuje? (nic) /
  W jakim wieku można zacząć? / Przychodzę sam(a) — czy to problem? / Jak znaleźć salę 14?
- **Explicit expectation-setting ("who this is for"), phrased positively:**
  *"Nie musisz być szachistą. Nie musisz znać anime. Nie musisz być dobry w matematyce.
  Nie musisz mieć żadnego doświadczenia."* And honestly framing the club's character:
  *"Jeśli szukasz turniejowej rywalizacji — też ją u nas znajdziesz, ale większość spotkań to
  spokojna gra i nauka."* This prevents visitors from forming the wrong mental model of the club.

### 4.4 About the club (`/o-klubie`)

New content to write (currently missing entirely):
- Short club story: when it started, connection with MDK nr 2, who runs it.
- People: a few friendly bios/photos of regulars & organizers (with consent), their ranks/OGS nicks.
- **"Jak wygląda typowe spotkanie?" with 2–3 real photographs** — teaching games, casual games,
  occasional mini-tournaments; set expectations honestly. This is the priority content for the
  page.
- Club in numbers (members, boards owned, strongest rank, youngest player) — cute but low value
  at launch; **moved to the backlog (§6)**. The content budget is better spent on the
  typical-meeting section above.

### 4.5 Contact (`/kontakt`)

- **No contact form in v1.** A form sounds professional but brings spam protection, email
  delivery, validation, privacy handling, and another thing that silently breaks — for a
  volunteer club the cost/benefit doesn't hold. Instead, one simple block:
  **"Masz pytanie? Napisz do nas"** with a single club email address (`mailto:`) plus prominent
  Facebook/Messenger and Discord links (that's where the community actually answers). A form can
  always be added later if spam or demand justifies it.
- Contact persons kept (with OGS nicknames), but prefer a club alias over raw personal Gmail
  addresses as the public channel.
- Map + transit hints (bus lines, parking) — Bernardyńska is central, make that an asset.

### 4.6 Multilingual: PL / EN / UK

- **Architecture in v1, content can trail slightly:** the site must be built i18n-ready from day
  one (language routing like `/en/...`, `/uk/...` is expensive to retrofit), but **translations
  must not block the launch**. Shipping PL-only and adding reviewed EN/UK content within the
  following weeks is acceptable — especially for Ukrainian, where a human reviewer is required
  for the welcoming intent to land (machine-only translation would undermine it).
- **Scope as you proposed:** static content only (home, start-here, about, contact, UI chrome).
  News posts stay in the language they were written in (translating every post is unsustainable) —
  optionally a per-post language flag later.
- Language switcher in the header (`PL / EN / УК`), language reflected in the URL
  (`/en/...`, `/uk/...`) for shareability and SEO.
- Ukrainian version deserves care beyond translation: an explicit welcoming sentence
  (*"Запрошуємо українців — мова не є бар'єром у Go"*) — Go is literally a game you can play
  without a common language, which is a beautiful message for this audience.

---

## 5. Layout & UX direction

- **Aesthetic:** minimal, lots of whitespace, black & white as the base (Go stones) with **one**
  warm accent color (e.g. the amber/wood tone of a goban — kaya wood). Subtle board-grid or
  stone motifs as decoration, not as noise. Modern but calm; no anime-style clutter — the site
  should feel welcoming to a 10-year-old's parent *and* a 60-year-old chess player.
- **Typography-first design:** a clean sans for UI, generous font sizes; the content is short, so
  let it breathe.
- **Mobile-first:** most first-time visitors will arrive from a Facebook link on a phone.
  Sticky "Przyjdź w środę" CTA on mobile.
- **Real photography over stock:** even imperfect club photos beat stock images; they answer
  "will I fit in?" better than any text.
- **Accessibility & basics:** semantic HTML, alt texts, contrast, dark mode is almost free with a
  black/white palette; fast loading (compressed images), proper Polish/English/Ukrainian `lang` tags.
- **SEO for one job:** rank for "go klub Lublin", "nauka go Lublin", "gra go Lublin",
  "weiqi baduk Lublin" — basic titles/descriptions/sitemap in v1; structured data
  (`LocalBusiness`/`Event`), OpenGraph and dark mode are Tier B polish (§6), not launch blockers.
- **No dead ends:** every page ends with a CTA (come on Wednesday / read the rules / message us).

---

## 6. Scope tiers — what ships when

The original draft listed "five pages, nothing more" but then quietly loaded those pages with a
much larger feature set (i18n + interactive board + CMS + OAuth + image processing + contact
form + structured data + dark mode + …). Individually reasonable; collectively the classic way a
straightforward project takes 3× longer than expected. This section is the explicit cut-line.

### Tier A — v1 launch (absolutely nail it, nothing else blocks launch)

1. **Homepage** with hero, CTA, when/where + map & directions
2. **First-visit explanation** — the step-by-step mini-story + FAQ + expectation setting (§4.3 B/C)
3. **Accurate meeting information** (single source of truth, shown on home & contact)
4. **Real photography** throughout
5. **Recent news feed** + **simple publishing workflow** (admin panel per §4.2 — the minimal
   one-screen version)
6. **Improved rules content with polished static diagrams** (§4.3 A)
7. **About page** (club story + "typical meeting" with photos)
8. **Contact page** (club email + socials — no form)
9. **Mobile-first UX** (incl. sticky CTA)
10. **Old URL redirects** (`zasady.html`, `kontakt.html`, `wydarzenia.html` → new equivalents)
11. **Accessibility & privacy basics** (semantic HTML, alt texts, contrast; privacy notice,
    photo-consent policy per §7)
12. **i18n-ready architecture** (PL content at launch; EN/UK content may trail by weeks)
13. Basic SEO (titles, descriptions, sitemap) — enough to rank for "go klub Lublin"

### Tier B — v1.x (highly worthwhile, weeks after launch)

14. **EN / UK translated content** (with named human reviewers)
15. **Upcoming events box** ("every Wednesday" rule + exceptions editable in admin)
16. **OpenGraph / richer social sharing** for news posts
17. **Better image galleries / lightbox** in posts
18. **Post scheduling / draft mode** in the admin panel
19. **RSS feed**
20. Structured data (`LocalBusiness` / `Event`), dark mode

### Tier C — v2+ (excellent ideas that must not delay anything)

21. **Interactive Go board** replacing the static rule diagrams 1:1 (§4.3 A)
22. **Problem of the week (tsumego)** on the homepage
23. **Newsletter / Messenger / Discord reminders**
24. **Club ladder / internal ranking**
25. **"Where else to play" page** (OGS, Fox, szalenisamuraje.org, Polish Go Association)
26. **GoLessons repo integration** ("materiały do nauki")
27. **Club in numbers** block on the About page
28. **Contact form** (only if the plain club email proves insufficient)

---

## 7. Constraints, non-goals & governance requirements

### Non-goals

- **Non-goal:** a Go server, game records database, member accounts, forums — the community lives
  on Facebook/Discord/OGS; the site is the *front door*, not the living room (§0).
- **Non-goal (v1):** translating dynamic news content.

### Constraints

- **Constraint:** the whole site must be maintainable by 1–2 volunteers with ~15 minutes/week.
  Every feature is evaluated against that budget. **This is the test every proposal must survive.**
- **Constraint:** hosting should remain in the free tier (Vercel or similar) — influences the
  stack discussion later, noted here only as a requirement.

### Privacy & legal (hard v1 requirements, not open questions)

- **Photo consent policy** written down before launch: what consent is collected, how, and where
  it's recorded — with **stricter rules for minors** (explicit parental consent; default to
  crowd/hands-and-boards shots when in doubt).
- **Privacy notice** page: what data the site processes (essentially: admin login identities and
  optional privacy-friendly analytics), GDPR contact point.
- **No contact form in v1** ⇒ no form-data handling to design; if a form is ever added (Tier C),
  its data handling gets specified then.
- Prefer analytics that require **no cookie banner** (or no analytics at all in v1).

### Continuity & ownership (the "bus factor" requirements)

Boring but critical for a volunteer organisation — the old site froze in 2023 precisely because
this was never defined:

- **Access inventory:** at least **two named people** must hold access to each of: the domain
  registrar/DNS, the hosting account, the GitHub repository, the club email, and the admin panel.
- **Succession note:** a short document in the repo describing how to take over each of the above
  if the primary volunteer disappears.
- **Content ownership table** — every piece of content has a named maintainer:

| Content | Who maintains it |
|---|---|
| Meeting time / location | named person (single source of truth) |
| News posts | any admin |
| EN translation | named reviewer |
| UK translation | named reviewer |
| About-club page | organizer |
| Contact information | organizer |
| Photos in posts | whoever publishes the post (bound by the consent policy) |

  (Names to be filled in during the PR discussion — the requirement is that **no cell is empty
  at launch**.)

---

## 8. Open questions before the next step (tech stack & implementation plan)

Resolved since draft v1: ~~contact form~~ (dropped from v1, §4.5); ~~interactive rules widget~~
(static diagrams at launch, interactive is Tier C, §4.3); ~~old URL redirects~~ (now a Tier A
requirement, §6).

Still open:

1. **Domain:** is `lubelski-klub-go.pl` the canonical address going forward (with the Vercel URL as
   an alias)? Who controls the DNS? (Feeds the access inventory in §7.)
2. **Photos & consent:** do you have consent to publish photos of members (especially minors)?
   This affects what we can put on the homepage and in posts, and feeds the consent policy in §7.
3. **Admin users:** who exactly (how many people) will publish posts? Which accounts do they
   already have (Google / GitHub / other)? — this drives the "simplest safe mechanism" choice in §4.2.
4. **Club email:** does a club-level email exist, or should we create one? (It's now the primary
   public contact channel.)
5. **Translation reviewers:** who can review the EN and UK translations for quality?
   (Machine-translate + native review is fine; machine-only for UK would undermine the welcoming
   intent.) Names go into the ownership table in §7.
6. **Facebook page:** should the site embed/link the FB feed, or is the new admin-panel feed
   intended to *replace* posting on Facebook (recommendation: post on the site, share the link on FB)?
7. **Access inventory & succession (§7):** which two people hold access to each system today, and
   where should the succession note live?

---

## 9. Suggested next steps

1. You review & annotate this document (PR discussion) — in particular the Tier A cut-line in §6
   and the remaining open questions in §8.
2. Fill in the names in the §7 ownership table and access inventory.
3. **Step 2 document:** technology stack proposal + implementation plan scoped to **Tier A only**
   (milestones: static pages → news feed + admin publishing → redirects, privacy & launch),
   with Tier B/C explicitly deferred. Includes hosting, the simplest safe publishing/auth
   mechanism (§4.2), image storage, and content-migration details.