# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Context Building Guide

### 📚 Documentation Index
For comprehensive project context, see `/docs/README.md` - the documentation index that maps all available resources.

### 🎯 Task-Specific Context
- **Architecture Overview**: Start with `/docs/decomposition-principles.md` and `/docs/decomposition-analysis.md`
- **Package Development**: Read `/docs/migration-plan.md` → `/docs/testing-package-implementation.md`
- **Creating New Packages**: Follow `/docs/claude-md-template.md` and `/docs/claude-md-guide.md`
- **GitHub Actions**: Check `/docs/automation-setup.md` for CI/CD workflows

### 🔗 Decision Trail
The project's decomposition strategy flows from:
1. **Principles** (`/docs/decomposition-principles.md`) → defines the "why"
2. **Analysis** (`/docs/decomposition-analysis.md`) → applies principles to this codebase
3. **Implementation** (`/docs/migration-plan.md`) → executes the strategy
4. **Current Focus** (`/docs/testing-package-implementation.md`) → @h1b/testing package

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
│   │   ├── ReportGenerator.ts
│   │   └── WinstonLogger.ts
│   └── index.ts               # Main entry point (PUBLIC API)
├── tests/                     # Test suite
│   ├── e2e/                   # End-to-end tests
│   │   ├── fixtures/          # Test fixtures
│   │   └── output/           # Test output (gitignored)
│   └── unit/                  # Unit tests
├── packages/                  # Cloned dependency repos (gitignored)
│   ├── prompts-shared/
│   ├── markdown-compiler/
│   └── report-components/
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
- `container`: Pre-configured DI container

### Dependency Injection Pattern

The project uses Inversify for dependency injection:

```typescript
// Define interfaces
export interface ILogger { ... }
export interface IReportGenerator { ... }

// Create injection tokens
export const TYPES = {
  ILogger: Symbol.for('ILogger'),
  IReportGenerator: Symbol.for('IReportGenerator'),
};

// Injectable services
@injectable()
export class ReportGenerator implements IReportGenerator {
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger
  ) {}
}

// Container setup
const container = new Container();
container.bind<ILogger>(TYPES.ILogger).to(WinstonLogger);
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

Winston logger with:
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

## Current Focus: @h1b/testing Package

**IMPORTANT**: The current primary development goal is implementing the @h1b/testing package.

See:
- `/docs/testing-package-implementation.md` - Implementation plan and status
- `/docs/migration-plan.md` - Overall shared package strategy
- `/packages/shared/testing/CLAUDE.md` - Package-specific context (when created)

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
- `/packages/shared/testing/CLAUDE.md` - Example implementation