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
      <Section id="home-hero" spacing="hero">
        <Container className="grid items-center gap-8 min-[960px]:grid-cols-[45fr_55fr] min-[960px]:gap-10">
          <div className="min-w-0">
            <h1 className="text-display font-medium text-ink mb-6 max-w-[12ch]">
              {t('hero:title')}
            </h1>
            <p className="text-lead text-muted-text mb-8 max-w-[45ch]">{t('hero:subtitle')}</p>
            <div className="flex flex-col min-[400px]:flex-row min-[400px]:flex-wrap gap-3">
              <Button onClick={scrollToMeeting} variant="primary">
                {t('hero:cta_primary')}
              </Button>
              <Button to={localizePath('/zacznij', locale)} variant="secondary">
                {t('hero:cta_secondary')}
              </Button>
            </div>
          </div>
          <picture className="block min-w-0 overflow-hidden rounded-xl">
            <source
              type="image/avif"
              srcSet="/assets/hero/goban-goke-640.avif 640w, /assets/hero/goban-goke-960.avif 960w, /assets/hero/goban-goke-1440.avif 1440w"
              sizes="(min-width: 1200px) 603px, (min-width: 1024px) calc(55vw - 57px), (min-width: 960px) calc(55vw - 44px), (min-width: 360px) calc(100vw - 40px), calc(100vw - 32px)"
            />
            <source
              type="image/webp"
              srcSet="/assets/hero/goban-goke-640.webp 640w, /assets/hero/goban-goke-960.webp 960w, /assets/hero/goban-goke-1440.webp 1440w"
              sizes="(min-width: 1200px) 603px, (min-width: 1024px) calc(55vw - 57px), (min-width: 960px) calc(55vw - 44px), (min-width: 360px) calc(100vw - 40px), calc(100vw - 32px)"
            />
            <img
              src="/assets/hero/goban-goke-960.jpg"
              srcSet="/assets/hero/goban-goke-640.jpg 640w, /assets/hero/goban-goke-960.jpg 960w, /assets/hero/goban-goke-1440.jpg 1440w"
              sizes="(min-width: 1200px) 603px, (min-width: 1024px) calc(55vw - 57px), (min-width: 960px) calc(55vw - 44px), (min-width: 360px) calc(100vw - 40px), calc(100vw - 32px)"
              alt=""
              width={1440}
              height={1080}
              loading="eager"
              className="block aspect-[4/3] h-auto w-full object-cover object-center"
            />
          </picture>
        </Container>
      </Section>

      <Container className="py-16">
        <h2 className="text-3xl md:text-4xl font-medium text-center mb-12 text-ink">
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
        <h2 className="text-3xl md:text-4xl font-medium text-center mb-8 text-ink">
          {t('homepage:news_title')}
        </h2>

        <NewsFeed limit={3} />

        <div className="text-center mt-10">
          <Link
            to={localizePath('/aktualnosci', locale)}
            className="text-brand font-semibold hover:underline"
          >
            {t('common:view_all_articles')} →
          </Link>
        </div>
      </Container>
    </>
  );
};

export default HomePage;
