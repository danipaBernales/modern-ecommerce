/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#A21CAF',
        secondary: '#FACC15',
        background: '#F8FAFC',
        darkBackground: '#1E293B',
        text: '#1E293B',
        textLight: '#CBD5E1',
        borderColor: '#E2E8F0',
        success: '#10B981',
        error: '#EF4444',
        magenta: {
          50: '#FCE7FB',
          100: '#F9D0F7',
          200: '#F3A0EF',
          300: '#ED71E7',
          400: '#E741DF',
          500: '#D946EF',
          600: '#C026D3',
          700: '#A21CAF',
          800: '#86198F',
          900: '#701A75',
        },
        yellow: {
          50: '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: '#EAB308',
          600: '#CA8A04',
          700: '#A16207',
          800: '#854D0E',
          900: '#713F12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        72: '18rem',
        84: '21rem',
        96: '24rem',
      },
      borderRadius: {
        xl: '1rem',
      },
      boxShadow: {
        'custom-light': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'custom-dark': '0 4px 8px rgba(0, 0, 0, 0.2)',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};