import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';

const Harness: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <ScrollToTop />
      <button onClick={() => navigate('/prywatnosc')}>go</button>
    </>
  );
};

describe('ScrollToTop', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  it('scrolls to the top when the route changes', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Harness />
      </MemoryRouter>,
    );

    // Once on mount.
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

    fireEvent.click(screen.getByRole('button', { name: 'go' }));

    // And again after navigating to a new route.
    expect(window.scrollTo).toHaveBeenCalledTimes(2);
    expect(window.scrollTo).toHaveBeenLastCalledWith(0, 0);
  });
});
