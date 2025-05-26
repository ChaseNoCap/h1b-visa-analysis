# Technical Debt Reduction Plan

## Overview

This document outlines a prioritized plan to address technical debt in the h1b-visa-analysis project. The plan focuses on improving code quality, maintainability, and developer experience while maintaining backward compatibility.

## Current Technical Debt Assessment

### High Priority Issues
1. **Outdated Dependencies** - Major version updates needed for dev tools
2. **Missing Integration Tests** - No tests for package interactions
3. **Hardcoded Values** - Magic numbers and strings throughout codebase
4. **Error Handling Gaps** - Missing validation and recovery strategies

### Medium Priority Issues
1. **Code Duplication** - Repeated patterns across services
2. **Inconsistent Patterns** - Naming and logging approaches vary
3. **Missing Abstractions** - Direct fs usage instead of IFileSystem
4. **Incomplete Interfaces** - IMarkdownProcessor undefined

### Low Priority Issues
1. **Documentation Gaps** - Missing ADRs and error documentation
2. **Configuration Limits** - Non-configurable output patterns
3. **Test Coverage** - Edge cases not fully covered

## Implementation Plan

### Phase 1: Critical Updates (Week 1)
**Goal**: Update dependencies and establish testing foundation

#### 1.1 Update Development Dependencies
```json
{
  "@typescript-eslint/eslint-plugin": "^6.21.0" → "^8.0.0",
  "@typescript-eslint/parser": "^6.21.0" → "^8.0.0",
  "@vitest/coverage-v8": "^0.34.6" → "^2.0.0",
  "vitest": "^0.34.6" → "^2.0.0",
  "eslint": "^8.57.1" → "^9.0.0"
}
```

**Tasks**:
- [ ] Update package.json dependencies
- [ ] Fix any breaking changes from updates
- [ ] Update ESLint configuration for v9
- [ ] Verify all tests pass with new versions
- [ ] Update CI/CD workflows if needed

#### 1.2 Create Integration Test Suite
**Location**: `/tests/integration/`

**Tests to create**:
- [ ] ReportGenerator + MarkdownProcessor integration
- [ ] DependencyChecker + FileSystem integration
- [ ] Full report generation flow test
- [ ] Error propagation across packages
- [ ] Event system integration with services

**Structure**:
```typescript
// tests/integration/report-generation.test.ts
describe('Report Generation Integration', () => {
  it('should generate report with markdown processing', async () => {
    // Test full flow from input to output
  });
  
  it('should handle markdown processor errors gracefully', async () => {
    // Test error scenarios
  });
});
```

### Phase 2: Code Quality Improvements (Week 2)
**Goal**: Eliminate code smells and improve consistency

#### 2.1 Extract Configuration Constants
**File**: `/src/core/constants/config.ts`

```typescript
export const CONFIG = {
  REPORT: {
    OUTPUT_PATTERN: 'H1B_Report_{timestamp}.md',
    TIMESTAMP_FORMAT: 'YYYYMMDD_HHmmss'
  },
  TRACING: {
    THRESHOLDS: {
      FAST: 100,
      MEDIUM: 500,
      SLOW: 1000
    }
  },
  VALIDATION: {
    REQUIRED_DEPENDENCIES: [
      '@chasenocap/markdown-compiler',
      '@chasenocap/report-components'
    ]
  }
} as const;
```

#### 2.2 Create Error Handling Utilities
**File**: `/src/core/errors/error-handler.ts`

```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown, logger: ILogger, context: string): never {
  if (error instanceof AppError) {
    logger.error(`[${context}] ${error.message}`, error, { 
      code: error.code,
      context: error.context 
    });
  } else if (error instanceof Error) {
    logger.error(`[${context}] Unexpected error`, error);
  } else {
    logger.error(`[${context}] Unknown error`, new Error(String(error)));
  }
  throw error;
}
```

#### 2.3 Standardize Service Patterns
**Create base service class**:
```typescript
// src/core/services/base-service.ts
export abstract class BaseService {
  protected readonly logger: ILogger;
  
  constructor(baseLogger: ILogger, serviceName: string) {
    this.logger = baseLogger.child({ service: serviceName });
  }
  
  protected handleError(operation: string, error: unknown): never {
    handleError(error, this.logger, `${this.constructor.name}.${operation}`);
  }
}
```

### Phase 3: Architecture Improvements (Week 3)
**Goal**: Improve abstractions and reduce coupling

#### 3.1 Define Missing Interfaces
**File**: `/src/core/interfaces/IMarkdownProcessor.ts`

