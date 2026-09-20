# Lubelski Klub Go — Implementation Plan (React/Next.js)

**Version:** 1.0  
**Target Stack:** Next.js 14+ (App Router), Tailwind CSS, TypeScript, Vercel Hosting.  
**Goal:** Tier A Launch (Static pages + Minimal Admin).  
**Context:** Designed for atomic subtasks suitable for local LLM development.

---

## 1. Tech Stack & Architecture Decision

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14/15 (App Router)** | Built-in routing, Server Components (fast static pages), easy i18n support (`next-intl`), Vercel-native. |
| **Language** | **TypeScript** | Type safety reduces context needed for LLMs; easier to diff changes. |
| **Styling** | **Tailwind CSS** | Atomic utility classes allow small, self-contained component definitions (e.g., `Button`, `Card`). |
| **State/Forms** | **React Hook Form + Zod** | Minimal dependencies. Zod for schema validation (e.g., post title length). |
| **Auth** | **NextAuth.js (v5)** | Supports Google OAuth easily; server-side session management fits "2-3 admins" requirement. |
| **Data Layer** | **JSON Files (`src/data/`)** | For v1, store content in JSON files (e.g., `meetings.json`, `posts.json`). No DB needed initially. |
| **Images** | **Next.js Image Component** | Automatic optimization/resizing for mobile-first performance. |

---

## 2. Milestone 0: Foundation & Design System

### User Story: "As a developer, I want a consistent look and feel so I don't have to re-define styles every time."
*   **Goal:** Establish the visual language (Black/White + Amber accent) and layout shell before writing content.

#### Subtasks (Atomic)
1.  **Initialize Project**
    *   Run `npx create-next-app@latest lubelski-klub-go --typescript --tailwind --eslint`
    *   Create `.env.local` file with placeholder for `NEXTAUTH_SECRET`.
2.  **Configure Tailwind Theme**
    *   Edit `tailwind.config.ts`: Define colors (`stone`, `amber-700`), fonts (Sans: Inter, Serif: Merriweather).
    *   Add custom config for dark mode support (optional but recommended).
3.  **Create Layout Shell Component**
    *   Create file: `src/components/layout/RootLayout.tsx`.
    *   Implement `<html lang="pl">` wrapper with `next-intl` provider.
    *   Include `<Header />` and `<Footer />` placeholders.
4.  **Define Atomic UI Components (The "Kit")**
    *   Create file: `src/components/ui/Button.tsx`. Props: `{ variant: 'primary' | 'secondary', children, onClick }`.
    *   Create file: `src/components/ui/Card.tsx`. Props: `{ title, image, date, link? }`.
    *   Create file: `src/components/ui/MapEmbed.tsx`. Hardcode Google Maps embed for MDK nr 2.

---

## 3. Milestone 1: Static Content Pages (Tier A Core)

### User Story: "As a visitor, I want to answer 'What is this?' and 'Where are you?' within 5 seconds."
*   **Goal:** Implement the 4 core pages with real content from the audit.

#### Subtasks (Atomic)
1.  **Home Page (`/`)**
    *   Create file: `src/app/page.tsx`.
    *   **Hero Section**: Add `<h1>` "Zagraj w Go w Lublinie" + Hero Image placeholder.
    *   **CTA Buttons**: Implement "Przyjdź w środę" (scrolls to map) and "Poznaj zasady".
    *   **"Twoja pierwsza wizyta" Strip**: Create 4 cards (`<div className="grid grid-cols-2">`) with icons/text.
    *   **Latest News Preview**: Fetch from `src/data/posts.json` (create empty array first). Render top 3 using `<Card />`.
    *   **Map Section**: Embed the map component created in M0.
2.  **Start Here (`/zacznij`)**
    *   Create file: `src/app/zacznij/page.tsx`.
    *   **Part A (Rules Intro)**: Split text into `<section>` blocks for "Plansza", "Oddechy", etc. Use static images from audit.
    *   **Part B (Mini-Story)**: Create a numbered list component (`<ol>`) with the 6-step visit guide.
    *   **Part C (FAQ)**: Create an accordion component (`<details>` tags) for "Czy muszę znać zasady?".
3.  **About Page (`/o-klubie`)**
    *   Create file: `src/app/o-klubie/page.tsx`.
    *   Write "Short club story" text (copy from audit).
    *   Add "Typical Meeting" photo gallery placeholder.
