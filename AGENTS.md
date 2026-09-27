# AGENTS.md — Agent & Workflow Guide

Operational manual for LLM agents working on the Lubelski Klub Go website. All work
must follow the locked architecture in `docs/ULTIMATE_IMPLEMENTATION_PLAN.md` and the
recovery/remaining-work notes in `docs/RECOVERY_AND_REMAINING_WORK.md`.

## Core principles

1. **One task at a time.** Work within a single atomic slice; do not start the next task
   until the current task's Definition of Done is verified.
2. **Minimal change.** Make the smallest change that satisfies the task. Never rewrite
   unrelated code or perform broad refactors without instruction.
3. **Single source of truth.** Meeting facts, club names, contact and social URLs live in
   `src/data/` (`club.ts`, `site.ts`, `people.ts`). Never hardcode them in components.
4. **Security boundary.** Supabase RLS is the security boundary — never a client-only
   check. Only `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` may appear in the bundle.
5. **Unknowns stay explicit.** Never invent public facts; mark missing answers clearly.

## Workflow

- Read the task and its prerequisites before touching code.
- Inspect the repository before changing anything.
- Implement the smallest change (`edit` / `write`).
- Run the validation gate: `npm run check` (lint → typecheck → test → build).
- For UI changes, verify in a browser at 320–430px and desktop widths.
- Report: changed files, checks performed, browser observations, unresolved issues.

## Architecture (locked)

- Frontend: React + TypeScript + Vite (app at repository root, not `web/`).
- Routing: `react-router-dom`; Polish routes at the root.
- Styling: Tailwind CSS tokens (`paper`, `ink`, `muted-text`, `border`, `kaya`).
- Data: typed files in `src/data/`; news via `src/lib/news/repository.ts`.
- Map: OpenStreetMap link (no API key), localized via `locale` query param.
- i18n: `i18next` + `react-i18next`; Polish default/fallback; resources in `src/i18n/locales/`.
- Tests: Vitest + Testing Library.

## Directory map (`src/`)

| Path | Purpose |
| :--- | :--- |
| `data/` | Single source of truth for club configuration (read-only, typed). |
| `components/` | Shared UI primitives (`primitives.tsx`) and shared features (`MeetingSection`, `NewsFeed`). |
| `pages/` | Route-level page components (`HomePage`, `ZacznijPage`, …). |
| `i18n/` | i18n config + locale resources (`pl` default/fallback). |
| `lib/` | Data boundaries (`news/repository.ts`, `supabase/client.ts`). |
| `types/` | TypeScript definitions (`data_models.ts`). |

## Forbidden

- Hardcoding club facts or social URLs in components.
- Literal user-facing strings in reusable components — use i18n keys.
- Tier B/C features before the Tier A launch gate (interactive board, comments, contact
  form, RSS, dark mode, structured data, etc.).
- Storing production content in the deployed filesystem.

## Reporting

1. Read task + prerequisites. 2. Inspect repo. 3. Implement smallest change.
4. Run `npm run check`. 5. Browser-check UI changes. 6. Report changed files, checks,
observations, unresolved issues. 7. Stop until Definition of Done is satisfied.
