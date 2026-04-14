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
        /** Legacy names mapped for gradual migration in AppCard / modals */
        oled: '#f8fafc',
        surface: {
          50: '#ffffff',
          100: '#f8fafc',
          200: '#f1f5f9',
          300: '#e2e8f0',
        },
        medical: {
          page: '#f0f9ff',
          pageDeep: '#e0f2fe',
          accent: '#0284c7',
          accentSoft: '#bae6fd',
        },
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
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
