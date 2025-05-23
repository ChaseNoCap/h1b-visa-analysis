# Decomposition Analysis: Maintaining Smaller Context Per Project

## Executive Summary

This document analyzes decomposition patterns found in the h1b-visa-analysis monorepo and proposes enhanced strategies for maintaining smaller, focused contexts per project. The analysis reveals successful patterns including interface-first design, dependency injection, and bounded contexts through clear architectural boundaries.

## 1. Current Decomposition Patterns Summary

### 1.1 Architectural Decomposition

The monorepo demonstrates several levels of decomposition:

#### **Package-Level Decomposition**
- **Main Application**: h1b-visa-analysis (orchestrator)
- **Core Dependencies**: 
  - prompts-shared (AI workflows)
  - markdown-compiler (processing engine)
  - report-components (content)
- **Planned Shared Packages**: 
  - @h1b/testing (current focus)
  - @h1b/logger, @h1b/core, @h1b/decorators, etc.

#### **Module-Level Decomposition**
Each package follows a consistent structure:
```
package/
├── src/
│   ├── core/          # Infrastructure layer
│   │   ├── interfaces/
│   │   ├── constants/
│   │   ├── decorators/
│   │   └── container/
│   ├── services/      # Business logic layer
│   └── index.ts       # Public API surface
```

#### **Service-Level Decomposition**
- Single Responsibility: Each service has one clear purpose
- Interface Segregation: Services depend on minimal interfaces
- Dependency Injection: Loose coupling through IoC container

### 1.2 Context Boundary Patterns

**Effective Boundaries Observed:**
1. **Interface Contracts**: All services communicate through interfaces
2. **Injection Tokens**: Symbolic references prevent tight coupling
3. **Layer Separation**: Clear distinction between core/services/API
4. **Package Exports**: Controlled public API through index.ts

## 2. Successful Patterns from Both Projects

### 2.1 Interface-First Design

Both the main project and markdown-compiler follow strict interface-first development:

```typescript
// Define capability, not implementation
export interface IMarkdownProcessor {
  process(filePath: string, options?: IProcessOptions): Promise<IProcessResult>;
}

// Separate concerns into focused interfaces
export interface IIncludeParser {
  parse(content: string, basePath: string): IIncludeDirective[];
}

export interface ITemplateProcessor {
  process(content: string, variables: Record<string, string>): string;
}
```

**Benefits:**
- Clear contracts reduce cognitive load
- Easy to understand service capabilities
- Enables test doubles and mocking
- Supports multiple implementations

### 2.2 Dependency Injection Container

The Inversify container provides excellent context isolation:

```typescript
// Central configuration, not scattered dependencies
export function configureContainer(container: Container): void {
  container.bind<ILogger>(TYPES.ILogger).to(WinstonLogger);
  container.bind<IFileSystem>(TYPES.IFileSystem).to(NodeFileSystem);
  container.bind<IMarkdownProcessor>(TYPES.IMarkdownProcessor).to(MarkdownProcessor);
}
```

**Benefits:**
- Dependencies declared in one place
- Easy to swap implementations
- Clear dependency graph
- Testability through container reconfiguration

### 2.3 Decorator-Based Cross-Cutting Concerns

Decorators keep business logic clean:

```typescript
@injectable()
export class ReportGenerator implements IReportGenerator {
  @LogMethod({ level: 'info' })
  @Cacheable({ ttl: 60000 })
  async generate(): Promise<Report> {
    // Pure business logic, no logging or caching code
  }
}
```

**Benefits:**
- Separates concerns
- Reduces method complexity
- Reusable across services
- Easy to add/remove behaviors

### 2.4 Focused Test Strategies

Clear separation between test types:
- **Unit Tests**: Test services in isolation with mocks
- **E2E Tests**: Test complete workflows with real implementations
- **Fixtures**: Shared test data separate from test logic

## 3. Enhanced Decomposition Strategies

### 3.1 Vertical Slice Architecture

Instead of traditional horizontal layers, organize by feature:

```
packages/
├── report-generator/
│   ├── src/
│   │   ├── generate-report/     # Complete feature
│   │   │   ├── interfaces/
│   │   │   ├── services/
│   │   │   ├── decorators/
│   │   │   └── index.ts
│   │   ├── check-dependencies/   # Another feature
│   │   └── shared/              # Truly shared code
```

