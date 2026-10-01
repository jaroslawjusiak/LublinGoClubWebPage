// src/pages/AktualnosciPage.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Section, Container } from '../components/primitives';
import NewsFeed from '../components/NewsFeed';
import PageIntro from '../components/PageIntro';

/**
 * Public news feed. Renders the same `NewsFeed` the Home preview uses, so posts
 * always appear newest-first and in sync with the repository.
 */
const AktualnosciPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Section id="aktualnosci">
      <Container>
        <PageIntro title={t('aktualnosci:news_heading')} intro={t('common:news_description')} />
        <NewsFeed />
      </Container>
    </Section>
  );
};

export default AktualnosciPage;
