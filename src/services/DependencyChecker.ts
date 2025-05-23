import { injectable, inject } from 'inversify';
import * as path from 'path';
import * as fs from 'fs/promises';
import { TYPES } from '../core/constants/injection-tokens.js';
import type { IDependencyChecker, IDependencyStatus } from '../core/interfaces/IDependencyChecker.js';
import type { ILogger } from '../core/interfaces/ILogger.js';

@injectable()
export class DependencyChecker implements IDependencyChecker {
  private readonly dependencies = ['prompts-shared', 'markdown-compiler', 'report-components'];

  constructor(
    @inject(TYPES.ILogger) private readonly logger: ILogger
  ) {}

  async checkDependency(name: string): Promise<IDependencyStatus> {
    try {
      const packagePath = path.join(process.cwd(), 'packages', name);
      const packageJsonPath = path.join(packagePath, 'package.json');
      
      // Check if package directory exists
      await fs.access(packagePath);
      
      // Try to read package.json
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      
      this.logger.debug(`Dependency ${name} found`, { 
        path: packagePath,
        version: packageJson.version 
      });
      
      return {
        name,
        available: true,
        version: packageJson.version,
        path: packagePath,
      };
    } catch (error) {
      this.logger.warn(`Dependency ${name} not available`, { error });
      
      return {
        name,
        available: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async checkAllDependencies(): Promise<IDependencyStatus[]> {
    this.logger.info('Checking all dependencies');
    
    const results = await Promise.all(
      this.dependencies.map(dep => this.checkDependency(dep))
    );
    
    const available = results.filter(r => r.available).length;
    const total = results.length;
    
    this.logger.info(`Dependency check complete: ${available}/${total} available`);
    
    return results;
  }
}