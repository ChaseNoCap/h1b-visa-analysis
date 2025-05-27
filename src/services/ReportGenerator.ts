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
import type { IMarkdownProcessor } from '../core/interfaces/IMarkdownProcessor.js';
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
    @inject(TYPES.IMarkdownProcessor) private readonly markdownProcessor: IMarkdownProcessor,
    @inject(TYPES.IEventBus) eventBus: IEventBus
  ) {
    this.logger = logger.child({ service: 'ReportGenerator' });
    this.reportBuilder = this.templateContainer.markdownBuilder;
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

      // Create output directory and history subdirectory
      await this.fileSystem.createDirectory(outputDir);
      const historyDir = this.fileSystem.join(outputDir, 'history');
      await this.fileSystem.createDirectory(historyDir);

      // Generate report content
      const reportContent = await this.generateReportContent(dependencies);

      // Determine filenames
      const fullTimestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const extension = format === 'markdown' ? 'md' : format;
      
      // Static name for current report
      const currentFilename = `analysis.${extension}`;
      const currentPath = this.fileSystem.join(outputDir, currentFilename);
      
      // History filename with full timestamp
      const historyFilename = `analysis-${fullTimestamp}.${extension}`;
      const historyPath = this.fileSystem.join(historyDir, historyFilename);
      
      // Write to both locations
      await this.fileSystem.writeFile(currentPath, reportContent);
      await this.fileSystem.writeFile(historyPath, reportContent);
      
      // Use the current path for return value
      const outputPath = currentPath;

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

  private async generateReportContent(
    dependencies: Array<{ name: string; available: boolean; version?: string; path?: string }>
  ): Promise<string> {
    this.reportBuilder.clear();

    // Build report using the fluent API
    this.reportBuilder
      .addHeader('H1B Visa Analysis Report', {
        generatedOn: new Date().toISOString(),
        format: 'markdown',
        author: 'H1B Analysis System',
        version: '1.0',
      })
      .addSection(
        'Executive Summary',
        'This report provides comprehensive analysis of H1B visa program impacts based on current research data.'
      );

    // Add actual content from report-components
    const reportComponentsDep = dependencies.find(
      d => d.name === '@chasenocap/report-components' && d.available
    );

    if (reportComponentsDep?.path) {
      this.logger.debug('Processing report-components content', { path: reportComponentsDep.path });

      try {
        // Process the entry-point.md file from report-components
        const entryPointPath = this.fileSystem.join(
          reportComponentsDep.path,
          'src',
          'entry-point.md'
        );
        const processResult = await this.markdownProcessor.process(entryPointPath, {
          basePath: this.fileSystem.join(reportComponentsDep.path, 'src'),
        });

        if (processResult.errors.length > 0) {
          this.logger.warn('Errors processing content', {
            errors: processResult.errors,
            includedFiles: processResult.includedFiles,
          });

          this.reportBuilder.addSection(
            'Content Processing Warnings',
            `Some content files could not be processed:\n${processResult.errors.map(e => `- ${e.message}`).join('\n')}`
          );
        }

        if (processResult.content && processResult.content.trim()) {
          this.reportBuilder.addSection('H1B Analysis Content', processResult.content);

          this.logger.info('Successfully processed report content', {
            contentLength: processResult.content.length,
            includedFiles: processResult.includedFiles.length,
            errors: processResult.errors.length,
          });
        } else {
          this.reportBuilder.addSection(
            'H1B Analysis Content',
            '⚠️ No content was generated from report-components'
          );
        }

        // Add metadata about content processing
        if (processResult.includedFiles.length > 0) {
          this.reportBuilder
            .addSection('Content Sources', '', 3)
            .addList(processResult.includedFiles.map(file => `📄 ${file}`));
        }
      } catch (error) {
        const err = error as Error;
        this.logger.error('Failed to process report-components content', err);
        this.reportBuilder.addSection(
          'Content Processing Error',
          `❌ Failed to process content: ${err.message}`
        );
      }
    } else {
      this.reportBuilder.addSection(
        'H1B Analysis Content',
        '⚠️ report-components package not available - using placeholder content'
      );
    }

    // Add dependency status
    this.reportBuilder.addSection('System Information', this.buildDependencyList(dependencies));

    return this.reportBuilder.build();
  }

  private buildDependencyList(
    dependencies: Array<{ name: string; available: boolean; version?: string; path?: string }>
  ): string {
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
