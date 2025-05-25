# Dependency Automation Guide

## Overview

This guide documents the automated dependency update strategy for the h1b-visa-analysis meta repository, which manages 11 Git submodules published as npm packages to GitHub Packages Registry.

## Architecture Context

### Current Setup
- **Meta Repository**: h1b-visa-analysis (orchestrator)
- **11 Git Submodules**: Independent repositories published as @chasenocap/* packages
- **Registry**: GitHub Packages (npm.pkg.github.com)
- **Package Management**: Pure Git submodules (no NPM workspaces)

### Automation Goals
1. **Immediate Updates**: Consume new package versions as soon as they're published
2. **Submodule Sync**: Keep Git submodule references aligned with npm versions
3. **Zero Manual Work**: Fully automated PR creation and testing
4. **Security First**: Prioritize vulnerability patches
5. **Free Solution**: Use only free GitHub features

## Recommended Solution: Renovate + GitHub Actions

### Why This Combination?

**Renovate** provides:
- Native Git submodules support
- Sophisticated dependency grouping
- Monorepo awareness
- Configurable scheduling
- Auto-merge capabilities

**GitHub Actions** provides:
- Instant notification when packages publish
- Custom update logic
- Backup scheduling
- Full GitHub integration

## Implementation Plan

### Phase 1: Renovate Setup

#### 1.1 Install Renovate App
1. Visit https://github.com/apps/renovate
2. Install on the ChaseNoCap organization
3. Grant access to h1b-visa-analysis repository

#### 1.2 Create Renovate Configuration

Create `renovate.json` in repository root:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:base",
    ":dependencyDashboard",
    ":semanticCommitTypeAll(chore)"
  ],
  "timezone": "America/New_York",
  "schedule": ["every 30 minutes"],
  "cloneSubmodules": true,
  "git-submodules": {
    "enabled": true
  },
  "npmrc": "@chasenocap:registry=https://npm.pkg.github.com/",
  "hostRules": [
    {
      "matchHost": "npm.pkg.github.com",
      "hostType": "npm",
      "encrypted": {
        "token": "ENCRYPTED_GITHUB_TOKEN"
      }
    }
  ],
  "packageRules": [
    {
      "description": "Automerge ChaseNoCap packages",
      "matchPackagePatterns": ["^@chasenocap/"],
      "groupName": "ChaseNoCap packages",
      "schedule": ["at any time"],
      "automerge": true,
      "automergeType": "pr",
      "rangeStrategy": "bump",
      "recreateClosed": true,
      "rebaseWhen": "behind-base-branch"
    },
    {
      "description": "Group submodule updates",
      "matchManagers": ["git-submodules"],
      "groupName": "Submodule updates",
      "commitMessageTopic": "submodule {{depName}}",
      "automerge": true
    },
    {
      "description": "Security updates",
      "matchUpdateTypes": ["patch", "minor"],
      "matchPackagePatterns": ["*"],
      "automerge": true,
      "minimumReleaseAge": "0 days",
      "schedule": ["at any time"],
      "prPriority": 10
    }
  ],
  "prCreation": "immediate",
  "prHourlyLimit": 0,
  "prConcurrentLimit": 20,
  "rebaseWhen": "conflicted",
  "semanticCommits": "enabled",
  "commitMessagePrefix": "chore:",
  "labels": ["dependencies", "automated"],
  "postUpdateOptions": [
    "npmDedupe",
    "yarnDedupeHighest"
  ]
}
```

### Phase 2: GitHub Actions Repository Dispatch

#### 2.1 Package Repository Workflow

Add to EACH package repository (`.github/workflows/notify-parent.yml`):

```yaml
name: Notify Parent Repository on Publish

on:
  release:
    types: [published]
  workflow_run:
    workflows: ["Publish Package"]
    types: [completed]

jobs:
  notify-parent:
    if: ${{ github.event_name == 'release' || github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest
    steps:
      - name: Get package info
        id: package
        run: |
          echo "name=${GITHUB_REPOSITORY#*/}" >> $GITHUB_OUTPUT
          echo "version=${GITHUB_REF#refs/tags/}" >> $GITHUB_OUTPUT
          
      - name: Notify h1b-visa-analysis
        uses: peter-evans/repository-dispatch@v2
        with:
          token: ${{ secrets.PAT_TOKEN }}
          repository: ChaseNoCap/h1b-visa-analysis
          event-type: package-published
          client-payload: |
            {
              "package": "${{ steps.package.outputs.name }}",
              "version": "${{ steps.package.outputs.version }}",
              "repository": "${{ github.repository }}"
            }
