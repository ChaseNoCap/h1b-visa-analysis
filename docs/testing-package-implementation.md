# @h1b/testing Package Implementation Plan

## Current Focus

This document defines the implementation of the @h1b/testing package as the **current primary goal**. All development efforts should focus on completing this package before moving to other shared libraries.

## Why Testing Package First (Revised Priority)

After reviewing the codebase, the testing package should be implemented **first** because:

1. **Immediate Value**: Every other shared package will need tests
2. **Foundation**: Establishes testing patterns for all future packages
3. **Risk Reduction**: Ensures high quality for shared code
4. **Developer Experience**: Makes testing easier from day one

## Package Intent

The @h1b/testing package will:
- **Centralize** all testing utilities and mocks
- **Standardize** testing patterns across the monorepo
- **Accelerate** test development with ready-to-use utilities
- **Improve** test quality and coverage

## Complete Task Breakdown

### Phase 1: Package Setup (Day 1)

#### Tasks:
- [ ] Create package directory structure
  ```bash
  mkdir -p packages/shared/testing/src/{container,mocks,fixtures,config,utils}
  mkdir -p packages/shared/testing/tests
  ```

- [ ] Initialize package.json
  ```json
  {
    "name": "@h1b/testing",
    "version": "0.1.0",
    "description": "Shared testing utilities for H1B monorepo",
    "type": "module",
    "main": "dist/index.js",
    "types": "dist/index.d.ts"
  }
  ```

- [ ] Set up TypeScript configuration
  - Extend base tsconfig
  - Configure for library output

- [ ] Install dependencies
  ```bash
  npm install --save-dev vitest @vitest/coverage-v8 sinon @types/sinon
  npm install inversify reflect-metadata
  ```

### Phase 2: Test Container Implementation (Day 2)

#### File: `src/container/TestContainer.ts`

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

### Phase 3: Mock Implementations (Day 3-4)

#### File: `src/mocks/MockLogger.ts`

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

#### File: `src/mocks/MockFileSystem.ts`

**Tasks:**
- [ ] Implement IFileSystem interface
- [ ] Add in-memory file storage
- [ ] Support directories
- [ ] Add file watching simulation
- [ ] Create seed method

**Features:**
```typescript
export class MockFileSystem implements IFileSystem {
  private files: Map<string, string> = new Map();
  private watchers: Map<string, Function[]> = new Map();
  
  // Seed test data
  seed(files: Record<string, string>): void;
  
  // Simulate file changes
  triggerChange(path: string): void;
  
  // Get all operations
  getOperations(): FileOperation[];
}
```

#### File: `src/mocks/MockCache.ts`

**Tasks:**
- [ ] Create generic cache mock
- [ ] Track cache hits/misses
- [ ] Support TTL simulation
- [ ] Add debugging helpers

### Phase 4: Fixture Management (Day 5)

#### File: `src/fixtures/FixtureManager.ts`

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

### Phase 5: Test Utilities (Day 6)

#### File: `src/utils/TestHelpers.ts`

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

#### File: `src/utils/SetupHelpers.ts`

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

#### File: `src/config/vitest.shared.ts`

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
    setupFiles: ['reflect-metadata', '@h1b/testing/setup'],
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

The @h1b/testing package is complete when:

1. **All mocks implemented** - Logger, FileSystem, Cache
2. **Container utilities working** - Easy test setup
3. **Fixtures manageable** - Load and cleanup test data
4. **Helpers documented** - Clear examples
5. **95% test coverage** - Package fully tested
6. **Both projects updated** - Using shared testing
7. **Documentation complete** - README and guides

## Usage Examples

### Basic Test Setup
```typescript
import { setupTest, MockLogger } from '@h1b/testing';

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
import { FixtureManager } from '@h1b/testing';

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
import { waitFor, measureTime } from '@h1b/testing';

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

1. **TestContainer** - Core functionality
2. **MockLogger** - Most used mock
3. **Test Helpers** - Improve test writing
4. **MockFileSystem** - Complex but valuable
5. **FixtureManager** - Nice to have
6. **Shared Config** - Final touch

## Notes for Claude

- This is the **current primary focus**
- Complete this package before moving to others
- All code should follow established patterns
- Maintain high test coverage
- Update both projects to use this package
- Document everything clearly

## Validation Checklist

- [ ] Package structure created
- [ ] All interfaces defined
- [ ] Mock implementations complete
- [ ] Test utilities working
- [ ] Configuration shared
- [ ] Tests written (95%+ coverage)
- [ ] Documentation complete
- [ ] Both projects updated
- [ ] User has validated implementation