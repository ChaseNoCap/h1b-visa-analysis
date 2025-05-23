# CLAUDE.md Template for Shared Packages

This template should be used when creating any new package in the monorepo. Copy this file to `CLAUDE.md` in the package root and fill in the sections.

**IMPORTANT**: Following our decomposition analysis, packages should be small, focused, and have minimal context. Each package should do ONE thing well.

```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the [PACKAGE_NAME] package.

## Decomposition Principles

**IMPORTANT**: This package follows strict decomposition principles. See `/docs/decomposition-principles.md` for the complete guide.

### Key Principles Applied to [PACKAGE_NAME]:
1. **Single Purpose**: [Describe the ONE thing this package does]
2. **Clear Boundaries**: [Explain why the name clearly indicates purpose]
3. **Size Limits**: [Confirm target is < 1000 lines, < 5 exports]
4. **Dependency Direction**: [List position in dependency hierarchy]
5. **Test in Isolation**: [Confirm it can be tested independently]

### Package-Specific Considerations:
- [What this package explicitly DOES]
- [What this package explicitly DOES NOT do]
- [Any specific decomposition decisions for this package]
- [When to create a new package instead of extending this one]

## Package Identity

**Name**: @h1b/[PACKAGE_NAME]  
**Purpose**: [One sentence description - be VERY specific about the single responsibility]  
**Status**: [Development/Stable/Deprecated]  
**Owner**: [Team/Person responsible]  
**Created**: [Date]  
**Size**: [Small/Medium - aim for Small]  
**Complexity**: [Low/Medium - aim for Low]  

## Single Responsibility

This package is responsible for:
[ONE clear responsibility - if you need "and" or multiple bullets, the package is too big]

This package is NOT responsible for:
- [List what this explicitly does NOT do]
- [Help maintain clear boundaries]

## Package Context in Monorepo

### Upstream Dependencies
[List packages this depends on - keep minimal]
- @h1b/core (for DI container)
- [1-2 other dependencies max]

### Downstream Consumers
[List packages that depend on this]
- h1b-visa-analysis (main project)
- markdown-compiler

### Position in Architecture
[Explain where this fits - should be simple if package is focused]

## Technical Architecture

### Core Interfaces
```typescript
// ONE main interface this package exports (keep it focused!)
export interface I[SingleResponsibility] {
  // 3-5 methods maximum
  // If more, consider splitting the package
}
```

### Design Patterns
- **Single Responsibility**: One clear purpose
- **Minimal Dependencies**: 2-3 max
- **Interface-First**: One main interface
- **Async by Default**: All I/O operations are async
- [Package-specific patterns - keep simple]

### Key Technologies
- TypeScript (strict mode)
- Inversify (DI) - only if truly needed
- [1-2 package-specific tech max]

## Development Guidelines

### Code Organization (Keep It Small!)
```
src/
├── interface.ts    # THE main interface (singular)
├── implementation.ts # THE implementation
├── errors.ts       # Package-specific errors (if any)
├── types.ts        # Shared types (if any)
└── index.ts        # Public exports
```

For slightly larger packages:
```
src/
├── interfaces/     # 2-3 interfaces MAX
├── implementations/# 2-3 classes MAX
├── errors/         # Custom errors
└── index.ts        # Public exports
```

### Naming Conventions
- Interfaces: `IServiceName`
- Implementations: `ServiceName`
- Decorators: `@DecoratorName`
- Errors: `ServiceNameError`

### Testing Requirements
- Minimum 90% coverage (should be easy with focused packages)
- Unit tests for the ONE main interface
- Integration tests only if absolutely needed
- Use @h1b/testing utilities
- Small packages = simpler tests!

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

## Decomposition Guidelines

### Signs Your Package is Too Big
- More than 3-4 interfaces
- More than 500 lines of code
- Needs extensive documentation
- Has multiple responsibilities
- Complex dependency graph
- Hard to test in isolation
- Context file is getting long

### When to Split a Package
If you find yourself:
- Using "and" to describe its purpose
- Creating subdirectories for organization
- Having unrelated utilities together
- Mixing different concerns
- Writing complex integration tests

Consider splitting into smaller, focused packages!

## Important Patterns

### DO
- Keep packages SMALL and focused
- One interface, one responsibility
- Minimal dependencies (2-3 max)
- Simple, clear naming
- Easy to test in isolation
- Quick to understand

### DON'T
- Create "utils" packages (too vague)
- Mix unrelated functionality
- Over-engineer simple things
- Create deep dependency chains
- Make packages that do everything
- Use console.log (use ILogger)

## Questions to Ask When Developing
1. Does this package do ONE thing?
2. Can I describe it without using "and"?
3. Is it under 500 lines of code?
4. Does it have 3 or fewer dependencies?
5. Can I test it in complete isolation?
6. Would a new developer understand it in 5 minutes?
7. Is the interface simple (3-5 methods)?
8. Could this be split into smaller packages?

## Related Documentation
- Main monorepo: `/CLAUDE.md`
- Architecture: `/docs/shared-architecture.md`
- Testing guide: `/docs/testing-package-implementation.md`
- [Package-specific docs]
```