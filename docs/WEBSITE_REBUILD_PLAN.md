# Lubelski Klub Go — Website Analysis & Rebuild Concept

> **Status:** Draft for discussion (step 1 of the rebuild project).
> **Scope of this document:** audit of the current site, what to keep, content & feature ideas,
> layout / UX concept, and open questions. **Deliberately out of scope:** technology stack and
> implementation plan — those come in the next step, after this concept is agreed.

---

## 1. Audit of the current site

Live site: <https://lubelski-klub-go.vercel.app/> (also reachable via `lubelski-klub-go.pl`).

### 1.1 Page inventory

| Page | Content found | State / verdict |
|---|---|---|
| `index.html` | Club logo, poster image, meeting info (Wednesdays 17:00–20:00, MDK nr 2, ul. Bernardyńska 14a, room 14), "meetings are free", invitation for kids/teens/adults/families, link to rules | **Core info is valuable**, but the page is a static poster — no call to action, no photos of real people, nothing that answers "what will my first visit look like?" |
| `zasady.html` | Illustrated explanation of Go rules: board, liberties ("oddechy"), atari, capturing, territory, dead stones, ko, eyes, life & death — with 4 diagrams | **Best content on the site.** Well written, beginner-oriented, in Polish. Worth keeping almost as-is, with editorial polish (typos: *bezpośednie*, *oddechy* → *oddechu*, *byc*, *się się*) and restructuring into shorter sections |
| `kontakt.html` | Two contact persons (emails, one phone number, OGS nicknames) + meeting info repeated | **Keep the data**, rethink the presentation. Publishing raw personal emails/phone invites spam — consider a contact form and/or club-level contact channel |
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
  online before visiting). Keep, but behind a contact form or club email for the public part.
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

**Measurable goal of the site:** convert a curious visitor into a person who shows up on Wednesday.
Every page should be judged against that goal.

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

**Admin panel (as you proposed):**

- Login via **Google / GitHub OAuth**; an allowlist of admin accounts (2–5 people), no public registration.
- One screen: list of posts + "new post" form (title, text, photo upload with automatic
  resize/compression, date, tag). Edit & delete. Nothing else in v1.
- Design principle: **publishing a post from a phone, right after the meeting, in under 2 minutes.**
  If it's harder than posting on Facebook, it won't be used — that's what killed `wydarzenia.html`.

### 4.3 "Start here" (`/zacznij`) — the flagship page for newcomers

Rework of `zasady.html` into a two-part page:

**Part A — the game (interactive if possible):**
- Keep the existing pedagogical sequence, split into short steps
  (1. plansza i kamienie → 2. oddechy → 3. zbijanie i atari → 4. terytorium → 5. ko → 6. oczy).
- **Idea worth serious consideration:** replace static JPG diagrams with an interactive board
  widget (there are ready open-source components, e.g. besogo / wgo.js / glift-style viewers —
  stack decision later). Each rule step becomes a mini-board where the visitor can *place the
  stone themselves* and see the capture happen. "Try it" beats "read it" for Go.
- A 30-second pitch of *why* Go is special (4000 years old, simple rules / deep strategy,
  AlphaGo, Hikaru no Go) — a hook, not a lecture.
- "Want more?" links: interactive tutorials (e.g. online-go.com/learn-to-play-go), OGS, and…
  the club itself: *"najlepiej nauczysz się u nas — przyjdź w środę"*.

**Part B — the first visit FAQ:**
- Czy muszę znać zasady? / Czy muszę coś przynieść? / Ile to kosztuje? (nic) /
  W jakim wieku można zacząć? / Przychodzę sam(a) — czy to problem? / Jak znaleźć salę 14?
- This section is the single highest-leverage *new* content on the whole site for your stated goal.

### 4.4 About the club (`/o-klubie`)

