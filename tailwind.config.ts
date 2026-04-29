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
      fontSize: {
        'display': ['clamp(2.5rem, 6vw, 6rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-xl': ['clamp(4rem, 10vw, 10rem)', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        'deploy': ['15vw', { lineHeight: '0.85', letterSpacing: '-0.04em' }],
      },
      letterSpacing: {
        'logo': '-0.06em',
        'widest-mono': '0.08em',
      },
      backgroundImage: {
        'noise': "url('/noise.png')",
      },
    },
  },
  plugins: [],
}

export default config
