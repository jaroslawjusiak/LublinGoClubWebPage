import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Section } from '../components/primitives';
import PageIntro from '../components/PageIntro';
import RulesSection from '../components/RulesSection';

const ZasadyPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Section id="zasady">
      <Container>
        <PageIntro title={t('rules:title')} intro={t('rules:intro')} />
        <RulesSection />
      </Container>
    </Section>
  );
};

export default ZasadyPage;
