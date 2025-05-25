# Architecture Reference

## Overview

This reference consolidates the architectural patterns, technical decisions, and shared code analysis for the H1B meta repository, providing a comprehensive guide to the system's design and implementation including its Git submodules architecture.

## Core Architecture

### Tech Stack
- **TypeScript** - ES2022 modules with strict mode
- **Inversify** - Dependency injection with decorators
- **Winston** - Structured logging with rotation
- **Vitest** - Testing framework
- **ESLint + Prettier** - Code quality

### Architectural Patterns

#### 1. Dependency Injection (DI)
All services use interface-first design with Inversify:

```typescript
// Define interface
export interface IService {
  doWork(): Promise<Result>;
}

// Define token
export const TYPES = {
  IService: Symbol.for('IService'),
};

// Implement service
@injectable()
export class Service implements IService {
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.ICache) private cache: ICache
  ) {}
  
  async doWork(): Promise<Result> {
    this.logger.info('Working...');
    // Implementation
  }
}

// Container configuration
container.bind<IService>(TYPES.IService).to(Service);
```

#### 2. Interface-First Design
Every service starts with an interface:
- Defines the contract
- Enables testing with mocks
- Supports multiple implementations
- Clear API boundaries

#### 3. Result Pattern
Consistent error handling:
```typescript
export interface IResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  metadata?: Record<string, unknown>;
}

async function operation(): Promise<IResult<Data>> {
  try {
    const data = await doWork();
    return { success: true, data };
  } catch (error) {
    logger.error('Operation failed', error as Error);
    return { success: false, error: error as Error };
  }
}
```

#### 4. Event-Driven Architecture
Optional event system for debugging:
```typescript
@injectable()
export class Service {
  constructor(@inject(TYPES.IEventBus) eventBus: IEventBus) {
    setEventBus(this, eventBus);
  }
  
  @Emits('service.operation')
  @Traces({ threshold: 500 })
  async doWork(): Promise<Result> {
    // Events automatically emitted
  }
}
```

## Git Submodules Architecture

### Meta Repository Pattern

The project uses a meta repository pattern where each package is maintained as an independent Git repository and integrated via Git submodules:

```
h1b-visa-analysis/ (Meta Repository)
├── .gitmodules                    # Submodule configuration
├── packages/                      # Git submodules directory
│   ├── di-framework/             # → github.com/ChaseNoCap/di-framework
│   ├── logger/                   # → github.com/ChaseNoCap/logger
│   ├── test-mocks/               # → github.com/ChaseNoCap/test-mocks
│   ├── test-helpers/             # → github.com/ChaseNoCap/test-helpers
│   ├── file-system/              # → github.com/ChaseNoCap/file-system
│   ├── event-system/             # → github.com/ChaseNoCap/event-system
│   ├── cache/                    # → github.com/ChaseNoCap/cache
│   ├── report-templates/         # → github.com/ChaseNoCap/report-templates
│   ├── prompts/                  # → github.com/ChaseNoCap/prompts
│   ├── markdown-compiler/        # → github.com/ChaseNoCap/markdown-compiler
│   └── report-components/        # → github.com/ChaseNoCap/report-components
└── src/                          # Main application code
```

### Benefits of Submodules

1. **Independent Versioning**: Each package has its own Git history and version tags
2. **Separate CI/CD**: Packages can have independent build and test pipelines
3. **Clear Ownership**: Each repository has distinct maintainers and contributors
4. **Reusability**: Packages can be used in other projects independently
5. **Atomic Changes**: Changes to packages are isolated and trackable

### Development Workflow

```bash
# Clone with submodules
git clone --recurse-submodules <repo-url>

# Work in a submodule
cd packages/logger
git checkout -b feature/new-feature
# Make changes, commit, push
cd ../..
git add packages/logger
git commit -m "chore: update logger submodule"

# Update all submodules
git submodule update --remote --merge
```

### Package Publishing

