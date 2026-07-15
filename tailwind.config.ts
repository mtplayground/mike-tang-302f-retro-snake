import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        arcade: ['var(--font-arcade)', 'monospace'],
      },
      colors: {
        cabinet: '#050712',
        phosphor: '#7CFF6B',
        hazard: '#FF4D7D',
      },
    },
  },
  plugins: [],
} satisfies Config;
