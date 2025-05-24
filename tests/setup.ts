import 'reflect-metadata';
import { afterEach, vi } from 'vitest';
// import { cleanupAllTests } from 'test-helpers';

// Restore all mocks after each test
afterEach(() => {
  vi.restoreAllMocks();
  // cleanupAllTests();
});
