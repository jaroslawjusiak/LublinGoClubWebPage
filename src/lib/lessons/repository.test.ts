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
  it('updates exactly the requested row and maps the returned metadata', async () => {
    const single = vi.fn().mockResolvedValue({ data: { ...row, title: 'Updated' }, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const eq = vi.fn().mockReturnValue({ select });
    const update = vi.fn().mockReturnValue({ eq });
    const repo = new SupabaseLessonsRepository({
      from: vi.fn().mockReturnValue({ update }),
    } as unknown as SupabaseClient);
    const result = await repo.update('id', {
      title: 'Updated',
      description: 'Description',
      pdfUrl: row.pdf_url,
      thumbnailUrl: row.thumbnail_url,
      language: 'pl',
      pageCount: 7,
    });
    expect(eq).toHaveBeenCalledWith('id', 'id');
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        pdf_url: row.pdf_url,
        thumbnail_url: row.thumbnail_url,
        page_count: 7,
      }),
    );
    expect(result.title).toBe('Updated');
  });
  it('surfaces failed update and delete responses', async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { message: 'denied' } });
    const eq = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single }) });
    const client = {
      from: vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({ eq }),
        delete: vi
          .fn()
          .mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: { message: 'denied' } }) }),
      }),
    } as unknown as SupabaseClient;
    const repo = new SupabaseLessonsRepository(client);
    await expect(
      repo.update('id', {
        title: 'Ko',
        description: 'Description',
        pdfUrl: row.pdf_url,
        thumbnailUrl: row.thumbnail_url,
        language: 'pl',
        pageCount: 7,
      }),
    ).rejects.toThrow('denied');
    await expect(repo.remove('id')).rejects.toThrow('denied');
  });
  it('deletes only the requested row', async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const repo = new SupabaseLessonsRepository({
      from: vi.fn().mockReturnValue({ delete: vi.fn().mockReturnValue({ eq }) }),
    } as unknown as SupabaseClient);
    await repo.remove('id');
    expect(eq).toHaveBeenCalledWith('id', 'id');
  });
});
