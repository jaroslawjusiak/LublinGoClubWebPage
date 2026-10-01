// src/components/MobileCta.tsx
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  const barRef = useRef<HTMLDivElement>(null);
  const [floating, setFloating] = useState(true);

  useLayoutEffect(() => {
    const bar = barRef.current;
    const root = document.documentElement;
    if (!bar) {
      root.style.removeProperty('--mobile-cta-height');
      return;
    }

    const measure = () => {
      const height = bar.getBoundingClientRect().height;
      // Enlarged text and short viewports need the full viewport for content.
      // Keep the same CTA in normal flow when a floating bar would dominate it.
      const canFloat = height > 0 && height <= window.innerHeight * 0.16;
      setFloating(canFloat);
      root.style.setProperty('--mobile-cta-height', canFloat ? `${height}px` : '0px');
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(bar);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
      root.style.removeProperty('--mobile-cta-height');
    };
  }, [pathname]);

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
    <div
      ref={barRef}
      className={`mobile-cta md:hidden border-t border-border bg-paper p-3 ${floating ? 'fixed inset-x-0 bottom-0 z-40' : ''}`}
    >
      <Button onClick={handleClick} variant="primary" className="w-full">
        {t('meeting:mobile_cta')}
      </Button>
    </div>
  );
};

export default MobileCta;
