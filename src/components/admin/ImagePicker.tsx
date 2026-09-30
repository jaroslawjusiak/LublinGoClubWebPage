// src/components/admin/ImagePicker.tsx
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { validateImage, compressImage, MAX_IMAGES } from '../../lib/news/image';
import { uploadNewsImage, removeNewsImage } from '../../lib/supabase/storage';
import type { NewsImage } from '../../types/data_models';

interface ImagePickerProps {
  images: NewsImage[];
  onChange: (images: NewsImage[]) => void;
  /** Called once per newly persisted upload so the form can track session files. */
  onUpload: (url: string) => void;
  /** Called when an upload starts/ends so the form can disable conflicting actions. */
  onUploadingChange: (uploading: boolean) => void;
}

/**
 * Mobile-friendly photo picker: select up to four photos, validate/compress
 * each and upload immediately, then preview with a remove control and an
 * alternative-text field. The picker never deletes from Storage on its own —
 * the owning form decides when persisted photos are discarded, so cancelling
 * or a failed save never leaves the database pointing at a deleted file.
 */
const ImagePicker: React.FC<ImagePickerProps> = ({
  images,
  onChange,
  onUpload,
  onUploadingChange,
}) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setUploadingState = (value: boolean) => {
    setUploading(value);
    onUploadingChange(value);
  };

  const handleFiles = async (fileList: FileList) => {
    const selected = Array.from(fileList);
    setError(null);

    if (selected.length + images.length > MAX_IMAGES) {
      setError(t('admin:error_too_many_images'));
      return;
    }

    const uploaded: NewsImage[] = [];
    setUploadingState(true);
    try {
      for (const file of selected) {
        const validation = validateImage(file);
        if (validation === 'unsupported-type') throw new Error(t('admin:error_image_type'));
        if (validation === 'too-large') throw new Error(t('admin:error_image_size'));
        const compressed = await compressImage(file);
        const url = await uploadNewsImage(compressed);
        uploaded.push({ url, alt: '' });
      }
      for (const image of uploaded) onUpload(image.url);
      // `images` is stable during the upload: every mutating control (add/remove/
      // alt) is disabled while `uploading` is true, so this appends safely.
      onChange([...images, ...uploaded]);
    } catch (err) {
      // Roll back the partial uploads from this attempt (best-effort).
      await Promise.allSettled(uploaded.map((image) => removeNewsImage(image.url)));
      setError(err instanceof Error ? err.message : t('admin:error_upload'));
    } finally {
      setUploadingState(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    // Deletion is deferred to the form's save/delete/cancel flow.
    onChange(images.filter((_, i) => i !== index));
  };

  const handleAltChange = (index: number, alt: string) => {
    onChange(images.map((img, i) => (i === index ? { ...img, alt } : img)));
  };

  return (
    <div>
      <input
        ref={inputRef}
        id="admin-photos"
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => {
          if (e.target.files) void handleFiles(e.target.files);
        }}
      />

      {images.length > 0 ? (
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {images.map((image, index) => (
            <li key={image.url} className="rounded overflow-hidden border border-border">
              <div className="relative aspect-square bg-gray-200">
                <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  disabled={uploading}
                  aria-label={`${t('admin:remove_photo')} ${index + 1}`}
                  className="absolute top-1 right-1 w-7 h-7 rounded-full bg-ink/70 text-white text-sm leading-none flex items-center justify-center  disabled:opacity-50"
                >
                  ×
                </button>
              </div>
              <div className="p-2">
                <label htmlFor={`photo-alt-${index}`} className="sr-only">
                  {t('admin:alt_label')} {index + 1}
                </label>
                <input
                  id={`photo-alt-${index}`}
                  type="text"
                  value={image.alt}
                  onChange={(e) => handleAltChange(index, e.target.value)}
                  disabled={uploading}
                  placeholder={t('admin:alt_placeholder')}
                  className="w-full rounded border border-border-control bg-surface px-2 py-1 text-sm  disabled:opacity-50"
                />
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading || images.length >= MAX_IMAGES}
        className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-gray-100 transition  disabled:opacity-50"
      >
        {uploading ? t('admin:uploading') : t('admin:add_photos')}
      </button>

      {error ? (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default ImagePicker;
