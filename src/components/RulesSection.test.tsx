import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import RulesSection from './RulesSection';

const renderSection = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <RulesSection />
    </I18nextProvider>,
  );

describe('RulesSection', () => {
  it('renders the rules in six steps', () => {
    renderSection();

    expect(screen.getAllByRole('listitem')).toHaveLength(6);
    expect(screen.getByText(/Plansza i kamienie/)).toBeInTheDocument();
  });

  it('renders diagrams with meaningful (non-empty) alt text', () => {
    const { container } = renderSection();

    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(5);
    images.forEach((img) => {
      expect(img.getAttribute('alt')).toBeTruthy();
    });
  });
});
