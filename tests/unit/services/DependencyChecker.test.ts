import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fs from 'fs/promises';
import { DependencyChecker } from '@/services/DependencyChecker';
import { MockLogger } from '@chasenocap/test-mocks';
import { TestEventBus } from '@chasenocap/event-system';

// Mock fs/promises
vi.mock('fs/promises');

describe('DependencyChecker', () => {
  let dependencyChecker: DependencyChecker;
  let mockLogger: MockLogger;
  let testEventBus: TestEventBus;

  beforeEach(() => {
    // Create mock logger and test event bus
    mockLogger = new MockLogger();
    testEventBus = new TestEventBus();

    // Create instance with mocks
    dependencyChecker = new DependencyChecker(mockLogger, testEventBus);

    // Reset all mocks
    vi.clearAllMocks();
    mockLogger.clear();
    testEventBus.clearEvents();
  });

  describe('checkDependency', () => {
    it('should return available status for existing dependency', async () => {
      const mockPackageJson = {
        name: 'test-package',
        version: '1.0.0',
      };

      // Mock successful file access
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockPackageJson));

      const result = await dependencyChecker.checkDependency('test-package');

      expect(result).toEqual({
        name: 'test-package',
        available: true,
        version: '1.0.0',
        path: expect.stringContaining('test-package'),
      });

      // The logger creates a child logger, check if any debug calls were made
      expect(mockLogger.calls.length).toBeGreaterThan(0);
      const debugCalls = mockLogger.calls.filter(call => call.level === 'debug');
      expect(debugCalls.length).toBeGreaterThan(0);

      // Verify events were emitted
      testEventBus
        .expectEvent('dependency.check.started')
        .toHaveBeenEmitted()
        .withPayload({ dependency: 'test-package' });

      testEventBus.expectEvent('dependency.check.completed').toHaveBeenEmitted();
    });

    it('should return unavailable status for missing dependency', async () => {
      // Mock file access failure
      vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'));

      const result = await dependencyChecker.checkDependency('missing-package');

      expect(result).toEqual({
        name: 'missing-package',
        available: false,
        error: 'ENOENT',
      });

      // The logger creates a child logger, check if any warn calls were made
      const warnCalls = mockLogger.calls.filter(call => call.level === 'warn');
      expect(warnCalls.length).toBeGreaterThan(0);

      // Verify failure event was emitted
      testEventBus
        .expectEvent('dependency.check.failed')
        .toHaveBeenEmitted()
        .withPayload(expect.objectContaining({ dependency: 'missing-package' }));
    });

    it('should handle invalid package.json', async () => {
      // Mock successful access but invalid JSON
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockResolvedValue('invalid json');

      const result = await dependencyChecker.checkDependency('invalid-package');

      expect(result.available).toBe(false);
      expect(result.error).toContain('JSON');
    });
  });

  describe('checkAllDependencies', () => {
    it('should check all configured dependencies', async () => {
      // Mock some available and some missing
      vi.mocked(fs.access)
        .mockResolvedValueOnce(undefined) // prompts exists
        .mockRejectedValueOnce(new Error('ENOENT')) // markdown-compiler missing
        .mockResolvedValueOnce(undefined); // report-components exists

      vi.mocked(fs.readFile).mockResolvedValue(
        JSON.stringify({
          name: 'test',
          version: '0.1.0',
        })
      );

      const results = await dependencyChecker.checkAllDependencies();

      expect(results).toHaveLength(3);
      expect(results.filter(r => r.available)).toHaveLength(2);
      expect(results.filter(r => !r.available)).toHaveLength(1);

      // Check that info was logged
      const infoCalls = mockLogger.calls.filter(call => call.level === 'info');
      expect(infoCalls.length).toBeGreaterThan(0);

      // Verify checkAll events
      testEventBus
        .expectEvent('dependency.checkAll.started')
        .toHaveBeenEmitted()
        .withPayload({ count: 3 });

      testEventBus.expectEvent('dependency.checkAll.completed').toHaveBeenEmitted();

      // Verify performance tracking
      testEventBus.expectEvent('performance.operation.completed').toHaveBeenEmitted();
    });

    it('should handle all dependencies missing', async () => {
      // Mock all dependencies missing
      vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'));

      const results = await dependencyChecker.checkAllDependencies();

      expect(results).toHaveLength(3);
      expect(results.every(r => !r.available)).toBe(true);

      // Check that info was logged for completion
      const infoCalls = mockLogger.calls.filter(call => call.level === 'info');
      expect(infoCalls.length).toBeGreaterThan(0);
    });
  });
});
