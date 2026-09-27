// src/lib/news/seed.ts
import type { NewsPost } from '../../types/data_models';

/**
 * Historical posts prepared for the Supabase seed (M4-T5), with correct dates
 * taken from the old `wydarzenia.html`. These are ARCHIVE items — they must
 * keep their 2023 publication dates and are not "recent activity".
 *
 * Images are intentionally empty for now:
 * - `photo/akira/Akiracon.jpg` is a non-identifying event poster, but still
 *   needs to be uploaded to Supabase Storage (M4-T3) with rights confirmed.
 * - The China Town Cup photos (`photo/china-town/*`) show identifiable people
 *   and have NO recorded consent — do not attach them until consent is obtained
 *   (see docs/CONTENT_APPROVAL.md).
 */
export const historicalNewsSeed: NewsPost[] = [
  {
    id: 'seed-akira-hello-world-2023',
    title: 'AKIRA Hello World! — Festiwal Spotkań Kultur',
    body:
      'W dniach 18–19 listopada 2023 braliśmy udział w Akira Hello World — lubelskim festiwalu ' +
      'kultur Wschodu, gdzie promowaliśmy grę Go wśród mieszkańców Lublina.',
    publishedAt: '2023-11-18',
    tag: 'wydarzenie',
    images: [],
    externalUrl: 'https://akiracon.pl/',
  },
  {
    id: 'seed-china-town-weiqi-cup-2023',
    title: 'III edycja turnieju „China Town” Weiqi Cup',
    body:
      'W dniach 14–15 października 2023 nasi klubowicze wzięli udział w największym turnieju Go ' +
      'w Polsce. Blisko 200 graczy z Europy i Azji rywalizowało w Bibliotece Uniwersytetu Warszawskiego.',
    publishedAt: '2023-10-14',
    tag: 'turniej',
    images: [],
    externalUrl: 'https://board.szalenisamuraje.org/tournaments/3rd-china-town-weiqi-cup',
  },
];
