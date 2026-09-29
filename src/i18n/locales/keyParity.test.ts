import { describe, it, expect } from 'vitest';
import pl from './pl/translation.json';
import en from './en/translation.json';

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

describe('translation key parity (pl ↔ en)', () => {
  it('every Polish key has an English counterpart', () => {
    const enKeys = new Set(flattenKeys(en));

    const missingInEn = flattenKeys(pl).filter((key) => !enKeys.has(key));

    // Empty means no Polish string silently falls back because EN lacks its key.
    expect(missingInEn).toEqual([]);
  });

  it('every English key exists in Polish (no orphan keys)', () => {
    const plKeys = new Set(flattenKeys(pl));

    const orphanInEn = flattenKeys(en).filter((key) => !plKeys.has(key));

    expect(orphanInEn).toEqual([]);
  });
});
