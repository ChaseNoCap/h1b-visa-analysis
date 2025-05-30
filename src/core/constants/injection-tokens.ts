import { createTokens } from '@chasenocap/di-framework';

// Create type-safe tokens using di-framework
export const TYPES = createTokens('h1b', {
  ILogger: 'Logging service for H1B application',
  IReportGenerator: 'Main report generation service',
  IDependencyChecker: 'Service for checking package dependencies',
  IFileSystem: 'File system abstraction (future use)',
  IMarkdownProcessor: 'Markdown processing service (future use)',
  IEventBus: 'Event bus for system-wide event handling',
}) as {
  ILogger: symbol;
  IReportGenerator: symbol;
  IDependencyChecker: symbol;
  IFileSystem: symbol;
  IMarkdownProcessor: symbol;
  IEventBus: symbol;
};
