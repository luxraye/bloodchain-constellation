/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        slate: {
          900: '#020617',
          800: '#0f172a',
          700: '#1e293b',
        },
        neon: {
          cyan: '#22d3ee',
          green: '#22c55e',
          red: '#f97373',
        },
      },
    },
  },
  plugins: [],
}

