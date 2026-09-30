// src/components/MobileCta.tsx
import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from './primitives';
import { useLocale, localizePath } from '../i18n/locale';

const MEETING_ID = 'spotkania';

/**
 * Sticky, mobile-only call-to-action that always points to the meeting info.
 * It scrolls to the meeting section when it is on the current page; otherwise it
 * navigates to the home page and scrolls there. Hidden on desktop (`md:hidden`)
 * and on the admin workspace so it never covers form actions.
 */
const MobileCta: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pendingScroll = useRef(false);

  const scrollToMeeting = useCallback(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(MEETING_ID)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }, []);

  const handleClick = () => {
    if (document.getElementById(MEETING_ID)) {
      scrollToMeeting();
      return;
    }
    pendingScroll.current = true;
    navigate(localizePath('/', locale));
  };

  useEffect(() => {
    if (pendingScroll.current && document.getElementById(MEETING_ID)) {
      pendingScroll.current = false;
      scrollToMeeting();
    }
  }, [pathname, scrollToMeeting]);

  // Keep the marketing CTA out of the admin workspace (its form has its own
  // bottom action buttons). Admin is not locale-prefixed, so an exact match is fine.
  if (pathname === '/admin') return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden border-t border-border bg-paper p-3">
      <Button onClick={handleClick} variant="primary" className="w-full">
        {t('meeting:mobile_cta')}
      </Button>
    </div>
  );
};

export default MobileCta;
