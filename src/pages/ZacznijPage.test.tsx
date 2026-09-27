import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import ZacznijPage from './ZacznijPage';

const renderPage = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <ZacznijPage />
      </MemoryRouter>
    </I18nextProvider>,
  );

describe('ZacznijPage', () => {
  it('renders the six-step first-visit story', () => {
    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Zacznij grać' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(6);
  });

  it('toggles the FAQ accordion with correct expanded state', () => {
    renderPage();

    const question = screen.getByRole('button', { name: /Czy muszę znać zasady/ });
    expect(question).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(question);
    expect(question).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/Nauczymy Cię podstaw na miejscu/)).toBeInTheDocument();
  });
});
