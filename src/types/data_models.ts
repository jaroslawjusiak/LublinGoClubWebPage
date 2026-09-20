// src/types/meeting.ts
/**
 * @description Represents fixed, canonical meeting information for the club.
 */
export interface MeetingInfo {
  dayOfWeek: string; // e.g., "Wednesday"
  startTime: string; // HH:MM - e.g., "17:00"
  endTime: string;   // HH:MM - e.g., "20:00"
  venueName: string; // Full name of the location (e.g., MDK)
  addressLine: string; // Street address line 1
  roomNumber: string; // Specific room number (e.g., 14)
  entranceHint: string; // Directions to entry point/specific building entrance
}

// src/types/club_config.ts
/**
 * @description Defines global, immutable configuration details about the club itself.
 */
export interface ClubConfig {
    name: string;
    slogan: string; // Short value proposition for the website
    canonicalDomain: string; // The primary domain (e.g., "klubgo-lublin.pl")
    isFreeEntry: boolean;
    // Consolidated contact info moved here to satisfy components using global config
    phone?: string;
    email?: string;
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
 * @description Defines a single, published news article post.
 */
export interface NewsPost {
  id: string;       // UUID or unique slug
  title: string;    // Primary title of the post
  summary: string;  // Short blurb for listing/preview
  bodyHtml?: string; // The main content (will be rendered as HTML)
  publishedDate: Date | string; // When it was published
  tags: string[];     // Array of tags (e.g., ["history", "tournament"])
  imageUrlReferences: string[]; // Array of references to images in Supabase Storage
  hasExternalLink?: boolean; // If the post links externally
}

// src/types/locale.ts
/**
 * @description Defines available language codes and fallbacks.
 */
export type Locale = 'pl' | 'en' | 'uk';