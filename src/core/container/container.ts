import 'reflect-metadata';
import { ContainerBuilder, Container } from '@chasenocap/di-framework';
import { TYPES } from '../constants/injection-tokens.js';

// Import concrete implementations
import { WinstonLogger } from '@chasenocap/logger';
import { NodeFileSystem } from '@chasenocap/file-system';
import { EventBus } from '@chasenocap/event-system';
import { ReportGenerator } from '../../services/ReportGenerator.js';
import { DependencyChecker } from '../../services/DependencyChecker.js';

export async function createContainer(): Promise<Container> {
  const container = await new ContainerBuilder({
    defaultScope: 'Singleton',
    autoBindInjectable: true,
  })
    .addBinding(TYPES.ILogger, WinstonLogger, 'Singleton')
    .addBinding(TYPES.IFileSystem, NodeFileSystem, 'Singleton')
    .addBinding(TYPES.IEventBus, EventBus, 'Singleton')
    .addBinding(TYPES.IReportGenerator, ReportGenerator)
    .addBinding(TYPES.IDependencyChecker, DependencyChecker)
    .build();

  return container;
}

// Export a promise for the singleton container instance
export const containerPromise = createContainer();
