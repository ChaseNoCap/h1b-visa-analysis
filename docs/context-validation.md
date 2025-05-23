# Context Validation Checklists

This document provides validation checklists to ensure you have the necessary context before starting common tasks in the H1B Visa Analysis monorepo.

## 1. Starting a New Package

Before creating a new package, validate you've read:

- [ ] **CLAUDE.md** - Understand current architecture and @h1b/testing priority
- [ ] **docs/migration-plan.md** - Know the overall package strategy
- [ ] **docs/testing-package-implementation.md** - Understand why testing comes first
- [ ] **docs/claude-md-template.md** - Template for package CLAUDE.md files
- [ ] **docs/claude-md-guide.md** - Best practices for documentation

**Why these matter:**
- CLAUDE.md explains that @h1b/testing must be completed first
- Migration plan shows the dependency graph between packages
- Testing implementation explains the foundational role of testing
- Templates ensure consistent documentation across packages

**Key validation questions:**
1. Is @h1b/testing complete? If not, should you be working on that instead?
2. Does your package depend on @h1b/testing?
3. Have you identified which existing code will migrate to this package?
4. Will this package be used by multiple consumers?

## 2. Implementing a Migration

Before migrating code to a shared package:

- [ ] **docs/migration-plan.md** - Full migration strategy and phases
- [ ] **docs/decomposition-analysis.md** - Understand what should be shared
- [ ] **CLAUDE.md** - Current architecture and patterns
- [ ] **docs/testing-package-implementation.md** - Testing requirements

**Why these matter:**
- Migration plan provides the step-by-step process
- Decomposition analysis explains the "why" behind each package
- CLAUDE.md shows current DI patterns to maintain
- Testing docs ensure proper test coverage during migration

**Key validation questions:**
1. Which phase of migration are we in?
2. Are all prerequisite packages complete?
3. Have you identified all consumers of the code being migrated?
4. Is the test coverage adequate before migration?

## 3. Understanding Project Architecture

Before making architectural decisions:

- [ ] **CLAUDE.md** - Core architecture with TypeScript + DI
- [ ] **docs/architecture-decision-log.md** - Past decisions and rationale
- [ ] **packages/shared/testing/CLAUDE.md** - Example of package structure
- [ ] **src/core/container/container.ts** - Current DI implementation

**Why these matter:**
- CLAUDE.md explains the Inversify-based DI system
- Decision log prevents repeating past mistakes
- Testing package shows the target architecture
- Container setup shows actual implementation patterns

**Key validation questions:**
1. Does your change align with the DI architecture?
2. Are you following interface-first design?
3. Have similar decisions been made before?
4. Will this work with the existing container setup?

## 4. Making Decomposition Decisions

Before deciding what code to share:

- [ ] **docs/decomposition-analysis.md** - Detailed analysis of what to share
- [ ] **docs/migration-plan.md** - Package boundaries and dependencies
- [ ] **CLAUDE.md** - Current monorepo structure
- [ ] **docs/shared-package-analysis.md** - Patterns for shared code

**Why these matter:**
- Decomposition analysis provides criteria for sharing decisions
- Migration plan shows the intended package structure
- CLAUDE.md explains current organization
- Shared package analysis identifies common patterns

**Key validation questions:**
1. Is this code used by multiple packages?
2. Does it represent a clear, cohesive responsibility?
3. Can it be tested in isolation?
4. Does it have minimal dependencies?

## Quick Reference: Document Purpose

| Document | Primary Purpose | Read When |
|----------|----------------|-----------|
| CLAUDE.md | Current state & patterns | Always first |
| migration-plan.md | Roadmap & strategy | Planning work |
| testing-package-implementation.md | Testing foundation | Any package work |
| decomposition-analysis.md | What to share | Refactoring decisions |
| architecture-decision-log.md | Historical context | Major changes |

## Red Flags: You Need More Context If...

1. You're creating a package without understanding why @h1b/testing comes first
2. You're unsure which existing code belongs in your package
3. You don't know how to structure the DI container for your package
4. You're making architectural changes without checking the decision log
5. You're sharing code without clear criteria for why it should be shared

## Getting Help

If you've read the documents but still have questions:

1. Check the example implementation in `packages/shared/testing/`
2. Review the existing services in `src/services/`
3. Look at test patterns in `tests/unit/` and `tests/e2e/`
4. Consult the architecture decision log for similar scenarios

Remember: The goal is not just to read these documents, but to understand how they connect to form a coherent architecture.