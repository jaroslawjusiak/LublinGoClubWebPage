import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import MobileMenu from './MobileMenu';

const renderMenu = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <MobileMenu />
      </MemoryRouter>
    </I18nextProvider>,
  );

describe('MobileMenu', () => {
  it('opens and closes with correct expanded state', () => {
    renderMenu();
    const toggle = screen.getByRole('button', { name: 'Menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Aktualności' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Zasady gry' })).toHaveAttribute('href', '/zasady');
    expect(screen.getByRole('link', { name: 'Zacznij grać' })).toHaveAttribute(
      'href',
      '/zacznij-grac',
    );
    expect(screen.queryByRole('button', { name: 'Zacznij grać' })).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: 'Aktualności' })).not.toBeInTheDocument();
  });

  it('removes the panel from the accessibility tree when closed', () => {
    renderMenu();
    expect(document.getElementById('mobile-menu-list')).toBeNull();
  });

  it('closes after navigating to a link', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    fireEvent.click(screen.getByRole('link', { name: 'Aktualności' }));
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('restores focus to the toggle when Escape closes the open menu', () => {
    renderMenu();
    const toggle = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(toggle);
    screen.getByRole('link', { name: 'Aktualności' }).focus();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
    expect(screen.queryByRole('link', { name: 'Aktualności' })).not.toBeInTheDocument();
  });
});
