import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../constants/injection-tokens.js';
import type { ILogger } from '../interfaces/ILogger.js';
import type { IReportGenerator } from '../interfaces/IReportGenerator.js';
import type { IDependencyChecker } from '../interfaces/IDependencyChecker.js';

// Import concrete implementations
import { WinstonLogger } from '../../services/WinstonLogger.js';
import { ReportGenerator } from '../../services/ReportGenerator.js';
import { DependencyChecker } from '../../services/DependencyChecker.js';

export function createContainer(): Container {
  const container = new Container({
    defaultScope: 'Singleton',
    autoBindInjectable: true,
  });

  configureContainer(container);
  return container;
}

export function configureContainer(container: Container): void {
  // Bind core services
  container.bind<ILogger>(TYPES.ILogger).to(WinstonLogger).inSingletonScope();
  container.bind<IReportGenerator>(TYPES.IReportGenerator).to(ReportGenerator);
  container.bind<IDependencyChecker>(TYPES.IDependencyChecker).to(DependencyChecker);
}

// Export a singleton container instance
export const container = createContainer();