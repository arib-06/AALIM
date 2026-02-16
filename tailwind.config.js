/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        aalim: {
          bg:      '#0a0a0a',
          sidebar: '#111111',
          surface: '#141414',
          card:    '#181818',
          hover:   '#1e1e14',
          border:  'rgba(255,255,255,0.07)',
          text:    '#f0e8d0',
          sub:     '#7a6e54',
          muted:   '#3a3428',
        },
        gold: {
          DEFAULT: '#c9a84c',
          hi:      '#e2c46a',
          lo:      'rgba(201,168,76,0.08)',
          border:  'rgba(201,168,76,0.2)',
          dim:     'rgba(201,168,76,0.5)',
        },
        rarity: {
          common:    '#7aad7a',
          rare:      '#5ba3e8',
          epic:      '#c084fc',
          legendary: '#c9a84c',
        },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", 'serif'],
        body:    ["'DM Sans'", 'sans-serif'],
        mono:    ["'JetBrains Mono'", 'monospace'],
      },
      animation: {
        shimmer:    'shimmer 4s ease infinite',
        fadeUp:     'fadeUp 0.45s ease forwards',
        pulse:      'pulse 1.2s ease infinite',
        badgeGlow:  'badgeGlow 2.5s ease infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        badgeGlow: {
          '0%,100%': { opacity: '0.55' },
          '50%':     { opacity: '1' },
        },
      },
      boxShadow: {
        gold:    '0 8px 32px rgba(201,168,76,0.22)',
        goldHov: '0 12px 48px rgba(201,168,76,0.4)',
      },
    },
  },
  plugins: [],
};
