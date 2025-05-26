# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## 🎯 Context Loading Guide

### Efficient Documentation Access
The documentation has been consolidated from 34 files to 12 core documents. Load only what's needed:

### 📚 Documentation Structure (16 Core Files)
1. **[/docs/index.md](/docs/index.md)** - Documentation hub and navigation
2. **[/docs/backlog.md](/docs/backlog.md)** - Prioritized work items and future tasks
3. **[/docs/decomposition-guide.md](/docs/decomposition-guide.md)** - Principles, patterns, and governance
4. **[/docs/migration-guide.md](/docs/migration-guide.md)** - Package extraction process
5. **[/docs/package-catalog.md](/docs/package-catalog.md)** - All 9 packages with details (including prompts)
6. **[/docs/developer-handbook.md](/docs/developer-handbook.md)** - Templates, guidelines, and prompt development
7. **[/docs/setup-guide.md](/docs/setup-guide.md)** - Environment configuration
8. **[/docs/architecture-reference.md](/docs/architecture-reference.md)** - Technical patterns and prompt architecture
9. **[/docs/achievements.md](/docs/achievements.md)** - Success metrics
10. **[/docs/meta-repository-pattern.md](/docs/meta-repository-pattern.md)** - Git submodules architecture
11. **[/docs/prompt-engineering.md](/docs/prompt-engineering.md)** - Context loading strategies
12. **[/docs/prompt-xml-structured-guide.md](/docs/prompt-xml-structured-guide.md)** - XML prompt patterns
13. **[/docs/prompt-optimization-patterns.md](/docs/prompt-optimization-patterns.md)** - Efficient prompting
14. **[/docs/prompt-migration-guide.md](/docs/prompt-migration-guide.md)** - Prompt package architecture

15. **[/docs/automated-publishing-critical-path.md](/docs/automated-publishing-critical-path.md)** - Critical path to automated publishing
16. **[/docs/package-publish-monitoring-plan.md](/docs/package-publish-monitoring-plan.md)** - Package publish monitoring strategy

### 🔍 Context Loading by Task
- **What's next?**: Load `/docs/backlog.md` - Always check backlog first
- **Critical path work**: Load `/docs/automated-publishing-critical-path.md` for current priority
- **Working on packages**: Load `/docs/package-catalog.md#[package-name]`
- **Creating new package**: Load `/docs/developer-handbook.md#package-creation-process`
- **Git submodules help**: Load `/docs/meta-repository-pattern.md` for submodule management
- **Prompt engineering**: Load `/docs/prompt-xml-structured-guide.md` for XML patterns
- **Optimizing prompts**: Load `/docs/prompt-optimization-patterns.md` for efficiency
- **Prompt package work**: Load `/docs/prompt-migration-guide.md` for architecture
- **Architecture questions**: Load `/docs/architecture-reference.md#prompt-architecture-patterns`
- **Setup/GitHub Actions**: Load `/docs/setup-guide.md`
- **Understanding decomposition**: Load `/docs/decomposition-guide.md`

## 🤖 Advanced Prompt Engineering

### XML-Structured Context Loading
Use XML patterns for structured, parseable prompts:

```xml
<task_definition>
  <objective>
    Create a new caching decorator for Redis support
  </objective>
  
  <requirements>
    <requirement priority="high">
      Maintain compatibility with existing @Cacheable decorator
    </requirement>
    <requirement priority="medium">
      Support TTL configuration
    </requirement>
  </requirements>
  
  <constraints>
    <constraint>Package must remain under 1000 lines</constraint>
    <constraint>Follow existing decorator patterns</constraint>
    <constraint>Maintain 90%+ test coverage</constraint>
  </constraints>
</task_definition>
```

### Progressive Context Loading Strategy
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

### Keyword Trigger System
Automatic context loading based on specific keywords:

- **"working on [package] package"** → Loads package-catalog.md + package CLAUDE.md
- **"creating new package"** → Loads developer-handbook.md + decomposition-guide.md
- **"DI pattern"** → Loads architecture-reference.md#dependency-injection
- **"testing strategy"** → Loads test-helpers and test-mocks documentation
- **"prompt optimization"** → Loads prompt-optimization-patterns.md

