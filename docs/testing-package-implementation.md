# Testing Packages Implementation Plan

## Current Focus

This document defines the implementation of the testing packages as the **current primary goal**. All development efforts should focus on completing these packages before moving to other shared libraries.

**CONSOLIDATED STRUCTURE**: Based on our analysis, the testing functionality will be organized into 2 focused packages:
- **@h1b/test-mocks** - All mock implementations (logger, file system, cache)
- **@h1b/test-helpers** - Test utilities, fixtures, and container setup

## Why Testing Packages First

After reviewing the codebase, the testing packages should be implemented **first** because:

1. **Immediate Value**: Every other shared package will need tests
2. **Foundation**: Establishes testing patterns for all future packages
3. **Risk Reduction**: Ensures high quality for shared code
4. **Developer Experience**: Makes testing easier from day one

## Package Structure

### @h1b/test-mocks
- **Purpose**: Mock implementations for all common interfaces
- **Contents**:
  - MockLogger (ILogger implementation)
  - MockFileSystem (IFileSystem implementation)
  - MockCache (ICache implementation)
- **Dependencies**: Interface packages (@h1b/logger, @h1b/file-system, @h1b/cache)

### @h1b/test-helpers  
- **Purpose**: Test utilities and setup helpers
- **Contents**:
  - TestContainerBuilder (DI container for tests)
  - FixtureManager (Test data management)
  - Async utilities (waitFor, measureTime, etc.)
  - Setup helpers (test setup/teardown)
  - Shared vitest configuration
- **Dependencies**: inversify, vitest, node built-ins

## Complete Task Breakdown

### Phase 1: Package Setup (Day 1)

#### @h1b/test-mocks Setup:
- [ ] Create package directory structure
  ```bash
  mkdir -p packages/shared/test-mocks/src/{logger,file-system,cache}
  mkdir -p packages/shared/test-mocks/tests
  ```

- [ ] Initialize package.json
  ```json
  {
    "name": "@h1b/test-mocks",
    "version": "0.1.0",
    "description": "Mock implementations for H1B monorepo testing",
    "type": "module",
    "main": "dist/index.js",
    "types": "dist/index.d.ts"
  }
  ```

#### @h1b/test-helpers Setup:
- [ ] Create package directory structure
  ```bash
  mkdir -p packages/shared/test-helpers/src/{container,fixtures,utils,config}
  mkdir -p packages/shared/test-helpers/tests
  ```

- [ ] Initialize package.json
  ```json
  {
    "name": "@h1b/test-helpers",
    "version": "0.1.0",
    "description": "Test utilities and helpers for H1B monorepo",
    "type": "module",
    "main": "dist/index.js",
    "types": "dist/index.d.ts"
  }
  ```

- [ ] Set up TypeScript configuration for both packages
- [ ] Install dependencies for each package

### Phase 2: @h1b/test-mocks Implementation (Day 2-3)

#### MockLogger Implementation
**File:** `packages/shared/test-mocks/src/logger/MockLogger.ts`

**Tasks:**
- [ ] Implement ILogger interface
- [ ] Add call tracking
- [ ] Add assertion helpers
- [ ] Support child loggers

**Features:**
```typescript
export class MockLogger implements ILogger {
  calls: LogCall[] = [];
  
  // Track all calls
  info(message: string, context?: ILogContext): void {
    this.calls.push({ level: 'info', message, context, timestamp: new Date() });
  }
  
  // Assertion helpers
  hasLogged(level: LogLevel, message: string | RegExp): boolean;
  getCallsMatching(filter: (call: LogCall) => boolean): LogCall[];
  clear(): void;
}
```

#### MockFileSystem Implementation
**File:** `packages/shared/test-mocks/src/file-system/MockFileSystem.ts`

**Tasks:**
- [ ] Implement IFileSystem interface
- [ ] Add in-memory file storage
- [ ] Support directories
- [ ] Add file watching simulation
- [ ] Create seed method

