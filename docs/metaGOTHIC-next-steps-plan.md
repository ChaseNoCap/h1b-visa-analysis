# metaGOTHIC Next Steps - Well-Groomed Implementation Plan

## Executive Summary

With all 9 metaGOTHIC foundation packages complete (100%), we're ready to move to the next phase: creating GitHub repositories, publishing packages, and beginning service development. This plan provides well-groomed stories with clear acceptance criteria and ADR references.

## Current State ✅

**metaGOTHIC Foundation**: 9/9 packages complete
- **@chasenocap/claude-client**: Claude subprocess wrapper (19 tests)
- **@chasenocap/prompt-toolkit**: XML template system (32 tests, 100% coverage)
- **@chasenocap/sdlc-config**: YAML configuration (39 tests, 93% coverage)
- **@chasenocap/sdlc-engine**: State machine (20 tests)
- **@chasenocap/sdlc-content**: Templates & knowledge base (56 tests, 89.6% coverage)
- **@chasenocap/ui-components**: React components (comprehensive tests)
- **@chasenocap/context-aggregator**: Context management (14 tests, 100% coverage)
- **@chasenocap/graphql-toolkit**: GraphQL utilities (52 tests)
- **@chasenocap/github-graphql-client**: Smart GitHub API client (comprehensive implementation)

## Phase 1: Repository Standardization & Publishing 🚀

### Epic 1.1: Standardize Repository Creation Pattern
**Related ADRs**: ADR-003 (Automated Publishing Infrastructure), ADR-002 (Git Submodules Architecture)

#### Story 1.1.1: Create Repository Creation Standard Operating Procedure
**Priority**: High  
**Effort**: 2 story points  
**Dependencies**: None

**Description**: Document standardized process for creating new package repositories that follow the established ecosystem patterns.

**Acceptance Criteria**:
- [ ] Document step-by-step repository creation process
- [ ] Include GitHub repository settings template
- [ ] Define branch protection rules standard
- [ ] Document GitHub Packages configuration
- [ ] Include webhook configuration for repository_dispatch
- [ ] Reference ADR-003 dual-mode architecture requirements
- [ ] Include ADR-016 NPM authentication setup

**Implementation Notes**:
- Follow existing patterns from H1B packages (cache, logger, etc.)
- Ensure consistency with Unified Package Workflow (ADR-003)
- Include .npmrc configuration per ADR-016

**Definition of Done**:
- Repository creation SOP documented in `/docs/repository-creation-sop.md`
- Checklist format for easy execution
- ADR references included for architectural decisions

#### Story 1.1.2: Create GitHub Repository Template
**Priority**: High  
**Effort**: 3 story points  
**Dependencies**: Story 1.1.1

**Description**: Create a template repository with all standard configurations, workflows, and files pre-configured.

**Acceptance Criteria**:
- [ ] Template repository created with standard structure
- [ ] Unified Package Workflow configured per ADR-003
- [ ] README.md template with ecosystem standards
- [ ] CLAUDE.md template following established patterns
- [ ] TypeScript configuration matching ecosystem
- [ ] ESLint configuration standardized
- [ ] Vitest configuration template
- [ ] .npmrc file with ADR-016 authentication pattern
- [ ] package.json template with correct publishConfig

**Implementation Notes**:
- Use existing graphql-toolkit as reference for complete setup
- Include all quality gates: build, test, lint, typecheck
- Template variables for package-specific customization

### Epic 1.2: Create metaGOTHIC Package Repositories
**Related ADRs**: ADR-003, ADR-002, ADR-016

#### Story 1.2.1: Create Repositories for Core Libraries
**Priority**: High  
**Effort**: 5 story points  
**Dependencies**: Story 1.1.2

**Description**: Create GitHub repositories for the 4 core metaGOTHIC libraries.

**Packages**:
- github.com/ChaseNoCap/claude-client
- github.com/ChaseNoCap/prompt-toolkit  
- github.com/ChaseNoCap/sdlc-config
- github.com/ChaseNoCap/sdlc-engine

**Acceptance Criteria**:
- [ ] All 4 repositories created with consistent naming
- [ ] Template structure applied to each repository
- [ ] Source code migrated from packages/ directories
- [ ] Git history preserved during migration
- [ ] README.md and CLAUDE.md customized for each package
- [ ] Branch protection rules configured
- [ ] GitHub Packages publishing enabled
- [ ] PAT_TOKEN secret configured for workflows

**Implementation Notes**:
- Use `git subtree push` or similar to preserve commit history
- Update package.json repository URLs
- Verify all dependencies are correctly specified

#### Story 1.2.2: Create Repositories for Remaining Packages
**Priority**: High  
**Effort**: 5 story points  
**Dependencies**: Story 1.2.1

