// src/pages/OKlubiePage.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Section, Container, Button } from '../components/primitives';
import { useLocale, localizePath } from '../i18n/locale';

/**
 * About page. Content is intentionally limited to what is verifiable today:
 * the club's purpose and what a typical meeting is like. A fuller founding
 * story, people bios and consented photos are added later (see N2) and must
 * not be fabricated here.
 */
const OKlubiePage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  return (
    <Section id="o-klubie">
      <Container width="reading">
        <h1 className="text-4xl font-medium tracking-tight text-ink mb-6">{t('oklubie:title')}</h1>
        <p className="text-xl text-muted-text mb-10">{t('oklubie:intro')}</p>

        <h2 className="text-2xl md:text-3xl font-medium mb-4 text-ink">
          {t('oklubie:typical_title')}
        </h2>
        <p className="text-lg text-ink mb-10">{t('oklubie:typical_text')}</p>

        <Button to={localizePath('/zacznij', locale)} variant="primary" className="text-lg">
          {t('common:cta_start_button')}
        </Button>
      </Container>
    </Section>
  );
};

export default OKlubiePage;
