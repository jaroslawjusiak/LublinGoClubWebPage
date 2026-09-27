# Launch acceptance checklist

Run these four scenarios on a **deployed preview** with a real phone and a human club
representative before going live. Tick every box.

## 1. New visitor

- [ ] Understands the club is free and beginner-friendly from the home hero.
- [ ] Finds the meeting day, time and location.
- [ ] Opens directions from the meeting section.
- [ ] Opens the map in the same language as the page.

## 2. First visit

- [ ] Reads the six-step story on `/zacznij`.
- [ ] Gets answers from the FAQ (rules, equipment, cost, children, alone, room 14).
- [ ] Learns the rules from the static diagrams.

## 3. Admin — two-minute publishing flow

- [ ] Signs in with Google.
- [ ] Creates a post with phone photos in under two minutes.
- [ ] Verifies the post appears publicly.
- [ ] Edits it and verifies the change.
- [ ] Deletes it and verifies it disappears.
- [ ] A non-allowlisted account cannot publish (RLS blocks the write).

## 4. Regression

- [ ] All five public routes render; an unknown URL shows the friendly 404.
- [ ] Mobile navigation works at 320–430px and desktop (keyboard + touch).
- [ ] Legacy URLs redirect: `/index.html`, `/zasady.html`, `/kontakt.html`,
      `/wydarzenia.html`, `/galeria.html`.
- [ ] Privacy policy and photo-consent policy are reachable from the footer.
- [ ] `sitemap.xml` and `robots.txt` serve; `/admin` is excluded.
- [ ] Per-route titles/descriptions (metadata) are present.
- [ ] No placeholder/fictional content or unapproved identifiable photos remain.

## Sign-off

| Role | Name | Date |
| --- | --- | --- |
| Owner (facts + content) | | |
| Reviewer (translation) | | |
| Second access holder | | |
