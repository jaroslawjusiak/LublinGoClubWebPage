// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18nConfig from './config/i18n';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ZacznijPage from './pages/ZacznijPage';
import OKlubiePage from './pages/OKlubiePage';
import AktualnosciPage from './pages/AktualnosciPage';
import KontaktPage from './pages/KontaktPage';

const App: React.FC = () => (
  <I18nextProvider i18n={i18nConfig}>
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <Header />
      <main className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/zacznij" element={<ZacznijPage />} />
          <Route path="/o-klubie" element={<OKlubiePage />} />
          <Route path="/aktualnosci" element={<AktualnosciPage />} />
          <Route path="/kontakt" element={<KontaktPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  </I18nextProvider>
);

export default App;