#### MockCache Implementation
**File:** `packages/shared/test-mocks/src/cache/MockCache.ts`

**Tasks:**
- [ ] Create generic cache mock
- [ ] Track cache hits/misses
- [ ] Support TTL simulation
- [ ] Add debugging helpers

### Phase 3: @h1b/test-helpers Core Implementation (Day 4-5)

#### Test Container Implementation
**File:** `packages/shared/test-helpers/src/container/TestContainer.ts`

**Tasks:**
- [ ] Create TestContainerBuilder class
- [ ] Implement automatic mock binding
- [ ] Add snapshot/restore functionality
- [ ] Create factory function

**Implementation Details:**
```typescript
export interface ITestContainerOptions {
  useMocks?: Array<'logger' | 'fileSystem' | 'cache'>;
  customMocks?: Record<string, any>;
  baseContainer?: Container;
}

export class TestContainerBuilder {
  build(options: ITestContainerOptions): ITestContainer {
    // Implementation
  }
}

export interface ITestContainer {
  container: Container;
  restore(): void;
  snapshot(): void;
  getMock<T>(token: symbol | string): T;
}
```

### Phase 4: Fixture Management (Day 5)

#### Fixture Manager Implementation
**File:** `packages/shared/test-helpers/src/fixtures/FixtureManager.ts`

**Tasks:**
- [ ] Implement fixture loading
- [ ] Create temp directory management
- [ ] Add cleanup tracking
- [ ] Support JSON/YAML/Markdown

**Features:**
```typescript
export class FixtureManager {
  constructor(private baseDir: string) {}
  
  // Load fixtures
  async load<T = string>(filename: string): Promise<T>;
  async loadJSON<T>(filename: string): Promise<T>;
  async loadYAML<T>(filename: string): Promise<T>;
  
  // Temp directories
  async createTempDir(prefix?: string): Promise<string>;
  async cleanup(): Promise<void>;
  
  // Bulk operations
  async loadDirectory(dir: string): Promise<Record<string, string>>;
}
```

### Phase 5: Test Utilities Implementation (Day 6)

#### Test Helpers Implementation
**File:** `packages/shared/test-helpers/src/utils/TestHelpers.ts`

**Tasks:**
- [ ] Create async wait helpers
- [ ] Add error assertion utilities
- [ ] Create spy factories
- [ ] Add timing utilities

**Implementation:**
```typescript
// Wait for condition
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  timeout = 5000,
  interval = 100
): Promise<void>;

// Assert specific error
export async function assertThrowsError<T extends Error>(
  fn: () => Promise<any>,
  errorType: new (...args: any[]) => T,
  messageMatcher?: string | RegExp
): Promise<T>;

// Create spied object
export function createSpiedInstance<T>(
  ClassConstructor: new (...args: any[]) => T
): T & { spies: Record<keyof T, SinonSpy> };

// Performance timing
export async function measureTime<T>(
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }>;
```

#### Setup Helpers Implementation
**File:** `packages/shared/test-helpers/src/utils/SetupHelpers.ts`

**Tasks:**
- [ ] Create test setup function
- [ ] Add automatic cleanup
- [ ] Support beforeEach/afterEach patterns
- [ ] Add test isolation

**Implementation:**
```typescript
export interface ITestSetup {
  container: Container;
  mocks: {
    logger: MockLogger;
    fileSystem: MockFileSystem;
    [key: string]: any;
  };
  cleanup(): void;
  reset(): void;
}

export function setupTest(options?: ITestSetupOptions): ITestSetup;
```

### Phase 6: Shared Configuration (Day 7)

#### Vitest Configuration
**File:** `packages/shared/test-helpers/src/config/vitest.shared.ts`

**Tasks:**
- [ ] Extract common vitest config
- [ ] Add coverage settings
- [ ] Configure test reporters
- [ ] Set up global hooks

**Configuration:**
```typescript
export const sharedTestConfig = {
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['reflect-metadata', '@h1b/test-helpers/setup'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
};
```

