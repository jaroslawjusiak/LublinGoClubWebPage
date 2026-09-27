import { describe, it, expect } from 'vitest';
import { objectPathFromUrl } from './storage';

describe('objectPathFromUrl', () => {
  it('extracts the object path from a Supabase public URL', () => {
    const url = 'https://abc.supabase.co/storage/v1/object/public/news-images/2024/photo.jpg';
    expect(objectPathFromUrl(url)).toBe('2024/photo.jpg');
  });

  it('returns null for a URL not from the bucket', () => {
    expect(objectPathFromUrl('https://example.com/photo.jpg')).toBeNull();
    expect(objectPathFromUrl('https://abc.supabase.co/storage/v1/object/public/other/photo.jpg')).toBeNull();
  });
});
