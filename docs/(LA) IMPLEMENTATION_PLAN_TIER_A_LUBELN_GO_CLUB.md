# 🚀 Project Implementation Plan: Modern Web Platform Rebuild (Tier A Cut-Line)

## Overview

### Problem Statement
The existing platform suffers from outdated architecture, poor developer experience, and difficulty in content management, and lack of scalability for new features. We are rebuilding the site to create a modern, performant, and maintainable full-stack application capable of supporting dynamic content creation and robust user authentication.

### Success Criteria (Definition of Done)
1.  **Operational Readiness:** All core pages (Homepage, About, Services/Programs listing, Contact) are deployed to staging and pass comprehensive end-to-end testing.
2.  **Content Workflow Completion:** The Admin Panel allows authorized users to Create, Read, Update, and Delete (CRUD) all primary content types (e.g., News Articles, Programs).
3.  **Authentication Reliability:** Secure user login/logout via email/password or social providers is fully implemented and tested across client and server boundaries.
4.  **Performance Baseline:** Core pages achieve a Lighthouse score of 90+ for performance and accessibility.

### Users & Interactions
*   **General Public (Primary User):** Navigates the public website, consumes content, views programs, and interacts with the contact form.
*   **Admin/Content Creator (Internal User):** Accesses the protected Admin Panel to manage site content, user data, and program listings via a dedicated dashboard.
*   **Registered Member (Secondary User):** Logs in to view personalized content or submit forms requiring identification.

***

## 🏗️ Technical Approach

### Core Architecture: Next.js with Supabase Stack
This architecture leverages the strengths of modern components for maximum developer velocity, type safety, and scalability.

| Component | Technology | Role/Purpose | Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend/Fullstack** | **Next.js (React)** | Handles client-side rendering (CSR) and server-side logic (SSR/ISR via API Routes). Defines the entire application structure. | Best-in-class React framework providing file-system routing, built-in optimization, and robust API handling. |
| **Database & Backend** | **Supabase** | PostgreSQL database for persistence; Handles Authentication (Auth); Provides Realtime capabilities (optional later phase). | Eliminates the need to manage dedicated backend services (e.g., writing custom Postgres ORMs/APIs), offering Auth, DB, and Storage out-of-the-box. |
| **Data Access Layer** | **Supabase Client Library / Next.js Server Actions** | Securely connects Next.js endpoints to Supabase for read/write operations. | Keeps database keys secure on the server side while maintaining a developer-friendly API layer (Server Components/Actions). |

### Data Model Sketch (Key Tables)
1.  `profiles`: Stores user metadata linked by `auth.users.id`.
2.  `programs`: Main listing of offerings (e.g., "Beginner Go Workshop"). Includes fields for description, dates, associated images, and status (`active`/`archived`).
3.  `articles`: Blog/News content. Contains title, slug, body (Markdown/Rich Text), author ID, published date.
4.  `pages_settings`: Global configuration settings (e.g., primary contact email, social media links).

### Critical API Endpoints & Workflow Mapping

#### 1. Authentication Flow (Public -> Protected)
*   **Endpoint:** `/api/auth/login`, `/api/auth/logout` (Implemented via NextAuth wrapper calling Supabase Auth APIs).
*   **Workflow:** User submits credentials $\rightarrow$ Client calls Login API $\rightarrow$ API validates against Supabase Auth $\rightarrow$ Returns Session Token $\rightarrow$ Client stores token and redirects to protected route (`/admin`).

#### 2. Content Creation Workflow (Admin Panel)
This is the most critical workflow. It must be entirely self-contained and secure.
*   **Page:** `/admin/create/[content_type]` (Protected by middleware checking user role).
*   **Action:** Admin selects content type (e.g., Article, Program).
*   **Interaction:** Client renders a dynamic form based on `content_type`.
    *   **Programs Form:** Requires date picker integration for scheduling and rich text editor for detailed descriptions.
    *   **Articles Form:** Utilizes Markdown input area or integrated WYSIWYG component (e.g., Slate.js).
*   **Submission:** Client submits data payload $\rightarrow$ Server Action validates required fields $\rightarrow$ Server Action executes `INSERT` operation into the relevant Supabase table, ensuring proper foreign key linking and setting the `is_published` flag.

### Major Technical Decisions & Trade-offs
| Decision | Description | Trade-off/Mitigation |
| :--- | :--- | :--- |
| **Using Next.js Server Actions** | Instead of building a dedicated REST API layer on top of Next.js API routes, we will use Server Actions for mutations (CUD operations). | **Pro:** Simplifies code significantly; less boilerplate than traditional API calls. **Con:** Requires careful handling of state and server boundaries; *Mitigation:* Use comprehensive validation libraries (e.g., Zod) on all actions. |
| **Supabase for Auth** | Leveraging Supabase's built-in, battle-tested authentication system. | **Pro:** Rapid implementation, reduces security surface area. **Con:** Vendor lock-in to the Supabase ecosystem (minor risk). *Mitigation:* Treat connection logic as an abstraction layer within a service module (`src/lib/supabase/client.ts`). |
| **Content Display** | Use Incremental Static Regeneration (ISR) for content pages (e.g., blog index). | **Pro:** Excellent SEO and performance, fast loading times. **Con:** Requires manual invalidation when content changes; *Mitigation:* Implement a Supabase Webhook listener that triggers `revalidatePath` in Next.js upon successful write operation. |

***

## 💻 Implementation Plan

### Phase 1: Foundation (Setup & Core Infrastructure)
*Goal: Get the basic stack talking and achieve secure routing.*

