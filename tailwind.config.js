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
    },
  },
  plugins: [],
};
