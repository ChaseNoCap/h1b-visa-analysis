import { injectable, inject } from 'inversify';
import * as path from 'path';
import * as fs from 'fs/promises';
import { TYPES } from '../core/constants/injection-tokens.js';
import type {
  IDependencyChecker,
  IDependencyStatus,
} from '../core/interfaces/IDependencyChecker.js';
import type { ILogger } from 'logger';

@injectable()
export class DependencyChecker implements IDependencyChecker {
  private readonly dependencies = ['prompts-shared', 'markdown-compiler', 'report-components'];
  private readonly logger: ILogger;

  constructor(@inject(TYPES.ILogger) logger: ILogger) {
    this.logger = logger.child({ service: 'DependencyChecker' });
  }

  async checkDependency(name: string): Promise<IDependencyStatus> {
    const depLogger = this.logger.child({ dependency: name });
    const startTime = Date.now();

    try {
      const packagePath = path.join(process.cwd(), 'packages', name);
      const packageJsonPath = path.join(packagePath, 'package.json');

      // Check if package directory exists
      await fs.access(packagePath);

      // Try to read package.json
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent) as { version?: string; name?: string };

      depLogger.debug('Dependency found', {
        path: packagePath,
        version: packageJson.version ?? 'unknown',
        checkDuration: Date.now() - startTime,
      });

      return {
        name,
        available: true,
        version: packageJson.version ?? 'unknown',
        path: packagePath,
      };
    } catch (error) {
      const err = error as Error;
      depLogger.warn('Dependency not available', {
        message: err.message,
        code: (err as any).code,
        checkDuration: Date.now() - startTime,
      });

      return {
        name,
        available: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

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
