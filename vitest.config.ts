import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    // Use jsdom for DOM simulation (better Svelte 5 support)
    environment: 'jsdom',

    // Set environment mode to avoid SSR
    env: {
      NODE_ENV: 'test',
    },

    // Include test files
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx,svelte}'],

    // Exclude patterns
    exclude: ['node_modules', 'dist', 'vendor'],

    // Global test setup
    globals: true,

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'vendor/',
        '**/*.config.{js,ts}',
        '**/*.d.ts',
        '**/test-utils/**',
      ],
    },

    // Setup files
    setupFiles: ['./src/test-utils/setup.ts'],

    // Test timeout
    testTimeout: 10000,

    // Mock CSS imports
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/js/utils'),
    },
  },
});
