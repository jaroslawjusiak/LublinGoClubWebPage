import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createLessonWithFiles,
  validateLessonFiles,
  PDF_LIMIT,
  THUMBNAIL_LIMIT,
  LessonSaveError,
  cleanupLessonAssets,
  resolveLessonAttempt,
} from './upload';
import { getSupabaseClient } from '../supabase/client';
import { lessonsRepository } from './repository';
import type { SupabaseClient } from '@supabase/supabase-js';
vi.mock('../supabase/client', () => ({ getSupabaseClient: vi.fn() }));
vi.mock('./repository', () => ({ lessonsRepository: { create: vi.fn(), find: vi.fn() } }));
const pdf = () => new File(['%PDF-1.7\nvalid'], 'lesson.pdf', { type: 'application/pdf' });
const image = () => new File(['image'], 'cover.webp', { type: 'image/webp' });
const upload = vi.fn();
const remove = vi.fn();
const from = vi.fn();
beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(lessonsRepository.find).mockResolvedValue(null);
  upload.mockResolvedValue({ error: null });
  remove.mockResolvedValue({ error: null });
  from.mockReturnValue({
    upload,
    remove,
    getPublicUrl: (path: string) => ({ data: { publicUrl: `https://storage.example/${path}` } }),
  });
  vi.mocked(getSupabaseClient).mockReturnValue({ storage: { from } } as unknown as SupabaseClient);
  vi.mocked(lessonsRepository.create).mockResolvedValue({ id: 'saved' } as never);
});
describe('lesson upload', () => {
  it('requires both files', async () => {
    expect(await validateLessonFiles(null, image())).toBe('pdf_required');
    expect(await validateLessonFiles(pdf(), null)).toBe('thumbnail_required');
  });
  it('validates actual PDF header and MIME', async () => {
    expect(
      await validateLessonFiles(new File(['fake'], 'a.pdf', { type: 'application/pdf' }), image()),
    ).toBe('pdf_invalid');
    expect(
      await validateLessonFiles(new File(['%PDF-'], 'a.pdf', { type: 'text/plain' }), image()),
    ).toBe('pdf_invalid');
    expect(await validateLessonFiles(pdf(), image())).toBeNull();
  });
  it('rejects oversized and empty files and unsupported images', async () => {
    const largePdf = pdf();
    Object.defineProperty(largePdf, 'size', { value: PDF_LIMIT + 1 });
    const largeImage = image();
    Object.defineProperty(largeImage, 'size', { value: THUMBNAIL_LIMIT + 1 });
    expect(await validateLessonFiles(largePdf, image())).toBe('pdf_invalid');
    expect(await validateLessonFiles(pdf(), largeImage)).toBe('thumbnail_invalid');
    expect(
      await validateLessonFiles(pdf(), new File(['svg'], 'a.svg', { type: 'image/svg+xml' })),
    ).toBe('thumbnail_invalid');
    expect(
      await validateLessonFiles(new File([], 'a.pdf', { type: 'application/pdf' }), image()),
    ).toBe('pdf_invalid');
  });
  it('uploads unique paths then saves public URL metadata', async () => {
    await createLessonWithFiles('Ko', 'Description', pdf(), image());
    expect(upload).toHaveBeenCalledTimes(2);
    expect(upload.mock.calls[0][0]).not.toBe(upload.mock.calls[1][0]);
    expect(upload.mock.calls[0][2]).toEqual({ contentType: 'application/pdf', upsert: false });
    expect(lessonsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Ko',
        language: 'pl',
        pdfUrl: expect.stringMatching(/^https:/),
      }),
      expect.any(String),
    );
    expect(remove).not.toHaveBeenCalled();
  });
  it('cleans the first file when the second upload fails, then permits a fresh retry', async () => {
    upload
      .mockResolvedValueOnce({ error: null })
      .mockResolvedValueOnce({ error: { message: 'upload failed' } });
    await expect(createLessonWithFiles('Ko', 'Description', pdf(), image())).rejects.toThrow(
      'upload failed',
    );
    expect(remove).toHaveBeenCalledTimes(2);
    expect(lessonsRepository.create).not.toHaveBeenCalled();
    await expect(createLessonWithFiles('Ko', 'Description', pdf(), image())).resolves.toEqual({
      id: 'saved',
    });
  });
  it('cleans both staged files when metadata save fails', async () => {
    vi.mocked(lessonsRepository.create).mockRejectedValueOnce(new Error('RLS denied'));
    await expect(createLessonWithFiles('Ko', 'Description', pdf(), image())).rejects.toThrow(
      'RLS denied',
    );
    expect(remove).toHaveBeenCalledTimes(2);
  });
  it('preserves failed cleanup references and can retry cleanup', async () => {
    vi.mocked(lessonsRepository.create).mockRejectedValue(new Error('metadata failed'));
    remove.mockResolvedValueOnce({ error: { message: 'cleanup failed' } });
    let failure: LessonSaveError | undefined;
    try {
      await createLessonWithFiles('Ko', 'Description', pdf(), image());
    } catch (error) {
      failure = error as LessonSaveError;
    }
    expect(failure).toBeInstanceOf(LessonSaveError);
    expect(failure?.pendingCleanup).toHaveLength(1);
    expect(await cleanupLessonAssets(failure!.pendingCleanup)).toEqual([]);
  });
  it('recovers an insert that committed but lost its response without deleting assets', async () => {
    vi.mocked(lessonsRepository.create).mockRejectedValue(new Error('lost response'));
    vi.mocked(lessonsRepository.find).mockResolvedValue({ id: 'committed' } as never);
    await expect(createLessonWithFiles('Ko', 'Description', pdf(), image())).resolves.toEqual({
      id: 'committed',
    });
    expect(remove).not.toHaveBeenCalled();
    expect(lessonsRepository.find).toHaveBeenCalledWith(
      vi.mocked(lessonsRepository.create).mock.calls[0][1],
    );
  });
  it('preserves assets on an unresolved offline save and verifies the same attempt without another insert', async () => {
    vi.mocked(lessonsRepository.create).mockRejectedValue(new Error('offline'));
    vi.mocked(lessonsRepository.find).mockRejectedValueOnce(new Error('offline'));
    let failure!: LessonSaveError;
    try {
      await createLessonWithFiles('Ko', 'Description', pdf(), image());
    } catch (err) {
      failure = err as LessonSaveError;
    }
    expect(failure.pendingAttempt?.assets).toHaveLength(2);
    expect(remove).not.toHaveBeenCalled();
    vi.mocked(lessonsRepository.find).mockResolvedValue({
      id: failure.pendingAttempt!.id,
    } as never);
    expect(await resolveLessonAttempt(failure.pendingAttempt!)).toEqual({
      id: failure.pendingAttempt!.id,
    });
    expect(lessonsRepository.create).toHaveBeenCalledTimes(1);
    expect(upload).toHaveBeenCalledTimes(2);
    expect(remove).not.toHaveBeenCalled();
  });
});
