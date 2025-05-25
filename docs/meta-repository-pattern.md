# Meta Repository Pattern with Git Submodules

## Overview

The h1b-visa-analysis project uses a **meta repository pattern** with Git submodules to manage its modular architecture. This approach provides centralized orchestration while maintaining independent package repositories.

## Architecture

### Repository Structure

```
h1b-visa-analysis/ (Meta Repository)
├── .gitmodules                    # Submodule configuration
├── packages/                      # Git submodules directory
│   ├── di-framework/             # → github.com/ChaseNoCap/di-framework
│   ├── logger/                   # → github.com/ChaseNoCap/logger
│   ├── test-mocks/               # → github.com/ChaseNoCap/test-mocks
│   ├── test-helpers/             # → github.com/ChaseNoCap/test-helpers
│   ├── file-system/              # → github.com/ChaseNoCap/file-system
│   ├── event-system/             # → github.com/ChaseNoCap/event-system
│   ├── cache/                    # → github.com/ChaseNoCap/cache
│   ├── report-templates/         # → github.com/ChaseNoCap/report-templates
│   ├── prompts/                  # → github.com/ChaseNoCap/prompts
│   ├── markdown-compiler/        # → github.com/ChaseNoCap/markdown-compiler
│   └── report-components/        # → github.com/ChaseNoCap/report-components
├── src/                          # Main application code
├── tests/                        # Integration tests
└── docs/                         # Documentation
```

### Package Categories

1. **Core Infrastructure** (Published to GitHub Packages)
   - `@chasenocap/di-framework` - Dependency injection utilities
   - `@chasenocap/logger` - Winston-based logging

2. **Testing Utilities** (Published to GitHub Packages)
   - `@chasenocap/test-mocks` - Mock implementations
   - `@chasenocap/test-helpers` - Test utilities

3. **System Packages** (Published to GitHub Packages)
   - `@chasenocap/file-system` - File operations abstraction
   - `@chasenocap/event-system` - Event-driven debugging
   - `@chasenocap/cache` - Caching decorators

4. **Application Packages** (Published to GitHub Packages)
   - `@chasenocap/report-templates` - Template engine
   - `@chasenocap/prompts` - AI context management

5. **Domain Dependencies** (Private repositories)
   - `markdown-compiler` - Markdown processing
   - `report-components` - H1B research content

## Development Workflow

### Initial Setup

```bash
# Clone the meta repository with submodules
git clone --recurse-submodules https://github.com/ChaseNoCap/h1b-visa-analysis.git

# Or if already cloned, initialize submodules
git submodule update --init --recursive
```

### Working with Submodules

#### Update All Submodules
```bash
# Pull latest changes for all submodules
git submodule update --remote --merge

# Or update a specific submodule
git submodule update --remote --merge packages/logger
```

#### Making Changes to a Submodule
```bash
# 1. Navigate to the submodule
cd packages/logger

# 2. Create a feature branch
git checkout -b feature/new-logging-feature

# 3. Make changes and commit
git add .
git commit -m "feat: add structured logging"

# 4. Push to the submodule repository
git push origin feature/new-logging-feature

# 5. Return to meta repository
cd ../..

# 6. Commit the submodule reference update
git add packages/logger
git commit -m "chore: update logger submodule reference"
```

#### Publishing a Package
```bash
# Navigate to the package
cd packages/logger

# Build and test
npm run build
npm test

# Version and publish
npm version patch
npm publish

# Push tags
git push --tags
```

### Building and Testing

Since packages are independent repositories, each has its own build and test commands:

```bash
# Build a specific package
cd packages/logger && npm run build

# Test a specific package
cd packages/test-helpers && npm test

# Run integration tests in meta repository
npm test
```

### Dependency Management

The meta repository consumes published packages from GitHub Packages:

```json
{
  "dependencies": {
    "@chasenocap/logger": "^1.0.0",
    "@chasenocap/di-framework": "^1.0.0",
    "@chasenocap/file-system": "^1.0.0",
    "@chasenocap/cache": "^1.0.0",
    "@chasenocap/report-templates": "^1.0.0"
  },
  "devDependencies": {
    "@chasenocap/test-mocks": "^1.0.0",
    "@chasenocap/test-helpers": "^1.0.0"
  }
}
```

## CI/CD Considerations

### GitHub Actions for Submodules

```yaml
- name: Checkout with submodules
  uses: actions/checkout@v4
  with:
    submodules: recursive
    token: ${{ secrets.PAT_TOKEN }}  # Required for private submodules
```

### Automated Updates

The meta repository can use GitHub Actions to automatically update submodule references when packages are published:

```yaml
- name: Update submodule references
  run: |
    git submodule update --remote --merge
    git add .
    git commit -m "chore: update submodule references" || true
    git push
```

## Benefits of This Architecture

1. **Independent Versioning**: Each package has its own version and release cycle
2. **Separate CI/CD**: Packages can have their own testing and deployment pipelines
3. **Clear Ownership**: Each package repository has clear boundaries and responsibilities
4. **Reusability**: Packages can be used in other projects via GitHub Packages
5. **Atomic Changes**: Changes to packages are atomic and trackable

## Common Commands Reference

```bash
# Clone with all submodules
git clone --recurse-submodules <repo-url>

# Initialize submodules in existing clone
git submodule update --init --recursive

# Update all submodules to latest
git submodule update --remote --merge

# Check submodule status
git submodule status

# Foreach submodule command
git submodule foreach 'git pull origin main'

# Add a new submodule
git submodule add https://github.com/ChaseNoCap/new-package.git packages/new-package

# Remove a submodule
git submodule deinit packages/old-package
git rm packages/old-package
rm -rf .git/modules/packages/old-package
```

## Troubleshooting

### Submodule Not Initialized
```bash
git submodule update --init packages/logger
```

### Detached HEAD in Submodule
```bash
cd packages/logger
git checkout main
git pull origin main
```

### Authentication Issues with Private Submodules
Ensure you have:
1. SSH keys configured for GitHub
2. Or use HTTPS with a Personal Access Token:
   ```bash
   git config --global url."https://${PAT_TOKEN}@github.com/".insteadOf "https://github.com/"
   ```

## Migration from NPM Workspaces

This project migrated from NPM workspaces to Git submodules for better modularity:

1. **Before**: Monolithic workspace with local packages
2. **After**: Meta repository with independent package repositories

Key differences:
- No more `workspaces` field in package.json
- No more workspace-specific commands (`npm run build:all`)
- Each package is built and tested independently
- Packages are consumed as published npm dependencies