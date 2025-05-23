export const TYPES = {
  ILogger: Symbol.for('ILogger'),
  IReportGenerator: Symbol.for('IReportGenerator'),
  IDependencyChecker: Symbol.for('IDependencyChecker'),
  IFileSystem: Symbol.for('IFileSystem'),
  IMarkdownProcessor: Symbol.for('IMarkdownProcessor'),
} as const;
