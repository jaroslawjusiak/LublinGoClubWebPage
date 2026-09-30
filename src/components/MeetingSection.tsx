// src/components/MeetingSection.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Section, Container, Button } from './primitives';
import { meetingInfo, clubConfig } from '../data/club';

/**
 * Shared meeting/location block. Renders every schedule and venue fact from
 * `src/data/club.ts` so Home and Contact never duplicate meeting details.
 */
const MeetingSection: React.FC = () => {
  const { t, i18n } = useTranslation();

  // OpenStreetMap respects a `locale` query parameter. Keep the map/directions
  // links in the same language as the page (Polish today, EN/UK later).
  const locale = (i18n.resolvedLanguage ?? i18n.language ?? 'pl').split('-')[0];
  const mapUrl = `${meetingInfo.mapUrl}&locale=${locale}`;
  const directionsUrl = `${meetingInfo.directionsUrl}&locale=${locale}`;

  return (
    <Section id="spotkania" className="bg-gray-50">
      <Container>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-ink">
          {t('meeting:heading')}
        </h2>

        <div className="max-w-2xl mx-auto text-center text-lg text-ink space-y-2 mb-8">
          <p className="text-2xl font-semibold">
            <span className="capitalize">{t('meeting:day_of_week')}</span>, {meetingInfo.startTime}–
            {meetingInfo.endTime}
          </p>
          <p>{meetingInfo.venueName}</p>
          <p>
            {meetingInfo.addressLine}, {meetingInfo.postalCode} {meetingInfo.city}
          </p>
          <p>
            {meetingInfo.roomNumber} — {meetingInfo.entranceHint}
          </p>
          {clubConfig.isFreeEntry ? (
            <p className="inline-block mt-2 px-3 py-1 bg-kaya/10 text-kaya font-semibold rounded-full">
              {t('meeting:free_entry')}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button href={mapUrl} external variant="secondary" className="py-3 px-6">
            {t('meeting:map_link')}
          </Button>
          <Button href={directionsUrl} external variant="primary" className="py-3 px-6">
            {t('meeting:directions_link')}
          </Button>
        </div>
      </Container>
    </Section>
  );
};

export default MeetingSection;
