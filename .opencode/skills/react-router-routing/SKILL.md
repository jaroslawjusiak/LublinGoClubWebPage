---
name: react-router-routing
description: Use when configuring routes, navigation, locale-prefixed paths, not-found handling or legacy redirects in this react-router-dom project — keeps one route table, a locale wrapper, and correct Vercel redirect behavior.
---

# React Router Routing

## When to use

Route table changes, navigation, the not-found page, locale route prefixes, or legacy URL redirects.

## Route convention

Polish is the canonical default language:

```
/                 Polish home
/aktualnosci      Polish news
/zacznij          Polish Start Here
/o-klubie         Polish About
/kontakt          Polish Contact
/prywatnosc       Polish Privacy
/admin            protected admin
/en/...           English
/uk/...           Ukrainian
```

Do not support competing route conventions. If `/pl/...` is added, it must redirect/resolve consistently.

## Rules

- **One route table.** Locale routes wrap the same page components — never duplicate page implementations per language.
- **No blank screens.** An unknown route renders a deliberate, translated not-found page with a link home.
- **Locale wrapper.** A layout/route wrapper reads the locale from the URL, sets active i18n language and `<html lang>`, and passes a locale param down. Pages get locale from the router, not from storage alone.
- **Deep links.** Vercel must serve an SPA fallback so direct navigation to any route works; verify on a preview deployment, not just `localhost`.
- **Redirects.** Legacy mapping lives in `vercel.json` (permanent, no loops, query strings preserved):

```
/index.html       -> /
/zasady.html      -> /zacznij
/kontakt.html     -> /kontakt
/wydarzenia.html  -> /aktualnosci
/galeria.html     -> /aktualnosci
```

- **Admin is not public.** Never include `/admin` in the sitemap or public navigation; still ensure it resolves for signed-in admins.

## Definition of done

Every public route renders a deliberate page, unknown routes are handled, locale/URL/`lang` agree, and each legacy URL returns its intended redirect on the deployed preview.
