# H1B Visa Analysis

A monorepo for generating comprehensive H1B visa analysis reports using modular components.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Generate report
npm run build

# Update all GitHub dependencies
npm run update-deps
```

## 📦 Architecture

This project orchestrates three GitHub dependencies:
- `prompts-shared` - AI development workflows and context management
- `markdown-compiler` - Markdown processing and compilation
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
├── packages/              # Local development packages (gitignored)
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

To work with the dependency packages locally:

```bash
# Clone the dependency repos for local development
cd packages
git clone https://github.com/ChaseNoCap/prompts-shared.git
git clone https://github.com/ChaseNoCap/markdown-compiler.git
git clone https://github.com/ChaseNoCap/report-components.git
cd ..

# Install dependencies (links local packages automatically)
npm install
```

### Workspace Commands

```bash
# Run build across all workspaces
npm run build:all

# Run tests across all workspaces
npm test

# Install dependencies for all workspaces
npm install
```

### NPM Scripts

- `npm run build` - Generate the H1B report
- `npm run build:all` - Build all workspace packages
- `npm test` - Run tests across workspaces
- `npm run update-deps` - Update GitHub dependencies (for CI/CD)

## 📄 License

MIT
