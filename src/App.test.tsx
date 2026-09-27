import { describe, it, expect } from 'vitest';
import { Suspense } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const renderApp = (route = '/') =>
  render(
    <Suspense fallback={<div>loading</div>}>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </Suspense>,
  );

describe('App', () => {
  it('mounts the layout with the club name and navigation', async () => {
    renderApp();

    // The brand link in the header is unique.
    expect(await screen.findByRole('link', { name: 'Lubelski Klub Go' })).toBeInTheDocument();
    // "Aktualności" appears in both the header and footer navigation.
    expect((await screen.findAllByRole('link', { name: 'Aktualności' })).length).toBeGreaterThan(0);
  });

  it('renders the home route hero heading', async () => {
    renderApp('/');
    const heading = await screen.findByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/Zagraj w Go w Lublinie/i);
  });

  it('renders the news route heading', async () => {
    renderApp('/aktualnosci');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Aktualności' }),
    ).toBeInTheDocument();
  });

  it('shows no invented posts and uses the shared news state', async () => {
    renderApp('/aktualnosci');
    // Without Supabase env vars the repository reports "unconfigured" (not an
    // empty feed), and the shared NewsFeed renders that state.
    expect(
      await screen.findByText('Aktualności nie są jeszcze skonfigurowane.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Turniej Mistrzów Go')).not.toBeInTheDocument();
  });

  it('renders a deliberate not-found page for an unknown route', async () => {
    renderApp('/nie-ma-takiej-strony');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Nie znaleziono strony' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Wróć na stronę główną' })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('keeps the document language in sync with the default locale', async () => {
    renderApp('/');
    await screen.findByRole('heading', { level: 1 });
    expect(document.documentElement.lang).toBe('pl');
  });

  it('shows meeting facts and a directions link on Home', async () => {
    renderApp('/');
    expect(await screen.findByRole('link', { name: 'Wyznacz dojazd' })).toBeInTheDocument();
    expect(screen.getAllByText('Wstęp wolny').length).toBeGreaterThan(0);
  });

  it('shows the same meeting section on the Contact page', async () => {
    renderApp('/kontakt');
    expect(await screen.findByRole('heading', { level: 1, name: 'Kontakt' })).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: 'Wyznacz dojazd' })).toBeInTheDocument();
  });

  it('mounts the mobile navigation toggle', async () => {
    renderApp('/');
    expect(await screen.findByRole('button', { name: 'Menu' })).toBeInTheDocument();
  });

  it('shows the meeting time on Home', async () => {
    renderApp('/');
    expect(await screen.findByText(/17:00–20:00/)).toBeInTheDocument();
  });

  it('shows the same meeting facts on Home and Contact', async () => {
    const home = renderApp('/');
    expect(await screen.findByText(/17:00–20:00/)).toBeInTheDocument();
    home.unmount();

    renderApp('/kontakt');
    expect(await screen.findByText(/17:00–20:00/)).toBeInTheDocument();
  });
});