| Task ID | Task Description | Complexity | Dependencies | Deliverable |
| :--- | :--- | :--- | :--- | :--- |
| **F.1** | Project scaffolding: Initialize Next.js project and configure TypeScript/ESLint standards across the whole codebase. | Small | None | Clean, working boilerplate structure. |
| **F.2** | Supabase Integration: Set up environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `SERVICE_ROLE_KEY`). Implement basic client library wrapper in `/lib/supabase`. | Medium | Access to Supabase Project Keys. | Working DB connection test endpoint. |
| **F.3** | Database Schema Migration: Run necessary migrations for `profiles`, `programs`, and `articles` tables using the Supabase CLI. | Medium | F.2 completion. | Verified schema structure in staging DB. |
| **F.4** | Authentication Setup (Minimal): Implement NextAuth setup boilerplate, connecting to Supabase Auth for basic email/password login endpoints (`/login`). | Large | None | Working Login page that successfully writes a session token. |

### Phase 2: Core Functionality & Admin Panel Buildout
*Goal: Complete the main user flows and build the content management system.*

| Task ID | Task Description | Complexity | Dependencies | Deliverable |
| :--- | :--- | :--- | :--- | :--- |
| **C.1** | Public Homepage/Layout Component: Build reusable components (Header, Footer, Hero) ensuring responsiveness and linking to core routes. | Medium | F.1 completion. | Static site structure with placeholder content. |
| **C.2** | Program Listing Page (Read): Implement fetching logic for the `programs` table using Next.js server components/ISR. Display list view of all active programs. | Medium | F.3, Supabase read access. | Dynamic program listing page populated from DB. |
| **C.3** | Article Detail View (Read): Create dynamic routing (`/[slug]/page.tsx`) to fetch and display individual articles by slug/ID. Implement ISR logic. | Large | C.2 completion. | Fully functional, SEO-optimized article page. |
| **C.4** | Admin Middleware & Role Guard: Implement middleware on `/admin/*` routes to enforce authentication *and* check user roles (e.g., must be `admin`). | Medium | F.4 completion. | Protected routing; unauthorized access redirects to login. |
| **C.5** | **Admin Panel: Program CRUD:** Build the form and server actions for full CRUD operations on the `programs` table. Includes date validation and image upload handling (Supabase Storage). | Large | C.1, F.2, Supabase write access. | Complete program management dashboard view. |
| **C.6** | **Admin Panel: Article CRUD:** Build the advanced editor form for articles, incorporating rich text/markdown editing and mandatory slug generation. Implement webhook trigger testing on save. | Large | C.5 completion; Markdown library integration. | Content team can publish test articles via the dashboard. |

### Phase 3: Polish, Testing & Deployment
*Goal: Refinement, quality assurance, and handover.*

| Task ID | Task Description | Complexity | Dependencies | Deliverable |
| :--- | :--- | :--- | :--- | :--- |
| **P.1** | Form Validation & UX polish: Implement client-side validation (e.g., date ranges, required fields) and general UI/UX improvements across all forms. | Medium | C.5, C.6 completion. | Seamless user experience; no form submission errors due to input mistakes. |
| **P.2** | Error & Edge Case Handling: Implement global error boundaries (`Suspense`, `ErrorComponent`) for graceful degradation (e.g., DB offline, invalid slug). | Medium | All prior phases completed. | Robust failure handling across the application. |
| **P.3** | Comprehensive E2E Testing: Write and execute Cypress/Playwright tests covering all critical user paths: Login $\rightarrow$ Create Article $\rightarrow$ View Article on Live Site. | Large | C.5, C.6 complete logic. | Passing test suite documentation. |
| **P.4** | Documentation & Handoff: Update the `WEBSITE_REBUILD_PLAN.md` with final deployment runbooks, API schema reference, and Admin Guide for non-technical users. | Small | All testing passed. | Final project documentation set. |

***

## 💡 Considerations

### Assumptions
1.  **Supabase Tier:** We assume the selected Supabase tier supports necessary file storage (for images) and adequate row/bandwidth limits for the initial deployment scope.
2.  **Image Hosting:** Image assets will be uploaded to, and served from, Supabase Storage, requiring proper CDN configuration.
3.  **Role Definition:** Admin roles are clearly defined (e.g., `admin` role must have write access; non-admin users only read).

### Constraints
*   **Time Constraint:** Phase 2 tasks (C.5 and C.6) are the largest blockers due to required complexity, necessitating dedicated focus time.
*   **Technical Constraint:** All data mutation operations *must* pass through server actions/server components; direct client-side database writes are forbidden due to security risks.

### Risks & Mitigation
| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Auth Bypass (Critical)** | Unauthorized users gain admin access by finding an API endpoint without role checking. | Implement server middleware/Server Actions checks on *every* protected route and function call, explicitly validating the user's `role` claim from the session token before proceeding. |
| **Data Consistency** | Content pages show stale data due to missed cache invalidation after a content update. | Mandate the use of Supabase Webhooks hooked into Next.js API routes/Server Actions to trigger `revalidatePath()` for affected pages immediately upon successful write operation (C.6). |

## ⏭️ Not Included (V2 Scope)
*   **User Profile Management:** Allowing general users to edit their own information or upload profile pictures.
*   **Comments System:** Implementing a separate table and logic layer for user comments on articles/programs.
*   **Search Functionality:** Advanced, faceted search across all content types (requires integration with Algolia or dedicated vector database).
*   **Analytics Integration:** Setting up Google Analytics or similar tracking code beyond basic Next.js telemetry.