import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import MobileCta from './MobileCta';

const LocationDisplay = () => {
  const { pathname } = useLocation();
  return <div data-testid="pathname">{pathname}</div>;
};

const renderCta = (route = '/') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <I18nextProvider i18n={i18n}>
        <MobileCta />
        <LocationDisplay />
      </I18nextProvider>
    </MemoryRouter>,
  );

let scrollIntoViewMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
  scrollIntoViewMock = vi.fn();
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    writable: true,
    value: scrollIntoViewMock,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.getElementById('spotkania')?.remove();
});

describe('MobileCta', () => {
  it('renders the mobile CTA label', () => {
    renderCta();

    expect(screen.getByRole('button', { name: 'Przyjdź w środę' })).toBeInTheDocument();
  });

  it('scrolls to the meeting section when it is present on the page', () => {
    const meeting = document.createElement('div');
    meeting.id = 'spotkania';
    document.body.appendChild(meeting);

    renderCta();
    fireEvent.click(screen.getByRole('button', { name: 'Przyjdź w środę' }));

    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('navigates to the home page when the meeting section is absent', () => {
    renderCta('/o-klubie');
    fireEvent.click(screen.getByRole('button', { name: 'Przyjdź w środę' }));

    expect(screen.getByTestId('pathname')).toHaveTextContent('/');
  });

  it('is hidden on the admin page', () => {
    renderCta('/admin');

    expect(screen.queryByRole('button', { name: 'Przyjdź w środę' })).not.toBeInTheDocument();
  });
});
