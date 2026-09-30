import { describe, it, expect } from 'vitest';
import pl from './pl/translation.json';
import en from './en/translation.json';
import uk from './uk/translation.json';

/**
 * Flattens a nested translation resource into a list of dotted leaf keys,
 * e.g. `{ common: { menu: { home: 'Home' } } }` → `['common.menu.home']`.
 */
function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...flattenKeys(value as Record<string, unknown>, path));
    } else {
      keys.push(path);
    }
  }
  return keys.sort();
}

const reference = flattenKeys(pl);
const referenceSet = new Set(reference);

const targets = { en, uk } as const;

describe('translation key parity (pl ↔ en ↔ uk)', () => {
  for (const [lang, resource] of Object.entries(targets)) {
    it(`every Polish key has a ${lang} counterpart`, () => {
      const keys = flattenKeys(resource);
      const missing = reference.filter((key) => !keys.includes(key));

      // Empty means no Polish string silently falls back because `lang` lacks its key.
      expect(missing).toEqual([]);
    });

    it(`${lang} has no keys missing from Polish (no orphan keys)`, () => {
      const orphan = flattenKeys(resource).filter((key) => !referenceSet.has(key));

      expect(orphan).toEqual([]);
    });
  }
});

describe('localized weekday (meeting:day_of_week)', () => {
  it('uses the correct weekday per language', () => {
    expect(pl.meeting.day_of_week).toBe('środa');
    expect(en.meeting.day_of_week).toBe('Wednesday');
    expect(uk.meeting.day_of_week).toBe('середа');
  });

  it('never stores the English weekday inside Polish content', () => {
    expect(pl.meeting.day_of_week.toLowerCase()).not.toBe('wednesday');
  });
});
