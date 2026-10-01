// src/pages/ZacznijPage.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Section, Container } from '../components/primitives';
import MeetingSection from '../components/MeetingSection';
import RulesSection from '../components/RulesSection';
import { meetingInfo } from '../data/club';
import PageIntro from '../components/PageIntro';

type Interpolation = Record<string, string>;

interface StoryStep {
  key: string;
  vars?: Interpolation;
}

interface FaqItem {
  q: string;
  a: string;
  qVars?: Interpolation;
  aVars?: Interpolation;
}

// Venue, address, room and entrance hint are interpolated from `club.ts` so a
// single change updates the meeting section AND these instructions together.
const storySteps: StoryStep[] = [
  {
    key: 'start:story_step_1',
    vars: { address: meetingInfo.addressLine, venue: meetingInfo.venueName },
  },
  {
    key: 'start:story_step_2',
    vars: { room: meetingInfo.roomNumber, hint: meetingInfo.entranceHint },
  },
  { key: 'start:story_step_3' },
  { key: 'start:story_step_4' },
  { key: 'start:story_step_5' },
  { key: 'start:story_step_6' },
];

const faqItems: FaqItem[] = [
  { q: 'start:faq_q_1', a: 'start:faq_a_1' },
  { q: 'start:faq_q_2', a: 'start:faq_a_2' },
  { q: 'start:faq_q_3', a: 'start:faq_a_3' },
  { q: 'start:faq_q_4', a: 'start:faq_a_4' },
  { q: 'start:faq_q_5', a: 'start:faq_a_5' },
  {
    q: 'start:faq_q_6',
    a: 'start:faq_a_6',
    qVars: { room: meetingInfo.roomNumber },
    aVars: {
      address: meetingInfo.addressLine,
      room: meetingInfo.roomNumber,
      hint: meetingInfo.entranceHint,
    },
  },
];

const FaqAccordion: React.FC = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-border border-y border-border [overflow-wrap:anywhere]">
      {faqItems.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `faq-button-${index}`;
        const panelId = `faq-panel-${index}`;

        return (
          <div key={item.q}>
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex min-h-11 w-full items-center justify-between gap-4 py-5 text-left text-body font-semibold text-ink hover:text-brand transition-colors"
              >
                <span className="min-w-0">{t(item.q, item.qVars)}</span>
                <span aria-hidden="true" className="shrink-0 text-brand">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-5 text-muted-text max-w-[65ch]"
            >
              {t(item.a, item.aVars)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Start Here: six-step first-visit story, an accessible FAQ, and the shared
 * meeting/location section so newcomers know exactly where and when to come.
 */
const ZacznijPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Section id="zacznij">
        <Container>
          <PageIntro title={t('start:title')} intro={t('start:intro')} />
          <RulesSection />

          <div className="rounded-xl bg-sand p-6 md:p-8 mb-10 md:mb-16 [overflow-wrap:anywhere]">
            <h2 className="text-h2 mb-8 text-ink">{t('start:story_title')}</h2>
            <ol className="grid gap-6 min-[960px]:grid-cols-2">
              {storySteps.map((step, index) => (
                <li key={step.key} className="flex min-w-0 gap-4">
                  <span
                    aria-hidden="true"
                    className="shrink-0 min-w-8 h-fit text-h3 font-semibold text-brand"
                  >
                    {index + 1}
                  </span>
                  <p className="min-w-0 text-ink">{t(step.key, step.vars)}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="max-w-3xl [overflow-wrap:anywhere]">
            <h2 className="text-h2 mb-6 text-ink">{t('start:faq_title')}</h2>
            <FaqAccordion />
          </div>
        </Container>
      </Section>

      <MeetingSection />
    </>
  );
};

export default ZacznijPage;
