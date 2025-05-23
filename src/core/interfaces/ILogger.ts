export interface ILogContext {
  [key: string]: unknown;
}

export interface ILogger {
  debug(message: string, context?: ILogContext): void;
  info(message: string, context?: ILogContext): void;
  warn(message: string, context?: ILogContext): void;
  error(message: string, error?: Error, context?: ILogContext): void;
  child(context: ILogContext): ILogger;
}