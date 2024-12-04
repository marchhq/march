/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx}', './src/renderer/index.html'],
  theme: {
    extend: {
      colors: {
        foreground: 'rgba(var(--foreground))',
        background: {
          DEFAULT: 'rgba(var(--background))',
          hover: 'rgba(var(--background-hover))',
          active: 'rgba(var(--background-active))'
        },
        primary: {
          DEFAULT: 'rgba(var(--primary))',
          foreground: 'rgba(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'rgba(var(--secondary))',
          foreground: 'rgba(var(--secondary-foreground))'
        },
        tertiary: {
          DEFAULT: 'rgba(var(--tertiary))',
          foreground: 'rgba(var(--tertiary-foreground))'
        },
        border: {
          DEFAULT: 'rgba(var(--border))'
        },
        danger: {
          DEFAULT: 'rgba(var(--danger))',
          foreground: 'rgba(var(--danger-foreground))'
        },
        muted: '#9C9C9D',
        'gray-color': '#676767',
        'button-stroke': '#D0D0D0'
      }
    },
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui']
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('tailwindcss-animate')]
}
