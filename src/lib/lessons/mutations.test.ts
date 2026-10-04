import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseClient } from '../supabase/client';
import { lessonsRepository, type Lesson } from './repository';
import {
  updateLessonWithFiles,
  deleteLessonWithFiles,
  resolveLessonMutation,
  LessonMutationError,
  ownedLessonAsset,
} from './mutations';
vi.mock('../supabase/client', () => ({ getSupabaseClient: vi.fn() }));
vi.mock('./repository', () => ({
  lessonsRepository: { find: vi.fn(), list: vi.fn(), update: vi.fn(), remove: vi.fn() },
}));
const pdf = new File(['%PDF-1.7'], 'a.pdf', { type: 'application/pdf' });
const image = new File(['webp'], 'a.webp', { type: 'image/webp' });
const oldPdf = '00000000-0000-4000-8000-000000000001.pdf';
const oldImage = '00000000-0000-4000-8000-000000000002.webp';
const url = (bucket: string, path: string) =>
  `https://project.example/storage/v1/object/public/${bucket}/${path}`;
const original: Lesson = {
  id: 'a',
  title: 'Ko',
  description: 'Description',
  pdfUrl: url('lesson-pdfs', oldPdf),
  thumbnailUrl: url('lesson-thumbnails', oldImage),
  language: 'uk',
  pageCount: 7,
};
const upload = vi.fn(),
  remove = vi.fn();
