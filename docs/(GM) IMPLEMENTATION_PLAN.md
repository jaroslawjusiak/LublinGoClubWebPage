This implementation plan is structured around achieving **Tier A** launch functionality while adhering strictly to the constraint of developing with local LLMs that require atomic, thin subtasks.

We will assume a modern React framework like **Next.js** (or Gatsby) because it provides excellent features for Server-Side Rendering (SSR), Static Site Generation (SSG), built-in routing (critical for `i18n-ready architecture`), and simplifies the setup of static pages, which are the backbone of v1.

***

# 🚀 Implementation Plan: Lubelski Klub Go Website Rebuild (v1)

**Technology Stack:** React (using Next.js preferred), Tailwind CSS (for rapid styling/utility classes).
**Scope Limitation:** Adheres strictly to Tier A features and core maintainability constraints.
**Development Principle:** Atomic tasks, designed for incremental LLM context loading.

---

## 🎯 Milestone 0: Project Setup & Architecture Foundation

The goal is to establish the project skeleton, tooling, and fundamental reusable components before writing any feature-specific code.

### User Story (US)
As a developer/maintainer, I want the initial project structure set up so that development can begin efficiently without boilerplate issues or missing dependencies.

### Subtasks (Atomic & Thin)
1.  Initialize Next.js repository (`npm create next-app`).
2.  Install core styling library (e.g., Tailwind CSS).
3.  Configure global layout component (`<Layout>`) to handle shared elements (Header/Footer).
4.  Create basic placeholder components: `<Button />` and `<Card />`.
5.  Implement the language routing scaffold for `en`, `pl` (and stub for `uk`). *Self-correction check: Ensure all paths are set up but empty.*

---

## 🧱 Milestone 1: Core Static Pages & Visual Identity (The Skeleton)

We build out the non-dynamic, high-value pages first. These establish the visual identity and answer basic "What is this?" questions.

### User Story (US)
As a first-time visitor, I want to land on a page that immediately answers who the club is, when they meet, and what Go is, without needing to search through menus or links.

### Pages to Build: Home, About, Contact, Rules (`/zacznij`)

#### 📘 Component Group: General & Shared Elements
*   **Task:** Create a reusable `<ScheduleDisplay />` component accepting day/time/address props and displaying them consistently across multiple pages.
*   **Task:** Implement the sticky Mobile CTA button component (Visible on mobile, promoting "Przyjdź w środę").
*   **Task:** Build the SEO metadata generator function that injects title tags for all static routes.

#### 🌐 Page: /home
*   **Task:** Develop the `HeroSection` component accepting headline text and two specific CTA links (e.g., "Come Wednesday" button, "Learn Rules" button).
*   **Task:** Implement the three-column card structure (`<FirstVisitCard />`) to address newcomer fears (Cost, Skill Level, Gear).
*   **Task:** Create the `WhenAndWhereSection` component which uses `<ScheduleDisplay />` and includes a Google Maps embed iframe.

#### 📚 Page: /zacznij (Rules/Start Here)
*   **Task:** Implement the Rule Step 1 section using static diagrams, accepting image URL and Polish description text props. (Repeat for all steps: liberties, atari, etc.)
*   **Task:** Build the "Mini-Story" sequence component to guide the user's first visit journey (numbered list of steps).
*   **Task:** Implement the expectation setting FAQ section using an accordion or toggle pattern.

#### 👥 Page: /o-klubie (About)
*   **Task:** Design and build the "Typical Meeting" section, accepting multiple photo assets and descriptive text blocks to set expectations honestly.
*   **Task:** Create a simple directory component to list founding members/organizers with names, OGS nicks, and roles.

#### 📞 Page: /kontakt (Contact)
*   **Task:** Implement the main contact block showing *only* the club email address (`mailto:`).
*   **Task:** Build the social media link array component to display Facebook, Discord, etc., icons prominently.
*   **Task:** Integrate the Google Maps embed for directions/transit hints.

