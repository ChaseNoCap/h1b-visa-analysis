import { injectable, inject } from 'inversify';
import * as path from 'path';
import * as fs from 'fs/promises';
import { TYPES } from '../core/constants/injection-tokens.js';
import type { IReportGenerator, IReportOptions, IReportResult } from '../core/interfaces/IReportGenerator.js';
import type { IDependencyChecker } from '../core/interfaces/IDependencyChecker.js';
import type { ILogger } from '../core/interfaces/ILogger.js';

@injectable()
export class ReportGenerator implements IReportGenerator {
  constructor(
    @inject(TYPES.ILogger) private readonly logger: ILogger,
    @inject(TYPES.IDependencyChecker) private readonly dependencyChecker: IDependencyChecker
  ) {}

  async generate(options: IReportOptions = {}): Promise<IReportResult> {
    const startTime = Date.now();
    const {
      outputDir = 'dist',
      includeTimestamp = true,
      format = 'markdown'
    } = options;

    this.logger.info('Starting report generation', { options });

    try {
      // Check dependencies
      const dependencies = await this.dependencyChecker.checkAllDependencies();
      const availableDeps = dependencies.filter(d => d.available);

      if (availableDeps.length === 0) {
        throw new Error('No dependencies available for report generation');
      }

      // Create output directory
      await fs.mkdir(outputDir, { recursive: true });

      // Generate report content
      const reportContent = await this.generateReportContent(dependencies);

      // Determine output filename
      const timestamp = includeTimestamp 
        ? `-${new Date().toISOString().split('T')[0]}` 
        : '';
      const extension = format === 'markdown' ? 'md' : format;
      const outputFilename = `h1b-report${timestamp}.${extension}`;
      const outputPath = path.join(outputDir, outputFilename);

      // Write report
      await fs.writeFile(outputPath, reportContent, 'utf-8');

      const duration = Date.now() - startTime;
      this.logger.info('Report generation completed', { 
        outputPath, 
        duration,
        dependenciesUsed: availableDeps.map(d => d.name)
      });

      return {
        success: true,
        outputPath,
        metadata: {
          generatedAt: new Date(),
          duration,
          dependencies: availableDeps.map(d => d.name),
        },
      };
    } catch (error) {
      this.logger.error('Report generation failed', error as Error);
      
      return {
        success: false,
        error: error as Error,
      };
    }
  }

  private async generateReportContent(dependencies: any[]): Promise<string> {
    const sections: string[] = [
      '# H1B Visa Analysis Report',
      '',
      `Generated on: ${new Date().toISOString()}`,
      '',
      '## Dependency Status',
      '',
    ];

    // Add dependency status
    for (const dep of dependencies) {
      const status = dep.available ? '✅' : '❌';
      const version = dep.version ? ` (v${dep.version})` : '';
      sections.push(`- ${status} ${dep.name}${version}`);
    }

    sections.push('', '## Report Content', '');

    // TODO: Integrate actual content from dependencies
    const availableDeps = dependencies.filter(d => d.available);
    if (availableDeps.length > 0) {
      sections.push('*Content generation from dependencies will be implemented here*');
      sections.push('');
      sections.push('### Available Components:');
      for (const dep of availableDeps) {
        sections.push(`- ${dep.name}: ${dep.path}`);
      }
    } else {
      sections.push('⚠️ No dependencies available for content generation');
    }

    return sections.join('\n');
  }
}