# Dependency Automation Implementation Tasks

## Overview
This document provides a detailed task breakdown for implementing automated dependency updates in the h1b-visa-analysis meta repository.

## Prerequisites
- [ ] GitHub account with admin access to ChaseNoCap organization
- [ ] Personal Access Token (PAT) with repo and workflow permissions
- [ ] Access to all 11 package repositories
- [ ] Understanding of Git submodules

## Phase 1: Renovate Setup (Day 1 Morning)

### Task 1.1: Install Renovate App (15 min)
1. Navigate to https://github.com/apps/renovate
2. Click "Install"
3. Select "ChaseNoCap" organization
4. Choose "Only select repositories"
5. Select "h1b-visa-analysis"
6. Click "Install"
7. Verify installation at https://github.com/organizations/ChaseNoCap/settings/installations

### Task 1.2: Create Renovate Configuration (30 min)
1. Create new branch: `git checkout -b feat/dependency-automation`
2. Create `renovate.json` in repository root
3. Copy configuration from `/docs/dependency-automation-guide.md`
4. Customize settings:
   - Set timezone
   - Configure npm registry authentication
   - Adjust scheduling if needed
5. Validate JSON syntax
6. Commit: `git commit -m "feat: add Renovate configuration"`

### Task 1.3: Configure Authentication (20 min)
1. Generate npm token for GitHub Packages:
   ```bash
   echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> ~/.npmrc
   ```
2. Encrypt token for Renovate:
   - Visit https://app.renovatebot.com/encrypt
   - Paste your GitHub token
   - Copy encrypted value
3. Update renovate.json with encrypted token
4. Test authentication:
   ```bash
   npm view @chasenocap/logger --registry https://npm.pkg.github.com
   ```

### Task 1.4: Test Renovate Dry Run (30 min)
1. Install Renovate CLI: `npm install -g renovate`
2. Run dry run:
   ```bash
   RENOVATE_TOKEN=$GITHUB_TOKEN renovate --dry-run ChaseNoCap/h1b-visa-analysis
   ```
3. Review output for errors
4. Fix any configuration issues
5. Document any warnings

## Phase 2: Repository Dispatch Setup (Day 1 Afternoon)

### Task 2.1: Create Workflow Template (20 min)
1. Create `notify-parent-template.yml` locally
2. Copy workflow from dependency-automation-guide.md
3. Test workflow syntax using GitHub's workflow validator
4. Create reusable workflow script for all packages

### Task 2.2: Update Package Repositories (2 hours)
For each of the 11 packages:

**Packages to update:**
- [ ] cache
- [ ] di-framework
- [ ] event-system
- [ ] file-system
- [ ] logger
- [ ] markdown-compiler
- [ ] prompts
- [ ] report-components
- [ ] report-templates
- [ ] test-helpers
- [ ] test-mocks

**For each package:**
1. Clone package repository
2. Create `.github/workflows/` directory if needed
3. Add `notify-parent.yml` workflow
4. Update workflow with package-specific details
5. Commit and push:
   ```bash
   git add .github/workflows/notify-parent.yml
   git commit -m "feat: add parent notification workflow"
   git push
   ```
6. Verify workflow appears in Actions tab

### Task 2.3: Add PAT_TOKEN Secret (30 min)
1. Create or verify PAT token has required permissions:
   - `repo` (full control)
   - `workflow` (update workflows)
2. For each package repository:
   - Go to Settings → Secrets → Actions
   - Click "New repository secret"
   - Name: `PAT_TOKEN`
   - Value: Your personal access token
3. Document which repositories have been configured

### Task 2.4: Create Meta Repository Workflow (45 min)
1. In h1b-visa-analysis repository
2. Create `.github/workflows/auto-update-dependencies.yml`
3. Copy workflow from guide
4. Customize:
   - Add error handling
   - Configure notifications
   - Set up branch protection bypass
5. Test workflow syntax
6. Commit to feature branch

## Phase 3: Testing (Day 2 Morning)

### Task 3.1: Test with Logger Package (1 hour)
1. Make a small change to logger package
2. Create a new release (e.g., v1.0.1)
3. Monitor:
   - Package workflow execution
   - Repository dispatch trigger
   - Meta repository workflow
   - PR creation
4. Document any issues
5. Fix and retry if needed

### Task 3.2: Configure Auto-merge (30 min)
1. Install GitHub's auto-merge app or configure native auto-merge
2. Set up branch protection rules:
   - Require status checks
   - Allow auto-merge for dependency PRs
3. Configure Renovate automerge settings
4. Test with a manual PR

### Task 3.3: Load Testing (45 min)
1. Trigger updates for 3-4 packages simultaneously
2. Monitor:
   - GitHub Actions queue
   - PR creation timing
   - Resource usage
3. Adjust rate limits if needed
4. Document performance baseline

## Phase 4: Rollout (Day 2 Afternoon)

### Task 4.1: Enable for All Packages (1 hour)
1. Verify all package workflows are in place
2. Enable Renovate for all @chasenocap packages
3. Remove any test restrictions
4. Monitor initial scan results

### Task 4.2: Create Monitoring Dashboard (45 min)
1. Create `DEPENDENCY_DASHBOARD.md` in .github/
2. Set up status badges
3. Configure Renovate dashboard
4. Create GitHub Project board for tracking
5. Set up notifications

### Task 4.3: Documentation Updates (30 min)
1. Update README.md with automation status
2. Add troubleshooting section to guide
3. Create runbook for common issues
4. Update package README files with automation notes

### Task 4.4: Team Training (30 min)
1. Create brief demo video
2. Write announcement for team
3. Schedule knowledge transfer session
4. Create FAQ document

## Phase 5: Monitoring and Optimization (Ongoing)

### Week 1 Tasks
- [ ] Monitor all automated PRs
- [ ] Track success/failure rate
- [ ] Adjust scheduling based on patterns
- [ ] Fix any authentication issues

### Week 2 Tasks
- [ ] Review and optimize Renovate config
- [ ] Enable more aggressive auto-merge
- [ ] Add custom rules for specific packages
- [ ] Create metrics dashboard

### Month 1 Review
- [ ] Calculate time saved
- [ ] Review security update speed
- [ ] Optimize workflow performance
- [ ] Plan next improvements

## Troubleshooting Checklist

### If Renovate doesn't run:
1. Check app permissions
2. Verify renovate.json syntax
3. Check repository settings
4. Review Renovate logs

### If repository dispatch fails:
1. Verify PAT_TOKEN is set
2. Check workflow permissions
3. Test API call manually
4. Review workflow logs

### If PRs aren't created:
1. Check branch protection
2. Verify npm authentication
3. Review rate limits
4. Check for conflicts

### If auto-merge fails:
1. Review merge requirements
2. Check test status
3. Verify permissions
4. Review merge conflicts

## Success Criteria

### Day 1
- ✅ Renovate installed and configured
- ✅ One package workflow tested
- ✅ Meta repository workflow created

### Day 2
- ✅ All packages configured
- ✅ Auto-merge working
- ✅ Documentation complete
- ✅ Team notified

### Week 1
- ✅ 10+ automated PRs created
- ✅ 90%+ success rate
- ✅ <1 hour update latency
- ✅ Zero manual interventions

## Resources

- [Renovate Documentation](https://docs.renovatebot.com/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Repository Dispatch Guide](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#repository_dispatch)
- [Our Guide](/docs/dependency-automation-guide.md)