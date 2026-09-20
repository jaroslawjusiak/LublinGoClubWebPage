import React from 'react';
import { useTranslation } from 'react-i18next';
import { Section, Container } from '../components/primitives';
import NewsPostCard from '../components/NewsPostCard';
import { NewsPost } from '../types/data_models';

// --- Placeholder data (a later task wires this to the news repository) ---
const mockNewsPosts: NewsPost[] = [
  {
    id: '1',
    title: 'Turniej Mistrzów Go — najnowsze wyniki',
    summary:
      'Pokazaliśmy mistrzowskie ruchy podczas niedawnego turnieju. Szczegółowy raport i zdjęcia dostępne na stronie.',
    publishedDate: '2026-08-15',
    tags: ['turniej'],
    imageUrlReferences: ['/images/placeholder-tournament.jpg'],
  },
  {
    id: '2',
    title: 'Warsztaty dla początkujących',
    summary:
      'Naucz się podstaw gry w Go od A do Z na naszych weekendowych warsztatach. Dla każdego!',
    publishedDate: '2026-08-01',
    tags: ['warsztaty'],
    imageUrlReferences: ['/images/placeholder-beginner.jpg'],
  },
  {
    id: '3',
    title: 'Historia i filozofia Go',
    summary:
      'Go to nie tylko gra, ale też sztuka. Zanurz się w bogatą kulturę strategicznej myśli.',
    publishedDate: '2026-07-20',
    tags: ['artykuł'],
    imageUrlReferences: ['/images/placeholder-art.jpg'],
  },
];

/**
 * @description Page listing recent news and articles using reusable components.
 */
const AktualnosciPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Section id="aktualnosci">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight text-ink mb-3">
            {t('aktualnosci:news_heading')}
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-muted-text">{t('common:news_description')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {mockNewsPosts.map((post) => (
            <NewsPostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="text-center pt-8">
          <button
            type="button"
            className="inline-flex items-center gap-3 py-2 px-6 text-lg font-semibold rounded-md transition duration-200 border-b-2 border-kaya/50 hover:bg-kaya/10"
          >
            {t('common:view_all_articles')}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </Container>
    </Section>
  );
};

export default AktualnosciPage;
