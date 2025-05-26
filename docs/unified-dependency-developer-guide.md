# Unified Dependency Strategy - Developer Guide

> **Quick Start**: Run `npm run dev:setup` to configure your local development environment with instant package updates!

## Overview

The H1B Visa Analysis project now uses a **Unified Dependency Strategy** that provides:
- 🚀 **Instant updates** during local development (< 1 second)
- ✅ **Reliable testing** in CI/CD pipelines
- 🏷️ **Tag-based releases** for production deployments
- 🤖 **Automatic mode detection** - no manual configuration needed

## Two Modes of Operation

### 1. Local Development Mode (Default)

When working on your local machine, all packages are automatically linked for instant updates:

```bash
# Just start developing - links are automatic
npm run dev

# Check link status
npm run dev:status

# Your changes are instantly available across all packages!
```

**Benefits:**
- Changes reflect immediately (< 1 second)
- No publish/install cycles
- Test across packages without versioning
- Perfect for rapid iteration

### 2. Pipeline Mode (Tagged Releases)

When you're ready to release, tag your commit to trigger full pipeline validation:

```bash
# Single package release
git tag logger@1.2.3 -m "fix: memory leak in logger"
git push origin logger@1.2.3

# Or tag multiple packages
git tag v2.0.0 -m "feat: major update across ecosystem"
git push origin v2.0.0
```

**What happens:**
1. GitHub Actions detects the tag
2. Runs full test suite
3. Publishes to GitHub Packages
4. Notifies dependent packages
5. Creates automated PRs for updates

## Initial Setup

### One-Time Setup (New Developers)

```bash
# Clone the repository with submodules
git clone --recurse-submodules https://github.com/ChaseNoCap/h1b-visa-analysis.git
cd h1b-visa-analysis

# Run the setup script
npm run dev:setup

# That's it! You're ready to develop
```

### What the Setup Does

1. Initializes all Git submodules
2. Installs dependencies in all packages
3. Creates npm links between packages
4. Configures development scripts
5. Sets up your environment for instant updates

## Daily Development Workflow

### Starting Your Day

```bash
# Navigate to project
cd h1b-visa-analysis

# Start development mode
npm run dev

# Everything is linked and watching for changes!
```

### Making Changes

```bash
# Edit any package
cd packages/logger
# Make your changes...

# Changes are instantly available everywhere!
# No need to publish or npm install

# Test your changes
cd ../../
npm test  # Uses your local changes automatically
```

### Package-Specific Development

```bash
# Work on a specific package
cd packages/cache

# Run package tests with linked dependencies
npm test  # Automatically uses your local logger changes

# Build the package
npm run build

# The changes are immediately available in the meta repo!
```

## Available Commands

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development with auto-linking and watch mode |
| `npm run dev:setup` | One-time setup for new developers |
| `npm run dev:status` | Check npm link status for all packages |
| `npm run dev:clean` | Remove all npm links (cleanup) |
| `npm run test:mode` | Show current dependency mode configuration |

### Standard Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run tests with linked packages |
| `npm run build` | Build the project |
| `npm run lint` | Check code style |
| `npm run typecheck` | Verify TypeScript types |

## Mode Detection

The system automatically detects which mode to use:

```javascript
// Automatic detection logic
if (CI environment) {
  if (git tag present) {
    // Pipeline Mode: Publish and test
  } else {
    // CI Mode: Use registry packages
  }
} else {
  if (FORCE_REGISTRY=true) {
    // Registry Mode: Test production versions
  } else {
    // Local Mode: Use npm links (default)
  }
}
```

### Testing Production Versions Locally

Sometimes you want to test against published versions:

```bash
# Force registry mode
FORCE_REGISTRY=true npm install

# Now using published packages from GitHub Packages
npm test

# Switch back to development mode
npm run dev:setup
```

## Package Tiers

Packages are organized into tiers for update coordination:

