/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        head: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      colors: {
        bg: '#FAFAF7',
        paper: '#F5F0E8',
        border: '#E5DED0',
        muted: '#B0A898',
        soft: '#7A7A7A',
        body: '#1A1A1A',
        green: { DEFAULT: '#2D6A4F', light: '#52B788', pale: '#D8F3DC' },
      },
    },
  },
  plugins: [],
}
