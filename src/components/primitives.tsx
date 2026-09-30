// src/components/primitives.tsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @component Container
 * @description Layout primitive: constrains content width and centers it.
 */
export const Container: React.FC<{
  className?: string;
  width?: 'default' | 'reading';
  children: React.ReactNode;
}> = ({ className = '', width = 'default', children }) => (
  <div
    className={`mx-auto w-full ${width === 'reading' ? 'max-w-3xl' : 'max-w-[1200px]'} px-4 min-[360px]:px-5 lg:px-8 ${className}`.trim()}
  >
    {children}
  </div>
);

/**
 * @component Section
 * @description Layout primitive: a major themed section of the page.
 */
const sectionSpacing = {
  default: 'py-10 md:py-16',
  compact: 'py-8 md:py-12',
  hero: 'py-12 md:py-16',
  none: '',
};

export const Section: React.FC<{
  id?: string;
  className?: string;
  spacing?: keyof typeof sectionSpacing;
  children: React.ReactNode;
}> = ({ id, className = '', spacing = 'default', children }) => (
  <section id={id} className={`${sectionSpacing[spacing]} ${className}`.trim()}>
    {children}
  </section>
);

type ButtonVariant = 'primary' | 'secondary' | 'destructive';

/**
 * UI primitive: button. Renders a react-router `Link` when `to` is provided,
 * an external/plain `<a>` when `href` is provided, otherwise a native `<button>`.
 */
export const Button: React.FC<{
  to?: string;
  href?: string;
  external?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  onClick?: React.MouseEventHandler<HTMLElement>;
  disabled?: boolean;
}> = ({
  to,
  href,
  external = false,
  type = 'button',
  children,
  className = '',
  variant = 'primary',
  onClick,
  disabled = false,
}) => {
  const baseClasses =
    'inline-flex min-h-11 items-center justify-center rounded-lg border px-5 py-2.5 font-semibold text-center transition-colors duration-150 ease-in-out disabled:cursor-not-allowed disabled:opacity-50';
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-brand [&:not(:disabled)]:hover:bg-brand-hover border-brand text-on-brand',
    secondary: 'bg-transparent [&:not(:disabled)]:hover:bg-sand border-brand text-brand',
    destructive: 'bg-red-700 [&:not(:disabled)]:hover:bg-red-800 border-red-700 text-white',
  };
  const styleClasses = variants[variant];
  const classes = `${baseClasses} ${styleClasses} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      >
        {children}
      </a>
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
    className={`inline-flex items-center rounded-md bg-sand px-3 py-1 text-caption font-medium text-muted-text ${className}`.trim()}
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
  <div className={`bg-surface border border-border rounded-xl p-6 ${className}`.trim()}>
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
  srcSet?: string;
  sizes?: string;
  loadingStrategy?: 'lazy' | 'eager';
}> = ({ src, alt, width, height, srcSet, sizes, className = '', loadingStrategy = 'lazy' }) => (
  <img
    src={src}
    alt={alt}
    width={width}
    height={height}
    srcSet={srcSet}
    sizes={sizes}
    loading={loadingStrategy}
    className={`w-full h-full object-cover ${className}`.trim()}
  />
);
