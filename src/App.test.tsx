import { describe, it, expect, vi } from 'vitest';
import { Suspense } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Keep the app-shell tests deterministic regardless of whether the developer has
// Supabase env vars set: the news repository reports "unconfigured" when there
// is no client, and no network request is made.
vi.mock('./lib/supabase/client', () => ({
  getSupabaseClient: () => null,
}));

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

    // Both shell regions share the brand; the header retains its home link.
    const header = await screen.findByRole('banner');
    expect(within(header).getByRole('link', { name: 'Lubelski Klub Go' })).toHaveAttribute(
      'href',
      '/',
    );
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

  it('serves separate rules and first-visit pages, and redirects the retired path', async () => {
    renderApp('/zasady');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Zasady gry' }),
    ).toBeInTheDocument();
    expect(within(screen.getByRole('main')).getAllByRole('listitem')).toHaveLength(6);
    expect(screen.queryByRole('heading', { name: /Co się stanie/ })).not.toBeInTheDocument();
  });

  it('redirects the old localized route and keeps the locale', async () => {
    renderApp('/en/zacznij');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Start playing' }),
    ).toBeInTheDocument();
    await waitFor(() => expect(document.documentElement.lang).toBe('en'));
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

  it.each([
    ['/kontakt', 'Lekcje'],
    ['/en/kontakt', 'Lessons'],
    ['/uk/kontakt', 'Уроки'],
  ])('redirects retired contact route %s to lessons with its locale', async (route, title) => {
    renderApp(route);
    expect(await screen.findByRole('heading', { level: 1, name: title })).toBeInTheDocument();
    const lessonsLink = within(screen.getAllByRole('banner')[0]).getByRole('link', { name: title });
    expect(lessonsLink).toHaveAttribute('href', route.replace('kontakt', 'lekcje'));
    expect(lessonsLink).toHaveAttribute('aria-current', 'page');
  });

  it('mounts the mobile navigation toggle', async () => {
    renderApp('/');
    expect(await screen.findByRole('button', { name: 'Menu' })).toBeInTheDocument();
  });

  it('shows the meeting time on Home', async () => {
    renderApp('/');
    expect(await screen.findByText(/17:00–20:00/)).toBeInTheDocument();
  });

  it('keeps meeting facts available in the shared footer after Contact is retired', async () => {
    const home = renderApp('/');
    expect(await screen.findByText(/17:00–20:00/)).toBeInTheDocument();
    home.unmount();

    renderApp('/kontakt');
    expect(await screen.findByRole('heading', { level: 1, name: 'Lekcje' })).toBeInTheDocument();
    expect(within(screen.getByRole('contentinfo')).getByText(/Bernardyńska/)).toBeInTheDocument();
  });

  it('serves the /en locale route in English', async () => {
    renderApp('/en');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Play Go in Lublin' }),
    ).toBeInTheDocument();
    await waitFor(() => expect(document.documentElement.lang).toBe('en'));
  });

  it('does not link to missing robots.txt or sitemap.xml', async () => {
    renderApp('/');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.queryByText('robots.txt')).not.toBeInTheDocument();
    expect(screen.queryByText('sitemap.xml')).not.toBeInTheDocument();
  });

  it('renders the privacy policy route', async () => {
    renderApp('/prywatnosc');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Polityka prywatności' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Zgoda na wykorzystanie wizerunku' }),
    ).toBeInTheDocument();
  });

  it('gives the admin route a proper document title (not the not-found title)', async () => {
    renderApp('/admin');
    await waitFor(() => expect(document.title).toContain('Panel administratora'));
  });
});
