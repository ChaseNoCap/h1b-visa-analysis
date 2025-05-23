import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as path from 'path';
import * as fs from 'fs/promises';
import { container } from '@/core/container/container';
import { TYPES } from '@/core/constants/injection-tokens';
import type { IReportGenerator, IReportResult } from '@/core/interfaces/IReportGenerator';
import type { IDependencyChecker } from '@/core/interfaces/IDependencyChecker';

describe('ReportGenerator E2E Tests', () => {
  let reportGenerator: IReportGenerator;
  let dependencyChecker: IDependencyChecker;
  const testOutputDir = path.join(__dirname, 'fixtures', 'output');
  
  beforeEach(async () => {
    // Use real implementations from container
    reportGenerator = container.get<IReportGenerator>(TYPES.IReportGenerator);
    dependencyChecker = container.get<IDependencyChecker>(TYPES.IDependencyChecker);
    
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
  
  describe('Basic Report Generation', () => {
    it('should generate a report with dependency status', async () => {
      const result = await reportGenerator.generate({
        outputDir: testOutputDir,
        includeTimestamp: false,
        format: 'markdown'
      });
      
      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.dependencies).toBeInstanceOf(Array);
      
      // Verify file was created
      const fileExists = await fs.access(result.outputPath!)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);
      
      // Read and verify content
      const content = await fs.readFile(result.outputPath!, 'utf-8');
      expect(content).toContain('# H1B Visa Analysis Report');
      expect(content).toContain('## Dependency Status');
    });
    
    it('should include timestamp in filename when requested', async () => {
      const result = await reportGenerator.generate({
        outputDir: testOutputDir,
        includeTimestamp: true,
        format: 'markdown'
      });
      
      expect(result.success).toBe(true);
      expect(result.outputPath).toMatch(/h1b-report-\d{4}-\d{2}-\d{2}\.md$/);
    });
  });
  
  describe('Dependency Integration', () => {
    it('should check all configured dependencies', async () => {
      const dependencies = await dependencyChecker.checkAllDependencies();
      
      expect(dependencies).toBeInstanceOf(Array);
      expect(dependencies.length).toBeGreaterThan(0);
      
      // Should check for our known dependencies
      const depNames = dependencies.map(d => d.name);
      expect(depNames).toContain('prompts-shared');
      expect(depNames).toContain('markdown-compiler');
      expect(depNames).toContain('report-components');
    });
    
    it('should report available and missing dependencies', async () => {
      const result = await reportGenerator.generate({
        outputDir: testOutputDir,
        includeTimestamp: false
      });
      
      const content = await fs.readFile(result.outputPath!, 'utf-8');
      
      // Should show status for each dependency
      expect(content).toMatch(/[✅❌] prompts-shared/);
      expect(content).toMatch(/[✅❌] markdown-compiler/);
      expect(content).toMatch(/[✅❌] report-components/);
    });
  });
  
  describe('Error Handling', () => {
    it('should handle missing output directory gracefully', async () => {
      const nonExistentBase = path.join(testOutputDir, 'deep', 'nested', 'path');
      
      const result = await reportGenerator.generate({
        outputDir: nonExistentBase,
        includeTimestamp: false
      });
      
      // Should create the directory and succeed
      expect(result.success).toBe(true);
      expect(result.outputPath).toContain(nonExistentBase);
    });
    
    it('should provide meaningful error when no dependencies available', async () => {
      // This test would need a mock or a way to simulate no dependencies
      // For now, we'll just verify the error handling structure exists
      expect(reportGenerator.generate).toBeDefined();
    });
  });
  
  describe('Output Validation', () => {
    it('should generate valid markdown output', async () => {
      const result = await reportGenerator.generate({
        outputDir: testOutputDir,
        includeTimestamp: false,
        format: 'markdown'
      });
      
      const content = await fs.readFile(result.outputPath!, 'utf-8');
      
      // Verify markdown structure
      expect(content).toMatch(/^# .+/m); // Has h1 heading
      expect(content).toMatch(/^## .+/m); // Has h2 headings
      expect(content).toContain('Generated on:');
      
      // Should not have any undefined values
      expect(content).not.toContain('undefined');
      expect(content).not.toContain('null');
    });
    
    it('should include metadata in result', async () => {
      const startTime = Date.now();
      
      const result = await reportGenerator.generate({
        outputDir: testOutputDir
      });
      
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.generatedAt).toBeInstanceOf(Date);
      expect(result.metadata?.duration).toBeGreaterThanOrEqual(0);
      expect(result.metadata?.duration).toBeLessThan(5000); // Should complete quickly
      
      const generatedTime = result.metadata?.generatedAt.getTime() || 0;
      expect(generatedTime).toBeGreaterThanOrEqual(startTime);
    });
  });
  
  describe('Integration Output', () => {
    it('should generate a complete test report file', async () => {
      const result = await reportGenerator.generate({
        outputDir: path.join(__dirname, '..'),
        includeTimestamp: false,
        format: 'markdown'
      });
      
      expect(result.success).toBe(true);
      
      // Log processing details
      console.log('Report generated:', result.outputPath);
      console.log('Processing duration:', result.metadata?.duration, 'ms');
      console.log('Dependencies found:', result.metadata?.dependencies);
      
      // Verify we can read the generated report
      const content = await fs.readFile(result.outputPath!, 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  });
});