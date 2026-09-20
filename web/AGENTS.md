# 🛠️ Agent & Workflow Guide (Web Root)

This file serves as the operational manual for all LLM agents working on the Lubelski Klub Go website. All work must adhere to the locked architecture defined in `docs/ULTIMATE_IMPLEMENTATION_PLAN.md`.

## 🚀 Core Development Principles
1.  **One Task at a Time:** Always operate within the scope of a single, atomic task derived from the implementation plan's milestones (M0-M7).
2.  **Minimal Change Principle:** Make the smallest change required to satisfy the task definition. Never rewrite unrelated code or perform broad refactors without explicit instruction.
3.  **Single Source of Truth:** All meeting facts, club names, and dates must come from `src/data/club.ts` and related data files. No hardcoding in components is permitted.
4.  **Security Boundary:** The security boundary is always Supabase RLS policies (database layer), never client-side checks.

## ⚙️ Workflow & Tooling Checklist
*   **Execution Flow:** Follow the milestones sequentially: M0 $\rightarrow$ M1 $\rightarrow$ M2 $\rightarrow$ M3 $\rightarrow$ M4 $\rightarrow$ M5 $\rightarrow$ M6 $\rightarrow$ M7.
*   **Mandatory Validation Gate:** Every task **must** conclude with running `npm run check` to validate typing, linting, testing, and building before the result is reported as 'Done'.

## 🧱 Architecture Decisions (Locked)
*   **Frontend Stack:** React + TypeScript + Vite.
*   **Styling:** Tailwind CSS via tokens.
*   **Data Layer:** Supabase Postgres + RLS for backend data/auth.
*   **Routing:** `react-router-dom` with locale-prefixed routes (Polish default).

## 📂 Key Directory Map (`src/`)
| Path | Purpose | Notes |
| :--- | :--- | :--- |
| `data/` | Single Source of Truth for static club configuration. | Read-only, typed data files. |
| `components/` | Reusable UI Primitives. | Small, highly reusable components (Button, Card). |
| `pages/` | Top-level page containers. | Implement specific routes (`HomePage`, `AboutPage`). |
| `lib/` | Data access layers and business logic repositories. | E.g., `news/repository.ts`. Keeps components clean of database calls. |
| `types/` | TypeScript definitions for all data models. | e.g., `NewsPost`, `MeetingInfo`. |

## ⛔ Forbidden Actions (Anti-Patterns)
*   Do not hardcode content that could change (e.g., current meeting date, club motto). Use the `src/data/` layer instead.
*   Do not implement features listed in Milestone 12: Non-goals are explicitly forbidden for Tier A launch.

## ✅ Reporting Protocol
1.  Read task & prerequisites.
2.  Inspect repo (`read`, `glob`).
3.  Implement smallest change (use `edit` or `write`).
4.  Run validation commands (e.g., `npm run check`).
5.  Report: changed files, checks performed, unresolved issues.
6.  DO NOT proceed to the next task until **Definition of Done** is verified and reported by a human QA pass.