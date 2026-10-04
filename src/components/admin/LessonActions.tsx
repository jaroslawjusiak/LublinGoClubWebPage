import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../primitives';
import type { Lesson } from '../../lib/lessons/repository';
import {
  deleteLessonWithFiles,
  updateLessonWithFiles,
  resolveLessonMutation,
  LessonMutationError,
  type LessonMutationAttempt,
} from '../../lib/lessons/mutations';
import { validateLessonFiles } from '../../lib/lessons/upload';

export default function LessonActions({
  lesson,
  onDone,
  disabled = false,
  onLockChange,
}: {
  lesson: Lesson;
  onDone: (message: string) => void;
  disabled?: boolean;
  onLockChange?: (locked: boolean) => void;
}) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(lesson.title);
  const [description, setDescription] = useState(lesson.description);
  const [pdf, setPdf] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const [pending, setPending] = useState<LessonMutationAttempt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const editRef = useRef<HTMLButtonElement>(null);
  const beginEdit = () => {
    setTitle(lesson.title);
    setDescription(lesson.description);
    setPdf(null);
    setThumbnail(null);
    setError(null);
    setSuccess(null);
    setEditing(true);
    requestAnimationFrame(() => titleRef.current?.focus());
  };
  const cancel = () => {
    setEditing(false);
    setPdf(null);
    setThumbnail(null);
    setError(null);
    requestAnimationFrame(() => editRef.current?.focus());
  };
  const run = async (kind: 'update' | 'delete', retry = false) => {
    if (busy.current || disabled) return;
    if (
      kind === 'delete' &&
      !retry &&
      !window.confirm(t('lessons:delete_confirm', { title: lesson.title }))
    )
      return;
    busy.current = true;
    onLockChange?.(true);
    let retainLock = false;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (retry && pending) await resolveLessonMutation(pending);
      else if (kind === 'delete') await deleteLessonWithFiles(lesson);
      else {
        if (!title.trim() || !description.trim()) {
          setError(t('lessons:fields_required'));
          return;
        }
        const validation = await validateLessonFiles(pdf, thumbnail, true);
        if (validation) {
          setError(t(`lessons:${validation}`));
          return;
        }
        await updateLessonWithFiles(lesson, title.trim(), description.trim(), pdf, thumbnail);
      }
      setPending(null);
      setEditing(false);
      setPdf(null);
      setThumbnail(null);
      const message = t(kind === 'delete' ? 'lessons:deleted' : 'lessons:updated');
      setSuccess(message);
      onDone(message);
    } catch (err) {
      if (err instanceof LessonMutationError) {
        retainLock = err.reason !== 'save';
        setPending(err.reason === 'save' ? null : err.attempt);
        setError(
          t(
            err.reason === 'verify'
              ? 'lessons:mutation_verify_failed'
              : err.reason === 'cleanup'
                ? 'lessons:mutation_cleanup_failed'
                : 'lessons:mutation_failed',
          ),
        );
      } else setError(t('lessons:mutation_failed'));
    } finally {
      busy.current = false;
      onLockChange?.(retainLock);
      setSaving(false);
    }
  };
  const inputClass = 'w-full min-w-0 rounded-md border border-border-control bg-surface px-3 py-2';
  const locked = disabled || saving || pending !== null;
  return (
    <div className="mt-2 min-w-0">
      <div className="flex flex-wrap gap-3">
        <button
          ref={editRef}
          type="button"
          onClick={beginEdit}
          disabled={locked || editing}
          className="min-h-11 rounded-lg border border-brand px-4 py-2 font-semibold text-brand hover:bg-sand disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={t('lessons:edit_named', { title: lesson.title })}
        >
          {t('lessons:edit')}
        </button>
        <Button
          variant="destructive"
          onClick={() => void run('delete')}
          disabled={locked || editing}
        >
          {t('lessons:delete_named', { title: lesson.title })}
        </Button>
      </div>
      {editing ? (
        <form
          className="mt-5 rounded-xl border border-border bg-surface p-5"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void run('update');
          }}
        >
          <h4 className="mb-5 font-semibold">{t('lessons:edit_named', { title: lesson.title })}</h4>
          <fieldset disabled={locked} className="min-w-0 space-y-4">
            <div>
              <label className="block font-medium mb-1" htmlFor={`edit-title-${lesson.id}`}>
                {t('lessons:title_label')}
              </label>
              <input
                ref={titleRef}
                id={`edit-title-${lesson.id}`}
                className={inputClass}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                maxLength={200}
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor={`edit-description-${lesson.id}`}>
                {t('lessons:description_label')}
              </label>
              <textarea
                id={`edit-description-${lesson.id}`}
                className={inputClass}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                maxLength={4000}
                rows={4}
              />
            </div>
            <p className="text-caption text-muted-text" id={`edit-files-help-${lesson.id}`}>
              {t('lessons:replacement_help')}
            </p>
            <div>
              <label className="block font-medium mb-1" htmlFor={`edit-pdf-${lesson.id}`}>
                {t('lessons:pdf_label')}
              </label>
              <input
                id={`edit-pdf-${lesson.id}`}
                className={inputClass}
                type="file"
                accept="application/pdf,.pdf"
                aria-describedby={`edit-files-help-${lesson.id}`}
                onChange={(event) => setPdf(event.target.files?.[0] ?? null)}
              />
              <a
                href={lesson.pdfUrl}
                className="inline-flex min-h-11 items-center underline underline-offset-4"
              >
                {t('lessons:current_pdf')}
              </a>
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor={`edit-thumbnail-${lesson.id}`}>
                {t('lessons:thumbnail_label')}
              </label>
              <input
                id={`edit-thumbnail-${lesson.id}`}
                className={inputClass}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                aria-describedby={`edit-files-help-${lesson.id}`}
                onChange={(event) => setThumbnail(event.target.files?.[0] ?? null)}
              />
              <a
                href={lesson.thumbnailUrl}
                className="inline-flex min-h-11 items-center underline underline-offset-4"
              >
                {t('lessons:current_thumbnail')}
              </a>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={locked}>
                {saving ? t('admin:saving') : t('lessons:save_changes')}
              </Button>
              <Button variant="secondary" onClick={cancel} disabled={locked}>
                {t('admin:cancel')}
              </Button>
            </div>
          </fieldset>
        </form>
      ) : null}
      {error ? (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-700 bg-red-50 p-4 text-red-800"
        >
          <p>{error}</p>
          {pending?.cleanup?.length ? (
            <p className="mt-2 text-caption [overflow-wrap:anywhere]">
              {pending.cleanup.map((asset) => `${asset.bucket}/${asset.path}`).join(', ')}
            </p>
          ) : null}
        </div>
      ) : null}
      {pending ? (
        <Button
          className="mt-3"
          variant="secondary"
          onClick={() => void run(pending.kind, true)}
          disabled={disabled || saving}
        >
          {saving
            ? t('admin:saving')
            : pending.confirmed === undefined
              ? t('lessons:verify_save')
              : t('admin:retry')}
        </Button>
      ) : null}
      {success ? (
        <p role="status" className="mt-3 text-green-800">
          {success}
        </p>
      ) : null}
    </div>
  );
}
