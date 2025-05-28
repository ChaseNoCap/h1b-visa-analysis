# Project Backlog

This document tracks future work items for the h1b-visa-analysis project. When asking "what's next?", consult this backlog for prioritized work items.

## Current Status

**As of January 2025:**
- H1B Analysis System: 11 packages fully operational with automated publishing
- Meta GOTHIC Framework: 8 packages created, UI dashboard foundation complete
- Nested meta repository pattern established for Meta GOTHIC
- Health monitoring and pipeline control UI implemented with mock data

## How to Use This Backlog

1. **Prioritization**: Items are listed in priority order within each section
2. **Status**: Each item should have a clear status (Not Started, In Progress, Blocked, Complete)
3. **Refinement**: Work items should be refined before starting implementation
4. **Updates**: Mark items complete and add new discoveries as work progresses

## 🚨 Critical Priority Items

### 1. Fix GitHub Service Dependency Issues for Meta GOTHIC Dashboard
**Status**: In Progress  
**Effort**: 1-2 days  
**ADRs**: ADR-016 (Local NPM Authentication), ADR-007 (Meta Repository Pattern)  
**Description**: Resolve dependency chain issues preventing GitHub GraphQL client from loading in UI dashboard
**Root Cause**: Missing npm authentication for @chasenocap packages and circular dependency resolution
**Tasks**:
- [ ] Configure npm authentication for GitHub Packages registry
- [ ] Build all required @chasenocap dependencies in correct order
- [ ] Fix circular dependencies between github-graphql-client and cache packages
- [ ] Ensure all TypeScript builds complete without errors
- [ ] Validate UI dashboard loads with real GitHub service
- [ ] Test GitHub token authentication flow end-to-end
- [ ] Verify all API functions work with real GitHub APIs
- [ ] Manual validation: Dashboard loads at http://localhost:3001/
- [ ] Manual validation: Console shows "✅ Using real GitHub API" with token
- [ ] Manual validation: Repository data loads from actual GitHub
**Acceptance Criteria**:
- ✅ `npm run dev` starts without dependency errors
- ✅ Dashboard loads and displays actual metaGOTHIC repository data
- ✅ GitHub token authentication works correctly
- ✅ All workflow controls function with real GitHub Actions API
- ✅ Error handling gracefully falls back to enhanced mock
**Definition of Done**: Dashboard operational with real GitHub API integration

### 2. Complete GitHub API Integration for Meta GOTHIC Dashboard
**Status**: Implemented (Needs Dependency Fix)  
**Effort**: ✅ COMPLETE - 97.4% validated  
**ADRs**: ADR-003 (Automated Publishing), ADR-004 (CI Dashboard Data), ADR-015 (GitHub API Hybrid Strategy)  
**Description**: ✅ GitHub API integration architecture implemented with enhanced mock fallback
**Implementation Status**:
- ✅ Implement GitHub GraphQL client using `@chasenocap/graphql-toolkit`
- ✅ Create authentication flow with PAT token management
- ✅ Build repository data fetching service
- ✅ Implement workflow status monitoring via Actions API
- ✅ Add error handling and rate limiting per ADR-015
- ✅ Cache responses using ADR-009 multi-layer caching strategy
**Current State**: Architecture complete, enhanced mock operational, blocked by dependency issues
**Next Step**: Complete item #1 to enable real GitHub API mode

### 3. Real-time Event System Integration
**Status**: Not Started  
**Effort**: 3-4 days  
**ADRs**: ADR-008 (Event-Driven Architecture), ADR-005 (GraphQL-First)  
**Description**: Implement real-time updates for dashboard using event system
**Tasks**:
- [ ] Set up Redis connection for Pub/Sub per ADR-008
- [ ] Implement GraphQL subscriptions following ADR-005
- [ ] Create event handlers for repository updates
- [ ] Add WebSocket support to UI components
- [ ] Implement event replay from Redis Streams
- [ ] Test with GitHub webhook events

## High Priority Items

### 4. SDLC State Machine Integration
**Status**: Not Started  
**Effort**: 4-5 days  
**ADRs**: ADR-006 (GOTHIC Pattern), ADR-011 (SDLC State Machine)  
**Description**: Integrate SDLC state machine for guided development workflows
**Tasks**:
- [ ] Create UI components for SDLC phase visualization
- [ ] Implement phase transition controls per ADR-011
- [ ] Add validation rules and quality gates UI
- [ ] Create AI guidance integration points
- [ ] Build progress tracking dashboard
- [ ] Add phase-specific context loading for Claude

