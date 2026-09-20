// src/config/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import pl from '../locales/pl/translation.json';
import en from '../locales/en/translation.json';

/**
 * Each top-level group in the translation JSON is exposed as an i18next namespace,
 * so components can use keys like `common:menu.home` or `homepage:cta_button`.
 * Polish is the default and the fallback language.
 */
const resources = {
  pl: {
    common: pl.common,
    hero: pl.hero,
    homepage: pl.homepage,
    oklubie: pl.oklubie,
    aktualnosci: pl.aktualnosci,
  },
  en: {
    common: en.common,
    hero: en.hero,
    homepage: en.homepage,
    oklubie: en.oklubie,
    aktualnosci: en.aktualnosci,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'pl',
  fallbackLng: 'pl',
  ns: ['common', 'hero', 'homepage', 'oklubie', 'aktualnosci'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false, // React already escapes values.
  },
  returnNull: false,
});

export default i18n;
