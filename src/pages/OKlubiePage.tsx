// src/pages/OKlubiePage.tsx
import React from 'react';
import { Section } from '../components/primitives'; // Placeholder
import { useTranslation } from 'react-i18next';

const OKlubiePage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Section id="o-klubie">
      <div className="text-center py-10">
        <h2 className="text-4xl font-bold mb-6">{t('oklubie:section_title')}</h2>
        <p className="mb-8 text-lg">{t('oklubie:description')}</p>
      </div >
    </Section>
  );
};

export default OKlubiePage;