```

#### 2.2 Meta Repository Workflow

Create `.github/workflows/auto-update-dependencies.yml`:

```yaml
name: Auto Update Dependencies

on:
  repository_dispatch:
    types: [package-published]
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours as backup
  workflow_dispatch:
    inputs:
      package:
        description: 'Package to update (optional)'
        required: false
        type: string

permissions:
  contents: write
  pull-requests: write

jobs:
  update-dependencies:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout with submodules
        uses: actions/checkout@v4
        with:
          submodules: recursive
          token: ${{ secrets.PAT_TOKEN }}
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://npm.pkg.github.com'
          cache: 'npm'

      - name: Configure npm
        run: |
          echo "@chasenocap:registry=https://npm.pkg.github.com/" > .npmrc
          echo "//npm.pkg.github.com/:_authToken=${{ secrets.GITHUB_TOKEN }}" >> .npmrc

      - name: Update specific package (repository_dispatch)
        if: github.event_name == 'repository_dispatch'
        run: |
          PACKAGE="${{ github.event.client_payload.package }}"
          VERSION="${{ github.event.client_payload.version }}"
          
          echo "Updating @chasenocap/${PACKAGE} to ${VERSION}"
          
          # Update npm dependency
          npm update "@chasenocap/${PACKAGE}@${VERSION}"
          
          # Update submodule to matching tag
          cd "packages/${PACKAGE}"
          git fetch --tags
          git checkout "v${VERSION}" || git checkout "${VERSION}"
          cd ../..
          
          # Commit changes
          git add .
          git commit -m "chore: update @chasenocap/${PACKAGE} to ${VERSION}" || echo "No changes"

      - name: Update all packages (scheduled/manual)
        if: github.event_name != 'repository_dispatch'
        run: |
          echo "Checking for updates to all @chasenocap packages"
          
          # Update npm dependencies
          npm update
          
          # Update all submodules to latest
          git submodule update --remote --merge
          
          # Commit changes if any
          git add .
          git commit -m "chore: update dependencies" || echo "No changes"

      - name: Create Pull Request
        if: github.event_name == 'repository_dispatch'
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.PAT_TOKEN }}
          commit-message: "chore: update dependencies"
          title: "⬆️ Update @chasenocap/${{ github.event.client_payload.package }} to ${{ github.event.client_payload.version }}"
          body: |
            ## Automated Dependency Update
            
            This PR updates the following:
            - **Package**: `@chasenocap/${{ github.event.client_payload.package }}`
            - **Version**: `${{ github.event.client_payload.version }}`
            - **Triggered by**: Package release in ${{ github.event.client_payload.repository }}
            
            ### Checklist
            - [ ] Tests pass
            - [ ] Build succeeds
            - [ ] Submodule reference updated
            
            ---
            *This PR was automatically created by the dependency update workflow.*
          branch: auto-update-${{ github.event.client_payload.package }}-${{ github.event.client_payload.version }}
          delete-branch: true
          labels: |
            dependencies
            automated
            
      - name: Run tests
        if: steps.create-pr.outputs.pull-request-number
        run: |
          npm test
          npm run build
```

### Phase 3: Security and Optimization

#### 3.1 Create GitHub Secrets

Required secrets in meta repository:
- `PAT_TOKEN`: Personal Access Token with repo and workflow permissions
- `NPM_TOKEN`: GitHub token for package registry access (can use GITHUB_TOKEN)

#### 3.2 Branch Protection Rules

Configure for `main` branch:
- ✅ Require pull request reviews (can bypass for automated PRs)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Include administrators

#### 3.3 Auto-merge Configuration

Create `.github/auto-merge.yml`:

```yaml
# Configuration for auto-merge bot
minApprovals:
  NONE: 0  # For automated dependency PRs
requiredLabels:
  - dependencies
  - automated
