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

# Update all GitHub dependencies (not needed with local development)
npm run update-deps

# Run build across all workspaces
npm run build:all

# Run tests across all workspaces
npm test
```

## Architecture

### Current Monorepo Structure (Simplified)
```
h1b-visa-analysis/
├── .github/
│   ├── workflows/
│   │   └── generate-report.yml # Main workflow for report generation
│   └── actionlint.yaml         # Linting config for GitHub Actions
├── .vscode/
│   └── settings.json           # VSCode configuration
├── src/                        # Main report generator
│   ├── generate-report.js      # Report generation with dependency status
│   └── index.js               # Placeholder
├── packages/                   # Cloned dependency repos (gitignored)
│   ├── prompts-shared/        # Local clone for development
│   ├── markdown-compiler/     # Local clone for development
│   └── report-components/     # Local clone for development
├── dist/                      # Generated reports (gitignored)
├── docs/                      # Documentation
│   ├── automation-setup.md    # CI/CD setup guide
│   ├── pat-token-setup.md     # PAT token configuration
│   ├── dependency-setup-instructions.md  # Dependency repo setup
│   └── setup-summary.md       # What we accomplished
├── .gitignore                 # Excludes dist/, packages/*, node_modules
├── .yamllint.yml              # YAML linting rules
├── package.json               # Workspace configuration
├── package-lock.json          # Dependency lock file
└── README.md                  # Project overview
```

### Workflow Pattern
1. **Dependency Check**: Verifies all dependencies are available
2. **Status Report**: Shows which dependencies are loaded
3. **Future Integration**: Ready for full report compilation
4. **Safe Stubbing**: Maintains working CI/CD while developing

## NPM Workspaces Configuration

The project uses npm workspaces for local development:
```json
{
  "workspaces": [
    "packages/*"
  ]
}
```

### Local Development Setup
1. Clone dependency repos into `packages/` directory
2. They're automatically linked via npm workspaces
3. Changes in packages are immediately reflected
4. The repos in `packages/` are gitignored

## GitHub Actions Setup

### Key Workflow: generate-report.yml
- **Triggers**: push to main, workflow_dispatch, repository_dispatch
- **Authentication**: Uses PAT_TOKEN for private repo access
- **Auto-commit**: Commits changes with `[skip ci]` to prevent loops
- **Artifacts**: Uploads generated reports

### Critical Configuration for Private Repos
```yaml
- name: Configure git for authenticated HTTPS
  run: |
    # yamllint disable rule:line-length
    git config --global url."https://x-access-token:${{ secrets.PAT_TOKEN }}@github.com/".insteadOf ssh://git@github.com/
    git config --global url."https://x-access-token:${{ secrets.PAT_TOKEN }}@github.com/".insteadOf git@github.com:
    git config --global url."https://x-access-token:${{ secrets.PAT_TOKEN }}@github.com/".insteadOf https://github.com/
    # yamllint enable rule:line-length
```

## Dependency Repositories

All three dependency repositories:
- Are **private** GitHub repositories
- Have their own GitHub Actions workflows
- Send notifications when updated
- Can be cloned locally for development

### Repository Contents
- `prompts-shared`: Contains memory bank, context files, workflows
- `markdown-compiler`: Has full markdown processing with ::include support
- `report-components`: Contains H1B research markdown files

## Linting and IDE Configuration

### VSCode Settings (.vscode/settings.json)
- Configures GitHub Actions schema validation
- Sets up YAML file associations
- Helps suppress false positive warnings about secrets

### Linting Files
- `.yamllint.yml`: YAML linting configuration
- `.github/actionlint.yaml`: GitHub Actions specific linting

## Important Patterns & Learnings

### What Works
1. **Stub First**: Keep generate-report.js simple until dependencies stabilize
2. **Local Clones**: Clone repos to packages/ for development, gitignore them
3. **Workspace Links**: npm workspaces automatically link local packages
4. **Git Config**: Must configure git in CI/CD for private repo access
5. **Linting Config**: VSCode and yamllint configs help with false warnings

### What Doesn't Work
1. **workspace:* protocol**: Use version numbers instead
2. **SSH URLs in CI**: GitHub Actions needs HTTPS with PAT token
3. **Nested Git Repos**: Always gitignore cloned repos in packages/

### Security Notes
- **PAT_TOKEN**: Required in all repos (main + dependencies)
- **Scopes Needed**: repo, workflow
- **Git Config**: Use x-access-token format for HTTPS auth
- **No Secrets in Code**: All secrets via GitHub secrets

## Common Issues & Solutions

1. **npm install fails in GitHub Actions**: 
   - Check PAT_TOKEN is set
   - Verify git config commands are before npm install
   
2. **Workflow syntax errors**: 
   - Use `|` for multi-line run commands
   - Add yamllint disable comments for long lines
   
3. **IDE warnings about secrets**:
   - Normal for GitHub Actions files
   - Configured linting to minimize false positives
   
4. **Nested git repo warnings**:
   - Add cloned packages to .gitignore
   - Use `git rm --cached` if already tracked

5. **Push rejected due to GitHub Actions auto-commits**:
   - The workflow auto-commits with `[skip ci]` message
   - Always pull before pushing: `git pull --rebase --autostash`
   - This is expected behavior from the "Commit and push if changed" step
   - These commits contain generated reports

## Development Workflow

### For Main Repository
1. Clone dependency repos to packages/ for local development
2. Make changes and test with `npm run build`
3. **Before pushing**: Pull latest with `git pull --rebase --autostash`
4. Push changes to trigger CI/CD
5. Check GitHub Actions for success

### For Dependency Updates
1. Make changes in the actual GitHub repos
2. Push to trigger notify-parent workflow
3. Main repo automatically rebuilds
4. Download artifacts from Actions tab

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

## Testing & Validation

Currently the project:
- ✅ Builds successfully locally and in CI/CD
- ✅ Shows dependency status in generated report
- ✅ Auto-commits and uploads artifacts
- ✅ Handles private repo authentication

Future enhancements will integrate the actual markdown compilation.