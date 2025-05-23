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
├── .github/workflows/      # GitHub Actions automation
├── src/                    # Main report generator
│   └── generate-report.js  # Report generation logic
├── packages/               # Local workspace packages (future)
├── h1b-visa-analysis-files/packages/  # Current workspace packages
│   ├── prompts-shared/     # AI workflow configurations
│   ├── markdown-compiler/  # Markdown processing
│   ├── report-components/  # H1B research content
│   └── report-generator/   # Report orchestration
├── dist/                   # Generated reports (gitignored)
└── docs/                   # Documentation
    └── automation-setup.md # CI/CD setup guide
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
- `npm run update-deps` - Update GitHub dependencies

## 📄 License

MIT