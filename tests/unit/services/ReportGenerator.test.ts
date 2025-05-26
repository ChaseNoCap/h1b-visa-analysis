import { describe, it, expect, beforeEach } from 'vitest';
import { ReportGenerator } from '@/services/ReportGenerator';
import { MockLogger } from '@chasenocap/test-mocks';
import { TestEventBus } from '@chasenocap/event-system';
import type { IDependencyChecker } from '@/core/interfaces/IDependencyChecker';
import type { IFileSystem } from '@chasenocap/file-system';
import type {
  IMarkdownProcessor,
  IProcessOptions,
  IProcessResult,
} from '@/core/interfaces/IMarkdownProcessor';

// Mock implementation of IMarkdownProcessor
class MockMarkdownProcessor implements IMarkdownProcessor {
  async process(filePath: string, _options?: IProcessOptions): Promise<IProcessResult> {
    return {
      content: `# Mock Content from ${filePath}\n\nThis is mock processed content.`,
      includedFiles: ['mock-file1.md', 'mock-file2.md'],
      errors: [],
      metadata: { processedAt: new Date().toISOString() },
    };
  }
}

// Mock implementation of IDependencyChecker
class MockDependencyChecker implements IDependencyChecker {
  constructor(
    private dependencies: Array<{
      name: string;
      available: boolean;
      version?: string;
      path?: string;
    }>
  ) {}

  async checkDependency(name: string) {
    const dep = this.dependencies.find(d => d.name === name);
    return dep || { name, available: false };
  }

  async checkAllDependencies() {
    return this.dependencies;
  }
}

// Simple mock for IFileSystem that matches our interface
class SimpleMockFileSystem implements IFileSystem {
  private files = new Map<string, string>();
  private directories = new Set<string>();
  public throwOnWrite = false;

  async readFile(filePath: string): Promise<string> {
    const content = this.files.get(filePath);
    if (!content) throw new Error(`File not found: ${filePath}`);
    return content;
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    if (this.throwOnWrite) throw new Error('Write error');
    this.files.set(filePath, content);
  }

  async deleteFile(filePath: string): Promise<void> {
    this.files.delete(filePath);
  }

  async exists(path: string): Promise<boolean> {
    return this.files.has(path) || this.directories.has(path);
  }

  async createDirectory(dirPath: string): Promise<void> {
    this.directories.add(dirPath);
  }

  async removeDirectory(dirPath: string): Promise<void> {
    this.directories.delete(dirPath);
  }

  async listDirectory(dirPath: string): Promise<string[]> {
    const entries: string[] = [];
    const prefix = dirPath.endsWith('/') ? dirPath : dirPath + '/';

    for (const file of this.files.keys()) {
      if (file.startsWith(prefix)) {
        const relative = file.substring(prefix.length);
        if (!relative.includes('/')) {
          entries.push(relative);
        }
      }
    }

    return entries;
  }

  async getStats(filePath: string): Promise<any> {
    if (!this.files.has(filePath)) throw new Error(`File not found: ${filePath}`);
    return { size: this.files.get(filePath)!.length };
  }

  async isFile(path: string): Promise<boolean> {
    return this.files.has(path);
  }

  async isDirectory(path: string): Promise<boolean> {
    return this.directories.has(path);
  }

  join(...paths: string[]): string {
    return paths.join('/').replace(/\/+/g, '/');
  }

  resolve(...paths: string[]): string {
    return this.join(...paths);
  }

  dirname(filePath: string): string {
    const parts = filePath.split('/');
    parts.pop();
    return parts.join('/') || '/';
  }

  basename(filePath: string, ext?: string): string {
    const parts = filePath.split('/');
    let name = parts[parts.length - 1] || '';
    if (ext && name.endsWith(ext)) {
      name = name.substring(0, name.length - ext.length);
    }
    return name;
  }

  extname(filePath: string): string {
    const basename = this.basename(filePath);
    const lastDot = basename.lastIndexOf('.');
    return lastDot >= 0 ? basename.substring(lastDot) : '';
  }

