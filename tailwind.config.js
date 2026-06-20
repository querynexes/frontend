/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary':    '#050A07',
        'bg-secondary':  '#0B1410',
        'bg-surface':    '#111C16',
        'bg-elevated':   '#16241D',
        'green-neon':    '#00FF85',
        'green-stable':  '#00D46A',
        'green-deep':    '#00A854',
        'green-dark':    '#007A3D',
        'glow-cyan':     '#00FFC3',
        'text-primary':  '#E6F4EC',
        'text-secondary':'#A7B7AE',
        'text-muted':    '#6C7C73',
        'text-disabled': '#3E4D45',
        'border-default':'#1E2E26',
        'border-strong': '#2A3F34',
      },
      fontFamily: {
        'grotesk': ['Space Grotesk', 'sans-serif'],
        'mono':    ['JetBrains Mono', 'monospace'],
        'body':    ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
