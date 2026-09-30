// src/components/RulesSection.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

interface RuleDiagram {
  src: string;
  width: number;
  height: number;
  altKey: string;
}

interface RuleStep {
  titleKey: string;
  bodyKey: string;
  diagram?: RuleDiagram;
}

/**
 * Static diagrams from the legacy `zasady.html` (an interactive board is a
 * deferred Tier C feature, so the page uses the original figures with real,
 * descriptive alt text). Steps and prose live in the `rules` i18n namespace.
 */
const ruleSteps: RuleStep[] = [
  { titleKey: 'rules:step_1_title', bodyKey: 'rules:step_1_body' },
  {
    titleKey: 'rules:step_2_title',
    bodyKey: 'rules:step_2_body',
    diagram: {
      src: '/assets/zasady/oddechy.jpg',
      width: 703,
      height: 706,
      altKey: 'rules:step_2_alt',
    },
  },
  {
    titleKey: 'rules:step_3_title',
    bodyKey: 'rules:step_3_body',
    diagram: {
      src: '/assets/zasady/atari.jpg',
      width: 705,
      height: 703,
      altKey: 'rules:step_3_alt',
    },
  },
  {
    titleKey: 'rules:step_4_title',
    bodyKey: 'rules:step_4_body',
    diagram: {
      src: '/assets/zasady/rozgrywka.jpg',
      width: 825,
      height: 820,
      altKey: 'rules:step_4_alt',
    },
  },
  {
    titleKey: 'rules:step_5_title',
    bodyKey: 'rules:step_5_body',
    diagram: {
      src: '/assets/zasady/oczy.jpg',
      width: 820,
      height: 819,
      altKey: 'rules:step_5_alt',
    },
  },
  {
    titleKey: 'rules:step_6_title',
    bodyKey: 'rules:step_6_body',
    diagram: {
      src: '/assets/zasady/oczy.jpg',
      width: 820,
      height: 819,
      altKey: 'rules:step_6_alt',
    },
  },
];

/**
 * The Go rules in six short steps, with the original static diagrams.
 */
const RulesSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div id="zasady" className="max-w-3xl mx-auto mb-16">
      <h2 className="text-2xl md:text-3xl font-medium mb-4 text-ink">{t('rules:title')}</h2>
      <p className="text-lg text-muted-text mb-8">{t('rules:intro')}</p>

      <ol className="space-y-10">
        {ruleSteps.map((step, index) => (
          <li key={step.titleKey}>
            <h3 className="text-xl font-semibold mb-2 text-ink">
              <span className="text-accent">{index + 1}.</span> {t(step.titleKey)}
            </h3>
            <p className="text-ink">{t(step.bodyKey)}</p>
            {step.diagram ? (
              <img
                src={step.diagram.src}
                alt={t(step.diagram.altKey)}
                width={step.diagram.width}
                height={step.diagram.height}
                loading="lazy"
                className="mt-4 rounded-lg border border-border w-full max-w-sm h-auto"
              />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RulesSection;
