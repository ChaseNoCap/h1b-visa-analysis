# CLAUDE.md Best Practices Guide

## Purpose

CLAUDE.md files provide essential context to Claude Code when working with any part of the monorepo. They ensure consistent understanding and maintain architectural coherence across all packages.

## Why CLAUDE.md Files Matter

1. **Context Preservation** - Captures intent and design decisions
2. **Consistency** - Ensures uniform patterns across packages
3. **Onboarding** - Helps Claude understand each package quickly
4. **Quality** - Maintains high standards across the monorepo
5. **Integration** - Shows how packages connect together

## Required Sections

Every CLAUDE.md must include these sections:

### 1. Package Identity
```markdown
**Name**: package-name  
**Purpose**: One clear sentence about what this does  
**Status**: Development/Stable/Deprecated  
**Owner**: Team or person responsible  
**Created**: Month Year  
```

### 2. Package Context in Monorepo
- **Upstream Dependencies**: What this package depends on
- **Downstream Consumers**: What depends on this package
- **Position in Architecture**: How it fits in the bigger picture

### 3. Technical Architecture
- Core interfaces exported
- Design patterns used
- Key technologies
- Architectural decisions

### 4. Development Guidelines
- Code organization
- Naming conventions
- Testing requirements
- Quality standards

### 5. GitHub Integration
- Workflows and automation
- Branch protection rules
- Release process

### 6. Common Tasks
- Step-by-step guides for typical work
- How to add features
- Debugging approaches
- Release procedures

### 7. API Patterns
- Service creation examples
- Error handling patterns
- Integration approaches

### 8. Integration Examples
- How to use with other packages
- Common integration patterns
- Configuration examples

## Package-Specific Sections

Add these as relevant:

### For Service Packages
- Performance considerations
- Caching strategies
- Scaling notes

### For UI Packages
- Component patterns
- Styling approach
- Accessibility requirements

### For Data Packages
- Schema definitions
- Migration strategies
- Validation rules

### For Utility Packages
- Function categories
- Usage examples
- Performance notes

## Writing Style

### DO
- Be concise but complete
- Use code examples
- Include TypeScript types
- Show real usage patterns
- Update when architecture changes

### DON'T
- Leave sections empty
- Use vague descriptions
- Assume knowledge
- Skip error handling
- Forget integration details

## Code Examples

Always include realistic code examples:

```typescript
// ❌ Bad: Too abstract
const service = new Service();

// ✅ Good: Shows real usage
import { createService } from 'package';
import { container } from '@/core/container';

const service = createService({
  logger: container.get(TYPES.ILogger),
  cache: container.get(TYPES.ICache),
  timeout: 5000
});
```

## Integration Context

Show how packages work together:

```markdown
### Integration with logger
All services use the shared logger for consistency:

```typescript
constructor(
  @inject(TYPES.ILogger) private logger: ILogger
) {
  this.logger = logger.child({ service: 'PackageName' });
}
```

### Integration with testing
Tests use shared mocks and utilities:

```typescript
import { setupTest, MockLogger } from 'testing';

const { container, mocks } = setupTest({
  useMocks: ['logger', 'cache']
});
```
```

## Maintenance

### When to Update CLAUDE.md

- New features added
- Architecture changes
- Dependencies updated
- Patterns evolved
- Issues discovered
- Best practices change

### Review Checklist

- [ ] All sections present and complete
- [ ] Code examples compile
- [ ] Integration examples accurate
- [ ] Dependencies listed correctly
- [ ] Patterns consistent with monorepo
- [ ] No outdated information

## Examples of Good CLAUDE.md Files

### Service Package
See: `/packages/shared/testing/CLAUDE.md`
- Clear purpose and context
- Detailed architecture section
- Comprehensive examples
- Shows all integrations

### Application Package
See: `/CLAUDE.md` (main project)
- High-level overview
- Development workflow
- Deployment details
- Troubleshooting guide

## Anti-Patterns to Avoid

### 1. Generic Descriptions
```markdown
❌ "This package handles data"
✅ "This package provides type-safe database access with automatic migrations and connection pooling"
```

### 2. Missing Integration Details
```markdown
❌ "Uses standard logging"
✅ "Uses logger with structured logging. All operations logged at INFO level with performance metrics"
```

### 3. Outdated Examples
```markdown
❌ Examples using old API
✅ Examples that match current implementation
```

## Template Usage

1. Start with `/docs/claude-md-template.md`
2. Fill in all sections
3. Add package-specific sections
4. Include real code examples
5. Review against this guide
6. Update regularly

## Benefits of Good CLAUDE.md Files

1. **Faster Development** - Claude understands context immediately
2. **Fewer Mistakes** - Patterns are clear and documented
3. **Better Integration** - Shows how pieces fit together
4. **Consistent Quality** - Standards are explicit
5. **Knowledge Preservation** - Decisions are documented

## Remember

CLAUDE.md is not just documentation - it's the context that ensures Claude Code can work effectively with your codebase. Invest time in making it comprehensive and accurate.