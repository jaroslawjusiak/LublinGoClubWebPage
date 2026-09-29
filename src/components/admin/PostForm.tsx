// src/components/admin/PostForm.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button } from '../primitives';
import ImagePicker from './ImagePicker';
import { newsRepository, type NewsPostInput } from '../../lib/news/repository';
import { removeNewsImages } from '../../lib/supabase/storage';
import type { NewsPost, PostTag } from '../../types/data_models';

interface PostFormProps {
  /** When present, the form edits this post; otherwise it creates a new one. */
  initial?: NewsPost;
  onDone: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

const PostForm: React.FC<PostFormProps> = ({ initial, onDone }) => {
  const { t } = useTranslation();

  const [title, setTitle] = useState(initial?.title ?? '');
  const [body, setBody] = useState(initial?.body ?? '');
  const [publishedAt, setPublishedAt] = useState(initial?.publishedAt.slice(0, 10) ?? today());
  const [tag, setTag] = useState<PostTag | ''>(initial?.tag ?? '');
  const [externalUrl, setExternalUrl] = useState(initial?.externalUrl ?? '');
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = t('admin:error_title_required');
    if (!body.trim()) next.body = t('admin:error_body_required');
    if (!publishedAt) next.publishedAt = t('admin:error_date_required');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (publish: boolean) => {
    // Guard against double-submission (e.g. Enter while a save is in flight).
    if (saving) return;
    if (!validate()) return;

    setSaving(true);
    setSaveError(null);
    const input: NewsPostInput = {
      title: title.trim(),
      body: body.trim(),
      publishedAt: new Date(publishedAt).toISOString(),
      published: publish,
      tag: tag || undefined,
      images,
      externalUrl: externalUrl.trim() || undefined,
    };

    try {
      if (initial) {
        await newsRepository.update(initial.id, input);
      } else {
        await newsRepository.create(input);
      }
      onDone();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : t('admin:error_save'));
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initial) return;
    if (!window.confirm(t('admin:delete_confirm'))) return;

    setSaving(true);
    setSaveError(null);
    try {
      await newsRepository.remove(initial.id);
      await removeNewsImages(initial.images);
      onDone();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : t('admin:error_save'));
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    // Remove any images uploaded in this session that are not part of the post.
    const original = new Set(initial?.images ?? []);
    const sessionImages = images.filter((url) => !original.has(url));
    if (sessionImages.length) await removeNewsImages(sessionImages);
    onDone();
  };

  /**
   * Implicit form submission (pressing Enter in a text field, or activating the
   * default submit button) always performs the *safe* action: save as a draft
   * for a new post or a draft, and preserve the published status when editing a
   * published post. Publishing is a separate, explicit action ("Opublikuj").
   */
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSubmit(initial?.published === true);
  };

  return (
    <Card>
      <form onSubmit={handleFormSubmit} noValidate>
        <h2 className="text-2xl font-bold mb-6 text-ink">
          {initial ? t('admin:edit_post') : t('admin:new_post')}
        </h2>

        <div className="space-y-5">
          <div>
            <label htmlFor="post-title" className="block font-medium mb-1 text-ink">
              {t('admin:title_label')}
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-kaya/70"
            />
            {errors.title ? (
              <p role="alert" className="mt-1 text-sm text-red-700">
                {errors.title}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="post-body" className="block font-medium mb-1 text-ink">
              {t('admin:body_label')}
            </label>
            <textarea
              id="post-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-kaya/70"
            />
            {errors.body ? (
              <p role="alert" className="mt-1 text-sm text-red-700">
                {errors.body}
              </p>
            ) : null}
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="post-date" className="block font-medium mb-1 text-ink">
                {t('admin:date_label')}
              </label>
              <input
                id="post-date"
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-kaya/70"
              />
              {errors.publishedAt ? (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  {errors.publishedAt}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="post-tag" className="block font-medium mb-1 text-ink">
                {t('admin:tag_label')}
              </label>
              <select
                id="post-tag"
                value={tag}
                onChange={(e) => setTag(e.target.value as PostTag | '')}
                className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-kaya/70"
              >
                <option value="">{t('admin:tag_none')}</option>
                <option value="spotkanie">{t('aktualnosci:tag_spotkanie')}</option>
                <option value="turniej">{t('aktualnosci:tag_turniej')}</option>
                <option value="wydarzenie">{t('aktualnosci:tag_wydarzenie')}</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="post-link" className="block font-medium mb-1 text-ink">
              {t('admin:link_label')}
            </label>
            <input
              id="post-link"
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://…"
              className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-kaya/70"
            />
          </div>

          <div>
            <span className="block font-medium mb-1 text-ink">{t('admin:photos_label')}</span>
            <ImagePicker images={images} onChange={setImages} />
          </div>
        </div>

        {saveError ? (
          <p role="alert" className="mt-4 text-red-700">
            {saveError}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3 mt-8">
          {initial?.published ? (
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              className="px-6 py-3"
            >
              {saving ? t('admin:saving') : t('admin:save')}
            </Button>
          ) : (
            <>
              <Button type="submit" disabled={saving} className="px-6 py-3">
                {saving ? t('admin:saving') : t('admin:save_draft')}
              </Button>
              <Button
                type="button"
                onClick={() => void handleSubmit(true)}
                variant="primary"
                disabled={saving}
                className="px-6 py-3"
              >
                {t('admin:publish')}
              </Button>
            </>
          )}
          <Button type="button" onClick={() => void handleCancel()} disabled={saving} className="px-6 py-3">
            {t('admin:cancel')}
          </Button>
          {initial ? (
            <Button
              type="button"
              onClick={() => void handleDelete()}
              disabled={saving}
              className="px-6 py-3 ml-auto bg-red-600 border-red-600 text-white hover:opacity-90"
            >
              {t('admin:delete')}
            </Button>
          ) : null}
        </div>
      </form>
    </Card>
  );
};

export default PostForm;
