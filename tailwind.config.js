/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}', './index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        display: ['Rampart One', 'cursive'],
      },
      colors: {
        primary: {
          DEFAULT: '#6A2A5B',
          link: '#A9629A',
          active: '#8C3E7C',
          dark: '#541F47',
          50: '#F7F2F6',
          100: '#ECDFE8',
          200: '#D8BFD1',
          300: '#C490B8',
          400: '#A9629A',
          500: '#8C3E7C',
          600: '#722F66',
          700: '#6A2A5B',
          800: '#541F47',
          900: '#3C1532',
          950: '#2A0E23',
        },
      },
    },
  },
  plugins: [],
}