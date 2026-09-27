// src/pages/KontaktPage.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaDiscord } from 'react-icons/fa';
import { Section, Container, Button } from '../components/primitives';
import MeetingSection from '../components/MeetingSection';
import { socialLinks } from '../data/club';
import { people } from '../data/people';

/**
 * Contact page: the public contact channels (Facebook / Discord), the shared
 * meeting/location block, and contact persons with their OGS handles.
 * No contact form in Tier A; no personal phone/Gmail is exposed.
 */
const KontaktPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Section id="kontakt">
        <Container className="max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-ink mb-6">
            {t('contact:title')}
          </h1>
          <p className="text-xl text-muted-text mb-10">{t('contact:intro')}</p>

          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-ink">
            {t('contact:social_title')}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            {socialLinks.facebook ? (
              <Button href={socialLinks.facebook} external variant="secondary" className="py-3 px-6">
                <FaFacebookF className="mr-2" aria-hidden="true" />
                Facebook
              </Button>
            ) : null}
            {socialLinks.discord ? (
              <Button href={socialLinks.discord} external variant="secondary" className="py-3 px-6">
                <FaDiscord className="mr-2" aria-hidden="true" />
                Discord
              </Button>
            ) : null}
          </div>

          {people.length > 0 ? (
            <>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-ink">
                {t('contact:people_title')}
              </h2>
              <ul className="space-y-4">
                {people.map((person) => (
                  <li key={person.name} className="border border-border rounded-lg p-4">
                    <p className="font-semibold text-ink">{person.name}</p>
                    {person.ogsHandle ? (
                      <p className="text-muted-text">
                        {t('contact:ogs_label')}: {person.ogsHandle}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </Container>
      </Section>

      <MeetingSection />
    </>
  );
};

export default KontaktPage;
