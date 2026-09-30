// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Container } from './primitives';
import MobileMenu from './MobileMenu';
import LanguageSwitcher from './LanguageSwitcher';
import { navItems, startCta } from '../data/site';
import { useLocale, localizePath } from '../i18n/locale';

const linkClasses = 'text-sm hover:text-brand transition  rounded';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  return (
    <header className="sticky top-0 z-50 bg-paper shadow-sm border-b">
      <Container>
        <div className="flex items-center justify-between py-3">
          <Link
            to={localizePath('/', locale)}
            className="whitespace-nowrap text-xl md:text-2xl font-extrabold text-ink tracking-wide"
          >
            {t('common:site_name')}
          </Link>

          <nav
            className="hidden min-[1100px]:flex space-x-8 items-center"
            aria-label={t('common:nav_primary')}
          >
            {navItems.map((item) => (
              <Link key={item.path} to={localizePath(item.path, locale)} className={linkClasses}>
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden min-[1100px]:block">
              <LanguageSwitcher />
            </div>
            <Button
              to={localizePath(startCta.path, locale)}
              variant="primary"
              className="hidden min-[1100px]:inline-flex"
            >
              {t(startCta.labelKey)}
            </Button>
            <MobileMenu />
          </div>
        </div>

        {/* Mobile: language switcher on its own row so codes always stay visible. */}
        <div className="min-[1100px]:hidden pb-3">
          <LanguageSwitcher />
        </div>
      </Container>
    </header>
  );
};

export default Header;
