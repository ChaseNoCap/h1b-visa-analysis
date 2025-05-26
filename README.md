# H1B Visa Analysis

A meta repository for generating comprehensive H1B visa analysis reports using Git submodules and modular components.

## 🚀 Quick Start

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/ChaseNoCap/h1b-visa-analysis.git

# Or initialize submodules in existing clone
git submodule update --init --recursive

# Install dependencies
npm install

# Generate report
npm run build
```

## 📦 Architecture

This meta repository orchestrates 11 Git submodules as independent package repositories, all published to GitHub Packages:

### Core Infrastructure ✅
- **`@chasenocap/di-framework`** - Dependency injection utilities with container builders
- **`@chasenocap/logger`** - Winston-based logging with daily rotation  
- **`@chasenocap/file-system`** - File operations abstraction layer
- **`@chasenocap/event-system`** - Event-driven debugging and instrumentation
- **`@chasenocap/cache`** - Caching decorators with TTL support

### Testing Framework ✅
- **`@chasenocap/test-mocks`** - Mock implementations (MockLogger, MockFileSystem, MockCache)
- **`@chasenocap/test-helpers`** - Test utilities and helpers (91.89% coverage)

### Application Layer ✅
- **`@chasenocap/report-templates`** - Template engine with Markdown builders (100% coverage)
- **`@chasenocap/markdown-compiler`** - Advanced Markdown processing with includes
- **`@chasenocap/report-components`** - H1B research content and data
- **`@chasenocap/prompts`** - AI context management and optimization

### 🚀 Automation Status
- **✅ All Packages Published**: GitHub Packages Registry
- **✅ Automated Updates**: Renovate + GitHub Actions  
- **✅ Auto-merge**: Dependency PRs auto-merge after tests
- **✅ Instant Notifications**: Package updates trigger immediate updates
- **✅ Submodule Sync**: Git references stay aligned with npm versions

### Project Structure

```
h1b-visa-analysis/
├── .github/                # GitHub configuration
│   ├── workflows/         # GitHub Actions automation
│   └── actionlint.yaml    # Actions linting config
├── .vscode/               # VSCode settings
├── src/                   # Main report generator
│   ├── generate-report.js # Report generation logic
│   └── index.js          # Entry point placeholder
├── .gitmodules            # Git submodules configuration
├── packages/              # Git submodules (11 packages)
├── dist/                  # Generated reports (gitignored)
├── docs/                  # Documentation
│   ├── automation-setup.md            # CI/CD setup guide
│   ├── pat-token-setup.md            # PAT token guide
│   ├── dependency-setup-instructions.md # Dependency setup
│   └── setup-summary.md              # Setup accomplishments
├── .gitignore            # Git ignore rules
├── .yamllint.yml         # YAML linting config
├── package.json          # Project configuration
└── README.md             # This file
```

## 🔄 Workflow

1. **Context Loading**: Loads prompts-shared configurations
2. **Content Fetching**: Pulls latest report-components
3. **Compilation**: Uses markdown-compiler to process
4. **Generation**: Outputs final report to dist/

## 🤖 Automation

### Automated Dependency Management
- **Renovate Integration**: Checks for updates every 30 minutes
- **Repository Dispatch**: Instant notifications when packages publish
- **Auto-merge**: Trusted @chasenocap packages auto-merge after tests pass
- **Submodule Sync**: Git submodules stay aligned with npm package versions

### GitHub Actions Workflows
- **Report Generation**: Triggered on push, dependency updates, or manual dispatch
- **Package Publishing**: All 11 packages auto-publish on release
- **Testing**: Comprehensive test suite with 96%+ pass rate
- **Monitoring**: Real-time dependency dashboard

**Configuration Files**:
- [`renovate.json`](renovate.json) - Renovate automation config
- [`.github/workflows/auto-update-dependencies.yml`](.github/workflows/auto-update-dependencies.yml) - Update workflow
- [`.github/DEPENDENCY_DASHBOARD.md`](.github/DEPENDENCY_DASHBOARD.md) - Status monitoring

See [`docs/dependency-automation-guide.md`](docs/dependency-automation-guide.md) for complete setup guide.

## 🛠️ Development

### Local Development Setup

This project uses Git submodules for package management:

```bash
# Clone with all submodules
git clone --recurse-submodules https://github.com/ChaseNoCap/h1b-visa-analysis.git

# Or if already cloned, initialize submodules
git submodule update --init --recursive

# Update all submodules to latest
git submodule update --remote --merge

# Install dependencies (uses published packages from GitHub Packages)
npm install
```

### Working with Submodules

```bash
# Update a specific submodule
git submodule update --remote --merge packages/logger

# Work within a submodule
cd packages/logger
git checkout -b feature/new-feature
# Make changes, commit, push
cd ../..
git add packages/logger
git commit -m "chore: update logger submodule"

# Check submodule status
git submodule status

# Run command in all submodules
git submodule foreach 'npm test'
```

### NPM Scripts

- `npm run build` - Generate the H1B report
- `npm test` - Run integration tests
- `npm run lint` - Lint TypeScript code
- `npm run typecheck` - Type check without building
- `npm run coverage` - Generate test coverage report

### Submodule Management

See [docs/meta-repository-pattern.md](docs/meta-repository-pattern.md) for detailed Git submodule commands and workflows.

## 📄 License

MIT
