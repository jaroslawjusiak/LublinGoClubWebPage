import { describe, it, expect } from 'vitest';
import { validateImage, MAX_IMAGE_BYTES } from './image';

describe('validateImage', () => {
  it('accepts a supported type within the size limit', () => {
    expect(validateImage(new File(['x'], 'a.jpg', { type: 'image/jpeg' }))).toBeNull();
    expect(validateImage(new File(['x'], 'a.png', { type: 'image/png' }))).toBeNull();
  });

  it('rejects an unsupported type', () => {
    expect(validateImage(new File(['x'], 'a.txt', { type: 'text/plain' }))).toBe(
      'unsupported-type',
    );
  });

  it('rejects an image above the size limit', () => {
    const oversized = new File([new ArrayBuffer(MAX_IMAGE_BYTES + 1)], 'big.jpg', {
      type: 'image/jpeg',
    });
    expect(validateImage(oversized)).toBe('too-large');
  });
});