### Phase 7: Integration & Testing (Day 8-9)

**Tasks:**
- [ ] Write comprehensive tests for all utilities
- [ ] Create example test scenarios
- [ ] Test with both h1b-visa-analysis and markdown-compiler
- [ ] Ensure 95%+ coverage

### Phase 8: Documentation (Day 10)

**Tasks:**
- [ ] Write comprehensive README
- [ ] Create migration guide
- [ ] Add code examples
- [ ] Document best practices

## Success Criteria

The testing packages are complete when:

1. **@h1b/test-mocks**:
   - All mock implementations complete (Logger, FileSystem, Cache)
   - Each mock has comprehensive assertion helpers
   - 95% test coverage achieved
   - Package published to npm registry

2. **@h1b/test-helpers**:
   - Container utilities working smoothly
   - Fixture management operational
   - All async helpers implemented
   - Shared configuration exported
   - 95% test coverage achieved
   - Package published to npm registry

3. **Integration**:
   - Both h1b-visa-analysis and markdown-compiler updated
   - All tests migrated to use new packages
   - Documentation complete with examples

## Usage Examples

### Basic Test Setup
```typescript
import { setupTest } from '@h1b/test-helpers';
import { MockLogger } from '@h1b/test-mocks';

describe('MyService', () => {
  const { container, mocks, cleanup } = setupTest({
    useMocks: ['logger', 'fileSystem']
  });
  
  afterEach(() => cleanup());
  
  it('should log operations', async () => {
    const service = container.get(MyService);
    await service.doWork();
    
    expect(mocks.logger.hasLogged('info', /started/)).toBe(true);
  });
});
```

### Fixture Testing
```typescript
import { FixtureManager } from '@h1b/test-helpers';

describe('MarkdownProcessor', () => {
  const fixtures = new FixtureManager(__dirname);
  
  it('should process fixtures', async () => {
    const content = await fixtures.load('test-doc.md');
    const result = await processor.process(content);
    expect(result).toMatchSnapshot();
  });
});
```

### Async Testing
```typescript
import { waitFor, measureTime } from '@h1b/test-helpers';

it('should complete eventually', async () => {
  const service = new SlowService();
  service.start();
  
  await waitFor(() => service.isReady);
  
  const { result, duration } = await measureTime(
    () => service.process()
  );
  
  expect(duration).toBeLessThan(1000);
});
```

## Implementation Order

1. **Package Setup** - Initialize both packages with proper structure
2. **@h1b/test-mocks** - Implement all mocks first (most dependencies)
3. **TestContainer** - Core functionality for @h1b/test-helpers
4. **Test Utilities** - Async helpers and setup functions
5. **FixtureManager** - Fixture loading capabilities
6. **Shared Config** - Export reusable vitest configuration
7. **Integration** - Update both projects to use new packages

## Notes for Claude

- This is the **current primary focus**
- Complete these packages before moving to others
- @h1b/test-mocks and @h1b/test-helpers are separate packages
- All code should follow established patterns
- Maintain high test coverage (95%+)
- Update both h1b-visa-analysis and markdown-compiler
- Document everything clearly with examples

## Validation Checklist

### @h1b/test-mocks
- [ ] Package structure created
- [ ] MockLogger implemented with assertions
- [ ] MockFileSystem with in-memory storage
- [ ] MockCache with hit/miss tracking
- [ ] All interfaces properly typed
- [ ] 95%+ test coverage
- [ ] Package published to registry

### @h1b/test-helpers
- [ ] Package structure created
- [ ] TestContainer with DI setup
- [ ] FixtureManager for test data
- [ ] Async utilities (waitFor, measureTime)
- [ ] Setup helpers for test isolation
- [ ] Shared vitest configuration
- [ ] 95%+ test coverage
- [ ] Package published to registry

### Integration
- [ ] Both projects updated to use packages
- [ ] All tests migrated
- [ ] Documentation complete
- [ ] User has validated implementation