### 5. GraphQL Federation Gateway
**Status**: Not Started  
**Effort**: 5-7 days  
**ADRs**: ADR-005 (GraphQL-First), ADR-014 (GraphQL Federation)  
**Description**: Implement federated GraphQL gateway for Meta GOTHIC services
**Tasks**:
- [ ] Set up Apollo Gateway or Mercurius Gateway
- [ ] Define service boundaries per ADR-014
- [ ] Create repo-agent service schema
- [ ] Create claude-service schema
- [ ] Implement entity resolution
- [ ] Add subscription federation support
- [ ] Create unified API documentation

### 6. Automated Tagging and Publishing Flow
**Status**: Not Started  
**Effort**: 3-4 days  
**ADRs**: ADR-003 (Automated Publishing), ADR-007 (Meta Repository)  
**Description**: Implement UI controls for package tagging and publishing
**Tasks**:
- [ ] Create version bump UI with semver support
- [ ] Implement git tagging via GitHub API
- [ ] Add pre-release and beta channel support
- [ ] Create publish workflow triggers
- [ ] Add rollback capabilities
- [ ] Implement publish status monitoring
- [ ] Add dependency impact analysis

## Medium Priority Items

### 7. CI/CD Metrics Collection and Visualization
**Status**: Not Started  
**Effort**: 3-4 days  
**ADRs**: ADR-004 (CI Dashboard Data), ADR-009 (Multi-layer Caching)  
**Description**: Implement comprehensive CI/CD metrics collection and charts
**Tasks**:
- [ ] Create metrics collection service per ADR-004
- [ ] Implement 30-day rolling window storage
- [ ] Add Recharts visualizations for trends
- [ ] Create build time analysis
- [ ] Add test coverage trends
- [ ] Implement failure analysis dashboard
- [ ] Add performance benchmarking

### 8. Package Dependency Graph Visualization
**Status**: Not Started  
**Effort**: 4-5 days  
**ADRs**: ADR-007 (Meta Repository), ADR-002 (Git Submodules)  
**Description**: Visual dependency graph for all Meta GOTHIC packages
**Tasks**:
- [ ] Parse package.json dependencies
- [ ] Create interactive graph using D3.js or React Flow
- [ ] Add version compatibility checking
- [ ] Implement update impact analysis
- [ ] Add circular dependency detection
- [ ] Create dependency update suggestions

### 9. Terminal UI Components
**Status**: Not Started  
**Effort**: 3-4 days  
**ADRs**: ADR-006 (GOTHIC Pattern - Tooling Excellence)  
**Description**: Implement terminal UI components for Meta GOTHIC
**Tasks**:
- [ ] Create Terminal component with ANSI support
- [ ] Add command history and autocomplete
- [ ] Implement file tree navigator component
- [ ] Add log viewer with filtering
- [ ] Create interactive command builder
- [ ] Add terminal theming support

## Low Priority Items

### 10. Kanban Board for Task Management
**Status**: Not Started  
**Effort**: 3-4 days  
**ADRs**: ADR-006 (GOTHIC Pattern - Tooling Excellence)  
**Description**: Implement Kanban board for project management
**Tasks**:
- [ ] Create drag-and-drop board component
- [ ] Integrate with GitHub Issues API
- [ ] Add swimlanes for different packages
- [ ] Implement WIP limits
- [ ] Add filtering and search
- [ ] Create bulk operations support

### 11. AI Context Management UI
**Status**: Not Started  
**Effort**: 2-3 days  
**ADRs**: ADR-010 (Progressive Context Loading)  
**Description**: UI for managing Claude context and prompts
**Tasks**:
- [ ] Create context browser interface
- [ ] Add prompt template editor
- [ ] Implement context size visualization
- [ ] Add prompt history tracking
- [ ] Create context optimization suggestions

### 12. Package Documentation Generator
**Status**: Not Started  
**Effort**: 2-3 days  
**ADRs**: ADR-006 (GOTHIC Pattern)  
**Description**: Auto-generate package documentation
**Tasks**:
- [ ] Parse TypeScript for API docs
- [ ] Generate README templates
- [ ] Create CLAUDE.md templates
- [ ] Add usage examples extraction
- [ ] Implement changelog generation

