// src/pages/KontaktPage.tsx
import React from 'react';
import { Section } from '../components/primitives';

const KontaktPage: React.FC = () => {
  return (
    <Section id="kontakt">
      <div className="text-center py-10">
        <h2 className="text-4xl font-bold mb-6">Kontakt</h2>
        <p className="mb-8 text-lg">Tutaj trafi adres i dane kontaktowe.</p>
      </div>
    </Section>
  );
};

export default KontaktPage;