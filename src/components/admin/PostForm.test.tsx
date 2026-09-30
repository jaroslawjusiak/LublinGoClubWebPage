import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/config';
import PostForm from './PostForm';
import { newsRepository } from '../../lib/news/repository';
import { removeNewsImages } from '../../lib/supabase/storage';
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

const renderForm = (initial?: NewsPost) => {
  const utils = render(
    <I18nextProvider i18n={i18n}>
      <PostForm initial={initial} onDone={() => {}} />
    </I18nextProvider>,
  );
  const form = utils.container.querySelector('form') as HTMLFormElement;
  return { ...utils, form };
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('PostForm', () => {
  it('defaults a new post to draft with explicit save-draft and publish actions', () => {
    renderForm();

    expect(screen.getByRole('button', { name: 'Zapisz szkic' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Opublikuj' })).toBeInTheDocument();
    // No bare "Zapisz" (auto-publish) button for a brand-new post.
    expect(screen.queryByRole('button', { name: 'Zapisz' })).not.toBeInTheDocument();
  });

  it('submitting a new post (Enter) saves it as a draft, never published', async () => {
    vi.mocked(newsRepository.create).mockResolvedValue(draftPost);
    const { form } = renderForm();

    fireEvent.change(screen.getByLabelText('Tytuł'), { target: { value: 'Tytuł szkicu' } });
    fireEvent.change(screen.getByLabelText('Treść'), { target: { value: 'Treść' } });
    fireEvent.submit(form);

    await waitFor(() => expect(newsRepository.create).toHaveBeenCalled());
    expect(newsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ published: false }),
    );
  });

  it('the explicit "Opublikuj" button publishes a new post', async () => {
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

  it('submitting a draft (Enter) keeps it a draft', async () => {
    vi.mocked(newsRepository.update).mockResolvedValue(draftPost);
    const { form } = renderForm(draftPost);

    fireEvent.change(screen.getByLabelText('Treść'), { target: { value: 'Zmieniona treść' } });
    fireEvent.submit(form);

    await waitFor(() => expect(newsRepository.update).toHaveBeenCalled());
    expect(newsRepository.update).toHaveBeenCalledWith(
      'draft-1',
      expect.objectContaining({ published: false }),
    );
  });

  it('submitting a published post (Enter) preserves its published status', async () => {
    vi.mocked(newsRepository.update).mockResolvedValue(publishedPost);
    const { form } = renderForm(publishedPost);

    // No "save draft" action is offered, so an edit cannot accidentally unpublish.
    expect(screen.queryByRole('button', { name: 'Zapisz szkic' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zapisz' })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Treść'), { target: { value: 'Zmieniona treść' } });
    fireEvent.submit(form);

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

  it('rejects an invalid optional link and does not save', async () => {
    renderForm();

    fireEvent.change(screen.getByLabelText('Tytuł'), { target: { value: 'Tytuł' } });
    fireEvent.change(screen.getByLabelText('Treść'), { target: { value: 'Treść' } });
    fireEvent.change(screen.getByLabelText('Link (opcjonalnie)'), {
      target: { value: 'nie-jest-adresem' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Opublikuj' }));

    await waitFor(() => expect(screen.getByText(/poprawny adres/)).toBeInTheDocument());
    expect(newsRepository.create).not.toHaveBeenCalled();
  });

  it('removes discarded original photos only after a successful save', async () => {
    vi.mocked(newsRepository.update).mockResolvedValue(publishedPost);
    const withImages = {
      ...publishedPost,
      images: [
        { url: 'https://example.com/1.jpg', alt: '' },
        { url: 'https://example.com/2.jpg', alt: '' },
      ],
    };
    const { form } = renderForm(withImages);

    fireEvent.click(screen.getByRole('button', { name: 'Usuń zdjęcie 1' }));
    fireEvent.submit(form);

    await waitFor(() => expect(newsRepository.update).toHaveBeenCalled());
    await waitFor(() =>
      expect(removeNewsImages).toHaveBeenCalledWith(['https://example.com/1.jpg']),
    );
  });

  it('delete removes the post and every stored image', async () => {
    vi.mocked(newsRepository.remove).mockResolvedValue(undefined);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const withImages = {
      ...draftPost,
      images: [{ url: 'https://example.com/1.jpg', alt: '' }],
    };
    renderForm(withImages);

    fireEvent.click(screen.getByRole('button', { name: 'Usuń' }));

    await waitFor(() => expect(newsRepository.remove).toHaveBeenCalledWith('draft-1'));
    await waitFor(() =>
      expect(removeNewsImages).toHaveBeenCalledWith(['https://example.com/1.jpg']),
    );
  });
});
