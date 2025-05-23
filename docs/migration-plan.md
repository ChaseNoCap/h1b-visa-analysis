# Shared Libraries Migration Plan

## Executive Summary

This document outlines a concrete plan to decompose common concerns from the h1b-visa-analysis and markdown-compiler projects into shared packages. The migration will improve code reuse, consistency, and maintainability across the monorepo while maintaining small, focused contexts per project.

**Note on Decorators**: Decorators are intentionally kept with their related functionality rather than in a separate package. This keeps related code together and reduces cross-package dependencies:
- Logging decorators (e.g., LogMethod) are part of @h1b/logger
- Caching decorators (e.g., Cacheable, InvalidateCache) are part of @h1b/cache
- Future validation decorators would be part of a potential @h1b/validation package

## Related Documents

- **[Decomposition Analysis](./decomposition-analysis.md)**: Comprehensive analysis of decomposition patterns and strategies for maintaining smaller contexts
- **[Testing Package Implementation](./testing-package-implementation.md)**: Detailed plan for the @h1b/testing package (current priority)
- **[Decomposition Principles](./decomposition-principles.md)**: Core principles guiding package design decisions
- **[Implementation Roadmap](./implementation-roadmap.md)**: Concrete timeline and checkpoints for migration

## UPDATE: Priority Change (May 2025)

**The @h1b/testing package is now the first priority.** After analysis, we've determined that having robust testing utilities in place will:
- Ensure quality of all subsequent shared packages
- Provide immediate value to developers
- Establish testing patterns from the start

**CRITICAL UPDATE**: Based on decomposition analysis, @h1b/testing is TOO BIG and should be split into:
- @h1b/test-container (DI setup)
- @h1b/mock-logger (logger mocks)
- @h1b/mock-fs (file system mocks)
- @h1b/test-fixtures (fixture loading)
- @h1b/test-utils (async helpers)

Each package should be under 500 lines with a single responsibility.

See [`testing-package-implementation.md`](./testing-package-implementation.md) for the detailed implementation plan.

## Goals

1. **Eliminate Code Duplication** - Extract identical implementations
2. **Standardize Patterns** - Ensure consistent architecture
3. **Enable Code Sharing** - Create reusable packages
4. **Maintain Backward Compatibility** - No breaking changes
5. **Improve Developer Experience** - Single source of truth
6. **Maintain Small Contexts** - Each package focused on a single bounded context
7. **Support Vertical Slicing** - Enable feature-based organization

## Shared Packages Architecture

```
packages/
├── shared/
│   ├── logger/           # @h1b/logger - Logging context (includes logging decorators)
│   ├── di-framework/    # @h1b/di-framework - Dependency injection utilities
│   ├── testing/         # @h1b/testing - Testing context
│   ├── file-system/     # @h1b/file-system - File operations context
│   ├── cache/           # @h1b/cache - Caching context (includes cache decorators)
│   └── events/          # @h1b/events - Event bus for decoupling
├── markdown-compiler/    # Markdown processing context
├── prompts-shared/      # AI workflows context
└── report-components/   # Report content context
```

### Context Boundaries

Each package represents a bounded context with:
- **Clear Public API**: Only necessary interfaces exported
- **Internal Implementation**: Hidden from consumers
- **Explicit Dependencies**: Declared through DI container
- **Event Integration**: Optional event-driven communication

## Migration Principles

Based on the [decomposition analysis](./decomposition-analysis.md), all migrations must follow these principles. For the complete guide, see [Decomposition Principles](./decomposition-principles.md):

### 1. Small Context Design
- Each package focuses on ONE bounded context
- Minimize public API surface area
- Hide implementation details completely
- Use adapters for cross-context communication

### 2. Vertical Feature Slicing (When Applicable)
For packages with multiple features, organize by feature rather than technical layer:
```
package/
├── src/
│   ├── feature-a/        # Complete feature including interfaces, services, tests
│   ├── feature-b/        # Another complete feature
│   └── shared/           # Only truly shared code
```

### 3. Event-Driven Decoupling
When contexts need to communicate without tight coupling:
- Use domain events for notifications
- Implement event bus for loose coupling
- Document all events in context boundaries

### 4. Anti-Corruption Layers
Protect contexts from external changes:
- Create adapters for external APIs
- Transform external models to internal ones
- Isolate third-party dependencies

## Phase 1: Logger Package (Week 1)

### Package: @h1b/logger

**Why First**: Highest duplication (98%), clearest boundaries, immediate value

#### Structure
```
packages/shared/logger/
├── src/
│   ├── interfaces/
│   │   └── ILogger.ts          # Public API
│   ├── implementations/
│   │   ├── WinstonLogger.ts    # Internal
│   │   └── ConsoleLogger.ts    # Internal
│   ├── decorators/             # Logging decorators included here
│   │   └── LogMethod.ts        # Public API
│   ├── factories/
│   │   └── createLogger.ts     # Public API
│   └── index.ts                # Explicit exports only
├── tests/
├── CLAUDE.md                   # Context documentation
├── package.json
├── tsconfig.json
└── README.md
```

