import { injectable, inject } from 'inversify';
import * as path from 'path';
import * as fs from 'fs/promises';
import { TYPES } from '../core/constants/injection-tokens.js';
import { success, failure } from 'di-framework';
import type {
  IReportGenerator,
  IReportOptions,
  IReportResult,
  IReportData,
} from '../core/interfaces/IReportGenerator.js';
import type { IDependencyChecker } from '../core/interfaces/IDependencyChecker.js';
import type { ILogger } from 'logger';

@injectable()
export class ReportGenerator implements IReportGenerator {
  private readonly logger: ILogger;
  
  constructor(
    @inject(TYPES.ILogger) logger: ILogger,
    @inject(TYPES.IDependencyChecker) private readonly dependencyChecker: IDependencyChecker
  ) {
    this.logger = logger.child({ service: 'ReportGenerator' });
  }

  async generate(options: IReportOptions = {}): Promise<IReportResult> {
    const startTime = Date.now();
    const requestId = `report-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const { outputDir = 'dist', includeTimestamp = true, format = 'markdown' } = options;
    const opLogger = this.logger.child({ operation: 'generate', requestId });

    opLogger.info('Starting report generation', { 
      options,
      defaults: { outputDir, format, includeTimestamp },
      requestId
    });

    try {
      // Check dependencies
      const dependencies = await this.dependencyChecker.checkAllDependencies();
      const availableDeps = dependencies.filter(d => d.available);
      
      opLogger.debug('Dependency check complete', {
        total: dependencies.length,
        available: availableDeps.length,
        missing: dependencies.filter(d => !d.available).map(d => d.name)
      });

      if (availableDeps.length === 0) {
        opLogger.warn('No dependencies available for report generation');
        throw new Error('No dependencies available for report generation');
      }

      // Create output directory
      await fs.mkdir(outputDir, { recursive: true });

      // Generate report content
      const reportContent = this.generateReportContent(dependencies);

      // Determine output filename
      const timestamp = includeTimestamp ? `-${new Date().toISOString().split('T')[0]}` : '';
      const extension = format === 'markdown' ? 'md' : format;
      const outputFilename = `h1b-report${timestamp}.${extension}`;
      const outputPath = path.join(outputDir, outputFilename);

      // Write report
      await fs.writeFile(outputPath, reportContent, 'utf-8');

      const duration = Date.now() - startTime;
      const fileStats = await fs.stat(outputPath);
      
      opLogger.info('Report generation completed', {
        outputPath,
        duration,
        dependenciesUsed: availableDeps.map(d => d.name),
        fileSize: fileStats.size,
        requestId
      });

      return success<IReportData>({
        outputPath,
        metadata: {
          generatedAt: new Date(),
          duration,
          dependencies: availableDeps.map(d => d.name),
        },
      });
    } catch (error) {
      const err = error as Error;
      const duration = Date.now() - startTime;
      
      this.logger.error('Report generation failed', err);
      this.logger.debug('Failure details', {
        duration,
        options,
        stack: err.stack
      });

      return failure<IReportData>(error as Error);
    }
  }

  private generateReportContent(
    dependencies: Array<{ name: string; available: boolean; version?: string; path?: string }>
  ): string {
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