### Optimization Patterns

#### ✅ Good Prompt Patterns
```
"The cache decorator in ReportGenerator isn't working - getting undefined results when using @Cacheable on generateReport method"

"Update the logger package to add JSON export format support"

"Getting 'Cannot inject IEventBus' error when using @Emits decorator in ReportGenerator.ts:45
Stack: [full trace]
Recent: Added event decorators"
```

#### ❌ Anti-Patterns to Avoid
```
"Fix the bug"                    → Too vague
"Make it better"                 → No clear objective
"The testing utilities"          → Use "test-helpers package"
"Load all documentation"         → Context overload
```

### Prompts Package Integration
The prompts package is now implemented. Use this pattern:

```typescript
import { getPackagePrompts, getSystemPrompts, getWorkflowPrompts } from 'prompts';

// Load system understanding
const systemContext = getSystemPrompts();
const architecture = systemContext.architecture;

// Load package-specific context
const cachePrompts = getPackagePrompts('cache');
const { overview, api, integration, status } = cachePrompts;

// Load workflow understanding
const reportWorkflow = getWorkflowPrompts()['report-generation'];
```

### 💡 Efficient Prompting
Comprehensive prompt engineering resources:
- **[/docs/prompt-engineering.md](/docs/prompt-engineering.md)** - Context loading strategies and keyword triggers
- **[/docs/prompt-xml-structured-guide.md](/docs/prompt-xml-structured-guide.md)** - XML-based prompt structure for parseability
- **[/docs/prompt-optimization-patterns.md](/docs/prompt-optimization-patterns.md)** - Optimization techniques and anti-patterns
- **[/docs/prompt-migration-guide.md](/docs/prompt-migration-guide.md)** - Mirror-based prompt package implementation

## Decomposition Principles

**IMPORTANT**: This project follows strict decomposition principles. See `/docs/decomposition-principles.md` for the complete guide.

### Key Principles:
1. **Single Purpose**: Each package has exactly ONE reason to exist
2. **Clear Boundaries**: Package names clearly indicate their purpose
3. **Size Limits**: Packages target < 2000 lines with < 5 public exports (ideal: < 1000)
4. **Dependency Direction**: Dependencies flow from specific → general
5. **Test in Isolation**: If you can't test it alone, it's too coupled

## Project Overview

This is an H1B report generator meta repository that orchestrates 11 Git submodules as independent package repositories. The project uses a meta repository pattern where each package is maintained in its own GitHub repository and integrated via Git submodules.

The project automatically generates reports when dependencies update via GitHub Actions.

## Current Architecture (TypeScript + DI + Full Automation)

As of May 2025, this project has been migrated to TypeScript with dependency injection and **fully automated publishing pipeline**.

### Tech Stack
- **TypeScript** with ES2022 modules and strict mode
- **Inversify** for dependency injection with decorators
- **Winston** for logging with daily rotation
- **Vitest** for testing (unit and E2E)
- **ESLint + Prettier** for code quality

### 🚀 Fully Automated Publishing Pipeline (May 2025) ✅
- **GitHub Packages**: All 11 packages auto-publish on push ✅
- **Real-time Updates**: Instant dependency updates via repository_dispatch ✅
- **Version Management**: Automatic semantic versioning and GitHub releases ✅
- **Authentication**: Complete PAT_TOKEN scope fixes across 12 repositories ✅
- **NPM Config**: Standardized npm authentication across all workflows ✅
- **End-to-End Flow**: publish → notify → auto-update → PR creation ✅
- **Zero Manual Intervention**: Fully automated dependency management ✅

## Key Commands

```bash
# Install dependencies
npm install

# Build and generate report (outputs to dist/)
npm run build

# Development
npm run build:watch     # Watch mode for TypeScript
npm run test           # Run tests
npm run test:watch     # Watch mode for tests
npm run coverage       # Generate coverage report
npm run lint           # Lint code
npm run typecheck      # Type check without building

# Submodule commands
git submodule update --init --recursive  # Initialize all submodules
git submodule update --remote --merge    # Update all submodules to latest

# Package-specific commands (run within each submodule)
cd packages/test-helpers && npm run coverage  # Check test-helpers coverage (91.89%)

# Automation & CI/CD Monitoring commands
./scripts/monitor-ci-health.sh          # Enhanced health monitor (transparent metrics)
./scripts/monitor-ci-health.sh json     # JSON output for automation
./scripts/generate-ci-dashboard.sh      # Generate detailed markdown dashboard

# Package Publishing (automated via workflows)
gh workflow run "Publish Package" --repo ChaseNoCap/cache      # Manual publish trigger
gh run list --workflow="Auto Update Dependencies" --limit=5    # Check auto-update status
```