**Description**: Create GitHub repositories for the remaining 5 metaGOTHIC packages.

**Packages**:
- github.com/ChaseNoCap/ui-components
- github.com/ChaseNoCap/context-aggregator
- github.com/ChaseNoCap/graphql-toolkit
- github.com/ChaseNoCap/github-graphql-client
- (Note: sdlc-content already has repository)

**Acceptance Criteria**:
- [ ] All 4 repositories created and configured
- [ ] Unified Package Workflow deployed per ADR-003
- [ ] Source code and tests migrated successfully
- [ ] All package-specific documentation complete
- [ ] CI workflows validated (build, test, lint passing)
- [ ] Repository dispatch configuration verified

### Epic 1.3: Deploy Automation Infrastructure
**Related ADRs**: ADR-003 (Automated Publishing Infrastructure)

#### Story 1.3.1: Deploy Unified Workflows
**Priority**: High  
**Effort**: 3 story points  
**Dependencies**: Story 1.2.2

**Description**: Deploy the standardized Unified Package Workflow to all new metaGOTHIC repositories.

**Acceptance Criteria**:
- [ ] Unified Package Workflow deployed to all 8 new repositories
- [ ] PAT_TOKEN secrets configured in each repository
- [ ] Workflow triggers tested (tag-based publishing)
- [ ] Quality gates validated (build, test, lint, typecheck)
- [ ] Repository dispatch notifications configured
- [ ] NPM authentication working per ADR-016

**Implementation Notes**:
- Use existing workflow template from H1B packages
- Verify npm config set patterns for GitHub Packages
- Test with pre-release tags first

#### Story 1.3.2: Configure Meta Repository Submodules
**Priority**: High  
**Effort**: 4 story points  
**Dependencies**: Story 1.3.1

**Description**: Update meta repository to include new metaGOTHIC packages as Git submodules per ADR-002.

**Acceptance Criteria**:
- [ ] All 8 metaGOTHIC packages added as Git submodules
- [ ] .gitmodules configuration updated
- [ ] Meta repository package.json updated with new dependencies
- [ ] Auto-update workflow tested with new packages
- [ ] Smart dependency manager updated for new packages
- [ ] Package tiers configured (core/shared/app classification)

**Implementation Notes**:
- Follow existing submodule patterns from H1B packages
- Update PACKAGE_TIERS in smart-deps.js
- Test auto-update workflow with simulated repository dispatch

## Phase 2: Package Publishing 📦

### Epic 2.1: Initial Package Publishing
**Related ADRs**: ADR-003, ADR-016

#### Story 2.1.1: Publish Core Libraries
**Priority**: High  
**Effort**: 3 story points  
**Dependencies**: Epic 1.3

**Description**: Publish initial v1.0.0 versions of core metaGOTHIC libraries.

**Packages**: claude-client, prompt-toolkit, sdlc-config, sdlc-engine

**Acceptance Criteria**:
- [ ] v1.0.0 tags created for all 4 packages
- [ ] GitHub Actions workflows execute successfully
- [ ] Packages published to GitHub Packages (@chasenocap scope)
- [ ] Repository dispatch events fired successfully
- [ ] Auto-update PRs created in meta repository
- [ ] Published packages installable via npm

**Implementation Notes**:
- Create git tags with format: v1.0.0
- Monitor workflow execution in GitHub Actions
- Verify packages appear in GitHub Packages registry

#### Story 2.1.2: Publish Remaining Packages
**Priority**: High  
**Effort**: 3 story points  
**Dependencies**: Story 2.1.1

**Description**: Publish initial versions of remaining metaGOTHIC packages.

**Packages**: ui-components, context-aggregator, graphql-toolkit, github-graphql-client

**Acceptance Criteria**:
- [ ] v1.0.0 tags created for all 4 packages
- [ ] All workflows execute without errors
- [ ] All packages available in GitHub Packages registry
- [ ] Dependency chain verified (packages that depend on others)
- [ ] Auto-update workflow handles all 8 new packages correctly
- [ ] End-to-end ecosystem validation complete

### Epic 2.2: Ecosystem Integration Testing
**Related ADRs**: ADR-001 (Unified Dependency Strategy)

#### Story 2.2.1: Validate Dual-Mode Architecture
**Priority**: High  
**Effort**: 4 story points  
**Dependencies**: Story 2.1.2

**Description**: Comprehensive testing of dual-mode architecture with expanded ecosystem.

**Acceptance Criteria**:
- [ ] Local development mode tested with all 20 packages
- [ ] Pipeline mode tested with tag-based publishing
- [ ] Smart dependency manager handles metaGOTHIC packages
- [ ] npm link functionality verified across new packages
- [ ] Auto-update workflow tested end-to-end
- [ ] Package tiers working correctly (core/shared/app)
- [ ] Quality gates preventing broken publishes

