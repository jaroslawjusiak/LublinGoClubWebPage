---
name: accessibility-wcag
description: 'Implement or review LKG UI accessibility during the redesign: keyboard navigation, focus, landmarks, menu, FAQ, images, contrast, reflow and admin form feedback.'
---

# Accessibility

- Preserve one main landmark and one descriptive H1 per page; choose heading level
  by document hierarchy, not desired size. Multiple labeled nav landmarks are valid.
- Operate menu, FAQ, image controls and admin inputs with keyboard alone.
  Dialogs trap/restore focus; disclosures need appropriate expanded/control state.
- Give icon buttons accessible names; do not use a flag as the only language label.
- Check focus-visible and contrast on both paper and dark-green backgrounds:
  ordinary text 4.5:1, large text 3:1, required UI boundaries/state indicators 3:1.
  A decorative separator need not be an input's only visible boundary.
- Check reflow at 320px and enlarged text/zoom; ensure sticky bars never hide content.
- Use meaningful alt for informative images and empty alt for decorative ones.
  Preserve accurate static Go-diagram explanations; never generate instructional diagrams.
- Maintain labels, associated errors, pending/disabled feedback and live announcements
  where appropriate. Never convey an error solely through red.
- Confirm document lang follows locale and reduced-motion works.
- Use automated accessibility checks only if already available; also perform a manual pass.
  Report limits instead of claiming full WCAG compliance.

Record concrete findings with route, state and evidence. Coordinate browser ownership
through browser-visual-verification. Do not change application code when reviewing.
