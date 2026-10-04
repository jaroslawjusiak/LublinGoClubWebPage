---
name: i18n-i18next
description: 'Preserve LKG PL/EN/UK translations and locale routing when changing layout, labels, language switching or html lang. Use for localization-sensitive redesign work.'
---

# LKG localization

Inspect `src/i18n/config.ts`, `locale.ts` and current resources first.
Use actual namespaces (hero, homepage, meeting, oklubie, aktualnosci, etc.);
do not create a parallel home/about/news schema based on generic examples.

- Preserve Polish root routes and the existing localized route mapping.
  Use `useLocale`/`localizePath` rather than manual string prefixes.
- Keep `pl` fallback and `pl/en/uk` key parity. Add complete translated keys
  for new approved copy; distinguish unreviewed wording in documentation.
- Keep all language flags and visible codes initially. Preserve the switcher's
  /admin exclusion, since language-prefixed admin routes are not implemented.
- Keep URL, active locale, html lang and active-language indication synchronized.
- Interpolate facts from existing data; retain the current localized weekday
  representation rather than moving factual data during a styling task.
- Avoid JSX sentence concatenation and hardcoded reusable user-facing strings.
- Check longer EN/UK labels at mobile and intermediate header widths; allow wrapping.
  Validate real font files for Polish accents and Ukrainian characters.
- Do not use screenshot text as approved content or silently abbreviate existing labels.

Run the existing parity tests and exercise switching at Home and an internal route.
Check /admin behavior separately. Do not remove locale keys to make a screenshot fit.
