// src/lib/supabase/storage.ts
// News image storage helpers. Posts store references (public URLs), never binaries.
import { getSupabaseClient } from './client';

export const NEWS_IMAGES_BUCKET = 'news-images';

/**
 * Extracts the object path from a Supabase public URL, or `null` for URLs not
 * from this bucket. Pure, so it is unit-testable.
 */
export function objectPathFromUrl(url: string, bucket: string = NEWS_IMAGES_BUCKET): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  return idx === -1 ? null : url.slice(idx + marker.length);
}

function extensionFor(type: string): string {
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  if (type === 'image/gif') return 'gif';
  return 'jpg';
}

/** Uploads an image and returns its public URL. */
export async function uploadNewsImage(file: Blob): Promise<string> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured.');

  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extensionFor(file.type)}`;
  const { error } = await client.storage
    .from(NEWS_IMAGES_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data } = client.storage.from(NEWS_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Removes a single stored image by its public URL (best-effort, no throw). */
export async function removeNewsImage(url: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  const path = objectPathFromUrl(url);
  if (!path) return;
  await client.storage.from(NEWS_IMAGES_BUCKET).remove([path]);
}

/** Removes several stored images (used on post delete / failed edits). */
export async function removeNewsImages(urls: string[]): Promise<void> {
  await Promise.all(urls.map((url) => removeNewsImage(url)));
}
