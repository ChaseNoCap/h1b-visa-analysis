# Package Catalog

## Overview

This catalog documents all packages in the meta repository, managed as Git submodules. Each package is maintained in its own GitHub repository and published to GitHub Packages.

**Decomposition Status**: 9/9 packages (100%) ✅  
**Total Packages**: 13 (11 H1B + 2 metaGOTHIC)

## Package Summary

| Package | Repository | NPM Package | Size | Coverage | Purpose |
|---------|------------|-------------|------|----------|---------|
| di-framework | github.com/ChaseNoCap/di-framework | @chasenocap/di-framework | 689 lines | 84% | Dependency injection utilities |
| logger | github.com/ChaseNoCap/logger | @chasenocap/logger | 300 lines | 95%+ | Winston-based logging |
| test-mocks | github.com/ChaseNoCap/test-mocks | @chasenocap/test-mocks | 400 lines | 100% | Mock implementations |
| test-helpers | github.com/ChaseNoCap/test-helpers | @chasenocap/test-helpers | 500 lines | 91.89% | Test utilities |
| file-system | github.com/ChaseNoCap/file-system | @chasenocap/file-system | 700 lines | 95%+ | File operations |
| event-system | github.com/ChaseNoCap/event-system | @chasenocap/event-system | 248 lines | 100%/96.36% | Event-driven debugging |
| cache | github.com/ChaseNoCap/cache | @chasenocap/cache | 400 lines | 94.79% | Caching decorators |
| report-templates | github.com/ChaseNoCap/report-templates | @chasenocap/report-templates | 199 lines | 100% | Template engine |
| prompts | github.com/ChaseNoCap/prompts | @chasenocap/prompts | 400 lines | N/A | AI context management |
| markdown-compiler | github.com/ChaseNoCap/markdown-compiler | Private | N/A | N/A | Markdown processing |
| report-components | github.com/ChaseNoCap/report-components | Private | N/A | N/A | H1B research content |
| claude-client | github.com/ChaseNoCap/claude-client | @chasenocap/claude-client | 1500 lines | 95%+ | Claude CLI subprocess wrapper |
| prompt-toolkit | github.com/ChaseNoCap/prompt-toolkit | @chasenocap/prompt-toolkit | 1500 lines | 100% | XML template system |

All packages are Git submodules integrated via `.gitmodules` configuration

## Package Details

