// src/lib/news/image.ts
// Client-side image validation and compression for the admin upload flow.

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // matches the storage bucket limit
export const MAX_IMAGES = 4;
export const MAX_IMAGE_DIMENSION = 1280;

export type ImageValidationError = 'unsupported-type' | 'too-large';

/** Validates a file before compression/upload. Pure, so it is unit-testable. */
export function validateImage(file: File): ImageValidationError | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return 'unsupported-type';
  if (file.size > MAX_IMAGE_BYTES) return 'too-large';
  return null;
}

/**
 * Resizes a phone photo down to `MAX_IMAGE_DIMENSION` and re-encodes it as a
 * compressed JPEG, keeping the upload below the storage size limit without
 * blocking the main thread on a single huge image.
 */
export async function compressImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create a canvas context.');

    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.82),
    );
    if (!blob) throw new Error('Image compression failed.');

    const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], name, { type: 'image/jpeg' });
  } finally {
    bitmap.close();
  }
}
