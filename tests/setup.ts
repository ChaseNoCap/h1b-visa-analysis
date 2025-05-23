import 'reflect-metadata';
import { afterEach } from 'vitest';
import sinon from 'sinon';

// Restore all stubs after each test
afterEach(() => {
  sinon.restore();
});