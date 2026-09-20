---
name: accessibility-wcag
description: Use when building or reviewing UI for accessibility in this project — semantic landmarks, heading hierarchy, keyboard navigation, focus states, FAQ/menu/image controls, alt text, contrast and reduced motion.
---

# Accessibility (WCAG) for the Club Site

## When to use

Every UI task, and the dedicated accessibility pass (M6-T1): public pages, mobile menu, FAQ, image viewer, admin controls.

## Checklist

- **Landmarks:** one `<header>`, `<nav>`, `<main>`, `<footer>`; main content is reachable and unique.
- **Headings:** exactly one `<h1>` per page, logical descending order, no skipped levels for styling.
- **Keyboard:** all interactive elements reachable and operable by keyboard; the mobile menu, FAQ accordion and image viewer work without a mouse; focus returns to the trigger on close.
- **Focus:** visible `focus-visible` styling on every control; no focus traps except intentional dialogs, which must trap and restore.
- **Images:** meaningful `alt` for content images; empty `alt=""` for purely decorative ones; diagrams describe the Go concept they teach.
- **Controls:** icon buttons have accessible names; toggles expose state (`aria-expanded`, `aria-pressed`); FAQ uses button + region semantics.
- **Contrast:** body text and interactive states meet AA contrast against the paper background.
- **Motion:** respect `prefers-reduced-motion`; no non-essential animation.
- **Forms:** labels tied to inputs; concise, associated validation errors (admin form).
- **Language:** `<html lang>` matches the active locale.

## Method

1. Automated checks / axe where available.
2. Manual keyboard-only pass through each public page and the admin controls.
3. Record findings in `docs/qa-accessibility.md` with route and severity.

## Definition of done

No known critical accessibility issue remains on the five public pages, and admin controls are keyboard usable.