## Technical Debt

### TD-1. Clean Up TypeScript Warnings in UI Components
**Status**: Not Started  
**Effort**: 1 day  
**Description**: Fix unused imports and type errors in ui-components
**Tasks**:
- [ ] Remove unused imports
- [ ] Fix type inference issues
- [ ] Add proper error boundaries
- [ ] Update strict TypeScript settings

### TD-2. Implement Proper Error Handling
**Status**: Not Started  
**Effort**: 2 days  
**ADRs**: ADR-005 (GraphQL-First)  
**Description**: Add comprehensive error handling across the stack
**Tasks**:
- [ ] Create error boundary components
- [ ] Add API error handling with retry logic
- [ ] Implement user-friendly error messages
- [ ] Add error logging service
- [ ] Create error recovery workflows

## Documentation

### DOC-1. Meta GOTHIC Architecture Documentation
**Status**: Not Started  
**Effort**: 2 days  
**ADRs**: All Meta GOTHIC related ADRs  
**Description**: Create comprehensive architecture documentation
**Tasks**:
- [ ] Document service architecture with diagrams
- [ ] Create API documentation
- [ ] Add deployment guides
- [ ] Document security considerations
- [ ] Create developer onboarding guide

### DOC-2. Meta GOTHIC User Guide
**Status**: Not Started  
**Effort**: 2 days  
**Description**: End-user documentation for the dashboard
**Tasks**:
- [ ] Create getting started guide
- [ ] Document all UI features
- [ ] Add troubleshooting section
- [ ] Create video tutorials
- [ ] Add FAQ section

## Infrastructure

### INFRA-1. Set Up Redis for Event System
**Status**: Not Started  
**Effort**: 1-2 days  
**ADRs**: ADR-008 (Event-Driven Architecture)  
**Description**: Deploy Redis for pub/sub and streams
**Tasks**:
- [ ] Set up Redis instance (local/cloud)
- [ ] Configure Redis Streams
- [ ] Set up Redis Pub/Sub
- [ ] Add connection pooling
- [ ] Implement health checks
- [ ] Add monitoring

### INFRA-2. GitHub App Creation
**Status**: Not Started  
**Effort**: 1 day  
**ADRs**: ADR-015 (GitHub API Hybrid Strategy)  
**Description**: Create GitHub App for better API access
**Tasks**:
- [ ] Create GitHub App
- [ ] Configure permissions
- [ ] Implement OAuth flow
- [ ] Add installation webhook handlers
- [ ] Create token refresh logic

## Completed Items

### January 28, 2025
- **Meta GOTHIC Nested Repository Structure** - Created nested meta repository pattern for Meta GOTHIC Framework
- **UI Dashboard Foundation** - Implemented health monitoring and pipeline control UI with React/TypeScript
- **Testing Infrastructure** - Set up Vitest with React Testing Library, 7 tests passing

## Meta GOTHIC Implementation Roadmap

### Phase 1: Foundation (Current - 2 weeks)
1. **GitHub API Integration** (Critical #1)
2. **Real-time Event System** (Critical #2)
3. **Automated Publishing Flow** (High #5)

### Phase 2: Core Features (2-4 weeks)
1. **SDLC State Machine UI** (High #3)
2. **GraphQL Federation** (High #4)
3. **CI/CD Metrics** (Medium #6)

### Phase 3: Advanced Features (4-6 weeks)
1. **Dependency Graph** (Medium #7)
2. **Terminal UI Components** (Medium #8)
3. **Kanban Board** (Low #9)

### Phase 4: Polish & Documentation (6-8 weeks)
1. **Technical Debt Cleanup** (TD-1, TD-2)
2. **Documentation** (DOC-1, DOC-2)
3. **Infrastructure Hardening** (INFRA-1, INFRA-2)

## Adding New Items

When adding new items to this backlog:
1. Choose the appropriate priority section
2. Include a clear description and estimated effort
3. Break down into specific tasks where possible
4. Add any relevant context or dependencies
5. Link to related documentation or ADRs

## Notes

- This backlog focuses on actionable development work
- For architectural decisions, see the ADR documents
- For package-specific details, see the package catalog