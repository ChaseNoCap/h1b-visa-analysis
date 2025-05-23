# CLAUDE.md Template for Shared Packages

This template should be used when creating any new package in the monorepo. Copy this file to `CLAUDE.md` in the package root and fill in the sections.

```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the [PACKAGE_NAME] package.

## Package Identity

**Name**: @h1b/[PACKAGE_NAME]  
**Purpose**: [One sentence description]  
**Status**: [Development/Stable/Deprecated]  
**Owner**: [Team/Person responsible]  
**Created**: [Date]  

## Package Context in Monorepo

### Upstream Dependencies
[List packages this depends on]
- @h1b/core (for DI container)
- @h1b/logger (for logging)

### Downstream Consumers
[List packages that depend on this]
- h1b-visa-analysis (main project)
- markdown-compiler

### Position in Architecture
[Explain where this fits in the overall system]

## Technical Architecture

### Core Interfaces
```typescript
// List main interfaces this package exports
export interface IMainService {
  // ...
}
```

### Design Patterns
- **Dependency Injection**: All services use Inversify
- **Interface-First**: Define contracts before implementations
- **Async by Default**: All I/O operations are async
- [Package-specific patterns]

### Key Technologies
- TypeScript (strict mode)
- Inversify (DI)
- [Package-specific tech]

## Development Guidelines

### Code Organization
```
src/
├── interfaces/     # Public contracts
├── implementations/# Concrete classes
├── decorators/     # If applicable
├── utils/          # Helper functions
├── errors/         # Custom errors
└── index.ts        # Public exports
```

### Naming Conventions
- Interfaces: `IServiceName`
- Implementations: `ServiceName`
- Decorators: `@DecoratorName`
- Errors: `ServiceNameError`

### Testing Requirements
- Minimum 90% coverage
- Unit tests for all public methods
- Integration tests for complex flows
- Use @h1b/testing utilities

## GitHub Integration

### Workflows
- **CI/CD**: Runs on all PRs
- **Notifications**: [If this notifies other repos]
- **Auto-publish**: [If published to npm]

### Branch Protection
- main branch protected
- Requires PR reviews
- Must pass all tests

## Common Tasks

### Adding a New Feature
1. Define interface first
2. Write tests using @h1b/testing
3. Implement feature
4. Update exports in index.ts
5. Document in README

### Debugging Issues
1. Check logs (uses @h1b/logger)
2. Run tests in watch mode
3. Use VSCode debugger
4. [Package-specific debugging]

### Releasing Changes
1. Update version in package.json
2. Update CHANGELOG.md
3. Create PR with changes
4. Tag release after merge

## API Patterns

### Service Creation
```typescript
// Factory pattern
export function createService(options?: IOptions): IService {
  const container = new Container();
  // Configure container
  return container.get<IService>(TYPES.IService);
}

// Or direct DI
@injectable()
export class Service implements IService {
  constructor(
    @inject(TYPES.IDep) private dep: IDep
  ) {}
}
```

### Error Handling
```typescript
// Always use typed errors
export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

// Return Result types
export type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: Error };
```

## Integration Examples

### With Main Project
```typescript
import { createService } from '@h1b/[package]';

const service = createService({
  logger: container.get(TYPES.ILogger)
});
```

### With Other Packages
[Show how this integrates with other shared packages]

## Performance Considerations
- [Package-specific performance notes]
- Caching strategies
- Memory usage patterns

## Security Considerations
- [Package-specific security notes]
- Input validation
- Secret handling

## Known Issues
- [List any known limitations]
- [Workarounds if applicable]

## Future Enhancements
- [Planned features]
- [Potential optimizations]

## Maintenance Notes
- [Special maintenance requirements]
- [Dependencies to watch]
- [Upgrade considerations]

## Important Patterns

### DO
- Use dependency injection
- Return Result types
- Log all operations
- Handle errors gracefully
- Write comprehensive tests

### DON'T
- Use console.log (use ILogger)
- Throw untyped errors
- Make synchronous I/O calls
- Hardcode dependencies
- Skip tests

## Questions to Ask When Developing
1. Is this following the established patterns?
2. Are all interfaces defined?
3. Is error handling comprehensive?
4. Are tests adequate?
5. Is it properly integrated with logging?
6. Does it use DI correctly?

## Related Documentation
- Main monorepo: `/CLAUDE.md`
- Architecture: `/docs/shared-architecture.md`
- Testing guide: `/docs/testing-package-implementation.md`
- [Package-specific docs]
```