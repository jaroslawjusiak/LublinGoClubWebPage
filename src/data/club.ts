// src/data/club.ts
import type { MeetingInfo, ClubConfig, SocialLinks } from '../types/data_models';

/**
 * Single source of truth for every canonical club fact.
 *
 * Update a fact here (not in a page/component) and it changes everywhere.
 * Facts marked "PENDING" are intentionally left unknown rather than guessed;
 * an organizer must confirm them before they are shown to visitors.
 *
 * Values below come from the old live site (https://lubelski-klub-go.vercel.app/)
 * and the rebuild plan. The old site is historical evidence, NOT proof that a
 * link or detail still works — re-verify before launch.
 */

// --- CLUB CONFIGURATION ---
export const clubConfig: ClubConfig = {
  name: 'Lubelski Klub Go',
  slogan: 'Gra, nauka i przyjaźń w świecie Go.',
  // PENDING: rebuild plan treats lubelski-klub-go.pl as canonical with the
  // Vercel URL as an alias. Confirm DNS ownership before launch.
  canonicalDomain: 'lubelski-klub-go.pl',
  isFreeEntry: true,
  // PENDING: no club-level address approved yet. Do NOT substitute a personal
  // phone or Gmail address as the primary public channel.
  // email: undefined,
};

// --- MEETING INFORMATION ---
export const meetingInfo: MeetingInfo = {
  startTime: '17:00',
  endTime: '20:00',
  venueName: 'Młodzieżowy Dom Kultury nr 2',
  addressLine: 'ul. Bernardyńska 14a',
  postalCode: '20-950',
  city: 'Lublin',
  roomNumber: 'sala 14',
  entranceHint: 'Galeria na górze',
  // Base map/directions URLs. The `MeetingSection` appends `&locale=<lang>` at
  // render time so the map opens in the same language as the page.
  mapUrl: 'https://www.openstreetmap.org/search?query=Bernardy%C5%84ska%2014a%2C%20Lublin',
  directionsUrl: 'https://www.openstreetmap.org/directions?to=Bernardy%C5%84ska%2014a%2C%20Lublin',
};

// --- SOCIAL LINKS ---
// Facebook and Discord were the only links on the old live site. Instagram and
// YouTube were placeholder inventions in the previous scaffold and are removed.
export const socialLinks: SocialLinks = {
  facebook: 'https://www.facebook.com/KlubGoLublin/',
  // PENDING: the old site had two invite codes (xeaQ8uMy on most pages,
  // cZNpEtfj5J on index.html). Confirm the current invite before launch.
  discord: 'https://discord.gg/xeaQ8uMy',
  // PENDING: OGS club group and Polish Go Association links — not yet verified.
};
