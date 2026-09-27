// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Section, Container, Card, Button } from '../components/primitives';
import MeetingSection from '../components/MeetingSection';
import NewsFeed from '../components/NewsFeed';
import { useLocale, localizePath } from '../i18n/locale';

const reassuranceKeys = [
  { title: 'homepage:reassurance_1_title', text: 'homepage:reassurance_1_text' },
  { title: 'homepage:reassurance_2_title', text: 'homepage:reassurance_2_text' },
  { title: 'homepage:reassurance_3_title', text: 'homepage:reassurance_3_text' },
  { title: 'homepage:reassurance_4_title', text: 'homepage:reassurance_4_text' },
];

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  const scrollToMeeting = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('spotkania')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <>
      <Section id="home-hero" className="py-0">
        <div className="min-h-[380px] flex flex-col items-center justify-center text-center py-16">
          <div className="max-w-3xl px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-ink mb-6 leading-tight">
              {t('hero:title')}
            </h1>
            <p className="text-xl text-muted-text mb-10 max-w-2xl mx-auto">{t('hero:subtitle')}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={scrollToMeeting} variant="primary" className="px-8 py-4 text-lg">
                {t('hero:cta_primary')}
              </Button>
              <Button to={localizePath('/zacznij', locale)} variant="secondary" className="px-8 py-4 text-lg">
                {t('hero:cta_secondary')}
              </Button>
            </div>
          </div>
          <img
            src="/assets/go-board.png"
            alt=""
            width={800}
            height={248}
            loading="eager"
            className="mx-auto mt-12 w-full max-w-2xl px-4 rounded-lg"
          />
        </div>
      </Section>

      <Container className="py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-ink">
          {t('homepage:reassurance_title')}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reassuranceKeys.map((item) => (
            <Card key={item.title}>
              <h3 className="text-lg font-semibold mb-2 text-ink">{t(item.title)}</h3>
              <p className="text-muted-text">{t(item.text)}</p>
            </Card>
          ))}
        </div>
      </Container>

      <MeetingSection />

      <Container className="py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-ink">
          {t('homepage:news_title')}
        </h2>

        <NewsFeed limit={3} />

        <div className="text-center mt-10">
          <Link to={localizePath('/aktualnosci', locale)} className="text-kaya font-semibold hover:underline">
            {t('common:view_all_articles')} →
          </Link>
        </div>
      </Container>
    </>
  );
};

export default HomePage;
