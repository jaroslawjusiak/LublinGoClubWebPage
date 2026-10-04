import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Section, Button } from '../components/primitives';
import PageIntro from '../components/PageIntro';
import { lessonsRepository, type Lesson } from '../lib/lessons/repository';

export default function LekcjePage() {
  const { t } = useTranslation();
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let active = true;
    lessonsRepository
      .list()
      .then((items) => {
        if (active) setLessons(items);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [reload]);
  return (
    <Section id="lekcje">
      <Container>
        <PageIntro title={t('lessons:title')} intro={t('lessons:intro')} />
        <p className="mb-8 text-muted-text">{t('lessons:polish_note')}</p>
        {error ? (
          <div role="alert" className="rounded-xl border border-red-700 bg-red-50 p-5 text-red-800">
            <p>{t('lessons:load_error')}</p>
            <Button
              variant="secondary"
              className="mt-3"
              onClick={() => {
                setLessons(null);
                setError(false);
                setReload((value) => value + 1);
              }}
            >
              {t('admin:retry')}
            </Button>
          </div>
        ) : lessons === null ? (
          <p role="status" className="rounded-xl bg-sand p-5">
            {t('lessons:loading')}
          </p>
        ) : lessons.length === 0 ? (
          <p className="rounded-xl bg-sand p-5">{t('lessons:empty')}</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 min-[960px]:grid-cols-2">
            {lessons.map((lesson) => (
              <article
                key={lesson.id}
                className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-surface [overflow-wrap:anywhere]"
              >
                <img
                  src={lesson.thumbnailUrl}
                  alt=""
                  width={800}
                  height={451}
                  loading="lazy"
                  className="aspect-video w-full object-contain bg-sand"
                />
                <div className="flex flex-1 flex-col items-start p-6 md:p-8">
                  <div lang={lesson.language}>
                    <h2 className="text-h3 font-sans font-semibold mb-3">{lesson.title}</h2>
                    <p className="mb-5 text-muted-text">{lesson.description}</p>
                  </div>
                  <p className="mb-5 text-caption text-muted-text">
                    PDF
                    {lesson.pageCount !== null
                      ? ` · ${t('lessons:pages', { count: lesson.pageCount })}`
                      : ''}
                  </p>
                  <a
                    href={lesson.pdfUrl}
                    className="mt-auto inline-flex min-h-11 items-center rounded-lg border border-brand bg-brand px-5 py-2.5 font-semibold text-on-brand hover:bg-brand-hover"
                    aria-label={`${t('lessons:open_pdf')}: ${lesson.title}`}
                  >
                    {t('lessons:open_pdf')}
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
