import React from 'react';

/** Shared public-page title and existing localized introduction. */
const PageIntro: React.FC<{ title: string; intro: string }> = ({ title, intro }) => (
  <header className="min-w-0 mb-10 md:mb-12 [overflow-wrap:anywhere]">
    <h1 className="text-h1 text-ink max-w-[20ch] mb-5">{title}</h1>
    <p className="text-lead text-muted-text max-w-[60ch]">{intro}</p>
  </header>
);

export default PageIntro;
