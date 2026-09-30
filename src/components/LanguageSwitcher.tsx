// src/components/LanguageSwitcher.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocale, localizePath } from '../i18n/locale';
import type { Locale } from '../types/data_models';

/**
 * Language labels are not translated: a switcher shows each language with a flag
 * (a local, public-domain SVG in `public/flags/`) plus a short code. Ukraine uses
 * the unambiguous ISO alpha-3 code "UKR" instead of "UA".
 */
const LANGUAGES: ReadonlyArray<{ code: Locale; flag: string; label: string; name: string }> = [
  { code: 'pl', flag: '/flags/pl.svg', label: 'PL', name: 'Polski' },
  { code: 'en', flag: '/flags/gb.svg', label: 'EN', name: 'English' },
  { code: 'uk', flag: '/flags/ua.svg', label: 'UKR', name: 'Українська' },
];

const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { pathname } = useLocation();

  // `/admin` is not locale-prefixed, so switching language there would produce a
  // dead route (/en/admin, /uk/admin). Hide the switcher on the admin page.
  if (pathname === '/admin') return null;

  // Normalise the current URL to its Polish (default) form, then re-prefix it.
  const basePath = locale === 'pl' ? pathname : pathname.replace(`/${locale}`, '') || '/';

  return (
    <nav
      aria-label={t('common:language_label')}
      className={`flex items-center gap-2 ${className}`.trim()}
    >
      {LANGUAGES.map((lang) => {
        const active = lang.code === locale;
        return (
          <Link
            key={lang.code}
            to={localizePath(basePath, lang.code)}
            aria-current={active ? 'page' : undefined}
            aria-label={lang.name}
            className={`inline-flex items-center gap-1.5 text-sm font-medium rounded px-1  ${
              active ? 'text-brand font-bold' : 'text-ink hover:text-brand'
            }`}
          >
            <span className="inline-block h-3.5 w-5 shrink-0 overflow-hidden rounded-sm border border-border">
              <img src={lang.flag} alt="" className="h-full w-full object-cover" />
            </span>
            <span>{lang.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default LanguageSwitcher;
