# Shared Packages Guide

## Overview

This guide helps developers understand and use the shared packages in the H1B monorepo.

## Package Structure

All shared packages follow a consistent structure:

```
packages/shared/{package-name}/
├── src/
│   ├── interfaces/      # Public interfaces
│   ├── implementations/ # Concrete implementations
│   ├── utils/          # Helper functions
│   └── index.ts        # Main exports
├── tests/              # Test files
├── dist/               # Compiled output (gitignored)
├── package.json        # Package configuration
├── tsconfig.json       # TypeScript config
├── vitest.config.ts    # Test configuration
└── README.md           # Package documentation
```

## Available Packages

### @h1b/logger (Ready)
- **Purpose**: Centralized logging with Winston
- **Status**: Structure created, ready for implementation
- **Usage**: `import { createLogger } from '@h1b/logger'`

### @h1b/core (Planned)
- **Purpose**: Core utilities and DI helpers
- **Status**: Week 2 of migration plan
- **Usage**: `import { Container, IResult } from '@h1b/core'`

### @h1b/decorators (Planned)
- **Purpose**: Reusable TypeScript decorators
- **Status**: Week 3 of migration plan
- **Usage**: `import { Cacheable, LogMethod } from '@h1b/decorators'`

### @h1b/testing (Planned)
- **Purpose**: Test utilities and mocks
- **Status**: Week 4 of migration plan
- **Usage**: `import { createTestContainer } from '@h1b/testing'`

### @h1b/file-system (Planned)
- **Purpose**: File system abstractions
- **Status**: Week 5 of migration plan
- **Usage**: `import { IFileSystem } from '@h1b/file-system'`

### @h1b/cache (Planned)
- **Purpose**: Caching implementations
- **Status**: Week 6 of migration plan
- **Usage**: `import { MemoryCache } from '@h1b/cache'`

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