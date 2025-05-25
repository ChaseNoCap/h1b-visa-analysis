import 'reflect-metadata';
import { afterEach, vi } from 'vitest';
// import { cleanupAllTests } from '@chasenocap/test-helpers';

// Restore all mocks after each test
afterEach(() => {
  vi.restoreAllMocks();
  // cleanupAllTests();
});
