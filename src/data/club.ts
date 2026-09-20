// src/data/club.ts
import { MeetingInfo, ClubConfig } from '../types/data_models';

/**
 * @description The single source of truth for all canonical club configuration data.
 * Update this file (following the M7-T3 runbook) instead of hardcoding facts in components.
 */

// --- CLUB CONFIGURATION ---
export const clubConfig: ClubConfig = {
  name: 'Lubelski Klub Go',
  slogan: 'Gra, nauka i przyjaźń w świecie Go.',
  canonicalDomain: 'lubelskigoklub.pl',
  isFreeEntry: true,
  phone: '+48 000 000 000', // Placeholder — replace with the real number.
  email: 'kontakt@lubelskigoklub.pl', // Placeholder — replace with the real address.
};

// --- MEETING INFORMATION ---
export const meetingInfo: MeetingInfo = {
  dayOfWeek: 'Wednesday',
  startTime: '17:00',
  endTime: '20:00',
  venueName: 'MDK (Miejski Dom Kultury)',
  addressLine: 'ul. Bernardyńska 14a',
  roomNumber: 'sala 14',
  entranceHint:
    'Wejście główne do budynku (Wejście B). Zapytaj obsługę o salę 14.',
};

// --- SOCIAL LINKS ---
export const socialLinks = {
  facebook: 'https://www.facebook.com/lubelski_klub_go',
  instagram: 'https://www.instagram.com/lubelskiklubgo/',
  youtube: 'https://www.youtube.com/@lubelskiklubgo',
};
