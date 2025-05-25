import { injectable, inject } from 'inversify';
import { Emits, Traces, setEventBus } from '@chasenocap/event-system';
import { TYPES } from '../core/constants/injection-tokens.js';
import { success, failure } from '@chasenocap/di-framework';
import { createTemplateContainer, TEMPLATE_TYPES } from '@chasenocap/report-templates';
import type { IReportBuilder } from '@chasenocap/report-templates';
import type {
  IReportGenerator,
  IReportOptions,
  IReportResult,
  IReportData,
} from '../core/interfaces/IReportGenerator.js';
import type { IDependencyChecker } from '../core/interfaces/IDependencyChecker.js';
import type { ILogger } from '@chasenocap/logger';
import type { IFileSystem } from '@chasenocap/file-system';
import type { IEventBus } from '@chasenocap/event-system';

@injectable()
export class ReportGenerator implements IReportGenerator {
  private readonly logger: ILogger;
  private templateContainer = createTemplateContainer();
  private reportBuilder: IReportBuilder;

  constructor(
    @inject(TYPES.ILogger) logger: ILogger,
    @inject(TYPES.IDependencyChecker) private readonly dependencyChecker: IDependencyChecker,
    @inject(TYPES.IFileSystem) private readonly fileSystem: IFileSystem,
    @inject(TYPES.IEventBus) eventBus: IEventBus
  ) {
    this.logger = logger.child({ service: 'ReportGenerator' });
    this.reportBuilder = this.templateContainer.get<IReportBuilder>(TEMPLATE_TYPES.IReportBuilder);
    setEventBus(this, eventBus);
  }

  @Emits('report.generate', {
    payloadMapper: (options: IReportOptions = {}) => ({
      format: options?.format || 'markdown',
      outputDir: options?.outputDir || 'dist',
    }),
  })
  @Traces({ threshold: 1000 })
  async generate(options: IReportOptions = {}): Promise<IReportResult> {
    const startTime = Date.now();
    const requestId = `report-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const { outputDir = 'dist', includeTimestamp = true, format = 'markdown' } = options;
    const opLogger = this.logger.child({ operation: 'generate', requestId });

    opLogger.info('Starting report generation', {
      options,
      defaults: { outputDir, format, includeTimestamp },
      requestId,
    });

    try {
      // Check dependencies
      const dependencies = await this.dependencyChecker.checkAllDependencies();
      const availableDeps = dependencies.filter(d => d.available);

      opLogger.debug('Dependency check complete', {
        total: dependencies.length,
        available: availableDeps.length,
        missing: dependencies.filter(d => !d.available).map(d => d.name),
      });

      if (availableDeps.length === 0) {
        opLogger.warn('No dependencies available for report generation');
        throw new Error('No dependencies available for report generation');
      }

      // Create output directory
      await this.fileSystem.createDirectory(outputDir);

      // Generate report content
      const reportContent = this.generateReportContent(dependencies);

      // Determine output filename
      const timestamp = includeTimestamp ? `-${new Date().toISOString().split('T')[0]}` : '';
      const extension = format === 'markdown' ? 'md' : format;
      const outputFilename = `h1b-report${timestamp}.${extension}`;
      const outputPath = this.fileSystem.join(outputDir, outputFilename);

      // Write report
      await this.fileSystem.writeFile(outputPath, reportContent);

      const duration = Date.now() - startTime;
      const fileStats = await this.fileSystem.getStats(outputPath);

      opLogger.info('Report generation completed', {
        outputPath,
        duration,
        dependenciesUsed: availableDeps.map(d => d.name),
        fileSize: fileStats.size,
        requestId,
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
        stack: err.stack,
      });

      return failure<IReportData>(error as Error);
    }
  }

  private generateReportContent(
    dependencies: Array<{ name: string; available: boolean; version?: string; path?: string }>
  ): string {
    this.reportBuilder.clear();
    
    // Build report using the fluent API
    this.reportBuilder
      .addHeader('H1B Visa Analysis Report', {
        generatedOn: new Date().toISOString(),
        format: 'markdown'
      })
      .addSection('Dependency Status', this.buildDependencyList(dependencies));

    // Add report content section
    const availableDeps = dependencies.filter(d => d.available);
    if (availableDeps.length > 0) {
      this.reportBuilder
        .addSection('Report Content', '*Content generation from dependencies will be implemented here*')
        .addSection('Available Components', '', 3)
        .addList(availableDeps.map(dep => `${dep.name}: ${dep.path || 'N/A'}`));
    } else {
      this.reportBuilder
        .addSection('Report Content', '⚠️ No dependencies available for content generation');
    }

    return this.reportBuilder.build();
  }

  private buildDependencyList(dependencies: Array<{ name: string; available: boolean; version?: string; path?: string }>): string {
    const depList = dependencies.map(dep => {
      const status = dep.available ? '✅' : '❌';
      const version = dep.version ? ` (v${dep.version})` : '';
      return `${status} ${dep.name}${version}`;
    });
    
    // Create a temporary builder for just the list
    const listBuilder = this.templateContainer.get<IReportBuilder>(TEMPLATE_TYPES.IReportBuilder);
    listBuilder.addList(depList);
    return listBuilder.build();
  }
}
