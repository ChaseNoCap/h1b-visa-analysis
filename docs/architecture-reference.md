# Architecture Reference

## Overview

This reference consolidates the architectural patterns, technical decisions, and shared code analysis for the H1B monorepo, providing a comprehensive guide to the system's design and implementation.

## Core Architecture

### Tech Stack
- **TypeScript** - ES2022 modules with strict mode
- **Inversify** - Dependency injection with decorators
- **Winston** - Structured logging with rotation
- **Vitest** - Testing framework
- **ESLint + Prettier** - Code quality

### Architectural Patterns

#### 1. Dependency Injection (DI)
All services use interface-first design with Inversify:

```typescript
// Define interface
export interface IService {
  doWork(): Promise<Result>;
}

// Define token
export const TYPES = {
  IService: Symbol.for('IService'),
};

// Implement service
@injectable()
export class Service implements IService {
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.ICache) private cache: ICache
  ) {}
  
  async doWork(): Promise<Result> {
    this.logger.info('Working...');
    // Implementation
  }
}

// Container configuration
container.bind<IService>(TYPES.IService).to(Service);
```

#### 2. Interface-First Design
Every service starts with an interface:
- Defines the contract
- Enables testing with mocks
- Supports multiple implementations
- Clear API boundaries

#### 3. Result Pattern
Consistent error handling:
```typescript
export interface IResult<T> {
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

#### 4. Event-Driven Architecture
Optional event system for debugging:
```typescript
@injectable()
export class Service {
  constructor(@inject(TYPES.IEventBus) eventBus: IEventBus) {
    setEventBus(this, eventBus);
  }
  
