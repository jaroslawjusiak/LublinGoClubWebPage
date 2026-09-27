// src/i18n/locale.ts
import { useLocation } from 'react-router-dom';
import type { Locale } from '../types/data_models';

/** Locale prefixes that have (or will have) their own routes. */
const SUPPORTED_PREFIXES: readonly string[] = ['en', 'uk'];

/**
 * Derives the active locale from the URL path. Polish is the default and lives
 * at the root (no prefix); English and Ukrainian are prefixed (`/en/...`, `/uk/...`).
 */
export function localeFromPath(pathname: string): Locale {
  const first = pathname.split('/')[1];
  return SUPPORTED_PREFIXES.includes(first) ? (first as Locale) : 'pl';
}

/** React hook returning the locale for the current location. */
export function useLocale(): Locale {
  const { pathname } = useLocation();
  return localeFromPath(pathname);
}

/** Prefixes a Polish (default) path with the current locale when needed. */
export function localizePath(path: string, locale: Locale): string {
  if (locale === 'pl') return path;
  return `/${locale}${path === '/' ? '' : path}`;
}
