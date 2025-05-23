# Package Creation Checklist

Use this checklist when creating any new package in the monorepo.

## Pre-Creation Planning
- [ ] Define clear package purpose (one sentence)
- [ ] Identify upstream dependencies
- [ ] Identify downstream consumers
- [ ] Determine position in architecture
- [ ] Choose appropriate package name (@h1b/xxx)

## Package Setup

### 1. Directory Structure
```bash
mkdir -p packages/shared/{package-name}/{src,tests}
cd packages/shared/{package-name}
```

### 2. Essential Files
- [ ] `package.json` - Package configuration
- [ ] `tsconfig.json` - TypeScript configuration  
- [ ] `vitest.config.ts` - Test configuration
- [ ] `README.md` - User documentation
- [ ] **`CLAUDE.md`** - Context for Claude Code (REQUIRED)
- [ ] `.gitignore` - Ignore built files
- [ ] `LICENSE` - License file

### 3. Source Structure
```
src/
├── interfaces/       # Public contracts
├── implementations/  # Concrete classes  
├── utils/           # Helper functions
├── errors/          # Custom errors
├── types/           # TypeScript types
└── index.ts         # Public exports
```

### 4. CLAUDE.md Creation (CRITICAL)
- [ ] Copy template from `/docs/claude-md-template.md`
- [ ] Fill in Package Identity section
- [ ] Document monorepo context
- [ ] Define technical architecture
- [ ] Add development guidelines
- [ ] Include API patterns
- [ ] Add integration examples
- [ ] Review against `/docs/claude-md-guide.md`

## Implementation

### 5. Core Development
- [ ] Define all interfaces first
- [ ] Implement with dependency injection
- [ ] Add comprehensive error handling
- [ ] Include logging via @h1b/logger
- [ ] Export everything from index.ts

### 6. Testing
- [ ] Set up test structure
- [ ] Use @h1b/testing utilities
- [ ] Write unit tests (90%+ coverage)
- [ ] Add integration tests
- [ ] Ensure all exports are tested

### 7. Documentation
- [ ] Complete README with examples
- [ ] Add inline TSDoc comments
- [ ] Create usage examples
- [ ] Document error scenarios
- [ ] Add troubleshooting section

## Integration

### 8. Monorepo Integration
- [ ] Update root package.json workspaces if needed
- [ ] Ensure package builds with `npm run build`
- [ ] Verify tests pass with `npm test`
- [ ] Check linting with `npm run lint`

### 9. Update Consumers
- [ ] Update downstream packages to use new package
- [ ] Remove any duplicated code
- [ ] Update their CLAUDE.md files
- [ ] Run all tests across monorepo

## Quality Checks

### 10. Final Review
- [ ] CLAUDE.md is complete and accurate
- [ ] All interfaces are exported
- [ ] Error handling is comprehensive
- [ ] Tests achieve 90%+ coverage
- [ ] Documentation is clear
- [ ] Package follows monorepo patterns
- [ ] No console.log statements
- [ ] All dependencies injected

## GitHub Integration

### 11. Workflows
- [ ] Package included in CI/CD
- [ ] Tests run on PR
- [ ] Linting enforced
- [ ] Coverage reported

### 12. Initial Commit
- [ ] Stage all files
- [ ] Commit message describes package purpose
- [ ] No AI tool references in commit
- [ ] Push to feature branch
- [ ] Create PR for review

## Post-Creation

### 13. Maintenance Setup
- [ ] Add to dependency update workflows
- [ ] Document in monorepo architecture
- [ ] Update main CLAUDE.md if needed
- [ ] Add to package dependency graph

### 14. Validation
- [ ] Another developer can use package
- [ ] Claude Code understands context
- [ ] Package integrates smoothly
- [ ] Performance is acceptable

## Common Mistakes to Avoid

1. **Forgetting CLAUDE.md** - This provides essential context
2. **Skipping interfaces** - Always define contracts first
3. **Missing exports** - Ensure index.ts exports everything
4. **Poor error handling** - Use typed errors
5. **No integration examples** - Show how it connects
6. **Inadequate testing** - Aim for high coverage
7. **Console.log usage** - Use ILogger instead
8. **Hardcoded dependencies** - Use dependency injection

## Success Criteria

A package is ready when:
- ✅ CLAUDE.md provides complete context
- ✅ All interfaces are defined
- ✅ Tests pass with 90%+ coverage
- ✅ Documentation is comprehensive
- ✅ Follows all monorepo patterns
- ✅ Integrates with other packages
- ✅ Claude Code can work with it effectively

## Remember

The CLAUDE.md file is not optional - it's a critical part of maintaining consistency and quality across the monorepo. Without it, Claude Code lacks the context needed to work effectively with the package.