---
name: tailwind-design-system
description: Use when styling with Tailwind CSS in this project — defines and applies the paper/ink/kaya design tokens, typography scale, focus styles, responsive container and reduced-motion behavior for a calm, spacious, readable aesthetic.
---

# Tailwind Design System

## When to use

Design-token work, global styles, Tailwind config changes, or any task where consistent visual quality matters (Milestone 1 tokens and all page work).

## Token layer

Define semantic tokens once, then use them everywhere instead of raw palette classes.

| Token | Purpose |
|---|---|
| paper / background | calm off-white surfaces |
| ink | primary readable text |
| muted | secondary text, captions |
| border | subtle separators and card edges |
| kaya / goban accent | one warm accent only |

Expose tokens as CSS custom properties in the global stylesheet and reference them from Tailwind config (`theme.extend.colors`) so both utility classes and raw CSS agree.

## Rules

- **One accent.** The warm kaya/goban accent is used sparingly for CTAs and highlights, never as a decorative flood.
- **Typography scale.** Define a small, deliberate scale (e.g. display / h1 / h2 / body / caption). Do not invent one-off font sizes inline.
- **Focus styles.** Every interactive element has a visible `focus-visible` ring that meets contrast; never remove outlines without a replacement.
- **Responsive container.** One shared `Container` primitive controls max width and horizontal padding; pages do not hand-roll widths.
- **Reduced motion.** Respect `prefers-reduced-motion` globally; disable non-essential transitions.
- **Calm and spacious.** Prefer generous spacing and readable line length (~60–75ch) over density or ornament.
- **Mobile-first.** Style for 320–430px first, then enhance at `sm`/`md`/`lg`.

## Anti-patterns

- Arbitrary values like `text-[13px]` or `mt-[7px]` when a token/scale value exists.
- Multiple competing accent colors.
- Fixed pixel page widths that break at 320px.
- `outline-none` with no `focus-visible` replacement.

## Definition of done

A demo or page component renders token colors and the typography scale correctly at mobile and desktop widths, with visible focus states and reduced-motion respected.
