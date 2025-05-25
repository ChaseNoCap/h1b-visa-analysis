# Prompt Engineering for Claude Code

## Overview

This guide provides context loading strategies and efficient prompting patterns for working with the H1B monorepo using Claude Code.

## Context Loading Strategies

### Minimal Context First
Start with the least context needed and load more as required:

1. **Project Overview**: Load CLAUDE.md first
2. **Task-Specific**: Load only relevant documentation
3. **Progressive Loading**: Add context based on errors or questions

### Context Triggers

Use these keyword patterns to load only relevant documentation:

#### Package Development
- **"working on [package] package"** → Load: `package-catalog.md#[package]`
- **"creating new package"** → Load: `developer-handbook.md`
- **"package decomposition"** → Load: `decomposition-guide.md`
- **"package migration"** → Load: `migration-guide.md`

#### Architecture & Design
- **"architecture decision"** → Load: `architecture-reference.md`
- **"DI pattern"** → Load: `architecture-reference.md#dependency-injection`
- **"testing strategy"** → Load: `architecture-reference.md#testing-approach`
- **"error handling"** → Load: `architecture-reference.md#error-handling`

#### Setup & Configuration
- **"GitHub Actions"** → Load: `setup-guide.md#github-actions`
- **"PAT token"** → Load: `setup-guide.md#personal-access-token`
- **"dependency setup"** → Load: `setup-guide.md#dependency-repository`
- **"environment setup"** → Load: `setup-guide.md#initial-setup`

#### Development Tasks
- **"naming convention"** → Load: `developer-handbook.md#naming-conventions`
- **"code review"** → Load: `developer-handbook.md#code-review-checklist`
- **"testing patterns"** → Load: `developer-handbook.md#testing-patterns`
- **"common mistakes"** → Load: `developer-handbook.md#common-mistakes`

## Efficient Prompting Patterns

### 1. Task-Focused Prompts
```
"I need to create a new package for PDF generation. 
It should convert markdown reports to PDF format."
```
**Loads**: developer-handbook.md, decomposition-guide.md

### 2. Debugging Prompts
```
"The cache decorator isn't working in my service. 
Getting undefined cache results."
```
**Loads**: package-catalog.md#cache, architecture-reference.md#decorators

### 3. Integration Prompts
```
"How do I integrate the event-system package 
into my existing service?"
```
**Loads**: package-catalog.md#event-system, architecture-reference.md#event-driven

### 4. Migration Prompts
```
"I want to extract the validation logic 
into a shared package."
```
**Loads**: migration-guide.md, decomposition-guide.md

## Context-Aware Instructions

### Working on Specific Packages

When working on a specific package, mention it explicitly:
- ❌ "Update the logging"
- ✅ "Update the logger package to add JSON export"

This ensures Claude loads the specific package context from package-catalog.md.

### Creating New Features

Be specific about the type of feature:
- ❌ "Add caching"
- ✅ "Add method-level caching using the cache package decorators"

This loads the relevant package documentation and patterns.

### Solving Problems

Include context about what you've tried:
- ❌ "Tests are failing"
- ✅ "Unit tests for ReportGenerator are failing after adding event-system integration"

This helps Claude understand which documentation to reference.

## Documentation Map

### Core Documentation (12 files)
1. **decomposition-guide.md** - Package design principles
2. **migration-guide.md** - Step-by-step extraction
3. **package-catalog.md** - All package details
4. **developer-handbook.md** - Templates & guidelines
5. **setup-guide.md** - Environment configuration
6. **architecture-reference.md** - Technical patterns
7. **achievements.md** - Project milestones
8. **prompt-engineering.md** - This guide
9. **index.md** - Documentation hub
10. **github-repositories.md** - Repo links
11. **claude-md-template.md** - Package template
12. **claude-md-guide.md** - CLAUDE.md best practices

### Context Loading Priority

#### High Priority (Always relevant)
- CLAUDE.md (main project context)
- architecture-reference.md (patterns)

#### Medium Priority (Task-specific)
- package-catalog.md (when working on packages)
- developer-handbook.md (when creating code)
- setup-guide.md (when configuring)

#### Low Priority (Reference only)
- achievements.md (historical context)
- github-repositories.md (external links)

## Optimization Techniques

### 1. Use Package Names
Instead of describing functionality, use exact package names:
- ❌ "the testing utilities"
- ✅ "test-helpers package"

### 2. Reference Specific Sections
Point to exact documentation sections:
- ❌ "check the architecture docs"
- ✅ "see architecture-reference.md#dependency-injection"

### 3. Batch Related Questions
Ask multiple related questions together:
```
"I'm working on the cache package:
1. How do I add Redis support?
2. What's the current TTL implementation?
3. How does it integrate with events?"
```

### 4. Provide Error Context
Include specific error messages and stack traces:
```
"Getting 'Cannot inject IEventBus' error when using 
@Emits decorator in ReportGenerator. Full error: [...]"
```

## Anti-Patterns to Avoid

### 1. Vague Requests
- ❌ "Fix the bug"
- ❌ "Make it better"
- ❌ "Update the code"

### 2. Missing Context
- ❌ "Why doesn't this work?"
- ❌ "The test fails"
- ❌ "Getting an error"

### 3. Overloading Context
- ❌ "Load all documentation"
- ❌ "I need everything about the project"
- ❌ "Show me all packages"

## Quick Reference Commands

### Package Operations
- **List packages**: "Show package summary from package-catalog.md"
- **Package details**: "Show details for [package-name] package"
- **Package usage**: "How to use [package-name] in my service"

### Development Tasks
- **Create package**: "Create new package for [purpose]"
- **Add feature**: "Add [feature] to [package-name]"
- **Fix issue**: "Fix [specific issue] in [file/package]"

### Documentation
- **Find info**: "Where is information about [topic]"
- **Update docs**: "Update [document] with [information]"
- **Create guide**: "Create guide for [specific task]"

## Context Loading Examples

### Example 1: New Developer
```
"I'm new to this project and need to understand 
the architecture and how to contribute."
```
**Loads**: CLAUDE.md, architecture-reference.md, developer-handbook.md

### Example 2: Bug Fix
```
"The MockLogger in test-mocks package isn't tracking 
child logger calls correctly."
```
**Loads**: package-catalog.md#test-mocks, specific package files

### Example 3: Feature Addition
```
"Add performance monitoring to all service methods 
using the event-system decorators."
```
**Loads**: package-catalog.md#event-system, architecture-reference.md#decorators

## Best Practices

1. **Start Specific**: Begin with specific package or file names
2. **Add Context Gradually**: Load more docs only if needed
3. **Use Keywords**: Leverage trigger words for automatic loading
4. **Reference Sections**: Point to specific parts of documents
5. **Batch Questions**: Group related queries together

## Summary

Efficient prompting with Claude Code involves:
- Starting with minimal context
- Using specific package and file names
- Leveraging keyword triggers
- Providing clear, focused requests
- Loading additional context only as needed

This approach ensures faster responses and more accurate assistance while working with the H1B monorepo.

---

*This guide helps optimize your interactions with Claude Code for maximum efficiency and accuracy.*