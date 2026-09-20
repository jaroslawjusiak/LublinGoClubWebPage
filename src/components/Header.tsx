// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Chip } from './primitives';

const linkClasses = 'text-sm hover:text-kaya transition focus:outline-none focus-visible:ring-2 focus-visible:ring-kaya/50 rounded';

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 bg-paper shadow-sm border-b">
      <div className="container mx-auto max-w-[1200px] flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-extrabold text-ink tracking-wide">
          {t('common:site_name')}
        </Link>

        <nav className="hidden md:flex space-x-8 items-center" aria-label={t('common:site_name')}>
          <Link to="/" className={linkClasses}>
            {t('common:menu.home')}
          </Link>
          <Link to="/o-klubie" className={linkClasses}>
            {t('common:menu.about')}
          </Link>
          <Link to="/aktualnosci" className={linkClasses}>
            {t('common:menu.news')}
          </Link>
          <Link to="/kontakt" className={linkClasses}>
            {t('common:menu.events')}
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Chip text="PL" />
          <Button to="/zacznij" variant="primary" className="hidden sm:inline-flex py-2 px-4">
            {t('common:menu.start')}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
