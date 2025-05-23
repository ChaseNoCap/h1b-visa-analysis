# Naming Convention for H1B Visa Analysis Monorepo

## Overview

This document establishes the naming conventions for all packages in the H1B Visa Analysis monorepo.

## Package Naming Strategy

### Decision: No Namespace Prefix

All packages in this monorepo use simple, descriptive names **without** namespace prefixes.

### Examples:
- ✅ `test-mocks` (not `@h1b/test-mocks`)
- ✅ `test-helpers` (not `@h1b/test-helpers`)
- ✅ `logger` (not `@h1b/logger`)
- ✅ `markdown-compiler` (existing)
- ✅ `prompts-shared` (existing)
- ✅ `report-components` (existing)

### Rationale:
1. **Consistency**: Matches existing packages (prompts-shared, markdown-compiler, report-components)
2. **Simplicity**: Cleaner imports and less typing
3. **Private Packages**: These are GitHub-hosted private packages, not published to npm
4. **No Conflicts**: Private usage means no namespace collision concerns

## Repository Naming

GitHub repositories match the package names exactly:
- Package `test-mocks` → Repository `https://github.com/ChaseNoCap/test-mocks`
- Package `logger` → Repository `https://github.com/ChaseNoCap/logger`

## Import Conventions

### Within Monorepo:
```typescript
// Good - using package name directly
import { MockLogger } from 'test-mocks';
import { createLogger } from 'logger';

// Bad - don't use relative paths between packages
import { MockLogger } from '../test-mocks';
```

### From External Projects:
```json
// Install from GitHub
"dependencies": {
  "test-mocks": "github:ChaseNoCap/test-mocks",
  "logger": "github:ChaseNoCap/logger"
}
```

## Future Considerations

If packages are ever published to npm:
1. Can add namespace prefix then (e.g., `@h1b-visa/logger`)
2. Update imports across all packages
3. Maintain GitHub repos with simple names

## Package Categories

While we don't use prefixes, packages are logically grouped:

### Testing Packages:
- `test-mocks` - Mock implementations
- `test-helpers` - Test utilities

### Infrastructure Packages:
- `logger` - Logging infrastructure
- `di-framework` - Dependency injection utilities
- `events` - Event bus implementation

### Utility Packages:
- `file-system` - File operations
- `cache` - Caching implementations

### Feature Packages:
- `markdown-compiler` - Markdown processing
- `report-components` - Report content
- `prompts-shared` - AI workflows

## Summary

Keep it simple:
- No namespace prefixes
- Descriptive kebab-case names
- Match GitHub repo names to package names
- Group logically by purpose, not by prefix