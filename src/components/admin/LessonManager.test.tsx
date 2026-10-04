import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/config';
import LessonManager from './LessonManager';
import { lessonsRepository, type Lesson } from '../../lib/lessons/repository';
import {
  deleteLessonWithFiles,
  resolveLessonMutation,
  LessonMutationError,
} from '../../lib/lessons/mutations';
import {
  createLessonWithFiles,
  validateLessonFiles,
  cleanupLessonAssets,
  resolveLessonAttempt,
  LessonSaveError,
} from '../../lib/lessons/upload';
vi.mock('../../lib/lessons/mutations', async (original) => ({
  ...(await original<typeof import('../../lib/lessons/mutations')>()),
  deleteLessonWithFiles: vi.fn(),
  resolveLessonMutation: vi.fn(),
}));
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
  it('announces deletion after refreshing away the deleted row', async () => {
    const lesson: Lesson = {
      id: 'a',
      title: 'Ko',
      description: 'Opis',
      pdfUrl: '/assets/lekcje/ko.pdf',
      thumbnailUrl: '/assets/lekcje/thumbnails/ko.webp',
      language: 'pl',
      pageCount: 7,
    };
    vi.mocked(lessonsRepository.list).mockResolvedValueOnce([lesson]).mockResolvedValueOnce([]);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    show();
    fireEvent.click(await screen.findByRole('button', { name: 'Usuń lekcję: Ko' }));
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'Usuń lekcję: Ko' })).not.toBeInTheDocument(),
    );
    expect(screen.getByRole('status')).toHaveTextContent('Lekcja została usunięta.');
  });
  it('locks other rows and creation until unresolved deletion cleanup completes', async () => {
    const lesson: Lesson = {
      id: 'a',
      title: 'Ko',
      description: 'Opis',
      pdfUrl: '/assets/lekcje/ko.pdf',
      thumbnailUrl: '/assets/lekcje/thumbnails/ko.webp',
      language: 'pl',
      pageCount: 7,
    };
    vi.mocked(lessonsRepository.list).mockResolvedValue([
      lesson,
      { ...lesson, id: 'b', title: 'Fuseki' },
    ]);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.mocked(deleteLessonWithFiles).mockRejectedValueOnce(
      new LessonMutationError(
        {
          kind: 'delete',
          original: lesson,
          staged: [],
          confirmed: true,
          cleanup: [{ bucket: 'lesson-pdfs', path: 'old.pdf' }],
        },
        'cleanup',
      ),
    );
    show();
    fireEvent.click(await screen.findByRole('button', { name: 'Usuń lekcję: Ko' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('posprzątać');
    expect(screen.getByRole('button', { name: 'Dodaj lekcję' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Edytuj lekcję: Fuseki' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Usuń lekcję: Fuseki' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Spróbuj ponownie' }));
    await waitFor(() => expect(resolveLessonMutation).toHaveBeenCalledTimes(1));
    expect(deleteLessonWithFiles).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Dodaj lekcję' })).toBeEnabled());
  });
});
