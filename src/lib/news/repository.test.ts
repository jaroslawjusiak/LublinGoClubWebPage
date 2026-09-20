import { describe, it, expect } from 'vitest';
import { mapRowToNewsPost, SupabaseNewsRepository } from './repository';

describe('mapRowToNewsPost', () => {
  it('maps a snake_case database row into the NewsPost model', () => {
    const post = mapRowToNewsPost({
      id: 'abc',
      title: 'Turniej',
      excerpt: 'Krótki opis',
      body_html: '<p>Treść</p>',
      published_date: '2026-08-15',
      tags: ['turniej', 'wydarzenie'],
      image_url_references: ['img-1'],
    });

    expect(post).toEqual({
      id: 'abc',
      title: 'Turniej',
      summary: 'Krótki opis',
      bodyHtml: '<p>Treść</p>',
      publishedDate: '2026-08-15',
      tags: ['turniej', 'wydarzenie'],
      imageUrlReferences: ['img-1'],
    });
  });

  it('normalises a single tag and a single image reference', () => {
    const post = mapRowToNewsPost({
      slug: 'slug-1',
      title: 'T',
      tags: 'turniej',
      mainImageReference: 'img-1',
    });

    expect(post.id).toBe('slug-1');
    expect(post.tags).toEqual(['turniej']);
    expect(post.imageUrlReferences).toEqual(['img-1']);
  });

  it('falls back to empty collections when optional fields are missing', () => {
    const post = mapRowToNewsPost({ id: 'x', title: 'Bez danych' });

    expect(post.tags).toEqual([]);
    expect(post.imageUrlReferences).toEqual([]);
    expect(post.summary).toBe('');
  });
});

describe('SupabaseNewsRepository without a configured client', () => {
  const repo = new SupabaseNewsRepository(null);

  it('returns an empty page instead of throwing', async () => {
    await expect(repo.listPublished(1, 10)).resolves.toEqual({ posts: [], totalCount: 0 });
  });

  it('returns null for a single post', async () => {
    await expect(repo.getById('anything')).resolves.toBeNull();
  });
});
