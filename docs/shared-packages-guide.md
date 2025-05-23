# Shared Packages Guide

## Overview

This guide helps developers understand and use the shared packages in the H1B monorepo.

**IMPORTANT**: Based on our decomposition analysis, all packages should be SMALL and FOCUSED. Each package should:
- Do ONE thing well
- Be under 500 lines of code
- Have 2-3 dependencies maximum
- Be understandable in 5 minutes

## Package Naming Convention

Packages use clear prefixes to indicate their purpose:
- `@h1b/test-*` - Testing utilities (mocks, helpers, fixtures)
- `@h1b/*` - Core functionality (no prefix needed)

## Package Structure

All shared packages follow a consistent structure:

### For Small Packages (Preferred):
```
packages/shared/{package-name}/
├── src/
│   ├── interface.ts    # THE main interface
│   ├── implementation.ts # THE implementation
│   ├── types.ts        # Shared types (if needed)
│   └── index.ts        # Exports
├── tests/              # Simple test file(s)
├── package.json        # Minimal dependencies
├── tsconfig.json       # Extends base config
├── CLAUDE.md          # REQUIRED context file
└── README.md          # One-page documentation
```

### For Slightly Larger Packages (Use Sparingly):
```
packages/shared/{package-name}/
├── src/
│   ├── interfaces/     # 2-3 interfaces MAX
│   ├── implementations/ # 2-3 classes MAX
│   └── index.ts        # Main exports
├── tests/              # Test files
├── CLAUDE.md          # REQUIRED context file
└── README.md          # Package documentation
```

## Package Design Principles

### Small is Beautiful
- **Target**: <500 lines of code per package
- **Interfaces**: 1 main interface, 3-5 methods max
- **Dependencies**: 2-3 maximum
- **Understanding**: New dev should grasp it in 5 minutes

### Single Responsibility
- One package = One job
- If you use "and" to describe it, split it
- No "utils" or "helpers" packages (too vague)
- Clear, specific naming

### Examples of Good vs Bad Packages

**Good** ✅
- @h1b/mock-logger - Mock implementation of ILogger
- @h1b/test-fixtures - Load test fixtures from disk
- @h1b/async-retry - Retry async operations

**Bad** ❌
- @h1b/testing - Too broad, does too many things
- @h1b/utils - Vague, becomes a dumping ground
- @h1b/core - What is "core"? Be specific!

## Available Packages

### Testing Packages (Priority 1 - Consolidated by Purpose)

#### @h1b/test-mocks (Planned)
- **Purpose**: All mock implementations for testing
- **Size**: ~600 lines
- **Includes**:
  - MockLogger - In-memory logger for tests
  - MockFileSystem - In-memory file system
  - MockCache - In-memory cache
- **Usage**: 
  ```typescript
  import { MockLogger, MockFileSystem, MockCache } from '@h1b/test-mocks';
  ```

#### @h1b/test-helpers (Planned)
- **Purpose**: Test setup and utilities
- **Size**: ~550 lines
- **Includes**:
  - Test container setup and utilities
  - Fixture loading and management
  - Async test helpers (waitFor, measureTime)
  - Common test patterns
- **Usage**: 
  ```typescript
  import { createTestContainer, loadFixture, waitFor } from '@h1b/test-helpers';
  ```

### Other Packages

#### @h1b/logger (Ready)
- **Purpose**: Centralized logging with Winston and logging decorators
- **Size**: ~500 lines
- **Includes**:
  - Winston logger factory
  - ILogger interface
  - @LogMethod decorator
  - @LogClass decorator
  - Log level configuration
- **Usage**: 
  ```typescript
  import { createLogger, LogMethod } from '@h1b/logger';
  ```

#### @h1b/di-framework (Planned)
- **Purpose**: Dependency injection utilities and container setup
- **Size**: ~400 lines
- **Includes**:
  - Container factory functions
  - Common injection tokens
  - DI helper decorators
  - Type definitions for DI
