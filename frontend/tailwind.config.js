/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        wine: {
          DEFAULT: '#7A1040',
          deep: '#5a0f2e',
          light: '#a0506a',
        },
        blush: {
          DEFAULT: '#FDF4F7',
          mid: '#F7E8EE',
          border: '#f0d8e2',
        },
        rose: '#c47090',
      },
      fontFamily: {
        script: ['"Great Vibes"', 'cursive'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}