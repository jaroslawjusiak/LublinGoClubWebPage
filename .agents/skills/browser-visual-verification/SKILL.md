---
name: browser-visual-verification
description: "Verify LKG UI changes in a running browser through the existing Playwright MCP. Use after layout or style changes and for screenshot comparison, responsive checks, console errors and navigation evidence."
---

# Browser visual verification

Use the existing MCP server named `playwright`; do not install a second browser integration.
Discover current tool names and input schemas. Do not assume tool signatures from memory.
Read the changed stage and acceptance criteria in the visual plan.

## Workflow

1. Obtain the running dev-server URL from actual terminal output. Do not assume a port.
   Ask the parent for its URL when acting as a reviewer; do not start another server.
2. Obtain an exclusive browser slot. One shared MCP context cannot safely serve
   simultaneous navigation/resize operations from multiple agents.
3. Open the requested local route. Wait for relevant content, images and fonts to settle;
   avoid arbitrary long sleeps. Distinguish failed data requests from empty content.
4. Capture the viewport at 390px and 1440px widths (record height and zoom).
   Also inspect 320, 768 and 1024px for overflow; inspect 1920px when changing max-width.
5. Save viewport and full-page screenshots where useful under `.playwright-mcp/`.
   Inspect the actual images, not just an accessibility/DOM snapshot.
6. Compare composition, font hierarchy, spacing, crop, flags, focus and footer to the
   concept. Allow differences mandated by real content and translations.
7. Check PL/EN/UK headers and mobile switchers; test key CTA, menu, anchor and FAQ.
   Inspect console/resource failures and sticky/fixed overlap.
8. Release the browser slot and report evidence before the next agent navigates.

Use DOM/accessibility snapshots and current element references for interaction;
use screenshots for appearance. Do not treat taking a screenshot as inspecting it.
Resize tools test responsive layout; they do not prove touch-device behavior.
Check keyboard separately. Avoid signed-in production admin mutations.

## Report

For each finding include severity, route, locale, viewport, expected versus actual,
reproduction, screenshot path and likely owning component if known.
Mark checks as passed, failed or blocked. Never claim screenshot verification
when image inspection is unavailable. Ask for the missing capability or report the gap.


