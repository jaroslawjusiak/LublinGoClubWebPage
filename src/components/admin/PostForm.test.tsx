import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/config';
import PostForm from './PostForm';
import { newsRepository } from '../../lib/news/repository';
import type { NewsPost } from '../../types/data_models';

vi.mock('../../lib/news/repository', () => ({
  newsRepository: {
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    listAll: vi.fn(),
    listPublished: vi.fn(),
  },
}));

vi.mock('../../lib/supabase/storage', () => ({
  uploadNewsImage: vi.fn(),
  removeNewsImage: vi.fn(),
  removeNewsImages: vi.fn(),
}));

const publishedPost: NewsPost = {
  id: 'published-1',
  title: 'Opublikowany wpis',
  body: 'Treść',
  publishedAt: '2024-01-01',
  published: true,
  images: [],
};

const draftPost: NewsPost = {
  id: 'draft-1',
  title: 'Szkic wpisu',
  body: 'Treść',
  publishedAt: '2024-01-02',
  published: false,
  images: [],
};

const renderForm = (initial?: NewsPost) =>
  render(
    <I18nextProvider i18n={i18n}>
      <PostForm initial={initial} onDone={() => {}} />
    </I18nextProvider>,
  );

beforeEach(() => {
  vi.clearAllMocks();
});

describe('PostForm', () => {
  it('defaults a new post to draft with explicit save-draft and publish actions', () => {
    renderForm();

    expect(screen.getByRole('button', { name: 'Zapisz szkic' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Opublikuj' })).toBeInTheDocument();
    // No bare "Zapisz" (auto-publish) button for a brand-new post.
    expect(screen.queryByRole('button', { name: 'Zapisz' })).not.toBeInTheDocument();
  });

  it('creates a draft when the admin saves as draft', async () => {
    vi.mocked(newsRepository.create).mockResolvedValue(draftPost);
    renderForm();

    fireEvent.change(screen.getByLabelText('Tytuł'), { target: { value: 'Tytuł szkicu' } });
    fireEvent.change(screen.getByLabelText('Treść'), { target: { value: 'Treść' } });
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz szkic' }));

    await waitFor(() => expect(newsRepository.create).toHaveBeenCalled());
    expect(newsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ published: false }),
    );
  });

  it('creates a published post when the admin publishes', async () => {
    vi.mocked(newsRepository.create).mockResolvedValue(publishedPost);
    renderForm();

    fireEvent.change(screen.getByLabelText('Tytuł'), { target: { value: 'Tytuł' } });
    fireEvent.change(screen.getByLabelText('Treść'), { target: { value: 'Treść' } });
    fireEvent.click(screen.getByRole('button', { name: 'Opublikuj' }));

    await waitFor(() => expect(newsRepository.create).toHaveBeenCalled());
    expect(newsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ published: true }),
    );
  });

  it('preserves the published status when editing an already-published post', async () => {
    vi.mocked(newsRepository.update).mockResolvedValue(publishedPost);
    renderForm(publishedPost);

    // No "save draft" action is offered, so an edit cannot accidentally unpublish.
    expect(screen.queryByRole('button', { name: 'Zapisz szkic' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zapisz' })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Treść'), { target: { value: 'Zmieniona treść' } });
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }));

    await waitFor(() => expect(newsRepository.update).toHaveBeenCalled());
    expect(newsRepository.update).toHaveBeenCalledWith(
      'published-1',
      expect.objectContaining({ published: true }),
    );
  });

  it('offers publish when editing a draft', () => {
    renderForm(draftPost);

    expect(screen.getByRole('button', { name: 'Zapisz szkic' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Opublikuj' })).toBeInTheDocument();
  });
});
