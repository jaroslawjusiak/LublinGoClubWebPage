---
name: react-component-architecture
description: Use when creating or refactoring React components in this Vite + TypeScript project — builds small typed shared primitives (Container, Section, Button, Card, Chip, SmartImage), enforces no hardcoded club facts, and keeps components testable.
---

# React Component Architecture

## When to use

Any task that creates, moves or refactors React components, especially shared UI primitives or page features.

## Rules

- **Typed props.** Export an explicit `Props` type/interface; no implicit `any`. Prefer discriminated unions over boolean soup.
- **Small.** If a component exceeds ~150 lines or mixes data access with presentation, split it. If a task touches >~3 files, split the task.
- **No club facts in components.** Meeting time, venue, room, email, social URLs and route metadata live in `src/data/` (`club.ts`, `site.ts`, `people.ts`). Components receive them as props or read from a thin selector — never inline literals.
- **No literal user-facing strings** in reusable primitives. Strings that a page owns may live in the feature, but shared primitives take content via props/children.
- **Composition over config.** Prefer `children` and small wrappers over a single component with a dozen variant props.
- **SmartImage contract:** required `alt`, explicit `width`/`height` (or aspect ratio) to prevent layout shift, `loading="lazy"` except above-the-fold hero images.
- **Button contract:** renders as `<button>` or link (`<Link>`/`<a>`) with identical focus-visible styles; supports disabled and keyboard activation.
- **No data fetching inside primitives.** Data access goes through `src/lib/*` repositories; components consume typed results and handle loading/empty/error states.

## Layout pattern

```
src/
  components/     shared primitives (no domain knowledge)
  features/<name>/  page features composed from primitives + data
  pages/          route-level components
```

## Definition of done

- Renders at 320px and desktop widths without overflow.
- Keyboard reachable; focus visible.
- No hardcoded club facts or reusable literal strings.
- Includes or updates at least one focused test when behavior is non-trivial.
