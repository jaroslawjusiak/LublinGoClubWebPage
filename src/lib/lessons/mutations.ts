import { getSupabaseClient } from '../supabase/client';
import { lessonsRepository, type Lesson, type LessonInput } from './repository';
import { cleanupLessonAssets, validateLessonFiles, type Asset } from './upload';

export interface LessonMutationAttempt {
  kind: 'update' | 'delete';
  original: Lesson;
  expected?: LessonInput;
  staged: Asset[];
  /** Once confirmed, retry only cleanup; never reapply a committed mutation. */
  confirmed?: boolean;
  cleanup?: Asset[];
}
export class LessonMutationError extends Error {
  constructor(
    readonly attempt: LessonMutationAttempt,
    readonly reason: 'verify' | 'cleanup' | 'save',
  ) {
    super(reason);
  }
}
/** Accept only generated keys on this project's two public buckets. */
export function ownedLessonAsset(url: string): Asset | null {
  const client = getSupabaseClient();
  if (!client) return null;
  for (const bucket of ['lesson-pdfs', 'lesson-thumbnails']) {
    const base = client.storage.from(bucket).getPublicUrl('').data.publicUrl;
    if (!url.startsWith(base)) continue;
    const path = url.slice(base.length);
    if (
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(pdf|jpg|png|webp)$/i.test(
        path,
      )
    )
      return { bucket, path };
  }
  return null;
}
function oldAssets(lesson: Lesson): Asset[] {
  return [lesson.pdfUrl, lesson.thumbnailUrl]
    .map(ownedLessonAsset)
    .filter((asset): asset is Asset => asset !== null);
}
/** Public metadata reads include every lesson. Keep all referenced/shared files. */
async function cleanupUnreferenced(assets: Asset[]): Promise<Asset[]> {
  if (!assets.length) return [];
  let lessons: Lesson[];
  try {
    lessons = await lessonsRepository.list();
  } catch {
    return assets;
  }
  const referenced = new Set(
    lessons
      .flatMap((lesson) => [lesson.pdfUrl, lesson.thumbnailUrl])
      .map((url) => ownedLessonAsset(url.split(/[?#]/)[0]))
      .filter((asset): asset is Asset => asset !== null)
      .map((asset) => `${asset.bucket}/${asset.path}`),
  );
  const client = getSupabaseClient();
  if (!client) return assets;
  const unreferenced = assets.filter((asset) => !referenced.has(`${asset.bucket}/${asset.path}`));
  return cleanupLessonAssets(unreferenced);
}
function matches(lesson: Lesson, expected: LessonInput) {
  return (
    lesson.title === expected.title &&
    lesson.description === expected.description &&
    lesson.pdfUrl === expected.pdfUrl &&
    lesson.thumbnailUrl === expected.thumbnailUrl &&
    lesson.language === expected.language &&
    lesson.pageCount === expected.pageCount
  );
}
export async function resolveLessonMutation(attempt: LessonMutationAttempt): Promise<void> {
  if (attempt.confirmed === undefined) {
    let current: Lesson | null;
    try {
      current = await lessonsRepository.find(attempt.original.id);
    } catch {
      throw new LessonMutationError(attempt, 'verify');
    }
    attempt = {
      ...attempt,
      confirmed:
        attempt.kind === 'delete'
          ? current === null
          : current !== null && !!attempt.expected && matches(current, attempt.expected),
    };
  }
  const candidates =
    attempt.cleanup ??
    (attempt.confirmed ? [...oldAssets(attempt.original), ...attempt.staged] : attempt.staged);
  const failed = await cleanupUnreferenced(candidates);
  if (failed.length) throw new LessonMutationError({ ...attempt, cleanup: failed }, 'cleanup');
  if (!attempt.confirmed) throw new LessonMutationError({ ...attempt, cleanup: [] }, 'save');
}
async function uploadReplacement(bucket: string, file: File, staged: Asset[]): Promise<string> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured.');
  const extension =
    bucket === 'lesson-pdfs'
      ? 'pdf'
      : (
          { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' } as Record<
            string,
            string
          >
        )[file.type];
  const path = `${crypto.randomUUID()}.${extension}`;
  staged.push({ bucket, path });
  const { error } = await client.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
export async function updateLessonWithFiles(
  original: Lesson,
  title: string,
  description: string,
  pdf: File | null,
  thumbnail: File | null,
): Promise<void> {
  const validation = await validateLessonFiles(pdf, thumbnail, true);
  if (validation) throw new Error(validation);
  let attempt: LessonMutationAttempt = { kind: 'update', original, staged: [] };
  let started = false;
  try {
    const pdfUrl = pdf
      ? await uploadReplacement('lesson-pdfs', pdf, attempt.staged)
      : original.pdfUrl;
    const thumbnailUrl = thumbnail
      ? await uploadReplacement('lesson-thumbnails', thumbnail, attempt.staged)
      : original.thumbnailUrl;
    const expected: LessonInput = {
      title,
      description,
      pdfUrl,
      thumbnailUrl,
      language: original.language,
      pageCount: pdf ? null : original.pageCount,
    };
    attempt = { ...attempt, expected };
    started = true;
    await lessonsRepository.update(original.id, expected);
  } catch {
    if (!started) attempt = { ...attempt, confirmed: false };
    return resolveLessonMutation(attempt);
  }
  // Verify even successful responses before touching old files.
  return resolveLessonMutation(attempt);
}
export async function deleteLessonWithFiles(original: Lesson): Promise<void> {
  const attempt: LessonMutationAttempt = { kind: 'delete', original, staged: [] };
  try {
    await lessonsRepository.remove(original.id);
  } catch {
    /* Verify whether the delete committed. */
  }
  return resolveLessonMutation(attempt);
}
