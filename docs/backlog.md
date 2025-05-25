# Project Backlog

This document tracks future work items for the h1b-visa-analysis project. When asking "what's next?", consult this backlog for prioritized work items.

## How to Use This Backlog

1. **Prioritization**: Items are listed in priority order within each section
2. **Status**: Each item should have a clear status (Not Started, In Progress, Blocked, Complete)
3. **Refinement**: Work items should be refined before starting implementation
4. **Updates**: Mark items complete and add new discoveries as work progresses

## Critical Priority Items (Blocking Build)

### ✅ 1. Implement event-system Package (COMPLETED)
**Status**: Completed ✅  
**Description**: Implement missing event-system functionality that's blocking the main application build
**Acceptance Criteria**:
- ✅ Export Emits, Traces, setEventBus decorators
- ✅ Export EventBus and TestEventBus classes
- ✅ Event-driven debugging and instrumentation working
- ✅ All TypeScript compilation errors resolved
**Completed Tasks**:
- ✅ Implement EventBus class with emit/subscribe functionality
- ✅ Create Emits decorator for method instrumentation with payloadMapper support
- ✅ Create Traces decorator for performance monitoring with threshold support
- ✅ Implement setEventBus helper function
- ✅ Create TestEventBus with expectEvent() assertion helpers for testing
- ✅ Add comprehensive tests (100% statement coverage, 96.36% branch coverage)
- ✅ Update package exports in index.ts
**Final Results**: 28 tests passing, 100% statement coverage, builds successfully

### 2. Implement report-templates Package  
**Status**: Next Priority (Blocking Build)  
**Description**: Implement missing report-templates functionality for report generation
**Acceptance Criteria**:
- Export createTemplateContainer, TEMPLATE_TYPES, IReportBuilder
- Template engine with fluent API working
- MarkdownReportBuilder implementation complete
- Integration with main ReportGenerator service
**Tasks**:
- [ ] Design IReportBuilder interface
- [ ] Implement MarkdownReportBuilder class
- [ ] Create template container factory
- [ ] Define TEMPLATE_TYPES constants
- [ ] Add template registry and management
- [ ] Create fluent API for report building
- [ ] Add comprehensive tests (target 90%+ coverage)
- [ ] Update package exports in index.ts
**Dependencies**: di-framework, file-system
**Estimate**: 2-3 days
**Blocker**: Main application cannot build without this

### 3. Fix file-system Package Exports
**Status**: Critical Priority (Blocking Build)  
**Description**: Fix missing NodeFileSystem export causing import errors
**Acceptance Criteria**:
- NodeFileSystem class exported from file-system package
- All imports in main application resolve correctly
- TypeScript compilation succeeds for file-system dependencies
**Tasks**:
- [ ] Verify NodeFileSystem implementation is complete
- [ ] Add NodeFileSystem export to index.ts
- [ ] Test imports in main application
**Dependencies**: None (already implemented)
**Estimate**: 15 minutes
**Blocker**: Import errors preventing build

## High Priority Items

### 4. Implement Automated Dependency Updates
**Status**: Not Started  
**Description**: Set up automated consumption of new package versions using Renovate + GitHub Actions
**Acceptance Criteria**:
- Automated PRs created within 1 hour of package publish
- Git submodules automatically updated to match npm versions
- Tests run automatically on all updates
- Security updates prioritized and auto-merged
**Tasks**:
- [ ] Install and configure Renovate GitHub App
- [ ] Create renovate.json with submodule support
- [ ] Set up repository dispatch in all 11 package repos
- [ ] Create meta repo workflow for instant updates
- [ ] Configure auto-merge for @chasenocap packages
- [ ] Set up authentication for GitHub Packages
- [ ] Test with one package (logger) first
- [ ] Roll out to all packages
- [ ] Create monitoring dashboard
- [ ] Document troubleshooting guide
**Reference**: See `/docs/dependency-automation-guide.md` for detailed implementation
**Estimate**: 1-2 days

