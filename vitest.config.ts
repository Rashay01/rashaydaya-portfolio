import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    exclude: ['node_modules/**', 'e2e/**', 'dist/**'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        'src/test/**',
        '**/*.config.*',
        '**/*.d.ts',
        'src/app/layout.tsx',
        'src/app/robots.ts',
        'src/app/sitemap.ts',
        'src/app/icon.tsx',
        'src/app/apple-icon.tsx',
        'src/app/opengraph-image.tsx',
        'src/emails/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
