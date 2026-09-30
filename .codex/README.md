# Codex CLI — Lubelski Klub Go

This setup prepares the approved **Papier i goban** redesign. It does not change the application.

## Layout

- `.codex/config.toml`: two concurrent subagent slots; model and MCP inherited.
- `.codex/agents/`: frontend_implementer, visual_reviewer, regression_reviewer.
- `.agents/skills/`: auto-discovered repository skills (not personal skill installs).
- `docs/design/LKG-plan-wizualny-v1.md`: detailed implementation and acceptance plan.
- `docs/design/reference/concept-a-paper-goban.png`: approved composition reference.

Use a recent Codex CLI supporting standalone custom-agent TOML files. These files
use the documented format checked on 2026-09-30; no model ID is pinned.
Project configuration may require trusting this repository in your local Codex setup.
Do not overwrite your existing user config.

## Browser setup

The maintainer already added Playwright MCP. In Codex, use `/mcp` to verify it is
available and `/skills` to inspect repository skills. If missing, configure it once:

```bash
codex mcp add playwright -- npx -y @playwright/mcp@latest
```

The standard mode is sufficient. Add `--extension` only when intentionally connecting
to an existing Chrome/Edge session through the extension. Having the extension
installed does not automatically enable that mode. If Codex runs in WSL/container,
ensure its browser can actually reach the dev server URL.

Do not run parent and reviewer navigation concurrently in one browser context.
Assign a browser slot; reviewers inspect and save evidence, then release it.
Use separate contexts only when the tool supports them and each agent has a known context.
Store disposable screenshots under `.playwright-mcp/` (already ignored). Commit
curated before/after screenshots only if requested, with private admin data removed.

## Starting prompt (Polish)

> Przeczytaj AGENTS.md, docs/design/LKG-plan-wizualny-v1.md i obejrzyj
> docs/design/reference/concept-a-paper-goban.png. Kierunek Papier i goban został
> zaakceptowany; zachowaj flagi obok widocznych kodów języków na desktopie i telefonie.
> Użyj $lkg-visual-design, $tailwind-design-system i $browser-visual-verification.
> Zacznij od V0: sprawdź bieżący stan, uruchom projekt i potwierdź działanie Playwright
> MCP screenshotami przy 390 i 1440 px. Następnie wdrażaj plan etapami. Ty jesteś
> jedynym agentem zmieniającym kod aplikacji. Po etapie strony głównej zleć
> visual_reviewer ocenę wyglądu, a regression_reviewer ocenę regresji. Przeglądy
> przeglądarkowe wykonuj kolejno. Popraw wykryte problemy przed następnym etapem.
> Korzystaj z istniejącego modelu danych i funkcji. Nie publikuj strony ani wpisów.

If subagents are unavailable in the installed CLI, the primary can perform these
same review passes sequentially. Do not claim a separate review was performed.

## References and assets

The concept image is a generated mockup, not a production hero or exact font specimen.
It simplifies navigation/footer and uses draft wording. Preserve all existing links,
flags, privacy link, meeting details and feed states as required by the written plan.
Prepare the real hero separately; verify Go geometry. Do not crop assets out of this mockup.
A real club photograph is preferable for About; do not fabricate members or events.

## Sources checked

- https://learn.chatgpt.com/docs/agent-configuration/subagents
- https://learn.chatgpt.com/docs/build-skills
- https://learn.chatgpt.com/docs/extend/mcp?surface=cli
- https://github.com/microsoft/playwright-mcp