## Architecture

See `/docs/decomposition-analysis.md` for detailed architectural patterns and `/docs/migration-plan.md` for implementation roadmap.

### Current Project Structure
```
h1b-visa-analysis/
├── src/                        # TypeScript source
│   ├── core/                  # Core infrastructure
│   │   ├── constants/         # Injection tokens
│   │   ├── container/         # DI container setup
│   │   └── interfaces/        # TypeScript interfaces
│   ├── services/              # Injectable services
│   │   ├── DependencyChecker.ts
│   │   └── ReportGenerator.ts
│   └── index.ts               # Main entry point (PUBLIC API)
├── tests/                     # Test suite
│   ├── e2e/                   # End-to-end tests
│   │   ├── fixtures/          # Test fixtures
│   │   └── output/           # Test output (gitignored)
│   └── unit/                  # Unit tests
├── packages/                  # Git submodules
│   ├── di-framework/          # → github.com/ChaseNoCap/di-framework ✅
│   ├── logger/               # → github.com/ChaseNoCap/logger ✅
│   ├── test-mocks/            # → github.com/ChaseNoCap/test-mocks ✅
│   ├── test-helpers/          # → github.com/ChaseNoCap/test-helpers ✅
│   ├── file-system/          # → github.com/ChaseNoCap/file-system ✅
│   ├── event-system/         # → github.com/ChaseNoCap/event-system ✅
│   ├── cache/                # → github.com/ChaseNoCap/cache ✅
│   ├── report-templates/     # → github.com/ChaseNoCap/report-templates ✅
│   ├── prompts/              # → github.com/ChaseNoCap/prompts ✅
│   ├── markdown-compiler/    # → github.com/ChaseNoCap/markdown-compiler
│   └── report-components/    # → github.com/ChaseNoCap/report-components
├── dist/                      # Build output (gitignored)
├── logs/                      # Application logs (gitignored)
├── coverage/                  # Test coverage (gitignored)
├── tsconfig.json              # TypeScript configuration
├── vitest.config.ts           # Test configuration
├── .eslintrc.json             # ESLint configuration
└── .prettierrc                # Prettier configuration
```

### Public API
Via `index.ts`:
- `IReportGenerator`: Main report generation interface  
- `IDependencyChecker`: Dependency validation interface
- `TYPES`: Injection tokens for DI
- `containerPromise`: Async pre-configured DI container

### Dependency Injection Pattern

The project uses the `di-framework` package for dependency injection:

```typescript
// Import from packages
import type { ILogger } from 'logger';
import { TYPES } from './core/constants/injection-tokens.js';

// Injectable services
@injectable()
export class ReportGenerator implements IReportGenerator {
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger
  ) {}
}

// Container is pre-configured and available as promise
const container = await containerPromise;
const service = container.get<IReportGenerator>(TYPES.IReportGenerator);
```

## Testing Strategy

### E2E Tests
- Located in `tests/e2e/`
- Test full report generation flow
- Include error scenarios (missing dependencies)
- Output to `tests/e2e/output/` (gitignored)

### Unit Tests
- Located in `tests/unit/`
- Test individual services in isolation
- Use mocks for dependencies
- High coverage target (80%+)

### Running Tests
```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm run coverage      # With coverage report
```

## Logging Configuration

Uses the `logger` package which provides Winston-based logging:
- Console output (colorized)
- Daily rotating file logs in `logs/`
- JSON format for structured logging
- Context-aware child loggers
- Environment-based log levels

## GitHub Actions Integration

### Workflows
- `generate-report.yml`: Main workflow for report generation
- Triggers on push, manual dispatch, or dependency updates
- Uses PAT_TOKEN for private repo access
- Auto-commits generated reports

