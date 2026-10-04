import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '../primitives';
import LessonActions from './LessonActions';
import { lessonsRepository, type Lesson } from '../../lib/lessons/repository';
import {
  cleanupLessonAssets,
  createLessonWithFiles,
  LessonSaveError,
  validateLessonFiles,
  type Asset,
  type PendingLessonAttempt,
  resolveLessonAttempt,
} from '../../lib/lessons/upload';

export default function LessonManager() {
  const { t } = useTranslation();
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [listError, setListError] = useState(false);
  const [reload, setReload] = useState(0);
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdf, setPdf] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const [pendingCleanup, setPendingCleanup] = useState<Asset[]>([]);
  const [pendingAttempt, setPendingAttempt] = useState<PendingLessonAttempt | undefined>();
  const form = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    lessonsRepository
      .list()
      .then((items) => {
        if (active) setLessons(items);
      })
      .catch(() => {
        if (active) setListError(true);
      });
    return () => {
      active = false;
    };
  }, [reload]);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy.current || activeRow) return;
    busy.current = true;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (!title.trim() || !description.trim()) {
        setError(t('lessons:fields_required'));
        return;
      }
      const validation = await validateLessonFiles(pdf, thumbnail);
      if (validation) {
        setError(t(`lessons:${validation}`));
        return;
      }
      const recovered = pendingAttempt ? await resolveLessonAttempt(pendingAttempt) : null;
      setPendingAttempt(undefined);
      const failed = await cleanupLessonAssets(pendingCleanup);
      setPendingCleanup(failed);
      if (failed.length) {
        setError(t('lessons:cleanup_failed'));
        return;
      }
      if (!recovered)
        await createLessonWithFiles(title.trim(), description.trim(), pdf!, thumbnail!);
      setTitle('');
      setDescription('');
      setPdf(null);
      setThumbnail(null);
      form.current?.reset();
      setSuccess(t('lessons:saved'));
      setLessons(null);
      setListError(false);
      setReload((value) => value + 1);
    } catch (err) {
      if (err instanceof LessonSaveError) {
        setPendingCleanup(err.pendingCleanup);
        setPendingAttempt(err.pendingAttempt);
        setError(
          t(
            err.pendingAttempt
              ? 'lessons:verify_failed'
              : err.pendingCleanup.length
                ? 'lessons:cleanup_failed'
                : 'lessons:save_error',
          ),
        );
      } else setError(t('lessons:save_error'));
    } finally {
      busy.current = false;
      setSaving(false);
    }
  };
  const inputClass = 'w-full min-w-0 rounded-md border border-border-control bg-surface px-3 py-2';
  return (
    <div className="mt-10 border-t border-border pt-8">
      <h2 className="text-h3 font-sans font-semibold mb-5">{t('lessons:manage')}</h2>
      <Card>
        <form ref={form} onSubmit={(event) => void submit(event)} noValidate>
          <h3 className="mb-5 font-semibold">{t('lessons:add')}</h3>
          <fieldset disabled={saving || !!activeRow} className="min-w-0 space-y-5">
            <div>
              <label htmlFor="lesson-title" className="block font-medium mb-1">
                {t('lessons:title_label')}
              </label>
              <input
                id="lesson-title"
                className={inputClass}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={200}
                required
              />
            </div>
            <div>
              <label htmlFor="lesson-description" className="block font-medium mb-1">
                {t('lessons:description_label')}
              </label>
              <textarea
                id="lesson-description"
                className={inputClass}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                maxLength={4000}
                required
              />
            </div>
            <div>
              <label htmlFor="lesson-pdf" className="block font-medium mb-1">
                {t('lessons:pdf_label')}
              </label>
              <input
                id="lesson-pdf"
                className={inputClass}
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) => setPdf(event.target.files?.[0] ?? null)}
                aria-describedby="lesson-file-help"
                required
              />
            </div>
            <div>
              <label htmlFor="lesson-thumbnail" className="block font-medium mb-1">
                {t('lessons:thumbnail_label')}
              </label>
              <input
                id="lesson-thumbnail"
                className={inputClass}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setThumbnail(event.target.files?.[0] ?? null)}
                aria-describedby="lesson-file-help"
                required
              />
            </div>
            <p id="lesson-file-help" className="text-caption text-muted-text">
              {t('lessons:file_help')}
            </p>
            <Button type="submit" disabled={saving}>
              {saving
                ? t('admin:saving')
                : pendingAttempt
                  ? t('lessons:verify_save')
                  : t('lessons:add')}
            </Button>
          </fieldset>
          {error ? (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-700 bg-red-50 p-4 text-red-800"
            >
              {error}
              {pendingCleanup.length ? (
                <span className="block mt-2 text-caption">
                  {pendingCleanup.map((asset) => `${asset.bucket}/${asset.path}`).join(', ')}
                </span>
              ) : null}
            </p>
          ) : null}
          {success ? (
            <p role="status" className="mt-4 text-green-800">
              {success}
            </p>
          ) : null}
        </form>
      </Card>
      <h3 className="mt-8 mb-4 font-semibold">{t('lessons:existing')}</h3>
      {listError ? (
        <div role="alert">
          <p>{t('lessons:load_error')}</p>
          <Button
            onClick={() => {
              setLessons(null);
              setListError(false);
              setReload((value) => value + 1);
            }}
            variant="secondary"
            disabled={!!activeRow}
            className="mt-3"
          >
            {t('admin:retry')}
          </Button>
        </div>
      ) : lessons === null ? (
        <p>{t('lessons:loading')}</p>
      ) : lessons.length === 0 ? (
        <p>{t('lessons:empty')}</p>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {lessons.map((lesson) => (
            <li key={lesson.id} className="py-3">
              <a
                lang={lesson.language}
                href={lesson.pdfUrl}
                className="inline-flex min-h-11 items-center underline underline-offset-4"
              >
                {lesson.title}
              </a>
              <LessonActions
                lesson={lesson}
                disabled={
                  saving ||
                  !!pendingAttempt ||
                  pendingCleanup.length > 0 ||
                  (!!activeRow && activeRow !== lesson.id)
                }
                onLockChange={(locked) => setActiveRow(locked ? lesson.id : null)}
                onDone={(message) => {
                  setSuccess(message);
                  setReload((value) => value + 1);
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
