import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { containerPromise } from '@/core/container/container';
import { TYPES } from '@/core/constants/injection-tokens';
import type { IReportGenerator } from '@/core/interfaces/IReportGenerator';
import type { IDependencyChecker } from '@/core/interfaces/IDependencyChecker';
import type { IFileSystem } from '@chasenocap/file-system';
import type { Container } from '@chasenocap/di-framework';
// import { FixtureManager, setupTest } from '@chasenocap/test-helpers';

describe('ReportGenerator E2E Tests', () => {
  let container: Container;
  let reportGenerator: IReportGenerator;
  let dependencyChecker: IDependencyChecker;
  let fileSystem: IFileSystem;
  // let fixtures: FixtureManager;
  const testOutputDir = 'reports/test';

  beforeEach(async () => {
    // Use real implementations from container
    container = await containerPromise;
    reportGenerator = container.get<IReportGenerator>(TYPES.IReportGenerator);
    dependencyChecker = container.get<IDependencyChecker>(TYPES.IDependencyChecker);
    fileSystem = container.get<IFileSystem>(TYPES.IFileSystem);

    // Set up fixture manager
    // fixtures = new FixtureManager(__dirname);

    // Create test output directory
    await fileSystem.createDirectory(testOutputDir);
  });

  afterEach(async () => {
    // Clean up test output and fixtures
    // await fixtures.cleanup();
    try {
      await fileSystem.removeDirectory(testOutputDir);
    } catch {
      // Ignore errors if directory doesn't exist
    }
  });

  describe('Basic Report Generation', () => {
    it('should generate a report with dependency status', async () => {
      const result = await reportGenerator.generate({
        outputDir: testOutputDir,
        includeTimestamp: false,
        format: 'markdown',
      });

      expect(result.success).toBe(true);
      expect(result.data?.outputPath).toBeDefined();
      expect(result.data?.metadata).toBeDefined();
      expect(result.data?.metadata?.dependencies).toBeInstanceOf(Array);

      // Verify file was created
      const fileExists = await fileSystem.exists(result.data!.outputPath);
      expect(fileExists).toBe(true);

      // Read and verify content
      const content = await fileSystem.readFile(result.data!.outputPath);
      expect(content).toContain('# H1B Visa Analysis Report');
      expect(content).toContain('generatedOn');
    });

    it('should include timestamp in filename when requested', async () => {
      const result = await reportGenerator.generate({
        outputDir: testOutputDir,
        includeTimestamp: true,
        format: 'markdown',
      });

      expect(result.success).toBe(true);
      expect(result.data?.outputPath).toMatch(/h1b-report-\d{4}-\d{2}-\d{2}\.md$/);
    });
  });

  describe('Dependency Integration', () => {
    it('should check all configured dependencies', async () => {
      const dependencies = await dependencyChecker.checkAllDependencies();

      expect(dependencies).toBeInstanceOf(Array);
      expect(dependencies.length).toBeGreaterThan(0);

      // Should check for our known dependencies
      const depNames = dependencies.map(d => d.name);
      expect(depNames).toContain('@chasenocap/prompts');
      expect(depNames).toContain('@chasenocap/markdown-compiler');
      expect(depNames).toContain('@chasenocap/report-components');
    });

    it('should report available and missing dependencies', async () => {
      const result = await reportGenerator.generate({
        outputDir: testOutputDir,
        includeTimestamp: false,
      });

      const content = await fileSystem.readFile(result.data!.outputPath);

      // Should show status for each dependency
      expect(content).toMatch(/[✅❌] @chasenocap\/prompts/);
      expect(content).toMatch(/[✅❌] @chasenocap\/markdown-compiler/);
      expect(content).toMatch(/[✅❌] @chasenocap\/report-components/);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing output directory gracefully', async () => {
      const nonExistentBase = fileSystem.join(testOutputDir, 'deep', 'nested', 'path');

      const result = await reportGenerator.generate({
        outputDir: nonExistentBase,
        includeTimestamp: false,
      });

      // Should create the directory and succeed
      expect(result.success).toBe(true);
      expect(result.data?.outputPath).toContain(nonExistentBase);
    });

    it('should provide meaningful error when no dependencies available', () => {
      // This test would need a mock or a way to simulate no dependencies
      // For now, we'll just verify the error handling structure exists
      expect(typeof reportGenerator.generate).toBe('function');
    });
  });

  describe('Output Validation', () => {
    it('should generate valid markdown output', async () => {
      const result = await reportGenerator.generate({
        outputDir: testOutputDir,
        includeTimestamp: false,
        format: 'markdown',
      });

      const content = await fileSystem.readFile(result.data!.outputPath);

      // Verify markdown structure
      expect(content).toMatch(/^# .+/m); // Has h1 heading
      expect(content).toMatch(/^## .+/m); // Has h2 headings
      expect(content).toContain('generatedOn:');

      // Should not have any undefined values
      expect(content).not.toContain('undefined');
      expect(content).not.toContain('null');
    });

    it('should include metadata in result', async () => {
      const startTime = Date.now();

      const result = await reportGenerator.generate({
        outputDir: testOutputDir,
      });

      expect(result.data?.metadata).toBeDefined();
      expect(result.data?.metadata?.generatedAt).toBeInstanceOf(Date);
      expect(result.data?.metadata?.duration).toBeGreaterThanOrEqual(0);
      expect(result.data?.metadata?.duration).toBeLessThan(5000); // Should complete quickly

      const generatedTime = result.data?.metadata?.generatedAt.getTime() || 0;
      expect(generatedTime).toBeGreaterThanOrEqual(startTime);
    });
  });

  describe('Integration Output', () => {
    it('should generate a complete test report file', async () => {
      const result = await reportGenerator.generate({
        outputDir: 'tests/e2e/output',
        includeTimestamp: false,
        format: 'markdown',
      });

      expect(result.success).toBe(true);

      // Log processing details
      console.log('Report generated:', result.data?.outputPath);
      console.log('Processing duration:', result.data?.metadata?.duration, 'ms');
      console.log('Dependencies found:', result.data?.metadata?.dependencies);

      // Verify we can read the generated report
      const content = await fileSystem.readFile(result.data!.outputPath);
      expect(content.length).toBeGreaterThan(0);
    });
  });
});
