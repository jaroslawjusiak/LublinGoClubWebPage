---
name: react-testing-vitest
description: Use when writing or running tests with Vitest and Testing Library in this project — covers component tests, repository mapping tests, i18n fallback tests, and the check/lint/type gate.
---

# Testing with Vitest + Testing Library

## When to use

Adding tests for components, repository mappings, validation, image utilities, i18n fallback, or running the quality gates.

## Setup expectations

- Provide `typecheck`, `lint`, `test`, `build` and `check` scripts. `check` runs the non-interactive type, lint, test and build gates.
- Vitest with a jsdom environment; Testing Library for React; `user-event` for interaction.

## Rules

- **Test behavior, not implementation.** Query by role/label/text (`getByRole`, `getByLabelText`), not by class or test id unless unavoidable.
- **One meaningful assertion path per test.** Prefer a few focused tests over one giant render.
- **Repository boundary tests:** verify row → `NewsPost` mapping and descending published order with fake rows; components should not be tested against Supabase directly.
- **i18n tests:** assert a missing key falls back to Polish and does not render the raw key; assert locale/route/`<html lang>` agreement where relevant.
- **Avoid snapshot sprawl.** Snapshots are optional; behavior assertions are required.
- Keep tests fast and deterministic; no network calls. Mock at the repository/client boundary, not deep in React internals.

## Commands

```bash
npm run test          # Vitest
npm run typecheck     # tsc --noEmit
npm run lint          # ESLint
npm run build         # production build
npm run check         # all non-interactive gates
```

## Definition of done

New non-trivial behavior has at least one focused test, and `npm run check` passes on the baseline and after the change.
