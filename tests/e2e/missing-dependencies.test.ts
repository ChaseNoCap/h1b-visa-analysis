import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as path from 'path';
import * as fs from 'fs/promises';
import { TYPES } from '@/core/constants/injection-tokens';
import type { IReportGenerator } from '@/core/interfaces/IReportGenerator';
import type { IDependencyChecker, IDependencyStatus } from '@/core/interfaces/IDependencyChecker';
import { ReportGenerator } from '@/services/ReportGenerator';
// import { createTestContainer, FixtureManager } from 'test-helpers';
import { Container } from 'inversify';
import type { ILogger } from '@/core/interfaces/ILogger';
import { WinstonLogger } from '@/services/WinstonLogger';

describe('ReportGenerator with Missing Dependencies', () => {
  let container: Container;
  let reportGenerator: IReportGenerator;
  const testOutputDir = path.join(__dirname, 'fixtures', 'output-missing');

  beforeEach(async () => {
    // Create a new container for this test
    container = new Container();

    // Create a mock dependency checker that returns missing dependencies
    const mockDependencyChecker: IDependencyChecker = {
      checkDependency(name: string): Promise<IDependencyStatus> {
        return Promise.resolve({
          name,
          available: false,
          error: 'Dependency not found',
        });
      },
      checkAllDependencies(): Promise<IDependencyStatus[]> {
        return Promise.resolve([
          { name: 'prompts-shared', available: false, error: 'Not found' },
          { name: 'markdown-compiler', available: false, error: 'Not found' },
          { name: 'report-components', available: false, error: 'Not found' },
        ]);
      },
    };

    // Bind services
    container.bind<ILogger>(TYPES.ILogger).to(WinstonLogger);
    container
      .bind<IDependencyChecker>(TYPES.IDependencyChecker)
      .toConstantValue(mockDependencyChecker);
    container.bind<IReportGenerator>(TYPES.IReportGenerator).to(ReportGenerator);

    reportGenerator = container.get<IReportGenerator>(TYPES.IReportGenerator);

    // Create test output directory
    await fs.mkdir(testOutputDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test output
    try {
      await fs.rm(testOutputDir, { recursive: true, force: true });
    } catch {
      // Ignore errors if directory doesn't exist
    }
  });

  it('should handle all dependencies missing gracefully', async () => {
    const result = await reportGenerator.generate({
      outputDir: testOutputDir,
      includeTimestamp: false,
      format: 'markdown',
    });

    // Should fail with appropriate error
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('No dependencies available');
    expect(result.outputPath).toBeUndefined();
  });

  it('should handle partial dependencies', async () => {
    // Create a mock that returns mixed results
    const mockDependencyChecker: IDependencyChecker = {
      checkDependency(name: string): Promise<IDependencyStatus> {
        if (name === 'markdown-compiler') {
          return Promise.resolve({
            name,
            available: true,
            version: '0.1.0',
            path: '/test/path',
          });
        }
        return Promise.resolve({
          name,
          available: false,
          error: 'Dependency not found',
        });
      },
      checkAllDependencies(): Promise<IDependencyStatus[]> {
        return Promise.resolve([
          { name: 'prompts-shared', available: false, error: 'Not found' },
          { name: 'markdown-compiler', available: true, version: '0.1.0', path: '/test/path' },
          { name: 'report-components', available: false, error: 'Not found' },
        ]);
      },
    };

    // Re-bind with new mock
    container
      .rebind<IDependencyChecker>(TYPES.IDependencyChecker)
      .toConstantValue(mockDependencyChecker);
    reportGenerator = container.get<IReportGenerator>(TYPES.IReportGenerator);

    const result = await reportGenerator.generate({
      outputDir: testOutputDir,
      includeTimestamp: false,
      format: 'markdown',
    });

    // Should succeed with partial dependencies
    expect(result.success).toBe(true);
    expect(result.outputPath).toBeDefined();
    expect(result.metadata?.dependencies).toEqual(['markdown-compiler']);

    // Verify content shows mixed status
    const content = await fs.readFile(result.outputPath!, 'utf-8');
    expect(content).toContain('❌ prompts-shared');
    expect(content).toContain('✅ markdown-compiler');
    expect(content).toContain('❌ report-components');
  });
});
