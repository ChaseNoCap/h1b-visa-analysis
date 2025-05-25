# Prompt Migration Guide - XML-Enhanced Edition

## Core Concept

<concept>
  <principle>Central prompts repo → Mirrors project structure → Each folder maps to a package/component → Built-in system awareness</principle>
  <benefits>
    <benefit>Single source of truth for all prompts</benefit>
    <benefit>Structure conveys relationships</benefit>
    <benefit>Easy navigation and discovery</benefit>
    <benefit>Version controlled prompt evolution</benefit>
  </benefits>
</concept>

## Prompts Package Structure

```xml
<package_structure>
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
</package_structure>
```

## Prompt File Examples

### System Architecture Prompt (XML-Enhanced)

```xml
<!-- src/system/architecture.md -->
<system_architecture>
  <overview>
    This monorepo implements a report generation system with decomposed packages
  </overview>
  
  <packages>
    <category name="Core Infrastructure">
      <package name="logger">
        <purpose>Structured logging with Winston</purpose>
        <status>Published to GitHub Packages</status>
      </package>
      <package name="di-framework">
        <purpose>Dependency injection container</purpose>
        <status>Local workspace</status>
      </package>
      <package name="cache">
        <purpose>Caching decorators with TTL</purpose>
        <status>Shared between applications</status>
      </package>
      <package name="file-system">
        <purpose>File operations abstraction</purpose>
        <status>Production ready</status>
      </package>
      <package name="event-system">
        <purpose>Event-driven debugging</purpose>
        <status>Optional peer dependency</status>
      </package>
    </category>
    
    <category name="Testing">
      <package name="test-helpers">
        <purpose>Shared test utilities</purpose>
        <coverage>91.89%</coverage>
      </package>
      <package name="test-mocks">
        <purpose>Mock implementations</purpose>
        <coverage>100%</coverage>
      </package>
    </category>
    
    <category name="Applications">
      <package name="h1b-visa-analysis">
        <purpose>Main report generator</purpose>
        <type>Primary application</type>
      </package>
      <package name="markdown-compiler">
        <purpose>Markdown processing</purpose>
        <type>External dependency</type>
      </package>
      <package name="report-components">
        <purpose>H1B content</purpose>
        <type>External dependency</type>
      </package>
    </category>
  </packages>
  
  <dependency_flow>
    Applications → Core Packages → No Dependencies
         ↓              ↓
    Test Packages ← Test Interfaces
  </dependency_flow>
  
  <principles>
    <principle>Single responsibility per package</principle>
    <principle>&lt;2000 lines per package (target &lt;1000)</principle>
    <principle>Test in isolation</principle>
    <principle>Clear dependency direction</principle>
  </principles>
</system_architecture>
```

### Package-Specific Prompt (XML-Enhanced)

```xml
<!-- src/packages/cache/overview.md -->
<package_overview name="cache">
  <metadata>
    <version>1.1.0</version>
    <coverage>94.79%</coverage>
    <size>~400 lines</size>
    <status>stable</status>
  </metadata>
  
  <purpose>
    Provides caching functionality through decorators, shared between h1b-visa-analysis and markdown-compiler
  </purpose>
  
  <features>
    <feature>@Cacheable decorator for method caching</feature>
    <feature>@InvalidateCache decorator for cache invalidation</feature>
    <feature>MemoryCache with TTL support</feature>
    <feature>Integration with logger for operation tracking</feature>
  </features>
  
  <usage_example>
    <![CDATA[
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
    ]]>
  </usage_example>
  
  <consumers>
    <consumer>h1b-visa-analysis</consumer>
    <consumer>markdown-compiler</consumer>
  </consumers>
</package_overview>
```

### Workflow Prompt (XML-Enhanced)

```xml
<!-- src/workflows/report-generation.md -->
<workflow name="report_generation">
  <overview>
    Complete flow for generating H1B analysis reports
  </overview>
  
  <steps>
    <step order="1">
      <name>Trigger</name>
      <triggers>
        <trigger>Push to main branch</trigger>
        <trigger>Manual dispatch</trigger>
        <trigger>Dependency update</trigger>
      </triggers>
    </step>
    
    <step order="2">
      <name>Context Loading</name>
      <actions>
        <action>Load prompts from prompts-shared</action>
        <action>Load memory bank</action>
        <action>Validate environment</action>
      </actions>
    </step>
    
    <step order="3">
      <name>Dependency Check</name>
      <validations>
        <validation required="true">prompts-shared available</validation>
        <validation required="true">markdown-compiler available</validation>
        <validation required="true">report-components available</validation>
      </validations>
    </step>
    
    <step order="4">
      <name>Content Processing</name>
      <substeps>
        <substep>Fetch prompts from prompts-shared</substep>
        <substep>Get content from report-components</substep>
        <substep>Load markdown-compiler</substep>
      </substeps>
    </step>
    
    <step order="5">
      <name>Report Generation</name>
      <substeps>
        <substep>Apply prompts to content</substep>
        <substep>Compile markdown</substep>
        <substep>Format using report-templates</substep>
      </substeps>
    </step>
    
    <step order="6">
      <name>Output</name>
      <result>Generated report in dist/</result>
    </step>
  </steps>
  
  <integration_points>
    <integration>ReportGenerator orchestrates the flow</integration>
    <integration>Uses DI for all service dependencies</integration>
    <integration>Logs all operations via logger</integration>
    <integration>Caches compiled templates</integration>
    <integration>Emits events for debugging</integration>
  </integration_points>
</workflow>
```

