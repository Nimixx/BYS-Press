import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    // Use jsdom for DOM simulation (better Vue 3 support)
    environment: 'jsdom',

    // Set environment mode to avoid SSR
    env: {
      NODE_ENV: 'test',
    },

    // Include test files
    include: [
      'components/**/*.{test,spec}.{js,ts,jsx,tsx,vue}',
      'composables/**/*.{test,spec}.{js,ts,jsx,tsx,vue}',
      'lib/**/*.{test,spec}.{js,ts,jsx,tsx,vue}',
    ],

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
      ],
    },

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
      '@': path.resolve(__dirname, './lib'),
      '@components': path.resolve(__dirname, './components'),
      '@composables': path.resolve(__dirname, './composables'),
      '@utils': path.resolve(__dirname, './lib/utils'),
    },
  },
});
