// src/pages/KontaktPage.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaDiscord } from 'react-icons/fa';
import { Section, Container, Button } from '../components/primitives';
import MeetingSection from '../components/MeetingSection';
import { socialLinks } from '../data/club';
import { people } from '../data/people';
import PageIntro from '../components/PageIntro';

/**
 * Contact page: the public contact channels (Facebook / Discord), the shared
 * meeting/location block, and contact persons with their OGS handles.
 * No contact form in Tier A; no personal phone is exposed.
 */
const KontaktPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Section id="kontakt">
        <Container>
          <PageIntro title={t('contact:title')} intro={t('contact:intro')} />
          <div className="grid items-start gap-8 min-[960px]:grid-cols-2 min-[960px]:gap-12 [overflow-wrap:anywhere]">
            <div className="min-w-0 rounded-xl bg-sand p-6 md:p-8">
              <h2 className="text-h2 mb-6 text-ink">{t('contact:social_title')}</h2>
              <div className="flex flex-col min-[400px]:flex-row min-[400px]:flex-wrap gap-3">
                {socialLinks.facebook ? (
                  <Button
                    href={socialLinks.facebook}
                    external
                    variant="secondary"
                    className="min-w-0"
                  >
                    <FaFacebookF className="mr-2 shrink-0" aria-hidden="true" />
                    Facebook
                  </Button>
                ) : null}
                {socialLinks.discord ? (
                  <Button
                    href={socialLinks.discord}
                    external
                    variant="secondary"
                    className="min-w-0"
                  >
                    <FaDiscord className="mr-2 shrink-0" aria-hidden="true" />
                    Discord
                  </Button>
                ) : null}
              </div>
            </div>

            {people.length > 0 ? (
              <div className="min-w-0">
                <h2 className="text-h2 mb-6 text-ink">{t('contact:people_title')}</h2>
                <ul className="divide-y divide-border border-y border-border">
                  {people.map((person) => (
                    <li key={person.name} className="py-5">
                      <p className="font-semibold text-ink">{person.name}</p>
                      {person.ogsHandle ? (
                        <p className="text-muted-text">
                          {t('contact:ogs_label')}: {person.ogsHandle}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Container>
      </Section>

      <MeetingSection />
    </>
  );
};

export default KontaktPage;