```typescript
export interface IMarkdownProcessor {
  process(content: string, options?: ProcessOptions): Promise<string>;
  compile(files: string[], options?: CompileOptions): Promise<string>;
}

export interface ProcessOptions {
  includePaths?: string[];
  variables?: Record<string, string>;
}

export interface CompileOptions {
  outputFormat?: 'markdown' | 'html';
  theme?: string;
}
```

#### 3.2 Migrate to IFileSystem
**Update DependencyChecker to use injected IFileSystem**:
```typescript
constructor(
  @inject(TYPES.ILogger) logger: ILogger,
  @inject(TYPES.IFileSystem) private fileSystem: IFileSystem
) {
  super(logger, 'DependencyChecker');
}

// Replace fs.promises.readFile with:
const content = await this.fileSystem.readFile(packageJsonPath, 'utf-8');
```

#### 3.3 Create Validation Utilities
**File**: `/src/core/validation/package-validator.ts`

```typescript
export class PackageValidator {
  static validateVersion(version: string | undefined): string {
    if (!version || typeof version !== 'string') {
      throw new AppError(
        'Invalid package version',
        'INVALID_VERSION',
        { version }
      );
    }
    return version;
  }
  
  static validatePackageJson(data: unknown): PackageJson {
    // Implement schema validation
  }
}
```

### Phase 4: Documentation and Process (Week 4)
**Goal**: Establish sustainable practices

#### 4.1 Create ADR Template and Initial ADRs
**Location**: `/docs/adr/`

ADRs to create:
- [ ] ADR-001: Git Submodules Architecture
- [ ] ADR-002: Dependency Injection Framework Choice
- [ ] ADR-003: Event-Driven Debugging System
- [ ] ADR-004: Package Decomposition Strategy

#### 4.2 Implement Error Documentation
**File**: `/docs/error-codes.md`

Document all error codes with:
- Error code
- Description
- Common causes
- Resolution steps

#### 4.3 Set Up Code Quality Gates
- [ ] Add pre-commit hooks for linting
- [ ] Set up commit message validation
- [ ] Add PR template with checklist
- [ ] Configure branch protection rules

## Success Metrics

### Quantitative Metrics
- [ ] Zero outdated major versions in dependencies
- [ ] 100% of services using BaseService pattern
- [ ] All hardcoded values moved to configuration
- [ ] Integration test coverage > 80%
- [ ] Zero 'any' types (maintain current state)

### Qualitative Metrics
- [ ] Consistent error handling across all services
- [ ] Clear separation of concerns
- [ ] Improved developer onboarding experience
- [ ] Reduced time to debug issues

## Implementation Schedule

### Week 1: Foundation
- Monday-Tuesday: Update dependencies
- Wednesday-Thursday: Create integration tests
- Friday: Review and adjust plan

### Week 2: Code Quality
- Monday-Tuesday: Extract constants and create utilities
- Wednesday-Thursday: Standardize service patterns
- Friday: Refactor existing services

### Week 3: Architecture
- Monday-Tuesday: Define interfaces and abstractions
- Wednesday-Thursday: Migrate to IFileSystem
- Friday: Implement validation utilities

### Week 4: Documentation
- Monday-Tuesday: Create ADRs
- Wednesday-Thursday: Document errors and patterns
- Friday: Set up quality gates

## Risk Mitigation

### Backward Compatibility
- All changes maintain existing public APIs
- Deprecation warnings for any API changes
- Comprehensive testing before each phase

### Performance Impact
- Profile before and after changes
- Monitor build times
- Ensure no regression in report generation speed

### Team Disruption
- Small, incremental changes
- Clear communication of changes
- Update CLAUDE.md with new patterns

## Next Steps

1. Review and approve this plan
2. Create tracking issues for each phase
3. Assign ownership for each workstream
4. Set up weekly progress reviews
5. Begin Phase 1 implementation

## Appendix: Technical Debt Inventory

### Code Smells Found
1. **Magic Numbers**:
   - `substring(7)` in ReportGenerator.ts:46
   - Threshold values in event-system usage
   - Hardcoded dependency list

2. **Duplication**:
   - Logger child creation pattern
   - Error handling in catch blocks
   - Timestamp calculation logic

3. **Missing Abstractions**:
   - Direct fs usage in DependencyChecker
   - No configuration management
   - No validation layer

4. **Inconsistencies**:
   - Logger naming (opLogger vs depLogger)
   - Metadata object structures
   - Interface naming (I prefix)

---

This plan provides a systematic approach to reducing technical debt while maintaining system stability and improving developer experience.