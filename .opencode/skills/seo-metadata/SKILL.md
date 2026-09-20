---
name: seo-metadata
description: Use when adding page metadata with react-helmet-async, canonical URLs, language metadata, social sharing images, or generating sitemap.xml and robots.txt for the club site.
---

# SEO & Metadata

## When to use

Milestone 6: per-route titles/descriptions, canonical URLs, language metadata, default social image, sitemap and robots generation.

## Rules

- **Unique Polish title and description** per public route; no generic duplicates. Use `react-helmet-async`.
- **Canonical URLs** built from the configured production domain (`src/data/site.ts`), accounting for locale prefixes.
- **Language metadata:** `<html lang>` matches the active locale; reference locale alternates where supported.
- **Default social image:** one deliberate OG/Twitter image; pages may override later.
- **Admin/private routes are never public content:** noindex them and exclude from the sitemap.
- **No structured data** (LocalBusiness/Event, etc.) unless explicitly promoted into scope.
- **Sitemap:** generate public canonical routes only, at build time, using the production domain; output a valid `sitemap.xml`.
- **Robots:** `public/robots.txt` allows public crawling, points to the sitemap, and disallows private paths.

## Definition of done

Every public route has deliberate metadata, `/admin` is not promoted as public content, the generated sitemap is valid and reachable after build, and robots rules match the sitemap.
