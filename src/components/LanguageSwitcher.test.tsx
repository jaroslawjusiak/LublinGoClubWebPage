import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import LanguageSwitcher from './LanguageSwitcher';

const LocationDisplay = () => {
  const { pathname } = useLocation();
  return <div data-testid="pathname">{pathname}</div>;
};

const renderSwitcher = (route = '/') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
        <LocationDisplay />
      </I18nextProvider>
    </MemoryRouter>,
  );

describe('LanguageSwitcher', () => {
  it('renders the three languages with flags and marks the active locale', () => {
    const { container } = renderSwitcher('/');

    expect(container.querySelectorAll('img')).toHaveLength(3);
    expect(screen.getByRole('link', { name: 'Polski' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'English' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Українська' })).toBeInTheDocument();
  });

  it('navigates to the localized route of the current page', () => {
    renderSwitcher('/o-klubie');
    fireEvent.click(screen.getByRole('link', { name: 'English' }));

    expect(screen.getByTestId('pathname')).toHaveTextContent('/en/o-klubie');
  });

  it('re-prefixes the path when switching between non-default locales', () => {
    renderSwitcher('/en/zacznij-grac');
    fireEvent.click(screen.getByRole('link', { name: 'Українська' }));

    expect(screen.getByTestId('pathname')).toHaveTextContent('/uk/zacznij-grac');
  });

  it('is hidden on the admin page (no locale-prefixed admin route)', () => {
    renderSwitcher('/admin');

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