**Benefits:**
- Feature cohesion
- Easier to understand feature scope
- Reduced cross-feature dependencies
- Better code locality

### 3.2 Context Mapping

Define explicit boundaries between contexts:

```typescript
// Context boundary definition
export interface IReportContext {
  // Public API for report generation
  generator: IReportGenerator;
  validator: IReportValidator;
}

export interface IMarkdownContext {
  // Public API for markdown processing
  processor: IMarkdownProcessor;
  parser: IIncludeParser;
}

// Context adapter for integration
export class MarkdownToReportAdapter {
  constructor(
    private markdown: IMarkdownContext,
    private report: IReportContext
  ) {}
}
```

### 3.3 Event-Driven Decomposition

Use events to decouple contexts:

```typescript
export interface IDomainEvent {
  type: string;
  timestamp: Date;
  payload: unknown;
}

@injectable()
export class EventBus {
  publish(event: IDomainEvent): void { }
  subscribe(type: string, handler: (event: IDomainEvent) => void): void { }
}

// Usage
@injectable()
export class ReportGenerator {
  constructor(private eventBus: EventBus) {}
  
  async generate() {
    // Generate report...
    this.eventBus.publish({
      type: 'REPORT_GENERATED',
      timestamp: new Date(),
      payload: { reportId, path }
    });
  }
}
```

### 3.4 Micro-Frontend Pattern for Services

Apply micro-frontend principles to backend services:

```typescript
// Service manifest
export interface IServiceManifest {
  name: string;
  version: string;
  capabilities: string[];
  dependencies: string[];
  initialize: (container: Container) => void;
}

// Self-contained service module
export const markdownServiceManifest: IServiceManifest = {
  name: '@h1b/markdown',
  version: '1.0.0',
  capabilities: ['markdown.process', 'markdown.parse'],
  dependencies: ['@h1b/logger', '@h1b/file-system'],
  initialize: (container) => {
    // Register all service components
  }
};
```

## 4. Context Boundary Management Techniques

### 4.1 Explicit Public APIs

Define clear module boundaries:

```typescript
// packages/markdown-compiler/src/index.ts
// Only export what consumers need
export { IMarkdownProcessor, IProcessOptions, IProcessResult } from './core/interfaces';
export { TYPES } from './core/constants';
export { container } from './core/container';

// Hide implementation details
// DO NOT export: MarkdownProcessor, IncludeParser, etc.
```

### 4.2 Anti-Corruption Layers

Protect bounded contexts from external changes:

```typescript
// External API adapter
@injectable()
export class GitHubApiAdapter {
  constructor(
    @inject(TYPES.IHttpClient) private http: IHttpClient,
    @inject(TYPES.ILogger) private logger: ILogger
  ) {}

  // Transform external API to internal domain model
  async getRepository(owner: string, repo: string): Promise<IRepository> {
    const response = await this.http.get(`/repos/${owner}/${repo}`);
    return this.mapToRepository(response.data);
  }

  private mapToRepository(data: any): IRepository {
    // Map external structure to internal model
  }
}
```

### 4.3 Shared Kernel Pattern

Define minimal shared concepts:

```typescript
// packages/shared/kernel/src/types.ts
export interface IEntity<T> {
  id: T;
  createdAt: Date;
  updatedAt: Date;
}

export interface IValueObject<T> {
  value: T;
  equals(other: IValueObject<T>): boolean;
}

// Shared but minimal - each context extends as needed
```

### 4.4 Context Documentation

Use CLAUDE.md files to define context boundaries:

```markdown
## Context Boundary

This package is part of the Markdown Processing context.

### Public API
- IMarkdownProcessor: Main processing interface
- IProcessOptions: Configuration options
- IProcessResult: Processing results

### Internal Components (DO NOT DEPEND ON)
- MarkdownProcessor: Implementation detail
- IncludeParser: Internal parsing logic
- RecursionDetector: Internal safety mechanism

### Dependencies
- Depends on: @h1b/logger, @h1b/file-system
- Consumed by: report-generator context
```

## 5. Practical Implementation Guidelines

### 5.1 Creating a New Bounded Context

1. **Define the Context Purpose**
   ```markdown
   # Context: User Authentication
   Purpose: Handle user authentication and authorization
   Capabilities: login, logout, validate tokens, check permissions
   ```

