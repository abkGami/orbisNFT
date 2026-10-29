/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#010828',
        navy: {
          DEFAULT: '#010828',
          2: '#04103a',
          3: '#071a52',
        },
        cream: '#EFF4FF',
        neon: '#6FFF00',
        orbit: {
          from: '#b724ff',
          to: '#7c3aed',
        },
      },
      fontFamily: {
        grotesk: ['Anton', 'Impact', 'Haettenschweiler', 'sans-serif'],
        condiment: ['Condiment', 'Brush Script MT', 'cursive'],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'monospace',
        ],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(.22,1,.36,1)',
        orbit: 'cubic-bezier(.45,.05,.55,.95)',
      },
      transitionDuration: {
        fast: '180ms',
        base: '700ms',
        slow: '1200ms',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(-50%,0,0)' },
        },
        'marquee-reverse': {
          from: { transform: 'translate3d(-50%,0,0)' },
          to: { transform: 'translate3d(0,0,0)' },
        },
        floaty: {
          '0%': { transform: 'translateY(-10px) rotate(-3deg)' },
          '100%': { transform: 'translateY(10px) rotate(3deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 10px 24px -12px rgba(183,36,255,.55)' },
          '50%': { boxShadow: '0 12px 34px -8px rgba(183,36,255,.9)' },
        },
        shine: {
          from: { transform: 'translateX(-120%)' },
          to: { transform: 'translateX(320%)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.45', transform: 'scale(.8)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'marquee-reverse': 'marquee-reverse 40s linear infinite',
        floaty: 'floaty 6s cubic-bezier(.45,.05,.55,.95) infinite alternate',
        'glow-pulse': 'glow-pulse 2.4s cubic-bezier(.45,.05,.55,.95) infinite',
        shine: 'shine 2.8s cubic-bezier(.45,.05,.55,.95) infinite',
        'pulse-dot': 'pulse-dot 1.8s cubic-bezier(.45,.05,.55,.95) infinite',
      },
    },
  },
  plugins: [],
}
