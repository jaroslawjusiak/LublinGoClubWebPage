// src/data/people.ts
import type { Person } from '../types/data_models';

/**
 * Public organizer / contact-person information.
 *
 * Only OGS handles are public here (they were already on the old live site and
 * let visitors find the club online before visiting). Personal email addresses
 * and phone numbers are intentionally NOT stored as a public channel — those
 * remain private until a club-owned contact channel is approved.
 *
 * PENDING: re-confirm these entries with the organizers before rendering them
 * on the About/Contact pages.
 */
export const people: Person[] = [
  { name: 'Piotr Dyszczyk', role: 'Osoba do kontaktu', ogsHandle: 'shin0e' },
  { name: 'Jarosław Jusiak', role: 'Osoba do kontaktu', ogsHandle: 'jaroslaw.jusiak' },
];
