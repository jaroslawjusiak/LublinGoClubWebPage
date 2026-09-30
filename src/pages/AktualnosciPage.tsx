// src/pages/AktualnosciPage.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Section, Container } from '../components/primitives';
import NewsFeed from '../components/NewsFeed';

/**
 * Public news feed. Renders the same `NewsFeed` the Home preview uses, so posts
 * always appear newest-first and in sync with the repository.
 */
const AktualnosciPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Section id="aktualnosci">
      <Container>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-medium tracking-tight text-ink mb-3">
            {t('aktualnosci:news_heading')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-muted-text">
            {t('common:news_description')}
          </p>
        </div>

        <NewsFeed />
      </Container>
    </Section>
  );
};

export default AktualnosciPage;
