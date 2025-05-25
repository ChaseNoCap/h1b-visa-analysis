# Developer Handbook

## Overview

This handbook consolidates all developer resources including templates, checklists, naming conventions, and decision-making guides for the H1B meta repository with Git submodules.

## Package Development Guide

### Prompt Engineering Guidelines

#### XML-Structured Prompt Development
When creating prompts for packages or workflows, use XML structure for clarity and parseability:

```xml
<package name="{{package_name}}">
  <metadata>
    <version>1.0.0</version>
    <coverage>95%</coverage>
    <size>~500 lines</size>
    <status>stable</status>
  </metadata>
  
  <purpose>
    Single-line description of what this package does
  </purpose>
  
  <features>
    <feature>Key feature 1</feature>
    <feature>Key feature 2</feature>
  </features>
  
  <dependencies>
    <dependency>inversify</dependency>
    <dependency optional="true">winston</dependency>
  </dependencies>
  
  <exports>
    <export type="interface">ICache</export>
    <export type="decorator">@Cacheable</export>
    <export type="class">MemoryCache</export>
  </exports>
</package>
```

#### Prompt Optimization Patterns
When creating prompts, follow these optimization principles:

1. **Use Exact Names**: "test-helpers package" not "testing utilities"
2. **Reference Specific Sections**: "architecture-reference.md#dependency-injection"
3. **Batch Related Questions**: Group related items in single prompt
4. **Include Error Context**: Provide full stack traces and recent changes
5. **Start Minimal**: Load only necessary context first

#### Context Loading Strategies
```xml
<context_loading strategy="progressive">
  <level depth="1">
    <load>CLAUDE.md</load>
    <purpose>Project overview</purpose>
  </level>
  
  <level depth="2" condition="needs_package_info">
    <load>package-catalog.md#{{package}}</load>
    <purpose>Package details</purpose>
  </level>
  
  <level depth="3" condition="needs_implementation">
    <load>packages/{{package}}/src/</load>
    <purpose>Implementation details</purpose>
  </level>
</context_loading>
```

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

1. **Create GitHub Repository**
```bash
# Create new repository at github.com/ChaseNoCap/{package-name}
# Clone it locally
git clone https://github.com/ChaseNoCap/{package-name}.git
cd {package-name}

# Initialize package
npm init -y
mkdir -p src
```

2. **Add as Submodule to Meta Repository**
```bash
# From h1b-visa-analysis root
git submodule add https://github.com/ChaseNoCap/{package-name}.git packages/{package-name}
git add .gitmodules packages/{package-name}
git commit -m "feat: add {package-name} submodule"
```

3. **Configure Package**
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

4. **Create Structure**
```
src/
├── interfaces/      # Public API (1-3 files)
├── implementations/ # Internal only
├── errors/         # Domain errors
└── index.ts        # Explicit exports
```

5. **Write CLAUDE.md** (REQUIRED)
- Use template below
- Fill ALL sections
- Include code examples
- Document boundaries

6. **Implement and Publish**
- Define interfaces first
- Write tests alongside
- Keep it simple
- Export via index.ts
- Publish to GitHub Packages:
  ```bash
  npm version patch
  npm publish --registry=https://npm.pkg.github.com
  ```

7. **Update Meta Repository**
```bash
# Update package.json to use published version
npm install @chasenocap/{package-name}@latest
git add package.json package-lock.json
git commit -m "chore: add {package-name} dependency"
```
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

## Prompt Package Development

### Creating Package Prompts
When creating a new package, also create corresponding prompts in the prompts submodule:

```bash
# 1. Navigate to prompts submodule
cd packages/prompts

# 2. Create package-specific prompt directory
mkdir -p src/packages/{package-name}

# 3. Create the four required prompt files
touch src/packages/{package-name}/overview.md
touch src/packages/{package-name}/api.md
touch src/packages/{package-name}/integration.md
touch src/packages/{package-name}/status.md

# 4. Commit and push in submodule
git add .
git commit -m "feat: add prompts for {package-name}"
git push

# 5. Update meta repository
cd ../..
git add packages/prompts
git commit -m "chore: update prompts submodule"
```

### Prompt File Templates