---

## 📰 Milestone 2: Dynamic Content & CMS Integration (Proof of Life)

The goal is to make the site feel alive and functional by adding a reliable news feed powered by an admin interface. This is the most complex milestone.

### User Story (US)
As a volunteer, I want a simple, safe administrative panel that allows me to publish new event posts from my phone in under two minutes, without needing technical help.

### Components/Features to Build: News Feed Component & Admin Panel Integration

#### 💻 Feature Group: Content Management System (CMS)
*   **Task:** Select and configure the backend API endpoint for content retrieval (e.g., Strapi / Sanity / Headless CMS). *This decision must be made first.*
*   **Task:** Create a dedicated `NewsFeedQuery` function that fetches the 3 most recent posts from the chosen API.
*   **Task:** Develop the main `<PostCard />` component to display Title, Date, and Summary text.
*   **Task:** Implement image handling within `<PostCard />` using a lightweight lightbox or gallery viewer (for displaying up to 4 photos per post).

#### 📰 Page: /aktualnosci (News Feed)
*   **Task:** Integrate the `NewsFeedQuery` into this page, ensuring posts are rendered in reverse chronological order.
*   **Task:** Develop the Admin Panel frontend wrapper component (`<AdminPanel />`) that handles secure sign-in logic (OAuth/Google). *Focus on the UI shell only.*
*   **Task:** Build the "Create Post" form component accepting Title, Rich Text Body (Markdown), Image Upload handler (API interaction needed), and Date.
*   **Task:** Implement a basic post listing table view for admin use: showing title, date, and edit/delete buttons.

---

## ✨ Milestone 3: Polish, Finalization, & Launch Readiness

We add the necessary structural elements and polish to meet professional launch standards without adding complexity that burdens volunteers.

### User Story (US)
As a search engine bot or returning member, I want the site to be structured correctly, fast, and navigable from old links so that my visit is seamless and helpful.

### Subtasks (Atomic & Thin)
1.  **Redirection Mapping:** Implement 401/301 redirects for all old URLs (`zasady.html`, `kontakt.html`, etc.) to their new Tier A equivalents.
2.  **Internationalization Scaffolding:** Add the language switcher component (PL/EN/UK) to the header, ensuring routing is handled by Next.js middleware. *Note: Content remains 100% PL.*
3.  **Accessibility Polish:** Run an audit and add missing `alt` attributes for all images on the Home page.
4.  **Privacy & Legal Pages:** Create placeholder pages (or simple component blocks) for "Privacy Policy" and "Photo Consent Policy."
5.  **Basic SEO Implementation:** Insert structured data JSON-LD (`LocalBusiness`, `Event`) into the global layout/head tag to optimize for local search.

***

## 🗓️ Summary Timeline & Dependencies Checklist

| Milestone | Core Deliverable | Key Components Built | Tech Dependency / Risk | Target Time Estimate (For a Small Team) |
| :--- | :--- | :--- | :--- | :--- |
| **0: Setup** | Working Next.js Shell & Layout | `<Layout>`, `<Button />`, Global Styling | Tailwind CSS, React Router setup | 1 Day |
| **1: Static Pages** | Full Visual Skeleton (Home, Rules, About, Contact) | `HeroSection`, `<ScheduleDisplay />`, `FirstVisitCard`, Rule Step components. | Minimal; primarily content styling/layout. | 3-4 Days |
| **2: Dynamic Content** | Functional News Feed & Admin Shell | `<PostCard />`, `NewsFeedQuery`, `<AdminPanel />` form logic (API hook). | **High:** Requires CMS setup and API interaction testing. | 5-7 Days |
| **3: Polish & Launch** | Optimized, Accessible, SEO-ready Site | Language Switcher, Redirect Handlers, Structured Data Injector. | Low; mostly configuration/testing. | 2-3 Days |

**Total Estimated Development Effort:** $\approx$ 11–15 working days (Excluding content writing time).