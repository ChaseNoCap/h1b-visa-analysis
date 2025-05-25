# Project Backlog

This document tracks future work items for the h1b-visa-analysis project. When asking "what's next?", consult this backlog for prioritized work items.

## How to Use This Backlog

1. **Prioritization**: Items are listed in priority order within each section
2. **Status**: Each item should have a clear status (Not Started, In Progress, Blocked, Complete)
3. **Refinement**: Work items should be refined before starting implementation
4. **Updates**: Mark items complete and add new discoveries as work progresses

## High Priority Items

### 1. Add Coverage Badges to README
**Status**: Not Started  
**Description**: Add test coverage badges to the main README.md to show coverage status for each package
**Tasks**:
- Generate coverage badges for each package
- Add badges section to README.md
- Set up automation to update badges on test runs
- Include both overall and per-package coverage

## Medium Priority Items

### 2. Implement Report Content Integration
**Status**: Not Started  
**Description**: Wire up actual content from dependencies (prompts-shared, markdown-compiler, report-components)
**Tasks**:
- Integrate markdown-compiler for processing
- Connect report-components for H1B content
- Use template engine for dynamic content rendering
- Test end-to-end report generation with real data

### 3. Add PDF Generation Support
**Status**: Not Started  
**Description**: Add ability to generate reports in PDF format
**Tasks**:
- Research PDF generation libraries
- Create PDF generator service
- Add format selection to ReportGenerator
- Test PDF output quality and formatting

## Low Priority Items

### 4. Performance Optimizations
**Status**: Not Started  
**Description**: Optimize report generation performance
**Tasks**:
- Profile current performance bottlenecks
- Add caching to expensive operations
- Implement streaming for large reports
- Add performance metrics and monitoring

### 5. Create Web UI
**Status**: Not Started  
**Description**: Build a web interface for report generation
**Tasks**:
- Design UI/UX for report configuration
- Implement frontend application
- Create API endpoints for report generation
- Add progress tracking and download capabilities

## Technical Debt

### 6. Improve Error Messages
**Status**: Not Started  
**Description**: Enhance error messages across all packages for better debugging
**Tasks**:
- Audit current error messages
- Add error codes and structured error data
- Create error documentation
- Improve error context and suggestions

### 7. Add Integration Tests
**Status**: Not Started  
**Description**: Create integration tests between packages
**Tasks**:
- Test package interactions
- Add cross-package dependency tests
- Create integration test suite
- Document integration patterns

## Documentation

### 8. Create Architecture Decision Records (ADRs)
**Status**: Not Started  
**Description**: Document key architectural decisions
**Tasks**:
- Create ADR template
- Document existing decisions
- Set up ADR workflow
- Link ADRs to relevant code

## Infrastructure

### 9. Set Up Continuous Deployment
**Status**: Not Started  
**Description**: Automate package publishing and deployment
**Tasks**:
- Configure automated publishing for shared packages
- Set up semantic versioning
- Create deployment pipeline
- Add rollback capabilities

## Completed Items

_Items moved here when complete with completion date_

---

## Adding New Items

When adding new items to this backlog:
1. Choose appropriate priority level
2. Provide clear description and acceptance criteria
3. Break down into concrete tasks
4. Estimate complexity if possible
5. Link to relevant issues or discussions