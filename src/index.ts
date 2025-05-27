import 'reflect-metadata';
import { containerPromise } from './core/container/container.js';
import { TYPES } from './core/constants/injection-tokens.js';
import type { IReportGenerator } from './core/interfaces/IReportGenerator.js';
import type { ILogger } from '@chasenocap/logger';

async function main(): Promise<void> {
  const container = await containerPromise;
  const logger = container.get<ILogger>(TYPES.ILogger);
  const reportGenerator = container.get<IReportGenerator>(TYPES.IReportGenerator);

  try {
    logger.info('H1B Report Generator starting');

    const result = await reportGenerator.generate({
      outputDir: 'reports/h1b',
      includeTimestamp: true,
      format: 'markdown',
    });

    if (result.success) {
      logger.info('Report generated successfully', {
        outputPath: result.data?.outputPath,
        duration: result.data?.metadata?.duration,
      });
      process.exit(0);
    } else {
      logger.error('Report generation failed', result.error);
      process.exit(1);
    }
  } catch (error) {
    logger.error('Unexpected error', error as Error);
    process.exit(1);
  }
}

// Public API exports
export { TYPES } from './core/constants/injection-tokens.js';
export { containerPromise } from './core/container/container.js';
export type {
  IReportGenerator,
  IReportOptions,
  IReportResult,
} from './core/interfaces/IReportGenerator.js';
export type {
  IDependencyChecker,
  IDependencyStatus,
} from './core/interfaces/IDependencyChecker.js';

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
