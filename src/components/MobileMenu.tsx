// src/components/MobileMenu.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from './primitives';
import { navItems, startCta } from '../data/site';
import { useLocale, localizePath } from '../i18n/locale';

/**
 * Accessible mobile navigation. The panel is only mounted while open, so closed
 * links are never focusable, and it closes on navigation or Escape.
 */
const MobileMenu: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="p-2 text-ink hover:bg-gray-100 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-kaya/70"
        aria-expanded={isOpen}
        aria-controls="mobile-menu-list"
        aria-label={t('common:menu.toggle')}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <nav
          id="mobile-menu-list"
          aria-label={t('common:nav_primary')}
          className="absolute right-0 top-full mt-2 w-64 bg-paper border border-border rounded-lg shadow-lg z-50"
        >
          <ul className="p-4 space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={localizePath(item.path, locale)}
                  onClick={close}
                  className="block py-3 px-2 text-lg font-medium hover:text-kaya rounded transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-kaya/70"
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-4 pb-4">
            <Button
              to={localizePath(startCta.path, locale)}
              onClick={close}
              variant="primary"
              className="w-full py-3"
            >
              {t(startCta.labelKey)}
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default MobileMenu;
