---
name: club-data-source-of-truth
description: Use when working with club facts (meeting day/time, venue, room, entrance, map, email, social links, canonical domain, navigation) — keeps them in src/data as typed files and prevents duplication or hardcoding across pages.
---

# Club Data: Single Source of Truth

## When to use

Home, Contact, Footer, meeting/location rendering, navigation metadata, or any task that references meeting facts or club contact details.

## Rule

Every club fact lives once in typed files under `src/data/`:

- `club.ts` — meeting day/time, venue, address, room, entrance hint, map link/embed, free-entry status, club email, social links, canonical domain.
- `site.ts` — public navigation metadata and site-level configuration.
- `people.ts` — public organizer/person information (OGS links where available).

Pages and components consume these via imports or thin selectors. They must not duplicate the facts as literals.

## Prohibited

- Printing the meeting time/place inline in a page component.
- A second copy of the address, email or social URLs in another file.
- Personal phone numbers or personal Gmail addresses as the primary contact channel.
- Hardcoded route lists duplicated outside `site.ts`/the router.

## Types

Model Tier A only: `MeetingInfo`, `ClubConfig`, `Person`, `NewsPost`, `NewsImage`, `PostTag`, `Locale`. No members, comments or general CMS modelling.

## Verification

- Home, Contact and Footer render meeting/contact data from the same source.
- Where practical, a test rejects accidental personal phone/Gmail fields.
- Changing a fact in `src/data/` updates every consumer without editing page components.
