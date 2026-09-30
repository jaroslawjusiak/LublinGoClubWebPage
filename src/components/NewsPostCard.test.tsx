import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import NewsPostCard from './NewsPostCard';
import type { NewsPost } from '../types/data_models';

const base: NewsPost = {
  id: '1',
  title: 'Turniej w Lublinie',
  body: 'Krótki opis turnieju.',
  publishedAt: '2023-10-14',
  published: true,
  images: [],
};

const renderCard = (post: NewsPost) =>
  render(
    <I18nextProvider i18n={i18n}>
      <NewsPostCard post={post} />
    </I18nextProvider>,
  );

describe('NewsPostCard', () => {
  it('renders title, body, tag and images', () => {
    const { container } = renderCard({
      ...base,
      tag: 'turniej',
      images: [
        { url: 'https://example.com/1.jpg', alt: '' },
        { url: 'https://example.com/2.jpg', alt: '' },
      ],
    });

    expect(screen.getByRole('heading', { name: 'Turniej w Lublinie' })).toBeInTheDocument();
    expect(screen.getByText('Krótki opis turnieju.')).toBeInTheDocument();
    expect(screen.getByText('Turniej')).toBeInTheDocument();
    // News photos are decorative (alt=""), so assert them via the DOM.
    expect(container.querySelectorAll('img')).toHaveLength(2);
  });

  it('uses each image’s alternative text', () => {
    renderCard({
      ...base,
      images: [{ url: 'https://example.com/board.jpg', alt: 'Dwóch graczy przy planszy' }],
    });

    const img = screen.getByAltText('Dwóch graczy przy planszy');
    expect(img).toHaveAttribute('src', 'https://example.com/board.jpg');
  });

  it('renders an external link only when present', () => {
    renderCard({ ...base, externalUrl: 'https://board.example.com/t' });
    expect(screen.getByRole('link', { name: 'Zobacz więcej' })).toHaveAttribute(
      'href',
      'https://board.example.com/t',
    );
  });

  it('renders no link when there is no external URL', () => {
    renderCard(base);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
