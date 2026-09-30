---
name: react-component-architecture
description: "Create or adjust typed LKG React components during the visual redesign while preserving data boundaries, composition, semantic controls and existing routing."
---

# React component architecture

Inspect existing primitives and component ownership before introducing a new abstraction.

- Keep React + TypeScript + Vite and the current directory structure.
  Do not introduce a new features tree or state system for visual changes.
- Share BrandMark/PageIntro only when they remove actual repeated markup.
- Use typed props and children; keep presentation separate from existing data access.
- Keep Container, Section, Button, Card and SmartImage contracts compatible with consumers.
- Preserve button versus link semantics, disabled behavior and accessible names.
- Preserve all feed/form states; do not duplicate repositories or hooks to restyle them.
- Consume facts and navigation from existing data; use i18next for reusable copy.
- Split a component when responsibilities justify it, not at an arbitrary line count.
- Check public and admin consumers when changing shared primitives.
- Add focused tests for changed behavior, not tests that assert styling class strings.
- Avoid unrelated refactors and dependency upgrades.

Follow the plan's atomic stages and report any necessary change of behavior explicitly.