4.  **Contact Page (`/kontakt`)**
    *   Create file: `src/app/kontakt/page.tsx`.
    *   Display Club Email (`mailto:`) and Social Links (FB, Discord, OGS).
    *   Embed Map again (or reuse component from Home).

---

## 4. Milestone 2: Dynamic Content & Data Layer

### User Story: "As an admin, I want to add a news post without touching code."
*   **Goal:** Create the data structure and the rendering engine for the News Feed.

#### Subtasks (Atomic)
1.  **Define Data Schema**
    *   Create file: `src/types/post.ts`. Define interface: `{ id, title, content, date, image?, tags? }`.
2.  **Create JSON Storage**
    *   Create folder: `src/data/`.
    *   Create file: `src/data/posts.json`. Initialize with 3 seed posts (from 2023 events).
3.  **News Feed Page (`/aktualnosci`)**
    *   Create file: `src/app/aktualnosci/page.tsx`.
    *   Implement "List View": Map over `posts.json` and render `<Card />` for each.
    *   Add "Load More" button (simple pagination or infinite scroll placeholder).
4.  **Image Handling**
    *   Create folder: `public/images/`. Move existing photos here.
    *   Update components to use `next/image` with `fill: true` and `alt` text.

---

## 5. Milestone 3: Admin Panel (Minimal v1)

### User Story: "As an admin, I want to publish a post in <2 minutes from my phone."
*   **Goal:** A simple form that writes directly to the JSON file or a temporary DB.

#### Subtasks (Atomic)
1.  **Authentication Setup**
    *   Install `next-auth`. Configure Google OAuth provider in `src/app/api/auth/[...nextauth]/route.ts`.
    *   Create file: `src/lib/auth.ts` for session helper functions.
2.  **Admin Layout (`/admin`)**
    *   Create file: `src/app/admin/layout.tsx`. Protect route with middleware (check if user is in allowlist).
3.  **Post Creation Form**
    *   Create file: `src/components/admin/NewPostForm.tsx`.
    *   Use React Hook Form for inputs: Title, Text (Textarea), Image Upload (`<input type="file">`).
    *   Implement "Save" function that appends a new object to `posts.json` and triggers a re-render.
4.  **Admin Dashboard**
    *   Create file: `src/app/admin/page.tsx`.
    *   List existing posts (Title + Date). Add "Edit/Delete" buttons.

---

## 6. Milestone 4: Polish, i18n & Launch Prep

### User Story: "As a user, I want the site to work in English and look professional on my phone."
*   **Goal:** Final touches for SEO, accessibility, and deployment.

#### Subtasks (Atomic)
1.  **i18n Implementation**
    *   Install `next-intl`. Configure routing (`/en`, `/uk`).
    *   Create file: `src/i18n/locales/pl.json` with hardcoded strings for UI elements ("Home", "Contact").
2.  **SEO & Metadata**
    *   Create file: `src/app/layout.tsx` (or wrapper) to inject `<title>` and `<meta name="description">`.
    *   Add OpenGraph tags (`og:image`, `og:title`) dynamically based on the page type.
3.  **Redirects for Old URLs**
    *   Create file: `src/middleware.ts` or use Next.js redirects config to map `/zasady.html` → `/zacznij`.
4.  **Accessibility Check**
    *   Ensure all images have `alt` text (use placeholder text if missing).
    *   Test contrast ratios on the "Amber" accent color against white/black backgrounds.
5.  **Final Content Migration**
    *   Copy text from old HTML files (`index.html`, `zasady.html`) into the new React components.
    *   Fix typos (e.g., *bezpośednie* → *bezpośrednio*).

---

## 7. Self-Assessment of Plan Quality

| Criteria | Score (1-10) | Justification |
| :--- | :---: | :--- |
| **Atomicity** | 9/10 | Subtasks are broken down to file-level or component-level actions, suitable for small context windows. |
| **Tech Fit** | 10/10 | Next.js + Tailwind is the industry standard for this type of "front door" site and aligns perfectly with Vercel hosting. |
| **Scope Control** | 9/10 | Explicitly separates Tier A (Launch) from Tier B/C, preventing feature creep during development. |
| **LLM Friendliness** | 8/10 | Clear file paths and component names help the LLM know exactly where to write code. |
| **Maintenance** | 9/10 | JSON-based data layer ensures content updates don't require code commits, fitting the "15 mins/week" constraint. |

**Overall Assessment: 9/10**  
*The plan is robust, scoped correctly for a volunteer team, and structured to allow an LLM to execute tasks sequentially without losing context.*