---
name: club-data-source-of-truth
description: 'Render LKG meeting details, social links, people and navigation during redesign without inventing or duplicating facts. Use for Home, MeetingSection, Contact, Header and Footer.'
---

# Club facts

Read the actual owners before changing their presentation:
`src/data/club.ts`, `site.ts`, `people.ts`, and current locale resources.

- Consume venue, time, room, entrance hint, links, domain and free-entry status from
  existing typed sources. Preserve the weekday's current translation representation.
- Do not hardcode a second copy in a hero, footer, badge or mockup-derived component.
- Preserve shared MeetingSection and locale-aware map/directions links.
- Treat PENDING facts as unconfirmed; never invent a public e-mail or substitute a
  personal contact address. Do not invent events, achievements, members or history.
- Keep all existing navigation entries and privacy link, including those omitted
  from the concept illustration.
- Use real consented club photos when available; generated people cannot represent members.
- Preserve missing-data handling rather than rendering empty links or fabricated placeholders.
- Do not call regular hours the next meeting without actual date/exception handling.

Check that Home, Contact and Footer agree after changes. Changing presentation does
not authorize editing club facts or production content.
