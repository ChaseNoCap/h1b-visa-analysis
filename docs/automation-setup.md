# Automation Setup

## GitHub Actions Integration

### Main Repository Workflows

1. **generate-report.yml** - Automatically generates H1B report when:
   - Code is pushed to main branch
   - Manually triggered via workflow_dispatch
   - Dependency repos send update notifications

2. **dependency-notifier.yml** - Template for dependency repos to notify this repo

### Dependency Repos Need These Workflows:

Copy the `dependency-notifier.yml` to each dependency repository and configure:

#### For prompts-shared, markdown-compiler, and report-components:
```yaml
name: Notify Parent Repository

on:
  push:
    branches: [ main ]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
    - name: Trigger parent repository workflow
      uses: peter-evans/repository-dispatch@v3
      with:
        token: ${{ secrets.PAT_TOKEN }}
        repository: ChaseNoCap/h1b-visa-analysis
        event-type: dependency-updated
        client-payload: '{"repository": "${{ github.repository }}", "ref": "${{ github.ref }}", "sha": "${{ github.sha }}"}'
```

### Required Secrets:

#### For this repository:
- `PAT_TOKEN`: Personal Access Token with repo scope (optional, falls back to GITHUB_TOKEN)

#### For dependency repositories:
- `PAT_TOKEN`: Personal Access Token with repo scope (required)
- `PARENT_REPO`: Set to `ChaseNoCap/h1b-visa-analysis` (or configure in workflow)

### Local Development:
```bash
# Install dependencies and set up workspaces
npm install

# Trigger manual build
npm run build

# Update all dependencies
npm run update-deps

# Run build across all workspaces
npm run build:all

# Run tests across all workspaces
npm test
```