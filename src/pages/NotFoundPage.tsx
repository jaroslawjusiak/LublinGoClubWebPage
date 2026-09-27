// src/pages/NotFoundPage.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Section, Button } from '../components/primitives';

/**
 * Deliberate fallback for unknown routes. Never a blank screen.
 */
const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Section id="not-found">
      <Container className="text-center py-10">
        <h1 className="text-4xl font-extrabold mb-4 text-ink">{t('notFound:title')}</h1>
        <p className="text-lg text-muted-text mb-8">{t('notFound:message')}</p>
        <Button to="/" variant="primary" className="px-6 py-3">
          {t('notFound:back_home')}
        </Button>
      </Container>
    </Section>
  );
};

export default NotFoundPage;
