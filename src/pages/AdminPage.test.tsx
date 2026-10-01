import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import AdminPage from './AdminPage';
import { newsRepository } from '../lib/news/repository';
import { useAuth } from '../lib/supabase/auth';

vi.mock('../lib/supabase/auth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../lib/news/repository', () => ({
  newsRepository: { listAll: vi.fn(), listPublished: vi.fn() },
}));

const adminAuth = {
  user: { id: 'admin-1' },
  isAdmin: true,
  loading: false,
  ready: true,
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
} as unknown as ReturnType<typeof useAuth>;

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(useAuth).mockReturnValue(adminAuth);
});

const renderPage = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <AdminPage />
    </I18nextProvider>,
  );

describe('AdminPage', () => {
  it.each(['unconfigured', 'loading', 'signed-out', 'denied', 'authorized'])(
    'keeps one page heading in the %s state',
    async (state) => {
      vi.mocked(useAuth).mockReturnValue({
        ...adminAuth,
        ready: state !== 'unconfigured',
        loading: state === 'loading',
        user: state === 'signed-out' ? null : adminAuth.user,
        isAdmin: state !== 'denied',
      });
      vi.mocked(newsRepository.listAll).mockResolvedValue([]);
      renderPage();
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Panel administratora');
      if (state === 'authorized') {
        fireEvent.click(await screen.findByRole('button', { name: 'Nowy wpis' }));
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Panel administratora');
        expect(screen.getByRole('heading', { level: 2, name: 'Nowy wpis' })).toBeInTheDocument();
      }
    },
  );

  it('shows the load error with a retry action instead of loading forever', async () => {
    vi.mocked(newsRepository.listAll).mockRejectedValue(new Error('boom'));

    renderPage();

    await waitFor(() => expect(screen.getByText('boom')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Spróbuj ponownie' })).toBeInTheDocument();
    expect(screen.queryByText('Ładowanie…')).not.toBeInTheDocument();
  });

  it('retrying reloads the list and clears the error', async () => {
    vi.mocked(newsRepository.listAll)
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce([]);

    renderPage();

    await waitFor(() => expect(screen.getByText('boom')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Spróbuj ponownie' }));

    await waitFor(() => expect(newsRepository.listAll).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.queryByText('boom')).not.toBeInTheDocument());
  });
});
