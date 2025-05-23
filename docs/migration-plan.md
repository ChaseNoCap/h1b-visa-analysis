# Shared Libraries Migration Plan

## Executive Summary

This document outlines a concrete plan to decompose common concerns from the h1b-visa-analysis and markdown-compiler projects into shared packages. The migration will improve code reuse, consistency, and maintainability across the monorepo.

## UPDATE: Priority Change (May 2025)

**The @h1b/testing package is now the first priority.** After analysis, we've determined that having robust testing utilities in place will:
- Ensure quality of all subsequent shared packages
- Provide immediate value to developers
- Establish testing patterns from the start

See `testing-package-implementation.md` for the detailed implementation plan.

## Goals

1. **Eliminate Code Duplication** - Extract identical implementations
2. **Standardize Patterns** - Ensure consistent architecture
3. **Enable Code Sharing** - Create reusable packages
4. **Maintain Backward Compatibility** - No breaking changes
5. **Improve Developer Experience** - Single source of truth

## Shared Packages Architecture

```
packages/
├── shared/
│   ├── logger/           # @h1b/logger
│   ├── core/            # @h1b/core
│   ├── testing/         # @h1b/testing
│   ├── decorators/      # @h1b/decorators
│   ├── file-system/     # @h1b/file-system
│   └── cache/           # @h1b/cache
├── markdown-compiler/
├── prompts-shared/
└── report-components/
```

## Phase 1: Logger Package (Week 1)

### Package: @h1b/logger

**Why First**: Highest duplication (98%), clearest boundaries, immediate value

#### Structure
```
packages/shared/logger/
├── src/
│   ├── interfaces/
│   │   └── ILogger.ts
│   ├── implementations/
│   │   ├── WinstonLogger.ts
│   │   └── ConsoleLogger.ts
│   ├── factories/
│   │   └── createLogger.ts
│   └── index.ts
├── tests/
├── package.json
├── tsconfig.json
└── README.md
```

#### Tasks
- [ ] Create package structure
- [ ] Extract ILogger interface from both projects
- [ ] Move WinstonLogger implementation
- [ ] Add ConsoleLogger for testing
- [ ] Create factory function
- [ ] Write comprehensive tests
- [ ] Update both projects to use @h1b/logger
- [ ] Remove duplicated code

#### API Design
```typescript
// Simple usage
import { createLogger } from '@h1b/logger';
const logger = createLogger('my-service');

// Advanced usage
import { WinstonLogger, ILoggerConfig } from '@h1b/logger';
const config: ILoggerConfig = {
  service: 'my-service',
  level: 'debug',
  logDir: './logs',
  maxFiles: '30d'
};
const logger = new WinstonLogger(config);
```

## Phase 2: Core Package (Week 2)

### Package: @h1b/core

**Why Second**: Foundation for other packages, establishes patterns

#### Structure
```
packages/shared/core/
├── src/
│   ├── di/
│   │   ├── container.ts
│   │   ├── decorators.ts
│   │   └── types.ts
│   ├── interfaces/
│   │   ├── IDisposable.ts
│   │   ├── IInitializable.ts
│   │   └── IResult.ts
│   ├── errors/
│   │   ├── BaseError.ts
│   │   └── ValidationError.ts
│   └── index.ts
```

#### Tasks
- [ ] Create base DI utilities
- [ ] Extract common interfaces
- [ ] Create base error classes
- [ ] Add Result<T> type pattern
- [ ] Write container helpers
- [ ] Document patterns

#### Shared Types
```typescript
// Result pattern
export interface IResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  metadata?: Record<string, unknown>;
}

// Lifecycle interfaces
export interface IInitializable {
  initialize(): Promise<void>;
}

export interface IDisposable {
  dispose(): Promise<void>;
}
```

## Phase 3: Decorators Package (Week 3)

### Package: @h1b/decorators

**Why Third**: Unique to markdown-compiler, high value for all packages

#### Structure
```
packages/shared/decorators/
├── src/
│   ├── cache/
│   │   ├── Cacheable.ts
│   │   ├── InvalidateCache.ts
│   │   └── CacheManager.ts
│   ├── logging/
│   │   └── LogMethod.ts
│   ├── validation/
│   │   ├── Validate.ts
│   │   └── validators.ts
│   └── index.ts
```

#### Tasks
- [ ] Extract cache decorators from markdown-compiler
- [ ] Extract logging decorator
- [ ] Extract validation decorators
- [ ] Create decorator utilities
- [ ] Add to h1b-visa-analysis
- [ ] Write decorator tests

## Phase 4: Testing Package (Week 4)

### Package: @h1b/testing

**Why Fourth**: Improves test consistency and quality

#### Structure
```
packages/shared/testing/
├── src/
│   ├── container/
│   │   └── TestContainer.ts
│   ├── mocks/
│   │   ├── MockLogger.ts
│   │   └── MockFileSystem.ts
│   ├── fixtures/
│   │   └── FixtureManager.ts
│   ├── config/
│   │   └── vitest.shared.ts
│   └── index.ts
```

