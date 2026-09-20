// src/components/primitives.tsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @component Container
 * @description Layout primitive: constrains content width and centers it.
 */
export const Container: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${className}`.trim()}>{children}</div>;

/**
 * @component Section
 * @description Layout primitive: a major themed section of the page.
 */
export const Section: React.FC<{ id?: string; className?: string; children: React.ReactNode }> = ({
  id,
  className = '',
  children,
}) => (
  <section id={id} className={`py-16 ${className}`.trim()}>
    {children}
  </section>
);

type ButtonVariant = 'primary' | 'secondary';

/**
 * UI primitive: button. Renders a react-router `Link` when `to` is provided,
 * otherwise a native `<button>`.
 */
export const Button: React.FC<{
  to?: string;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  onClick?: React.MouseEventHandler<HTMLElement>;
  disabled?: boolean;
}> = ({
  to,
  type = 'button',
  children,
  className = '',
  variant = 'primary',
  onClick,
  disabled = false,
}) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md border font-medium transition duration-150 ease-in-out shadow-sm focus:outline-none focus-visible:ring-2';
  const styleClasses =
    variant === 'primary'
      ? 'bg-kaya hover:opacity-90 border-kaya text-white focus-visible:ring-kaya/70'
      : 'bg-paper hover:bg-gray-100 border-border text-ink focus-visible:ring-slate-400/50';
  const classes = `${baseClasses} ${styleClasses} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

/**
 * UI primitive: a small informational chip/badge.
 */
export const Chip: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => (
  <span
    className={`inline-flex items-center rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-muted-text ${className}`.trim()}
  >
    {text}
  </span>
);

/**
 * UI primitive: a standard content card for grouping related information.
 */
export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => (
  <div className={`bg-paper border border-border rounded-lg shadow-sm p-6 ${className}`.trim()}>
    {children}
  </div>
);

/**
 * UI primitive: responsive image that prevents layout shift when dimensions are given.
 */
export const SmartImage: React.FC<{
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loadingStrategy?: 'lazy' | 'eager';
}> = ({ src, alt, width, height, className = '', loadingStrategy = 'lazy' }) => (
  <img
    src={src}
    alt={alt}
    width={width}
    height={height}
    loading={loadingStrategy}
    className={`w-full h-full object-cover ${className}`.trim()}
  />
);
