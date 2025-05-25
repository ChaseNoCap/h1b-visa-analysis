Core Concept

  Central prompts repo → Mirrors project structure → Each folder maps to a package/component → Built-in system awareness

  Prompts Package Structure

  packages/prompts/
  ├── CLAUDE.md                      # "I am the central prompt repository"
  ├── README.md                      # How to use prompts
  ├── package.json                   # Simple package setup
  ├── src/
  │   ├── system/                    # System-wide prompts
  │   │   ├── architecture.md        # Overall system architecture
  │   │   ├── dependencies.md        # System dependency graph
  │   │   ├── workflows.md           # How components work together
  │   │   └── progress.md            # Current system state
  │   │
  │   ├── packages/                  # Mirrors actual package structure
  │   │   ├── logger/               # Logger package prompts
  │   │   │   ├── overview.md       # What logger does
  │   │   │   ├── api.md            # How to use logger
  │   │   │   ├── integration.md    # How logger integrates
  │   │   │   └── status.md         # Current logger status
  │   │   │
  │   │   ├── cache/                # Cache package prompts
  │   │   │   ├── overview.md       # Caching strategy
  │   │   │   ├── api.md            # Cache decorators usage
  │   │   │   ├── integration.md    # Works with file-system
  │   │   │   └── status.md         # TTL features, coverage
  │   │   │
  │   │   ├── di-framework/         # DI package prompts
  │   │   │   ├── overview.md       # Dependency injection patterns
  │   │   │   ├── api.md            # Container usage
  │   │   │   ├── integration.md    # How DI connects everything
  │   │   │   └── status.md         # Current state
  │   │   │
  │   │   ├── file-system/          # File system prompts
  │   │   ├── event-system/         # Event system prompts
  │   │   ├── test-helpers/         # Test helpers prompts
  │   │   ├── test-mocks/           # Test mocks prompts
  │   │   └── report-templates/     # Report templates prompts
  │   │
  │   ├── applications/             # Main applications
  │   │   ├── h1b-visa-analysis/   # Main app prompts
  │   │   │   ├── overview.md       # Report generator purpose
  │   │   │   ├── workflow.md       # Generation workflow
  │   │   │   ├── integration.md    # How it uses packages
  │   │   │   └── status.md         # Current capabilities
  │   │   │
  │   │   ├── markdown-compiler/    # Markdown compiler prompts
  │   │   └── report-components/    # Report components prompts
  │   │
  │   ├── workflows/                # Cross-cutting workflows
  │   │   ├── report-generation.md  # Full report gen workflow
  │   │   ├── testing-strategy.md   # How testing works across packages
  │   │   ├── deployment.md         # Package publishing workflow
  │   │   └── development.md        # Development patterns
  │   │
  │   └── index.ts                  # Simple exports
  │
  ├── scripts/
  │   ├── validate-structure.ts     # Ensure prompts match project
  │   ├── update-status.ts          # Update status files
  │   └── build-context.ts          # Build context for AI
  │
  └── templates/                    # Templates for new prompts
      ├── package-overview.md       # Template for package overviews
      ├── package-api.md            # Template for API docs
      ├── package-integration.md    # Template for integration docs
      └── package-status.md         # Template for status updates

  Prompt File Examples

  System Architecture Prompt
  <!-- src/system/architecture.md -->
  # H1B Visa Analysis System Architecture

  ## System Overview
  This monorepo implements a report generation system with the following structure:

  ### Core Packages (Infrastructure)
  1. **logger** - Structured logging with Winston
  2. **di-framework** - Dependency injection container
  3. **cache** - Caching decorators with TTL
  4. **file-system** - File operations abstraction
  5. **event-system** - Event-driven debugging

  ### Testing Packages
  1. **test-helpers** - Shared test utilities
  2. **test-mocks** - Mock implementations

  ### Application Packages
  1. **h1b-visa-analysis** - Main report generator
  2. **markdown-compiler** - Markdown processing (external)
  3. **report-components** - H1B content (external)

  ## Dependency Flow
  Applications → Core Packages → No Dependencies
       ↓              ↓
  Test Packages ← Test Interfaces

  ## Key Principles
  - Single responsibility per package
  - <2000 lines per package (guideline)
  - Test in isolation
  - Clear dependency direction

  Package-Specific Prompt
  <!-- src/packages/cache/overview.md -->
  # Cache Package Overview

  ## Purpose
  Provides caching functionality through decorators, shared between h1b-visa-analysis and markdown-compiler.

  ## Key Features
  - `@Cacheable` decorator for method caching
  - `@InvalidateCache` decorator for cache invalidation
  - MemoryCache with TTL support
  - Integration with logger for operation tracking

  ## Usage Example
  ```typescript
  class MyService {
    @Cacheable({ ttl: 3600 })
    async fetchData(id: string): Promise<Data> {
      // Expensive operation cached for 1 hour
    }

    @InvalidateCache('fetchData')
    async updateData(id: string, data: Data): Promise<void> {
      // Clears cache for fetchData
    }
  }

  Current Status

  - Version: 1.1.0
  - Coverage: 94.79%
  - Used by: h1b-visa-analysis, markdown-compiler

  **Workflow Prompt**
  ```markdown
  <!-- src/workflows/report-generation.md -->
  # Report Generation Workflow

  ## Complete Flow
  1. **Trigger**: Push to main, manual dispatch, or dependency update
  2. **Context Loading**: Load prompts and memory bank
  3. **Dependency Check**: Verify all dependencies available
  4. **Content Fetching**:
     - Get prompts from prompts-shared
     - Get content from report-components
     - Get compiler from markdown-compiler
  5. **Report Generation**:
     - Apply prompts to content
     - Compile markdown
     - Format using report-templates
  6. **Output**: Generated report in dist/

  ## Key Integration Points
  - ReportGenerator orchestrates the flow
  - Uses DI for all service dependencies
  - Logs all operations via logger
  - Caches compiled templates
  - Emits events for debugging

  Implementation Plan

  Phase 1: Structure Setup

  1.1 Create Mirror Structure
  // scripts/validate-structure.ts
  async function validatePromptStructure() {
    const projectPackages = await scanProjectPackages();
    const promptPackages = await scanPromptPackages();

    // Ensure every package has corresponding prompts
    for (const pkg of projectPackages) {
      const promptPath = `src/packages/${pkg.name}`;
      if (!promptPackages.has(promptPath)) {
        console.warn(`Missing prompts for package: ${pkg.name}`);
      }
    }
  }

  1.2 Initial Population
  # Create prompts for each existing package
  for package in packages/*; do
    pkg_name=$(basename $package)
    mkdir -p src/packages/$pkg_name
    cp templates/package-*.md src/packages/$pkg_name/
  done

  Phase 2: Content Development

  2.1 System-Level Prompts
  - Architecture overview
  - Dependency relationships
  - System workflows
  - Progress tracking

  2.2 Package-Level Prompts
  For each package:
  - Overview (purpose, features)
  - API (how to use)
  - Integration (how it connects)
  - Status (version, coverage, state)

  2.3 Workflow Prompts
  - Report generation
  - Testing strategy
  - Development patterns
  - Deployment process

  Phase 3: Automation

  3.1 Status Updates
  // scripts/update-status.ts
  async function updatePackageStatus(packageName: string) {
    const pkg = await loadPackage(packageName);
    const coverage = await getCoverage(packageName);
    const version = pkg.version;
    const lastUpdate = await getLastCommitDate(packageName);

    const statusContent = `# ${packageName} Status

  - Version: ${version}
  - Coverage: ${coverage}%
  - Last Update: ${lastUpdate}
  - State: ${getPackageState(pkg)}
  - Dependencies: ${pkg.dependencies}
  - Dependents: ${await findDependents(packageName)}
  `;

    await writeFile(`src/packages/${packageName}/status.md`, statusContent);
  }

  3.2 Context Building
  // scripts/build-context.ts
  export async function buildContext(scope: 'system' | 'package' | 'workflow', target?: string) {
    switch (scope) {
      case 'system':
        return {
          architecture: await loadPrompt('system/architecture.md'),
          dependencies: await loadPrompt('system/dependencies.md'),
          workflows: await loadPrompt('system/workflows.md'),
          progress: await loadPrompt('system/progress.md')
        };

      case 'package':
        return {
          overview: await loadPrompt(`packages/${target}/overview.md`),
          api: await loadPrompt(`packages/${target}/api.md`),
          integration: await loadPrompt(`packages/${target}/integration.md`),
          status: await loadPrompt(`packages/${target}/status.md`)
        };

      case 'workflow':
        return await loadPrompt(`workflows/${target}.md`);
    }
  }

  Phase 4: Simple API

  4.1 Index.ts
  // src/index.ts
  import { readFileSync } from 'fs';
  import { join } from 'path';

  const PROMPTS_DIR = join(__dirname);

  export function getSystemPrompts() {
    return loadPromptDirectory('system');
  }

  export function getPackagePrompts(packageName: string) {
    return loadPromptDirectory(`packages/${packageName}`);
  }

  export function getWorkflowPrompts() {
    return loadPromptDirectory('workflows');
  }

  export function getPrompt(path: string) {
    return readFileSync(join(PROMPTS_DIR, path), 'utf-8');
  }

  // Helper to load all prompts in a directory
  function loadPromptDirectory(dir: string) {
    // Implementation
  }

  Phase 5: Usage Patterns

  5.1 In Report Generator
  import { getPackagePrompts, getWorkflowPrompts } from '@myorg/prompts';

  // Load report generation workflow understanding
  const workflow = getWorkflowPrompts()['report-generation'];

  // Load specific package context
  const cacheContext = getPackagePrompts('cache');

  5.2 For AI Context
  // Load full system understanding
  const systemContext = getSystemPrompts();
  const architecture = systemContext.architecture;
  const dependencies = systemContext.dependencies;

  // Load specific package details
  const loggerPrompts = getPackagePrompts('logger');

  5.3 For Development
  // Understand how packages work together
  const cacheIntegration = getPrompt('packages/cache/integration.md');
  const fileSystemIntegration = getPrompt('packages/file-system/integration.md');

  🚀 Implementation Timeline

  1. Day 1-2: Set up package structure mirroring project
  2. Day 3-5: Write system-level prompts
  3. Week 2: Create prompts for all packages
  4. Week 3: Develop workflow prompts
  5. Week 4: Build automation scripts
  6. Week 5: Test and refine

  📊 Benefits of This Approach

  - ✅ Single Source of Truth: All prompts in one place
  - ✅ Structure Awareness: Mirrors actual project structure
  - ✅ Easy Navigation: Find prompts where you'd expect them
  - ✅ Simple API: Just read markdown files
  - ✅ Version Controlled: Track prompt evolution
  - ✅ AI-Friendly: Clear structure for context loading

  💡 Key Principles

  1. Mirror Reality: Prompt structure matches project structure
  2. Progressive Detail: System → Package → Specific features
  3. Living Documentation: Scripts keep status current
  4. Simple Access: Just markdown files with a simple API
  5. Built-in Awareness: Structure itself conveys relationships

  This approach keeps all prompts centralized while maintaining clear awareness of the project structure and relationships!
