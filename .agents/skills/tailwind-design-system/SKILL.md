---
name: tailwind-design-system
description: 'Style LKG components with Tailwind using the approved Papier i goban semantic tokens, shared primitives, typography, spacing and responsive behavior. Use for global CSS, Tailwind config and UI styling.'
---

# Tailwind design system

Read the token and geometry sections of `docs/design/LKG-plan-wizualny-v1.md`.
The approved redesign supersedes the old one-red-accent styling guidance.

- Define colors once in `tailwind.config.js` and derive CSS variables consistently.
  Preserve the existing direction of dependency; do not create circular theme/var references.
- Use paper/surface/sand/ink/muted-text/border/brand/brand-hover/accent/on-brand roles.
  Do not map success/error/destructive states to the brand color.
- Review every kaya usage; migrate by role, never with an indiscriminate replacement.
- Use shared Container and explicit Section spacing variants. Remove conflicting
  py/max-width utilities rather than relying on class-string ordering.
- Use named typography steps, comfortable paragraph measure and fluid hero sizes.
  Avoid fixed line breaks or reduced type sizes to squeeze Ukrainian text into a layout.
- Own button padding/height in the primitive; preserve semantic button/link behavior.
- Use mobile-first layout without fixed page widths; check 320–430px and intermediate widths.
- Maintain focus-visible on light/dark surfaces and reduced-motion support.
- Load local licensed WOFF2 fonts with swap; only required weights and scripts.
- Maintain image dimensions/aspect ratio, responsive sources and intentional object-position.
- Do not add Tailwind plugins, dependencies or utility-merging libraries merely for cosmetics.

Finish with real desktop/mobile screenshots; a successful build does not establish
that styles, layout or fonts look correct.
