import 'reflect-metadata';
import { container } from './core/container/container.js';
import { TYPES } from './core/constants/injection-tokens.js';
import type { IReportGenerator } from './core/interfaces/IReportGenerator.js';
import type { ILogger } from './core/interfaces/ILogger.js';

async function main(): Promise<void> {
  const logger = container.get<ILogger>(TYPES.ILogger);
  const reportGenerator = container.get<IReportGenerator>(TYPES.IReportGenerator);

  try {
    logger.info('H1B Report Generator starting');
    
    const result = await reportGenerator.generate({
      outputDir: 'dist',
      includeTimestamp: true,
      format: 'markdown',
    });

    if (result.success) {
      logger.info('Report generated successfully', {
        outputPath: result.outputPath,
        duration: result.metadata?.duration,
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

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}