#### Overview Template (overview.md)
```xml
<package_overview name="{package-name}">
  <metadata>
    <version>1.0.0</version>
    <coverage>95%</coverage>
    <size>~500 lines</size>
    <status>development|stable</status>
  </metadata>
  
  <purpose>
    Single sentence describing what this package does
  </purpose>
  
  <features>
    <feature>Key feature 1</feature>
    <feature>Key feature 2</feature>
  </features>
  
  <consumers>
    <consumer>h1b-visa-analysis</consumer>
    <consumer>markdown-compiler</consumer>
  </consumers>
</package_overview>
```

#### API Template (api.md)
```xml
<package_api name="{package-name}">
  <interfaces>
    <interface name="IServiceName">
      <method>methodName(params): ReturnType</method>
    </interface>
  </interfaces>
  
  <usage_example>
    <![CDATA[
    import { ServiceName } from '{package-name}';
    
    const service = new ServiceName();
    const result = await service.doWork();
    ]]>
  </usage_example>
  
  <decorators>
    <decorator name="@DecoratorName">
      <description>What it does</description>
      <example>@DecoratorName({ option: 'value' })</example>
    </decorator>
  </decorators>
</package_api>
```

#### Integration Template (integration.md)
```xml
<integration_context package="{package-name}">
  <integrates_with>
    <package name="logger">
      <interaction>Logs operations and errors</interaction>
    </package>
    <package name="di-framework">
      <interaction>Uses dependency injection</interaction>
    </package>
  </integrates_with>
  
  <used_by>
    <application>h1b-visa-analysis</application>
    <application>markdown-compiler</application>
  </used_by>
  
  <patterns>
    <pattern>Decorator-based configuration</pattern>
    <pattern>Interface segregation</pattern>
  </patterns>
</integration_context>
```

#### Status Template (status.md)
```xml
<package_status name="{package-name}">
  <current_state>
    <version>{{version}}</version>
    <coverage>{{coverage}}%</coverage>
    <last_update>{{date}}</last_update>
    <state>{{development|stable|deprecated}}</state>
  </current_state>
  
  <dependencies>
    <dependency>inversify</dependency>
    <dependency optional="true">winston</dependency>
  </dependencies>
  
  <dependents>
    <dependent>h1b-visa-analysis</dependent>
    <dependent>markdown-compiler</dependent>
  </dependents>
  
  <metrics>
    <metric name="size">{{lines}} lines</metric>
    <metric name="exports">{{count}} public exports</metric>
    <metric name="tests">{{count}} test files</metric>
  </metrics>
</package_status>
```

### Workflow Prompt Development
Create workflow prompts for cross-cutting processes:

```xml
<workflow name="package_creation">
  <overview>
    Step-by-step process for creating new packages
  </overview>
  
  <steps>
    <step order="1">
      <name>Planning</name>
      <actions>
        <action>Define single responsibility</action>
        <action>Verify size constraints</action>
        <action>Identify dependencies</action>
      </actions>
    </step>
    
    <step order="2">
      <name>Implementation</name>
      <actions>
        <action>Create package structure</action>
        <action>Implement interfaces first</action>
        <action>Write tests alongside</action>
      </actions>
    </step>
  </steps>
  
  <success_criteria>
    <criterion>Package under 500 lines</criterion>
    <criterion>90%+ test coverage</criterion>
    <criterion>CLAUDE.md complete</criterion>
  </success_criteria>
</workflow>
```

### Prompt Validation
Validate prompt structure matches project reality:

```typescript
// scripts/validate-prompts.ts
export async function validatePromptStructure() {
  const projectPackages = await scanProjectPackages();
  const promptPackages = await scanPromptPackages();

  for (const pkg of projectPackages) {
    const promptPath = `src/packages/${pkg.name}`;
    if (!promptPackages.has(promptPath)) {
      console.warn(`Missing prompts for package: ${pkg.name}`);
    }
  }
}
```

### Anti-Patterns in Prompt Development
1. **Vague Descriptions**: "Fix the bug" → "Cache decorator returns undefined in ReportGenerator.ts:45"
2. **Missing Context**: "Why doesn't this work?" → Include error messages and stack traces
3. **Context Overloading**: "Load all docs" → Load minimal context first
4. **Generic References**: "the testing utilities" → "test-helpers package"

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
// From published packages (GitHub Packages)
import type { ILogger } from '@chasenocap/logger';
import { MockLogger } from '@chasenocap/test-mocks';
import { setupTest } from '@chasenocap/test-helpers';

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

*This handbook consolidates claude-md-template.md, claude-md-guide.md, package-creation-checklist.md, package-decision-record-template.md, and naming-convention.md into a single developer reference for the Git submodules architecture.*