### Linting Configuration
- `.github/actionlint.yaml`: GitHub Actions linting
- `.vscode/settings.json`: VSCode integration
- `.yamllint.yml`: YAML file linting

## Development Workflow

### Local Development
1. Clone with submodules: `git clone --recurse-submodules <repo-url>`
2. Or initialize submodules: `git submodule update --init --recursive`
3. Work within submodules: `cd packages/logger && npm test`
4. Update submodule references: `git submodule update --remote --merge`

### Before Pushing
1. Run `npm test` to ensure tests pass
2. Run `npm run lint` to check code style
3. Pull latest: `git pull --rebase --autostash`
4. Push changes to trigger CI/CD

## Event System Integration

### Event-Driven Architecture
Services now emit events for debugging and testing:
```typescript
@injectable()
export class MyService implements IMyService {
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.IEventBus) eventBus: IEventBus
  ) {
    setEventBus(this, eventBus);
  }
  
  @Emits('service.operation', {
    payloadMapper: (input: string) => ({ input })
  })
  @Traces({ threshold: 500 })
  async doWork(input: string): Promise<Result> {
    // Implementation - events auto-emitted
  }
}
```

### Testing with Events
```typescript
const testEventBus = new TestEventBus();
const service = new MyService(logger, testEventBus);

await service.doWork('test');

// Assert events
testEventBus.expectEvent('service.operation.started').toHaveBeenEmitted();
testEventBus.expectEvent('service.operation.completed')
  .toHaveBeenEmitted()
  .withPayload({ result: 'success' });
```

## Common Patterns

### Service Implementation
```typescript
@injectable()
export class MyService implements IMyService {
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.IOtherService) private other: IOtherService
  ) {}
  
  async doWork(): Promise<Result> {
    this.logger.info('Starting work');
    // Implementation
  }
}
```

### Error Handling
```typescript
try {
  const result = await service.doWork();
  return { success: true, result };
} catch (error) {
  logger.error('Operation failed', error as Error);
  return { success: false, error: error as Error };
}
```

## Shared Architecture with markdown-compiler

This project follows the same patterns as the markdown-compiler package. Both maintain small contexts with clear boundaries.

For shared patterns and strategies, see `/docs/decomposition-analysis.md`.

### Recent Improvements (January 2025)
1. **Enhanced Logging**: All services now use child loggers with operation context
2. **Simplified Testing**: Removed Sinon dependency, using only Vitest mocks
3. **Improved Coverage**: test-helpers package now at 91.89% coverage
4. **Clean Imports**: All logger imports now use @chasenocap/logger

## Current Status: Package Decomposition Progress

### ✅ Completed Packages (May 2025)

Successfully extracted and integrated the following packages:

#### di-framework ✅
- **Status**: Built, tested, fully integrated
- **Size**: ~689 lines (well within 1000 line limit)
- **Coverage**: 84% statement coverage
- **Location**: `/packages/di-framework/`
- **Features**: Container builders, tokens, base interfaces, testing utilities
- **Usage**: Core dependency - used by main project and other packages

#### logger ✅  
- **Status**: Extracted to GitHub package @chasenocap/logger
- **Size**: ~300 lines (well within 1000 line limit)
- **Location**: Published to GitHub Packages
- **Features**: Winston-based logging with daily rotation, structured logging, child loggers
- **Usage**: Production dependency - imported as `import type { ILogger } from '@chasenocap/logger'`
- **Integration**: ✅ Fully integrated, duplicate code removed

#### test-mocks ✅
- **Status**: Built, tested, 100% statement coverage
- **Size**: ~400 lines (well within 1000 line limit)
- **Location**: `/packages/test-mocks/`
- **Features**: MockLogger, MockFileSystem, MockCache with assertion helpers
- **Usage**: Dev dependency - used in test suites

#### test-helpers ✅
- **Status**: Built, tested with excellent coverage
- **Size**: ~500 lines (well within 1000 line limit)
- **Coverage**: 91.89% (exceeded 90% target) ✅ 
- **Location**: `/packages/test-helpers/`
- **Features**: TestContainer, FixtureManager, async utilities, createSpiedInstance, shared config
- **Usage**: Dev dependency - used in test suites

