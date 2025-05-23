# @h1b/logger

Shared logging infrastructure for the H1B monorepo.

## Features

- Winston-based logging with daily rotation
- Structured JSON logging
- Context-aware child loggers
- Multiple log levels
- Console and file transports
- TypeScript support

## Installation

```bash
npm install @h1b/logger
```

## Usage

### Basic Usage

```typescript
import { createLogger } from '@h1b/logger';

const logger = createLogger('my-service');

logger.info('Application started');
logger.debug('Debug information', { extra: 'data' });
logger.warn('Warning message');
logger.error('Error occurred', new Error('Something went wrong'));
```

### Child Loggers

Create child loggers with additional context:

```typescript
const childLogger = logger.child({ requestId: '123', userId: 'john' });
childLogger.info('Processing request'); // Includes requestId and userId
```

### Advanced Configuration

```typescript
import { WinstonLogger, ILoggerConfig } from '@h1b/logger';

const config: ILoggerConfig = {
  service: 'my-service',
  level: 'debug',
  logDir: './logs',
  maxFiles: '30d',
  maxSize: '20m'
};

const logger = new WinstonLogger(config);
```

### With Dependency Injection

```typescript
import { Container } from 'inversify';
import { ILogger, WinstonLogger } from '@h1b/logger';

const container = new Container();
container.bind<ILogger>('ILogger').to(WinstonLogger).inSingletonScope();

const logger = container.get<ILogger>('ILogger');
```

## API

### ILogger Interface

```typescript
interface ILogger {
  debug(message: string, context?: ILogContext): void;
  info(message: string, context?: ILogContext): void;
  warn(message: string, context?: ILogContext): void;
  error(message: string, error?: Error, context?: ILogContext): void;
  child(context: ILogContext): ILogger;
}
```

### Configuration Options

```typescript
interface ILoggerConfig {
  service?: string;      // Service name for metadata
  level?: string;        // Log level (default: 'info')
  logDir?: string;       // Directory for log files (default: 'logs')
  maxFiles?: string;     // How long to keep files (default: '14d')
  maxSize?: string;      // Max size per file (default: '10m')
  console?: boolean;     // Enable console output (default: true)
}
```

## Environment Variables

- `LOG_LEVEL` - Set the minimum log level (debug, info, warn, error)
- `NODE_ENV` - Production mode disables console colors

## Testing

For testing, use the included ConsoleLogger:

```typescript
import { ConsoleLogger } from '@h1b/logger';

const mockLogger = new ConsoleLogger();
// Use in tests without file I/O
```

## Migration from Inline Implementation

If you're migrating from an inline WinstonLogger:

```typescript
// Before
import { WinstonLogger } from './services/WinstonLogger';

// After
import { WinstonLogger } from '@h1b/logger';
```

The API is 100% compatible - just update the import path.

## License

MIT