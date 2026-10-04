---
name: react-testing-vitest
description: 'Validate changed LKG React behavior with existing Vitest and Testing Library tests. Use for UI regressions, semantic controls, i18n behavior and the repository validation gate; avoid CSS-only test churn.'
---

# Focused regression checks

Read `package.json` and existing tests before selecting commands.
Run the repository-required `npm run check` for a completed implementation slice.

- Reuse existing Vitest/Testing Library patterns and mocks.
- Test user-visible behavior when changed: menu/FAQ state, locale links, focus,
  disabled submissions and distinct feed/form states.
- Do not add tests mirroring implementation or snapshotting Tailwind class strings.
- Use Playwright MCP for real appearance and navigation; jsdom cannot prove layout.
- Run tests on local mocks/test fixtures. Real admin create/edit/delete/upload checks
  require an identified test environment and disposable data.
- Separate pre-existing failures from introduced regressions with evidence.
- Do not silence tests, relax permissions or change production data to get a green check.
- Report commands and results; a command not executed is not a pass.

For instruction/config-only work, validate files and references; do not claim to
have run app tests or browser checks that were not performed.