#### file-system ✅
- **Status**: Built, tested, fully integrated
- **Size**: ~700 lines (well within 1000 line limit)
- **Coverage**: 95%+ statement coverage
- **Location**: `/packages/file-system/`
- **Features**: File operations abstraction with async/sync methods
- **Usage**: Production dependency - abstracts all file I/O

#### event-system ✅
- **Status**: Built, tested, fully integrated
- **Size**: ~800 lines (well within 1000 line limit)
- **Coverage**: High coverage with comprehensive tests
- **Location**: `/packages/event-system/`
- **Features**: Event-driven debugging, decorators, TestEventBus
- **Usage**: Optional peer dependency for enhanced debugging

#### cache ✅
- **Status**: Built, tested, fully integrated
- **Size**: ~400 lines (well within 1000 line limit)
- **Coverage**: 94.79% statement coverage (exceeded 90% target) ✅
- **Location**: `/packages/cache/`
- **Features**: @Cacheable and @InvalidateCache decorators, MemoryCache with TTL
- **Usage**: Production dependency - shared between h1b-visa-analysis and markdown-compiler

#### report-templates ✅
- **Status**: Built, tested, fully integrated
- **Size**: ~287 lines (well within 1000 line limit)
- **Coverage**: 100% statement coverage ✅
- **Location**: `/packages/report-templates/`
- **Features**: Template engine, MarkdownReportBuilder, template registry
- **Usage**: Production dependency - used by ReportGenerator for formatting

#### prompts ✅
- **Status**: Implemented and fully functional
- **Size**: ~400 lines (well within 1000 line limit)
- **Coverage**: N/A (documentation package)
- **Location**: `/packages/prompts/`
- **Features**: XML-structured prompts, mirror-based architecture, status automation
- **Usage**: Development dependency - AI context management and optimization
- **Implementation**: Complete mirror-based prompt system with automation scripts

### ✅ Complete Automation Infrastructure Achieved! (May 2025)

**Achievement Unlocked**: 11/11 packages (100%) extracted, integrated, and FULLY automated! 🎉🚀✨
**Automated Ecosystem**: Complete with AI context management, real-time publishing, and zero manual intervention! 🤖

**Infrastructure Milestones Achieved**:
- ✅ All 11 packages have standardized automated publishing workflows
- ✅ Real-time dependency updates via repository_dispatch (no delays)
- ✅ Complete authentication pipeline resolved (PAT_TOKEN scopes + npm config)
- ✅ Consistent npm configuration across all packages (no auth failures)
- ✅ End-to-end automation: publish → notify → auto-update → PR creation
- ✅ Monitoring infrastructure ready for real metrics
- ✅ All packages under 1000 lines with clear boundaries
- ✅ Test coverage exceeds targets across all packages

**Automation Breakthrough**:
- 🚀 **Zero Manual Intervention**: Complete hands-off dependency management
- 🔧 **Consistent Patterns**: Standardized workflows and configuration
- ⚡ **Instant Updates**: Real-time propagation across ecosystem
- 🛡️ **Reliable Authentication**: No more intermittent failures

**Recent Critical Achievements**:
1. **✅ Complete Automation Infrastructure** 🚀 (May 2025)
   - All 11 packages have automated publishing workflows
   - Fixed authentication across 12 repositories (PAT_TOKEN scopes)
   - Standardized npm configuration (eliminated auth failures)
   - Real-time dependency updates operational
   - End-to-end pipeline: publish → notify → auto-update → PR
   - Zero manual intervention required for updates

2. **✅ Report Content Integration Complete** 📝
   - Successfully integrated markdown-compiler v0.1.3
   - Connected report-components for H1B content
   - Fixed ES module import issues
   - Generating 119KB reports with comprehensive analysis
   - Full end-to-end pipeline working

**Next Priorities**:
1. **Enhanced Monitoring** 📊
   - Replace "N/A" metrics with real publish data
   - Add automation success rate tracking
   - Create actionable automation alerts
   
2. **Quality Automation** 🧪
   - Add test suites to packages without tests
   - Enable quality gates in publish workflows
   
3. **Performance Optimizations** ⚡
   - Add caching to expensive operations
   - Implement streaming for large reports

