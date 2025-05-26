# Package Update Plan - Technical Debt Week 1

## Overview
This document outlines the updates needed for each package based on the technical debt reduction work completed in the meta repository.

## Version Updates Applied in Meta Repository

### Development Dependencies Updated:
- **@typescript-eslint/\***: 6.x → 8.x
- **vitest**: 0.34.x → 3.x
- **eslint**: 8.x → 9.x
- **@types/node**: 20.x → 22.x
- **eslint-config-prettier**: 9.x → 10.x

### Key Changes:
1. **ESLint v9**: New flat config format (eslint.config.js)
2. **Vitest v3**: Potential API changes in test utilities
3. **TypeScript ESLint v8**: Stricter type checking
4. **Node Types v22**: Latest Node.js type definitions

## Package Update Priority Order

Based on dependency hierarchy (most fundamental first):

### 1. 🔨 di-framework (FIRST - No dependencies)
**Priority**: CRITICAL - Foundation for all other packages
**Updates Needed**:
- Update devDependencies to match meta repo versions
- Migrate to ESLint v9 flat config
- Update vitest to v3
- Verify all tests pass with new versions
- No production code changes expected

**Specific Tasks**:
```json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "eslint": "^9.0.0",
    "vitest": "^3.0.0"
  }
}
```

### 2. 📝 logger (No dependencies)
**Priority**: HIGH - Used by most other packages
**Updates Needed**:
- Update devDependencies
- Migrate to ESLint v9
- Ensure Winston compatibility
- Update vitest tests

### 3. 📁 file-system (No dependencies)
**Priority**: HIGH - Core functionality
**Updates Needed**:
- Update devDependencies
- Migrate to ESLint v9
- Check Node.js fs API compatibility with @types/node v22
- Update tests for vitest v3

### 4. 🧪 test-mocks (Depends on: inversify)
**Priority**: MEDIUM - Development only
**Updates Needed**:
- Update devDependencies
- Ensure mock implementations work with vitest v3
- Migrate to ESLint v9

### 5. 🧪 test-helpers (Depends on: test-mocks, vitest)
**Priority**: MEDIUM - Development only
**Updates Needed**:
- Update vitest to v3 (production dependency here!)
- Update all test utilities for vitest v3 API
- Migrate to ESLint v9
- May need code changes for vitest v3 compatibility

### 6. 📊 event-system (Depends on: inversify)
**Priority**: MEDIUM
**Updates Needed**:
- Update devDependencies
- Migrate to ESLint v9
- Ensure decorator functionality unchanged
- Test event emission with new versions

### 7. 💾 cache (Depends on: inversify, optional event-system)
**Priority**: MEDIUM
**Updates Needed**:
- Update devDependencies
- Migrate to ESLint v9
- Verify decorator patterns still work
- Test TTL functionality

### 8. 📄 report-templates (Depends on: di-framework, file-system)
**Priority**: LOW
**Updates Needed**:
- Update devDependencies
- Migrate to ESLint v9
- No functional changes expected

### 9. 📚 prompts (Documentation package)
**Priority**: LOW
**Updates Needed**:
- Update devDependencies if it has any
- Migrate to ESLint v9 if applicable

### 10. 📝 markdown-compiler (Complex dependencies)
**Priority**: LOW - Already published and stable
**Updates Needed**:
- Update devDependencies
- Extensive testing due to complexity
- Coordinate with markdown-compiler team

### 11. 📋 report-components (Content package)
**Priority**: LOW
**Updates Needed**:
- Update devDependencies
- Migrate to ESLint v9
- No functional changes expected

## Implementation Strategy

### Phase 1: Core Packages (di-framework, logger, file-system)
1. Start with di-framework (no dependencies)
2. Update logger and file-system in parallel
3. Ensure these are stable before proceeding

### Phase 2: Test Utilities (test-mocks, test-helpers)
1. Update test-mocks first
2. Update test-helpers with special attention to vitest v3 changes
3. Run all tests in dependent packages

### Phase 3: Feature Packages (event-system, cache, report-templates)
1. Update in dependency order
2. Test decorator functionality thoroughly
3. Verify integration with updated core packages

### Phase 4: Content Packages (prompts, markdown-compiler, report-components)
1. Lower priority as these are mostly content
2. Update when convenient
3. Coordinate with external teams if needed

## Changes to Watch For

### ESLint v9 Migration Pattern
All packages need this change:
```javascript
// OLD: .eslintrc.json
{
  "extends": ["eslint:recommended"],
  "parser": "@typescript-eslint/parser"
}

// NEW: eslint.config.js
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      globals: {
        ...globals.node,
        ...globals.es2022
      }
    },
    plugins: {
      '@typescript-eslint': typescript
    }
  }
];
```

### Vitest v3 Changes
- Check for any breaking changes in test APIs
- Update test configuration if needed
- Pay special attention in test-helpers package

### TypeScript ESLint v8
- May have stricter type checking
- Could reveal previously hidden type issues
- Run `npm run typecheck` after updates

## Meta Repository Analysis (Final Step)

After all packages are updated:

1. **Update package.json dependencies**
   - Bump versions of all @chasenocap packages if needed
   - Run `npm update` to get latest versions

2. **Integration Testing**
   - Run full test suite
   - Check all integration tests pass
   - Verify report generation works end-to-end

3. **Documentation Updates**
   - Update CLAUDE.md with any new patterns
   - Document the update process
   - Create migration guide if needed

## Success Criteria

- [ ] All packages using same dependency versions
- [ ] All packages using ESLint v9 flat config
- [ ] All tests passing in all packages
- [ ] Integration tests passing in meta repo
- [ ] No TypeScript errors
- [ ] Documentation updated

## Risk Mitigation

1. **Test each package thoroughly** before publishing
2. **Use semantic versioning** - these are potentially breaking changes
3. **Create branches** for updates, don't work on main
4. **Run integration tests** after each package update
5. **Document any breaking changes** in package CHANGELOGs