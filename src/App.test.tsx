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
    expect(heading).toHaveTextContent(/Klubie Go/i);
  });

  it('renders the news route heading', async () => {
    renderApp('/aktualnosci');
    expect(
      await screen.findByRole('heading', { level: 2, name: 'Aktualności' }),
    ).toBeInTheDocument();
  });
});
