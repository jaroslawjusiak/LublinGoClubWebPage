// src/data/site.ts
import type { NavItem } from '../types/data_models';

/**
 * Public navigation metadata — the single source of truth for the site's nav
 * links. Pages and components should render from this list rather than
 * hardcoding their own route arrays. `labelKey` points at an i18n key so the
 * same list works for any locale.
 */
export const navItems: NavItem[] = [
  { path: '/', labelKey: 'common:menu.home' },
  { path: '/lekcje', labelKey: 'common:menu.lessons' },
  { path: '/zasady', labelKey: 'common:menu.rules' },
  { path: '/zacznij-grac', labelKey: 'common:menu.start' },
  { path: '/o-klubie', labelKey: 'common:menu.about' },
  { path: '/aktualnosci', labelKey: 'common:menu.news' },
];
