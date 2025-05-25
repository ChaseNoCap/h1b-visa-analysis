# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## 🎯 Context Loading Guide

### Efficient Documentation Access
The documentation has been consolidated from 34 files to 12 core documents. Load only what's needed:

### 📚 Documentation Structure (12 Core Files)
1. **[/docs/index.md](/docs/index.md)** - Documentation hub and navigation
2. **[/docs/decomposition-guide.md](/docs/decomposition-guide.md)** - Principles, patterns, and governance
3. **[/docs/migration-guide.md](/docs/migration-guide.md)** - Package extraction process
4. **[/docs/package-catalog.md](/docs/package-catalog.md)** - All 8 packages with details
5. **[/docs/developer-handbook.md](/docs/developer-handbook.md)** - Templates and guidelines
6. **[/docs/setup-guide.md](/docs/setup-guide.md)** - Environment configuration
7. **[/docs/architecture-reference.md](/docs/architecture-reference.md)** - Technical patterns
8. **[/docs/achievements.md](/docs/achievements.md)** - Success metrics
9. **[/docs/prompt-engineering.md](/docs/prompt-engineering.md)** - Context loading strategies

### 🔍 Context Loading by Task
- **Working on packages**: Load `/docs/package-catalog.md#[package-name]`
- **Creating new package**: Load `/docs/developer-handbook.md`
- **Architecture questions**: Load `/docs/architecture-reference.md`
- **Setup/GitHub Actions**: Load `/docs/setup-guide.md`
- **Understanding decomposition**: Load `/docs/decomposition-guide.md`

### 💡 Efficient Prompting
See `/docs/prompt-engineering.md` for keyword triggers and context loading strategies.

## Decomposition Principles

**IMPORTANT**: This project follows strict decomposition principles. See `/docs/decomposition-principles.md` for the complete guide.

### Key Principles:
1. **Single Purpose**: Each package has exactly ONE reason to exist
2. **Clear Boundaries**: Package names clearly indicate their purpose
3. **Size Limits**: Packages stay under 1000 lines with < 5 public exports
4. **Dependency Direction**: Dependencies flow from specific → general
5. **Test in Isolation**: If you can't test it alone, it's too coupled

## Project Overview

This is an H1B report generator monorepo that orchestrates three GitHub-based private dependencies:
- `prompts-shared` - AI development workflows and context management
- `markdown-compiler` - Markdown processing and compilation  
- `report-components` - H1B research content

The project automatically generates reports when dependencies update via GitHub Actions.

## Current Architecture (TypeScript + DI)

As of May 2025, this project has been migrated to TypeScript with dependency injection, matching the architecture of the markdown-compiler package.

### Tech Stack
- **TypeScript** with ES2022 modules and strict mode
- **Inversify** for dependency injection with decorators
- **Winston** for logging with daily rotation
- **Vitest** for testing (unit and E2E)
- **ESLint + Prettier** for code quality

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

# Workspace commands
npm run build:all      # Build all workspaces
npm run test:all       # Test all workspaces

# Package-specific coverage
cd packages/test-helpers && npm run coverage  # Check test-helpers coverage (91.89%)
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
├── packages/                  # Workspace packages
│   ├── di-framework/          # DI utilities and interfaces ✅
│   ├── logger/               # Logging package ✅
│   ├── test-mocks/            # Test mocks ✅
│   ├── test-helpers/          # Test helpers ✅
│   ├── file-system/          # File operations abstraction ✅
│   ├── event-system/         # Event-driven debug & test system ✅
│   ├── prompts-shared/       # Cloned dependency
│   ├── markdown-compiler/    # Cloned dependency
│   └── report-components/    # Cloned dependency
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
1. Clone dependency repos to `packages/`
2. Make changes and test with `npm test`
3. Build with `npm run build`
4. Check types with `npm run typecheck`

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
4. **Clean Imports**: All logger imports now use @chasenogap/logger

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
- **Status**: Extracted to GitHub package @chasenogap/logger
- **Size**: ~300 lines (well within 1000 line limit)
- **Location**: Published to GitHub Packages
- **Features**: Winston-based logging with daily rotation, structured logging, child loggers
- **Usage**: Production dependency - imported as `import type { ILogger } from '@chasenogap/logger'`
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

