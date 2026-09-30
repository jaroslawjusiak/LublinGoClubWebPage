// src/types/meeting.ts
/**
 * @description Represents fixed, canonical meeting information for the club.
 */
export interface MeetingInfo {
  startTime: string; // HH:MM - e.g., "17:00"
  endTime: string; // HH:MM - e.g., "20:00"
  venueName: string; // Full official name of the location
  addressLine: string; // Street address line 1, e.g. "ul. Bernardyńska 14a"
  postalCode: string; // e.g. "20-950"
  city: string; // e.g. "Lublin"
  roomNumber: string; // Specific room label, e.g. "sala 14"
  entranceHint: string; // Short hint for finding the room, e.g. "galeria na górze"
  mapUrl: string; // OpenStreetMap link (no API key) for the venue
  directionsUrl: string; // External link that opens turn-by-turn directions
}

// NOTE on the weekday: the meeting day is rendered from the `meeting:day_of_week`
// i18n key (Polish "środa", English "Wednesday", Ukrainian "середа") rather than
// stored as a literal in `MeetingInfo`, so it localizes with the rest of the page.

// src/types/club_config.ts
/**
 * @description Defines global, immutable configuration details about the club itself.
 */
export interface ClubConfig {
  name: string;
  slogan: string; // Short value proposition for the website
  canonicalDomain: string; // The primary domain
  isFreeEntry: boolean;
  // Club-level public contact channel. Intentionally absent until a real,
  // club-owned address is approved by an organizer (never a personal phone or Gmail).
  email?: string;
}

/**
 * Public destinations for the club's online presence. Only real, verified links
 * should be set here; leave a field undefined until an organizer confirms it.
 */
export interface SocialLinks {
  facebook?: string;
  discord?: string;
  ogs?: string; // OGS club group (URL not yet verified)
  polishGoAssociation?: string; // Polish Go Association (URL not yet verified)
}

/**
 * A single entry in the public navigation. `labelKey` is an i18n key, never a
 * literal string, so the same list can be reused for any locale.
 */
export interface NavItem {
  path: string;
  labelKey: string;
}

// src/types/person.ts
/**
 * @description Represents a key person involved in running the club or featured in history.
 */
export interface Person {
  name: string;
  role: string; // e.g., "Organizer", "Founder", "Mentor"
  ogsHandle?: string; // Optional OGS/Social handle link
}

// src/types/news.ts
/**
 * The single optional tag a post can carry (one dropdown in the admin UI).
 */
export type PostTag = 'spotkanie' | 'turniej' | 'wydarzenie';

/**
 * A single photo attached to a news post. Every image carries an alternative
 * text; an empty `alt` marks the image as decorative (e.g. a board/hands shot)
 * so screen readers skip it, exactly like `<img alt="">`.
 */
export interface NewsImage {
  url: string; // Public URL (Supabase Storage reference), never binary data.
  alt: string; // Meaningful alternative text; '' when the photo is decorative.
}

/**
 * @description A single news post as consumed by the UI. The news repository is
 * the only place that knows the raw `posts` row shape; components get this
 * display model instead.
 */
export interface NewsPost {
  id: string; // UUID primary key
  title: string; // Primary title
  body: string; // Short body text (the full content; no HTML)
  publishedAt: string; // ISO 8601 date, e.g. "2023-11-18"
  published: boolean; // True when visible publicly; false means it is a draft
  tag?: PostTag; // Optional single tag
  images: NewsImage[]; // 0-4 photos, each with its own alternative text
  externalUrl?: string; // Optional external link (e.g. tournament page)
}

// src/types/locale.ts
/**
 * @description Defines available language codes and fallbacks.
 */
export type Locale = 'pl' | 'en' | 'uk';
