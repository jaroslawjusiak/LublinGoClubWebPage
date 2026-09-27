// src/App.tsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, Outlet, useParams } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18nConfig from './i18n/config';
import { useLocale } from './i18n/locale';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ZacznijPage from './pages/ZacznijPage';
import OKlubiePage from './pages/OKlubiePage';
import AktualnosciPage from './pages/AktualnosciPage';
import KontaktPage from './pages/KontaktPage';
import NotFoundPage from './pages/NotFoundPage';

const SUPPORTED_LOCALES = ['en', 'uk'];

/**
 * Switches i18n to the URL locale before rendering page content, and keeps
 * `<html lang>` in sync. Children mount only once the language matches the URL,
 * so they never render in the wrong language on first load.
 */
const LocaleGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const locale = useLocale();
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<string>(
    () => i18n.resolvedLanguage ?? i18n.language ?? 'pl',
  );

  useEffect(() => {
    if (language === locale) return;
    let active = true;
    i18n.changeLanguage(locale).then(() => {
      if (active) setLanguage(locale);
    });
    return () => {
      active = false;
    };
  }, [locale, language, i18n]);

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? 'pl';
  }, [i18n.resolvedLanguage]);

  if (language !== locale) return null;
  return <>{children}</>;
};

/**
 * Validates the `:locale` segment; an unknown locale renders the not-found page
 * instead of a blank screen.
 */
const LocaleLayout: React.FC = () => {
  const { locale } = useParams<{ locale: string }>();

  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    return <NotFoundPage />;
  }

  return <Outlet />;
};

const AppShell: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-paper text-ink">
    <Header />
    <main className="flex-grow w-full">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/zacznij" element={<ZacznijPage />} />
        <Route path="/o-klubie" element={<OKlubiePage />} />
        <Route path="/aktualnosci" element={<AktualnosciPage />} />
        <Route path="/kontakt" element={<KontaktPage />} />

        <Route path="/:locale" element={<LocaleLayout />}>
          <Route index element={<HomePage />} />
          <Route path="zacznij" element={<ZacznijPage />} />
          <Route path="o-klubie" element={<OKlubiePage />} />
          <Route path="aktualnosci" element={<AktualnosciPage />} />
          <Route path="kontakt" element={<KontaktPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
    <Footer />
  </div>
);

const App: React.FC = () => (
  <I18nextProvider i18n={i18nConfig}>
    <LocaleGate>
      <AppShell />
    </LocaleGate>
  </I18nextProvider>
);

export default App;
