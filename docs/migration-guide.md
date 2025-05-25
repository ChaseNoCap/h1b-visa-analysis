# Migration Guide

## Overview

This guide provides step-by-step instructions for extracting functionality from the H1B meta repository into focused, reusable packages managed as Git submodules. It consolidates our migration strategy, implementation roadmap, and lessons learned.

## Migration Strategy

### Goals
1. **Eliminate Code Duplication** - Extract identical implementations
2. **Standardize Patterns** - Ensure consistent architecture
3. **Enable Code Sharing** - Create reusable packages
4. **Maintain Small Contexts** - Each package focused on single responsibility
5. **Support Testing** - Quality built-in from start

### Package Architecture
```
packages/ (Git submodules)
├── di-framework/      # DI utilities → github.com/ChaseNoCap/di-framework
├── logger/           # Logging → github.com/ChaseNoCap/logger
├── test-mocks/       # Mock implementations → github.com/ChaseNoCap/test-mocks
├── test-helpers/     # Test utilities → github.com/ChaseNoCap/test-helpers
├── file-system/      # File operations → github.com/ChaseNoCap/file-system
├── event-system/     # Event bus → github.com/ChaseNoCap/event-system
├── cache/            # Caching → github.com/ChaseNoCap/cache
├── report-templates/ # Report formatting → github.com/ChaseNoCap/report-templates
└── prompts/          # AI context → github.com/ChaseNoCap/prompts
```

