# News feed QA gate (M3-T5)

Manual acceptance pass for the public news feed and Home preview, **before** persistence and
admin work is considered finished. Run at **320–430px** and **desktop**, with real posts if
available (or seed data otherwise). Tick every box.

**Surface:** `/aktualnosci` and the Home "Aktualności" preview (both render the same `NewsFeed`).

## 1. Ordering & consistency

- [ ] Posts appear newest-first (descending `published_at`).
- [ ] Home preview shows the same newest posts as the feed (at most 3).
- [ ] Historical posts show their real 2023 dates — never presented as recent activity.
- [ ] Each post shows a localized publication date.

## 2. Card content

- [ ] Title, body, tag and optional external link render correctly.
- [ ] 0, 1, 2, 3 and 4-image posts all render without overflow at 320px.
- [ ] Images have meaningful `alt` when provided, and empty `alt` when decorative.
- [ ] A broken/missing image does not break the card layout (image slot has fixed dimensions).

## 3. Deliberate states

- [ ] **Loading** state shows while fetching.
- [ ] **Unconfigured** state appears when Supabase env vars are missing (distinct from empty).
- [ ] **Empty** state appears for a legitimately empty published feed.
- [ ] **Error** state surfaces a readable message (does not silently render nothing).

## 4. Mobile & keyboard

- [ ] Feed is a single column at 320–430px (no horizontal scroll).
- [ ] External-link buttons are keyboard-operable with visible focus.

## 5. No dead controls

- [ ] No "read more"/"view all" button leads nowhere (full content is in the feed).
- [ ] No invented/fictional posts are visible.

## Sign-off

| Role                 | Name | Date |
| -------------------- | ---- | ---- |
| Reviewer (news feed) |      |      |