All packages are published to GitHub Packages:
- Organization: `@chasenocap`
- Registry: `npm.pkg.github.com`
- Consumption: Via standard npm dependencies

## Project Structure

### Standard Package Layout

Packages follow a flexible structure based on their needs:

**Common Structure:**
```
package/
├── src/
│   ├── index.ts        # Public exports (always present)
│   └── [feature-based organization varies by package]
├── tests/              # Test files
├── dist/               # Compiled output
├── CLAUDE.md           # Context documentation
└── package.json        # Dependencies
```

**Actual Package Structures:**
- **Simple packages** (e.g., file-system): Flat structure with interfaces and implementations in src/
- **Feature-based packages** (e.g., di-framework): Organized by feature (container/, tokens/, testing/, etc.)
- **Decorator packages** (e.g., cache, event-system): Organized by type (decorators/, implementations/, interfaces/)

### Main Application Structure
```
h1b-visa-analysis/
├── .gitmodules            # Git submodules configuration
├── src/
│   ├── core/
│   │   ├── constants/      # Injection tokens
│   │   ├── container/      # DI setup
│   │   └── interfaces/     # Core contracts
│   ├── services/           # Business logic
│   └── index.ts           # Public API
├── packages/              # Git submodules (11 packages)
├── tests/                 # Test suites
└── dist/                  # Build output
```

## Shared Patterns

### Logging Strategy
Consistent Winston configuration:
- Console output with colors
- Daily rotating file logs
- Structured JSON format
- Context-aware child loggers

```typescript
const logger = container.get<ILogger>(TYPES.ILogger);
const childLogger = logger.child({ service: 'MyService' });
childLogger.info('Operation started', { userId: 123 });
```

### Testing Approach

#### Unit Tests
- Mock dependencies via DI
- Test public interfaces
- 90%+ coverage target
- Focus on behavior

```typescript
describe('Service', () => {
  const { container, mocks } = setupTest({
    useMocks: ['logger', 'cache']
  });
  
  it('should work', async () => {
    const service = container.get<IService>(TYPES.IService);
    const result = await service.doWork();
    expect(result.success).toBe(true);
  });
});
```

#### E2E Tests
- Use real implementations
- Test complete workflows
- Verify integrations
- Output to gitignored dirs

