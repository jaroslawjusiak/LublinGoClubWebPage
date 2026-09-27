// src/App.tsx
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18nConfig from './i18n/config';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ZacznijPage from './pages/ZacznijPage';
import OKlubiePage from './pages/OKlubiePage';
import AktualnosciPage from './pages/AktualnosciPage';
import KontaktPage from './pages/KontaktPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Keeps the document <html lang> in sync with the active i18n language so the
 * route locale, translations and the `lang` attribute never drift apart.
 */
const LanguageSyncer: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? i18n.language ?? 'pl';
  }, [i18n.language, i18n.resolvedLanguage]);

  return null;
};

const AppShell: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-paper text-ink">
    <LanguageSyncer />
    <Header />
    <main className="flex-grow w-full">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/zacznij" element={<ZacznijPage />} />
        <Route path="/o-klubie" element={<OKlubiePage />} />
        <Route path="/aktualnosci" element={<AktualnosciPage />} />
        <Route path="/kontakt" element={<KontaktPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
    <Footer />
  </div>
);

const App: React.FC = () => (
  <I18nextProvider i18n={i18nConfig}>
    <AppShell />
  </I18nextProvider>
);

export default App;
