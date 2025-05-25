# Package Standardization Guide

## Overview

This guide documents the standardized approach for managing all packages in the h1b-visa-analysis meta repository. All packages follow consistent patterns for naming, versioning, publishing, and consumption.

## Package Architecture

### Meta Repository Structure
```
h1b-visa-analysis/ (Meta Repository)
├── packages/                      # Git submodules
│   ├── cache/                    # → github.com/ChaseNoCap/cache
│   ├── di-framework/             # → github.com/ChaseNoCap/di-framework
│   ├── event-system/             # → github.com/ChaseNoCap/event-system
│   ├── file-system/              # → github.com/ChaseNoCap/file-system
│   ├── logger/                   # → github.com/ChaseNoCap/logger
│   ├── markdown-compiler/        # → github.com/ChaseNoCap/markdown-compiler
│   ├── prompts/                  # → github.com/ChaseNoCap/prompts
│   ├── report-components/        # → github.com/ChaseNoCap/report-components
│   ├── report-templates/         # → github.com/ChaseNoCap/report-templates
│   ├── test-helpers/             # → github.com/ChaseNoCap/test-helpers
│   └── test-mocks/               # → github.com/ChaseNoCap/test-mocks
├── src/                          # Consumes published packages
└── package.json                  # No workspaces - uses published versions
```

## Naming Standards

### NPM Package Names
All packages MUST use the `@chasenocap` scope:
- ✅ `@chasenocap/logger`
- ✅ `@chasenocap/di-framework`
- ❌ `logger` (unscoped)
- ❌ `@other-scope/logger`

### GitHub Repository Names
Repositories use unscoped names:
- Repository: `github.com/ChaseNoCap/logger`
- Package: `@chasenocap/logger`

## Package Configuration Template

Every package MUST follow this `package.json` template:

```json
{
  "name": "@chasenocap/[package-name]",
  "version": "1.0.0",
  "description": "[Clear, concise description]",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": [
    "dist",
    "README.md",
    "CLAUDE.md"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ChaseNoCap/[package-name].git"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com",
    "access": "restricted"
  },
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "coverage": "vitest run --coverage",
    "lint": "eslint . --ext .ts",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run build && npm test"
  },
  "peerDependencies": {
    "@chasenocap/logger": "^1.0.0"  // Use full scoped names
  }
}
```

## Version Management

### Version Strategy
- All packages start at `1.0.0`
- Use semantic versioning (semver)
- Version independently based on changes
- No synchronized versioning across packages

### Version Commands
```bash
# Patch version (1.0.0 → 1.0.1)
npm version patch

# Minor version (1.0.0 → 1.1.0)
npm version minor

# Major version (1.0.0 → 2.0.0)
npm version major
```

## Publishing Workflow

### 1. Pre-publish Checklist
- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Version bumped (`npm version patch/minor/major`)
- [ ] CLAUDE.md updated if needed
- [ ] README.md current

### 2. Publishing Steps
```bash
# Navigate to package
cd packages/logger

# Ensure on main branch
git checkout main
git pull origin main

# Run tests
npm test

# Bump version
npm version patch

# Publish to GitHub Packages
npm publish

# Push tags
git push origin main --tags
```

### 3. Update Meta Repository
```bash
# Return to meta repo root
cd ../..

# Update submodule reference
git add packages/logger
git commit -m "chore: update logger to v1.0.1"

# Update dependency version in package.json
npm update @chasenocap/logger
```

## Dependency Management

### In Package Files
Always use full scoped names:
```typescript
// ✅ Correct
import type { ILogger } from '@chasenocap/logger';
import { EventBus } from '@chasenocap/event-system';

// ❌ Wrong
import { EventBus } from 'event-system';
```

### In Meta Repository
```json
{
  "dependencies": {
    "@chasenocap/cache": "^1.0.0",
    "@chasenocap/di-framework": "^1.0.0",
    "@chasenocap/event-system": "^1.0.2",
    "@chasenocap/file-system": "^1.0.0",
    "@chasenocap/logger": "^1.0.0",
    "@chasenocap/report-templates": "^1.0.0"
  },
  "devDependencies": {
    "@chasenocap/prompts": "^1.0.0",
    "@chasenocap/test-helpers": "^1.0.0",
    "@chasenocap/test-mocks": "^1.0.0"
  }
}
```

## Authentication Setup

### GitHub Packages Registry
Configure npm to use GitHub Packages:

```bash
# Create .npmrc in home directory
echo "@chasenocap:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc
```

### Repository .npmrc
Each repository should have:
```
@chasenocap:registry=https://npm.pkg.github.com
```

## Common Issues & Solutions

### Issue: Cannot find module '@chasenocap/package-name'
**Solution**: Ensure package is published and you have authentication set up

### Issue: 401 Unauthorized when installing
**Solution**: Configure GitHub token in ~/.npmrc

### Issue: Workspace commands not working
**Solution**: Workspaces have been removed - work directly in submodules

## Migration Checklist

When standardizing an existing package:

1. **Update package.json**
   - [ ] Add @chasenocap scope to name
   - [ ] Set version to 1.0.0
   - [ ] Add publishConfig
   - [ ] Update repository URL
   - [ ] Fix peer/dependencies to use scoped names

2. **Update imports**
   - [ ] Update all imports to use @chasenocap scope
   - [ ] Check test files
   - [ ] Update example code

3. **Publish**
   - [ ] Build and test
   - [ ] Publish to GitHub Packages
   - [ ] Update meta repository

## Best Practices

1. **One Package, One Purpose**: Each package should have a single, clear responsibility
2. **Minimal Dependencies**: Keep dependency trees shallow
3. **Consistent APIs**: Follow similar patterns across packages
4. **Documentation**: Every package needs README.md and CLAUDE.md
5. **Testing**: Maintain >80% coverage
6. **Size Limits**: Target <1000 lines per package

## Scripts Reference

### Meta Repository Scripts
```bash
# Update all submodules
npm run submodule:update

# Initialize submodules
npm run submodule:init

# Build main project
npm run build

# Run tests
npm test
```

### Package Scripts (in each submodule)
```bash
# Build package
npm run build

# Run tests
npm test

# Check coverage
npm run coverage

# Lint code
npm run lint

# Type check
npm run typecheck
```