- **Usage**: `import { createContainer, TYPES } from '@h1b/di-framework'`

### @h1b/file-system (Planned)
- **Purpose**: File system abstractions
- **Status**: Week 5 of migration plan
- **Usage**: `import { IFileSystem } from '@h1b/file-system'`

### @h1b/cache (Planned)
- **Purpose**: Caching implementations and cache decorators
- **Size**: ~450 lines
- **Includes**:
  - MemoryCache implementation
  - ICache interface
  - @Cacheable decorator
  - @CacheInvalidate decorator
  - Cache key generators
- **Status**: Week 6 of migration plan
- **Usage**: 
  ```typescript
  import { MemoryCache, Cacheable } from '@h1b/cache';
  ```

## Using Shared Packages

### During Development

Since packages are in the same monorepo, npm workspaces handles linking:

```json
{
  "dependencies": {
    "@h1b/logger": "0.1.0"
  }
}
```

Then in your code:
```typescript
import { createLogger } from '@h1b/logger';
const logger = createLogger('my-service');
```

### TypeScript Configuration

Shared packages are included in the TypeScript project references:

```json
{
  "compilerOptions": {
    "paths": {
      "@h1b/*": ["packages/shared/*/src"]
    }
  }
}
```

## Creating a New Shared Package

1. **Create Structure**
   ```bash
   mkdir -p packages/shared/{name}/{src,tests}
   cd packages/shared/{name}
   ```

2. **Initialize Package**
   ```bash
   npm init -y
   # Update package.json with proper name and config
   ```

3. **Copy Configurations**
   ```bash
   cp ../logger/tsconfig.json .
   cp ../logger/vitest.config.ts .
   ```

4. **Implement Code**
   - Extract from source projects
   - Refactor for reusability
   - Add comprehensive tests

5. **Update Consumers**
   - Replace inline implementations
   - Update imports
   - Remove duplicated code

## Best Practices

### Interface Design
- Always define interfaces first
- Keep interfaces minimal and focused
- Use generic types where appropriate

### Implementation
- One class per file
- Injectable with decorators
- Configurable via options
- Sensible defaults

### Testing
- Unit test all public methods
- Integration tests for complex scenarios
- Mock implementations for testing
- 90%+ coverage target

### Documentation
- README with examples
- JSDoc for public APIs
- Migration guide from inline code
- Changelog for versions

## Common Patterns

### Factory Functions
```typescript
export function createService(options?: IServiceOptions): IService {
  const config = { ...defaultOptions, ...options };
  return new ServiceImpl(config);
}
```

### Dependency Injection
```typescript
@injectable()
export class Service implements IService {
  constructor(
    @inject(TYPES.IDependency) private dep: IDependency
  ) {}
}
```

### Error Handling
```typescript
export class ServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'ServiceError';
  }
}
```

## Versioning

All packages start at 0.1.0 and follow semantic versioning:
- **Patch** (0.1.x): Bug fixes
- **Minor** (0.x.0): New features, backward compatible
- **Major** (x.0.0): Breaking changes

Since packages are in the monorepo, we can coordinate updates.

## Troubleshooting

### Import Errors
- Ensure package is built: `npm run build`
- Check tsconfig paths configuration
- Verify package.json exports

### Type Errors
- Rebuild all packages: `npm run build:all`
- Check TypeScript project references
- Ensure interfaces are exported

### Test Failures
- Run tests in isolation: `cd packages/shared/{name} && npm test`
- Check mock implementations
- Verify test fixtures

## Future Considerations

1. **NPM Publishing**: Packages could be published for external use
2. **Monorepo Tools**: Consider Lerna or Nx for management
3. **Documentation Site**: Generate docs from TSDoc comments
4. **Performance Monitoring**: Add metrics to shared services

## Questions?

See the migration plan (`docs/migration-plan.md`) for detailed information about the extraction process.