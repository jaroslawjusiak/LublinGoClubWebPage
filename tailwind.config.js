/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F6F1E7',
        surface: '#FFFCF7',
        sand: '#E9DDC9',
        ink: '#252824',
        'muted-text': '#596158',
        border: '#CFC7B8',
        'border-control': '#596158',
        brand: '#29483F',
        'brand-hover': '#203A32',
        accent: '#B34C38',
        'on-brand': '#FFF9EF',
      },
      fontFamily: {
        sans: ['Noto Sans', 'system-ui', 'Arial', 'sans-serif'],
        serif: ['Noto Serif', 'Georgia', 'serif'],
      },
      // Deliberate typography scale. Prefer these semantic steps over one-off
      // font sizes (`text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body`,
      // `text-caption`). `display` is fluid from phone to desktop; the rest are
      // fixed mobile-first steps — pair them with `md:` prefixes to step up at
      // larger widths rather than inventing arbitrary values.
      fontSize: {
        display: ['clamp(2.25rem, 1.5rem + 3vw, 4rem)', { lineHeight: '1.1' }],
        h1: ['clamp(2rem, 1.5rem + 2vw, 3rem)', { lineHeight: '1.15' }],
        h2: ['clamp(1.625rem, 1.375rem + 1vw, 2.25rem)', { lineHeight: '1.2' }],
        h3: ['1.25rem', { lineHeight: '1.3' }],
        lead: ['clamp(1.125rem, 1rem + 0.5vw, 1.25rem)', { lineHeight: '1.55' }],
        body: ['1rem', { lineHeight: '1.65' }],
        caption: ['0.875rem', { lineHeight: '1.45' }],
      },
    },
  },
  plugins: [],
};
