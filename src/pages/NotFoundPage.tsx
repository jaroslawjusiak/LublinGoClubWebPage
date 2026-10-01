// src/pages/NotFoundPage.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Section, Button } from '../components/primitives';
import { useLocale, localizePath } from '../i18n/locale';
import PageIntro from '../components/PageIntro';

/**
 * Deliberate fallback for unknown routes. Never a blank screen.
 */
const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  return (
    <Section id="not-found">
      <Container width="reading">
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="w-20 h-20 mb-8 text-border"
          fill="none"
        >
          <path
            d="M10 10H90M10 30H90M10 50H90M10 70H90M10 90H90M10 10V90M30 10V90M50 10V90M70 10V90M90 10V90"
            stroke="currentColor"
          />
          <circle cx="30" cy="50" r="9" className="fill-brand" />
          <circle cx="50" cy="70" r="9" className="fill-surface stroke-ink" />
        </svg>
        <PageIntro title={t('notFound:title')} intro={t('notFound:message')} />
        <Button
          to={localizePath('/', locale)}
          variant="primary"
          className="max-w-full [overflow-wrap:anywhere]"
        >
          {t('notFound:back_home')}
        </Button>
      </Container>
    </Section>
  );
};

export default NotFoundPage;