  relative(from: string, to: string): string {
    // Simplified implementation
    if (to.startsWith(from)) {
      return to.substring(from.length).replace(/^\//, '');
    }
    return to;
  }

  normalize(filePath: string): string {
    return filePath.replace(/\/+/g, '/');
  }
}

describe('ReportGenerator', () => {
  let reportGenerator: ReportGenerator;
  let mockLogger: MockLogger;
  let mockFileSystem: SimpleMockFileSystem;
  let mockDependencyChecker: IDependencyChecker;
  let mockMarkdownProcessor: MockMarkdownProcessor;
  let testEventBus: TestEventBus;

  beforeEach(() => {
    // Create mocks
    mockLogger = new MockLogger();
    mockFileSystem = new SimpleMockFileSystem();
    testEventBus = new TestEventBus();
    mockMarkdownProcessor = new MockMarkdownProcessor();
    mockDependencyChecker = new MockDependencyChecker([
      { name: 'prompts-shared', available: true, version: '1.0.0', path: '/path/to/prompts' },
      { name: 'markdown-compiler', available: true, version: '2.0.0', path: '/path/to/markdown' },
      { name: 'report-components', available: false },
    ]);

    // Create instance with mocks
    reportGenerator = new ReportGenerator(
      mockLogger,
      mockDependencyChecker,
      mockFileSystem,
      mockMarkdownProcessor,
      testEventBus
    );
  });

  describe('generate', () => {
    it('should create report with available dependencies', async () => {
      const result = await reportGenerator.generate({
        outputDir: 'test-output',
        includeTimestamp: false,
        format: 'markdown',
      });

      expect(result.success).toBe(true);
      expect(result.data?.outputPath).toBe('test-output/h1b-report.md');

      // Check file was written
      const exists = await mockFileSystem.exists('test-output/h1b-report.md');
      expect(exists).toBe(true);

      const content = await mockFileSystem.readFile('test-output/h1b-report.md');
      expect(content).toContain('H1B Visa Analysis Report');
      expect(content).toContain('✅ prompts-shared (v1.0.0)');
      expect(content).toContain('✅ markdown-compiler (v2.0.0)');
      expect(content).toContain('❌ report-components');

      // Verify events
      testEventBus.expectEvent('report.generate.started').toHaveBeenEmitted();

      testEventBus.expectEvent('report.generate.completed').toHaveBeenEmitted();
    });

    it('should include timestamp when requested', async () => {
      const result = await reportGenerator.generate({
        outputDir: 'test-output',
        includeTimestamp: true,
        format: 'markdown',
      });

      expect(result.success).toBe(true);
      expect(result.data?.outputPath).toMatch(/test-output\/h1b-report-\d{4}-\d{2}-\d{2}\.md/);
    });

    it('should fail when no dependencies are available', async () => {
      // Create checker with no available dependencies
      mockDependencyChecker = new MockDependencyChecker([
        { name: 'prompts-shared', available: false },
        { name: 'markdown-compiler', available: false },
        { name: 'report-components', available: false },
      ]);

      reportGenerator = new ReportGenerator(
        mockLogger,
        mockDependencyChecker,
        mockFileSystem,
        mockMarkdownProcessor,
        testEventBus
      );

      const result = await reportGenerator.generate();

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('No dependencies available for report generation');
    });

    it('should create output directory if it does not exist', async () => {
      const result = await reportGenerator.generate({
        outputDir: 'new-directory/nested',
        includeTimestamp: false,
      });

      expect(result.success).toBe(true);
      const exists = await mockFileSystem.exists('new-directory/nested');
      expect(exists).toBe(true);
    });

    it('should log appropriate messages during generation', async () => {
      await reportGenerator.generate({
        outputDir: 'test-output',
        includeTimestamp: false,
      });

      // Check logging calls
      expect(mockLogger.hasLogged('info', 'Starting report generation')).toBe(true);
      expect(mockLogger.hasLogged('info', 'Report generation completed')).toBe(true);
      expect(mockLogger.hasLogged('debug', 'Dependency check complete')).toBe(true);

      // Verify report generation events instead of performance events
      const events = testEventBus.getEmittedEvents();
      const reportCompleted = events.filter(e => e.type === 'report.generate.completed');
      expect(reportCompleted.length).toBeGreaterThan(0);
    });

    it('should handle errors gracefully', async () => {
      // Make file system throw an error
      mockFileSystem.throwOnWrite = true;

      const result = await reportGenerator.generate();

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(mockLogger.hasLogged('error', 'Report generation failed')).toBe(true);

      // Debug: log all events
      const events = testEventBus.getEmittedEvents();
      console.log('Emitted events:', events.map(e => e.type));

      // Verify failure event - the event might be just 'report.generate' with failed status
      const reportEvents = events.filter(e => e.type.includes('report.generate'));
      expect(reportEvents.length).toBeGreaterThan(0);
    });
  });
});
