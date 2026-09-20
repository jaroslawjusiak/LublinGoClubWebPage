import React from 'react';
import { useTranslation } from 'react-i18next';
import { Section, Container, Card, Button } from '../components/primitives';
import { meetingInfo } from '../data/club';

/**
 * @description Page guiding new visitors through getting started with Go at the club.
 */
const ZacznijPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Section id="zacznij">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight text-ink mb-3">
            {t('common:menu.start')}
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-muted-text">
            Prosty przewodnik, który pomoże Ci dołączyć do społeczności i zacząć grać.
          </p>
        </div>

        <div className="space-y-10 max-w-[900px] mx-auto">
          <Card>
            <h3 className="text-2xl font-semibold mb-3 text-ink">Krok 1: Naucz się podstaw</h3>
            <p className="text-muted-text">
              Nie musisz być ekspertem. Przygotowaliśmy zasoby i warsztaty dla początkujących —
              zaczniemy od podstawowych zasad i terminologii gry.
            </p>
          </Card>

          <Card>
            <h3 className="text-2xl font-semibold mb-3 text-ink">Krok 2: Pierwsza partia</h3>
            <p className="text-muted-text">
              Spotykamy się w {meetingInfo.venueName} ({meetingInfo.addressLine},{' '}
              {meetingInfo.roomNumber}) w każdą {meetingInfo.dayOfWeek} od {meetingInfo.startTime} do{' '}
              {meetingInfo.endTime}. Sprzęt zapewniamy na miejscu.
            </p>
          </Card>

          <Card>
            <h3 className="text-2xl font-semibold mb-3 text-ink">Krok 3: Dołącz do społeczności</h3>
            <p className="text-muted-text">
              Spotkania to idealna okazja, aby poznać innych pasjonatów Go. Jesteśmy życzliwi i zawsze
              chętnie witamy nowych członków.
            </p>
          </Card>

          <div className="text-center pt-4">
            <Button to="/kontakt" variant="primary" className="px-8 py-3 text-lg">
              {t('common:menu.events')}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default ZacznijPage;
