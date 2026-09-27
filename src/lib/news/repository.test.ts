import { describe, it, expect, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { mapRowToNewsPost, SupabaseNewsRepository, type PostRow } from './repository';

const validRow: PostRow = {
  id: 'abc-123',
  title: 'Turniej',
  body: 'Krótki opis turnieju.',
  tag: 'turniej',
  image_urls: ['https://example.com/1.jpg', 'https://example.com/2.jpg'],
  external_url: 'https://board.example.com/tournament',
  published_at: '2023-10-14',
  published: true,
};

function createMockClient(rows: PostRow[]) {
  const range = vi.fn().mockResolvedValue({ data: rows, error: null, count: rows.length });
  const order = vi.fn().mockReturnValue({ range });
  const eq = vi.fn().mockReturnValue({ order });
  const select = vi.fn().mockReturnValue({ eq });
  const from = vi.fn().mockReturnValue({ select });
  const client = { from } as unknown as SupabaseClient;
  return { client, from, select, eq, order, range };
}

describe('mapRowToNewsPost', () => {
  it('maps a concrete snake_case row into the NewsPost model', () => {
    expect(mapRowToNewsPost(validRow)).toEqual({
      id: 'abc-123',
      title: 'Turniej',
      body: 'Krótki opis turnieju.',
      publishedAt: '2023-10-14',
      tag: 'turniej',
      images: ['https://example.com/1.jpg', 'https://example.com/2.jpg'],
      externalUrl: 'https://board.example.com/tournament',
    });
  });

  it('normalises null body, tag, images and external link', () => {
    const post = mapRowToNewsPost({
      ...validRow,
      body: null,
      tag: null,
      image_urls: null,
      external_url: null,
    });

    expect(post.body).toBe('');
    expect(post.tag).toBeUndefined();
    expect(post.images).toEqual([]);
    expect(post.externalUrl).toBeUndefined();
  });

  it('throws when the row is missing an id', () => {
    expect(() => mapRowToNewsPost({ ...validRow, id: '' })).toThrow(/missing an id/);
  });

  it('throws when the row is missing a published date', () => {
    expect(() => mapRowToNewsPost({ ...validRow, published_at: '' })).toThrow(
      /missing a published date/,
    );
  });

  it('throws when the tag is not one of the allowed values', () => {
    expect(() => mapRowToNewsPost({ ...validRow, tag: 'warsztaty' })).toThrow(/unknown tag/);
  });
});

describe('SupabaseNewsRepository', () => {
  it('reports unconfigured (not empty) when no client is present', async () => {
    const repo = new SupabaseNewsRepository(null);
    await expect(repo.listPublished(1, 10)).resolves.toEqual({ status: 'unconfigured' });
  });

  it('queries published posts newest-first and maps the result', async () => {
    const { client, from, eq, order, range } = createMockClient([validRow]);
    const repo = new SupabaseNewsRepository(client);

    const result = await repo.listPublished(1, 3);

    expect(from).toHaveBeenCalledWith('posts');
    expect(eq).toHaveBeenCalledWith('published', true);
    expect(order).toHaveBeenCalledWith('published_at', { ascending: false });
    expect(range).toHaveBeenCalledWith(0, 2);
    expect(result).toEqual({
      status: 'ok',
      page: { posts: [mapRowToNewsPost(validRow)], totalCount: 1 },
    });
  });

  it('propagates query errors instead of returning an empty feed', async () => {
    const range = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'boom' },
      count: null,
    });
    const order = vi.fn().mockReturnValue({ range });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient;
    const repo = new SupabaseNewsRepository(client);

    await expect(repo.listPublished(1, 10)).rejects.toThrow(/boom/);
  });
});
