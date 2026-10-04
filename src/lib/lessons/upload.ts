import { getSupabaseClient } from '../supabase/client';
import { lessonsRepository, type Lesson } from './repository';

export const PDF_LIMIT = 20 * 1024 * 1024;
export const THUMBNAIL_LIMIT = 5 * 1024 * 1024;
export type Asset = { bucket: string; path: string };
export type LessonFileError =
  'pdf_required' | 'thumbnail_required' | 'pdf_invalid' | 'thumbnail_invalid';
export async function validateLessonFiles(
  pdf: File | null,
  thumbnail: File | null,
): Promise<LessonFileError | null> {
  if (!pdf) return 'pdf_required';
  if (!thumbnail) return 'thumbnail_required';
  if (pdf.type !== 'application/pdf' || pdf.size === 0 || pdf.size > PDF_LIMIT)
    return 'pdf_invalid';
  const signature = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read PDF.'));
    reader.readAsText(pdf.slice(0, 5));
  });
  if (signature !== '%PDF-') return 'pdf_invalid';
  if (
    !['image/jpeg', 'image/png', 'image/webp'].includes(thumbnail.type) ||
    thumbnail.size === 0 ||
    thumbnail.size > THUMBNAIL_LIMIT
  )
    return 'thumbnail_invalid';
  return null;
}
export class LessonSaveError extends Error {
  constructor(
    message: string,
    readonly pendingCleanup: Asset[],
    readonly pendingAttempt?: PendingLessonAttempt,
  ) {
    super(message);
  }
}
export async function cleanupLessonAssets(assets: Asset[]): Promise<Asset[]> {
  const client = getSupabaseClient();
  if (!client) return assets;
  const failed: Asset[] = [];
  for (const asset of assets) {
    try {
      const { error } = await client.storage.from(asset.bucket).remove([asset.path]);
      if (error) failed.push(asset);
    } catch {
      failed.push(asset);
    }
  }
  return failed;
}
export interface PendingLessonAttempt {
  id: string;
  assets: Asset[];
}
/** A lost response must be verified before deleting possibly referenced files. */
export async function resolveLessonAttempt(attempt: PendingLessonAttempt): Promise<Lesson | null> {
  let existing: Lesson | null;
  try {
    existing = await lessonsRepository.find(attempt.id);
  } catch {
    throw new LessonSaveError('Could not verify lesson save.', [], attempt);
  }
  if (existing) return existing;
  const failed = await cleanupLessonAssets(attempt.assets);
  if (failed.length) throw new LessonSaveError('Could not clean lesson files.', failed);
  return null;
}
/** Files are staged only during submit. Failed submissions clean all successful uploads. */
export async function createLessonWithFiles(
  title: string,
  description: string,
  pdf: File,
  thumbnail: File,
): Promise<Lesson> {
  const validation = await validateLessonFiles(pdf, thumbnail);
  if (validation) throw new Error(validation);
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured.');
  const staged: Asset[] = [];
  const id = crypto.randomUUID();
  let metadataStarted = false;
  try {
    const urls: string[] = [];
    for (const [bucket, file, extension] of [
      ['lesson-pdfs', pdf, 'pdf'],
      [
        'lesson-thumbnails',
        thumbnail,
        (
          { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' } as Record<
            string,
            string
          >
        )[thumbnail.type],
      ],
    ] as const) {
      const path = `${crypto.randomUUID()}.${extension}`;
      staged.push({ bucket, path });
      const { error } = await client.storage
        .from(bucket)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw new Error(error.message);
      urls.push(client.storage.from(bucket).getPublicUrl(path).data.publicUrl);
    }
    metadataStarted = true;
    return await lessonsRepository.create(
      {
        title,
        description,
        pdfUrl: urls[0],
        thumbnailUrl: urls[1],
        language: 'pl',
        pageCount: null,
      },
      id,
    );
  } catch (error) {
    if (metadataStarted) {
      const recovered = await resolveLessonAttempt({ id, assets: staged });
      if (recovered) return recovered;
      throw new LessonSaveError(
        error instanceof Error ? error.message : 'Failed to save lesson.',
        [],
      );
    }
    const pending = await cleanupLessonAssets(staged);
    throw new LessonSaveError(
      error instanceof Error ? error.message : 'Failed to save lesson.',
      pending,
    );
  }
}
