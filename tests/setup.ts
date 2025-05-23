import 'reflect-metadata';
import { afterEach } from 'vitest';
import sinon from 'sinon';
// import { cleanupAllTests } from 'test-helpers';

// Restore all stubs after each test
afterEach(() => {
  sinon.restore();
  // cleanupAllTests();
});
