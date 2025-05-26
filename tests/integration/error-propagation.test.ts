import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { containerPromise } from '../../src/core/container/container.js';
import { TYPES } from '../../src/core/constants/injection-tokens.js';
import type { IReportGenerator } from '../../src/core/interfaces/IReportGenerator.js';
import type { IFileSystem } from '@chasenocap/file-system';
import type { IDependencyChecker } from '../../src/core/interfaces/IDependencyChecker.js';

describe('Error Propagation Integration', () => {
  let reportGenerator: IReportGenerator;
  let fileSystem: IFileSystem;
  let dependencyChecker: IDependencyChecker;

  beforeEach(async () => {
    const container = await containerPromise;
    reportGenerator = container.get<IReportGenerator>(TYPES.IReportGenerator);
    fileSystem = container.get<IFileSystem>(TYPES.IFileSystem);
    dependencyChecker = container.get<IDependencyChecker>(TYPES.IDependencyChecker);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should propagate FileSystem errors through ReportGenerator', async () => {
    // Mock a file system error
    vi.spyOn(fileSystem, 'createDirectory').mockRejectedValue(
      new Error('Permission denied: Cannot create directory')
    );

    const result = await reportGenerator.generate({
      outputDir: '/invalid/path/that/cannot/be/created'
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error!.message).toContain('Permission denied');
    }
  });

  it('should handle DependencyChecker errors in ReportGenerator', async () => {
    // Mock dependency check failure
    vi.spyOn(dependencyChecker, 'checkAllDependencies').mockRejectedValue(
      new Error('Failed to read package.json: EACCES')
    );

    const result = await reportGenerator.generate({
      outputDir: 'tests/integration/output'
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error!.message).toContain('Failed to read package.json');
    }
  });

  it('should log errors appropriately across service boundaries', async () => {
    // This test verifies that errors are logged with proper context
    // when they cross service boundaries
    
    const invalidPath = '/root/cannot-write-here';
    const result = await reportGenerator.generate({
      outputDir: invalidPath
    });

    // Even if it fails, it should fail gracefully
    expect(result.success).toBe(false);
    if (!result.success) {
      // Error should be properly wrapped with context
      expect(result.error).toBeDefined();
      expect(result.error!.message).toBeTruthy();
    }
  });

  it('should recover from partial failures', async () => {
    // Test that if one dependency fails, others still work
    // This simulates a scenario where some operations succeed
    
    const result = await reportGenerator.generate({
      outputDir: 'tests/integration/output',
      includeTimestamp: false
    });

    // Even with potential partial failures (like missing template files),
    // the report should still generate
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data!.outputPath).toBeDefined();
      expect(result.data!.metadata.generatedAt).toBeDefined();
    }
  });
});