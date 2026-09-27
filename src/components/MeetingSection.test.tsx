import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import MeetingSection from './MeetingSection';
import { meetingInfo } from '../data/club';

const renderSection = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <MeetingSection />
    </I18nextProvider>,
  );

describe('MeetingSection', () => {
  it('renders the meeting facts from the single source of truth', () => {
    renderSection();

    expect(screen.getByText(meetingInfo.venueName)).toBeInTheDocument();
    expect(screen.getByText(/20-950 Lublin/)).toBeInTheDocument();
    expect(screen.getByText(/sala 14/)).toBeInTheDocument();
    expect(screen.getByText('Wstęp wolny')).toBeInTheDocument();
  });

  it('links to the map and directions in the page language', () => {
    renderSection();

    expect(screen.getByRole('link', { name: 'Wyznacz dojazd' })).toHaveAttribute(
      'href',
      `${meetingInfo.directionsUrl}&locale=pl`,
    );
    expect(screen.getByRole('link', { name: 'Zobacz na mapie' })).toHaveAttribute(
      'href',
      `${meetingInfo.mapUrl}&locale=pl`,
    );
  });
});
