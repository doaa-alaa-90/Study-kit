/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1649C8', dark: '#123DA6' },
        secondary: '#101B4B',
        accent: '#079BFA',
        aqua: '#55D6F2',
        gold: '#FFC247',
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        field: 'rgb(var(--field) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
      },
      boxShadow: {
        card: '0 1px 2px rgb(16 27 75 / 0.04), 0 12px 30px -16px rgb(16 58 130 / 0.18)',
        lift: '0 4px 8px rgb(16 27 75 / 0.06), 0 24px 48px -18px rgb(22 73 200 / 0.28)',
      },
    },
  },
  plugins: [],
};
