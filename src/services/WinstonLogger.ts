import { injectable } from 'inversify';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as path from 'path';
import type { ILogger, ILogContext } from '../core/interfaces/ILogger.js';

@injectable()
export class WinstonLogger implements ILogger {
  private readonly logger: winston.Logger;
  private readonly context: ILogContext;

  constructor(context: ILogContext = {}) {
    this.context = context;
    this.logger = this.createLogger();
  }

  private createLogger(): winston.Logger {
    const logDir = path.join(process.cwd(), 'logs');

    return winston.createLogger({
      level: process.env['LOG_LEVEL'] || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { ...this.context, service: 'h1b-report-generator' },
      transports: [
        // Console transport
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),
        // Daily rotate file transport
        new DailyRotateFile({
          dirname: logDir,
          filename: 'h1b-report-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '10m',
          maxFiles: '14d',
        }),
      ],
    });
  }

  debug(message: string, context?: ILogContext): void {
    this.logger.debug(message, { ...this.context, ...context });
  }

  info(message: string, context?: ILogContext): void {
    this.logger.info(message, { ...this.context, ...context });
  }

  warn(message: string, context?: ILogContext): void {
    this.logger.warn(message, { ...this.context, ...context });
  }

  error(message: string, error?: Error, context?: ILogContext): void {
    this.logger.error(message, {
      ...this.context,
      ...context,
      error: error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : undefined,
    });
  }

  child(context: ILogContext): ILogger {
    return new WinstonLogger({ ...this.context, ...context });
  }
}
