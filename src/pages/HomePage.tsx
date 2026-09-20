// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Section, Container, Card, Button } from '../components/primitives';
import { newsRepository } from '../lib/news/repository';
import type { NewsPost } from '../types/data_models';

const homePropositions = [
  { titleKey: 'homepage:proposition_1_title', descriptionKey: 'homepage:proposition_1_description' },
  { titleKey: 'homepage:proposition_2_title', descriptionKey: 'homepage:proposition_2_description' },
  { titleKey: 'homepage:proposition_3_title', descriptionKey: 'homepage:proposition_3_description' },
];

const FeaturedNewsCard: React.FC<{ post: NewsPost }> = ({ post }) => (
  <Card className="flex flex-col h-full">
    <div className="h-40 bg-gray-200 mb-4 rounded overflow-hidden">
      {post.imageUrlReferences[0] ? (
        <img
          src={post.imageUrlReferences[0]}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : null}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-ink">{post.title}</h3>
    <p className="text-sm mb-4 flex-grow text-muted-text">{post.summary}</p>
    <div className="flex flex-wrap gap-2">
      {post.tags.map((tag) => (
        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
          {tag}
        </span>
      ))}
    </div>
  </Card>
);

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    newsRepository
      .listPublished(1, 3)
      .then((page) => {
        if (active) setNewsPosts(page.posts);
      })
      .catch((cause: unknown) => {
        if (active) {
          setNewsError(cause instanceof Error ? cause.message : 'Nie udało się wczytać aktualności.');
        }
      })
      .finally(() => {
        if (active) setLoadingNews(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Section id="home-hero" className="py-0">
        <div className="min-h-[420px] flex items-center justify-center text-center py-20 bg-gradient-to-r from-indigo-50 to-white">
          <div className="max-w-3xl px-4">
            <h1 className="text-5xl md:text-6xl font-extrabold text-ink mb-6 leading-tight">
              {t('hero:title')}
            </h1>
            <p className="text-2xl text-muted-text mb-10 max-w-xl mx-auto">{t('hero:subtitle')}</p>
            <Button to="/zacznij" variant="primary" className="px-10 py-4 text-xl">
              {t('homepage:cta_button')}
            </Button>
          </div>
        </div>
      </Section>

      <Container className="pt-20 pb-16">
        <h2 className="text-4xl font-bold text-center mb-16 text-ink">
          {t('homepage:section_heading')}
        </h2>

        {/* News feed */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold mb-8 border-b border-border pb-2 text-ink">
            {t('homepage:news_title')}
          </h3>

          {loadingNews ? (
            <p className="text-center py-10 text-lg text-muted-text">
              Ładowanie najnowszych wydarzeń…
            </p>
          ) : null}

          {newsError ? (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto"
              role="alert"
            >
              <p>{newsError}</p>
            </div>
          ) : null}

          {!loadingNews && !newsError && newsPosts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {newsPosts.map((post) => (
                <FeaturedNewsCard key={post.id} post={post} />
              ))}
            </div>
          ) : null}

          {!loadingNews && !newsError && newsPosts.length === 0 ? (
            <p className="text-center py-10 text-lg text-muted-text">
              Brak aktualnych wiadomości.
            </p>
          ) : null}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {homePropositions.map((proposition) => (
            <Card key={proposition.titleKey}>
              <h3 className="text-xl font-semibold mb-3 text-ink">{t(proposition.titleKey)}</h3>
              <p className="text-muted-text">{t(proposition.descriptionKey)}</p>
            </Card>
          ))}
        </div>

        <div className="text-center mt-20">
          <Link to="/o-klubie" className="text-kaya font-semibold hover:underline">
            {t('oklubie:section_title')} →
          </Link>
        </div>
      </Container>
    </>
  );
};

export default HomePage;