### Error Handling
Domain-specific error types:
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
```

## Prompt Architecture Patterns

### XML-Structured Prompt System
The project uses XML-based prompts for structured, parseable context:

```xml
<system_architecture>
  <overview>
    This meta repository implements a report generation system with Git submodules
  </overview>
  
  <repository_structure>
    <pattern>Meta Repository with Git Submodules</pattern>
    <total_packages>11</total_packages>
    <registry>GitHub Packages (@chasenocap)</registry>
  </repository_structure>
  
  <packages>
    <category name="Core Infrastructure">
      <package name="logger">
        <purpose>Structured logging with Winston</purpose>
        <status>Git submodule → Published to GitHub Packages</status>
        <repository>github.com/ChaseNoCap/logger</repository>
      </package>
      <package name="di-framework">
        <purpose>Dependency injection container</purpose>
        <status>Git submodule → Published to GitHub Packages</status>
        <repository>github.com/ChaseNoCap/di-framework</repository>
      </package>
    </category>
  </packages>
  
  <dependency_flow>
    Meta Repository → Published Packages (@chasenocap/*)
         ↓                    ↑
    Git Submodules → Independent Repositories
  </dependency_flow>
</system_architecture>
```

### Mirror-Based Prompt Structure
Prompts mirror the actual project structure for intuitive navigation:

```
prompts/
├── src/
│   ├── system/           # System-wide understanding
│   │   ├── architecture.md   # Overall system architecture
│   │   ├── dependencies.md   # System dependency graph
│   │   └── workflows.md      # How components work together
│   │
│   ├── packages/         # Mirrors actual package structure
│   │   ├── logger/          # Logger package prompts
│   │   ├── cache/           # Cache package prompts
│   │   └── .../             # Other packages
│   │
│   ├── applications/     # Main applications
│   └── workflows/        # Cross-cutting processes
│
├── scripts/             # Automation scripts
└── templates/           # Prompt templates
```

### Progressive Context Loading
Implement hierarchical context loading for efficiency:

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

### Task-Specific Context Patterns

#### Bug Fixing Context
```xml
<task_context type="bug_fix">
  <required_context>
    <load>error logs</load>
    <load>affected file</load>
    <load>related tests</load>
  </required_context>
  
  <optional_context>
    <load>recent commits</load>
    <load>similar fixed issues</load>
  </optional_context>
</task_context>
```

#### Package Development Context
```xml
<task_context type="package_development">
  <required_context>
    <load>decomposition-guide.md</load>
    <load>developer-handbook.md</load>
    <load>package-catalog.md</load>
  </required_context>
  
  <conditional_context>
    <when condition="creating_new_package">
      <load>claude-md-template.md</load>
    </when>
    <when condition="working_on_existing">
      <load>packages/{{package}}/CLAUDE.md</load>
    </when>
  </conditional_context>
</task_context>
```

### Keyword Trigger System
Automatic context loading based on keywords:

```xml
<triggers category="package_work">
  <trigger pattern="working on {{package}} package">
    <load>package-catalog.md#{{package}}</load>
    <load>packages/{{package}}/CLAUDE.md</load>
  </trigger>
  
  <trigger pattern="creating new package">
    <load>developer-handbook.md</load>
    <load>decomposition-guide.md</load>
  </trigger>
  
  <trigger pattern="DI pattern|dependency injection">
    <load>architecture-reference.md#dependency-injection</load>
    <load>packages/di-framework/CLAUDE.md</load>
  </trigger>
</triggers>
```

### Prompt Optimization Architecture

#### Minimal Context First
```typescript
// Start with minimal context
const baseContext = {
  project: 'CLAUDE.md',
  architecture: 'architecture-reference.md#core-architecture'
};

// Progressive enhancement
if (workingOnPackage) {
  context.package = `package-catalog.md#${packageName}`;
}

if (needsImplementation) {
  context.source = `packages/${packageName}/src/`;
}
```

#### Error Context Structure
```xml
<error_context>
  <error_message>
    Cannot inject IEventBus into ReportGenerator
  </error_message>
  
  <stack_trace>
    <!-- Include relevant stack trace -->
  </stack_trace>
  
  <context>
    <file>src/services/ReportGenerator.ts</file>
    <line>45</line>
    <recent_changes>
      Added @Emits decorator to generateReport method
    </recent_changes>
  </context>
  
  <attempted_solutions>
    <solution>Verified IEventBus is registered in container</solution>
    <solution>Checked import statements</solution>
  </attempted_solutions>
</error_context>
```

### Prompt Validation Patterns

#### Structure Validation
```typescript
// Ensure prompts match project structure
export interface IPromptValidator {
  validateStructure(): Promise<ValidationResult>;
  validateContent(promptPath: string): Promise<ValidationResult>;
  generateMissingPrompts(): Promise<void>;
}

@injectable()
export class PromptValidator implements IPromptValidator {
  async validateStructure(): Promise<ValidationResult> {
    const projectPackages = await this.scanProjectPackages();
    const promptPackages = await this.scanPromptPackages();
    
    const missing = projectPackages.filter(
      pkg => !promptPackages.has(`packages/${pkg.name}`)
    );
    
    return {
      valid: missing.length === 0,
      issues: missing.map(pkg => `Missing prompts for ${pkg.name}`)
    };
  }
}
```

## Decorator Ecosystem

### Available Decorators

#### From logger package
- `@LogMethod` - Automatic method logging

#### From cache package
- `@Cacheable` - Method result caching
- `@InvalidateCache` - Cache invalidation

#### From event-system
- `@Emits` - Event emission
- `@Traces` - Performance tracking
- `@Monitors` - Health monitoring

### Usage Example
```typescript
@injectable()
export class DataService {
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.IEventBus) eventBus: IEventBus
  ) {
    setEventBus(this, eventBus);
  }

  @LogMethod({ level: 'info' })
  @Cacheable({ ttl: 60000 })
  @Emits('data.fetch')
  @Traces({ threshold: 100 })
  async fetchData(id: string): Promise<Data> {
    // All decorators work together
    return this.dataSource.find(id);
  }
}
```

## Shared Code Analysis

### Code Duplication (Pre-Decomposition)
Analysis revealed significant duplication between h1b-visa-analysis and markdown-compiler:

- **Logger**: 98% identical implementation
- **DI Setup**: 90% similar patterns
- **Interfaces**: 100% identical ILogger
- **Testing**: Same Vitest configuration

### Extracted Packages
Successfully decomposed into 11 Git submodules:

1. **@chasenocap/di-framework** - DI utilities (689 lines)
2. **@chasenocap/logger** - Winston logging (300 lines)
3. **@chasenocap/test-mocks** - Mock implementations (400 lines)
4. **@chasenocap/test-helpers** - Test utilities (500 lines)
5. **@chasenocap/file-system** - File operations (700 lines)
6. **@chasenocap/event-system** - Event bus (800 lines)
7. **@chasenocap/cache** - Caching decorators (400 lines)
8. **@chasenocap/report-templates** - Template engine (287 lines)
9. **@chasenocap/prompts** - AI context management (400 lines)
10. **markdown-compiler** - Markdown processing (private repo)
11. **report-components** - H1B research content (private repo)

**Note**: Some packages have compiled distributions but source files are not currently accessible. Line counts are from actual implementation where available.

### Shared Benefits
- **Code Reduction**: ~500+ lines eliminated
- **Consistency**: Same implementations everywhere
- **Maintainability**: Single source of truth
- **Testing**: Shared mocks and helpers

## Context Validation

### Key Questions Before Changes

#### Architecture Changes
1. Does this align with DI patterns?
2. Following interface-first design?
3. Will it work with existing container?
4. Checked decision history?

#### Package Creation
1. Single clear responsibility?
2. Under 500 lines target?
3. Minimal dependencies (2-3)?
4. Can test in isolation?

#### Code Sharing
1. Used by multiple packages?
2. Cohesive responsibility?
3. Stable interface?
4. Worth the complexity?

## Best Practices

### DO
- Start with interfaces
- Inject all dependencies
- Use Result pattern
- Log with context
- Test via public API
- Keep packages small
- Document in CLAUDE.md

### DON'T
- Hardcode dependencies
- Use console.log
- Create "utils" packages
- Mix responsibilities
- Skip error handling
- Over-engineer
- Forget tests

## Configuration Standards

### TypeScript
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "strict": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Vitest
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['**/node_modules/**', '**/tests/**']
    }
  }
});
```

## Migration Guidelines

### When Extracting Packages
1. Define clear boundaries
2. Create interface first
3. Write CLAUDE.md
4. Add comprehensive tests
5. Migrate incrementally
6. Update all consumers
7. Remove old code

### Package Criteria
- Single responsibility
- Target: < 2000 lines (ideal: < 1000)
- 2-3 runtime dependencies max
- Clear, specific name
- Testable in isolation
- Documented purpose

**Note**: The original 1000-line guideline proved too restrictive. Packages like test-mocks (1,757 lines) and di-framework (1,261 lines) exceed this but maintain clear single responsibilities. The key is cohesion over arbitrary size limits.

## Future Considerations

### Potential Enhancements
1. **Performance Monitoring** - APM integration
2. **Distributed Tracing** - Cross-service tracking
3. **Service Mesh** - For microservices
4. **GraphQL** - Unified API layer

### Scaling Patterns
1. **Horizontal Scaling** - Stateless services
2. **Caching Layers** - Redis integration
3. **Queue Systems** - Async processing
4. **Database Sharding** - Data partitioning

---

*This reference consolidates shared-architecture.md, shared-code-analysis.md, and context-validation.md into a single architectural guide.*