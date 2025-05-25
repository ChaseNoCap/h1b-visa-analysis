# XML-Structured Prompt Engineering Guide

## Overview

This guide consolidates XML best practices for writing effective prompts with Claude. XML structure provides clear, parseable context that Claude can understand and follow systematically.

## XML Structure Fundamentals

### Basic XML Tags for Prompts

```xml
<task>
  Define the specific task or objective
</task>

<context>
  Provide relevant background information
</context>

<constraints>
  List any limitations or requirements
</constraints>

<examples>
  <example>
    Show concrete examples of desired output
  </example>
</examples>

<output_format>
  Specify the expected format of the response
</output_format>
```

### Hierarchical Context Loading

```xml
<system_context>
  <architecture>
    Overall system design and patterns
  </architecture>
  <dependencies>
    System-wide dependency relationships
  </dependencies>
  <workflows>
    How components work together
  </workflows>
  <progress>
    Current system state and status
  </progress>
</system_context>

<package_context package="cache">
  <overview>
    Purpose and key features
  </overview>
  <api>
    How to use the package
  </api>
  <integration>
    How it connects with other packages
  </integration>
  <status>
    Version, coverage, current state
  </status>
</package_context>
```

### Structured Task Definitions

```xml
<task_definition>
  <objective>
    Create a new caching decorator for Redis support
  </objective>
  
  <requirements>
    <requirement priority="high">
      Maintain compatibility with existing @Cacheable decorator
    </requirement>
    <requirement priority="medium">
      Support TTL configuration
    </requirement>
    <requirement priority="low">
      Add metrics collection
    </requirement>
  </requirements>
  
  <constraints>
    <constraint>Package must remain under 1000 lines</constraint>
    <constraint>Follow existing decorator patterns</constraint>
    <constraint>Maintain 90%+ test coverage</constraint>
  </constraints>
  
  <success_criteria>
    <criterion>All tests pass</criterion>
    <criterion>No breaking changes to API</criterion>
    <criterion>Documentation updated</criterion>
  </success_criteria>
</task_definition>
```

## Advanced XML Patterns

### Conditional Context Loading

```xml
<context_loader>
  <when condition="working_on_package">
    <load>package-catalog.md#{{package_name}}</load>
    <load>packages/{{package_name}}/CLAUDE.md</load>
  </when>
  
  <when condition="creating_new_package">
    <load>developer-handbook.md</load>
    <load>decomposition-guide.md</load>
    <load>migration-guide.md</load>
  </when>
  
  <when condition="debugging">
    <load>architecture-reference.md</load>
    <load_if_exists>logs/error.log</load_if_exists>
  </when>
</context_loader>
```

### Workflow Definitions

```xml
<workflow name="report_generation">
  <step order="1">
    <name>Trigger</name>
    <description>Push to main, manual dispatch, or dependency update</description>
  </step>
  
  <step order="2">
    <name>Context Loading</name>
    <actions>
      <action>Load prompts from prompts-shared</action>
      <action>Load memory bank</action>
    </actions>
  </step>
  
  <step order="3">
    <name>Dependency Check</name>
    <validation>
      <check>prompts-shared available</check>
      <check>markdown-compiler available</check>
      <check>report-components available</check>
    </validation>
  </step>
  
  <step order="4">
    <name>Report Generation</name>
    <substeps>
      <substep>Apply prompts to content</substep>
      <substep>Compile markdown</substep>
      <substep>Format using templates</substep>
    </substeps>
  </step>
</workflow>
```

### Error Context Structure

```xml
<error_context>
  <error_message>
    Cannot inject IEventBus into ReportGenerator
  </error_message>
  
  <stack_trace>
    <!-- Include relevant stack trace -->
  </stack_trace>
  
  <context>
    <file>src/services/ReportGenerator.ts</file>
    <line>45</line>
    <recent_changes>
      Added @Emits decorator to generateReport method
    </recent_changes>
  </context>
  
  <attempted_solutions>
    <solution>Verified IEventBus is registered in container</solution>
    <solution>Checked import statements</solution>
  </attempted_solutions>
</error_context>
```

## Package-Specific XML Prompts

### Package Overview Template

```xml
<package name="{{package_name}}">
  <metadata>
    <version>1.0.0</version>
    <coverage>95%</coverage>
    <size>~500 lines</size>
    <status>stable</status>
  </metadata>
  
  <purpose>
    Single-line description of what this package does
  </purpose>
  
  <features>
    <feature>Key feature 1</feature>
    <feature>Key feature 2</feature>
  </features>
  
  <dependencies>
    <dependency>inversify</dependency>
    <dependency optional="true">winston</dependency>
  </dependencies>
  
  <exports>
    <export type="interface">ICache</export>
    <export type="decorator">@Cacheable</export>
    <export type="class">MemoryCache</export>
  </exports>
</package>
```

### Integration Context