#### Tasks
- [ ] Create test container factory
- [ ] Build mock implementations
- [ ] Extract fixture utilities
- [ ] Share vitest configuration
- [ ] Create test helpers
- [ ] Document testing patterns

## Phase 5: File System Package (Week 5)

### Package: @h1b/file-system

**Why Fifth**: Used by multiple services, good abstraction

#### Structure
```
packages/shared/file-system/
├── src/
│   ├── interfaces/
│   │   └── IFileSystem.ts
│   ├── implementations/
│   │   ├── NodeFileSystem.ts
│   │   └── MemoryFileSystem.ts
│   ├── utils/
│   │   └── pathUtils.ts
│   └── index.ts
```

#### Tasks
- [ ] Extract IFileSystem interface
- [ ] Move implementations
- [ ] Add path utilities
- [ ] Create stream support
- [ ] Write comprehensive tests
- [ ] Update consumers

## Phase 6: Cache Package (Week 6)

### Package: @h1b/cache

**Why Last**: Builds on decorators, most complex

#### Structure
```
packages/shared/cache/
├── src/
│   ├── interfaces/
│   │   └── ICache.ts
│   ├── implementations/
│   │   ├── MemoryCache.ts
│   │   └── RedisCache.ts
│   ├── strategies/
│   │   ├── LRU.ts
│   │   └── TTL.ts
│   └── index.ts
```

#### Tasks
- [ ] Define cache interfaces
- [ ] Implement memory cache
- [ ] Add Redis support (future)
- [ ] Create cache strategies
- [ ] Integrate with decorators
- [ ] Performance testing

## Migration Steps for Each Package

### 1. Setup Phase
```bash
# Create package structure
mkdir -p packages/shared/{package-name}/src
cd packages/shared/{package-name}

# Initialize package
npm init -y
npm install --save-dev typescript vitest @types/node

# Copy configurations
cp ../../../tsconfig.json .
cp ../../../vitest.config.ts .
```

### 2. Development Phase
- Extract code from source projects
- Refactor for reusability
- Add comprehensive tests
- Document public API
- Create examples

### 3. Integration Phase
- Update source projects to use shared package
- Remove duplicated code
- Run all tests
- Update documentation
- Create migration guide

### 4. Release Phase
- Version the package
- Update CHANGELOG
- Tag release
- Update consuming projects

## Technical Considerations

### TypeScript Configuration
All shared packages use the same base tsconfig:
```json
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.test.ts", "**/*.spec.ts"]
}
```

### Package.json Template
```json
{
  "name": "@h1b/{package}",
  "version": "0.1.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist", "README.md"],
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "test:watch": "vitest watch"
  }
}
```

### Testing Strategy
- Unit tests for all public APIs
- Integration tests for complex scenarios
- Mock implementations for testing
- Minimum 90% coverage

### Documentation Requirements
Each package must include:
- README.md with examples
- API documentation
- Migration guide
- CHANGELOG.md

## Success Metrics

1. **Code Reduction**
   - Remove 500+ lines of duplicated code
   - Single source of truth for each concern

2. **Consistency**
   - All projects use same implementations
   - Unified logging and error handling

3. **Developer Experience**
   - Clear documentation
   - Easy to use APIs
   - Good TypeScript support

4. **Quality**
   - 90%+ test coverage
   - No breaking changes
   - Performance maintained

## Rollback Plan

If issues arise:
1. Packages remain in monorepo (not published)
2. Original code still in git history
3. Can revert package.json dependencies
4. Gradual rollout per package

## Timeline

| Week | Package | Priority | Risk |
|------|---------|----------|------|
| 1 | @h1b/logger | High | Low |
| 2 | @h1b/core | High | Medium |
| 3 | @h1b/decorators | Medium | Medium |
| 4 | @h1b/testing | Medium | Low |
| 5 | @h1b/file-system | Low | Low |
| 6 | @h1b/cache | Low | High |

## Next Steps

1. Review and approve this plan
2. Create shared/ directory structure
3. Start with @h1b/logger package
4. Set up CI/CD for shared packages
5. Create package documentation templates

## Appendix: File Mappings

### Logger Package Sources
- `/src/services/WinstonLogger.ts` → `@h1b/logger/src/implementations/WinstonLogger.ts`
- `/src/core/interfaces/ILogger.ts` → `@h1b/logger/src/interfaces/ILogger.ts`
- `/packages/markdown-compiler/src/services/WinstonLogger.ts` → (remove, use shared)
- `/packages/markdown-compiler/src/core/interfaces/ILogger.ts` → (remove, use shared)

### Core Package Sources
- `/src/core/constants/injection-tokens.ts` → `@h1b/core/src/di/types.ts`
- `/src/core/container/container.ts` → `@h1b/core/src/di/container.ts`
- Similar files from markdown-compiler

### Decorators Package Sources
- `/packages/markdown-compiler/src/core/decorators/*.ts` → `@h1b/decorators/src/*`
- New decorators to be added to h1b-visa-analysis

This migration plan provides a clear path forward with minimal risk and maximum benefit.