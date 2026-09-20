---
name: vite-vercel-deploy
description: Use when configuring Vite build, npm scripts, Vercel hosting, SPA fallback, environment variables, sitemap/robots or legacy redirects for this repository — keeps deployment deterministic without committing secrets.
---

# Vite Build & Vercel Deployment

## When to use

Milestone 0 scaffolding, `npm run check`, Vercel project configuration, environment variable wiring, sitemap/robots generation, or redirect configuration.

## Scripts

Provide and use:

```bash
npm run dev        # Vite dev server
npm run build      # production build
npm run preview    # preview the built output
npm run typecheck  # tsc --noEmit
npm run lint       # ESLint
npm run test       # Vitest
npm run check      # type + lint + test + build, non-interactive
```

## Vercel configuration

- Set the project **root directory** to the app location (`web/` if that layout is used).
- Build command `npm run build`; output `dist` (Vite default).
- **SPA fallback:** rewrite all non-asset paths to `/index.html` so deep links and locale routes work.
- **Redirects:** permanent legacy mappings with no loops and query strings preserved:

```
/index.html       -> /
/zasady.html      -> /zacznij
/kontakt.html     -> /kontakt
/wydarzenia.html  -> /aktualnosci
/galeria.html     -> /aktualnosci
```

- **Environment variables:** manage via Vercel Environment Variables per environment (Production / Preview / Development). Only `VITE_`-prefixed values reach the client bundle. Never commit secrets or Supabase service-role keys.
- **Sitemap/robots:** generate public canonical routes only; exclude `/admin` and private paths; use the production domain.

## Verification

1. `npm run build` succeeds and `npm run preview` serves the app.
2. On a Vercel preview: deep links, locale routes, public feed and `/admin` resolve.
3. Each legacy URL returns its intended redirect.
4. Sitemap is valid and reachable after build; `/admin` is absent.

> Note: Vercel Environment Variables are encrypted at rest and scoped per environment, which makes them a valid production secrets store for this project.