## Phase 3: Service Development Planning 🏗️

### Epic 3.1: GraphQL Federation Architecture Design
**Related ADRs**: ADR-005 (GraphQL-First Architecture), ADR-014 (GraphQL Federation Architecture), ADR-013 (Mercurius over Apollo)

#### Story 3.1.1: Define Federation Schema Strategy
**Priority**: Medium  
**Effort**: 5 story points  
**Dependencies**: None (can start in parallel)

**Description**: Design comprehensive GraphQL federation schema strategy for 3-service architecture.

**Acceptance Criteria**:
- [ ] Service boundary definitions documented
- [ ] Entity ownership matrix defined (which service owns which entities)
- [ ] Cross-service relationship patterns documented
- [ ] Schema composition strategy defined
- [ ] Federation directives usage patterns (@key, @extends, @external)
- [ ] Query planning optimization strategy
- [ ] Subscription federation approach documented

**Implementation Notes**:
- Follow ADR-014 federation architecture decisions
- Consider Mercurius federation capabilities per ADR-013
- Plan for smart GitHub API routing per ADR-015

#### Story 3.1.2: Design Service API Specifications
**Priority**: Medium  
**Effort**: 6 story points  
**Dependencies**: Story 3.1.1

**Description**: Create detailed API specifications for each of the 3 services.

**Services**:
- **meta-gothic-app** (port 3000): Gateway + UI
- **repo-agent-service** (port 3001): GitHub operations  
- **claude-service** (port 3002): AI processing

**Acceptance Criteria**:
- [ ] GraphQL schemas defined for each service
- [ ] REST endpoints documented where needed (webhooks, health checks)
- [ ] Service interaction patterns documented
- [ ] Authentication and authorization strategy defined
- [ ] WebSocket subscription patterns documented
- [ ] Error handling patterns standardized
- [ ] Performance requirements specified

### Epic 3.2: Service Implementation Stories
**Related ADRs**: ADR-012 (Fastify over Express), ADR-013 (Mercurius over Apollo)

#### Story 3.2.1: Create Service Development Templates
**Priority**: Medium  
**Effort**: 4 story points  
**Dependencies**: Story 3.1.2

**Description**: Create standardized templates for metaGOTHIC service development.

**Acceptance Criteria**:
- [ ] Fastify + Mercurius service template created
- [ ] TypeScript configuration for services
- [ ] Federation subgraph template
- [ ] Docker configuration templates
- [ ] Test setup for GraphQL services
- [ ] Monitoring and logging configuration
- [ ] Package.json template with all metaGOTHIC dependencies

## Implementation Timeline & Dependencies

### Critical Path Analysis
1. **Repository Creation** (Epic 1.1, 1.2) → **Automation Deployment** (Epic 1.3) → **Publishing** (Epic 2.1)
2. **Service Planning** (Epic 3.1) can start in parallel with publishing
3. **Service Implementation** (Epic 3.2) requires completed package ecosystem

### Estimated Timeline
- **Phase 1**: 5-7 days (repository standardization & creation)
- **Phase 2**: 2-3 days (publishing & testing)  
- **Phase 3**: 7-10 days (service planning & templates)
- **Total**: 14-20 days

### Risk Mitigation
- **Authentication Issues**: ADR-016 provides proven NPM_TOKEN strategy
- **Workflow Failures**: ADR-003 provides tested patterns from H1B packages
- **Submodule Complexity**: ADR-002 documents proven approaches
- **GraphQL Federation**: ADR-013/014 provide clear technical direction

## Success Metrics

### Phase 1 Success Criteria
- [ ] 8 new GitHub repositories created with consistent structure
- [ ] All repositories have working CI/CD pipelines
- [ ] Meta repository updated with all submodules

### Phase 2 Success Criteria  
- [ ] All 9 metaGOTHIC packages published and available
- [ ] Ecosystem health score >95% across all 20 packages
- [ ] Dual-mode architecture working with expanded ecosystem

### Phase 3 Success Criteria
- [ ] Complete service API specifications
- [ ] Service development templates ready
- [ ] Clear path to service implementation

## Next Actions

1. **Immediate**: Execute Story 1.1.1 (Repository Creation SOP)
2. **Week 1**: Complete Phase 1 (Repository standardization)
3. **Week 2**: Complete Phase 2 (Publishing)
4. **Week 3**: Begin Phase 3 (Service planning)

This plan ensures we maintain the proven patterns from ADR-003 while scaling to the full metaGOTHIC ecosystem, setting up a solid foundation for the GraphQL-first service architecture defined in ADR-005.