#### Context Boundary
- **Public**: ILogger interface, createLogger factory, LogMethod decorator
- **Internal**: All implementations, configuration details
- **Events**: None (logging is synchronous)

#### Tasks
- [ ] Create package structure
- [ ] Extract ILogger interface from both projects
- [ ] Move WinstonLogger implementation
- [ ] Add ConsoleLogger for testing
- [ ] Extract LogMethod decorator from markdown-compiler
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

## Phase 2: DI Framework Package (Week 2)

### Package: @h1b/di-framework

**Why Second**: Foundation for other packages, establishes patterns

#### Structure
```
packages/shared/di-framework/
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

## Phase 3: File System Package (Week 3)

### Package: @h1b/file-system

**Why Third**: Used by multiple services, good abstraction

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

## Phase 5: Events Package (Week 5)

### Package: @h1b/events

**Why Fifth**: Enables decoupling between contexts, simpler than cache

#### Structure
```
packages/shared/events/
├── src/
│   ├── interfaces/
│   │   ├── IEventBus.ts        # Public API
│   │   └── IDomainEvent.ts     # Public API
│   ├── implementations/
│   │   ├── EventBus.ts         # Internal
│   │   └── AsyncEventBus.ts    # Internal
│   ├── decorators/
│   │   └── EventHandler.ts     # Public API
│   └── index.ts
├── tests/
├── CLAUDE.md
└── package.json
```

#### Context Boundary
- **Public**: IEventBus, IDomainEvent, EventHandler decorator
- **Internal**: EventBus implementations
- **Purpose**: Enable loose coupling between bounded contexts

#### Tasks
- [ ] Define event interfaces
- [ ] Implement synchronous event bus
- [ ] Add async event support
- [ ] Create event handler decorator
- [ ] Add event replay capability
- [ ] Document event patterns

## Phase 6: Cache Package (Week 6)

### Package: @h1b/cache

**Why Sixth**: Builds on events for invalidation, includes cache decorators

#### Structure
```
packages/shared/cache/
├── src/
│   ├── interfaces/
│   │   └── ICache.ts           # Public API
│   ├── implementations/
│   │   ├── MemoryCache.ts      # Internal
│   │   └── RedisCache.ts       # Internal (future)
│   ├── strategies/
│   │   ├── LRU.ts              # Internal
│   │   └── TTL.ts              # Internal
│   ├── decorators/              # Cache decorators live here
│   │   ├── Cacheable.ts
│   │   ├── InvalidateCache.ts
│   │   └── CacheManager.ts
│   ├── events/
│   │   └── CacheEvents.ts      # Cache invalidation events
│   └── index.ts
├── tests/
├── CLAUDE.md
└── package.json
```

#### Context Boundary
- **Public**: ICache interface, cache decorators (Cacheable, InvalidateCache)
- **Internal**: All implementations and strategies
- **Events**: CACHE_INVALIDATED, CACHE_CLEARED

#### Tasks
- [ ] Define cache interfaces
- [ ] Implement memory cache
- [ ] Create cache strategies
- [ ] Extract cache decorators from markdown-compiler
- [ ] Integrate with event bus for invalidation
- [ ] Add Redis support (future)
- [ ] Performance testing


## Migration Steps for Each Package

### 1. Setup Phase
```bash
# Create package structure
mkdir -p packages/{package-name}/src
cd packages/{package-name}

# Initialize package
npm init -y
npm install --save-dev typescript vitest @types/node

# Copy configurations
cp ../../tsconfig.json .
cp ../../vitest.config.ts .
```

#### REQUIRED: Create CLAUDE.md
Every package MUST have a CLAUDE.md file that provides context for Claude Code. Use the template at [`/docs/claude-md-template.md`](./claude-md-template.md) and include:

1. **Package Identity** - Name, purpose, status
2. **Context Boundary** - Clear definition of what's public vs internal
3. **Monorepo Context** - Dependencies and consumers
4. **Technical Architecture** - Interfaces and patterns
5. **Event Integration** - Events published/consumed (if any)
6. **Development Guidelines** - How to work with the package
7. **GitHub Integration** - Workflows and automation
8. **Common Tasks** - Step-by-step guides
9. **API Patterns** - Usage examples with explicit exports
10. **Integration Examples** - How it connects to other packages

### Context Boundary Template
```markdown
## Context Boundary

This package is part of the [Context Name] bounded context.

### Public API
- Interface1: Description
- Factory1: Description
- Type1: Description

### Internal Components (DO NOT DEPEND ON)
- Implementation1: Why it's internal
- Service1: Implementation detail

