# Public-pages QA gate (M2-T9)

Manual acceptance pass for the five public pages plus the privacy and not-found routes,
**before** dynamic news/admin work is considered finished. Run in a real browser at **320–430px**
and **desktop** widths, then tick every box. This is a product review, not a substitute for the
automated `npm run check` gate.

**Pages covered:** `/`, `/zacznij`, `/o-klubie`, `/kontakt`, `/prywatnosc`, and any unknown URL (404).
(`/aktualnosci` is checked separately in `docs/qa-news.md`.)

## 1. Global checks (every public page)

- [ ] Renders without horizontal scroll or layout overflow at 320px and 430px.
- [ ] Exactly one `<h1>`; heading levels descend logically (h1 → h2 → h3, no skipped levels).
- [ ] One `<header>`, one `<main>`, one `<footer>` (landmarks are correct).
- [ ] All interactive elements are keyboard-reachable and show a visible `focus-visible` ring.
- [ ] Page title/description metadata is present and unique (see `docs/qa-accessibility.md`).
- [ ] Text and links meet contrast; no `kaya` text on a low-contrast background.
- [ ] `prefers-reduced-motion` disables smooth scroll/animation (no forced motion).
- [ ] Polish renders as the default language; switching language keeps route and `<html lang>` in sync.

## 2. Home (`/`)

- [ ] Hero answers **what** the club is and **who can join** (free, beginners welcome).
- [ ] Primary CTA ("Przyjdź na spotkanie") scrolls to the meeting section.
- [ ] Secondary CTA ("Poznaj zasady") navigates to `/zacznij`.
- [ ] Four reassurance cards are present (rules, nothing to bring, free entry, children welcome).
- [ ] Meeting section shows day, time, venue, address, room and entrance hint from `club.ts`.
- [ ] Map and directions links open in the page language.
- [ ] Latest-news preview shows up to 3 posts and links to `/aktualnosci`.
- [ ] Hero image has no layout shift (dimensions set) and uses appropriate `alt`.
- [ ] Sticky mobile "Przyjdź w środę" CTA is usable and does not cover content at 320px.

## 3. Start Here (`/zacznij`)

- [ ] Six-step first-visit story reads top-to-bottom at 320px.
- [ ] FAQ is keyboard-operable (open/close via Enter/Space, `aria-expanded` correct).
- [ ] Rules steps render with the correct static diagrams and meaningful `alt`.
- [ ] Page ends with the shared meeting section (Wednesday CTA).
- [ ] Venue/address/room are interpolated from `club.ts` (no hardcoded duplicates).

## 4. About (`/o-klubie`)

- [ ] Communicates the club's purpose honestly without invented facts or bios.
- [ ] Typical-meeting description is present and matches reality.
- [ ] No personal phone/Gmail is exposed as the primary contact.

## 5. Contact (`/kontakt`)

- [ ] Club contact channels are present (Facebook/Discord where approved).
- [ ] Shared meeting section shows the same facts as Home (single source of truth).
- [ ] No contact form; no raw personal phone/Gmail as the primary channel.

## 6. Privacy (`/prywatnosc`)

- [ ] Reachable from the footer.
- [ ] Privacy notice describes only what is actually processed (no cookies/analytics/form).
- [ ] Photo-consent policy covers minors, withdrawal and uncertain cases.

## 7. Routes & not-found

- [ ] Each public route renders a deliberate page (no blank screen).
- [ ] An unknown URL shows the friendly 404 with a way back home.
- [ ] `/admin` and `/prywatnosc` are not advertised in navigation while unfinished.

## Sign-off

| Role                    | Name | Date |
| ----------------------- | ---- | ---- |
| Reviewer (public pages) |      |      |
