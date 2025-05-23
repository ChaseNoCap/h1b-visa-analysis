# Shared Code Analysis: h1b-visa-analysis & markdown-compiler

## Executive Summary

Both projects share significant code patterns and dependencies that should be extracted into shared packages. The main areas for consolidation are:

1. **Logger implementation** (WinstonLogger) - Nearly identical
2. **DI container setup** - Same patterns with Inversify
3. **Core interfaces** - ILogger, injection tokens
4. **Decorators** - Logging, caching, validation
5. **Testing utilities** - Vitest setup, Sinon integration
6. **File system abstractions** - IFileSystem interface

## 1. Common Code Analysis

### 1.1 WinstonLogger Implementation

**Duplication Level: 98% identical**

Both projects have virtually identical WinstonLogger implementations with only minor differences:

- **h1b-visa-analysis**: Uses `.js` extensions, service name 'h1b-report-generator', log file 'h1b-report-%DATE%.log'
- **markdown-compiler**: No `.js` extensions, no service name in defaultMeta, log file 'markdown-compiler-%DATE%.log'

### 1.2 ILogger Interface

**Duplication Level: 100% identical**

Both projects share the exact same ILogger interface:
```typescript
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
```

### 1.3 DI Container Setup

**Duplication Level: 90% similar patterns**

Both use Inversify with similar configuration:
- Same container options: `defaultScope: 'Singleton'`, `autoBindInjectable: true`
- Same pattern of `createContainer()` and `configureContainer()` functions
- Same singleton container export

### 1.4 Injection Tokens

**Overlap**: Both use `Symbol.for()` pattern with shared tokens:
- `ILogger`
- `IFileSystem` 
- `IMarkdownProcessor`

### 1.5 Dependencies

**Shared production dependencies**:
- `reflect-metadata: ^0.2.1`
- `inversify: ^6.0.2`
- `winston: ^3.11.0`
- `winston-daily-rotate-file: ^4.7.1`

**Shared dev dependencies**:
- All TypeScript, ESLint, Prettier, Vitest, and Sinon dependencies are identical

## 2. Unique Features by Project

### markdown-compiler Exclusive:
- **Decorators**: `@Cacheable`, `@LogMethod`, `@LogClass`, `@Validate`
- **Cache implementation**: In-memory cache with TTL support
- **Validation framework**: Parameter validation decorators
- **File system abstractions**: IFileSystem with MemoryFileSystem and NodeFileSystem
- **Template processing**: ITemplateProcessor, IPathResolver
- **Recursion detection**: IRecursionDetector
- **Multiple export paths** in package.json

### h1b-visa-analysis Exclusive:
- **Report generation**: IReportGenerator, IDependencyChecker
- **ES modules**: Uses `.js` extensions for imports
- **Simpler structure**: Fewer abstractions, focused on report generation

## 3. Inconsistencies to Address

### 3.1 Module System
- **h1b-visa-analysis**: Uses `.js` extensions in imports (ES modules)
- **markdown-compiler**: No extensions in imports
- **Resolution**: Standardize on ES modules with `.js` extensions

### 3.2 Logger Service Names
- Different service names in defaultMeta
- Different log file naming patterns
- **Resolution**: Make configurable through constructor options

### 3.3 Export Strategy
- **markdown-compiler**: Multiple export paths for different concerns
- **h1b-visa-analysis**: Single main export
- **Resolution**: Use multiple export paths for shared packages

## 4. Decomposition Strategy

### 4.1 @shared/logger Package
```typescript
// Core functionality
- WinstonLogger (configurable service name, log pattern)
- ILogger interface
- ILogContext interface
- LogMethod decorator
- LogClass decorator
- Testing utilities (MockLogger)

// Dependencies
- winston, winston-daily-rotate-file
```

### 4.2 @shared/di-core Package
```typescript
// Core functionality
- Container factory functions
- Common injection tokens (extensible)
- Base decorators for DI
- Testing utilities (createTestContainer)

// Dependencies
- inversify, reflect-metadata
```

### 4.3 @shared/decorators Package
```typescript
// Decorators
- @Cacheable with cache management
- @LogMethod, @LogClass (re-export from logger)
- @Validate with validation rules
- @Retry, @Timeout (new utilities)

// Utilities
- Cache storage management
- Validation rule builders
```

### 4.4 @shared/file-system Package
```typescript
// Interfaces
- IFileSystem
- IPath (path operations)

// Implementations
- NodeFileSystem
- MemoryFileSystem
- S3FileSystem (future)

// Utilities
- Path normalization
- File type detection
```

### 4.5 @shared/testing Package
```typescript
// Setup
- Vitest configuration
- Sinon integration
- Global test utilities

// Mocks
- MockLogger
- MockFileSystem
- Container test helpers

// Utilities
- Assertion helpers
- Async test utilities
```

### 4.6 @shared/interfaces Package
```typescript
// Common interfaces not tied to specific implementations
- ICache
- IErrorHandler
- IConfig
- Base error classes
```

## 5. Migration Plan

### Phase 1: Create Shared Packages
1. Set up @shared workspace with individual packages
2. Extract and test each package independently
3. Ensure backward compatibility

### Phase 2: Update markdown-compiler
1. Replace local implementations with shared packages
2. Update imports and dependencies
3. Run full test suite

### Phase 3: Update h1b-visa-analysis
1. Replace duplicate code with shared packages
2. Adopt additional utilities (decorators, cache)
3. Standardize on ES modules

### Phase 4: Enhancement
1. Add new shared utilities based on needs
2. Create shared documentation
3. Set up automated testing across packages

## 6. Benefits

1. **Code Reuse**: Eliminate 90%+ duplication
2. **Consistency**: Same implementations across projects
3. **Maintenance**: Single source of truth for common code
4. **Testing**: Shared test utilities and mocks
5. **Evolution**: New features benefit all projects
6. **Type Safety**: Shared interfaces ensure compatibility

## 7. Recommendations

1. **Start with @shared/logger**: Highest duplication, easiest win
2. **Use npm workspaces**: Already configured in h1b-visa-analysis
3. **Maintain backward compatibility**: Use adapter patterns if needed
4. **Document migration**: Clear upgrade guides for each package
5. **Automate testing**: Run tests across all consuming packages
6. **Version carefully**: Use semantic versioning, start at 0.1.0

## 8. Example Package Structure

```
@shared/
├── logger/
│   ├── src/
│   │   ├── WinstonLogger.ts
│   │   ├── interfaces/ILogger.ts
│   │   ├── decorators/logging.ts
│   │   └── testing/MockLogger.ts
│   ├── package.json
│   └── tsconfig.json
├── di-core/
│   ├── src/
│   │   ├── container.ts
│   │   ├── tokens.ts
│   │   └── testing/
│   └── package.json
├── decorators/
├── file-system/
├── testing/
└── interfaces/
```

This structure allows for:
- Independent versioning
- Selective adoption
- Clear separation of concerns
- Easy testing and documentation