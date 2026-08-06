/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        visited: {
          DEFAULT: '#2563EB', // Vibrant Blue
          light: '#DBEAFE',
          dark: '#1E40AF',
        },
        transit: {
          DEFAULT: '#10B981', // Emerald/Mint
          light: '#D1FAE5',
          dark: '#047857',
        },
        unvisited: {
          DEFAULT: '#E5E7EB', // Gray
          light: '#F3F4F6',
          dark: '#9CA3AF',
        }
      },
      fontFamily: {
        sans: [
          'Pretendard',
          'Noto Sans KR',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
