// src/pages/ZacznijPage.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Section, Container } from '../components/primitives';
import MeetingSection from '../components/MeetingSection';
import RulesSection from '../components/RulesSection';
import { meetingInfo } from '../data/club';

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
    <div className="divide-y divide-border border border-border rounded-lg">
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
                className="flex w-full items-center justify-between px-5 py-4 text-left text-lg font-semibold text-ink hover:text-brand transition "
              >
                <span>{t(item.q, item.qVars)}</span>
                <span aria-hidden="true" className="ml-4 text-brand">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-5 pb-4 text-muted-text"
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-medium tracking-tight text-ink mb-3">
              {t('start:title')}
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-muted-text">{t('start:intro')}</p>
          </div>

          <RulesSection />

          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-medium mb-6 text-ink">
              {t('start:story_title')}
            </h2>
            <ol className="space-y-4">
              {storySteps.map((step, index) => (
                <li key={step.key} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white font-bold flex items-center justify-center"
                  >
                    {index + 1}
                  </span>
                  <p className="text-lg text-ink pt-1">{t(step.key, step.vars)}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-medium mb-6 text-ink">
              {t('start:faq_title')}
            </h2>
            <FaqAccordion />
          </div>
        </Container>
      </Section>

      <MeetingSection />
    </>
  );
};

export default ZacznijPage;
