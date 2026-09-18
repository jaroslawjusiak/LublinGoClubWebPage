# Lubelski Klub Go — Web Rewritten. Implementation Plan

**Status:** v1.0 · **Basis:** verified findings from `Ideas/Remote/claude.md` (spine) + gpt / gemini / deepseek4.1Flash / meta, fact-checked against the live site on 2026-09-18.
**Owner decisions:** stack = Next.js (confirmed familiar: React/Next), v1 scope = full (incl. `/en` mirror, SGF viewer, interactive board), CSS = hand-written design tokens (no Tailwind).

---

## 0. Locked technology stack

| Layer | Choice | Why (local-LLM ergonomics + maintenance) |
|---|---|---|
| Framework | **Next.js 15, App Router, `output: 'export'`** (pure static site) | Familiar to owner; no server/API/hydration-of-data problems; one deploy command; `out/` is hostable anywhere. |
| Language | **TypeScript**, `strict` on `lib/**`, relaxed on `app/**` | `next build`'s typecheck is a free hallucination filter for small models. No `checkJs`, no `any`-hunting in page files. |
| Styling | **One `globals.css`**: design tokens (`:root` vars) + ~12 component classes. Per-page CSS files only when truly needed | Small diffs, no class-name hallucinations, single catalog file that always goes into the LLM context pack. |
| Content / data | **Local files**: `content/club.json`, `content/events/*.json`, `content/i18n/{pl,en}/*.json`, `content/tsumego/*.json`, `content/games/*.sgf` | "Single source of truth" fixes the duplicated meeting block and dead Discord invite structurally. No CMS, no DB. |
| i18n | **Own tiny loader** (`lib/i18n.ts`, dict-per-page JSON), routes `app/[lang]/…`, `generateStaticParams(['pl','en'])` | One concept (read JSON, look up key) instead of a library; verifiable with a coverage test. |
| Go engine | **Own pure `lib/go/`** (rules, SGF, bot) + **Vitest** | ~400 lines total, fully testable, no abandoned deps (WGo.js, @sabaki/* are stale/hard for small LLMs to debug). Board is a dumb SVG React component. |
| Interactive state | `useState`/`useReducer` in client components only; **no state libs** | Fewer abstractions = fewer things for a small model to get wrong. |
| Maps / embeds | OpenStreetMap static image + plain link (no Google iframe) | No cookie-consent obligation, works offline-buildable. |
| Calendar | `scripts/gen-ics.mjs` → `public/kalendarz.ics` (RRULE weekly + EXDATE from `club.json`) | Run as `prebuild`; nothing to maintain by hand. |
| Fonts | `next/font` (self-hosted) — Inter + Lora | No third-party requests → no GDPR/cookie issue. |
| Tests | **Vitest** for `lib/**` + `content/` loaders. No E2E | `npm run check` = `lint && typecheck && test && build` is the single gate after every task. |
| Deploy | **Vercel** (existing project), framework preset *Other*, build `npm run check`, output `web/out` (app lives in `web/`) | Keeps `lubelski-klub-go.vercel.app`; static → cannot break at runtime. |
| Forms / analytics | **None in v1** (contact = club e-mail + Discord) | A club of this size must not own a mailbox nobody reads, nor a backend. |

Repo layout:

```
LublinGoClubWebPage/
├─ Ideas/                  # audits & this plan (reference only)
├─ reference/legacy-site/  # vendored old HTML+assets (task M1-T0) — read-only reference
└─ web/                    # the Next app (Vercel root dir)
   ├─ app/[lang]/…         # pl = default, en = mirror; NO literal text in pages (dicts only)
   ├─ components/          # shared UI + components/go/*
   ├─ lib/                 # go engine, content loaders, time, i18n — pure, tested
   ├─ content/             # all editable text/data (JSON + .sgf)
   ├─ styles/globals.css    # tokens + class catalog
   └─ scripts/             # gen-ics.mjs, gen-sitemap.mjs
```

---

## 1. Working contract for local-LLM sessions

Every task below is sized for **one session with a ~8–32B local model**:

- **Size limit:** ≤ 3 files touched, ≤ ~150 new lines of code per task. If a task wants more — split it.
- **Context pack** (paste exactly this, nothing else): ① the task bullet from this file, ② `web/AGENTS.md` (10-line project rules), ③ `styles/globals.css` class catalog, ④ the files the task names, ⑤ the test file when TDD order is given.
- **TDD bias:** for every `lib/**` task, first session writes only the Vitest file, next session writes the implementation until green. Small models implement-to-tests far more reliably than design-from-prose.
- **Gate:** `cd web && npm run check` must pass before commit. Commit message = task ID: `M3-T2: ko rule + tests`.
- **No new dependencies** unless the task explicitly says so. No "while we're here" refactors.
- After each milestone: human runs `docs/qa-*.md` checklist (you, not the LLM).

`web/AGENTS.md` (written in M0-T6) contains: directory map, "text lives in content/i18n, never in JSX", "meeting data only via lib/content/club", class catalog pointer, check command, forbidden imports.

---

## 2. Milestones

> US = user stories (who benefits). Tasks are ordered; cross-milestone deps noted as `← Mx-Ty`.
> ⚑ = task directly implements a *verified* audit finding (traceability table in §3).

---

### M0 — Scaffold (one afternoon, mostly mechanical)

*US0.1 As a maintainer-session (human or LLM), the repo must be boring: fixed commands, fixed layout, nothing to guess.*

- **M0-T1** `npx create-next-app@latest web` (TS, App Router, no Tailwind, no src/, ESLint) on a new branch. Commit as-is.
- **M0-T2** `next.config.mjs`: `output:'export', trailingSlash:true, images:{unoptimized:true}`; `npm run build` must emit `web/out/`. This is the whole architecture — pin it first.
- **M0-T3** `styles/globals.css`: `:root` token block (colors incl. wood `--wood`, ink/paper pairs, `--r-*` radii, `--s-*` spacing, font stacks), `[data-theme=dark]` overrides (values, toggle later in M7), base reset, and a commented class catalog: `.container .section .card .btn .btn-primary .btn-ghost .chip .grid-2 .grid-3 .prose .figure`. Page files get CSS only via `*.module.css` if needed.
- **M0-T4** Deps & commands: add `vitest`; `package.json` scripts — `check = lint && tsc --noEmit && vitest run && build`, `dev`, `gen-ics`, `gen-sitemap` (scripts land in M1/M2, wire names now). One lockfile commit.
- **M0-T5** Root layout + `app/[lang]/layout.tsx` with `generateStaticParams → ['pl']`, `notFound()` for other langs, `<html lang={lang}>`, `next/font` Inter+Lora self-hosted, imports globals.css.
- **M0-T6** `web/AGENTS.md`: 10-line session rules (§1's context-pack rules verbatim) + directory map + "no literal text in pages; no facts outside content/". Also `.nvmrc`, `README.md` (3 commands max).
- **M0-T7** Vercel project → root dir `web`, build `npm run check`, framework preset *Other* (static), output `web/out`; deploy a "Next.js scaffold OK" placeholder page and keep the preview URL as milestone evidence.

**DoD:** preview live, `npm run check` green on empty app, LLM can run any later task knowing only `AGENTS.md` + task bullet.

---

### M1 — Data layer & single source of truth

*US1.1 As a returning member I want one place where venue/time/invite live, so pages never disagree.*
*US1.2 As a newcomer the site should always tell me the next real meeting date, so I know the club is alive.*

- **M1-T0** Vendor the current site into `reference/legacy-site/` (5 HTML + `assets/` + `photo/`). Read-only reference for copy & rules text. *Files: reference/** only.*
- **M1-T1** `content/README.md`: schemas with one filled example each — club.json, event, i18n page dict, tsumego, game index. Pure doc task.
- **M1-T2** ⚑ `content/club.json`: `venue{name,street,city,room,directions,osmLink}`, `schedule{weekday:3,start,end,breaks:[{from,to,why}]}`, `contact{email:"lublin.go@…"(alias), discordInvite:"cZNpEtfj5J" (the working one — xeaQ8uMy is DEAD), facebook}`, `meta{…}`, `people[]` (name, role, rank, ogs, bio — no personal phone numbers ⚑).
- **M1-T3** `lib/content/club.ts`: loader + `getVenueLine()`, `getContact()`; tests assert no `gmail.com` and no `tel` fields appear (privacy guard ⚑). ← M1-T2
- **M1-T4** `content/events/2023-akira.json`, `2023-china-town.json` (dates + `year` + `status:"archived"`) + `2026-seed.json`; `lib/content/events.ts` with `getEvents()` → `{upcoming, archived}`, split by date vs `now` injected (test with fixed clock ⚑ "dates never lie"). ← M1-T1
- **M1-T5** `lib/time/next-meeting.ts`: `nextMeeting(now: Date, club): {date, isToday, doorsAt}` — Europe/Warsaw-safe, skips `breaks`. 8 tests: Tue/Wed-before-17:00/Wed-during/holiday-spanning cases. ← M1-T2
- **M1-T6** `scripts/gen-ics.mjs` → `public/kalendarz.ics`: weekly RRULE for Wednesdays + EXDATE per `schedule.breaks`; wire as `npm run prebuild`. Verify in Google Calendar. ← M1-T5 (shared util ok to inline)
- **M1-T7** `lib/time/tsumego-of-week.ts`: `indexForWeek(now, problemCount)` (epoch-week mod). Test boundaries. (Used by M4; small enough to land now.)

**DoD:** `npm run check` green with 12+ tests; no page hardcodes any fact yet.

---

### M2 — Static PL site (core pages, real content)

*US2.1 As an anxious first-timer I want "just show up on Wednesday" answered above the fold, so I don't bounce.*
*US2.2 As a parent I want to know kids are welcome and what happens there.*
*US2.3 As a Go player visiting Lublin I want schedule + level mix + Discord, so I can decide in 30 s.*

Shared static components first, then pages. Pages contain **dict lookups only** (`t(dict.key)`), which makes M6 a pure JSON job — this rule starts now, from page #1.

- **M2-T1** `components/layout/Nav.tsx` + `Footer.tsx`: logo+name, 6 links, discord/fb as SVG icons with labels (no `<img>`+raw-URL footer ⚑). Footer prints venue line via `getVenueLine()`.
- **M2-T2** ⚑ Extend the M0 layout: metadata template `'%s · Lubelski Klub Go'` + default description from `club.json.meta`, `sitemap`/`robots` config placeholders, OG defaults (image file arrives in M7-T2), per-route `notFound()` guard already passing.
- **M2-T3** `content/i18n/pl/home.json` + `components/home/Hero.tsx` + `MeetingBadge.tsx`: headline, sub ("Środy, MDK nr 2, sala 14 — wstęp wolny"), CTAs [Pierwsza wizyta][Discord]; badge: "Najbliższe spotkanie: **środa 23.09, 17:00**" via `nextMeeting()` ⚑ + chips (FREE / EVERYONE 7–77 / BOARDS PROVIDED) ⚑ (replaces "SPOTKANIA SĄ DARMOWE !!!").
- **M2-T4** Home sections: "Czym jest Go?" 3-sentence box + why-Go strip + latest-news cards (from `events.upcoming`/archived, max 3) + OGS CTA. ← M1-T4
- **M2-T5** ⚑ `app/[lang]/pierwsza-wizyta/page.tsx` + `content/i18n/pl/pierwsza-wizyta.json`: 4-step arrival path, "co zabrać: nic", entrance photo slot (uses `reference/legacy-site` photo if any, else placeholder), OSM map link block, "jak trafić do Sali 14" written for strangers (not "Galeria na górze" insider-speak ⚑).
- **M2-T6** FAQ: `content/i18n/pl/faq.json` (8 Q/A from meta/deepseek lists: free? kids age? must I know rules? can I watch only? etc.) + `<details>` accordion in `components/faq/FaqList.tsx`. Page `/faq` + anchor-linked from first-wizyta.
- **M2-T7** `app/[lang]/o-klubie/`: mission (3 bullets), mini-timeline (founding, MDK, Akira era), `PersonCard` grid from `club.json.people` ⚑(people, not bare contact list).
- **M2-T8** ⚑ `app/[lang]/wydarzenia/`: Upcoming cards / "Archiwum" grouped by year — old 2023 events now honestly labelled history; each card reuses legacy photos from `reference/` copied into `web/public/img/`.
- **M2-T9** `app/[lang]/kontakt/`: renders only `getContact()` (club alias e-mail via `mailto:`, Discord button, FB) — personal Gmail/phone gone ⚑; "Napisz śmiało nawet przed pierwszą wizytą" line.
- **M2-T10** `app/[lang]/zasady/`: keep club's own rules prose (it's good — audit agrees) but split into 5 sections with the 4 figures; fix `bezpośednie→bezpośrednie`, `byc→być`; intro CTA "wypróbuj na planszy → /zasady/atari-go" (M4) + "pełne zasady na PGF, skróty na Sensei's Library".
- **M2-T11** Gallery page `/galeria`: `content/gallery/*.json` (2 albums seeded with existing china-town/Akira photos), captioned grid. (Galeria-as-dead-end fixed by attaching photos to context: also linked from each archived event card ⚑.)
- **M2-T12** ⚑ Per-page `generateMetadata` (title, description, OG title/desc, og:image placeholder) in all 8 PL routes + `app/not-found.tsx` (friendly 404 with schedule line) + `robots.ts`.
- **M2-T13** `docs/qa-m2.md`: manual checklist — mobile 360 px, nav reaches all pages ≤2 clicks, zero hardcodes (grep `Bernardyńska|Sala 14|discord` finds only content/+lib), `npm run check` green. Deploy preview → sign-off.

**DoD:** complete static PL site, no interactive JS beyond dict lookups; all ⚑ M2 items resolved.

---

### M3 — Go engine (pure logic, zero UI)

*US3.1 As a learner I want to touch the rules, not read them.* (engine prerequisite)

- **M3-T1** `lib/go/board.ts`: `createBoard(sz)`, immutable `place`, `groups`/`liberties` (BFS). Tests: liberties center/edge/corner, group merging. *(TDD: session 1 tests, session 2 code.)*
- **M3-T2** `lib/go/rules.ts`: capture-on-liberty-0, suicide ban, simple-ko (single-stone recapture) ⚠ document simplification; `legalMoves()`; `play()` → `{board, captured[], error}`. Tests: snapback, ko, multi-group capture.
- **M3-T3** `lib/go/sgf.ts`: parse `SZ/GM/B[]/W[]/AB/AE/C`, main-line only (reject variations with clear error), `sgfToGame(sgf) → {sz, moves[], comments[]}`; `coordsFromSgf/toSgf` round-trip test with the 3-line sample + one real 9×9 SGF fixture.
- **M3-T4** `lib/go/bot.ts`: atari-go heuristic (capture → run-atari → escape → center-priority random, seeded `rng`); `firstCaptureWinner` state helper. Tests: bot captures free stone every seed; determinism per seed.
- **M3-T5** `lib/go/score.ts`: area scoring (stones+territory flood-fill) + tests (two fixtures). Used only by game-over niceties; keep simple.
- **M3-T6** Engine facade `lib/go/index.ts` re-exports + tiny `types.ts`. Update `web/AGENTS.md`: "never mutate board objects".

**DoD:** ~30 tests green; no component imports `lib/go/*` deep paths (only facade).

---

### M4 — Interactive learning (the flagship)

*US4.1 As a 12-year-old I want to capture stones in 60 s, so Go stops being scary.*

- **M4-T1** `components/go/GoBoard.tsx` (server-safe, no logic): SVG grid/hoshi/stones/last-move/hover-ghost, `onPlace(x,y)`, sizes 9/13/19, a11y labels (`aria-label="skieruj kamień: E4"`), `prefers-reduced-motion` respected. 1 CSS file `GoBoard.module.css` (allowed: canvas-like component).
- **M4-T2** `components/go/GoGame.tsx` (client `'use client'`): wraps facade — click → `play()`, invalid → shake+toast, captures flash, pass/reset buttons. No scoring UI.
- **M4-T3** `/zasady/atari-go` page: rules banner (first capture wins, 9×9), human Black vs `bot.ts`, win/lose card with "zagraj ponownie" + "przyjdź po prawdziwe zasady" CTA. Dict `atari-go.json`.
- **M4-T4** `content/tsumego/` 12 problems (15–20 kyu gradient, JSON: setup stones + solution as move list + `hint` + `failText`) + `lib/content/tsumego.ts` validation (all setups legal on init; solution line passes `rules.ts` in a test loop).
- **M4-T5** `/zadania` page + `components/go/Tsumego.tsx`: play attempt vs solution — correct → advance, wrong → board replays opponent refutation step-by-step (read-only, buttons). Score per session (localStorage, namespaced key).
- **M4-T6** Home "Zadanie tygodnia" card: compact 9×9 via `indexForWeek()` ← M1-T7; link to /zadania. (SEO: one static render per week, fine.)
- **M4-T7** Rules-page figures made replayable: `components/go/ReplayFigure.tsx` — the 4 legacy figures as small setups, ‹ › buttons walking the described moves beside the text (data inline in `zasady.json`).
- **M4-T8** `docs/qa-m4.md`: play one full atari-go game on phone, ko case, reduced-motion, keyboard reachable; record engine bundle size (< 30 KB gz target).

**DoD:** kid can land → learn → capture a stone → solve one puzzle, 100 % in-browser.

---

### M5 — SGF viewer & club games

*US5.1 As a member I want my Wednesday game commented and re-playable, so the site becomes worth visiting between meetings.*

- **M5-T1** `components/go/SgfPlayer.tsx` (client): slider, ⏮◀▶⏭, autoplay (1 s, respects reduced-motion), move counter, comment pane under board (reuses `GoBoard`).
- **M5-T2** `content/games/`: `index.json` (slug, title, black/white/ranks, date, `sgf`, `commentary.md`) + 2 seeded games (ask members for real ones; fallback: the two 9×9 demo games from tests). `scripts/copy-sgf.mjs` → `public/games/*.sgf` (prebuild).
- **M5-T3** `/gry` list (year chips) + `/gry/[slug]` — commentary paragraphs interleaved with player snapshots (split at `{move:12}` markers, simple format spec in `content/README.md`).
- **M5-T4** "Wrzuć swoją partię" box on /gry: "wyeksportuj SGF z OGS i wyślij na club e-mail" (no upload backend, deliberately).

**DoD:** one real game plays on the deployed preview with comments.

---

### M6 — English mirror

*US6.1 As an exchange student at UMCS/KUL, I need 3 sentences in English to decide to walk in Wednesday evening.* ⚑ highest-ROI audit finding.

- **M6-T1** `lib/i18n.ts`: `loadDict(lang, page)` (build-time only, no runtime fallback), `LANGS=['pl','en']`; `lib/routes.ts`: single route table mapping pl/en paths (drives Nav + lang switch + hreflang). Test: every pl dict has an en sibling with identical key tree.
- **M6-T2** `app/[lang]/layout.tsx`: `generateStaticParams → ['pl','en']`, redirect-never pattern (unknown lang 404), `LangSwitch.tsx` (pl/EN link pair from routes), `not-found` localized.
- **M6-T3** `generateMetadata` uses per-page dict fields `meta.{title,desc}` both langs; `alternates.languages` hreflang from routes table.
- **M6-T4..T11** Per-page EN dicts (repeatable card, one session each): `home, pierwsza-wizyta, faq, o-klubie, wydarzenia, kontakt, zasady, zadania/atari-go, galeria`. Copy rules: facts identical, no literal translation of humor; "free • all ages • boards provided • just come". Coverage test (M6-T1) is the acceptance gate.
- **M6-T12** Home hero: language chips visible top-right; `/` (no lang) gets `<html lang="pl">` canonical only — sitemap lists both locales. `scripts/gen-sitemap.mjs` updated ← M2-T12.

**DoD:** full /en mirror, CI fails if a key exists in pl but not en.

---

### M7 — Launch polish

*US7.1 As the club, we need the site to look deliberate, load instantly, and survive being forgotten for 6 months.*

- **M7-T1** Dark mode: `data-theme` toggle in `globals.css` token block already scoped in M0-T3 → component `ThemeToggle.tsx` (localStorage + `prefers-color-scheme` default). Wood+ink palette, board feels native.
- **M7-T2** ⚑ OG/share card: real `public/og.png` (logo/plakat art, 1200×630) wired in root metadata; per-page `og:title/description` (fixes grey link previews).
- **M7-T3** A11y pass vs checklist: skip-link, focus rings on board points, contrast AA both themes, `aria-live` for game status, form-less pages have no dead interactive elements. `docs/qa-m7.md`.
- **M7-T4** Perf pass: next/image everywhere (`images.unoptimized` only needed if export blocks it — verify; else plain sized `<img>`), WebP/AVIF for vendored photos, Lighthouse ≥ 95 mobile / 98 desktop recorded in the doc.
- **M7-T5** ⚑ Legacy-URL stubs: `public/{index,zasady,wydarzenia,kontakt,galeria}.html` with meta-refresh+canonical to new routes (old links from FB/Discord history keep working; export can't 301, this is the static-site equivalent).
- **M7-T6** `docs/runbook.md`: add an event (edit one JSON), change schedule (club.json), deploy (push → Vercel). One-page, aimed at whoever is club admin in 2028.
- **M7-T7** Final gate: `npm run check` + full QA doc + production deploy to `lubelski-klub-go.vercel.app`; update club FB/Discord pinned post with new links; old Vercel deployment paused. 🚀

---

## 3. Traceability — audit finding → fixing task

| Verified finding (2026-09-18) | Task |
|---|---|
| Dead Discord invite `xeaQ8uMy` on 4/5 pages (API-verified) | M1-T2 (single working invite) |
| Raw personal phone + 2 Gmails scraped-public | M1-T2, M1-T3 guard-test, M2-T9 |
| Meeting block duplicated on pages | M1-T2/T3 + components use loaders (M2-T1, T9) |
| 2023 events in present tense | M1-T4 archived split, M2-T8 |
| "Galeria na górze" insider phrasing | M2-T5 directions-for-strangers |
| Identical `<title>` / no OG meta | M2-T12, M6-T3, M7-T2 |
| Rules wall-of-text for kids | M2-T10 split + M4-T7 replay + M4-T3 atari-go |
| Go-board image inside nav | M2-T1 (icons only) |
| "SPOTKANIA SĄ DARMOWE !!!" shouty | M2-T3 chips |
| Typos `bezpośednie`, `byc` (found during verification, not by any persona) | M2-T10 |

## 4. Sequencing & effort

```
M1 → M2 → M3 → M4 → M5
        ↘ M6 (after M2 pages exist, needs M6-T1 plumbing) ↘ M7 (last, needs all)
```
- **~65 tasks**, each ≈ one 20–60 min local-LLM session; a human reviews/commits per task. Solo-with-LLMs pace: 6–9 focused weekends for all of v1; M1+M2+M6-T1..T3 alone already launch a *better-than-today* site — cut line is legal at any milestone.
- Parallelizable: M3 runs alongside M2 by a second session (no shared files). M1-T0 must precede M2 copy tasks.

## 5. Explicit non-goals (v1)

Forum · user accounts/ladder-with-login · newsletter · upload forms/CMS · KGS/OGS live API widgets (static export can't call them per-visitor without runtime) · blog engine beyond event/news JSON. Ladder & online-club integration = v2 candidates once content muscle exists.
