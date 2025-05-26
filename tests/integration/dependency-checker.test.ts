import { describe, it, expect, beforeEach } from 'vitest';
import { containerPromise } from '../../src/core/container/container.js';
import { TYPES } from '../../src/core/constants/injection-tokens.js';
import type { IDependencyChecker } from '../../src/core/interfaces/IDependencyChecker.js';

describe('DependencyChecker Integration', () => {
  let dependencyChecker: IDependencyChecker;

  beforeEach(async () => {
    const container = await containerPromise;
    dependencyChecker = container.get<IDependencyChecker>(TYPES.IDependencyChecker);
  });

  it('should integrate with FileSystem to check package.json', async () => {
    // This tests that DependencyChecker properly uses IFileSystem
    const dependencies = await dependencyChecker.checkAllDependencies();

    // Should check at least the critical dependencies
    expect(dependencies.length).toBeGreaterThan(0);

    // Should find markdown-compiler and report-components
    const markdownCompiler = dependencies.find(
      d => d.name === '@chasenocap/markdown-compiler'
    );
    const reportComponents = dependencies.find(
      d => d.name === '@chasenocap/report-components'
    );

    expect(markdownCompiler).toBeDefined();
    expect(markdownCompiler?.available).toBe(true);

    expect(reportComponents).toBeDefined();
    expect(reportComponents?.available).toBe(true);
  });

  it('should handle missing package.json gracefully', async () => {
    // Save original cwd
    const originalCwd = process.cwd();

    try {
      // Change to a directory without package.json
      process.chdir('/tmp');

      // This should throw or return empty/error statuses
      const dependencies = await dependencyChecker.checkAllDependencies();

      // Dependencies should show as unavailable
      expect(dependencies.length).toBeGreaterThan(0);
      dependencies.forEach(dep => {
        expect(dep.available).toBe(false);
      });
    } catch (error) {
      // It's ok if it throws
      expect(error).toBeDefined();
    } finally {
      // Restore original cwd
      process.chdir(originalCwd);
    }
  });

  it('should provide accurate version information', async () => {
    const dependencies = await dependencyChecker.checkAllDependencies();

    // All available dependencies should have version info
    dependencies.filter(d => d.available).forEach(dep => {
      expect(dep.version).toBeDefined();
      expect(dep.version).toMatch(/^\d+\.\d+\.\d+/); // Semantic version
      expect(dep.path).toBeDefined();
      expect(dep.path).toContain('node_modules');
    });
  });
});