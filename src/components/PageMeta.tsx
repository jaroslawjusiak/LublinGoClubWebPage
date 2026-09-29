// src/components/PageMeta.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useLocale } from '../i18n/locale';
import { clubConfig } from '../data/club';

interface MetaEntry {
  title: string;
  description: string;
}

const ROUTE_META: Record<string, MetaEntry> = {
  '/': { title: 'meta:home_title', description: 'meta:home_description' },
  '/zacznij': { title: 'meta:start_title', description: 'meta:start_description' },
  '/o-klubie': { title: 'meta:about_title', description: 'meta:about_description' },
  '/aktualnosci': { title: 'meta:news_title', description: 'meta:news_description' },
  '/kontakt': { title: 'meta:contact_title', description: 'meta:contact_description' },
  '/prywatnosc': { title: 'meta:privacy_title', description: 'meta:privacy_description' },
};

const NOT_FOUND: MetaEntry = {
  title: 'meta:notfound_title',
  description: 'meta:notfound_description',
};

/**
 * Sets per-route title, description, canonical and OpenGraph basics. The active
 * `<html lang>` is managed by `LocaleGate`; this only fills the `<head>`.
 */
const PageMeta: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const locale = useLocale();

  // Strip the locale prefix (e.g. /en/aktualnosci → /aktualnosci).
  const normalized = locale === 'pl' ? pathname : pathname.replace(`/${locale}`, '') || '/';
  const meta = ROUTE_META[normalized] ?? NOT_FOUND;
  const canonical = `https://${clubConfig.canonicalDomain}${pathname}`;

  return (
    <Helmet>
      <title>{t(meta.title)}</title>
      <meta name="description" content={t(meta.description)} />
      {ROUTE_META[normalized] ? <link rel="canonical" href={canonical} /> : null}
      <meta property="og:title" content={t(meta.title)} />
      <meta property="og:description" content={t(meta.description)} />
      <meta property="og:type" content="website" />
      {normalized === '/admin' ? <meta name="robots" content="noindex" /> : null}
    </Helmet>
  );
};

export default PageMeta;
