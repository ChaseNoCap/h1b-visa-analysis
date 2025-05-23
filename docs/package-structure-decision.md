# Package Structure Decision

## Decision: Flat Package Structure

**Date**: May 2025  
**Status**: Implemented

## Summary

We chose a flat package structure (`/packages/[package-name]`) over a nested structure (`/packages/shared/[package-name]`).

## Structure Comparison

### ❌ Nested Structure (Rejected)
```
packages/
├── shared/
│   ├── test-mocks/
│   ├── test-helpers/
│   ├── logger/
│   └── ...
├── prompts-shared/
├── markdown-compiler/
└── report-components/
```

### ✅ Flat Structure (Chosen)
```
packages/
├── test-mocks/         # @h1b/test-mocks
├── test-helpers/       # @h1b/test-helpers
├── logger/             # @h1b/logger (future)
├── prompts-shared/     # External dependency
├── markdown-compiler/  # External dependency
└── report-components/  # External dependency
```

## Rationale

### 1. Simplicity
- **Flat**: `packages/test-mocks/`
- **Nested**: `packages/shared/test-mocks/`
- Shorter paths are easier to work with

### 2. Consistency
- External packages already use flat structure
- All packages at same level
- No special treatment for "shared" packages

### 3. Scale Appropriate
- Only planning 8-10 packages total
- Not hundreds of packages needing categorization
- YAGNI (You Aren't Gonna Need It) principle

### 4. Clear Naming
- Package prefixes already provide grouping:
  - `@h1b/test-*` = testing related
  - `@h1b/log*` = logging related
  - No need for directory-based grouping

### 5. Workspace Configuration
- Simpler: `"workspaces": ["packages/*"]`
- No need for multiple glob patterns
- Easier for tooling to understand

## Implementation

1. Moved packages from `/packages/shared/` to `/packages/`
2. Updated `package.json` workspace configuration
3. Updated `tsconfig.json` extends paths (one less `../`)
4. Updated all documentation references

## Benefits Realized

- ✅ Cleaner directory structure
- ✅ Simpler import paths
- ✅ Consistent with existing packages
- ✅ Easier navigation
- ✅ Less configuration complexity

## When to Reconsider

Only consider nested structure if:
- Package count exceeds 20-30
- Clear categorical boundaries emerge
- Multiple teams need separate package spaces
- Naming conflicts become an issue

For now, flat is the right choice for this monorepo's scale and needs.