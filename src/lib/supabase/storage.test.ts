import { describe, it, expect, vi, beforeEach } from 'vitest';
import { objectPathFromUrl, removeNewsImage, removeNewsImages } from './storage';
import { getSupabaseClient } from './client';

vi.mock('./client', () => ({
  getSupabaseClient: vi.fn(),
}));

const bucketUrl = (path: string) =>
  `https://abc.supabase.co/storage/v1/object/public/news-images/${path}`;

const remove = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  remove.mockReset();
  vi.mocked(getSupabaseClient).mockReturnValue({
    storage: { from: vi.fn().mockReturnValue({ remove }) },
  } as unknown as ReturnType<typeof getSupabaseClient>);
});

describe('objectPathFromUrl', () => {
  it('extracts the object path from a Supabase public URL', () => {
    const url = 'https://abc.supabase.co/storage/v1/object/public/news-images/2024/photo.jpg';
    expect(objectPathFromUrl(url)).toBe('2024/photo.jpg');
  });

  it('returns null for a URL not from the bucket', () => {
    expect(objectPathFromUrl('https://example.com/photo.jpg')).toBeNull();
    expect(
      objectPathFromUrl('https://abc.supabase.co/storage/v1/object/public/other/photo.jpg'),
    ).toBeNull();
  });
});

describe('removeNewsImage', () => {
  it('treats a missing object as a no-op so cleanup can be retried', async () => {
    remove.mockResolvedValue({ error: { message: 'Object not found' } });
    await expect(removeNewsImage(bucketUrl('a.jpg'))).resolves.toBeUndefined();
  });

  it('throws on a genuine removal error', async () => {
    remove.mockResolvedValue({ error: { message: 'Permission denied' } });
    await expect(removeNewsImage(bucketUrl('a.jpg'))).rejects.toThrow(/Failed to remove image/);
  });

  it('skips URLs that are not from the bucket', async () => {
    await expect(removeNewsImage('https://example.com/a.jpg')).resolves.toBeUndefined();
    expect(remove).not.toHaveBeenCalled();
  });
});

describe('removeNewsImages', () => {
  it('aggregates genuine failures into a single error', async () => {
    remove.mockResolvedValue({ error: { message: 'Permission denied' } });
    await expect(removeNewsImages([bucketUrl('a.jpg'), bucketUrl('b.jpg')])).rejects.toThrow(
      /Failed to remove 2 image/,
    );
  });

  it('resolves when every removal succeeds', async () => {
    remove.mockResolvedValue({ error: null });
    await expect(
      removeNewsImages([bucketUrl('a.jpg'), bucketUrl('b.jpg')]),
    ).resolves.toBeUndefined();
  });
});
