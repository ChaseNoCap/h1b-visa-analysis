# Scripts Directory

This directory contains automation scripts for managing the h1b-visa-analysis meta repository.

## Available Scripts

### setup-github-packages-auth.sh
Sets up authentication for GitHub Packages Registry.

**Usage:**
```bash
export GITHUB_TOKEN=your_token_here
./scripts/setup-github-packages-auth.sh
```

**Requirements:**
- GitHub Personal Access Token with `repo`, `write:packages`, and `read:packages` scopes

### deploy-notify-workflow.sh
Deploys the parent notification workflow to all 11 package repositories.

**Usage:**
```bash
./scripts/deploy-notify-workflow.sh
```

**What it does:**
- Adds `.github/workflows/notify-parent.yml` to each package repository
- Commits and pushes the changes
- Enables automatic notification when packages are published

**Note:** After running, you must add the `PAT_TOKEN` secret to each repository.

### Other Scripts

- **check-package-sizes.sh**: Analyzes package sizes
- **fix-username.sh**: Fixes git username issues
- **prepare-for-local-dev.js**: Prepares packages for local development
- **update-internal-deps.js**: Updates internal package dependencies

## Workflow Templates

### notify-parent-template.yml
Template workflow that package repositories use to notify the meta repository when a new version is published.

## Setup Order

1. First, set up authentication:
   ```bash
   ./scripts/setup-github-packages-auth.sh
   ```

2. Install Renovate app:
   - Visit https://github.com/apps/renovate
   - Install on ChaseNoCap/h1b-visa-analysis

3. Deploy workflows to all packages:
   ```bash
   ./scripts/deploy-notify-workflow.sh
   ```

4. Add PAT_TOKEN secret to each package repository

5. Test the system with a package release