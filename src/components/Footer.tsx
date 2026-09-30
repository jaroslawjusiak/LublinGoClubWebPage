// src/components/Footer.tsx
import React from 'react';
import { Container } from './primitives';
import BrandMark from './BrandMark';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaDiscord } from 'react-icons/fa';
import { clubConfig, meetingInfo, socialLinks } from '../data/club';
import { navItems, startCta } from '../data/site';
import { useLocale, localizePath } from '../i18n/locale';

const footerLinkClasses =
  'inline-flex min-h-11 items-center rounded hover:underline underline-offset-4 transition-colors';

const socialLinkClasses =
  'inline-flex min-h-11 min-w-11 items-center justify-center rounded text-2xl hover:bg-on-brand/10 transition-colors';

const footerLinks = [...navItems.slice(0, 2), startCta, ...navItems.slice(2)];

/**
 * @description Footer with navigation, contact summary and social links.
 */
const Footer: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  return (
    <footer
      className="bg-brand text-on-brand pt-12 pb-8 [&_a:focus-visible]:outline-on-brand"
      aria-labelledby="site-footer-heading"
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-on-brand/25 pb-8 mb-8">
          {/* Column 1: Club info and social links */}
          <div className="text-left">
            <h2 id="site-footer-heading" className="mb-4">
              <BrandMark dark />
            </h2>
            <p className="text-on-brand/90 max-w-[32ch] mb-6">
              {clubConfig.slogan}
              <br />
              {meetingInfo.venueName} ({meetingInfo.addressLine})
            </p>

            <div className="flex gap-3">
              {socialLinks.facebook ? (
                <a
                  href={socialLinks.facebook}
                  aria-label="Facebook"
                  title="Facebook"
                  target="_blank"
                  rel="noreferrer noopener"
                  className={socialLinkClasses}
                >
                  <FaFacebookF />
                </a>
              ) : null}
              {socialLinks.discord ? (
                <a
                  href={socialLinks.discord}
                  aria-label="Discord"
                  title="Discord"
                  target="_blank"
                  rel="noreferrer noopener"
                  className={socialLinkClasses}
                >
                  <FaDiscord />
                </a>
              ) : null}
            </div>
          </div>

          {/* Column 2: Quick navigation */}
          <div className="text-left">
            <h3 className="text-h3 font-semibold text-on-brand mb-4">{t('footer:nav_heading')}</h3>
            <nav aria-label={t('footer:nav_aria')}>
              <ul className="space-y-1">
                {footerLinks.map((item) => (
                  <li key={item.path}>
                    <Link to={localizePath(item.path, locale)} className={footerLinkClasses}>
                      {t(item.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3: Contact details */}
          <div className="text-left">
            <h3 className="text-h3 font-semibold text-on-brand mb-4">
              {t('footer:contact_heading')}
            </h3>
            <p className="mb-2">
              {clubConfig.email ? (
                <a
                  href={`mailto:${clubConfig.email}`}
                  className="hover:underline underline-offset-4 transition-colors"
                >
                  {clubConfig.email}
                </a>
              ) : (
                t('footer:email_unavailable')
              )}
            </p>
            <div className="mt-6 pt-4 border-t border-on-brand/25">
              <h4 className="font-semibold mb-2 text-lg">{t('footer:address_heading')}</h4>
              <p>{meetingInfo.venueName}</p>
              <p>
                {meetingInfo.addressLine}, {meetingInfo.roomNumber}
              </p>
              <p>
                {meetingInfo.postalCode} {meetingInfo.city}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-3 text-caption text-on-brand/90">
          <p>
            &copy; {new Date().getFullYear()} {clubConfig.name}
          </p>
          <Link
            to={localizePath('/prywatnosc', locale)}
            className="hover:underline underline-offset-4 transition-colors rounded "
          >
            {t('footer:privacy_link')}
          </Link>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
