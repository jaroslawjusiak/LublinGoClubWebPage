// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LuHeart, LuLayers, LuSprout, LuUsers } from 'react-icons/lu';
import { Section, Container, Button } from '../components/primitives';
import MeetingSection from '../components/MeetingSection';
import NewsFeed from '../components/NewsFeed';
import { useLocale, localizePath } from '../i18n/locale';

const reassuranceKeys = [
  { title: 'homepage:reassurance_1_title', text: 'homepage:reassurance_1_text', icon: LuSprout },
  { title: 'homepage:reassurance_2_title', text: 'homepage:reassurance_2_text', icon: LuLayers },
  { title: 'homepage:reassurance_3_title', text: 'homepage:reassurance_3_text', icon: LuHeart },
  { title: 'homepage:reassurance_4_title', text: 'homepage:reassurance_4_text', icon: LuUsers },
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
            <h1 className="text-display font-medium text-ink mb-6 max-w-[12ch] [overflow-wrap:anywhere]">
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
              srcSet="/assets/hero/board-retouched-640.avif 640w, /assets/hero/board-retouched-960.avif 960w, /assets/hero/board-retouched-1440.avif 1440w"
              sizes="(min-width: 1200px) 603px, (min-width: 1024px) calc(55vw - 57px), (min-width: 960px) calc(55vw - 44px), (min-width: 360px) calc(100vw - 40px), calc(100vw - 32px)"
            />
            <source
              type="image/webp"
              srcSet="/assets/hero/board-retouched-640.webp 640w, /assets/hero/board-retouched-960.webp 960w, /assets/hero/board-retouched-1440.webp 1440w"
              sizes="(min-width: 1200px) 603px, (min-width: 1024px) calc(55vw - 57px), (min-width: 960px) calc(55vw - 44px), (min-width: 360px) calc(100vw - 40px), calc(100vw - 32px)"
            />
            <img
              src="/assets/hero/board-retouched-960.jpg"
              srcSet="/assets/hero/board-retouched-640.jpg 640w, /assets/hero/board-retouched-960.jpg 960w, /assets/hero/board-retouched-1440.jpg 1440w"
              sizes="(min-width: 1200px) 603px, (min-width: 1024px) calc(55vw - 57px), (min-width: 960px) calc(55vw - 44px), (min-width: 360px) calc(100vw - 40px), calc(100vw - 32px)"
              alt=""
              width={1440}
              height={960}
              loading="eager"
              className="block aspect-[3/2] h-auto w-full object-cover object-center"
            />
          </picture>
        </Container>
      </Section>

      <div className="bg-sand py-8 md:py-12">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reassuranceKeys.map((item) => (
              <div key={item.title} className="flex min-w-0 items-start gap-3">
                <item.icon
                  aria-hidden="true"
                  focusable="false"
                  className="mt-1 h-6 w-6 shrink-0 text-accent"
                />
                <div className="min-w-0 [overflow-wrap:anywhere]">
                  <h2 className="text-body font-sans font-semibold mb-2 text-ink">
                    {t(item.title)}
                  </h2>
                  <p className="text-muted-text">{t(item.text)}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <MeetingSection intro="home" />

      <Section>
        <Container>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
            <h2 className="min-w-0 text-h2 text-ink [overflow-wrap:anywhere]">
              {t('homepage:news_title')}
            </h2>
            <Link
              to={localizePath('/aktualnosci', locale)}
              className="min-w-0 inline-flex min-h-11 items-center text-brand font-semibold underline underline-offset-4 hover:decoration-2 [overflow-wrap:anywhere]"
            >
              <span>
                {t('common:view_all_articles')}
                {'\u00a0'}
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
          <NewsFeed limit={3} />
        </Container>
      </Section>
    </>
  );
};

export default HomePage;
