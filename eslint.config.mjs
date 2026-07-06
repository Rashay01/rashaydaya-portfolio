import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default tseslint.config(
  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  // React + hooks
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed with Next.js
      'react/prop-types': 'off',         // TypeScript handles this
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // Project-specific overrides
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // React Compiler rules — not applicable to React 18 code without the compiler
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      // react-three-fiber's useThree() returns the live gl/scene/camera instances;
      // mutating them imperatively (tone mapping, scene.environment, composer render)
      // is the documented R3F pattern, not a React state-immutability violation.
      'react-hooks/immutability': 'off',
    },
  },

  // react-three-fiber JSX uses custom intrinsics (position, rotation-x, args,
  // geometry, material, intensity, distance, decay, etc.) that aren't real DOM
  // attributes; react/no-unknown-property doesn't know the r3f prop surface.
  {
    files: ['src/components/three/**/*.{ts,tsx}'],
    rules: {
      'react/no-unknown-property': 'off',
    },
  },

  // Relax rules in test files
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // Ignore build output, config files, and generated files
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      '*.config.{js,mjs,cjs,ts}',
      'src/app/icon.tsx',
      'src/app/apple-icon.tsx',
      'src/app/opengraph-image.tsx',
    ],
  },
)
