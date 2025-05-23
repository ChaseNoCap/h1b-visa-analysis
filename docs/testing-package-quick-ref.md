# @h1b/testing Quick Reference

## Current Status: IN DEVELOPMENT

This is the **active development focus**. Complete this before other shared packages.

## Package Structure
```
packages/shared/testing/
├── src/
│   ├── container/          # DI test containers
│   │   └── TestContainer.ts
│   ├── mocks/             # Mock implementations
│   │   ├── MockLogger.ts
│   │   ├── MockFileSystem.ts
│   │   └── MockCache.ts
│   ├── fixtures/          # Test data management
│   │   └── FixtureManager.ts
│   ├── utils/             # Test helpers
│   │   ├── TestHelpers.ts
│   │   └── SetupHelpers.ts
│   ├── config/            # Shared configs
│   │   └── vitest.shared.ts
│   └── index.ts           # Main exports
└── tests/                 # Tests for the testing package
```

## Key Components

### 1. Test Setup (Most Common Use)
```typescript
import { setupTest } from '@h1b/testing';

const { container, mocks, cleanup } = setupTest({
  useMocks: ['logger', 'fileSystem']
});
```

### 2. Mock Logger
```typescript
import { MockLogger } from '@h1b/testing';

const logger = new MockLogger();
logger.info('test');

// Assertions
expect(logger.hasLogged('info', 'test')).toBe(true);
expect(logger.calls).toHaveLength(1);
```

### 3. Mock FileSystem
```typescript
import { MockFileSystem } from '@h1b/testing';

const fs = new MockFileSystem();
fs.seed({
  '/test.md': '# Test',
  '/data.json': '{"key": "value"}'
});
```

### 4. Fixtures
```typescript
import { FixtureManager } from '@h1b/testing';

const fixtures = new FixtureManager(__dirname);
const data = await fixtures.load('test-case.json');
const tempDir = await fixtures.createTempDir();
```

### 5. Async Helpers
```typescript
import { waitFor, assertThrowsError } from '@h1b/testing';

// Wait for condition
await waitFor(() => service.isReady());

// Assert specific error
await assertThrowsError(
  () => service.failingMethod(),
  ValidationError,
  /invalid input/
);
```

## Implementation Checklist

### Day 1: Setup
- [ ] Create directory structure
- [ ] Initialize package.json
- [ ] Configure TypeScript
- [ ] Install dependencies

### Day 2: Container
- [ ] TestContainerBuilder
- [ ] Auto-mock binding
- [ ] Snapshot/restore

### Day 3-4: Mocks
- [ ] MockLogger with tracking
- [ ] MockFileSystem in-memory
- [ ] MockCache generic

### Day 5: Fixtures
- [ ] FixtureManager
- [ ] Temp directories
- [ ] Auto cleanup

### Day 6: Utilities
- [ ] Async helpers
- [ ] Error assertions
- [ ] Spy factories

### Day 7: Config
- [ ] Shared vitest config
- [ ] Setup files
- [ ] Coverage settings

### Day 8-9: Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] 95%+ coverage

### Day 10: Documentation
- [ ] README
- [ ] Migration guide
- [ ] Examples

## Exports Structure
```typescript
// Main exports
export { setupTest, type ITestSetup } from './utils/SetupHelpers';
export { MockLogger } from './mocks/MockLogger';
export { MockFileSystem } from './mocks/MockFileSystem';
export { MockCache } from './mocks/MockCache';
export { FixtureManager } from './fixtures/FixtureManager';

// Utilities
export * from './utils/TestHelpers';
export * from './utils/SetupHelpers';

// Types
export * from './types';

// Config
export { sharedTestConfig } from './config/vitest.shared';
```

## Migration Example

### Before (Current Pattern)
```typescript
// In each test file
const mockLogger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  child: vi.fn(() => mockLogger)
};

beforeEach(() => {
  vi.clearAllMocks();
});
```

### After (With @h1b/testing)
```typescript
import { setupTest } from '@h1b/testing';

const { mocks } = setupTest({ useMocks: ['logger'] });
// Full mock with tracking, assertions, etc.
```

## Remember
- Focus on THIS package only
- High quality with 95%+ coverage
- Document everything
- Make it easy to use
- Test with both projects