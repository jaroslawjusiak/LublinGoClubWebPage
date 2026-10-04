import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/config';
import LessonManager from './LessonManager';
import { lessonsRepository } from '../../lib/lessons/repository';
import {
  createLessonWithFiles,
  validateLessonFiles,
  cleanupLessonAssets,
  resolveLessonAttempt,
  LessonSaveError,
} from '../../lib/lessons/upload';
vi.mock('../../lib/lessons/repository', () => ({ lessonsRepository: { list: vi.fn() } }));
vi.mock('../../lib/lessons/upload', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../lib/lessons/upload')>()),
  createLessonWithFiles: vi.fn(),
  validateLessonFiles: vi.fn(),
  cleanupLessonAssets: vi.fn(),
  resolveLessonAttempt: vi.fn(),
}));
beforeEach(async () => {
  vi.resetAllMocks();
  await i18n.changeLanguage('pl');
  vi.mocked(lessonsRepository.list).mockResolvedValue([]);
  vi.mocked(validateLessonFiles).mockResolvedValue(null);
  vi.mocked(cleanupLessonAssets).mockResolvedValue([]);
});
const show = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <LessonManager />
    </I18nextProvider>,
  );
function fill() {
  fireEvent.change(screen.getByLabelText('Tytuł lekcji'), { target: { value: 'Ko' } });
  fireEvent.change(screen.getByLabelText('Opis lekcji'), { target: { value: 'Opis' } });
  fireEvent.change(screen.getByLabelText('Plik PDF'), {
    target: { files: [new File(['%PDF-'], 'a.pdf', { type: 'application/pdf' })] },
  });
  fireEvent.change(screen.getByLabelText('Miniatura lekcji'), {
    target: { files: [new File(['image'], 'a.webp', { type: 'image/webp' })] },
  });
}
describe('LessonManager', () => {
  it('requires title and description before uploads', async () => {
    show();
    fireEvent.click(screen.getByRole('button', { name: 'Dodaj lekcję' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Uzupełnij');
    expect(createLessonWithFiles).not.toHaveBeenCalled();
  });
  it('shows file validation and permits correction', async () => {
    vi.mocked(validateLessonFiles).mockResolvedValueOnce('pdf_invalid');
    show();
    fill();
    fireEvent.click(screen.getByRole('button', { name: 'Dodaj lekcję' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('poprawny');
    expect(createLessonWithFiles).not.toHaveBeenCalled();
  });
  it('prevents duplicate submissions, clears fields, and reloads the visible list after success', async () => {
    let done!: (lesson: never) => void;
    vi.mocked(createLessonWithFiles).mockReturnValue(
      new Promise((resolve) => {
        done = resolve;
      }),
    );
    show();
    fill();
    const button = screen.getByRole('button', { name: 'Dodaj lekcję' });
    fireEvent.click(button);
    fireEvent.click(button);
    await waitFor(() => expect(createLessonWithFiles).toHaveBeenCalledTimes(1));
    expect(screen.getByRole('button', { name: 'Zapisywanie…' })).toBeDisabled();
    vi.mocked(lessonsRepository.list).mockResolvedValue([
      { id: 'new', title: 'Ko', pdfUrl: 'https://example.com/ko.pdf', language: 'pl' } as never,
    ]);
    done({} as never);
    expect(
      await screen.findByText('Lekcja została dodana i jest dostępna na stronie Lekcje.'),
    ).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: 'Ko' })).toBeInTheDocument();
    expect(screen.getByLabelText('Tytuł lekcji')).toHaveValue('');
  });
  it('retains files and entered content on failure and allows retry', async () => {
    vi.mocked(createLessonWithFiles)
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({} as never);
    show();
    fill();
    fireEvent.click(screen.getByRole('button', { name: 'Dodaj lekcję' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Nie udało się dodać');
    expect(screen.getByLabelText('Tytuł lekcji')).toHaveValue('Ko');
    fireEvent.click(screen.getByRole('button', { name: 'Dodaj lekcję' }));
    expect(
      await screen.findByText('Lekcja została dodana i jest dostępna na stronie Lekcje.'),
    ).toBeInTheDocument();
    expect(createLessonWithFiles).toHaveBeenCalledTimes(2);
  });
  it('verifies an unresolved save on retry without creating another lesson', async () => {
    vi.mocked(createLessonWithFiles).mockRejectedValueOnce(
      new LessonSaveError('offline', [], {
        id: 'attempt',
        assets: [{ bucket: 'lesson-pdfs', path: 'a.pdf' }],
      }),
    );
    vi.mocked(resolveLessonAttempt).mockResolvedValue({ id: 'attempt' } as never);
    show();
    fill();
    fireEvent.click(screen.getByRole('button', { name: 'Dodaj lekcję' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Nie można potwierdzić');
    fireEvent.click(screen.getByRole('button', { name: 'Sprawdź zapis' }));
    expect(
      await screen.findByText('Lekcja została dodana i jest dostępna na stronie Lekcje.'),
    ).toBeInTheDocument();
    expect(createLessonWithFiles).toHaveBeenCalledTimes(1);
    expect(resolveLessonAttempt).toHaveBeenCalledWith(expect.objectContaining({ id: 'attempt' }));
    expect(screen.getByLabelText('Tytuł lekcji')).toHaveValue('');
  });
});
