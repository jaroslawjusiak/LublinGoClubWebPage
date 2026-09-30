import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/config';
import ImagePicker from './ImagePicker';
import { uploadNewsImage, removeNewsImage } from '../../lib/supabase/storage';
import type { NewsImage } from '../../types/data_models';

vi.mock('../../lib/supabase/storage', () => ({
  uploadNewsImage: vi.fn(),
  removeNewsImage: vi.fn(),
}));

vi.mock('../../lib/news/image', () => ({
  validateImage: vi.fn(() => null),
  compressImage: vi.fn((file: File) => Promise.resolve(file)),
  MAX_IMAGES: 4,
}));

const twoImages: NewsImage[] = [
  { url: 'https://example.com/1.jpg', alt: '' },
  { url: 'https://example.com/2.jpg', alt: '' },
];

const renderPicker = (
  overrides: {
    images?: NewsImage[];
    onChange?: (images: NewsImage[]) => void;
    onUpload?: (url: string) => void;
    onUploadingChange?: (uploading: boolean) => void;
  } = {},
) => {
  const props = {
    images: [] as NewsImage[],
    onChange: vi.fn(),
    onUpload: vi.fn(),
    onUploadingChange: vi.fn(),
    ...overrides,
  };
  const utils = render(
    <I18nextProvider i18n={i18n}>
      <ImagePicker {...props} />
    </I18nextProvider>,
  );
  return { ...utils, props };
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe('ImagePicker', () => {
  it('removing a photo updates the list without deleting it from storage', () => {
    const { props } = renderPicker({ images: twoImages });

    fireEvent.click(screen.getByRole('button', { name: 'Usuń zdjęcie 1' }));

    expect(props.onChange).toHaveBeenCalledWith([twoImages[1]]);
    expect(removeNewsImage).not.toHaveBeenCalled();
  });

  it('uploads a selected file, reports it, and appends a preview', async () => {
    vi.mocked(uploadNewsImage).mockResolvedValue('https://example.com/uploaded.jpg');
    const { props, container } = renderPicker();

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' });
    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    fireEvent.change(input);

    await waitFor(() =>
      expect(props.onUpload).toHaveBeenCalledWith('https://example.com/uploaded.jpg'),
    );
    await waitFor(() =>
      expect(props.onChange).toHaveBeenCalledWith([
        { url: 'https://example.com/uploaded.jpg', alt: '' },
      ]),
    );
  });

  it('rolls back partially-uploaded files when an upload fails', async () => {
    vi.mocked(uploadNewsImage)
      .mockResolvedValueOnce('https://example.com/uploaded.jpg')
      .mockRejectedValueOnce(new Error('boom'));
    vi.mocked(removeNewsImage).mockResolvedValue(undefined);
    const { props, container } = renderPicker();

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const one = new File(['a'], 'a.jpg', { type: 'image/jpeg' });
    const two = new File(['b'], 'b.jpg', { type: 'image/jpeg' });
    Object.defineProperty(input, 'files', { value: [one, two], configurable: true });
    fireEvent.change(input);

    await waitFor(() => expect(screen.getByText('boom')).toBeInTheDocument());
    expect(removeNewsImage).toHaveBeenCalledWith('https://example.com/uploaded.jpg');
    expect(props.onChange).not.toHaveBeenCalled();
  });
});
