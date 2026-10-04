import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import { newsRepository } from '../lib/news/repository';
import NewsFeed from './NewsFeed';

vi.mock('../lib/news/repository', () => ({
  newsRepository: { listPublished: vi.fn() },
}));

const listPublished = vi.mocked(newsRepository.listPublished);
const renderFeed = (locale = 'pl') => {
  const instance = i18n.cloneInstance({ lng: locale });
  render(
    <I18nextProvider i18n={instance}>
      <NewsFeed limit={3} />
    </I18nextProvider>,
  );
  return instance;
};

beforeEach(() => {
  listPublished.mockReset();
});

describe('NewsFeed', () => {
  it('announces loading while the request is pending', () => {
    listPublished.mockReturnValue(new Promise(() => {}));
    renderFeed();
    expect(screen.getByRole('status')).toHaveTextContent('Ładowanie najnowszych wydarzeń…');
    expect(listPublished).toHaveBeenCalledWith(1, 3);
  });

  it('distinguishes an unconfigured feed from an empty published feed', async () => {
    listPublished.mockResolvedValue({ status: 'unconfigured' });
    const view = render(
      <I18nextProvider i18n={i18n.cloneInstance({ lng: 'pl' })}>
        <NewsFeed />
      </I18nextProvider>,
    );
    expect(
      await screen.findByText('Aktualności nie są jeszcze skonfigurowane.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Brak aktualnych wiadomości.')).not.toBeInTheDocument();
    view.unmount();
    listPublished.mockResolvedValue({ status: 'ok', page: { posts: [], totalCount: 0 } });
    renderFeed();
    expect(await screen.findByText('Brak aktualnych wiadomości.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it.each(['pl', 'en', 'uk'])(
    'uses a translated error instead of backend details in %s',
    async (locale) => {
      listPublished.mockRejectedValue(new Error('Failed to fetch: internal database details'));
      const instance = renderFeed(locale);
      expect(await screen.findByRole('alert')).toHaveTextContent(instance.t('aktualnosci:error'));
      expect(screen.queryByText(/internal database details/)).not.toBeInTheDocument();
      expect(screen.queryByText(instance.t('aktualnosci:empty'))).not.toBeInTheDocument();
    },
  );

  it('updates a displayed error when the language changes without refetching', async () => {
    listPublished.mockRejectedValue(new Error('Failed to fetch'));
    const instance = renderFeed();
    await screen.findByRole('alert');
    await act(() => instance.changeLanguage('en'));
    expect(screen.getByRole('alert')).toHaveTextContent(instance.t('aktualnosci:error'));
    expect(listPublished).toHaveBeenCalledTimes(1);
  });
});
