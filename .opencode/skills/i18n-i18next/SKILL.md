---
name: i18n-i18next
description: Use when adding or changing translations, locale routes, language switching or `<html lang>` in this i18next + react-i18next project — keeps Polish as default/fallback and enforces translation-key discipline.
---

# i18n with i18next + react-i18next

## When to use

Any task touching `src/i18n/`, locale resources, user-facing strings, the language switcher, or `<html lang>`.

## Architecture

- `pl` is the **default and fallback** language. Canonical routes are Polish (`/`, `/aktualnosci`, `/zacznij`, `/o-klubie`, `/kontakt`); other languages are prefixed (`/en/...`, `/uk/...`).
- Use namespaces: `common`, `home`, `start`, `about`, `contact`, `news`.
- Configure `fallbackLng: 'pl'` and `supportedLngs: ['pl', 'en', 'uk']`.
- Create EN/UK resource skeletons but mark unreviewed content clearly; do not ship machine translations as final copy.

## Rules

- **Never put literal user-facing strings in reusable components.** Use `t('namespace:key')`. Polish source strings live in the `pl` resource files, not inline in JSX.
- **Keep keys stable and readable:** `home.hero.cta`, `start.faq.cost.question`. No generated or positional keys.
- **Parity.** When adding a key to `pl`, add the placeholder to `en` and `uk` so parity tests pass; missing keys must fall back to Polish rather than render a raw key.
- **Route, language and `<html lang>` must agree.** The locale in the URL drives the active language and the document `lang` attribute.
- **No concatenated sentences.** Use interpolation (`t('greeting', { name })`) so translators control word order.
- Keep club facts out of resources: meeting time, venue and links live in `src/data/` and are formatted/inserted, not duplicated per language.

## Validation

- Switch language at least once and confirm route, rendered language and `<html lang>` stay in sync.
- Confirm a deliberately missing key falls back to Polish without showing the key.
- Run the locale parity test if present.
