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
