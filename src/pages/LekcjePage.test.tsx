import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import LekcjePage from './LekcjePage';
import { lessonsRepository } from '../lib/lessons/repository';
import { initialLessons } from '../data/lessons';
vi.mock('../lib/lessons/repository', () => ({ lessonsRepository: { list: vi.fn() } }));
beforeEach(async () => {
  vi.resetAllMocks();
  await i18n.changeLanguage('pl');
});
const show = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <LekcjePage />
    </I18nextProvider>,
  );
describe('Lessons page', () => {
  it('shows loading before resolving and renders a labelled PDF link with Polish content', async () => {
    let done!: (value: typeof initialLessons) => void;
    vi.mocked(lessonsRepository.list).mockReturnValue(
      new Promise((resolve) => {
        done = resolve;
      }),
    );
    show();
    expect(screen.getByRole('status')).toHaveTextContent('Ładowanie lekcji');
    done(initialLessons.slice(0, 1));
    const link = await screen.findByRole('link', { name: /Otwórz PDF: Kształty/ });
    expect(link).toHaveAttribute('href', initialLessons[0].pdfUrl);
    expect(screen.getByRole('heading', { level: 2 }).parentElement).toHaveAttribute('lang', 'pl');
  });
  it('shows a configured empty state', async () => {
    vi.mocked(lessonsRepository.list).mockResolvedValue([]);
    show();
    expect(await screen.findByText('Nie dodano jeszcze żadnych lekcji.')).toBeInTheDocument();
  });
  it('shows an error distinct from empty and retries', async () => {
    vi.mocked(lessonsRepository.list)
      .mockRejectedValueOnce(new Error('missing migration'))
      .mockResolvedValueOnce(initialLessons);
    show();
    expect(await screen.findByRole('alert')).toHaveTextContent('Nie udało się');
    expect(screen.queryByText('Nie dodano jeszcze żadnych lekcji.')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Spróbuj ponownie' }));
    expect(
      await screen.findByRole('heading', { name: initialLessons[0].title }),
    ).toBeInTheDocument();
  });
});