beforeEach(() => {
  vi.resetAllMocks();
  upload.mockResolvedValue({ error: null });
  remove.mockResolvedValue({ error: null });
  vi.mocked(getSupabaseClient).mockReturnValue({
    storage: {
      from: (bucket: string) => ({
        upload,
        remove,
        getPublicUrl: (path: string) => ({ data: { publicUrl: url(bucket, path) } }),
      }),
    },
  } as unknown as SupabaseClient);
  vi.mocked(lessonsRepository.update).mockImplementation(async (id, input) => ({ id, ...input }));
  vi.mocked(lessonsRepository.find).mockImplementation(async () => {
    const calls = vi.mocked(lessonsRepository.update).mock.calls;
    return calls.length ? { id: 'a', ...calls[calls.length - 1][1] } : original;
  });
  vi.mocked(lessonsRepository.list).mockImplementation(async () => {
    const current = await lessonsRepository.find('a');
    return current ? [current] : [];
  });
});
describe('existing lesson operations', () => {
  it('preserves both files, content language and page count during text editing', async () => {
    await updateLessonWithFiles(original, 'New title', 'New description', null, null);
    expect(upload).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
    expect(lessonsRepository.update).toHaveBeenCalledWith('a', {
      title: 'New title',
      description: 'New description',
      pdfUrl: original.pdfUrl,
      thumbnailUrl: original.thumbnailUrl,
      language: 'uk',
      pageCount: 7,
    });
  });
  it.each(['pdf', 'thumbnail'])(
    'replaces only the optional %s file and deletes only its unreferenced old key',
    async (kind) => {
      await updateLessonWithFiles(
        original,
        'Ko',
        'Description',
        kind === 'pdf' ? pdf : null,
        kind === 'thumbnail' ? image : null,
      );
      expect(upload).toHaveBeenCalledTimes(1);
      expect(remove).toHaveBeenCalledWith([kind === 'pdf' ? oldPdf : oldImage]);
      const input = vi.mocked(lessonsRepository.update).mock.calls[0][1];
      expect(input.pageCount).toBe(kind === 'pdf' ? null : 7);
      expect(kind === 'pdf' ? input.thumbnailUrl : input.pdfUrl).toBe(
        kind === 'pdf' ? original.thumbnailUrl : original.pdfUrl,
      );
    },
  );
  it('keeps shared old URLs used in either metadata field', async () => {
    vi.mocked(lessonsRepository.list).mockImplementation(async () => [
      { ...original, id: 'other', thumbnailUrl: original.pdfUrl + '?download=1' },
      (await lessonsRepository.find('a'))!,
    ]);
    await updateLessonWithFiles(original, 'Ko', 'Description', pdf, null);
    expect(remove).not.toHaveBeenCalled();
  });
  it('never deletes bundled, external, wrong-project or legacy-key files', () => {
    for (const candidate of [
      '/assets/lekcje/ko.pdf',
      'https://elsewhere.example/a.pdf',
      url('news-images', oldPdf),
      url('lesson-pdfs', 'legacy.pdf'),
      url('lesson-pdfs', '../' + oldPdf),
      url('lesson-pdfs', oldPdf) + '?x',
    ])
      expect(ownedLessonAsset(candidate)).toBeNull();
  });
  it('cleans failed attempted uploads without modifying metadata or deleting existing files', async () => {
    upload.mockRejectedValueOnce(new Error('lost response'));
    await expect(
      updateLessonWithFiles(original, 'Ko', 'Description', pdf, null),
    ).rejects.toMatchObject({ reason: 'save' });
    expect(lessonsRepository.update).not.toHaveBeenCalled();
    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove.mock.calls[0][0]).not.toEqual([oldPdf]);
  });
  it('cleans newly staged files after a confirmed failed update and retains old files', async () => {
    vi.mocked(lessonsRepository.update).mockRejectedValueOnce(new Error('RLS denied'));
    vi.mocked(lessonsRepository.find).mockResolvedValue(original);
    await expect(
      updateLessonWithFiles(original, 'changed', 'Description', pdf, null),
    ).rejects.toMatchObject({ reason: 'save' });
    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove.mock.calls[0][0]).not.toEqual([oldPdf]);
  });
  it('recovers a committed update after losing its response', async () => {
    vi.mocked(lessonsRepository.update).mockRejectedValueOnce(new Error('lost response'));
    await updateLessonWithFiles(original, 'Changed', 'Description', pdf, null);
    expect(remove).toHaveBeenCalledWith([oldPdf]);
  });
  it('keeps all files while update verification is offline and retries verification without reapplying', async () => {
    vi.mocked(lessonsRepository.find).mockRejectedValueOnce(new Error('offline'));
    let error!: LessonMutationError;
    try {
      await updateLessonWithFiles(original, 'Changed', 'Description', pdf, null);
    } catch (err) {
      error = err as LessonMutationError;
    }
    expect(error.reason).toBe('verify');
    expect(remove).not.toHaveBeenCalled();
    await resolveLessonMutation(error.attempt);
    expect(lessonsRepository.update).toHaveBeenCalledTimes(1);
  });
  it('deletes metadata first and verifies absence before cleaning owned files', async () => {
    vi.mocked(lessonsRepository.find).mockResolvedValue(null);
    await deleteLessonWithFiles(original);
    expect(lessonsRepository.remove).toHaveBeenCalledWith('a');
    expect(remove).toHaveBeenCalledTimes(2);
  });
  it('does not delete active files when deletion failed', async () => {
    vi.mocked(lessonsRepository.remove).mockRejectedValue(new Error('RLS denied'));
    await expect(deleteLessonWithFiles(original)).rejects.toMatchObject({ reason: 'save' });
    expect(remove).not.toHaveBeenCalled();
  });
  it('recovers a committed delete with lost response and preserves shared references', async () => {
    vi.mocked(lessonsRepository.remove).mockRejectedValue(new Error('lost response'));
    vi.mocked(lessonsRepository.find).mockResolvedValue(null);
    vi.mocked(lessonsRepository.list).mockResolvedValue([{ ...original, id: 'other' }]);
    await deleteLessonWithFiles(original);
    expect(remove).not.toHaveBeenCalled();
  });
  it('keeps files on offline delete verification and later resolves without another delete', async () => {
    vi.mocked(lessonsRepository.find).mockRejectedValueOnce(new Error('offline'));
    let error!: LessonMutationError;
    try {
      await deleteLessonWithFiles(original);
    } catch (err) {
      error = err as LessonMutationError;
    }
    expect(error.reason).toBe('verify');
    expect(remove).not.toHaveBeenCalled();
    vi.mocked(lessonsRepository.find).mockResolvedValue(null);
    await resolveLessonMutation(error.attempt);
    expect(lessonsRepository.remove).toHaveBeenCalledTimes(1);
  });
  it('retries cleanup after committed updates without saving again', async () => {
    remove.mockResolvedValueOnce({ error: { message: 'cleanup denied' } });
    let error!: LessonMutationError;
    try {
      await updateLessonWithFiles(original, 'Changed', 'Description', pdf, null);
    } catch (err) {
      error = err as LessonMutationError;
    }
    expect(error.reason).toBe('cleanup');
    expect(error.attempt.confirmed).toBe(true);
    await resolveLessonMutation(error.attempt);
    expect(lessonsRepository.update).toHaveBeenCalledTimes(1);
  });
  it('skips deletion when remaining reference lookup fails', async () => {
    vi.mocked(lessonsRepository.find).mockResolvedValue(null);
    vi.mocked(lessonsRepository.list).mockRejectedValue(new Error('offline'));
    await expect(deleteLessonWithFiles(original)).rejects.toMatchObject({ reason: 'cleanup' });
    expect(remove).not.toHaveBeenCalled();
  });
});
