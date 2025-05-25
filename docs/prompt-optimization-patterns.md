# Prompt Optimization Patterns Guide

## Overview

This guide consolidates prompt optimization strategies from the migration guide and engineering patterns, providing actionable techniques for efficient Claude interactions.

## Core Optimization Principles

### 1. Minimal Context First
Start with the least context needed and progressively load more:
- **Initial**: CLAUDE.md (project overview)
- **Task-specific**: Only relevant documentation
- **Progressive**: Add context based on errors/questions

### 2. Mirror-Based Architecture
Leverage the natural project structure for intuitive prompt organization:
```
prompts/
├── system/          → System-wide understanding
├── packages/        → Mirrors actual package structure  
├── applications/    → Main application contexts
└── workflows/       → Cross-cutting processes
```

### 3. Keyword-Triggered Loading
Use specific keywords to automatically load relevant context.

## Efficient Prompting Patterns

### Pattern 1: Task-Focused Requests

**Instead of:**
```
"Fix the caching issue"
```

**Use:**
```
"The cache decorator in ReportGenerator isn't working - getting undefined results when using @Cacheable on generateReport method"
```

**Automatically loads:**
- package-catalog.md#cache
- architecture-reference.md#decorators
- Specific error context

### Pattern 2: Package-Specific Work

**Instead of:**
```
"Update the logging"
```

**Use:**
```
"Update the logger package to add JSON export format support"
```

**Benefits:**
- Loads exact package context
- Understands package boundaries
- Follows existing patterns

### Pattern 3: Progressive Problem Solving

**Start minimal:**
```
"Unit tests for ReportGenerator failing"
```

**Add context if needed:**
```
"Unit tests for ReportGenerator failing after adding event-system integration - getting 'Cannot inject IEventBus' error"
```

**Full context when required:**
```
"Unit tests for ReportGenerator failing after adding event-system integration:
- Error: 'Cannot inject IEventBus' 
- Added @Emits decorator to generateReport method
- IEventBus is registered in container
- Stack trace: [...]"
```

## Context Loading Strategies

### Strategy 1: Scope-Based Loading

```typescript
// System-level work
loadContext('system', ['architecture', 'dependencies', 'workflows']);

// Package-specific work  
loadContext('package', 'cache', ['overview', 'api', 'integration']);

// Workflow understanding
loadContext('workflow', 'report-generation');
```

### Strategy 2: Task-Type Loading

#### Bug Fixing
```
Required: error logs, affected file, related tests
Optional: recent commits, similar issues
```

#### Feature Development
```
Required: package API, integration points
Optional: similar features, patterns used
```

#### Package Creation
```
Required: decomposition guide, templates
Optional: similar packages, migration examples
```

### Strategy 3: Progressive Detail

1. **Overview** → What does this do?
2. **API** → How do I use it?
3. **Integration** → How does it connect?
4. **Status** → What's the current state?

## Optimization Techniques

### 1. Use Exact Names
- ❌ "the testing utilities"
- ✅ "test-helpers package"

### 2. Reference Specific Sections
- ❌ "check the architecture docs"
- ✅ "see architecture-reference.md#dependency-injection"

### 3. Batch Related Questions
```
"Working on cache package:
1. How to add Redis support?
2. Current TTL implementation?
3. Event system integration?"
```

### 4. Include Error Context
```
"Getting 'Cannot inject IEventBus' error when using @Emits decorator in ReportGenerator.ts:45
Stack: [full trace]
Recent: Added event decorators"
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

### 3. Context Overloading
- ❌ "Load all documentation"
- ❌ "Show me everything about packages"
- ❌ "I need the full project context"

## Quick Reference Patterns

### Package Operations
```
"Show [package-name] package details"
"How to use [package-name] in [service]"  
"Add [feature] to [package-name]"
```

### Development Tasks
```
"Create package for [purpose]"
"Extract [functionality] to shared package"
"Fix [specific issue] in [file/package]"
```

### Documentation
```
"Where is info about [topic]"
"Update [document] with [information]"
"Document [package-name] integration"
```

## Context-Aware Prompting

### Working on Packages
When mentioning a package, always use its exact name:
- cache (not caching)
- test-helpers (not test utilities)
- file-system (not file operations)

### Integration Work
Specify both sides of the integration:
```
"Integrate event-system with cache package for operation tracking"
```

### Migration Tasks
Include source and target:
```
"Extract validation logic from src/services/shared/ to new validation package"
```

## Implementation Timeline Patterns

For complex tasks, structure with timeline:

### Day-Based
```
Day 1-2: Setup and structure
Day 3-5: Core implementation
Week 2: Integration work
Week 3: Testing and refinement
```

### Phase-Based
```
Phase 1: Analysis and planning
Phase 2: Core development
Phase 3: Integration
Phase 4: Testing and documentation
```

## Workflow Optimization

### Report Generation Workflow
```
1. Trigger → Specify trigger type
2. Dependencies → List what's needed
3. Processing → Detail steps
4. Output → Define format
```

### Package Development Workflow
```
1. Requirements → Clear purpose
2. Structure → Follow templates
3. Implementation → Use patterns
4. Testing → Meet coverage
5. Integration → Update consumers
```

## Benefits of Optimized Prompting

### Performance
- ✅ Faster response times
- ✅ More accurate results
- ✅ Less back-and-forth

### Quality
- ✅ Follows project patterns
- ✅ Maintains consistency
- ✅ Reduces errors

### Efficiency
- ✅ Minimal context loading
- ✅ Targeted assistance
- ✅ Clear communication

## Advanced Patterns

### Pattern: Conditional Context
```
"If working with decorators, load decorator patterns
If error involves DI, load container setup
If creating package, load templates"
```

### Pattern: Incremental Refinement
```
1. Start with high-level goal
2. Add specific requirements
3. Include constraints
4. Define success criteria
```

### Pattern: Context Inheritance
```
System context → Package context → Feature context
Each level inherits from parent
```

## Summary

Effective prompting involves:
1. **Start specific** with exact names and locations
2. **Add context gradually** only as needed
3. **Use keywords** that trigger appropriate loading
4. **Batch related items** for efficiency
5. **Include concrete details** like errors and examples

The goal is maximum clarity with minimum context, ensuring Claude can provide accurate, targeted assistance while maintaining project patterns and conventions.

## Quick Checklist

Before submitting a prompt:
- [ ] Used exact package/file names?
- [ ] Included specific error messages?
- [ ] Referenced documentation sections?
- [ ] Provided concrete examples?
- [ ] Avoided vague descriptions?
- [ ] Batched related questions?
- [ ] Started with minimal context?

This optimization approach ensures efficient, accurate interactions with Claude while working on the H1B monorepo project.