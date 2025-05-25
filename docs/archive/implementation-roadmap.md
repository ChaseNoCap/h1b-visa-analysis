# Implementation Roadmap: H1B Visa Analysis Decomposition

## Overview
This roadmap provides concrete steps to decompose the H1B Visa Analysis monorepo into focused, reusable packages while maintaining development velocity and system stability.

## Guiding Principles
This roadmap follows the decomposition principles defined in [`decomposition-principles.md`](./decomposition-principles.md). Each phase includes checkpoints to ensure adherence to these principles. For the specific testing implementation, see [`testing-package-implementation.md`](./testing-package-implementation.md).

## Immediate Actions (Next 24-48 Hours)

### 1. Project Setup
- [ ] Create `packages/shared/` directory structure
- [ ] Set up npm workspace configuration in root `package.json`
- [ ] Configure TypeScript project references for multi-package builds
- [ ] Set up shared ESLint/Prettier configs at workspace root

### 2. Testing Package Initialization
- [ ] Create `testing` package structure (see [detailed breakdown](./testing-package-implementation.md#package-structure))
- [ ] Copy existing test utilities from main project
- [ ] Set up package.json with proper exports
- [ ] Create initial CLAUDE.md for the package (use [template](./claude-md-template.md))

## Phase 1: Testing Package Decomposition (Week 1-2)

### Goals
Extract all testing utilities into a shared package that can be used across all H1B projects. Full implementation plan in [`testing-package-implementation.md`](./testing-package-implementation.md).

### Pre-Implementation Review
- [ ] Review against [decomposition principles checklist](./decomposition-principles.md#implementation-checklist)
- [ ] Verify single responsibility: testing utilities only
- [ ] Confirm no business logic included
- [ ] Check estimated package size (<100 files) per [size limits](./decomposition-principles.md#size-limits)
- [ ] Validate clear boundaries and interfaces

### Tasks

#### 1.1 Package Structure Setup
**Acceptance Criteria:**
- Package builds independently
- TypeScript types are properly exported
- Package can be installed in other projects

**Tasks:**
- [ ] Create package directory: `packages/shared/testing/`
- [ ] Initialize with TypeScript configuration
- [ ] Set up build scripts and exports
- [ ] Configure Vitest for self-testing

#### 1.2 Extract Test Container Utilities
**Acceptance Criteria:**
- All DI container test utilities work in isolation
- Existing tests continue to pass
- Documentation includes usage examples

**Tasks:**
- [ ] Move `createTestContainer()` and related utilities
- [ ] Extract container reset/cleanup functions
- [ ] Create typed test container factories
- [ ] Add unit tests for container utilities

#### 1.3 Mock Implementations
**Acceptance Criteria:**
- All mock services implement proper interfaces
- Mocks are configurable and reusable
- Mock behavior is well-documented

**Tasks:**
- [ ] Extract MockLogger implementation
- [ ] Extract MockFileSystem implementation
- [ ] Extract MockCache implementation
- [ ] Create mock factory functions
- [ ] Add behavior configuration options

**Mid-Phase Checkpoint:**
- [ ] Verify package size remains under 100 files
- [ ] Check for feature creep or scope expansion
- [ ] Ensure no circular dependencies introduced
- [ ] Validate against decomposition principles

#### 1.4 Fixture Management
**Acceptance Criteria:**
- Fixtures can be loaded from multiple sources
- Fixture paths are configurable
- Cleanup is automatic

**Tasks:**
- [ ] Create fixture loader utilities
- [ ] Implement fixture cleanup mechanisms
- [ ] Add fixture validation helpers
- [ ] Create typed fixture interfaces

#### 1.5 Integration & Migration
**Acceptance Criteria:**
- Main project uses testing
- All existing tests pass
- No code duplication remains

**Tasks:**
- [ ] Update main project to use testing
- [ ] Remove duplicated test utilities
- [ ] Update all test imports
- [ ] Run full test suite
- [ ] Update CI/CD configuration

### Post-Implementation Validation
- [ ] Confirm package follows [single responsibility principle](./decomposition-principles.md#single-purpose)
- [ ] Verify all interfaces are clean and minimal
- [ ] Check package size and complexity metrics against [size limits](./decomposition-principles.md#size-limits)
- [ ] Ensure no business logic leaked into utilities
- [ ] Validate documentation completeness
- [ ] Review against [decomposition principles scorecard](./decomposition-principles.md#implementation-checklist)

## Phase 2: Core Infrastructure Extraction (Week 3-4)

### Goals
Extract core DI, logging, and utility functions into reusable packages.

### Pre-Implementation Review
- [ ] Review each package against decomposition principles
- [ ] Verify clear separation between packages
- [ ] Confirm no overlapping responsibilities
- [ ] Check dependency relationships are unidirectional
- [ ] Validate estimated size for each package

### Tasks

#### 2.1 Logger Package (logger)
**Acceptance Criteria:**
- Winston configuration is reusable
- Log formats are consistent
- Child loggers work correctly

**Tasks:**
- [ ] Create logger package structure
- [ ] Extract Winston configuration
- [ ] Create logger factory functions
- [ ] Add environment-based configuration
- [ ] Implement structured logging helpers
- [ ] Migrate main project to use package

#### 2.2 Core Package (core)
**Acceptance Criteria:**
- DI utilities are framework-agnostic
- Base interfaces are well-defined
- Type exports are comprehensive

**Tasks:**
- [ ] Create core package structure
- [ ] Extract DI container setup utilities
- [ ] Move base interfaces (ILogger, ICache, etc.)
- [ ] Create injection token management
- [ ] Add container lifecycle utilities
- [ ] Update dependent packages

**Mid-Phase Checkpoint:**
- [ ] Review total package count against principles
- [ ] Verify each package maintains single responsibility
- [ ] Check for unnecessary abstraction layers
- [ ] Validate package sizes and complexity

#### 2.3 File System Package (file-system)
**Acceptance Criteria:**
- File operations are abstracted
- Both sync and async APIs available
- Proper error handling

**Tasks:**
- [ ] Create file system package
- [ ] Extract file operation utilities
- [ ] Implement virtual file system for testing
- [ ] Add path manipulation helpers
- [ ] Create file watching utilities
- [ ] Integrate with main project

### Post-Implementation Validation
- [ ] Each package passes single responsibility test
- [ ] No circular dependencies between packages
- [ ] Total package count remains manageable (<10)
- [ ] Each package has clear, minimal interfaces
- [ ] Documentation reflects actual implementation
- [ ] Performance metrics meet or exceed baseline

## Phase 3: Feature-Based Decomposition (Week 5-6)

### Goals
Extract business logic into focused, feature-specific packages.

### Pre-Implementation Review
- [ ] Evaluate if feature packages are truly needed
- [ ] Consider consolidation opportunities
- [ ] Review against "fewer packages" principle
- [ ] Ensure each package has distinct value
- [ ] Check for potential future merge candidates

### Tasks

#### 3.1 Dependency Checker Package (dependency-checker)
**Acceptance Criteria:**
- Can check npm dependencies independently
- Supports multiple package managers
- Provides detailed dependency information

**Tasks:**
- [ ] Create package structure
- [ ] Extract dependency checking logic
- [ ] Add support for different lockfile formats
- [ ] Implement version comparison utilities
- [ ] Create CLI interface
- [ ] Add integration tests

#### 3.2 Report Generator Package (report-generator)
**Acceptance Criteria:**
- Report generation is configurable
- Multiple output formats supported
- Template system is extensible

**Tasks:**
- [ ] Create report generator package
- [ ] Extract report generation logic
- [ ] Implement template system
- [ ] Add output format plugins
- [ ] Create report configuration schema
- [ ] Migrate existing reports

#### 3.3 GitHub Integration Package (github)
**Acceptance Criteria:**
- GitHub API operations are abstracted
- Authentication is configurable
- Rate limiting is handled

**Tasks:**
- [ ] Create GitHub package
- [ ] Extract GitHub API utilities
- [ ] Implement authentication providers
- [ ] Add rate limit handling
- [ ] Create webhook utilities
- [ ] Test with GitHub Actions

### Post-Implementation Validation
- [ ] Total package count review (target: <10)
- [ ] Each package justifies its existence
- [ ] No overlapping functionality between packages
- [ ] Clear upgrade path for consolidation
- [ ] All packages follow decomposition principles
- [ ] Final scorecard assessment for each package

## Success Metrics

### Code Quality
- [ ] Test coverage remains above 80%
- [ ] No increase in TypeScript errors
- [ ] ESLint violations stay at zero
- [ ] Build times improve by 20%

### Developer Experience
- [ ] New package creation takes < 30 minutes
- [ ] Package documentation is comprehensive
- [ ] Local development setup is simplified
- [ ] CI/CD runs are faster

### Architecture
- [ ] No circular dependencies between packages
- [ ] Clear separation of concerns
- [ ] Consistent patterns across packages
- [ ] Reusable components identified and extracted
- [ ] Total package count <10 (per decomposition principles)
- [ ] Each package <100 files (per size guidelines)

### Business Impact
- [ ] Report generation time unchanged
- [ ] No regression in functionality
- [ ] Easier to add new report types
- [ ] Reduced time to implement new features

## Review Checkpoints

### Week 1 Review
- Testing package structure approved
- Initial extraction complete
- Integration tests passing
- **Principles Check:** Single responsibility maintained

### Week 2 Review
- Testing package fully integrated
- Performance benchmarks met
- Documentation complete
- **Principles Check:** Package size within limits

### Week 4 Review
- Core packages extracted
- All tests passing
- No performance regressions
- **Principles Check:** No circular dependencies, clear interfaces

### Week 6 Review
- All packages extracted
- Full system integration tested
- Production deployment ready
- **Principles Check:** Total package count <10, all principles met

## Timeline Estimates

### Phase 1: Testing Package (2 weeks)
- Week 1: Package creation and utility extraction
- Week 2: Integration and migration

### Phase 2: Core Infrastructure (2 weeks)
- Week 3: Logger and core packages
- Week 4: File system and integration

### Phase 3: Feature Packages (2 weeks)
- Week 5: Dependency checker and report generator
- Week 6: GitHub integration and final testing

### Buffer & Stabilization (1 week)
- Documentation updates
- Performance optimization
- Team knowledge transfer

## Risk Mitigation

### Technical Risks
- **Risk:** Breaking changes during extraction
- **Mitigation:** Comprehensive test coverage before changes
- **Risk:** Over-decomposition leading to complexity
- **Mitigation:** Regular principle validation checkpoints

### Process Risks
- **Risk:** Development velocity impact
- **Mitigation:** Incremental extraction, maintain working system
- **Risk:** Scope creep in package functionality
- **Mitigation:** Strict adherence to decomposition principles

### Knowledge Risks
- **Risk:** Team unfamiliarity with new structure
- **Mitigation:** Documentation and pair programming sessions
- **Risk:** Inconsistent application of principles
- **Mitigation:** Regular team reviews against principle checklist

## Next Steps

1. **Today:** Create workspace structure and testing package
2. **Tomorrow:** Begin extracting test utilities
3. **This Week:** Complete Phase 1.1 and 1.2
4. **Next Week:** Finish testing package and begin core extraction

## Notes

- Each package must have comprehensive tests before integration
- CLAUDE.md files are required for all packages
- Breaking changes require team discussion
- Performance benchmarks run after each phase
- **Decomposition principles must be reviewed at each checkpoint**
- **Package consolidation should be considered if principles are violated**
- **Refer to [`decomposition-principles.md`](./decomposition-principles.md) for detailed guidelines**