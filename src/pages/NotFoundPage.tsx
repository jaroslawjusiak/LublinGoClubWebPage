// src/pages/NotFoundPage.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Section, Button } from '../components/primitives';
import { useLocale, localizePath } from '../i18n/locale';

/**
 * Deliberate fallback for unknown routes. Never a blank screen.
 */
const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  return (
    <Section id="not-found">
      <Container className="text-center py-10">
        <h1 className="text-4xl font-medium mb-4 text-ink">{t('notFound:title')}</h1>
        <p className="text-lg text-muted-text mb-8">{t('notFound:message')}</p>
        <Button to={localizePath('/', locale)} variant="primary">
          {t('notFound:back_home')}
        </Button>
      </Container>
    </Section>
  );
};

export default NotFoundPage;
