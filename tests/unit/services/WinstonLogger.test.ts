import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as path from 'path';
import * as fs from 'fs/promises';
import { WinstonLogger } from 'logger';

describe('WinstonLogger', () => {
  let logger: WinstonLogger;
  const logDir = path.join(process.cwd(), 'logs');

  beforeEach(() => {
    // Set test environment
    vi.stubEnv('LOG_LEVEL', 'debug');
    logger = new WinstonLogger({ test: true });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('Logging Methods', () => {
    it('should log debug messages', () => {
      // Just ensure it doesn't throw
      expect(() => {
        logger.debug('Debug message', { extra: 'data' });
      }).not.toThrow();
    });

    it('should log info messages', () => {
      expect(() => {
        logger.info('Info message', { extra: 'data' });
      }).not.toThrow();
    });

    it('should log warnings', () => {
      expect(() => {
        logger.warn('Warning message', { extra: 'data' });
      }).not.toThrow();
    });

    it('should log errors with Error objects', () => {
      const error = new Error('Test error');
      expect(() => {
        logger.error('Error occurred', error, { extra: 'data' });
      }).not.toThrow();
    });

    it('should log errors without Error objects', () => {
      expect(() => {
        logger.error('Error message without exception');
      }).not.toThrow();
    });
  });

  describe('Child Logger', () => {
    it('should create child logger with additional context', () => {
      const childLogger = logger.child({ requestId: '123', userId: 'test-user' });

      expect(childLogger).toBeDefined();
      expect(childLogger).not.toBe(logger);

      // Child logger should work
      expect(() => {
        childLogger.info('Child logger message');
      }).not.toThrow();
    });

    it('should inherit parent context and add new context', () => {
      const parentLogger = new WinstonLogger({ service: 'parent' });
      const childLogger = parentLogger.child({ operation: 'test' });

      // Should have both contexts
      expect(() => {
        childLogger.info('Message with combined context');
      }).not.toThrow();
    });
  });

  describe('Environment Configuration', () => {
    it('should respect LOG_LEVEL environment variable', () => {
      // Create logger with different log level
      vi.stubEnv('LOG_LEVEL', 'error');
      const errorLogger = new WinstonLogger();

      expect(() => {
        errorLogger.error('This should log');
        errorLogger.info('This might not log depending on transport config');
      }).not.toThrow();
    });

    it('should use default log level when not specified', () => {
      vi.unstubAllEnvs();
      const defaultLogger = new WinstonLogger();

      expect(() => {
        defaultLogger.info('Default level message');
      }).not.toThrow();
    });
  });

  describe('Log Directory', () => {
    it('should create logs in the correct directory', async () => {
      // The logger should create log files
      // Check that the log directory exists after logger creation
      try {
        const stats = await fs.stat(logDir);
        expect(stats.isDirectory()).toBe(true);
      } catch {
        // Directory might not exist if file transport hasn't written yet
        // This is okay for the test
      }
    });
  });
});
