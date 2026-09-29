// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import pl from './locales/pl/translation.json';
import en from './locales/en/translation.json';

/**
 * Each top-level group in the translation JSON is exposed as an i18next namespace,
 * so components can use keys like `common:menu.home` or `homepage:cta_button`.
 *
 * Polish is the default and fallback language. English has full key coverage
 * (enforced by the pl↔en parity test) but its wording is unreviewed; Ukrainian
 * has no resource yet, so `uk` falls back to Polish.
 */
const resources = {
  pl: {
    common: pl.common,
    hero: pl.hero,
    homepage: pl.homepage,
    meeting: pl.meeting,
    start: pl.start,
    oklubie: pl.oklubie,
    contact: pl.contact,
    footer: pl.footer,
    rules: pl.rules,
    admin: pl.admin,
    privacy: pl.privacy,
    meta: pl.meta,
    aktualnosci: pl.aktualnosci,
    notFound: pl.notFound,
  },
  en: {
    common: en.common,
    hero: en.hero,
    homepage: en.homepage,
    meeting: en.meeting,
    start: en.start,
    oklubie: en.oklubie,
    contact: en.contact,
    footer: en.footer,
    rules: en.rules,
    admin: en.admin,
    privacy: en.privacy,
    meta: en.meta,
    aktualnosci: en.aktualnosci,
    notFound: en.notFound,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'pl',
  fallbackLng: 'pl',
  supportedLngs: ['pl', 'en', 'uk'],
  ns: ['common', 'hero', 'homepage', 'meeting', 'start', 'oklubie', 'contact', 'footer', 'rules', 'admin', 'privacy', 'meta', 'aktualnosci', 'notFound'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false, // React already escapes values.
  },
  returnNull: false,
  react: {
    useSuspense: false, // resources are inline; language switches re-render synchronously
  },
});

export default i18n;