```xml
<integration_context package="cache">
  <integrates_with>
    <package name="file-system">
      <interaction>Caches file read operations</interaction>
    </package>
    <package name="logger">
      <interaction>Logs cache hits/misses</interaction>
    </package>
  </integrates_with>
  
  <used_by>
    <application>h1b-visa-analysis</application>
    <application>markdown-compiler</application>
  </used_by>
  
  <patterns>
    <pattern>Decorator-based caching</pattern>
    <pattern>TTL support</pattern>
    <pattern>LRU eviction</pattern>
  </patterns>
</integration_context>
```

## Testing Context Structure

```xml
<test_context>
  <test_type>unit</test_type>
  
  <setup>
    <mock>ILogger</mock>
    <mock>IFileSystem</mock>
    <fixture>test-data.json</fixture>
  </setup>
  
  <test_cases>
    <test name="should cache method results">
      <arrange>
        Create service with @Cacheable decorator
      </arrange>
      <act>
        Call method twice with same parameters
      </act>
      <assert>
        Method executed only once
      </assert>
    </test>
  </test_cases>
  
  <coverage_requirements>
    <statements>90%</statements>
    <branches>85%</branches>
    <functions>90%</functions>
  </coverage_requirements>
</test_context>
```

## Migration and Decomposition XML

```xml
<migration_plan>
  <source>
    <location>src/services/shared/validation.ts</location>
    <size>~300 lines</size>
    <dependencies>
      <dependency>zod</dependency>
      <dependency>@types/node</dependency>
    </dependencies>
  </source>
  
  <target>
    <package_name>validation</package_name>
    <location>packages/validation</location>
    <type>shared utility</type>
  </target>
  
  <steps>
    <step order="1">
      <action>Create package structure</action>
      <commands>
        <command>mkdir -p packages/validation/src</command>
        <command>cp templates/package.json packages/validation/</command>
      </commands>
    </step>
    
    <step order="2">
      <action>Extract interfaces</action>
      <files>
        <file>IValidator.ts</file>
        <file>IValidationResult.ts</file>
      </files>
    </step>
    
    <step order="3">
      <action>Move implementation</action>
      <validations>
        <validation>All imports resolved</validation>
        <validation>No circular dependencies</validation>
      </validations>
    </step>
  </steps>
</migration_plan>
```

## Prompt Engineering Best Practices with XML

### 1. Progressive Detail Loading

```xml
<context_loading strategy="progressive">
  <level depth="1">
    <load>CLAUDE.md</load>
    <purpose>Project overview</purpose>
  </level>
  
  <level depth="2" condition="needs_architecture">
    <load>architecture-reference.md</load>
    <purpose>Technical patterns</purpose>
  </level>
  
  <level depth="3" condition="working_on_specific_package">
    <load>package-catalog.md#{{package}}</load>
    <purpose>Package details</purpose>
  </level>
</context_loading>
```

### 2. Task-Specific Context

```xml
<task_context type="bug_fix">
  <required_context>
    <load>error logs</load>
    <load>affected file</load>
    <load>related tests</load>
  </required_context>
  
  <optional_context>
    <load>recent commits</load>
    <load>similar fixed issues</load>
  </optional_context>
</task_context>
```

### 3. Output Format Specifications

```xml
<output_specification>
  <format>TypeScript code</format>
  
  <requirements>
    <requirement>Use dependency injection</requirement>
    <requirement>Include JSDoc comments</requirement>
    <requirement>Follow existing patterns</requirement>
  </requirements>
  
  <structure>
    <imports>
      Group by external, internal, types
    </imports>
    <class_definition>
      Use @injectable decorator
    </class_definition>
    <methods>
      Include error handling
    </methods>
  </structure>
</output_specification>
```

## XML Context Triggers

### Package Development Triggers

```xml
<triggers category="package_development">
  <trigger keyword="working on {{package}} package">
    <load>package-catalog.md#{{package}}</load>
    <load>packages/{{package}}/CLAUDE.md</load>
  </trigger>
  
  <trigger keyword="creating new package">
    <load>developer-handbook.md</load>
    <load>decomposition-guide.md</load>
    <load>package-creation-checklist.md</load>
  </trigger>
  
  <trigger keyword="package decomposition">
    <load>decomposition-guide.md</load>
    <load>decomposition-principles.md</load>
  </trigger>
</triggers>
```

### Architecture Triggers

```xml
<triggers category="architecture">
  <trigger keyword="architecture decision">
    <load>architecture-reference.md</load>
  </trigger>
  
  <trigger keyword="DI pattern">
    <load>architecture-reference.md#dependency-injection</load>
    <load>packages/di-framework/CLAUDE.md</load>
  </trigger>
  
  <trigger keyword="testing strategy">
    <load>architecture-reference.md#testing-approach</load>
    <load>packages/test-helpers/CLAUDE.md</load>
  </trigger>
</triggers>
```

## Summary

XML structure provides Claude with:
- **Clear hierarchy** of information
- **Explicit relationships** between concepts
- **Parseable context** for systematic processing
- **Conditional logic** for smart context loading
- **Structured workflows** for complex tasks

Always use XML when you need:
- Structured data representation
- Clear task definitions
- Complex workflow descriptions
- Conditional context loading
- Precise output specifications

This structured approach ensures Claude can understand and follow your requirements systematically, leading to more accurate and helpful responses.