### 5. Add Coverage Badges to README
**Status**: Not Started  
**Description**: Add test coverage badges to the main README.md to show coverage status for each package
**Tasks**:
- Generate coverage badges for each package
- Add badges section to README.md
- Set up automation to update badges on test runs
- Include both overall and per-package coverage

## Medium Priority Items

### 6. Implement XML-Enhanced Prompt Templates
**Status**: Not Started  
**Description**: Convert all prompt templates to XML structure for better parseability
**Tasks**:
- Convert existing prompts to XML format
- Add conditional context loading logic
- Implement structured task definitions
- Create XML validation for prompts
**Reference**: See `/docs/prompt-xml-structured-guide.md` for patterns

### 4. Implement Report Content Integration
**Status**: Not Started  
**Description**: Wire up actual content from dependencies (prompts-shared, markdown-compiler, report-components)
**Tasks**:
- Integrate markdown-compiler for processing
- Connect report-components for H1B content
- Use template engine for dynamic content rendering
- Test end-to-end report generation with real data

### 5. Add Prompt Context Optimization
**Status**: Not Started  
**Description**: Implement optimization patterns for efficient Claude interactions
**Tasks**:
- Add keyword trigger system
- Implement progressive context loading
- Create task-specific context loaders
- Add prompt performance metrics
**Reference**: See `/docs/prompt-optimization-patterns.md` for techniques

### 6. Add PDF Generation Support
**Status**: Not Started  
**Description**: Add ability to generate reports in PDF format
**Tasks**:
- Research PDF generation libraries
- Create PDF generator service
- Add format selection to ReportGenerator
- Test PDF output quality and formatting

## Low Priority Items

### 7. Performance Optimizations
**Status**: Not Started  
**Description**: Optimize report generation performance
**Tasks**:
- Profile current performance bottlenecks
- Add caching to expensive operations
- Implement streaming for large reports
- Add performance metrics and monitoring

### 8. Create Web UI
**Status**: Not Started  
**Description**: Build a web interface for report generation
**Tasks**:
- Design UI/UX for report configuration
- Implement frontend application
- Create API endpoints for report generation
- Add progress tracking and download capabilities

## Technical Debt

### 9. Improve Error Messages
**Status**: Not Started  
**Description**: Enhance error messages across all packages for better debugging
**Tasks**:
- Audit current error messages
- Add error codes and structured error data
- Create error documentation
- Improve error context and suggestions

### 10. Add Integration Tests
**Status**: Not Started  
**Description**: Create integration tests between packages
**Tasks**:
- Test package interactions
- Add cross-package dependency tests
- Create integration test suite
- Document integration patterns

## Documentation

### 11. Create Architecture Decision Records (ADRs)
**Status**: Not Started  
**Description**: Document key architectural decisions
**Tasks**:
- Create ADR template
- Document existing decisions
- Set up ADR workflow
- Link ADRs to relevant code

## Infrastructure

### 12. Set Up Continuous Deployment
**Status**: Not Started  
**Description**: Automate package publishing and deployment
**Tasks**:
- Configure automated publishing for shared packages
- Set up semantic versioning
- Create deployment pipeline
- Add rollback capabilities

## Completed Items

### ✅ Standardize Package Management (May 2025)
**Status**: Completed  
**Description**: Migrated from hybrid workspace/submodule to pure Git submodules architecture
**Completed Tasks**:
- ✅ Removed NPM workspaces configuration
- ✅ Updated all dependencies to @chasenocap scoped packages
- ✅ Fixed all imports across codebase
- ✅ Created package-standardization-guide.md
- ✅ Updated all 11 packages to consistent structure

### ✅ Create Prompts Package (May 2025)
**Status**: Completed  
**Description**: Implemented centralized prompts package for AI context management
**Completed Tasks**:
- ✅ Created packages/prompts/ as Git submodule
- ✅ Implemented mirror-based architecture
- ✅ Added automation scripts for updates
- ✅ Published as @chasenocap/prompts v1.0.0

---

## Adding New Items

When adding new items to this backlog:
1. Choose appropriate priority level
2. Provide clear description and acceptance criteria
3. Break down into concrete tasks
4. Estimate complexity if possible
5. Link to relevant issues or discussions