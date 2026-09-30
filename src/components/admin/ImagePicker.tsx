// src/components/admin/ImagePicker.tsx
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { validateImage, compressImage, MAX_IMAGES } from '../../lib/news/image';
import { uploadNewsImage, removeNewsImage } from '../../lib/supabase/storage';
import type { NewsImage } from '../../types/data_models';

interface ImagePickerProps {
  images: NewsImage[];
  onChange: (images: NewsImage[]) => void;
}

/**
 * Mobile-friendly photo picker: select up to four photos, validate/compress
 * each, upload immediately, and preview with remove controls. Each photo also
 * has an alternative-text field for screen readers. Removed photos are deleted
 * from storage to avoid orphans.
 */
const ImagePicker: React.FC<ImagePickerProps> = ({ images, onChange }) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (fileList: FileList) => {
    const selected = Array.from(fileList);
    setError(null);

    if (selected.length + images.length > MAX_IMAGES) {
      setError(t('admin:error_too_many_images'));
      return;
    }

    const uploaded: NewsImage[] = [];
    setUploading(true);
    try {
      for (const file of selected) {
        const validation = validateImage(file);
        if (validation === 'unsupported-type') throw new Error(t('admin:error_image_type'));
        if (validation === 'too-large') throw new Error(t('admin:error_image_size'));
        const compressed = await compressImage(file);
        const url = await uploadNewsImage(compressed);
        uploaded.push({ url, alt: '' });
      }
      onChange([...images, ...uploaded]);
    } catch (err) {
      await Promise.all(uploaded.map((image) => removeNewsImage(image.url)));
      setError(err instanceof Error ? err.message : t('admin:error_upload'));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = async (index: number) => {
    const image = images[index];
    onChange(images.filter((_, i) => i !== index));
    await removeNewsImage(image.url);
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
                  onClick={() => void handleRemove(index)}
                  aria-label={`${t('admin:remove_photo')} ${index + 1}`}
                  className="absolute top-1 right-1 w-7 h-7 rounded-full bg-ink/70 text-white text-sm leading-none flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-kaya"
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
                  placeholder={t('admin:alt_placeholder')}
                  className="w-full rounded border border-border px-2 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-kaya/70"
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
        className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-gray-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/50 disabled:opacity-50"
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