### Core Infrastructure (Immediate Updates)
- `di-framework` - Dependency injection framework
- `logger` - Logging infrastructure

### Shared Utilities (5-minute Batch)
- `cache` - Caching decorators
- `file-system` - File operations
- `event-system` - Event bus
- `test-mocks` - Testing mocks
- `test-helpers` - Testing utilities

### Application Layer (15-minute Coordination)
- `report-templates` - Report generation templates
- `markdown-compiler` - Markdown processing
- `report-components` - H1B report content
- `prompts` - AI prompt management

## Publishing Workflow

### When to Publish

Publish when you need to:
- Release a bug fix
- Add new features
- Update for other projects
- Create a stable version for deployment

### How to Publish

1. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new caching strategy"
   ```

2. **Tag the release**
   ```bash
   # Format: package@version
   git tag cache@1.2.0 -m "feat: new caching strategy"
   
   # Or for multiple packages
   git tag v2.0.0 -m "feat: ecosystem update"
   ```

3. **Push with tags**
   ```bash
   git push origin main --tags
   ```

4. **Monitor the release**
   - Check GitHub Actions for build status
   - Verify package published to GitHub Packages
   - Watch for auto-update PRs in dependent repos

## Troubleshooting

### "Package not found" in local mode

```bash
# Rebuild all links
npm run dev:clean
npm run dev:setup

# Verify links
npm run dev:status
```

### Authentication errors

```bash
# Configure GitHub Packages authentication
export PAT_TOKEN=your_github_token
./scripts/configure-npm-auth.sh
```

### Switching between modes

```bash
# From local to registry
FORCE_REGISTRY=true npm ci

# From registry to local
npm run dev:setup
```

### Check current mode

```bash
npm run test:mode
```

## Best Practices

### During Development

1. **Use local mode by default** - It's faster and more efficient
2. **Commit frequently** - But only tag when ready to release
3. **Test across packages** - Your changes affect the whole ecosystem
4. **Run linting** - Before committing: `npm run lint`

### When Publishing

1. **Use semantic versioning** - patch/minor/major based on changes
2. **Write clear tag messages** - They become release notes
3. **Test before tagging** - Tags trigger immediate publishing
4. **Monitor CI/CD** - Ensure your release succeeds

### Package Development

1. **Keep packages focused** - Single responsibility principle
2. **Maintain backward compatibility** - Or use major version bumps
3. **Document changes** - Update package README files
4. **Test thoroughly** - Each package should have >90% coverage

## Advanced Usage

### Custom Tag Formats

```bash
# Single package
git tag logger@1.2.3-beta.1

# Package group
git tag shared@2.0.0  # Updates all shared tier packages

# Ecosystem release
git tag v3.0.0  # Updates everything
```

### Debugging Mode

```bash
# Verbose output
DEBUG=* npm run dev

# Check package resolution
npm ls @chasenocap/logger
```

### CI/CD Integration

The unified workflows automatically:
- Detect tag format
- Determine version from tag
- Publish to correct npm tag (latest/next)
- Create GitHub releases
- Notify dependent repositories

## FAQ

**Q: How do I know if I'm in local or pipeline mode?**
A: Run `npm run test:mode` to see current configuration

**Q: Can I mix linked and registry packages?**
A: Yes, but it's not recommended. Use one mode at a time.

**Q: How long does mode switching take?**
A: Local setup: ~30 seconds. Registry mode: instant.

**Q: Do I need to publish every change?**
A: No! Only publish when you need a stable release.

**Q: What if I accidentally tag?**
A: Delete the tag before pushing: `git tag -d tagname`

## Summary

The Unified Dependency Strategy gives you:
- **Speed** during development (instant updates)
- **Reliability** during integration (full testing)
- **Simplicity** in daily work (automatic detection)
- **Control** when you need it (explicit tags)

Start with `npm run dev:setup` and enjoy instant package updates!