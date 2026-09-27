// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaDiscord } from 'react-icons/fa';
import { clubConfig, meetingInfo, socialLinks } from '../data/club';
import { navItems, startCta } from '../data/site';
import { useLocale, localizePath } from '../i18n/locale';

const footerLinkClasses =
  'block hover:text-kaya transition rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-kaya/50';

const socialLinkClasses =
  'text-2xl text-ink hover:text-kaya transition rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-kaya/50';

const footerLinks = [...navItems.slice(0, 2), startCta, ...navItems.slice(2)];

/**
 * @description Footer with navigation, contact summary and social links.
 */
const Footer: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  return (
    <footer className="bg-gray-50 border-t mt-24 pt-16 pb-8" aria-labelledby="site-footer-heading">
      <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b pb-12 mb-8">
          {/* Column 1: Club info and social links */}
          <div className="text-center md:text-left">
            <h2 id="site-footer-heading" className="text-3xl font-extrabold text-ink tracking-wide mb-4">
              {clubConfig.name}
            </h2>
            <p className="text-muted-text max-w-[280px] mb-6 mx-auto md:mx-0">
              {clubConfig.slogan}
              <br />
              {meetingInfo.venueName} ({meetingInfo.addressLine})
            </p>

            <div className="flex justify-center md:justify-start gap-6">
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
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-kaya mb-6">{t('footer:nav_heading')}</h3>
            <nav aria-label={t('footer:nav_aria')}>
              <ul className="space-y-4 text-lg">
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
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-kaya mb-6">{t('footer:contact_heading')}</h3>
            <p className="mb-2">
              {clubConfig.email ? (
                <a href={`mailto:${clubConfig.email}`} className="hover:text-kaya transition">
                  {clubConfig.email}
                </a>
              ) : (
                t('footer:email_unavailable')
              )}
            </p>
            <div className="mt-6 pt-4 border-t border-border">
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
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-muted-text">
          <p>
            &copy; {new Date().getFullYear()} {clubConfig.name}
          </p>
          <Link
            to={localizePath('/prywatnosc', locale)}
            className="hover:text-kaya transition rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-kaya/50"
          >
            {t('footer:privacy_link')}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
