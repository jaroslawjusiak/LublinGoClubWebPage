// src/pages/PrivacyPage.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Section, Container } from '../components/primitives';

const sections = [
  { title: 'privacy:data_title', body: 'privacy:data_body' },
  { title: 'privacy:photos_title', body: 'privacy:photos_body' },
  { title: 'privacy:minors_title', body: 'privacy:minors_body' },
  { title: 'privacy:withdrawal_title', body: 'privacy:withdrawal_body' },
  { title: 'privacy:contact_title', body: 'privacy:contact_body' },
];

/**
 * Privacy notice + photo-consent policy. Content describes actual processing
 * only (no analytics/cookies/contact form in Tier A).
 */
const PrivacyPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Section id="prywatnosc">
      <Container width="reading">
        <h1 className="text-4xl font-medium tracking-tight text-ink mb-6">{t('privacy:title')}</h1>
        <p className="text-xl text-muted-text mb-10">{t('privacy:intro')}</p>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-2xl font-medium mb-2 text-ink">{t(section.title)}</h2>
              <p className="text-ink">{t(section.body)}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default PrivacyPage;
