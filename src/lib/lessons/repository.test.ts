import { describe, it, expect, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseLessonsRepository, mapLesson, type LessonRow } from './repository';
const row: LessonRow = {
  id: 'id',
  title: 'Ko',
  description: 'Description',
  pdf_url: '/assets/lekcje/ko.pdf',
  thumbnail_url: '/assets/lekcje/thumbnails/ko.webp',
  language: 'pl',
  page_count: 7,
};
function client(result: object) {
  const order = vi.fn();
  order.mockReturnValueOnce({ order }).mockResolvedValueOnce(result);
  return {
    from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ order }) }),
  } as unknown as SupabaseClient;
}
describe('lessons repository', () => {
  it('maps URLs and content language explicitly', () =>
    expect(mapLesson(row)).toMatchObject({
      pdfUrl: row.pdf_url,
      thumbnailUrl: row.thumbnail_url,
      language: 'pl',
      pageCount: 7,
    }));
  it('rejects malformed metadata and executable URLs', () => {
    expect(() => mapLesson({ ...row, title: '' })).toThrow();
    expect(() => mapLesson({ ...row, pdf_url: 'javascript:alert(1)' })).toThrow();
  });
  it('uses nine initial materials only when unconfigured', async () =>
    expect(await new SupabaseLessonsRepository(null).list()).toHaveLength(9));
  it('keeps configured empty results empty', async () =>
    expect(await new SupabaseLessonsRepository(client({ data: [], error: null })).list()).toEqual(
      [],
    ));
  it('does not hide a missing migration or other errors behind the initial catalog', async () =>
    expect(
      new SupabaseLessonsRepository(
        client({ data: null, error: { message: 'relation lessons does not exist' } }),
      ).list(),
    ).rejects.toThrow('relation lessons'));
  it('maps configured records', async () =>
    expect(
      await new SupabaseLessonsRepository(client({ data: [row], error: null })).list(),
    ).toEqual([mapLesson(row)]));
  it('refuses unconfigured mutations', async () =>
    expect(
      new SupabaseLessonsRepository(null).create({
        title: 'Ko',
        description: 'Description',
        pdfUrl: row.pdf_url,
        thumbnailUrl: row.thumbnail_url,
        language: 'pl',
        pageCount: null,
      }),
    ).rejects.toThrow('not configured'));
});
