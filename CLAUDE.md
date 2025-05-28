# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## 🎯 Context Loading Guide

### Efficient Documentation Access
The documentation has been consolidated and organized by purpose. Load only what's needed for your specific task.

### 📚 Core Documentation Structure

**System Overview**:
- **[/docs/index.md](/docs/index.md)** - Documentation hub and navigation
- **[/docs/backlog.md](/docs/backlog.md)** - Prioritized work items and future tasks  
- **[/docs/achievements.md](/docs/achievements.md)** - Success metrics and milestones

**Architecture & Patterns**:
- **[/docs/architecture-reference.md](/docs/architecture-reference.md)** - Technical patterns and system architecture
- **[/docs/meta-repository-pattern.md](/docs/meta-repository-pattern.md)** - Git submodules architecture
- **[/docs/decomposition-guide.md](/docs/decomposition-guide.md)** - Principles, patterns, and governance

**Operations Guides**:
- **[/docs/unified-dependency-strategy.md](/docs/unified-dependency-strategy.md)** - Dependency management strategy
- **[/docs/package-operations-guide.md](/docs/package-operations-guide.md)** - Package publishing and management
- **[/docs/ci-monitoring-operations-guide.md](/docs/ci-monitoring-operations-guide.md)** - CI/CD monitoring and health

**Development Resources**:
- **[/docs/package-catalog.md](/docs/package-catalog.md)** - Package details and usage
- **[/docs/developer-handbook.md](/docs/developer-handbook.md)** - Templates and guidelines
- **[/docs/setup-guide.md](/docs/setup-guide.md)** - Environment configuration

**AI Context & Prompts**:
- **[/docs/prompt-xml-structured-guide.md](/docs/prompt-xml-structured-guide.md)** - XML prompt patterns
- **[/docs/prompt-optimization-patterns.md](/docs/prompt-optimization-patterns.md)** - Efficient prompting
- **[/docs/prompt-migration-guide.md](/docs/prompt-migration-guide.md)** - Prompt package architecture

**Architectural Decisions**:
- **[/docs/ADR-001-unified-dependency-strategy.md](/docs/ADR-001-unified-dependency-strategy.md)** - Dependency strategy decisions
- **[/docs/ADR-002-git-submodules-architecture.md](/docs/ADR-002-git-submodules-architecture.md)** - Submodules architecture decisions

### 🔍 Context Loading by Task
- **What's next?**: Load `/docs/backlog.md` - Always check backlog first
- **Package operations**: Load `/docs/package-operations-guide.md` for publishing and management
- **Working on packages**: Load `/docs/package-catalog.md#[package-name]`
- **Creating new package**: Load `/docs/developer-handbook.md#package-creation-process`
- **Git submodules help**: Load `/docs/meta-repository-pattern.md` for submodule management
- **Dependency strategy**: Load `/docs/unified-dependency-strategy.md` for development workflow
- **CI/monitoring issues**: Load `/docs/ci-monitoring-operations-guide.md` for troubleshooting
- **Prompt engineering**: Load `/docs/prompt-xml-structured-guide.md` for XML patterns
- **Optimizing prompts**: Load `/docs/prompt-optimization-patterns.md` for efficiency
- **Architecture questions**: Load `/docs/architecture-reference.md` for technical patterns
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
    <constraint>Follow package size guidelines (see decomposition-guide.md)</constraint>
    <constraint>Follow existing decorator patterns</constraint>
    <constraint>Maintain test coverage targets (see package standards)</constraint>
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
3. **Size Guidelines**: Packages follow size limits defined in decomposition principles
4. **Dependency Direction**: Dependencies flow from specific → general
5. **Test in Isolation**: If you can't test it alone, it's too coupled

## Project Overview

This is a dual-purpose meta repository that:
1. **H1B Analysis System**: Orchestrates 11 Git submodules for H1B visa report generation
2. **metaGOTHIC Framework**: Developing 9 additional packages (6 complete) for AI-guided development

