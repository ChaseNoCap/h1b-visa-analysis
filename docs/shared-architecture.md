# Shared Architecture Documentation

## Overview

As of May 2025, the h1b-visa-analysis monorepo has standardized on a consistent architecture across all packages. Both the main project and the markdown-compiler package share the same patterns, making it easier to maintain and potentially extract shared libraries.

## Shared Tech Stack

### Core Technologies
- **TypeScript** - ES2022 modules with strict mode
- **Inversify** - Dependency injection with decorators
- **Winston** - Logging with daily rotation
- **Vitest** - Testing framework for unit and E2E tests
- **ESLint + Prettier** - Code quality and formatting

### Configuration Files
All packages use identical configurations:
- `tsconfig.json` - Same TypeScript settings
- `vitest.config.ts` - Same test configuration
- `.eslintrc.json` - Same linting rules
- `.prettierrc` - Same formatting rules
- `.github/actionlint.yaml` - GitHub Actions linting
- `.vscode/settings.json` - VSCode integration
- `.yamllint.yml` - YAML file linting

## Architectural Patterns

### 1. Dependency Injection

All services are defined as interfaces and injected using Inversify:

```typescript
// Define interface
export interface IService {
  doWork(): Promise<Result>;
}

// Define injection token
export const TYPES = {
  IService: Symbol.for('IService'),
};

// Implement service
@injectable()
export class Service implements IService {
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger
  ) {}
  
  async doWork(): Promise<Result> {
    this.logger.info('Working...');
    // Implementation
  }
}

// Container configuration
container.bind<IService>(TYPES.IService).to(Service);
```

### 2. Logging Strategy

Winston logger with consistent configuration:
- Console output with colors
- Daily rotating file logs
- JSON format for structured logging
- Context-aware child loggers
- Environment-based log levels

```typescript
const logger = container.get<ILogger>(TYPES.ILogger);
logger.info('Operation started', { context: 'value' });

// Child logger with context
const childLogger = logger.child({ requestId: '123' });
```

### 3. Testing Approach

#### E2E Tests
- Located in `tests/e2e/`
- Test complete workflows
- Use real implementations via DI
- Generate output in gitignored directories

#### Unit Tests
- Located in `tests/unit/`
- Mock dependencies via DI
- High coverage targets (80-90%)
- Use Sinon for stubs/spies

#### Test Organization
```
tests/
├── e2e/
│   ├── fixtures/      # Test data
│   ├── output/        # Test output (gitignored)
│   └── *.test.ts      # E2E test files
├── unit/
│   └── services/      # Unit tests by service
└── setup.ts           # Test setup
```

### 4. Error Handling

Consistent error handling pattern:
```typescript
interface IResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  metadata?: Record<string, unknown>;
}

async function operation(): Promise<IResult<Data>> {
  try {
    const data = await doWork();
    return { success: true, data };
  } catch (error) {
    logger.error('Operation failed', error as Error);
    return { success: false, error: error as Error };
  }
}
```

## Project Structure

Both projects follow the same structure:

```
project/
├── src/
│   ├── core/
│   │   ├── constants/      # Injection tokens
│   │   ├── container/      # DI container setup
│   │   ├── interfaces/     # TypeScript interfaces
│   │   └── decorators/     # Custom decorators
│   ├── services/           # Injectable services
│   └── index.ts           # Main entry
├── tests/
│   ├── e2e/               # End-to-end tests
│   └── unit/              # Unit tests
├── logs/                  # Rotating logs (gitignored)
├── dist/                  # Build output (gitignored)
└── [config files]         # Shared configurations
```

## Available Decorators

### From markdown-compiler (can be extracted):

1. **@Cacheable** - Method result caching with TTL
2. **@InvalidateCache** - Clear cache entries
3. **@LogMethod** - Automatic method logging
4. **@Validate** - Parameter validation

## Shared Services

Services that could be extracted to shared libraries:

### 1. WinstonLogger
- Same implementation in both projects
- Daily rotation configuration
- Context-aware child loggers

### 2. FileSystem Abstractions
- IFileSystem interface
- NodeFileSystem implementation
- MemoryFileSystem for testing

### 3. Cache Decorators
- Cacheable with TTL and conditions
- Cache invalidation patterns

### 4. Testing Utilities
- Container setup helpers
- Mock factories
- Fixture management

## Benefits of Shared Architecture

1. **Consistency** - Same patterns everywhere
2. **Maintainability** - Fix once, apply everywhere
3. **Developer Experience** - Learn once, use everywhere
4. **Code Reuse** - Easy to extract shared libraries
5. **Testing** - Same testing strategies
6. **Debugging** - Unified logging and error handling

## Future Shared Libraries

Based on current usage, these packages could be extracted:

### @h1b/logger
```json
{
  "dependencies": {
    "winston": "^3.11.0",
    "winston-daily-rotate-file": "^4.7.1"
  }
}
```

### @h1b/testing
```json
{
  "dependencies": {
    "vitest": "^0.34.0",
    "sinon": "^17.0.1",
    "@vitest/coverage-v8": "^0.34.0"
  }
}
```

### @h1b/cache
```json
{
  "dependencies": {
    "reflect-metadata": "^0.2.1"
  }
}
```

### @h1b/di-core
```json
{
  "dependencies": {
    "inversify": "^6.0.2",
    "reflect-metadata": "^0.2.1"
  }
}
```

## Migration Path

To extract shared libraries:

1. **Identify Common Code** - Logger, cache, testing utilities
2. **Create Package Structure** - Under packages/shared/
3. **Extract Interfaces First** - ILogger, IFileSystem, etc.
4. **Move Implementations** - With tests
5. **Update Imports** - In consuming packages
6. **Publish or Link** - Via npm workspaces

## Best Practices

1. **Interface First** - Always define interfaces
2. **Inject Dependencies** - Never hardcode dependencies
3. **Test via DI** - Mock at container level
4. **Log Everything** - With context
5. **Handle Errors** - Return Result types
6. **Document Patterns** - In CLAUDE.md files

## Conclusion

The shared architecture provides a solid foundation for the monorepo. As the project grows, common patterns can be easily extracted into shared libraries while maintaining consistency across all packages.