## Implementation Plan (XML-Structured)

<implementation_plan>
  <phase number="1" name="Structure Setup">
    <tasks>
      <task id="1.1" name="Create Mirror Structure">
        <description>Validate prompt structure matches project</description>
        <code><![CDATA[
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
        ]]></code>
      </task>
      
      <task id="1.2" name="Initial Population">
        <description>Create prompts for each existing package</description>
        <script><![CDATA[
# Create prompts for each existing package
for package in packages/*; do
  pkg_name=$(basename $package)
  mkdir -p src/packages/$pkg_name
  cp templates/package-*.md src/packages/$pkg_name/
done
        ]]></script>
      </task>
    </tasks>
  </phase>
  
  <phase number="2" name="Content Development">
    <tasks>
      <task id="2.1" name="System-Level Prompts">
        <items>
          <item>Architecture overview</item>
          <item>Dependency relationships</item>
          <item>System workflows</item>
          <item>Progress tracking</item>
        </items>
      </task>
      
      <task id="2.2" name="Package-Level Prompts">
        <template>
          <item>Overview (purpose, features)</item>
          <item>API (how to use)</item>
          <item>Integration (how it connects)</item>
          <item>Status (version, coverage, state)</item>
        </template>
      </task>
      
      <task id="2.3" name="Workflow Prompts">
        <items>
          <item>Report generation</item>
          <item>Testing strategy</item>
          <item>Development patterns</item>
          <item>Deployment process</item>
        </items>
      </task>
    </tasks>
  </phase>
  
  <phase number="3" name="Automation">
    <tasks>
      <task id="3.1" name="Status Updates">
        <code><![CDATA[
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
        ]]></code>
      </task>
      
      <task id="3.2" name="Context Building">
        <code><![CDATA[
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
        ]]></code>
      </task>
    </tasks>
  </phase>
  
  <phase number="4" name="Simple API">
    <tasks>
      <task id="4.1" name="Index.ts">
        <code><![CDATA[
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
        ]]></code>
      </task>
    </tasks>
  </phase>
  
  <phase number="5" name="Usage Patterns">
    <examples>
      <example name="In Report Generator">
        <code><![CDATA[
import { getPackagePrompts, getWorkflowPrompts } from '@myorg/prompts';

// Load report generation workflow understanding
const workflow = getWorkflowPrompts()['report-generation'];

// Load specific package context
const cacheContext = getPackagePrompts('cache');
        ]]></code>
      </example>
      
      <example name="For AI Context">
        <code><![CDATA[
// Load full system understanding
const systemContext = getSystemPrompts();
const architecture = systemContext.architecture;
const dependencies = systemContext.dependencies;

// Load specific package details
const loggerPrompts = getPackagePrompts('logger');
        ]]></code>
      </example>
      
      <example name="For Development">
        <code><![CDATA[
// Understand how packages work together
const cacheIntegration = getPrompt('packages/cache/integration.md');
const fileSystemIntegration = getPrompt('packages/file-system/integration.md');
        ]]></code>
      </example>
    </examples>
  </phase>
</implementation_plan>

## Context Loading Strategies

<context_strategies>
  <strategy name="Progressive Loading">
    <level depth="1">
      <load>CLAUDE.md</load>
      <purpose>Project overview</purpose>
    </level>
    <level depth="2" condition="needs_package_info">
      <load>package-catalog.md#{{package}}</load>
      <purpose>Package details</purpose>
    </level>
    <level depth="3" condition="needs_implementation">
      <load>packages/{{package}}/src/</load>
      <purpose>Implementation details</purpose>
    </level>
  </strategy>
  
  <strategy name="Task-Based Loading">
    <task_type name="bug_fix">
      <required>
        <load>error logs</load>
        <load>affected file</load>
        <load>related tests</load>
      </required>
      <optional>
        <load>recent commits</load>
        <load>similar issues</load>
      </optional>
    </task_type>
    
    <task_type name="feature_development">
      <required>
        <load>package API</load>
        <load>integration points</load>
      </required>
      <optional>
        <load>similar features</load>
        <load>patterns used</load>
      </optional>
    </task_type>
  </strategy>
  
  <strategy name="Keyword Triggers">
    <triggers category="package_work">
      <trigger pattern="working on {{package}} package">
        <load>package-catalog.md#{{package}}</load>
        <load>packages/{{package}}/CLAUDE.md</load>
      </trigger>
      <trigger pattern="creating new package">
        <load>developer-handbook.md</load>
        <load>decomposition-guide.md</load>
      </trigger>
    </triggers>
  </strategy>
</context_strategies>

## Optimization Patterns

<optimization_patterns>
  <pattern name="Exact Names">
    <bad>the testing utilities</bad>
    <good>test-helpers package</good>
  </pattern>
  
  <pattern name="Specific References">
    <bad>check the architecture docs</bad>
    <good>see architecture-reference.md#dependency-injection</good>
  </pattern>
  
  <pattern name="Batched Questions">
    <example><![CDATA[
Working on cache package:
1. How to add Redis support?
2. Current TTL implementation?
3. Event system integration?
    ]]></example>
  </pattern>
  
  <pattern name="Error Context">
    <example><![CDATA[
Getting 'Cannot inject IEventBus' error when using @Emits decorator in ReportGenerator.ts:45
Stack: [full trace]
Recent: Added event decorators
    ]]></example>
  </pattern>
</optimization_patterns>

## Implementation Timeline

<timeline>
  <milestone week="1">
    <days range="1-2">Set up package structure mirroring project</days>
    <days range="3-5">Write system-level prompts</days>
  </milestone>
  
  <milestone week="2">
    <task>Create prompts for all packages</task>
  </milestone>
  
  <milestone week="3">
    <task>Develop workflow prompts</task>
  </milestone>
  
  <milestone week="4">
    <task>Build automation scripts</task>
  </milestone>
  
  <milestone week="5">
    <task>Test and refine</task>
  </milestone>
</timeline>

## Benefits of This Approach

<benefits>
  <benefit icon="✅">Single Source of Truth: All prompts in one place</benefit>
  <benefit icon="✅">Structure Awareness: Mirrors actual project structure</benefit>
  <benefit icon="✅">Easy Navigation: Find prompts where you'd expect them</benefit>
  <benefit icon="✅">Simple API: Just read markdown files</benefit>
  <benefit icon="✅">Version Controlled: Track prompt evolution</benefit>
  <benefit icon="✅">AI-Friendly: Clear structure for context loading</benefit>
  <benefit icon="✅">XML-Enhanced: Structured, parseable prompts</benefit>
</benefits>

## Key Principles

<principles>
  <principle order="1">
    <name>Mirror Reality</name>
    <description>Prompt structure matches project structure</description>
  </principle>
  
  <principle order="2">
    <name>Progressive Detail</name>
    <description>System → Package → Specific features</description>
  </principle>
  
  <principle order="3">
    <name>Living Documentation</name>
    <description>Scripts keep status current</description>
  </principle>
  
  <principle order="4">
    <name>Simple Access</name>
    <description>Just markdown files with a simple API</description>
  </principle>
  
  <principle order="5">
    <name>Built-in Awareness</name>
    <description>Structure itself conveys relationships</description>
  </principle>
  
  <principle order="6">
    <name>XML Structure</name>
    <description>Use XML for clear, parseable context</description>
  </principle>
</principles>

## Quick Reference

<quick_reference>
  <commands>
    <command purpose="List packages">Show package summary from package-catalog.md</command>
    <command purpose="Package details">Show details for [package-name] package</command>
    <command purpose="Package usage">How to use [package-name] in my service</command>
    <command purpose="Create package">Create new package for [purpose]</command>
    <command purpose="Add feature">Add [feature] to [package-name]</command>
    <command purpose="Fix issue">Fix [specific issue] in [file/package]</command>
  </commands>
  
  <anti_patterns>
    <avoid reason="Too vague">Fix the bug</avoid>
    <avoid reason="Missing context">Why doesn't this work?</avoid>
    <avoid reason="Context overload">Load all documentation</avoid>
  </anti_patterns>
  
  <best_practices>
    <practice>Use exact package names</practice>
    <practice>Reference specific sections</practice>
    <practice>Batch related questions</practice>
    <practice>Include error context</practice>
    <practice>Start with minimal context</practice>
  </best_practices>
</quick_reference>

## Summary

This XML-enhanced prompt migration approach:
- Keeps all prompts centralized while maintaining clear project structure awareness
- Uses XML for structured, parseable context that Claude can systematically process
- Provides progressive loading strategies to minimize context overhead
- Includes automation for keeping prompts current with project state
- Offers clear patterns for efficient prompting and context loading

The combination of mirror-based architecture and XML structure ensures maximum clarity and efficiency in prompt engineering for the H1B monorepo project.