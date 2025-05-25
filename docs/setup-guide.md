# Setup Guide

## Overview

This guide consolidates all setup instructions for the H1B meta repository including environment setup, GitHub Actions configuration, Git submodule management, and authentication.

## Initial Setup

### Prerequisites
- Node.js 16+ installed
- Git configured
- GitHub account with access to create repositories
- VS Code or similar editor

### Repository Setup

1. **Clone Meta Repository with Submodules**
```bash
git clone --recurse-submodules https://github.com/ChaseNoCap/h1b-visa-analysis.git
cd h1b-visa-analysis
```

2. **Initialize Submodules (if cloned without --recurse-submodules)**
```bash
git submodule update --init --recursive
```

3. **Install Dependencies**
```bash
npm install
```

3. **Build Project**
```bash
npm run build
```

## Personal Access Token (PAT) Setup

### Creating a PAT

1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Configure token:
   - **Name**: `h1b-visa-analysis-automation`
   - **Expiration**: 90 days (recommended)
   - **Scopes**:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
4. Click "Generate token"
5. **IMPORTANT**: Copy token immediately!

### Adding PAT to Repositories

For each repository (main + dependencies):
1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `PAT_TOKEN`
4. Value: Paste your token
5. Click "Add secret"

## GitHub Actions Configuration

### Main Repository Workflow

The `generate-report.yml` workflow automatically:
- Triggers on push to main
- Accepts manual triggers
- Responds to dependency updates
- Generates and uploads reports

Key configuration:
```yaml
# Git authentication for private repos
- name: Configure git for private repos
  run: |
    git config --global url."https://${{ secrets.PAT_TOKEN }}@github.com/".insteadOf "https://github.com/"
    git config --global url."https://${{ secrets.PAT_TOKEN }}@github.com/".insteadOf "git@github.com:"
```

### Dependency Repository Workflows

Each dependency needs `notify-parent.yml`:
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
        client-payload: '{"repository": "${{ github.repository }}"}'
```

## Submodule Repository Setup

### Adding a New Submodule

To add a new package as a submodule:

```bash
# Add the submodule
git submodule add https://github.com/ChaseNoCap/{REPO_NAME}.git packages/{REPO_NAME}

# Initialize the submodule
cd packages/{REPO_NAME}

# Create package.json
cat > package.json << EOF
{
  "name": "{REPO_NAME}",
  "version": "0.1.0",
  "description": "{DESCRIPTION}",
  "main": "index.js",
  "type": "module",
  "license": "MIT"
}
EOF

# Create basic index.js
cat > index.js << EOF
export default {
  name: "{REPO_NAME}",
  version: "0.1.0"
};
EOF

# Create workflow directory
mkdir -p .github/workflows

# Add notification workflow
cat > .github/workflows/notify-parent.yml << EOF
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
        token: \${{ secrets.PAT_TOKEN }}
        repository: ChaseNoCap/h1b-visa-analysis
        event-type: dependency-updated
EOF

# Commit and push
git add .
git commit -m "Initial setup"
git push
```

### Required for Each Dependency
1. Basic package.json
2. Export functionality in index.js
3. Notification workflow
4. PAT_TOKEN secret

## Meta Repository Configuration

### Git Submodules Setup

The project uses Git submodules to manage 11 independent package repositories. The `.gitmodules` file defines all submodule mappings:

```ini
[submodule "packages/logger"]
    path = packages/logger
    url = https://github.com/ChaseNoCap/logger.git
[submodule "packages/di-framework"]
    path = packages/di-framework
    url = https://github.com/ChaseNoCap/di-framework.git
# ... (9 more submodules)
```

### Package Dependencies

Main `package.json` uses published packages from GitHub Packages:
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

### Working with Submodules

1. **Navigate to a submodule**:
```bash
cd packages/logger
```

2. **Create feature branch**:
```bash
git checkout -b feature/new-feature
```

3. **Make changes and commit**:
```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

4. **After merge, update meta repository**:
```bash
cd ../..
git submodule update --remote --merge packages/logger
git add packages/logger
git commit -m "chore: update logger submodule"
git push
```

5. **Update npm dependency**:
```bash
npm update @chasenocap/logger
```

## Development Workflow

### Local Development
```bash
# Install all dependencies
npm install

# Run build
npm run build

# Run tests
npm test

# Update dependencies
npm run update-deps

# Update all submodules to latest
git submodule update --remote --merge

# Check submodule status
git submodule status
```

### Before Pushing
1. Run tests: `npm test`
2. Run linter: `npm run lint`
3. Pull latest: `git pull --rebase --autostash`
4. Push changes to trigger CI/CD

## Environment Configuration

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### Git Configuration
```bash
# For private repo access
git config --global url."https://{PAT}@github.com/".insteadOf "https://github.com/"
```

## Troubleshooting

### Common Issues

**Private repo access fails**:
- Verify PAT_TOKEN is set correctly
- Check token has `repo` scope
- Ensure git config is set

**Workflow doesn't trigger**:
- Check PAT_TOKEN in dependency repo
- Verify workflow file syntax
- Check branch protection rules

**Build failures**:
- Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
- Check Node version: `node --version` (need 16+)
- Verify all dependencies installed

### Testing Setup

**Test PAT Token**:
```bash
curl -H "Authorization: token YOUR_PAT_TOKEN" https://api.github.com/user
```

**Test Workflow Trigger**:
1. Go to Actions tab
2. Select workflow
3. Click "Run workflow"
4. Check logs for errors

## Security Best Practices

1. **Token Management**:
   - Rotate PATs every 90 days
   - Use minimum required scopes
   - Never commit tokens

2. **Repository Security**:
   - Keep repos private
   - Enable branch protection
   - Require PR reviews

3. **Dependency Security**:
   - Regular dependency updates
   - Security scanning enabled
   - Version pinning for stability

## Summary

### Setup Checklist
- [ ] Create PAT token
- [ ] Add PAT to all repositories
- [ ] Configure dependency repos
- [ ] Test workflow triggers
- [ ] Verify local development works
- [ ] Document any custom configuration

### Key Files
- `.github/workflows/generate-report.yml` - Main automation
- `.gitmodules` - Submodule configuration
- `package.json` - Dependencies from GitHub Packages
- `.github/workflows/notify-parent.yml` - Dependency notifications
- `CLAUDE.md` - Project context
- `docs/meta-repository-pattern.md` - Submodule architecture guide

---

*This guide consolidates automation-setup.md, dependency-setup-instructions.md, pat-token-setup.md, and setup-summary.md into a single setup reference for the Git submodules architecture.*