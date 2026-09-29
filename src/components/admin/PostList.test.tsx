import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/config';
import PostList from './PostList';
import type { NewsPost } from '../../types/data_models';

const publishedPost: NewsPost = {
  id: '1',
  title: 'Opublikowany wpis',
  body: 'Treść',
  publishedAt: '2024-01-01',
  published: true,
  images: [],
};

const draftPost: NewsPost = {
  id: '2',
  title: 'Szkic wpisu',
  body: 'Treść',
  publishedAt: '2024-01-02',
  published: false,
  images: [],
};

const renderList = (posts: NewsPost[]) =>
  render(
    <I18nextProvider i18n={i18n}>
      <PostList posts={posts} onNew={() => {}} onEdit={() => {}} />
    </I18nextProvider>,
  );

describe('PostList', () => {
  it('labels each post with its published/draft status', () => {
    renderList([publishedPost, draftPost]);

    expect(screen.getByText('Opublikowany')).toBeInTheDocument();
    expect(screen.getByText('Szkic')).toBeInTheDocument();
  });
});
