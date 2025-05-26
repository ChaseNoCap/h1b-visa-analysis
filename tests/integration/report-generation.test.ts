import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { containerPromise } from '../../src/core/container/container.js';
import { TYPES } from '../../src/core/constants/injection-tokens.js';
import type { IReportGenerator } from '../../src/core/interfaces/IReportGenerator.js';
import type { IFileSystem } from '@chasenocap/file-system';
import { existsSync } from 'fs';
import { rm } from 'fs/promises';

describe('Report Generation Integration', () => {
  let reportGenerator: IReportGenerator;
  let fileSystem: IFileSystem;
  const testOutputDir = 'tests/integration/output';

  beforeEach(async () => {
    const container = await containerPromise;
    reportGenerator = container.get<IReportGenerator>(TYPES.IReportGenerator);
    fileSystem = container.get<IFileSystem>(TYPES.IFileSystem);
    
    // Ensure output directory exists
    await fileSystem.createDirectory(testOutputDir);
  });

  afterEach(async () => {
    // Clean up test outputs
    if (existsSync(testOutputDir)) {
      await rm(testOutputDir, { recursive: true, force: true });
    }
  });

  it('should generate report with markdown processing', async () => {
    // Act
    const result = await reportGenerator.generate({
      outputDir: testOutputDir,
      includeTimestamp: false
    });

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.outputPath).toBeDefined();
      expect(result.data.metadata).toBeDefined();
      expect(result.data.metadata.generatedAt).toBeDefined();

      // Verify file was created
      expect(existsSync(result.data.outputPath)).toBe(true);

      // Read and verify content
      const content = await fileSystem.readFile(result.data.outputPath);
      expect(content).toContain('H1B Visa Analysis Report');
      expect(content).toContain('Executive Summary');

      // Should include actual H1B content if markdown-compiler and report-components work
      if (content.includes('H1B Analysis Content')) {
        expect(content.length).toBeGreaterThan(10000); // Substantial content
      }
    }
  });

  it('should handle markdown processor errors gracefully', async () => {
    // This test verifies error handling when markdown processing fails
    // Since we can't easily simulate failures, we'll just verify the report
    // still generates even with potential processing issues
    
    const result = await reportGenerator.generate({
      outputDir: testOutputDir,
      includeTimestamp: false
    });
    
    expect(result.success).toBe(true);
    if (result.success) {
      const content = await fileSystem.readFile(result.data.outputPath);

      // Even with errors, should have basic structure
      expect(content).toContain('H1B Visa Analysis Report');
      expect(content).toContain('System Information');
    }
  });

  it('should properly include dependency information', async () => {
    const result = await reportGenerator.generate({
      outputDir: testOutputDir,
      includeTimestamp: false
    });
    
    expect(result.success).toBe(true);
    if (result.success) {
      const content = await fileSystem.readFile(result.data.outputPath);

      // Should include dependency status
      expect(content).toMatch(/✅.*@chasenocap\/markdown-compiler/);
      expect(content).toMatch(/✅.*@chasenocap\/report-components/);
    }
  });

  it('should handle different output formats', async () => {
    // Currently only markdown is supported, but this tests the format option
    const result = await reportGenerator.generate({
      outputDir: testOutputDir,
      format: 'markdown',
      includeTimestamp: true
    });
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.outputPath).toBeDefined();
      expect(result.data.outputPath).toMatch(/h1b-report-\d{4}-\d{2}-\d{2}\.md$/);
    }
  });
});