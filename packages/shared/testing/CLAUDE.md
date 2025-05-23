# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the @h1b/testing package.

## Package Identity

**Name**: @h1b/testing  
**Purpose**: Centralized testing utilities and mocks for the H1B monorepo  
**Status**: Development (Priority 1)  
**Owner**: Shared Infrastructure Team  
**Created**: May 2025  

## Package Context in Monorepo

### Upstream Dependencies
- inversify (for DI container mocking)
- vitest (test framework)
- sinon (spy/stub utilities)
- No other @h1b packages (this is foundational)

### Downstream Consumers
- ALL other packages use this for testing
- h1b-visa-analysis (main project)
- markdown-compiler
- @h1b/logger (will use for tests)
- @h1b/core (will use for tests)
- All future shared packages

### Position in Architecture
This is the **foundational testing package**. It must be implemented first because:
1. Every other package needs tests
2. Establishes testing patterns for the monorepo
3. Provides mock implementations used everywhere
4. Ensures quality from the start

## Technical Architecture

### Core Interfaces
```typescript
export interface ITestSetup {
  container: Container;
  mocks: {
    logger: MockLogger;
    fileSystem?: MockFileSystem;
    cache?: MockCache;
    [key: string]: any;
  };
  cleanup(): void;
  reset(): void;
}

export interface IMockLogger extends ILogger {
  calls: LogCall[];
  hasLogged(level: LogLevel, message: string | RegExp): boolean;
  clear(): void;
}

export interface IMockFileSystem extends IFileSystem {
  seed(files: Record<string, string>): void;
  getOperations(): FileOperation[];
}
```

### Design Patterns
- **Mock Factory Pattern**: Pre-configured mocks for common interfaces
- **Builder Pattern**: TestContainerBuilder for flexible setup
- **Spy Pattern**: All mocks track their usage
- **Fixture Management**: Centralized test data handling
- **Cleanup Tracking**: Automatic resource cleanup

### Key Technologies
- TypeScript (strict mode)
- Vitest (primary test framework)
- Sinon (spies and stubs)
- Inversify (DI container mocking)

## Development Guidelines

### Code Organization
```
src/
├── interfaces/       # Testing-specific interfaces
├── container/        # Test container setup
│   └── TestContainer.ts
├── mocks/           # Mock implementations
│   ├── MockLogger.ts
│   ├── MockFileSystem.ts
│   └── MockCache.ts
├── fixtures/        # Test data management
│   └── FixtureManager.ts
├── utils/           # Test helpers
│   ├── TestHelpers.ts
│   └── SetupHelpers.ts
├── config/          # Shared test configs
│   └── vitest.shared.ts
├── types/           # TypeScript types
└── index.ts         # Public exports
```

### Mock Implementation Rules
1. **Always implement full interface** - No partial mocks
2. **Track all interactions** - Every method call recorded
3. **Provide assertions** - Built-in verification methods
4. **Support reset** - Clear state between tests
5. **Synchronous when possible** - Faster tests

### Testing Requirements
- This package must have 95%+ coverage
- Every mock needs comprehensive tests
- Test both success and error paths
- Integration tests with real DI containers

## GitHub Integration

### Workflows
- Runs tests on every PR
- No external notifications needed
- Will be used by all other packages' workflows

### Special Considerations
- This package's tests must be extremely reliable
- No flaky tests allowed
- Fast execution required (used everywhere)

## Common Tasks

### Adding a New Mock
1. Create interface in `interfaces/`
2. Implement mock in `mocks/` with full tracking
3. Add to TestContainerBuilder auto-registration
4. Export from index.ts
5. Document usage in README
6. Write comprehensive tests

### Creating Test Utilities
1. Identify common testing pattern
2. Create helper in `utils/`
3. Make it generic and reusable
4. Add TypeScript overloads if needed
5. Document with examples

### Debugging Test Issues
1. Use mock call tracking to see interactions
2. Enable debug logging in mocks
3. Check cleanup/reset is working
4. Verify container bindings

## API Patterns

### Mock Creation
```typescript
// Standalone mock
const logger = new MockLogger();

// With test setup
const { mocks } = setupTest({
  useMocks: ['logger', 'fileSystem']
});

// Custom configuration
const logger = new MockLogger({
  throwOnError: true,
  captureStackTraces: true
});
```

### Assertions
```typescript
// Built-in assertions
expect(mockLogger.hasLogged('error', /failed/)).toBe(true);
expect(mockFs.wasRead('/config.json')).toBe(true);

// Access raw data
const errorCalls = mockLogger.getCalls('error');
const writes = mockFs.getOperations('write');
```

### Fixture Management
```typescript
const fixtures = new FixtureManager(__dirname);

// Load any file type
const json = await fixtures.loadJSON<Config>('config.json');
const markdown = await fixtures.load('test.md');

// Temp directories (auto-cleaned)
const tempDir = await fixtures.createTempDir('test-');
```

## Integration Examples

### Basic Test Setup
```typescript
import { setupTest } from '@h1b/testing';

describe('MyService', () => {
  const { container, mocks, cleanup } = setupTest({
    useMocks: ['logger']
  });
  
  afterEach(() => cleanup());
  
  it('should log operations', () => {
    const service = container.get(MyService);
    service.doWork();
    
    expect(mocks.logger.hasLogged('info', 'work started')).toBe(true);
  });
});
```

### Advanced Mocking
```typescript
// Conditional behavior
mockFs.onRead('/config.json', () => {
  if (mockFs.readCount('/config.json') > 2) {
    throw new Error('Too many reads');
  }
  return '{"key": "value"}';
});

// Spy on specific methods
const spy = mockLogger.spyOn('error');
// ... run test
expect(spy.calledWith('specific error')).toBe(true);
```

## Performance Considerations
- Mocks are in-memory (no I/O)
- Minimal overhead on method calls
- Efficient call tracking using arrays
- Lazy initialization where possible

## Security Considerations
- Mocks should never access real resources
- Temp directories are properly isolated
- Cleanup prevents test pollution
- No sensitive data in fixtures

## Known Issues
- Vitest and Jest have slight API differences
- Some async operations need careful handling
- Memory usage can grow with large fixtures

## Future Enhancements
- Jest compatibility layer
- Snapshot testing utilities
- Performance benchmarking helpers
- Visual regression testing support
- Mock data generators

## Important Patterns

### DO
- Use setupTest() for consistent setup
- Let mocks track everything
- Clean up after each test
- Use fixture manager for test data
- Write assertions using mock helpers

### DON'T
- Create partial mocks
- Access real file system in tests
- Forget cleanup
- Use console.log in tests
- Make tests dependent on order

## Questions to Ask When Developing
1. Is this mock tracking all interactions?
2. Does it implement the full interface?
3. Are the assertions easy to use?
4. Is cleanup automatic?
5. Will this work for all packages?
6. Is it fast enough for thousands of tests?

## Related Documentation
- Implementation plan: `/docs/testing-package-implementation.md`
- Progress tracking: `/docs/testing-package-progress.md`
- Quick reference: `/docs/testing-package-quick-ref.md`
- Main architecture: `/docs/shared-architecture.md`