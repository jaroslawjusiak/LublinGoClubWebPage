import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Container, Section, Card, Chip, Button } from './primitives';

describe('primitives', () => {
  it('renders Container children', () => {
    render(<Container>hello</Container>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('renders Section with the given id', () => {
    render(<Section id="demo">content</Section>);
    const section = document.getElementById('demo');
    expect(section).not.toBeNull();
    expect(section).toHaveTextContent('content');
  });

  it('renders Chip text', () => {
    render(<Chip text="PL" />);
    expect(screen.getByText('PL')).toBeInTheDocument();
  });

  it('renders a router link when `to` is provided', () => {
    render(
      <MemoryRouter>
        <Button to="/zacznij">Start</Button>
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Start' })).toHaveAttribute('href', '/zacznij');
  });

  it('renders a native button when `to` is not provided', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
  });

  it('renders Card children', () => {
    render(<Card>card body</Card>);
    expect(screen.getByText('card body')).toBeInTheDocument();
  });
});