2. **Identify Public Interfaces**
   ```typescript
   export interface IAuthService {
     login(credentials: ICredentials): Promise<IAuthToken>;
     validateToken(token: string): Promise<IUser>;
   }
   ```

3. **Design Internal Structure**
   ```
   packages/auth/
   ├── src/
   │   ├── core/
   │   │   └── interfaces/
   │   ├── services/
   │   │   ├── AuthService.ts
   │   │   ├── TokenValidator.ts
   │   │   └── PermissionChecker.ts
   │   └── index.ts  # Public API only
   ```

4. **Define Integration Points**
   - Events published
   - APIs consumed
   - Shared kernel usage

### 5.2 Refactoring to Smaller Contexts

1. **Identify Cohesive Groups**
   - Services that change together
   - Shared domain concepts
   - Common data access patterns

2. **Extract Interfaces First**
   - Define new context interfaces
   - Implement adapters in existing code
   - Gradually move implementation

3. **Use Feature Flags**
   ```typescript
   @injectable()
   export class FeatureFlags {
     isEnabled(feature: string): boolean {
       return process.env[`FEATURE_${feature}`] === 'true';
     }
   }
   ```

### 5.3 Testing Strategies for Small Contexts

1. **Context-Level Tests**
   ```typescript
   describe('Authentication Context', () => {
     let context: IAuthContext;
     
     beforeEach(() => {
       context = createAuthContext({ useMocks: true });
     });
     
     it('should handle complete login flow', async () => {
       // Test public API only
     });
   });
   ```

2. **Integration Contract Tests**
   ```typescript
   describe('Auth-Report Integration', () => {
     it('should validate report generator token', async () => {
       // Test integration points only
     });
   });
   ```

## 6. Example: Applying Patterns to a New Feature

### Scenario: Adding PDF Generation to Report System

#### Step 1: Define New Context
```typescript
// packages/pdf-generator/src/core/interfaces/IPdfContext.ts
export interface IPdfContext {
  generator: IPdfGenerator;
  templateEngine: ITemplateEngine;
}

export interface IPdfGenerator {
  generate(content: string, options?: IPdfOptions): Promise<Buffer>;
}
```

#### Step 2: Create Context Adapter
```typescript
// packages/report-generator/src/adapters/PdfAdapter.ts
@injectable()
export class ReportToPdfAdapter {
  constructor(
    @inject(TYPES.IPdfContext) private pdf: IPdfContext,
    @inject(TYPES.ILogger) private logger: ILogger
  ) {}

  async generatePdf(report: IReport): Promise<Buffer> {
    const markdown = await this.convertReportToMarkdown(report);
    return this.pdf.generator.generate(markdown);
  }
}
```

#### Step 3: Define Integration Events
```typescript
// Publish event when PDF is generated
this.eventBus.publish({
  type: 'PDF_GENERATED',
  timestamp: new Date(),
  payload: { reportId, size: buffer.length }
});
```

#### Step 4: Update Context Documentation
```markdown
# PDF Generator Context

## Purpose
Generate PDF documents from markdown content

## Public API
- IPdfGenerator: Main generation interface
- IPdfOptions: Configuration options

## Integration Points
- Consumes: Markdown content
- Produces: PDF_GENERATED events
- Dependencies: @h1b/logger
```

#### Step 5: Implement with Small Scope
```typescript
// Minimal implementation focused on one thing
@injectable()
export class PdfGenerator implements IPdfGenerator {
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.IRenderer) private renderer: IRenderer
  ) {}

  @LogMethod()
  @Cacheable({ ttl: 300000 }) // 5 minutes
  async generate(content: string, options?: IPdfOptions): Promise<Buffer> {
    const html = await this.renderer.renderMarkdown(content);
    return this.renderer.renderPdf(html, options);
  }
}
```

## Conclusion

Effective decomposition in the h1b-visa-analysis monorepo relies on:

1. **Clear Boundaries**: Well-defined interfaces and public APIs
2. **Loose Coupling**: Dependency injection and event-driven patterns
3. **Focused Contexts**: Single responsibility at every level
4. **Explicit Dependencies**: Clear documentation of context relationships
5. **Incremental Migration**: Gradual refactoring with adapters

By following these patterns, each project context remains small, focused, and maintainable while still supporting complex integrations across the monorepo.