# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an H1B report generator monorepo that orchestrates three GitHub-based private dependencies:
- `prompts-shared` - AI development workflows and context management
- `markdown-compiler` - Markdown processing and compilation  
- `report-components` - H1B research content

The project automatically generates reports when dependencies update via GitHub Actions.

## Key Commands

```bash
# Install dependencies
npm install

# Generate report (outputs to dist/)
npm run build

# Update all GitHub dependencies
npm run update-deps

# Run build across all workspaces
npm run build:all

# Run tests across all workspaces
npm test
```

## Architecture

### Monorepo Structure
```
h1b-visa-analysis/
├── .github/workflows/      # GitHub Actions automation
│   └── generate-report.yml # Main workflow for report generation
├── src/                    # Main report generator
│   ├── generate-report.js  # Report generation logic (main entry point)
│   └── index.js           # Placeholder
├── packages/              # Local workspace packages (future use)
├── h1b-visa-analysis-files/packages/  # Current workspace packages
│   ├── prompts-shared/    # Local dev version
│   ├── markdown-compiler/ # Local dev version
│   ├── report-components/ # Local dev version
│   └── report-generator/  # Orchestration package
├── dist/                  # Generated reports (gitignored)
├── docs/                  # Documentation
│   ├── automation-setup.md    # CI/CD setup guide
│   ├── pat-token-setup.md     # PAT token configuration
│   └── dependency-setup-instructions.md  # Dependency repo setup
└── scripts/               # Setup scripts (can be removed after use)
```

### Workflow Pattern
1. **Context Loading**: Loads configurations from `prompts-shared`
2. **Content Fetching**: Pulls latest from `report-components`
3. **Compilation**: Uses `markdown-compiler` to process content
4. **Generation**: Outputs final report to `dist/report.md`

## NPM Workspaces Configuration

The project uses npm workspaces to manage local packages:
- Workspace packages are defined in `package.json` under `workspaces`
- Dependencies between workspace packages use version numbers (not `workspace:*`)
- GitHub dependencies are installed alongside workspace packages

## GitHub Actions Setup

### Key Workflow: generate-report.yml
- Triggers on: push to main, workflow_dispatch, repository_dispatch
- Uses PAT_TOKEN for accessing private GitHub dependencies
- Configures git to use authenticated HTTPS for npm install
- Uploads generated reports as artifacts

### Critical Configuration for Private Repos
```yaml
- name: Configure git for authenticated HTTPS
  run: |
    git config --global url."https://x-access-token:${{ secrets.PAT_TOKEN }}@github.com/".insteadOf ssh://git@github.com/
    git config --global url."https://x-access-token:${{ secrets.PAT_TOKEN }}@github.com/".insteadOf git@github.com:
    git config --global url."https://x-access-token:${{ secrets.PAT_TOKEN }}@github.com/".insteadOf https://github.com/
```

## Dependency Repositories

All three dependency repositories are **private** and require:
1. Basic npm package structure (package.json, index.js)
2. GitHub Actions workflow to notify parent repo on updates
3. PAT_TOKEN secret for cross-repo communication

### Repository Structure
Each dependency repo contains:
- `package.json` - NPM package metadata
- `index.js` - Main export file
- `.github/workflows/notify-parent.yml` - Automation workflow
- `README.md` - Basic documentation

## Important Notes

- **Private Repos**: All dependencies are private; PAT_TOKEN is required
- **ES Modules**: The project uses ES modules (`"type": "module"`)
- **No Test Framework**: Currently no test framework is configured
- **Git Config**: GitHub Actions requires special git config for private repo access
- **Secrets Required**:
  - Main repo: `PAT_TOKEN` (with repo and workflow scopes)
  - Dependency repos: `PAT_TOKEN` (same token)

## Common Issues & Solutions

1. **npm install fails in GitHub Actions**: Ensure PAT_TOKEN is set and git config is correct
2. **Workflow syntax errors**: Use `|` for multi-line run commands in YAML
3. **Dependencies not updating**: Check PAT_TOKEN in dependency repos
4. **Submodule warnings**: Remove any temp directories before committing

## Development Workflow

1. Make changes to dependency repos
2. Push to trigger notification workflow
3. Parent repo automatically rebuilds report
4. Check Actions tab for build status
5. Download report artifact if needed

## Commit Message Guidelines

**IMPORTANT**: When creating commit messages:
- Never include references to AI assistants, Claude, or any AI tools
- Write commit messages as if you (the developer) wrote them directly
- Use standard Git commit conventions
- Focus on what changed and why, not how it was created
- Use professional, first-person language when appropriate

### Good Commit Message Examples:
```
Add GitHub Actions workflow for automated builds

Fix npm workspace configuration for private repos

Update documentation with setup instructions
```

### Bad Commit Message Examples:
```
Generated with Claude Code ❌
AI-assisted commit ❌
Claude helped create this ❌
```