All packages are:
- Independent Git repositories
- Integrated as Git submodules
- Published to GitHub Packages as @chasenocap/* packages

## Migration Process

### Phase 1: Setup & Planning

#### 1.1 Create Package Repository
```bash
# Create new repository on GitHub
# github.com/ChaseNoCap/{package-name}

# Clone and set up locally
git clone https://github.com/ChaseNoCap/{package-name}.git
cd {package-name}

# Initialize package
npm init -y
npm install --save-dev typescript vitest @types/node

# Set up TypeScript and testing
# Copy configurations from meta repo
```

#### 1.2 Add as Submodule
```bash
# From meta repository root
git submodule add https://github.com/ChaseNoCap/{package-name}.git packages/{package-name}
git add .gitmodules packages/{package-name}
git commit -m "feat: add {package-name} submodule"
```

#### 1.2 Write CLAUDE.md First
Create context documentation before implementation:
- Package purpose and boundaries
- Public API definition
- Internal components
- Dependencies and consumers

#### 1.3 Define Interfaces
Create clear public API:
```typescript
// src/interfaces/IMyService.ts
export interface IMyService {
  doWork(input: string): Promise<Result>;
}
```

### Phase 2: Implementation

#### 2.1 Extract Code
Following single responsibility:
1. Copy relevant code from source projects
2. Remove unrelated functionality
3. Simplify and generalize
4. Add comprehensive error handling

#### 2.2 Package Structure Template
```
package-name/
├── src/
│   ├── interfaces/     # Public API
│   ├── implementations/ # Internal only
│   ├── errors/         # Domain errors
│   └── index.ts        # Explicit exports
├── tests/
├── CLAUDE.md           # Context doc
└── README.md           # Usage examples
```

#### 2.3 Testing Strategy
- Write tests alongside implementation
- Target 90%+ coverage
- Test public API thoroughly
- Use test-mocks for dependencies

### Phase 3: Integration

#### 3.1 Update Consumers
```typescript
// Before
import { Logger } from './services/Logger';

// After
import type { ILogger } from '@chasenocap/logger';
import { TYPES } from './core/constants/injection-tokens';
```

#### 3.2 Remove Duplicated Code
1. Update all imports
2. Delete old implementations
3. Run full test suite
4. Update documentation

### Phase 4: Publishing

#### 4.1 Working in Submodule
```bash
# Navigate to submodule
cd packages/{package-name}

# Create feature branch
git checkout -b feature/initial-implementation

# Commit changes
git add .
git commit -m "feat: initial implementation"
git push origin feature/initial-implementation
```

#### 4.2 Publish to GitHub Packages
```bash
# After PR merge
git checkout main
git pull
npm version patch
npm publish --registry=https://npm.pkg.github.com
```

#### 4.3 Update Meta Repository
```bash
# Back in meta repo
cd ../..
git add packages/{package-name}
git commit -m "chore: update {package-name} submodule"

# Update package.json dependency
npm install @chasenocap/{package-name}@latest
git add package.json package-lock.json
git commit -m "chore: update {package-name} dependency"
```

## Migration Timeline

### Completed Packages (9/9) ✅

| Week | Package | Size | Coverage | Status |
|------|---------|------|----------|---------|
| 0 | test-mocks | 400 lines | 100% | ✅ Complete |
| 0 | test-helpers | 500 lines | 91.89% | ✅ Complete |
| 1 | di-framework | 689 lines | 84% | ✅ Complete |
| 2 | logger | 300 lines | 95%+ | ✅ Published |
| 3 | file-system | 700 lines | 95%+ | ✅ Complete |
| 4 | event-system | 800 lines | High | ✅ Complete |
| 5 | cache | 400 lines | 94.79% | ✅ Complete |
| 6 | report-templates | 287 lines | 100% | ✅ Complete |
| 7 | prompts | 400 lines | N/A | ✅ Complete |

## Key Patterns & Learnings

### Size Control
- **Target**: <1000 lines per package
- **Achieved**: Average ~418 lines
- **Pattern**: Single responsibility = natural size limit

### Dependency Management
- **All packages**: Git submodules (no workspaces)
- **Published packages**: Consumed from GitHub Packages
- **Pattern**: Submodule for development, npm package for consumption

### Testing First
Starting with test packages proved valuable:
- Immediate value for other packages
- Established quality standards
- Reduced risk in subsequent migrations

### Documentation-Driven Development
Writing CLAUDE.md first:
- Forces clear thinking about boundaries
- Prevents scope creep
- Serves as living documentation

## Migration Checkpoints

### Before Starting
- [ ] Review decomposition principles
- [ ] Verify single responsibility
- [ ] Check estimated size (<1000 lines)
- [ ] Plan clear boundaries

### During Development
- [ ] Monitor package size
- [ ] Maintain single purpose
- [ ] Keep dependencies minimal
- [ ] Write tests continuously

### Before Integration
- [ ] 90%+ test coverage
- [ ] Documentation complete
- [ ] No circular dependencies
- [ ] Clean public API

### After Completion
- [ ] All consumers updated
- [ ] Old code removed
- [ ] Tests passing
- [ ] Performance verified

## Common Pitfalls & Solutions

### Pitfall: Scope Creep
**Solution**: Stick to CLAUDE.md boundaries

### Pitfall: Over-Engineering
**Solution**: Start simple, enhance later

### Pitfall: Breaking Changes
**Solution**: Maintain backward compatibility during migration

### Pitfall: Circular Dependencies
**Solution**: Use events or adapters for cross-package communication

## Example Migration: Logger Package

### 1. Identified Duplication
Both projects had identical Winston logger implementations

### 2. Created Package Structure
```
packages/logger/
├── src/
│   ├── interfaces/ILogger.ts
│   ├── implementations/WinstonLogger.ts
│   ├── decorators/LogMethod.ts
│   └── index.ts
```

### 3. Extracted & Generalized
- Removed project-specific configuration
- Added factory functions
- Included logging decorators

### 4. Published to GitHub Packages
- Created GitHub repository
- Published as @chasenocap/logger
- Updated consumers to use published version

### 5. Result
- 98% code duplication eliminated
- Single source of truth
- Reusable across projects

## Next Steps After Migration

1. **Monitor Package Health**
   - Track size growth
   - Review dependencies
   - Update documentation

2. **Continuous Improvement**
   - Refactor based on usage
   - Add features carefully
   - Maintain single responsibility

3. **Share Knowledge**
   - Document patterns
   - Create examples
   - Train team members

---

*This guide consolidates migration-plan.md, implementation-roadmap.md, testing-package-implementation.md, and testing-package-progress.md into a single migration reference for the Git submodules architecture.*