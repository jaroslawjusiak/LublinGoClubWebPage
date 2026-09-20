// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { clubConfig, meetingInfo, socialLinks } from '../data/club';

const footerLinkClasses =
  'block hover:text-kaya transition rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-kaya/50';

const socialLinkClasses =
  'text-2xl text-ink hover:text-kaya transition rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-kaya/50';

/**
 * @description Comprehensive footer with navigation, contact summary and social links.
 */
const Footer: React.FC = () => (
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
            <a
              href={socialLinks.instagram}
              aria-label="Instagram"
              title="Instagram"
              target="_blank"
              rel="noreferrer noopener"
              className={socialLinkClasses}
            >
              <FaInstagram />
            </a>
            <a
              href={socialLinks.youtube}
              aria-label="YouTube"
              title="YouTube"
              target="_blank"
              rel="noreferrer noopener"
              className={socialLinkClasses}
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Column 2: Quick navigation */}
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-kaya mb-6">Nawigacja</h3>
          <nav aria-label="Główne linki nawigacyjne">
            <ul className="space-y-4 text-lg">
              <li>
                <Link to="/" className={footerLinkClasses}>
                  Strona główna
                </Link>
              </li>
              <li>
                <Link to="/o-klubie" className={footerLinkClasses}>
                  O klubie
                </Link>
              </li>
              <li>
                <Link to="/zacznij" className={footerLinkClasses}>
                  Zacznij grać
                </Link>
              </li>
              <li>
                <Link to="/aktualnosci" className={footerLinkClasses}>
                  Aktualności
                </Link>
              </li>
              <li>
                <Link to="/kontakt" className={footerLinkClasses}>
                  Kontakt i lokalizacja
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Column 3: Contact details */}
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-kaya mb-6">Skontaktuj się z nami</h3>
          <p className="mb-4">{clubConfig.phone ?? 'Numer telefonu niedostępny'}</p>
          <p className="mb-2">
            {clubConfig.email ? (
              <a href={`mailto:${clubConfig.email}`} className="hover:text-kaya transition">
                {clubConfig.email}
              </a>
            ) : (
              'Adres e-mail niedostępny'
            )}
          </p>
          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="font-semibold mb-2 text-lg">Adres klubowy</h4>
            <p>{meetingInfo.venueName}</p>
            <p>
              {meetingInfo.addressLine}, {meetingInfo.roomNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-text">
        <p>&copy; {new Date().getFullYear()} Lubelski Klub Go</p>
        <div className="space-x-4">
          <a href="/robots.txt" className="hover:text-kaya transition">
            robots.txt
          </a>
          <a href="/sitemap.xml" className="hover:text-kaya transition">
            sitemap.xml
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
