# H1B Visa Analysis Documentation Hub

Welcome to the H1B Visa Analysis project documentation. This guide helps you find the right documentation based on what you're trying to accomplish.

## 🚀 Quick Start

### I want to...

#### **Generate an H1B Report**
1. [Automation Setup](./automation-setup.md) - Configure GitHub Actions
2. Run `npm run build` to generate locally

#### **Understand the Project**
1. [README](/README.md) - High-level overview
2. [CLAUDE.md](/CLAUDE.md) - AI assistant context

#### **Set Up Development**
1. Clone the repository
2. Run `npm install`
3. Follow [Automation Setup](./automation-setup.md) for GitHub integration

## 👥 Documentation by Role

### For Developers

#### Getting Started
- [README](/README.md) - Project overview and quick start
- [Automation Setup](./automation-setup.md) - GitHub Actions configuration

#### Architecture & Design
- [CLAUDE.md](/CLAUDE.md) - Current TypeScript/DI architecture
- [Decomposition Progress](./decomposition-progress.md) - **NEW** Current status and next steps
- [Migration Plan](./migration-plan.md) - Monorepo decomposition strategy
- [Testing Package Implementation](./testing-package-implementation.md) - ✅ Completed

#### Implementation Guides
- [CLAUDE.md Template](./claude-md-template.md) - For new packages
- [CLAUDE.md Guide](./claude-md-guide.md) - Best practices

### For Architects

#### Strategic Planning
- [Decomposition Progress](./decomposition-progress.md) - **Current Status Dashboard**
- [Migration Plan](./migration-plan.md) - Full decomposition strategy
- [Decomposition Principles](./decomposition-principles.md) - Core design principles
- [Testing Package Implementation](./testing-package-implementation.md) - ✅ First success story

#### Package Status
- [@h1b/test-mocks](../packages/test-mocks/CLAUDE.md) - ✅ Complete
- [@h1b/test-helpers](../packages/test-helpers/CLAUDE.md) - ✅ Complete
- @h1b/logger - **Next Priority**
- @h1b/di-framework - Week 2
- @h1b/file-system - Week 3
- @h1b/events - Week 4
- @h1b/cache - Week 5

### For AI Assistants (Claude)

#### Primary Context
1. [CLAUDE.md](/CLAUDE.md) - **Start here** - Project-specific instructions
2. [Decomposition Progress](./decomposition-progress.md) - **Current focus** - What to work on next
3. [Migration Plan](./migration-plan.md) - Overall decomposition strategy

#### Reference Documents
- [CLAUDE.md Template](./claude-md-template.md) - When creating new packages
- [CLAUDE.md Guide](./claude-md-guide.md) - Best practices for context files

## 📋 Common Tasks

### Setting Up a New Development Environment

1. **Prerequisites**
   - Node.js 16+
   - GitHub account with access to private repos
   - Personal Access Token (PAT) for GitHub

2. **Initial Setup**
   ```bash
   git clone <repo-url>
   cd h1b-visa-analysis
   npm install
   ```

3. **Configure GitHub Actions**
   - Follow [Automation Setup](./automation-setup.md)
   - Set up PAT_TOKEN secret
   - Test with manual workflow dispatch

### Implementing the Next Package (@h1b/logger)

**This is the current primary development goal.**

1. Read [Decomposition Progress](./decomposition-progress.md) for current status
2. Follow [Migration Plan](./migration-plan.md#phase-1-logger-package)
3. Use established patterns from test packages
4. Create package structure in `/packages/logger/`
5. Use @h1b/test-mocks and @h1b/test-helpers for testing

### Adding a New Shared Package

**Note: On hold until @h1b/testing is complete.**

1. Review [Migration Plan](./migration-plan.md) for overall strategy
2. Use [CLAUDE.md Template](./claude-md-template.md) for package documentation
3. Follow dependency injection patterns from [CLAUDE.md](/CLAUDE.md)
4. Ensure integration with @h1b/testing for quality

### Debugging Report Generation

1. **Check Logs**
   - Local: `logs/` directory
   - GitHub Actions: Workflow run logs

2. **Common Issues**
   - Missing dependencies: Check `packages/` directory
   - TypeScript errors: Run `npm run typecheck`
   - Test failures: Run `npm test`

3. **Manual Testing**
   ```bash
   npm run build        # Generate report
   npm test            # Run test suite
   npm run coverage    # Check test coverage
   ```

## 📚 Document Relationships

### Architecture Flow
```
Migration Plan
    ↓
Testing Package Implementation (current)
    ↓
Other Shared Packages (future)
```

### Development Flow
```
CLAUDE.md (context)
    ↓
Local Development
    ↓
Automation Setup (CI/CD)
```

### Package Creation Flow
```
CLAUDE.md Template
    ↓
Package Implementation
    ↓
Integration with @h1b/testing
```

## 🔍 Quick Reference

### Key Commands
```bash
npm run build       # Generate report
npm test           # Run tests
npm run lint       # Check code style
npm run typecheck  # Type checking
```

### Important Directories
- `/src/` - Main application source
- `/packages/` - Dependency repos (gitignored)
- `/dist/` - Build output
- `/logs/` - Application logs
- `/docs/` - This documentation

### GitHub Workflows
- `generate-report.yml` - Main report generation
- Triggers: push, manual, dependency updates

## 📝 Documentation Standards

All documentation follows these principles:
- Task-oriented organization
- Clear examples and code snippets
- Links to related documents
- Maintained CLAUDE.md files for AI context

## 🚧 Work in Progress

### Current Focus
- **@h1b/testing package** - See [implementation doc](./testing-package-implementation.md)

### Coming Soon
- Integration with actual markdown-compiler
- PDF generation capabilities
- Web UI for report generation
- Performance monitoring

---

**Need something not covered here?** Check the [CLAUDE.md](/CLAUDE.md) for detailed technical context or create an issue for documentation improvements.