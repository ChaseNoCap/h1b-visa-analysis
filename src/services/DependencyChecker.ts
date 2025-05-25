import { injectable, inject } from 'inversify';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Emits, Traces, setEventBus } from '@chasenocap/event-system';
import { TYPES } from '../core/constants/injection-tokens.js';
import type {
  IDependencyChecker,
  IDependencyStatus,
} from '../core/interfaces/IDependencyChecker.js';
import type { ILogger } from '@chasenocap/logger';
import type { IEventBus } from '@chasenocap/event-system';

@injectable()
export class DependencyChecker implements IDependencyChecker {
  private readonly dependencies = [
    '@chasenocap/prompts',
    '@chasenocap/markdown-compiler',
    '@chasenocap/report-components',
  ];
  private readonly logger: ILogger;

  constructor(
    @inject(TYPES.ILogger) logger: ILogger,
    @inject(TYPES.IEventBus) eventBus: IEventBus
  ) {
    this.logger = logger.child({ service: 'DependencyChecker' });
    setEventBus(this, eventBus);
  }

  @Emits('dependency.check', {
    payloadMapper: (name: string) => ({ dependency: name }),
  })
  @Traces({ threshold: 100 })
  async checkDependency(name: string): Promise<IDependencyStatus> {
    const depLogger = this.logger.child({ dependency: name });
    const startTime = Date.now();

    try {
      // For published packages, check node_modules
      const modulePath = path.join(process.cwd(), 'node_modules', name);
      const packageJsonPath = path.join(modulePath, 'package.json');

      // Check if package is installed
      await fs.access(packageJsonPath);

      // Try to read package.json
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent) as { version?: string; name?: string };

      depLogger.debug('Dependency found', {
        path: modulePath,
        version: packageJson.version ?? 'unknown',
        checkDuration: Date.now() - startTime,
      });

      return {
        name,
        available: true,
        version: packageJson.version ?? 'unknown',
        path: modulePath,
      };
    } catch (error) {
      const err = error as Error;
      depLogger.warn('Dependency not available', {
        message: err.message,
        code: (err as NodeJS.ErrnoException).code,
        checkDuration: Date.now() - startTime,
      });

      return {
        name,
        available: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Emits('dependency.checkAll', {
    payloadMapper: () => ({ count: 3 }),
  })
  @Traces({ threshold: 500 })
  async checkAllDependencies(): Promise<IDependencyStatus[]> {
    const operationId = `dep-check-${Date.now()}`;
    const opLogger = this.logger.child({ operation: 'checkAll', operationId });
    const startTime = Date.now();

    opLogger.info('Starting dependency check', {
      dependencies: this.dependencies,
      count: this.dependencies.length,
    });

    const results = await Promise.all(this.dependencies.map(dep => this.checkDependency(dep)));

    const available = results.filter(r => r.available).length;
    const total = results.length;
    const missing = results.filter(r => !r.available);

    opLogger.info('Dependency check complete', {
      available,
      total,
      missing: missing.map(d => d.name),
      duration: Date.now() - startTime,
      operationId,
    });

    return results;
  }
}
