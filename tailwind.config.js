/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'Arial', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        loot: {
          text: 'var(--loot-text)',
          muted: 'var(--loot-muted)',
          page: 'var(--loot-page)',
          card: 'var(--loot-card)',
          border: 'var(--loot-border)',
          selected: 'var(--loot-selected)',
          placeholder: 'var(--loot-placeholder)',
        },
      },
      boxShadow: {
        shell: '0 8px 32px rgb(24 24 24 / 0.04)',
      },
    },
  },
  plugins: [],
};
