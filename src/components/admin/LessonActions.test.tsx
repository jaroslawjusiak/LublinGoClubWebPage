import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/config';
import LessonActions from './LessonActions';
import type { Lesson } from '../../lib/lessons/repository';
import {
  updateLessonWithFiles,
  deleteLessonWithFiles,
  resolveLessonMutation,
  LessonMutationError,
} from '../../lib/lessons/mutations';
vi.mock('../../lib/lessons/mutations', async (original) => ({
  ...(await original<typeof import('../../lib/lessons/mutations')>()),
  updateLessonWithFiles: vi.fn(),
  deleteLessonWithFiles: vi.fn(),
  resolveLessonMutation: vi.fn(),
}));
const lesson: Lesson = {
  id: 'a',
  title: 'Ko',
  description: 'Opis',
  pdfUrl: '/assets/lekcje/ko.pdf',
  thumbnailUrl: '/assets/lekcje/thumbnails/ko.webp',
  language: 'pl',
  pageCount: 7,
};
const onDone = vi.fn(),
  onLockChange = vi.fn();
beforeEach(async () => {
  vi.resetAllMocks();
  await i18n.changeLanguage('pl');
  vi.spyOn(window, 'confirm').mockReturnValue(true);
});
const show = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <LessonActions lesson={lesson} onDone={onDone} onLockChange={onLockChange} />
    </I18nextProvider>,
  );
const edit = () => fireEvent.click(screen.getByRole('button', { name: 'Edytuj lekcję: Ko' }));
describe('LessonActions', () => {
  it('prefills editor and cancels without uploading or mutating data, restoring focus', async () => {
    show();
    edit();
    expect(screen.getByLabelText('Tytuł lekcji')).toHaveValue('Ko');
    expect(screen.getByLabelText('Opis lekcji')).toHaveValue('Opis');
    await waitFor(() => expect(screen.getByLabelText('Tytuł lekcji')).toHaveFocus());
    fireEvent.change(screen.getByLabelText('Tytuł lekcji'), { target: { value: 'Changed' } });
    fireEvent.click(screen.getByRole('button', { name: 'Anuluj' }));
    expect(screen.queryByLabelText('Tytuł lekcji')).not.toBeInTheDocument();
    expect(updateLessonWithFiles).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Edytuj lekcję: Ko' })).toHaveFocus(),
    );
    edit();
    expect(screen.getByLabelText('Tytuł lekcji')).toHaveValue('Ko');
  });
  it('saves text changes with no replacement files and reports parent-level success', async () => {
    show();
    edit();
    fireEvent.change(screen.getByLabelText('Tytuł lekcji'), { target: { value: ' Nowy tytuł ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz zmiany' }));
    await waitFor(() =>
      expect(updateLessonWithFiles).toHaveBeenCalledWith(lesson, 'Nowy tytuł', 'Opis', null, null),
    );
    expect(await screen.findByRole('status')).toHaveTextContent('Zmiany lekcji');
    expect(onDone).toHaveBeenCalledWith('Zmiany lekcji zostały zapisane.');
  });
  it('rejects an invalid optional PDF before calling the mutation service', async () => {
    show();
    edit();
    fireEvent.change(screen.getByLabelText('Plik PDF'), {
      target: { files: [new File(['fake'], 'a.pdf', { type: 'application/pdf' })] },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz zmiany' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('poprawny');
    expect(updateLessonWithFiles).not.toHaveBeenCalled();
  });
  it('passes only the selected thumbnail replacement', async () => {
    show();
    edit();
    const thumbnail = new File(['webp'], 'a.webp', { type: 'image/webp' });
    fireEvent.change(screen.getByLabelText('Miniatura lekcji'), { target: { files: [thumbnail] } });
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz zmiany' }));
    await waitFor(() =>
      expect(updateLessonWithFiles).toHaveBeenCalledWith(lesson, 'Ko', 'Opis', null, thumbnail),
    );
  });
  it('does nothing when deletion confirmation is cancelled', () => {
    vi.mocked(window.confirm).mockReturnValue(false);
    show();
    fireEvent.click(screen.getByRole('button', { name: 'Usuń lekcję: Ko' }));
    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('Ko'));
    expect(deleteLessonWithFiles).not.toHaveBeenCalled();
  });
  it('deletes only after confirmation and announces the result to the parent', async () => {
    show();
    fireEvent.click(screen.getByRole('button', { name: 'Usuń lekcję: Ko' }));
    await waitFor(() => expect(deleteLessonWithFiles).toHaveBeenCalledWith(lesson));
    expect(onDone).toHaveBeenCalledWith('Lekcja została usunięta.');
  });
  it('disables actions and prevents repeated deletion while pending', async () => {
    let done!: () => void;
    vi.mocked(deleteLessonWithFiles).mockReturnValue(
      new Promise((resolve) => {
        done = resolve;
      }),
    );
    show();
    const button = screen.getByRole('button', { name: 'Usuń lekcję: Ko' });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(deleteLessonWithFiles).toHaveBeenCalledTimes(1);
    expect(button).toBeDisabled();
    expect(onLockChange).toHaveBeenCalledWith(true);
    done();
    await waitFor(() => expect(onLockChange).toHaveBeenLastCalledWith(false));
  });
  it('retains edited text after a failed operation and allows retry', async () => {
    vi.mocked(updateLessonWithFiles).mockRejectedValueOnce(new Error('offline'));
    show();
    edit();
    fireEvent.change(screen.getByLabelText('Tytuł lekcji'), { target: { value: 'Changed' } });
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz zmiany' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Nie udało');
    expect(screen.getByLabelText('Tytuł lekcji')).toHaveValue('Changed');
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz zmiany' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Zmiany lekcji');
    expect(updateLessonWithFiles).toHaveBeenCalledTimes(2);
  });
  it.each(['update', 'delete'] as const)(
    'verifies ambiguous %s without reapplying it or asking for confirmation again',
    async (kind) => {
      const attempt = { kind, original: lesson, staged: [] };
      const service = kind === 'update' ? updateLessonWithFiles : deleteLessonWithFiles;
      vi.mocked(service).mockRejectedValueOnce(new LessonMutationError(attempt, 'verify'));
      show();
      if (kind === 'update') {
        edit();
        fireEvent.click(screen.getByRole('button', { name: 'Zapisz zmiany' }));
      } else fireEvent.click(screen.getByRole('button', { name: 'Usuń lekcję: Ko' }));
      expect(await screen.findByRole('alert')).toHaveTextContent('Nie można potwierdzić');
      expect(onLockChange).toHaveBeenLastCalledWith(true);
      expect(screen.getByRole('button', { name: 'Edytuj lekcję: Ko' })).toBeDisabled();
      fireEvent.click(screen.getByRole('button', { name: 'Sprawdź zapis' }));
      await waitFor(() => expect(resolveLessonMutation).toHaveBeenCalledWith(attempt));
      expect(service).toHaveBeenCalledTimes(1);
      expect(window.confirm).toHaveBeenCalledTimes(kind === 'delete' ? 1 : 0);
      expect(onLockChange).toHaveBeenLastCalledWith(false);
    },
  );
});
