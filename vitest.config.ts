import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules',
        'tests',
        'dist',
        'packages/*/tests',
        'packages/*/dist',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
      ],
    },
  },
});