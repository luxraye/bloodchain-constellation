/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        oled: '#030712',
        surface: {
          50:  '#0f1117',
          100: '#161820',
          200: '#1e2130',
          300: '#252840',
        },
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseSlow: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } },
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out both',
        'pulse-slow': 'pulseSlow 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
