# Accessibility review (M6-T1)

Manual review of the five public pages + admin controls, plus the automated checks
already present. No critical issues found; remaining items are noted below.

## Landmarks & structure

- One `<header>` (with primary `<nav>`), one `<main>`, one `<footer>` on every page.
- Exactly one `<h1>` per page; heading levels descend logically (h1 → h2 → h3).
- The admin page uses the same landmark structure and is keyboard-usable.

## Keyboard & focus

- Mobile menu: button with `aria-expanded`/`aria-controls`, closes on navigation and
  `Escape`, and is not focusable when closed (conditional mount).
- FAQ accordion: question `<button>` + `aria-expanded` + `region`/`aria-labelledby`;
  closed answers use the `hidden` attribute (out of the accessibility tree).
- All interactive elements have `focus-visible` rings (primitives + components).
- Admin form: labelled inputs (`<label htmlFor>`), inline `role="alert"` errors,
  delete guarded by a `confirm()` dialog.

## Images

- Content diagrams (`/zacznij` rules) have meaningful alt describing the concept.
- Decorative/supplementary images (hero board, news photos) use `alt=""`.
- `SmartImage` / plain `<img>` set width/height to avoid layout shift.

## Contrast & motion

- Text uses `ink` (#1e293b) on `paper` (#fcfaf7) — comfortably above AA.
- Accent `kaya` (#a52a2a) is used for headings/links; it meets AA on `paper` for the
  sizes used. (Re-check any small white-on-kaya text at audit time.)
- The Home "scroll to meeting" respects `prefers-reduced-motion`; no other
  non-essential animation is used.

## Forms & controls (admin)

- Icon-only buttons carry `aria-label` (menu toggle, remove-photo).
- Validation errors are concise and associated with their field.

## Remaining / to verify on a live device

- Full keyboard-only pass on a real phone (menu, FAQ, admin form).
- Confirm contrast of the `kaya` "free entry" badge text.
- The admin image picker + form on a 320px viewport (not yet exercised end-to-end,
  pending a Supabase project — see `docs/ADMIN_SETUP.md`).