### Events
- EVENT_NAME: When fired and payload structure
```

This ensures consistent context across all packages and helps maintain architectural coherence.

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

### 4. GitHub Repository Phase
**IMPORTANT**: Following the established pattern, each package must be its own GitHub repository.

#### Steps:
1. **Initialize Git**
   ```bash
   cd packages/{package-name}
   git init
   git add .
   git commit -m "Initial commit: {package description}"
   ```

2. **Create GitHub Repository**
   - Create private repository on GitHub
   - Name: `{package-name}` (e.g., `test-mocks`, `logger`)
   - Description: Package purpose

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/{username}/{package-name}.git
   git branch -M main
   git push -u origin main
   ```

4. **Update Main Project .gitignore**
   Add the package directory to `.gitignore`:
   ```gitignore
   packages/{package-name}/
   ```

5. **Remove from Main Repo Tracking**
   ```bash
   cd {main-project-root}
   git rm -r --cached packages/{package-name}
   git add .gitignore
   git commit -m "Move {package-name} to separate GitHub repository"
   ```

### 5. Release Phase
- Version the package
- Update CHANGELOG
- Tag release in GitHub
- Update consuming projects to clone from GitHub

## Technical Considerations

### TypeScript Configuration
All shared packages use the same base tsconfig:
```json
{
  "extends": "../../tsconfig.json",
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

| Week | Package | Priority | Risk | Context Focus |
|------|---------|----------|------|---------------|
| 1 | @h1b/testing | Highest | Low | Testing utilities context |
| 2 | @h1b/logger | High | Low | Logging context (includes logging decorators) |
| 3 | @h1b/di-framework | High | Medium | Dependency injection utilities |
| 4 | @h1b/file-system | Medium | Low | File operations context |
| 5 | @h1b/events | Medium | Low | Event-driven communication |
| 6 | @h1b/cache | Low | High | Caching context (includes cache decorators) |

**Note**: Testing package moved to Week 1 as per priority change.

## Maintaining Small Contexts During Migration

Based on the decomposition analysis, follow these guidelines:

### 1. Context Size Limits
Following the guidelines in [Decomposition Principles](./decomposition-principles.md#size-limits):
- **Public API**: Maximum 5-7 exported interfaces/functions
- **Implementation Files**: Maximum 10-15 files per package
- **Dependencies**: Maximum 3-5 direct dependencies
- **Test Coverage**: Minimum 90% focusing on public API

### 2. Migration Checkpoints
Before completing each package migration:
- [ ] Verify all exports are intentional (no accidental exposure)
- [ ] Ensure no circular dependencies between contexts
- [ ] Document all integration points
- [ ] Create adapters for cross-context communication
- [ ] Test context in isolation

### 3. Refactoring Opportunities
During migration, consider:
- Splitting large interfaces into focused ones
- Extracting sub-contexts if package grows too large
- Using events instead of direct dependencies
- Creating facade patterns for complex APIs

## Next Steps

1. Review and approve this plan
2. ~~Create shared/ directory structure~~ ✅ Using flat structure
3. ~~Start with @h1b/testing package~~ ✅ Completed as test-mocks and test-helpers
4. Create GitHub repositories for each package
5. Set up CI/CD for shared packages
6. Create package documentation templates ✅ CLAUDE.md template created
7. Implement event bus infrastructure
8. Define context boundary guidelines

## Important: GitHub Repository Pattern

Each package in the monorepo follows this pattern:
1. Developed locally in `/packages/{package-name}/`
2. Pushed to its own GitHub repository
3. Added to main project's `.gitignore`
4. Cloned from GitHub for actual use

This maintains clean separation while allowing local development.

## Appendix: File Mappings

### Logger Package Sources
- `/src/services/WinstonLogger.ts` → `@h1b/logger/src/implementations/WinstonLogger.ts`
- `/src/core/interfaces/ILogger.ts` → `@h1b/logger/src/interfaces/ILogger.ts`
- `/packages/markdown-compiler/src/services/WinstonLogger.ts` → (remove, use shared)
- `/packages/markdown-compiler/src/core/interfaces/ILogger.ts` → (remove, use shared)

### DI Framework Package Sources
- `/src/core/constants/injection-tokens.ts` → `@h1b/di-framework/src/di/types.ts`
- `/src/core/container/container.ts` → `@h1b/di-framework/src/di/container.ts`
- Similar files from markdown-compiler

### Decorator Sources
- `/packages/markdown-compiler/src/core/decorators/LogMethod.ts` → `@h1b/logger/src/decorators/LogMethod.ts`
- `/packages/markdown-compiler/src/core/decorators/Cacheable.ts` → `@h1b/cache/src/decorators/Cacheable.ts`
- `/packages/markdown-compiler/src/core/decorators/InvalidateCache.ts` → `@h1b/cache/src/decorators/InvalidateCache.ts`
- Future validation decorators would go in a potential `@h1b/validation` package

This migration plan provides a clear path forward with minimal risk and maximum benefit.