### ✅ Decomposition Complete! (May 2025)

**Achievement Unlocked**: 8/8 packages (100%) successfully extracted and integrated! 🎉

**Completed Integrations**:
- ✅ markdown-compiler now uses shared cache package
- ✅ ReportGenerator now uses report-templates package
- ✅ All packages under 1000 lines with clear boundaries
- ✅ Test coverage exceeds targets across all packages

**Future Work (Post-Decomposition)**:
1. **Implement report content integration** 📝
   - Wire up actual content from dependencies
   - Use template engine for dynamic content
   - Feature work - not part of decomposition

2. **Performance Optimizations** ⚡
   - Add caching to expensive operations
   - Implement streaming for large reports
   - Profile and optimize hot paths

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

The monorepo uses a **hybrid pattern** for shared packages that are published to external repositories:

```
h1b-visa-analysis/
├── packages/
│   ├── logger/                    # 🔧 DEVELOPMENT workspace
│   │   ├── src/                   # Edit, test, commit, push here
│   │   ├── .git/                  # Connected to github.com/ChaseNoCap/logger
│   │   └── package.json           # @chasenogap/logger
│   ├── di-framework/             # 🔧 DEVELOPMENT workspace (local only)
│   └── test-mocks/               # 🔧 DEVELOPMENT workspace (local only)
├── package.json
│   ├── workspaces: ["packages/di-framework", "packages/test-mocks"]  # Local packages
│   └── dependencies: {"@chasenogap/logger": "^1.0.0"}               # Published packages
└── src/                          # 📦 CONSUMES @chasenogap/logger from GitHub
```

### Package Categories

1. **Published Shared Packages** (like logger):
   - **Development**: Work in `/packages/logger/` workspace
   - **Consumption**: Install from GitHub Packages as `@chasenogap/logger`
   - **NOT in workspaces array** - prevents resolution conflicts
   - **Workflow**: Edit → Test → Commit → Push → Publish → Update consumers

2. **Local Workspace Packages** (like di-framework, test-mocks):
   - **Development**: Work in `/packages/di-framework/` workspace  
   - **Consumption**: Used directly via workspaces (no publishing)
   - **IN workspaces array** - enables local development
   - **Workflow**: Edit → Test → Commit → Used immediately

### Development Workflow for Published Packages

```bash
# 1. Work on the shared package
cd packages/logger/
# Make changes, add features
npm test
npm run build

# 2. Commit and push to GitHub
git add .
git commit -m "feat: add new logging capability"
git push

# 3. Publish new version (manual or CI/CD)
npm version patch  # bumps to 1.0.1
npm publish

# 4. Update consumer projects
cd ../../  # Back to main project
npm update @chasenogap/logger
# Test integration, commit dependency update
```

## Package Development Status Summary

### Decomposition Progress: 8/8 packages (100%) ✅ 🎉

### Published Shared Dependencies ✅
- **@chasenogap/logger**: Winston-based logging, published to GitHub Packages
  - ✅ Fully integrated with child loggers and structured context
  - ✅ Local duplicate code removed

### Local Workspace Dependencies ✅  
- **di-framework**: Core DI utilities and interfaces (84% coverage)
- **test-mocks**: Mock implementations for testing (100% coverage)
- **test-helpers**: Test utilities and helpers (91.89% coverage) ✅
- **file-system**: File operations abstraction (95%+ coverage) ✅
- **event-system**: Event-driven debug and test system ✅
- **cache**: Caching decorators and utilities (94.79% coverage) ✅
- **report-templates**: Template engine and report builders (100% coverage) ✅

### Current Architecture Status ✅
The project uses a clean, modular architecture with:
- Main application in `/src/` with enhanced logging and templating
- Mixed local/published package consumption pattern
- All 8 packages under 1000 lines with clear single responsibilities
- TypeScript compilation: ✅ Clean with no errors
- Tests: ✅ 301/314 tests passing (96% pass rate)
- Testing Stack: ✅ Simplified - Vitest only (Sinon removed)
- **Decomposition Complete**: 100% of planned packages extracted

## Development Guidelines
- No AI ads in commit messages

## Development Environment Checks

### Model Version Validation
- **Important**: Ensure the model is running Opus v4 and alert the user if this is not the case, asking them to fix