### 1. di-framework
**Repository**: [github.com/ChaseNoCap/di-framework](https://github.com/ChaseNoCap/di-framework)  
**NPM Package**: `@chasenocap/di-framework`  
**Purpose**: Core dependency injection utilities and base interfaces

**Features**:
- Container builders with fluent API
- Token creation and management
- Base interfaces (IDisposable, IInitializable)
- Testing utilities for DI

**API Example**:
```typescript
import { ContainerBuilder, createTokens } from 'di-framework';

const TYPES = createTokens('app', {
  IService: 'Service interface'
});

const container = new ContainerBuilder()
  .addBinding(TYPES.IService, ServiceImpl)
  .build();
```

**Key Patterns**:
- Fluent builder API
- Type-safe token management
- Lifecycle management

### 2. logger
**Repository**: [github.com/ChaseNoCap/logger](https://github.com/ChaseNoCap/logger)  
**NPM Package**: `@chasenocap/logger`  
**Purpose**: Centralized logging with Winston backend

**Features**:
- Daily rotating file logs
- Structured JSON logging
- Child loggers with context
- LogMethod decorator
- Console and file outputs

**API Example**:
```typescript
import type { ILogger } from '@chasenocap/logger';

class Service {
  @LogMethod({ level: 'info' })
  async processData() {
    this.logger.info('Processing started');
  }
}
```

**Integration**: Published to GitHub Packages, consumed as npm dependency

### 3. test-mocks
**Repository**: [github.com/ChaseNoCap/test-mocks](https://github.com/ChaseNoCap/test-mocks)  
**NPM Package**: `@chasenocap/test-mocks`  
**Purpose**: Mock implementations for unit testing

**Features**:
- MockLogger with call tracking
- MockFileSystem with in-memory storage
- MockCache with statistics
- Built-in assertion helpers

**API Example**:
```typescript
import { MockLogger, MockFileSystem } from '@chasenocap/test-mocks';

const logger = new MockLogger();
logger.info('test');
expect(logger.hasLogged('info', 'test')).toBe(true);

const fs = new MockFileSystem();
fs.seed({ '/file.txt': 'content' });
```

**Key Achievement**: 100% test coverage

### 4. test-helpers
**Repository**: [github.com/ChaseNoCap/test-helpers](https://github.com/ChaseNoCap/test-helpers)  
**NPM Package**: `@chasenocap/test-helpers`  
**Purpose**: Testing utilities and container setup

**Features**:
- TestContainer for DI setup
- FixtureManager for test data
- Async utilities (waitFor, retry, delay)
- Shared vitest configuration
- Automatic cleanup tracking

**API Example**:
```typescript
import { setupTest, waitFor } from '@chasenocap/test-helpers';

const { container, mocks, cleanup } = setupTest({
  useMocks: ['logger', 'fileSystem']
});

await waitFor(() => service.isReady);
```

**Coverage**: 91.89% (exceeded 90% target)

### 5. file-system
**Repository**: [github.com/ChaseNoCap/file-system](https://github.com/ChaseNoCap/file-system)  
**NPM Package**: `@chasenocap/file-system`  
**Purpose**: Abstract file and path operations

**Features**:
- Unified async/sync file operations
- Auto-creation of parent directories
- Platform-independent path handling
- Comprehensive error types
- In-memory mock for testing

**API Example**:
```typescript
import type { IFileSystem } from '@chasenocap/file-system';

// Auto-creates directory if needed
await fileSystem.writeFile('/path/to/file.txt', 'content');

const exists = await fileSystem.exists('/path/to/file.txt');
const content = await fileSystem.readFile('/path/to/file.txt');
```

**Key Benefits**:
- No file system side effects in tests
- Consistent error handling
- Cross-platform compatibility

### 6. event-system
**Repository**: [github.com/ChaseNoCap/event-system](https://github.com/ChaseNoCap/event-system)  
**NPM Package**: `@chasenocap/event-system`  
**Purpose**: Event-driven debugging and instrumentation

**Features**:
- EventBus with pattern matching
- Decorators: @Emits, @Traces, @Monitors
- TestEventBus for testing
- Performance tracking
- Optional integration

**API Example**:
```typescript
@injectable()
class Service {
  constructor(@inject(TYPES.IEventBus) eventBus: IEventBus) {
    setEventBus(this, eventBus);
  }
  
  @Emits('service.process', {
    payloadMapper: (id: string) => ({ id })
  })
  @Traces({ threshold: 500 })
  async process(id: string) {
    // Events automatically emitted
  }
}
```

**Testing Pattern**:
```typescript
const testEventBus = new TestEventBus();
testEventBus.expectEvent('service.process.completed')
  .toHaveBeenEmitted()
  .withPayload({ id: '123' });
```

### 7. cache
**Repository**: [github.com/ChaseNoCap/cache](https://github.com/ChaseNoCap/cache)  
**NPM Package**: `@chasenocap/cache`  
**Purpose**: Method-level caching with decorators

**Features**:
- @Cacheable decorator with TTL
- @InvalidateCache for cache busting
- MemoryCache implementation
- Event integration (optional)
- Pattern-based invalidation

**API Example**:
```typescript
class DataService {
  @Cacheable({ ttl: 60000 }) // 1 minute
  async fetchData(id: string): Promise<Data> {
    // Expensive operation cached
  }
  
  @InvalidateCache('DataService.fetchData:*')
  async updateData(id: string, data: Data) {
    // Invalidates related cache entries
  }
}
```

**Key Design**:
- Singleton cache instance
- Cache keys include class/method names
- Graceful degradation without events

**Shared Usage**: Both h1b-visa-analysis and markdown-compiler use this package

### 8. report-templates
**Repository**: [github.com/ChaseNoCap/report-templates](https://github.com/ChaseNoCap/report-templates)  
**NPM Package**: `@chasenocap/report-templates`  
**Purpose**: Template engine for report generation

**Features**:
- Fluent API for report building
- Template registry system
- Markdown and HTML support
- Section management
- Metadata handling

**API Example**:
```typescript
import { MarkdownReportBuilder } from '@chasenocap/report-templates';

const report = new MarkdownReportBuilder()
  .title('H1B Visa Report')
  .metadata({ date: new Date() })
  .section('Overview', 'Report content...')
  .subsection('Details', 'More details...')
  .build();
```

**Achievement**: 100% test coverage, smallest package (287 lines)

### 9. prompts
**Repository**: [github.com/ChaseNoCap/prompts](https://github.com/ChaseNoCap/prompts)  
**NPM Package**: `@chasenocap/prompts`  
**Purpose**: Centralized AI prompt management with mirror-based architecture  
**Status**: ✅ Implemented

**Features**:
- Mirror structure of actual project layout
- System-level prompts (architecture, dependencies, workflows)
- Package-specific prompts for all packages
- Workflow documentation and patterns
- XML-structured prompts for parseability
- Auto-updating status via scripts

**API Example**:
```typescript
import { getPackagePrompts, getSystemPrompts } from '@chasenocap/prompts';

// Load system understanding
const systemContext = getSystemPrompts();

// Load package-specific context
const cachePrompts = getPackagePrompts('cache');
const { overview, api, integration, status } = cachePrompts;

// Load workflow understanding
const workflow = getWorkflowPrompts()['report-generation'];
```

**Structure**:
```
prompts/
├── src/
│   ├── system/           # System-wide prompts
│   ├── packages/         # Mirrors actual packages
│   │   ├── cache/       # Cache package prompts
│   │   ├── logger/      # Logger package prompts
│   │   └── .../        # Other packages
│   ├── applications/    # Main applications
│   └── workflows/       # Cross-cutting workflows
├── scripts/             # Automation scripts
└── templates/           # Prompt templates
```

**Key Benefits**:
- Single source of truth for all prompts
- Structure conveys relationships
- Easy navigation and discovery
- Version controlled prompt evolution
- Progressive context loading
- XML-enhanced for structured parsing

**References**:
- Implementation: `/docs/prompt-migration-guide.md`
- XML Patterns: `/docs/prompt-xml-structured-guide.md`
- Optimization: `/docs/prompt-optimization-patterns.md`

### 10. markdown-compiler
**Repository**: [github.com/ChaseNoCap/markdown-compiler](https://github.com/ChaseNoCap/markdown-compiler) (Private)  
**Purpose**: Markdown processing and compilation engine  
**Integration**: Domain-specific dependency for report generation

### 11. report-components
**Repository**: [github.com/ChaseNoCap/report-components](https://github.com/ChaseNoCap/report-components) (Private)  
**Purpose**: H1B research content and analysis components  
**Integration**: Domain-specific dependency providing report content

### 12. claude-client (metaGOTHIC)
**Repository**: [github.com/ChaseNoCap/claude-client](https://github.com/ChaseNoCap/claude-client)  
**NPM Package**: `@chasenocap/claude-client`  
**Purpose**: Claude CLI subprocess wrapper with streaming support for metaGOTHIC framework  
**Status**: ✅ Implemented

**Features**:
- Claude subprocess lifecycle management
- Real-time streaming with buffering
- Session management and persistence
- Configuration with sensible defaults
- Comprehensive error handling (Result pattern)
- Full dependency injection integration

**API Example**:
```typescript
import { createClaudeClient } from '@chasenocap/claude-client';

const client = await createClaudeClient();

// Simple command execution
const result = await client.execute({
  command: 'claude',
  args: ['--help']
});

// Session-based execution
const sessionId = await client.createSession({
  id: 'dev-session',
  workingDirectory: '/project'
});

await client.execute(command, { sessionId });

// Streaming responses
await client.executeStream(command, (chunk) => {
  process.stdout.write(chunk);
});
```

**Key Design**:
- Subprocess wrapper pattern
- Session isolation
- Streaming with event emitters
- Graceful cleanup on shutdown

### 13. prompt-toolkit (metaGOTHIC)
**Repository**: [github.com/ChaseNoCap/prompt-toolkit](https://github.com/ChaseNoCap/prompt-toolkit)  
**NPM Package**: `@chasenocap/prompt-toolkit`  
**Purpose**: XML template system and prompt construction utilities for metaGOTHIC framework  
**Status**: ✅ Implemented

**Features**:
- XML template schema with full parsing
- Variable interpolation (conditionals, loops, switches)
- Template inheritance with caching
- Progressive context loading strategies
- Comprehensive validation and error handling
- Token estimation for AI interactions

**API Example**:
```typescript
import { createPromptToolkit } from '@chasenocap/prompt-toolkit';

const toolkit = await createPromptToolkit();

// Parse XML template
const xmlTemplate = `
<prompt_template id="analysis" name="Code Analysis">
  <variables>
    <variable name="file_path" type="string" required="true" />
  </variables>
  <content>
    Analyze the code in {{file_path}}.
    {{#if complexity}}
    Pay special attention to {{complexity}} complexity.
    {{/if}}
  </content>
</prompt_template>
`;

// Register and use template
await toolkit.registry.register(template);
const prompt = await toolkit.constructor.construct('analysis', {
  variables: { file_path: 'src/index.ts', complexity: 'high' }
});
```

**Interpolation Patterns**:
- Simple: `{{variable}}`
- Conditionals: `{{#if condition}}...{{/if}}`
- Loops: `{{#each array}}{{this}}{{/each}}`
- Equality: `{{#if_equals var "value"}}...{{/if_equals}}`
- Switch: `{{#switch var}}{{#case "val"}}...{{/case}}{{/switch}}`

**Key Achievement**: 100% test coverage with 32 tests

## Architecture Patterns

### Dependency Flow
```
Meta Repository (h1b-visa-analysis)
    ├── Git Submodules (packages/)
    │   ├── H1B Analysis Packages:
    │   │   ├── @chasenocap/di-framework
    │   │   ├── @chasenocap/logger
    │   │   ├── @chasenocap/test-mocks
    │   │   ├── @chasenocap/test-helpers
    │   │   ├── @chasenocap/file-system
    │   │   ├── @chasenocap/event-system
    │   │   ├── @chasenocap/cache
    │   │   ├── @chasenocap/report-templates
    │   │   ├── @chasenocap/prompts
    │   │   ├── markdown-compiler
    │   │   └── report-components
    │   └── metaGOTHIC Packages:
    │       ├── @chasenocap/claude-client
    │       └── @chasenocap/prompt-toolkit
    │
    └── NPM Dependencies (package.json)
        ├── @chasenocap/di-framework
        ├── @chasenocap/logger
        ├── @chasenocap/file-system
        ├── @chasenocap/cache
        └── @chasenocap/report-templates
```

### Common Patterns Across Packages

1. **Interface-First Design**
   - All packages expose interfaces
   - Implementations are internal
   - Clear public API boundaries

2. **Decorator Usage**
   - Logger: @LogMethod
   - Cache: @Cacheable, @InvalidateCache
   - Events: @Emits, @Traces

3. **Testing Support**
   - Each package includes testing utilities
   - Mock implementations where appropriate
   - High coverage standards (>90%)

4. **Error Handling**
   - Domain-specific error types
   - Comprehensive error context
   - Consistent error patterns

5. **Optional Dependencies**
   - Event system as peer dependency
   - Graceful degradation
   - No hard coupling

## Integration Examples

### Service with Full Integration
```typescript
@injectable()
export class ReportGenerator implements IReportGenerator {
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.IFileSystem) private fileSystem: IFileSystem,
    @inject(TYPES.IReportBuilder) private reportBuilder: IReportBuilder,
    @inject(TYPES.IEventBus) eventBus: IEventBus
  ) {
    setEventBus(this, eventBus);
  }

  @Emits('report.generate')
  @Traces({ threshold: 1000 })
  @Cacheable({ ttl: 300000 }) // 5 minutes
  async generate(options: IReportOptions): Promise<IReportResult> {
    this.logger.info('Generating report', { options });
    
    const report = this.reportBuilder
      .title(options.title)
      .build();
      
    await this.fileSystem.writeFile(
      this.fileSystem.join(options.outputDir, 'report.md'),
      report
    );
    
    return { success: true, path: outputPath };
  }
}
```

## Migration Success Metrics

- **Code Reduction**: ~500+ lines eliminated
- **Test Coverage**: All packages >84%, average >90%
- **Size Control**: All packages <1000 lines
- **Reusability**: Cache shared across projects
- **Maintainability**: Clear boundaries and responsibilities

---

*This catalog consolidates all package implementation summaries, tracking documents, and quick references into a single comprehensive reference for the Git submodules architecture.*