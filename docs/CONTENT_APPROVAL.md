# Content approval & launch-content inventory (N2)

The launch gate is: **no placeholder, fictional post, broken image, or unapproved photo of an
identifiable person remains.** Most of this needs a named club decision, which an agent cannot
invent. This file tracks every such item so none is forgotten.

**How to read:** `[ ]` pending · `[~]` partial (in use but unverified) · `[x]` approved.

## 1. Club facts & destinations (single source of truth)

These live in `src/data/club.ts`. Confirm each with an organizer; do not leave guessed values.

| Item                   | Current state                                         | Status                            |
| ---------------------- | ----------------------------------------------------- | --------------------------------- |
| Canonical domain / DNS | `lubelski-klub-go.pl` (Vercel URL as alias)           | [ ] confirm DNS control           |
| Club email             | unset (`clubConfig.email`)                            | [ ] no club-owned address yet     |
| Facebook               | `facebook.com/KlubGoLublin/`                          | [~] from old site, unverified     |
| Discord                | `discord.gg/xeaQ8uMy`                                 | [~] old site had two invite codes |
| OGS group              | unset                                                 | [ ] not verified                  |
| Polish Go Association  | unset                                                 | [ ] not verified                  |
| Venue name             | `Młodzieżowy Dom Kultury nr 2`                        | [~] from old site                 |
| Address / room / hint  | `ul. Bernardyńska 14a`, `sala 14`, `Galeria na górze` | [~] from old site                 |

## 2. Photography & consent (BLOCKING)

| Asset                                                                                      | Where used                          | Status                                                                      |
| ------------------------------------------------------------------------------------------ | ----------------------------------- | --------------------------------------------------------------------------- |
| Hero image                                                                                 | Home (`public/assets/go-board.png`) | [~] non-identifying board graphic (temporary); needs a consented club photo |
| About / typical-meeting photos                                                             | About page                          | [ ] none added                                                              |
| `photo/china-town/amelia.png`, `piotrek.jpg`, `tomek.jpg`, `jarek.jpg`, `participants.jpg` | would-be news/event photos          | [ ] **identifiable people — no consent recorded; do NOT publish**           |
| `photo/akira/Akiracon.jpg` (event poster)                                                  | would-be news photo                 | [~] non-identifying; attribution/rights unknown                             |
| Rules diagrams (`assets/zasady/*.jpg`)                                                     | `/zacznij`                          | [x] in use (static diagrams)                                                |

**Minors rule:** any photo of a minor requires explicit parental consent; default to crowd / hands
/ board shots when in doubt.

## 3. Club story & people

| Item                                                 | Status                                                                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Club story (founding, connection to MDK nr 2)        | [~] About page currently has minimal honest copy; fuller story needs organizer input                          |
| Organizer bios / ranks                               | [ ] not published                                                                                             |
| Contact persons + OGS handles (`src/data/people.ts`) | [~] from old site (`Piotr Dyszczyk`/`shin0e`, `Jarosław Jusiak`/`jaroslaw.jusiak`); re-confirm before showing |

## 4. Historical posts (prepared — see `src/lib/news/seed.ts`)

Correct dates captured from the old `wydarzenia.html`. These are **archive items, not recent
activity**; when published they must show their 2023 dates.

| Post                                        | Date       | Tag          | External link       | Images                                   |
| ------------------------------------------- | ---------- | ------------ | ------------------- | ---------------------------------------- |
| AKIRA Hello World — Festiwal Spotkań Kultur | 2023-11-18 | `wydarzenie` | akiracon.pl         | `Akiracon.jpg` (poster) — pending upload |
| III edycja turnieju „China Town” Weiqi Cup  | 2023-10-14 | `turniej`    | szalenisamuraje.org | people photos — pending consent          |

## 5. Admin, translations & continuity (later tasks)

| Item                                                                  | Status   |
| --------------------------------------------------------------------- | -------- |
| Which Google accounts may administer posts                            | [ ] (M5) |
| EN / UK translation reviewers + content owner                         | [ ]      |
| Second access holder for domain / hosting / GitHub / Supabase / email | [ ] (M7) |

---

**How to close N2:** an organizer approves items 1–4 above (facts, consent, story, historical
dates) and the `[ ]` cells are filled in. Until then the site ships with honest, non-identifying
content and no invented facts.
