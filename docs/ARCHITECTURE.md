# Lubelski Klub Go - Architecture Report (M0-T1)

**Date:** September 20, 2026
**Author:** Senior React + TypeScript Engineer (LLM Agent)
**Scope:** Repository Inspection for Tier A Launch Planning.

## 1. High-Level Overview & Status
The repository structure is currently a mix of development tooling boilerplate (`.opencode`) and initial documentation/project definition files. The actual application source code directory, following the plan's recommendation (M145: `src/`), does not yet contain foundational components or pages.

**Status:** Initial scaffolding required. No working product features are present to inspect. We must establish the mandated structure before proceeding with implementation tasks.

## 2. Technology Stack & Configuration
*   **Package Manager:** NPM (Used for managing dependencies and running scripts).
*   **Frontend Framework:** React + TypeScript (Confirmed by `package.json` and project goals).
*   **Build Tool:** Vite (Defined in `package.json`).
*   **Styling:** Tailwind CSS (Required via `devDependencies` and enforced by the locked architecture plan).
*   **State Management/Data Access:** Supabase Client (`@supabase/supabase-js`) is included in dependencies, indicating its planned use as the primary data source for news and auth.
*   **Internationalization:** Libraries are available but no core i18n files have been structured yet (Planned: `src/i18n/`).

## 3. Directory Structure Assessment (Based on Plan M140-M167)
The current repository structure is highly sparse in the functional areas. To align with the locked plan, the following conceptual directory map must be established and maintained:

```text
LublinGoClubWebPage/
├── docs/                           # Documentation for process and plans
│   ├── WEBSITE_REBUILD_PLAN.md     # Existing operational plan
│   ├── ULTIMATE_IMPLEMENTATION_PLAN.md # Current master guide
│   ├── ADMIN_SETUP.md              # To be created/updated (M7-T3)
│   └── GOVERNANCE.md               # To be created (M7-T2)
└── web/                            # Vercel project root (The actual SPA source)
    └── src/                        # CORE APPLICATION SOURCE ROOT
        ├── app/                    # Route components, Layouts
        ├── components/             # Shared UI Primitives (Button, Card, etc.)
        ├── pages/                  # Page-specific wrappers (Home, AboutPage)
        ├── data/                   # Single Source of Truth for Config (`club.ts`)
        ├── features/               # Complex, self-contained feature groups
        ├── i18n/                   # Translation files and config
        ├── lib/                    # Utility functions (NewsRepository)
        └── types/                  # TypeScript interfaces/types
```

## 4. Technical Component Assessment & Actions Required

*   **Routing:** No routing configuration files are present (`react-router-dom` is installed but routes must be defined). **Action:** Must define the main router setup in `src/App.tsx`/`src/Router.tsx`.
*   **Styling:** The Tailwind setup appears provisioned, but global styles and utility components need to be created in the designated `styles/` location within `web/src`.
*   **Testing:** Dev dependencies for testing are present (`vitest`, `@typescript-eslint/...`). **Action:** Initial test files must be scaffolded.
*   **Assets:** The directory `reference/legacy-site/` exists and is reserved for the historical content (M0-T5).

## 5. Conclusion & Next Steps
The repository currently provides the *tools* but not the *structure*. We are starting from a foundational level of code scaffolding.

**Conclusion:** No existing infrastructure needs to be preserved or modified other than setting up the correct folder structure within `web/src` and ensuring all necessary entry points (App, index.tsx) are established. The architectural assumptions locked in M140-M167 can proceed immediately as if we were starting from scratch, guided by the plan's requirements.

**Next Milestone Target:** M0-T2 — Scaffold or normalize the React application. This involves creating the basic file structure (`src/`, `App.tsx`, `index.tsx`, etc.) and ensuring the development server runs successfully with a clean shell.