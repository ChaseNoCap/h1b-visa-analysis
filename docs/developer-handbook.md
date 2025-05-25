# Developer Handbook

## Overview

This handbook consolidates all developer resources including templates, checklists, naming conventions, and decision-making guides for the H1B monorepo.

## Package Development Guide

### Naming Conventions

**Package Names**:
- Use simple, descriptive kebab-case names
- NO namespace prefixes (e.g., `logger` not `@h1b/logger`)
- Match GitHub repo names exactly
- Be specific: `file-reader` not `io`
- Avoid generic terms: `core`, `common`, `utils`

**Code Conventions**:
- Interfaces: `IServiceName`
- Implementations: `ServiceName`
- Decorators: `@DecoratorName`
- Errors: `ServiceNameError`
- Injection tokens: `TYPES.IServiceName`

### Package Creation Process

#### Pre-Creation Checklist
Before creating any package:

1. **Define Purpose** (one sentence WITHOUT "and")
2. **Verify Single Responsibility** 
3. **Check Size** (<500 lines target)
4. **Identify Dependencies** (2-3 MAX)
5. **Choose Name** (clear and specific)
6. **Consider Splitting** - Could this be 2-3 smaller packages?

#### Step-by-Step Creation

1. **Setup Directory**
```bash
mkdir -p packages/{package-name}/src
cd packages/{package-name}
npm init -y
```

2. **Configure Package**
```json
{
  "name": "{package-name}",
  "version": "0.1.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "test:watch": "vitest watch"
  }
}
```

3. **Create Structure**
```
src/
├── interfaces/      # Public API (1-3 files)
├── implementations/ # Internal only
├── errors/         # Domain errors
└── index.ts        # Explicit exports
```

4. **Write CLAUDE.md** (REQUIRED)
- Use template below
- Fill ALL sections
- Include code examples
- Document boundaries

5. **Implement**
- Define interfaces first
- Write tests alongside
- Keep it simple
- Export via index.ts

### CLAUDE.md Template

Every package MUST have a CLAUDE.md file:

```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working with the [PACKAGE] package.

## Package Identity

**Name**: [package-name]  
**Purpose**: [One sentence - be SPECIFIC about single responsibility]  
**Status**: [Development/Stable]  
**Size**: [Target <500 lines]  

## Single Responsibility

This package is responsible for:
[ONE clear responsibility - no "and" allowed]

This package is NOT responsible for:
- [List what it doesn't do]
- [Maintain clear boundaries]

## Technical Architecture

### Core Interface
```typescript
export interface I[Name] {
  // 3-5 methods max
}
```

### Dependencies
- [Package 1]
- [Package 2] 
- [3 max]

## Development Guidelines

### Code Organization
```
src/
├── interfaces/     # Public API
├── implementations/ # Internal
└── index.ts        # Exports
```

### Testing
- Minimum 90% coverage
- Use test-mocks for dependencies
- Focus on public API

## API Usage

```typescript
import { createService } from '[package]';

const service = createService({
  logger: container.get(TYPES.ILogger)
});
```

## Integration Examples

[Show how to use with other packages]
```

### Decision Records

Use this template when making architectural decisions:

```markdown
# Package Decision Record

**Date:** [YYYY-MM-DD]  
**Author:** [Name]  
**Status:** [Proposed/Accepted]  
**Package(s):** [Affected packages]

## Decision
[One sentence summary]

## Context
[Why this decision is needed]

## Alignment with Principles
1. **Single Responsibility**: [How maintained]
2. **Size Limits**: [How enforced]
3. **Clear Boundaries**: [How defined]
4. **Dependency Direction**: [How preserved]
5. **Test in Isolation**: [How ensured]

## Options Considered

### Option 1: [Name]
**Pros**: [List]
**Cons**: [List]

### Option 2: [Name]
**Pros**: [List]
**Cons**: [List]

## Decision Rationale
[Why chosen option is best]

## Implementation Plan
1. [Step 1]
2. [Step 2]

## Success Metrics
- [ ] Package under 500 lines
- [ ] Single clear purpose
- [ ] 90%+ test coverage
```

## Development Patterns

### Dependency Injection
```typescript
@injectable()
export class Service implements IService {
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.ICache) private cache: ICache
  ) {}
}
```

### Error Handling
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

// Use Result types
export type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: Error };
```

### Testing Patterns
```typescript
import { setupTest, MockLogger } from 'test-helpers';

describe('Service', () => {
  const { container, mocks, cleanup } = setupTest({
    useMocks: ['logger', 'cache']
  });
  
  afterEach(() => cleanup());
  
  it('should work', async () => {
    const service = container.get<IService>(TYPES.IService);
    // Test public API only
  });
});
```

### Event Integration
```typescript
@injectable()
export class Service {
  constructor(
    @inject(TYPES.IEventBus) eventBus: IEventBus
  ) {
    setEventBus(this, eventBus);
  }
  
  @Emits('service.action')
  @Traces({ threshold: 500 })
  async doWork(): Promise<Result> {
    // Events auto-emitted
  }
}
```

## Quality Standards

### Package Quality Checklist
- [ ] Single clear purpose
- [ ] Under 500 lines (prefer <300)
- [ ] 2-3 dependencies max
- [ ] 90%+ test coverage
- [ ] CLAUDE.md complete
- [ ] Clear public API
- [ ] No console.log
- [ ] Proper error handling
- [ ] TypeScript strict mode
- [ ] All exports tested

### Code Review Checklist
- [ ] Follows naming conventions
- [ ] Maintains single responsibility
- [ ] Dependencies injected
- [ ] Errors are typed
- [ ] Tests are focused
- [ ] Documentation updated
- [ ] Examples compile
- [ ] No breaking changes

## Common Mistakes to Avoid

1. **Creating Large Packages**
   - Keep under 500 lines
   - Split if describing needs "and"

2. **Vague Names**
   - ❌ `utils`, `helpers`, `common`
   - ✅ `file-reader`, `cache-manager`

3. **Multiple Responsibilities**
   - ❌ Parse AND render AND validate
   - ✅ Do ONE thing well

4. **Deep Dependencies**
   - ❌ A → B → C → D
   - ✅ A → B, A → C (flat)

5. **Missing CLAUDE.md**
   - Critical for context
   - Not optional

6. **Over-Engineering**
   - Start simple
   - Add features carefully
   - YAGNI principle

## Quick References

### Package Types & Patterns

**Service Package**:
- Single interface
- DI injectable
- Uses logger
- Emits events

**Utility Package**:
- Pure functions
- No side effects
- Minimal dependencies
- Well-typed

**Mock Package**:
- Implements interface
- Tracks calls
- Configurable behavior
- Reset capability

### Import Patterns
```typescript
// From packages
import type { ILogger } from '@chasenogap/logger';
import { MockLogger } from 'test-mocks';
import { setupTest } from 'test-helpers';

// From DI
const logger = container.get<ILogger>(TYPES.ILogger);
```

### Testing Patterns
```typescript
// Unit test
const mock = new MockLogger();
mock.info('test');
expect(mock.hasLogged('info', 'test')).toBe(true);

// Integration test
const { container } = setupTest();
const service = container.get<IService>(TYPES.IService);
```

## Resources

- **Templates**: Use this handbook's templates
- **Examples**: See existing packages
- **Principles**: See decomposition-guide.md
- **Architecture**: See architecture-reference.md

---

*This handbook consolidates claude-md-template.md, claude-md-guide.md, package-creation-checklist.md, package-decision-record-template.md, and naming-convention.md into a single developer reference.*