# Lubelski Klub Go — website

The front-door website for **Lubelski Klub Go**, a Go club in Lublin (Poland). It is a
React + TypeScript + Vite single-page app. Polish is the default language.

## Requirements

- Node.js 18+ and npm.

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and set the Supabase public credentials if you want the
news feed to load (optional for local development — without them the feed shows a
"not configured" state):

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest (with coverage) |
| `npm run check` | lint → typecheck → test → build (the required gate) |

## Project structure

See `docs/ARCHITECTURE.md` for the architecture and directory map. The short version:

- `src/data/` — the single source of truth for club facts (meeting, venue, links).
- `src/components/` — shared UI primitives and shared features (`MeetingSection`, `NewsFeed`).
- `src/pages/` — one component per route.
- `src/i18n/` — i18next config + `pl` (default) / `en` locale resources.
- `src/lib/` — data boundaries (`news/repository.ts`, `supabase/client.ts`).
- `reference/legacy-site/` — read-only copy of the old site (not served).

## Where things stand

See `docs/IMPLEMENTATION_STATUS.md` for the honest per-task snapshot, and
`docs/RECOVERY_AND_REMAINING_WORK.md` for the current recovery plan. The Tier A public
site is implemented; Supabase persistence and the admin publishing workflow are still
pending.
