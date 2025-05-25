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

This meta repository orchestrates 11 Git submodules as independent package repositories:

**Core Infrastructure** (Published to GitHub Packages):
- `@chasenocap/di-framework` - Dependency injection utilities
- `@chasenocap/logger` - Winston-based logging
- `@chasenocap/file-system` - File operations abstraction
- `@chasenocap/event-system` - Event-driven debugging
- `@chasenocap/cache` - Caching decorators

**Testing Utilities** (Published to GitHub Packages):
- `@chasenocap/test-mocks` - Mock implementations
- `@chasenocap/test-helpers` - Test utilities

**Application Packages** (Published to GitHub Packages):
- `@chasenocap/report-templates` - Template engine
- `@chasenocap/prompts` - AI context management

**Domain Dependencies** (Private repositories):
- `markdown-compiler` - Markdown processing
- `report-components` - H1B research content

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

GitHub Actions automatically generates reports when:
- Code is pushed to main branch
- Dependencies are updated in their repos
- Manually triggered via workflow_dispatch

See [docs/automation-setup.md](docs/automation-setup.md) for detailed setup instructions.

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
