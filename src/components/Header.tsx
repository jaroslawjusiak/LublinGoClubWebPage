// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from './primitives';
import MobileMenu from './MobileMenu';
import LanguageSwitcher from './LanguageSwitcher';
import { navItems, startCta } from '../data/site';
import { useLocale, localizePath } from '../i18n/locale';

const linkClasses =
  'text-sm hover:text-kaya transition focus:outline-none focus-visible:ring-2 focus-visible:ring-kaya/50 rounded';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  return (
    <header className="sticky top-0 z-50 bg-paper shadow-sm border-b">
      <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <Link
            to={localizePath('/', locale)}
            className="whitespace-nowrap text-xl md:text-2xl font-extrabold text-ink tracking-wide"
          >
            {t('common:site_name')}
          </Link>

          <nav
            className="hidden md:flex space-x-8 items-center"
            aria-label={t('common:nav_primary')}
          >
            {navItems.map((item) => (
              <Link key={item.path} to={localizePath(item.path, locale)} className={linkClasses}>
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <Button
              to={localizePath(startCta.path, locale)}
              variant="primary"
              className="hidden md:inline-flex py-2 px-4"
            >
              {t(startCta.labelKey)}
            </Button>
            <MobileMenu />
          </div>
        </div>

        {/* Mobile: language switcher on its own row so codes always stay visible. */}
        <div className="md:hidden pb-3">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
