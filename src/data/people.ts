// src/data/people.ts
import type { Person } from '../types/data_models';

/**
 * Public contact-person information approved by the owner.
 * The approved contact email is stored in clubConfig in club.ts.
 */
export const people: Person[] = [
  {
    name: 'Jarosław Jusiak',
    role: 'Osoba do kontaktu',
    ogsHandle: 'Amongus Genduch',
    ogsUrl: 'https://online-go.com/player/1508854/',
  },
];