New content to write (currently missing entirely):
- Short club story: when it started, connection with MDK nr 2, who runs it.
- People: a few friendly bios/photos of regulars & organizers (with consent), their ranks/OGS nicks.
- What a typical meeting looks like: teaching games, casual games, occasional mini-tournaments —
  set expectations honestly.
- Club in numbers (optional, fun): members, boards owned, strongest rank, youngest player.

### 4.5 Contact (`/kontakt`)

- Contact form (goes to club email) as the primary channel + social links (Facebook is where the
  community actually is — link it prominently).
- Contact persons kept, but consider club aliases instead of raw personal Gmail addresses.
- Map + transit hints (bus lines, parking) — Bernardyńska is central, make that an asset.

### 4.6 Multilingual: PL / EN / UK

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
  "weiqi baduk Lublin". Structured data (`LocalBusiness`/`Event`), OpenGraph for shared posts.
- **No dead ends:** every page ends with a CTA (come on Wednesday / read the rules / message us).

---

## 6. Additional feature ideas (backlog — v2+, not for launch)

Ordered roughly by value-to-effort; none of these should delay v1.

1. **Events with dates** (as distinct from news): a small "upcoming" box — next meeting,
   next tournament — possibly auto-generated ("every Wednesday" rule + exceptions/holidays
   editable from the admin panel).
2. **Problem of the week (tsumego):** one Go problem on the homepage, changed weekly from the
   admin panel — gives returning visitors a reason to return, and newcomers a taste of the game.
3. **Newsletter or Messenger/Discord deep-link** for meeting reminders.
4. **Club ladder / internal ranking table** — motivating for members, social proof for visitors.
5. **"Where else to play" page:** OGS, Fox, tournaments in Poland (szalenisamuraje.org board),
   Polish Go Association — the natural next step after someone is hooked.
6. **Integration with your GoLessons repo:** the training-material project could eventually feed a
   "materiały do nauki" section.
7. **Post scheduling / draft mode** in the admin panel.

---

## 7. Constraints & non-goals (proposed)

- **Non-goal:** a Go server, game records database, member accounts, forums — the community lives
  on Facebook/Discord/OGS; the site is the *front door*, not the living room.
- **Non-goal (v1):** translating dynamic news content.
- **Constraint:** the whole site must be maintainable by 1–2 volunteers with ~15 minutes/week.
  Every feature is evaluated against that budget.
- **Constraint:** hosting should remain in the free tier (Vercel or similar) — influences the
  stack discussion later, noted here only as a requirement.

---

## 8. Open questions before the next step (tech stack & implementation plan)

1. **Domain:** is `lubelski-klub-go.pl` the canonical address going forward (with the Vercel URL as
   an alias)? Who controls the DNS?
2. **Photos & consent:** do you have consent to publish photos of members (especially minors)?
   This affects what we can put on the homepage and in posts.
3. **Admin users:** who exactly (how many people) will publish posts? Google accounts, GitHub, or both in practice?
4. **Club email:** does a club-level email exist (for the contact form), or should we create one?
5. **Content ownership for translations:** who can review the EN and UK translations for quality?
   (Machine-translate + native review is fine; machine-only for UK would undermine the welcoming intent.)
6. **Interactive rules widget:** are you happy to invest in this for v1, or ship static (improved)
   diagrams first and add interactivity in v1.1?
7. **Old URLs:** should `zasady.html`, `kontakt.html`, `wydarzenia.html` redirect to their new
   equivalents (cheap, avoids breaking any links printed on old posters)?
8. **Facebook page:** should the site embed/link the FB feed, or is the new admin-panel feed
   intended to *replace* posting on Facebook (recommendation: post on the site, share the link on FB)?

---

## 9. Suggested next steps

1. You review & annotate this document (PR discussion).
2. We agree on the v1 sitemap and feature cut-line (§4 vs §6).
3. **Step 2 document:** technology stack proposal + implementation plan (milestones:
   static pages → i18n → news feed + admin panel → polish & launch), including hosting,
   auth, image storage, and content-migration details.