For detailed implementation steps, see:
- `/docs/migration-plan.md` - Overall strategy and package order
- `/docs/implementation-roadmap.md` - Concrete timeline and checkpoints
- `/docs/decomposition-principles.md` - Guidelines to follow

## Future Enhancements

1. **Integration with markdown-compiler**: Use the actual markdown processing
2. **PDF Generation**: Add PDF output format
3. **Web UI**: Create a web interface for report generation
4. **Performance Monitoring**: Add metrics and tracing

## Troubleshooting

### TypeScript Errors
- Run `npm run typecheck` to see all errors
- Check that all imports use `.js` extension (for ES modules)
- Ensure decorators are enabled in tsconfig.json

### Test Failures
- Check logs in `logs/` directory
- Ensure test fixtures exist
- Clear test output: `rm -rf tests/e2e/output`

### Build Issues
- Clean build: `npm run clean && npm run build`
- Check Node version (requires 16+)
- Verify all dependencies installed

## Important Notes

- All test outputs are gitignored
- Logs rotate daily (kept for 14 days)
- Use dependency injection for all services
- Follow interface-first design
- Keep commit messages professional
- Maintain small context boundaries
- Only expose necessary interfaces through public API
- Avoid cross-context dependencies

## CLAUDE.md Files in Monorepo

Every package MUST have a CLAUDE.md file. See:
- `/docs/claude-md-template.md` - Template for new packages
- `/docs/claude-md-guide.md` - Best practices guide
- `/packages/di-framework/CLAUDE.md` - DI utilities and interfaces
- `/packages/test-mocks/CLAUDE.md` - Mock implementations (MockLogger, MockFileSystem, MockCache)
- `/packages/test-helpers/CLAUDE.md` - Test utilities and helpers
- `/packages/file-system/CLAUDE.md` - File operations abstraction
- `/packages/event-system/CLAUDE.md` - Event-driven debug and test system
- `/packages/cache/CLAUDE.md` - Caching decorators and utilities
- `/packages/report-templates/CLAUDE.md` - Template engine and report builders

## Key Patterns Discovered During Decomposition

### 1. Package Size Control
- Both test packages came in under 500 lines each (target was <1000)
- Clear single responsibility made size control natural
- When a package feels too big, it probably is

### 2. Interface Segregation
- Separate mock implementations from test utilities
- Each mock has its own focused interface
- Test helpers don't depend on specific mocks

### 3. Minimal Dependencies
- test-mocks: Only depends on inversify
- test-helpers: Depends on test-mocks + vitest
- Clear dependency direction maintained

### 4. Documentation as Code
- CLAUDE.md files define context boundaries
- README.md provides usage examples
- TypeScript interfaces serve as living documentation

## Shared Package Development Pattern

### Development vs. Consumption Architecture

The meta repository uses Git submodules for all packages, which are published to GitHub Packages:

```
h1b-visa-analysis/ (Meta Repository)
├── .gitmodules                    # Submodule configuration
├── packages/                      # All packages as Git submodules
│   ├── logger/                    # Git submodule → github.com/ChaseNoCap/logger
│   │   ├── src/                   # Edit, test, commit, push in submodule repo
│   │   ├── .git/                  # Submodule's git directory
│   │   └── package.json           # @chasenocap/logger
│   ├── di-framework/             # Git submodule → github.com/ChaseNoCap/di-framework
│   └── test-mocks/               # Git submodule → github.com/ChaseNoCap/test-mocks
├── package.json                   # No workspaces field - uses published packages
│   └── dependencies: {"@chasenocap/logger": "^1.0.0"}  # From GitHub Packages
└── src/                          # 📦 CONSUMES published packages from GitHub
```

### Package Management

All packages are Git submodules published to GitHub Packages:

1. **Core Infrastructure Packages**:
   - **Development**: Work in `/packages/[package]/` submodule
   - **Consumption**: Install from GitHub Packages as `@chasenocap/[package]`
   - **Workflow**: Edit in submodule → Test → Commit → Push → Publish → Update meta repo

2. **Submodule Management**:
   - Each package is an independent Git repository
   - Meta repository tracks specific commits via submodule references
   - Changes require updating both submodule and meta repository

