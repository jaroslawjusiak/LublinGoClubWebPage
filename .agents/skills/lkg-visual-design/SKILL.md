---
name: lkg-visual-design
description: "Implement or review the approved Papier i goban appearance of the Lubelski Klub Go website. Use for public-page layout, typography, branding, hero imagery and visual acceptance; do not invent a new design direction."
---

# LKG visual design

Read `docs/design/LKG-plan-wizualny-v1.md` and inspect
`docs/design/reference/concept-a-paper-goban.png` before redesigning a screen.

## Approved direction

- Warm ivory paper, sand, charcoal, deep forest green; restrained vermilion detail.
- Public headings: Noto Serif candidate; body/navigation/admin: Noto Sans candidate.
  Validate actual fonts, licenses, Polish diacritics and Ukrainian glyphs first.
- Desktop hero: text left, natural goban/goke photo right. Mobile: text, CTA, photo.
- Light reassurance band, readable meeting panel, real feed states, dark green footer.
- Keep flags beside visible PL/EN/UK codes (or existing approved labels).
  Keep the mobile switcher outside the hamburger. Preserve /admin routing exceptions.
- Moderate spacing, simple 8px buttons and 12px panels. No oval photo frame,
  generic gradients, parallax, kanji decorations or new UI framework.
- Give admin compact sans typography and functional forms, not a marketing hero.

## Execution

1. Inspect the current component and relevant data before editing.
2. Use the written plan as the content/behavior specification and image as composition reference.
3. Keep all existing navigation, privacy and meeting facts even if omitted from the mockup.
4. Read only relevant plan sections; implement one verifiable slice.
5. Apply shared tokens and primitives; avoid page-specific parallel design systems.
6. Verify with browser screenshots and correct concrete deviations.

Do not publish draft mockup copy without approved translations. Do not fabricate news,
people, history or dates. Generate/obtain a separate production hero; do not extract it
from the screenshot. Check board geometry and cropping, and record asset provenance.