  @Emits('service.operation')
  @Traces({ threshold: 500 })
  async doWork(): Promise<Result> {
    // Events automatically emitted
  }
}
```

## Project Structure

### Standard Package Layout

Packages in this monorepo follow a flexible structure based on their needs:

**Common Structure:**
```
package/
├── src/
│   ├── index.ts        # Public exports (always present)
│   └── [feature-based organization varies by package]
├── tests/              # Test files
├── dist/               # Compiled output
├── CLAUDE.md           # Context documentation
└── package.json        # Dependencies
```

**Actual Package Structures:**
- **Simple packages** (e.g., file-system): Flat structure with interfaces and implementations in src/
- **Feature-based packages** (e.g., di-framework): Organized by feature (container/, tokens/, testing/, etc.)
- **Decorator packages** (e.g., cache, event-system): Organized by type (decorators/, implementations/, interfaces/)

### Main Application Structure
```
h1b-visa-analysis/
├── src/
│   ├── core/
│   │   ├── constants/      # Injection tokens
│   │   ├── container/      # DI setup
│   │   └── interfaces/     # Core contracts
│   ├── services/           # Business logic
│   └── index.ts           # Public API
├── packages/              # Extracted packages
├── tests/                 # Test suites
└── dist/                  # Build output
```

## Shared Patterns

### Logging Strategy
Consistent Winston configuration:
- Console output with colors
- Daily rotating file logs
- Structured JSON format
- Context-aware child loggers

```typescript
const logger = container.get<ILogger>(TYPES.ILogger);
const childLogger = logger.child({ service: 'MyService' });
childLogger.info('Operation started', { userId: 123 });
```

### Testing Approach

#### Unit Tests
- Mock dependencies via DI
- Test public interfaces
- 90%+ coverage target
- Focus on behavior

```typescript
describe('Service', () => {
  const { container, mocks } = setupTest({
    useMocks: ['logger', 'cache']
  });
  
  it('should work', async () => {
    const service = container.get<IService>(TYPES.IService);
    const result = await service.doWork();
    expect(result.success).toBe(true);
  });
});
```

#### E2E Tests
- Use real implementations
- Test complete workflows
- Verify integrations
- Output to gitignored dirs

### Error Handling
Domain-specific error types:
```typescript
export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: unknown
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}
```

## Decorator Ecosystem

### Available Decorators

#### From logger package
- `@LogMethod` - Automatic method logging

#### From cache package
- `@Cacheable` - Method result caching
- `@InvalidateCache` - Cache invalidation

#### From event-system
- `@Emits` - Event emission
- `@Traces` - Performance tracking
- `@Monitors` - Health monitoring

### Usage Example
```typescript
@injectable()
export class DataService {
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.IEventBus) eventBus: IEventBus
  ) {
    setEventBus(this, eventBus);
  }

  @LogMethod({ level: 'info' })
  @Cacheable({ ttl: 60000 })
  @Emits('data.fetch')
  @Traces({ threshold: 100 })
  async fetchData(id: string): Promise<Data> {
    // All decorators work together
    return this.dataSource.find(id);
  }
}
```

## Shared Code Analysis

### Code Duplication (Pre-Decomposition)
Analysis revealed significant duplication between h1b-visa-analysis and markdown-compiler:

- **Logger**: 98% identical implementation
- **DI Setup**: 90% similar patterns
- **Interfaces**: 100% identical ILogger
- **Testing**: Same Vitest configuration

### Extracted Packages
Successfully decomposed into 8 focused packages:

1. **di-framework** - DI utilities (1,261 lines)
2. **logger** - Winston logging (136 lines)
3. **test-mocks** - Mock implementations (1,757 lines)
4. **test-helpers** - Test utilities (611 lines)
5. **file-system** - File operations (191 lines)
6. **event-system** - Event bus (source not available)
7. **cache** - Caching decorators (source not available)
8. **report-templates** - Template engine (source not available)

**Note**: Some packages have compiled distributions but source files are not currently accessible. Line counts are from actual implementation where available.

### Shared Benefits
- **Code Reduction**: ~500+ lines eliminated
- **Consistency**: Same implementations everywhere
- **Maintainability**: Single source of truth
- **Testing**: Shared mocks and helpers

## Context Validation

### Key Questions Before Changes

#### Architecture Changes
1. Does this align with DI patterns?
2. Following interface-first design?
3. Will it work with existing container?
4. Checked decision history?

#### Package Creation
1. Single clear responsibility?
2. Under 500 lines target?
3. Minimal dependencies (2-3)?
4. Can test in isolation?

#### Code Sharing
1. Used by multiple packages?
2. Cohesive responsibility?
3. Stable interface?
4. Worth the complexity?

## Best Practices

### DO
- Start with interfaces
- Inject all dependencies
- Use Result pattern
- Log with context
- Test via public API
- Keep packages small
- Document in CLAUDE.md

### DON'T
- Hardcode dependencies
- Use console.log
- Create "utils" packages
- Mix responsibilities
- Skip error handling
- Over-engineer
- Forget tests

## Configuration Standards

### TypeScript
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "strict": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Vitest
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['**/node_modules/**', '**/tests/**']
    }
  }
});
```

## Migration Guidelines

### When Extracting Packages
1. Define clear boundaries
2. Create interface first
3. Write CLAUDE.md
4. Add comprehensive tests
5. Migrate incrementally
6. Update all consumers
7. Remove old code

### Package Criteria
- Single responsibility
- Target: < 2000 lines (ideal: < 1000)
- 2-3 runtime dependencies max
- Clear, specific name
- Testable in isolation
- Documented purpose

**Note**: The original 1000-line guideline proved too restrictive. Packages like test-mocks (1,757 lines) and di-framework (1,261 lines) exceed this but maintain clear single responsibilities. The key is cohesion over arbitrary size limits.

## Future Considerations

### Potential Enhancements
1. **Performance Monitoring** - APM integration
2. **Distributed Tracing** - Cross-service tracking
3. **Service Mesh** - For microservices
4. **GraphQL** - Unified API layer

### Scaling Patterns
1. **Horizontal Scaling** - Stateless services
2. **Caching Layers** - Redis integration
3. **Queue Systems** - Async processing
4. **Database Sharding** - Data partitioning

---

*This reference consolidates shared-architecture.md, shared-code-analysis.md, and context-validation.md into a single architectural guide.*