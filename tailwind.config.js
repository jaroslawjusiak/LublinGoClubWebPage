/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Locked tokens for the Lubelski Klub Go brand aesthetic
        paper: '#fcfaf7', // Very light background (off-white)
        ink: '#1e293b', // Deep dark text colour
        'muted-text': '#64748b', // Secondary details and hints
        border: '#e2e8f0', // Light separator border
        kaya: '#a52a2a', // Warm accent (deep red/brown, the goban tone)
      },
      fontFamily: {
        sans: ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      // Deliberate typography scale. Prefer these semantic steps over one-off
      // font sizes (`text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body`,
      // `text-caption`). `display` is fluid from phone to desktop; the rest are
      // fixed mobile-first steps — pair them with `md:` prefixes to step up at
      // larger widths rather than inventing arbitrary values.
      fontSize: {
        display: ['clamp(2.25rem, 1.5rem + 4vw, 3.75rem)', { lineHeight: '1.05' }],
        h1: ['2.25rem', { lineHeight: '1.1' }],
        h2: ['1.875rem', { lineHeight: '1.2' }],
        h3: ['1.25rem', { lineHeight: '1.35' }],
        body: ['1rem', { lineHeight: '1.625' }],
        caption: ['0.875rem', { lineHeight: '1.4' }],
      },
    },
  },
  plugins: [],
};