### Development Workflow for Submodule Packages

```bash
# 1. Navigate to the submodule
cd packages/logger/

# 2. Create feature branch in submodule
git checkout -b feature/new-capability

# 3. Make changes and test
npm test
npm run build

# 4. Commit and push in submodule
git add .
git commit -m "feat: add new logging capability"
git push origin feature/new-capability

# 5. After merge, publish new version
git checkout main
git pull
npm version patch  # bumps to 1.0.1
npm publish

# 6. Update meta repository
cd ../../  # Back to meta repo
git add packages/logger
git commit -m "chore: update logger submodule to v1.0.1"
npm update @chasenocap/logger  # Update package.json dependency
```

## Package Development Status Summary

### Decomposition Progress: 9/9 packages (100%) ✅ 🎉
### Total Packages: 9 (including implemented prompts package)

### Published Shared Dependencies ✅
- **@chasenocap/logger**: Winston-based logging, published to GitHub Packages
  - ✅ Fully integrated with child loggers and structured context
  - ✅ Local duplicate code removed

### Git Submodule Packages ✅  
- **@chasenocap/di-framework**: Core DI utilities and interfaces (84% coverage)
- **@chasenocap/test-mocks**: Mock implementations for testing (100% coverage)
- **@chasenocap/test-helpers**: Test utilities and helpers (91.89% coverage) ✅
- **@chasenocap/file-system**: File operations abstraction (95%+ coverage) ✅
- **@chasenocap/event-system**: Event-driven debug and test system ✅
- **@chasenocap/cache**: Caching decorators and utilities (94.79% coverage) ✅
- **@chasenocap/report-templates**: Template engine and report builders (100% coverage) ✅
- **@chasenocap/prompts**: AI context management (implemented) ✅

### Current Architecture Status ✅
The project uses a clean, modular architecture with:
- Main application in `/src/` with enhanced logging and templating
- Meta repository pattern with Git submodules
- All 9 packages under 1000 lines with clear single responsibilities
- Implemented prompts package for AI context management
- TypeScript compilation: ✅ Clean with no errors
- Tests: ✅ 301/314 tests passing (96% pass rate)
- Testing Stack: ✅ Simplified - Vitest only (Sinon removed)
- **Decomposition Complete**: 100% of packages extracted and implemented
- **Prompt Engineering**: Comprehensive XML-based prompt system implemented

## Development Guidelines
- No AI ads in commit messages

## Recent Achievements (January 2025)

### ✅ Complete Dependency Automation System (May 2025)
Implemented comprehensive automated dependency update system across all 11 packages:
- **Status**: ✅ All packages updated with consistent versions
- **Coverage**: 11/11 packages (100% complete)
- **Target Versions**: TypeScript 5.7.3, @types/node 22.10.2, Vitest 2.1.8, ESLint 9.18.0
- **Process**: Automated npm install → commit → push across entire ecosystem
- **Benefits**: Version consistency, security updates, unified toolchain

**Phase 1 Complete**: di-framework, logger, file-system, test-mocks, test-helpers
**Phase 2 Complete**: event-system, cache, report-templates, prompts, markdown-compiler, report-components

### Auto-Update Dependencies Workflow 
Fixed the `auto-update-dependencies.yml` workflow that was failing with exit code 1:
- **Issue**: Used `npm update "@package@version"` which is invalid syntax
- **Fix**: Changed to `npm install "@package@version"` for proper version installation
- **Status**: ✅ Workflow now properly updates packages when triggered

## Working with the Backlog

### When Asked "What's Next?"
1. **Always check `/docs/backlog.md` first** - This is the source of truth for prioritized work
2. **Help refine work items** - Break down high-level items into concrete tasks
3. **Enforce backlog usage** - New work should be added to the backlog for prioritization
4. **Update status** - Mark items as in progress/complete as work proceeds

### Backlog Best Practices
- Work items should come from the backlog, not ad-hoc requests
- Help users understand the priority and impact of different items
- Suggest refinements to make work items more actionable
- Track completion and celebrate progress

## Development Environment Checks

### Model Version Validation
- **Important**: Ensure the model is running Opus v4 and alert the user if this is not the case, asking them to fix