blockingLabels:
  - do-not-merge
  - work-in-progress
deleteBranchAfterMerge: true
mergeMethod: squash
```

## Testing Strategy

### 1. Dry Run Mode
Test Renovate configuration:
```bash
# Run Renovate in dry-run mode
npx renovate --dry-run --token=$GITHUB_TOKEN ChaseNoCap/h1b-visa-analysis
```

### 2. Manual Trigger Test
Test repository dispatch:
```bash
curl -X POST \
  -H "Authorization: token $PAT_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/ChaseNoCap/h1b-visa-analysis/dispatches \
  -d '{"event_type":"package-published","client_payload":{"package":"logger","version":"1.0.1"}}'
```

### 3. Gradual Rollout
1. Start with one package (e.g., logger)
2. Monitor automated PRs for a week
3. Enable for remaining packages

## Monitoring and Maintenance

### Dashboard Creation
Create `.github/DEPENDENCY_DASHBOARD.md`:

```markdown
# Dependency Update Dashboard

## Update Status
- **Renovate**: [![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
- **Last Check**: <!-- RENOVATE_LAST_CHECK -->
- **Pending Updates**: <!-- RENOVATE_PENDING -->

## Package Status
| Package | Current | Latest | Status |
|---------|---------|--------|--------|
| @chasenocap/cache | <!-- CURRENT_CACHE --> | <!-- LATEST_CACHE --> | <!-- STATUS_CACHE --> |
| @chasenocap/di-framework | <!-- CURRENT_DI --> | <!-- LATEST_DI --> | <!-- STATUS_DI --> |
<!-- ... etc for all packages -->

## Recent Updates
<!-- RECENT_UPDATES -->

## Metrics
- **Average Update Time**: <!-- AVG_UPDATE_TIME -->
- **Success Rate**: <!-- SUCCESS_RATE -->
- **Security Updates**: <!-- SECURITY_UPDATES -->
```

### Monitoring Checklist
- [ ] Set up GitHub notifications for automated PRs
- [ ] Review Renovate dashboard weekly
- [ ] Monitor GitHub Actions usage (free tier limits)
- [ ] Check for failed workflows monthly
- [ ] Review and update Renovate config quarterly

## Troubleshooting

### Common Issues

#### 1. Authentication Failures
```bash
# Test GitHub Packages access
npm view @chasenocap/logger --registry https://npm.pkg.github.com
```

#### 2. Submodule Update Conflicts
```bash
# Reset submodule to tracked commit
git submodule update --init --force
```

#### 3. Renovate Not Running
- Check Renovate app permissions
- Verify renovate.json is valid JSON
- Check repository settings for Renovate app

#### 4. Repository Dispatch Not Triggering
- Verify PAT_TOKEN has workflow permissions
- Check sender repository has the workflow
- Verify event names match exactly

## Best Practices

1. **Commit Messages**: Use conventional commits (chore: update dependencies)
2. **PR Titles**: Clear, descriptive titles with package and version
3. **Grouping**: Group related updates to reduce PR noise
4. **Testing**: Always run tests before auto-merging
5. **Scheduling**: Avoid peak hours for updates
6. **Documentation**: Keep this guide updated with changes

## Migration Path

### From Manual to Automated
1. **Week 1**: Set up Renovate in dry-run mode
2. **Week 2**: Enable for dev dependencies only
3. **Week 3**: Enable for one production package
4. **Week 4**: Enable for all packages with auto-merge

### Rollback Plan
If automation causes issues:
1. Disable Renovate app temporarily
2. Disable repository_dispatch workflow
3. Close all automated PRs
4. Return to manual updates
5. Debug and fix issues
6. Re-enable gradually

## Success Metrics

Track these KPIs:
- **Update Lag**: Time from package publish to PR creation (target: <1 hour)
- **Merge Time**: Time from PR creation to merge (target: <4 hours)
- **Success Rate**: Percentage of automated updates that pass tests (target: >95%)
- **Manual Intervention**: Number of PRs requiring manual fixes (target: <5%)

## References

- [Renovate Documentation](https://docs.renovatebot.com/)
- [GitHub Actions Events](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows)
- [Repository Dispatch API](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event)
- [npm and GitHub Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)