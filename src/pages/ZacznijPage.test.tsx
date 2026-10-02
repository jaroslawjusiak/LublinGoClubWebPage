import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import ZacznijPage from './ZacznijPage';
import ZasadyPage from './ZasadyPage';
import { meetingInfo } from '../data/club';

const renderPage = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <ZacznijPage />
      </MemoryRouter>
    </I18nextProvider>,
  );

describe('ZacznijPage', () => {
  it('renders first-visit content without the rules section', () => {
    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Zacznij grać' })).toBeInTheDocument();
    expect(screen.queryByText(/Plansza i kamienie/)).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Co się stanie, kiedy przyjdę pierwszy raz?' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Zostań, jak długo chcesz/)).toBeInTheDocument();
  });

  it('keeps the rules and diagrams on the separate rules page', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <ZasadyPage />
        </MemoryRouter>
      </I18nextProvider>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Zasady gry' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(6);
    expect(screen.getByText(/Plansza i kamienie/)).toBeInTheDocument();
    expect(screen.queryByText(/Co się stanie, kiedy przyjdę pierwszy raz/)).not.toBeInTheDocument();
  });

  it('toggles the FAQ accordion with correct expanded state', () => {
    renderPage();

    const question = screen.getByRole('button', { name: /Czy muszę znać zasady/ });
    expect(question).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(question);
    expect(question).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/Nauczymy Cię podstaw na miejscu/)).toBeInTheDocument();
  });

  it('interpolates shared meeting facts into the story and FAQ', () => {
    renderPage();

    // Story step 1 renders the address and venue from club.ts (not hardcoded).
    const storyHeading = screen.getByRole('heading', {
      level: 2,
      name: 'Co się stanie, kiedy przyjdę pierwszy raz?',
    });
    const story = within(storyHeading.parentElement!);
    expect(
      story.getByText((content) => content.includes(meetingInfo.addressLine)),
    ).toBeInTheDocument();
    expect(story.getByRole('link', { name: meetingInfo.venueName })).toHaveAttribute(
      'href',
      meetingInfo.venueUrl,
    );

    // The whole page (story + FAQ + meeting section) carries the room from club.ts.
    expect(document.body.textContent).toContain(meetingInfo.roomNumber);
    expect(document.body.textContent).toContain(meetingInfo.entranceHint);
  });
});
