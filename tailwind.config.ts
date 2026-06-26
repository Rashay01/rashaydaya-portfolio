import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#111418',
        satin: '#E2E8F0',
        ash: '#94A3B8',
        filament: '#FF5F1F',
        avocatus: '#2D3E33',
        signal: 'var(--signal)',
        live: 'var(--signal)',
        card: 'var(--card)',
        'card-deep': 'var(--card-deep)',
        'card-hover': 'var(--card-hover)',
      },
      screens: {
        xs: '475px',
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        calsans: ['var(--font-calsans)', 'Georgia', 'serif'],
        geist: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
