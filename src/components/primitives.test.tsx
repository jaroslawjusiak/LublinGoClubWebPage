import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Container, Section, Card, Chip, Button } from './primitives';
import { fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

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

  it('prevents clicks while a native button is disabled', () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders an external link when `href` is provided', () => {
    render(
      <Button href="https://example.com" external>
        Open
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Open' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer noopener');
  });

  it('renders Card children', () => {
    render(<Card>card body</Card>);
    expect(screen.getByText('card body')).toBeInTheDocument();
  });
});
