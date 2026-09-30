// src/components/Header.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Container } from './primitives';
import MobileMenu from './MobileMenu';
import LanguageSwitcher from './LanguageSwitcher';
import BrandMark from './BrandMark';
import { navItems, startCta } from '../data/site';
import { useLocale, localizePath } from '../i18n/locale';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  return (
    <header className="relative min-[1100px]:sticky top-0 z-50 bg-paper border-b border-border">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4 py-4">
          <BrandMark />

          <nav
            className="hidden min-[1100px]:flex gap-5 items-center"
            aria-label={t('common:nav_primary')}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={localizePath(item.path, locale)}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `inline-flex min-h-11 items-center rounded text-sm hover:text-brand transition-colors ${isActive ? 'text-brand underline decoration-2 underline-offset-8' : 'text-ink'}`
                }
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-4">
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
