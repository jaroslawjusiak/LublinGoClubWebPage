// src/components/MeetingSection.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LuClock, LuMap, LuMapPin } from 'react-icons/lu';
import { Section, Container, Button } from './primitives';
import { meetingInfo, clubConfig } from '../data/club';
import VenueLink from './VenueLink';

/**
 * Shared meeting/location block. Renders every schedule and venue fact from
 * `src/data/club.ts` so Home and Contact never duplicate meeting details.
 */
const MeetingSection: React.FC<{ intro?: 'default' | 'home' }> = ({ intro = 'default' }) => {
  const { t, i18n } = useTranslation();

  // OpenStreetMap respects a `locale` query parameter. Keep the map/directions
  // links in the same language as the page (Polish today, EN/UK later).
  const locale = (i18n.resolvedLanguage ?? i18n.language ?? 'pl').split('-')[0];
  const mapUrl = `${meetingInfo.mapUrl}&locale=${locale}`;
  const directionsUrl = `${meetingInfo.directionsUrl}&locale=${locale}`;

  return (
    <Section id="spotkania" className="scroll-mt-8 min-[1100px]:scroll-mt-28">
      <Container className="grid items-start gap-8 min-[960px]:grid-cols-[45fr_55fr] min-[960px]:gap-10">
        <div className="min-w-0 [overflow-wrap:anywhere]">
          <h2 className="text-h2 text-ink mb-6">
            {t(intro === 'home' ? 'homepage:meeting_heading' : 'meeting:heading')}
          </h2>
          <p className="text-lead text-muted-text max-w-[45ch]">
            {t(intro === 'home' ? 'homepage:meeting_text' : 'oklubie:typical_text')}
          </p>
        </div>
        <div className="min-w-0 rounded-xl bg-sand p-[20px] min-[400px]:p-6 md:p-8 [overflow-wrap:anywhere]">
          <div className="flex flex-col min-[400px]:flex-row items-start gap-3 pb-5 border-b border-border">
            <LuMapPin
              aria-hidden="true"
              focusable="false"
              className="mt-1 h-[24px] w-[24px] shrink-0 text-accent"
            />
            <div className="min-w-0">
              <p className="text-h3 font-semibold text-ink mb-2">
                <VenueLink />
              </p>
              <p className="text-muted-text">
                {meetingInfo.addressLine}, {meetingInfo.postalCode} {meetingInfo.city}
              </p>
              <p className="mt-2 text-muted-text">
                {meetingInfo.roomNumber} — {meetingInfo.entranceHint}
              </p>
            </div>
          </div>
          <div className="flex flex-col min-[400px]:flex-row items-start gap-3 py-5 border-b border-border">
            <LuClock
              aria-hidden="true"
              focusable="false"
              className="mt-1 h-[24px] w-[24px] shrink-0 text-accent"
            />
            <div className="min-w-0">
              <p className="text-h3 font-semibold text-ink">
                <span className="capitalize">{t('meeting:day_of_week')}</span>,{' '}
                {meetingInfo.startTime}–{meetingInfo.endTime}
              </p>
              {clubConfig.isFreeEntry ? (
                <p className="mt-2 text-brand font-semibold">{t('meeting:free_entry')}</p>
              ) : null}
            </div>
          </div>
          <div className="mt-5 flex flex-col min-[400px]:flex-row items-start gap-3">
            <LuMap
              aria-hidden="true"
              focusable="false"
              className="mt-2.5 h-[24px] w-[24px] shrink-0 text-accent"
            />
            <div className="flex w-full min-w-0 flex-1 flex-col min-[400px]:flex-row min-[400px]:flex-wrap gap-3">
              <Button
                href={directionsUrl}
                external
                variant="primary"
                className="min-w-0 max-[399px]:px-[16px]"
              >
                {t('meeting:directions_link')}
              </Button>
              <Button
                href={mapUrl}
                external
                variant="secondary"
                className="min-w-0 max-[399px]:px-[16px]"
              >
                {t('meeting:map_link')}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default MeetingSection;