The project uses a meta repository pattern where each package is maintained in its own GitHub repository and integrated via Git submodules. Total packages: 17 (11 H1B + 6 metaGOTHIC).

The H1B system automatically generates reports when dependencies update via GitHub Actions.

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
cd packages/test-helpers && npm run coverage  # Check package coverage

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
├── packages/                  # Git submodules (17 total)
│   ├── # H1B Analysis Packages (11)
│   ├── di-framework/          # → github.com/ChaseNoCap/di-framework ✅
│   ├── logger/               # → github.com/ChaseNoCap/logger ✅
│   ├── test-mocks/            # → github.com/ChaseNoCap/test-mocks ✅
│   ├── test-helpers/          # → github.com/ChaseNoCap/test-helpers ✅
│   ├── file-system/          # → github.com/ChaseNoCap/file-system ✅
│   ├── event-system/         # → github.com/ChaseNoCap/event-system ✅
│   ├── cache/                # → github.com/ChaseNoCap/cache ✅
│   ├── report-templates/     # → github.com/ChaseNoCap/report-templates ✅
│   ├── prompts/              # → github.com/ChaseNoCap/prompts ✅
│   ├── markdown-compiler/    # → github.com/ChaseNoCap/markdown-compiler ✅
│   ├── report-components/    # → github.com/ChaseNoCap/report-components ✅
│   ├── # metaGOTHIC Packages (6/9)
│   ├── claude-client/        # → github.com/ChaseNoCap/claude-client 🚀
│   ├── prompt-toolkit/       # → github.com/ChaseNoCap/prompt-toolkit 🚀
│   ├── sdlc-config/          # → github.com/ChaseNoCap/sdlc-config 🚀
│   ├── sdlc-engine/          # → github.com/ChaseNoCap/sdlc-engine 🚀
│   ├── sdlc-content/         # → github.com/ChaseNoCap/sdlc-content ✅
│   └── ui-components/        # → (ready for GitHub repo creation) 🚀
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
- Coverage targets per package guidelines

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

### Recent Improvements
1. **Enhanced Logging**: All services now use child loggers with operation context
2. **Simplified Testing**: Removed Sinon dependency, using only Vitest mocks
3. **Clean Imports**: All logger imports now use @chasenocap/logger
4. **metaGOTHIC Progress**: 6/9 packages complete (67%) in just 3 days

## Package Status Overview

All packages have been successfully extracted, integrated, and automated. For current package details including features, status, and usage information, see:

- **Package Catalog**: `/docs/package-catalog.md` - Complete package information
- **Operations Guide**: `/docs/package-operations-guide.md` - Publishing and management  
- **Architecture**: `/docs/ADR-002-git-submodules-architecture.md` - Architecture decisions

### Infrastructure Status
- ✅ **Package Decomposition**: Complete (11 packages operational)
- ✅ **Automation**: Fully operational publishing and dependency updates
- ✅ **Quality Gates**: Testing and quality standards enforced
- ✅ **Documentation**: Comprehensive guides and troubleshooting available

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

3. **🚀 metaGOTHIC Package Development Started** (January 2025)
   - Created 6/9 foundation packages (67% complete)
   - @chasenocap/claude-client: Claude CLI subprocess wrapper with streaming
   - @chasenocap/prompt-toolkit: XML template system (100% coverage)
   - @chasenocap/sdlc-config: YAML-based SDLC configuration (93% coverage)
   - @chasenocap/sdlc-engine: State machine for SDLC phase management
   - @chasenocap/sdlc-content: Templates and knowledge base (89.6% coverage)
   - @chasenocap/ui-components: React components (Terminal, FileTree, BacklogBoard)
   - Rapid development pace: 6 packages in 3 days

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
Implemented comprehensive automated dependency update system:
- **Status**: ✅ All packages updated with consistent dependency versions
- **Process**: Automated dependency updates across entire ecosystem
- **Benefits**: Version consistency, security updates, unified toolchain

### Auto-Update Dependencies Workflow 
- **Status**: ✅ Workflow operational and properly updating packages when triggered
- **Process**: Uses correct npm install syntax for version-specific updates

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