# Next Steps Quick Reference

## 🚀 Immediate Action Items

### 1. Complete Test Package Integration (NOW)
```bash
# In main project
npm install # Ensure packages are linked

# Update imports in tests
# FROM: import { mockLogger } from './mocks';
# TO:   import { MockLogger } from '@h1b/test-mocks';
```

Key files to update:
- `/tests/unit/services/DependencyChecker.test.ts`
- `/tests/e2e/missing-dependencies.test.ts`
- `/tests/setup.ts`

### 2. Start @h1b/logger Package (NEXT)

#### Quick Setup Commands
```bash
# Create structure
mkdir -p packages/logger/src/{interfaces,implementations,decorators}
mkdir -p packages/logger/tests

# Copy template files
cp packages/test-mocks/package.json packages/logger/
cp packages/test-mocks/tsconfig.json packages/logger/
cp packages/test-mocks/vitest.config.ts packages/logger/
cp docs/claude-md-template.md packages/logger/CLAUDE.md

# Edit package.json name and description
```

#### What to Extract
From `/src/core/interfaces/ILogger.ts`:
- ILogger interface
- ILogContext interface

From `/src/services/WinstonLogger.ts`:
- WinstonLogger implementation
- Logger configuration

From markdown-compiler (if accessible):
- LogMethod decorator

## 📋 Package Creation Checklist

- [ ] Create directory structure
- [ ] Initialize package.json
- [ ] Set up TypeScript config
- [ ] Create CLAUDE.md from template
- [ ] Define main interface
- [ ] Implement functionality
- [ ] Write comprehensive tests
- [ ] Create README with examples
- [ ] Build and verify
- [ ] Update consuming projects

## 🎯 Key Principles to Remember

1. **Single Purpose**: One reason to exist
2. **Small Size**: <500 lines is ideal
3. **Clear Name**: Name explains everything
4. **Minimal Deps**: 2-3 maximum
5. **Test First**: Write tests alongside code

## 📚 Essential Documentation

- **Current Status**: `/docs/decomposition-progress.md`
- **Overall Plan**: `/docs/migration-plan.md`
- **Design Rules**: `/docs/decomposition-principles.md`
- **Package Template**: `/docs/claude-md-template.md`

## 🔧 Useful Commands

```bash
# Build all packages
npm run build:all

# Test all packages
npm run test:all

# Check specific package
cd packages/[package-name]
npm run build
npm run test
npm run coverage

# Link packages locally
npm link # in package directory
npm link @h1b/[package-name] # in consuming project
```

## ⚡ Pro Tips

1. **Document First**: Write CLAUDE.md before coding
2. **Export Minimal**: Only export what's needed
3. **Hide Implementation**: Keep internals private
4. **Test Everything**: Aim for 95%+ coverage
5. **Stay Focused**: Resist scope creep

## 🚦 Decision Points

### When to Split a Package
- Using "and" to describe it
- Over 500 lines of code
- Multiple unrelated exports
- Different reasons to change

### When to Keep Together
- Always change together
- Under 300 lines total
- Single cohesive purpose
- Would create circular deps if split

## 🎬 Next Package Preview

### @h1b/logger (Week 1)
- **Size**: ~300 lines
- **Exports**: ILogger, createLogger, LogMethod
- **Dependencies**: winston, winston-daily-rotate-file

### @h1b/di-framework (Week 2)
- **Size**: ~400 lines
- **Exports**: Base interfaces, container helpers
- **Dependencies**: inversify, reflect-metadata

---

**Remember**: Small, focused packages are easier to understand, test, and maintain!