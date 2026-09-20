```markdown
# Lubelski Klub Go — Website Implementation Plan

## 0. Overview

This plan implements the conceptual design by focusing exclusively on **Tier A requirements** (§6) necessary for a successful launch, while explicitly deferring Tier B/C features to future iterations.

---

## 1. Milestones & Timeline

### M1: Static Content Foundation
- Duration: ~2 weeks
- Dependencies: None

### M2: Admin Panel Setup
- Duration: ~3 weeks
- Dependencies: M1 complete

### M3: Translation Infrastructure
- Duration: ~1 week
- Dependencies: M2 complete

### M4: Testing & Deployment
- Duration: ~1 week
- Dependencies: All other milestones complete

---

## 2. Static Content Foundation (M1)

**Page Inventory:**  
Keep `index.html`, `zasady.html` structure, and others from §7 ownership table.

### User Stories:

#### US01 — As a first-time visitor, I want to know what Lubelski Klub Go is
```gfm
Subtask: Create homepage content block (hero section) with:
- Strong photo of club meeting (people + boards)
- Clear headline ("Zagraj w Go...")
- Two CTA buttons ("Przyjdź w środę" and "Poznaj zasady")
```

#### US02 — As a curious beginner, I want to understand if the club is appropriate for me
```gfm

### Subtasks:

**1. Create homepage content block (hero section):**
- Add strong photo of club meeting with people clearly visible
- Write headline text: "Zagraj w Go w Lublinie..."
- Implement two CTA buttons:
  - One scrolls to location details ("Przyjdź w środę")
  - Second links to interactive rules page ("/zacznij")
  
**2. Set up static pages with placeholder content (as required by §7):**
- Create `/o-klubie` page structure
- Create `/kontakt` page structure
- Ensure all translated versions have empty bodies at launch

**3. Write key content sections:**
- Draft club story for `/o-klubie`
- Prepare FAQ list ("Twoja pierwsza wizyta" strip)

#### US03 — As an organizer, I want a central location to manage the meeting information
```gfm

### Subtask:

**1. Set up single source of truth:**
- Create `/aktualnosci/index.html` (seed for news feed)
  - Title: "Nasze spotkania"
  - Content explaining purpose and template format
  
**2. Implement redirects infrastructure:**
- Add `.redirects` file in root directory
  - Redirect old URLs to new equivalents

---

## 3. Admin Panel Setup (M2)

### User Stories:

#### US04 — As a non-technical club member, I want to publish posts by clicking an admin link
```gfm

### Subtasks:

**1. Set up OAuth authentication:**
- Choose "Sign in with Google" for simplest maintenance (as recommended)
  - Create Vercel project → connect GitHub → enable OAuth
  - Add two test admin accounts

**2. Design admin panel interface:**
- Simple list view of existing posts
- Intuitive form for creating new posts:
  - Title text input
  - Body content textarea
  - Photo upload field (client-side preview)
  - Date picker with time zone support
  - Tag selector dropdown ("spotkanie", "turniej", "wydarzenie")

**3. Implement post storage mechanism:**
- Create data format for posts:
```json5
  
#### US05 — As a returning member, I want to see what the club has been doing lately
```gfm

### Subtasks:

**1. Set up seed news feed content:**
- Convert existing events into template-formatted posts (using Markdown files)
  - Example structure for `/aktualnosci` directory:
    ```markdown
    ---
    title: "China Town Weiqi Cup"
    date: "2023-09-15T14:30:00+02:00"
    tags: ["turniej"]
    ---

    Photos and text content here...
    
    ```
  
---

## 4. Translation Infrastructure (M3)

### User Stories:

#### US06 — As a site visitor, I should see the page in their preferred language
```gfm

### Subtasks:

**1. Configure multilingual routing:**
- Add `vercel.json` with:
  ```json
  
    "routes": [
      {
        "src": "/(pl|uk)/_next/.*",
        "dest": "/index.html"
      }
    ]
  
```

---

## 5. Testing & Deployment (M4)

### User Stories:

#### US07 — As a user, I want the site to work properly on mobile devices
```gfm

### Subtasks:

**1. Implement redirects from old URLs:**
- `vercel.json` file with proper redirect rules:
  ```json
  
    "redirects": [
      {
        "source": "/old-page.html",
        "destination": "/aktualnosci/nowa-implementacja.md"
      }
    ]
  
```