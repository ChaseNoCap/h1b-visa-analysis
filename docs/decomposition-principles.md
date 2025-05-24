# Decomposition Principles

## Core Philosophy

**Every package should have exactly one reason to exist and one reason to change.**

## The Five Principles

### 1. Single Purpose
Each package solves ONE specific problem well.

✅ **Good**: `logger` - Only handles logging
❌ **Bad**: `utils` - Grab bag of unrelated utilities

### 2. Clear Boundaries
A package's name should tell you exactly what it does.

✅ **Good**: `markdown-processor` - Processes markdown
❌ **Bad**: `core` - What does "core" even mean?

### 3. Size Limits
Keep packages small and focused.

**Rules of thumb:**
- < 10 source files
- < 1000 lines of code
- < 5 public exports
- If explaining takes > 1 paragraph, split it

### 4. Dependency Direction
Dependencies flow from specific → general.

```
report-generator → markdown-compiler → file-system → logger
     (app)            (feature)         (utility)    (infra)
```

### 5. Test in Isolation
If you can't test it without mocking half the world, it's too coupled.

## When to Split

### Split When:
- Two features change for different reasons
- You're using "and" to describe what it does
- Different teams would own different parts
- One part is useful without the other

### Keep Together When:
- They always change together
- Splitting creates circular dependencies
- The abstraction would be forced/artificial
- Combined size is still < 1000 lines

## Naming Conventions

### Package Names
- Use kebab-case: `markdown-compiler`
- Be specific: `file-reader` not `io`
- Avoid generic terms: `core`, `common`, `shared`, `utils`
- Name the behavior, not the pattern: `logger` not `logging-service`

### Interface Names
- Start with `I`: `ILogger`, `ICache`
- Match the behavior: `IReadable`, `IWritable`
- Avoid implementation details: `ILogger` not `IWinstonLogger`

## Examples

### Good Decomposition
```
logger          - Logging infrastructure
cache           - Caching implementations
file-system     - File operations
markdown-parser - Parse markdown to AST
html-renderer   - Render AST to HTML
```

Each has one clear purpose, can be tested independently, and could be published separately.

For real examples from our monorepo, see:
- [Testing Package Implementation](./testing-package-implementation.md#package-structure) - How we split testing into focused packages
- [Migration Plan](./migration-plan.md#shared-packages-architecture) - Our actual package structure

### Bad Decomposition
```
core           - ??? (too vague)
helpers        - Mixed utilities (no focus)
markdown       - Parse AND render AND compile (too much)
services       - Multiple unrelated services (grab bag)
```

## Anti-Patterns

### 1. The Kitchen Sink
```typescript
// ❌ utils
export { formatDate } from './date';
export { readFile } from './file';
export { Logger } from './logger';
export { cache } from './cache';
```

### 2. The God Package
```typescript
// ❌ markdown - Does everything
export class MarkdownProcessor {
  parse() { }
  render() { }
  compile() { }
  validate() { }
  transform() { }
  optimize() { }
}
```

### 3. The Anemic Package
```typescript
// ❌ constants - Just data, no behavior
export const API_KEY = '...';
export const TIMEOUT = 5000;
```

### 4. The Circular Dependency
```typescript
// ❌ These packages depend on each other
// auth → user → auth
```

## Quick Decision Tree

1. **Can you describe it in one sentence without "and"?**
   - No → Split it

2. **Would someone use just part of it?**
   - Yes → Split that part out

3. **Do different parts change for different reasons?**
   - Yes → Split them

4. **Is it over 1000 lines?**
   - Yes → Find a natural split point

5. **Are you creating 3+ levels of folders?**
   - Yes → Top folders should be packages

## Implementation Checklist

When creating a new package:
- [ ] Has exactly one purpose
- [ ] Name clearly indicates that purpose
- [ ] No circular dependencies
- [ ] Can be tested in isolation
- [ ] Under 1000 lines of code
- [ ] Has a focused public API (< 5 exports)
- [ ] Could theoretically be published to npm as-is

See [Implementation Roadmap](./implementation-roadmap.md#review-checkpoints) for how we apply these principles at each phase of the migration.

## Remember

**It's easier to combine two packages later than to split one package.**

When in doubt, keep them separate. You can always create a facade package that combines them if needed.