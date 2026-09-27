// src/components/ScrollToTop.tsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets the window scroll to the top whenever the route path changes, so a new
 * page always starts at its top instead of preserving the previous page's scroll
 * position (e.g. after clicking a footer link).
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
