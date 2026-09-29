// src/types/meeting.ts
/**
 * @description Represents fixed, canonical meeting information for the club.
 */
export interface MeetingInfo {
  dayOfWeek: string; // Display label for the default language, e.g. "środa" (see note below)
  startTime: string; // HH:MM - e.g., "17:00"
  endTime: string;   // HH:MM - e.g., "20:00"
  venueName: string; // Full official name of the location
  addressLine: string; // Street address line 1, e.g. "ul. Bernardyńska 14a"
  postalCode: string; // e.g. "20-950"
  city: string; // e.g. "Lublin"
  roomNumber: string; // Specific room label, e.g. "sala 14"
  entranceHint: string; // Short hint for finding the room, e.g. "galeria na górze"
  mapUrl: string; // OpenStreetMap link (no API key) for the venue
  directionsUrl: string; // External link that opens turn-by-turn directions
}

// NOTE on `dayOfWeek`: Polish is the default language and launches first, so the
// label is stored in Polish here. Rendering must use the correct Polish inflection
// (e.g. "w każdą środę"), and this value should become an i18n key once EN/UK
// translations are reviewed (see R2/M2-T2). Never store the English weekday.

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
 * @description Defines a single, published news post.
 * The shape mirrors the `posts` table (see supabase migration) exactly, so the
 * repository mapping never needs to guess column names or fill in empty values.
 */
export interface NewsPost {
  id: string;           // UUID primary key
  title: string;        // Primary title
  body: string;         // Short body text (the full content; no HTML)
  publishedAt: string;  // ISO 8601 date, e.g. "2023-11-18"
  published: boolean;   // True when visible publicly; false means it is a draft
  tag?: PostTag;        // Optional single tag
  images: string[];     // 0-4 image URLs (Supabase Storage references)
  externalUrl?: string; // Optional external link (e.g. tournament page)
}

// src/types/locale.ts
/**
 * @description Defines available language codes and fallbacks.
 */
export type Locale = 'pl' | 'en' | 'uk';