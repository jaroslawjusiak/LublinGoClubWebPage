// src/pages/OKlubiePage.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Section, Container, Button } from '../components/primitives';
import PageIntro from '../components/PageIntro';
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
      <Container className="grid items-start gap-8 min-[960px]:grid-cols-2 min-[960px]:gap-12">
        <div className="min-w-0">
          <PageIntro title={t('oklubie:title')} intro={t('oklubie:intro')} />
          <Button
            to={localizePath('/zacznij', locale)}
            variant="primary"
            className="max-w-full [overflow-wrap:anywhere]"
          >
            {t('common:cta_start_button')}
          </Button>
        </div>
        <div className="min-w-0 rounded-xl bg-sand p-6 md:p-8 [overflow-wrap:anywhere]">
          <h2 className="text-h2 mb-5 text-ink">{t('oklubie:typical_title')}</h2>
          <p className="text-ink max-w-[60ch]">{t('oklubie:typical_text')}</p>
        </div>
      </Container>
    </Section>
  );
};

export default OKlubiePage;
