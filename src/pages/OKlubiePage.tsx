// src/pages/OKlubiePage.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Section, Container, Button } from '../components/primitives';
import PageIntro from '../components/PageIntro';
import { useLocale, localizePath } from '../i18n/locale';

/**
 * About page with the club's approved short introduction.
 */
const OKlubiePage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  return (
    <Section id="o-klubie">
      <Container className="grid items-start gap-8 min-[960px]:grid-cols-2 min-[960px]:gap-12">
        <div className="min-w-0">
          <PageIntro title={t('oklubie:title')} intro={t('oklubie:intro')} spacing="compact" />
          <p className="mb-8 max-w-[60ch] text-lead text-muted-text [overflow-wrap:anywhere]">
            {t('oklubie:second_paragraph')}
          </p>
          <Button
            to={localizePath('/zacznij-grac', locale)}
            variant="primary"
            className="max-w-full [overflow-wrap:anywhere]"
          >
            {t('common:cta_start_button')}
          </Button>
        </div>
        <div className="min-w-0 rounded-xl bg-sand p-6 md:p-8 [overflow-wrap:anywhere]">
          <h2 className="text-h2 mb-5 text-ink">{t('oklubie:typical_title')}</h2>
          <p className="text-ink max-w-[60ch]">{t('oklubie:typical_text')}</p>
          <figure className="mt-6">
            <img
              src="/assets/spotkania/turniej.webp"
              alt={t('oklubie:tournament_image_alt')}
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
              className="aspect-video w-full rounded-lg object-cover"
            />
            <figcaption className="mt-2 text-sm text-muted-text">
              {t('oklubie:tournament_image_caption')}
            </figcaption>
          </figure>
        </div>
      </Container>
    </Section>
  );
};

export default OKlubiePage;
