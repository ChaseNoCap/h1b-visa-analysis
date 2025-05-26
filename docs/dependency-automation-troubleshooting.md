# Dependency Automation Troubleshooting Guide

## Overview

This guide helps resolve common issues with the automated dependency update system for the h1b-visa-analysis meta repository.

## Quick Diagnostics

### 1. Check System Status
```bash
# Test Renovate config
npx renovate --dry-run --token=$GITHUB_TOKEN ChaseNoCap/h1b-visa-analysis

# Test GitHub Packages access
npm view @chasenocap/logger --registry https://npm.pkg.github.com

# Test repository dispatch
curl -X POST \
  -H "Authorization: token $PAT_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/ChaseNoCap/h1b-visa-analysis/dispatches \
  -d '{"event_type":"package-published","client_payload":{"package":"logger","version":"1.0.1"}}'
```

### 2. Common Issue Checklist
- [ ] Renovate app installed on organization
- [ ] PAT_TOKEN has correct permissions
- [ ] GitHub Packages authentication working
- [ ] All package repositories have notify-parent workflow
- [ ] Meta repository workflow permissions correct

## Issue Categories

### Authentication Failures

#### Symptom: "401 Unauthorized" errors
**Cause**: Invalid or expired tokens
**Solution**:
```bash
# Check PAT token permissions
curl -H "Authorization: token $PAT_TOKEN" https://api.github.com/user

# Verify GitHub Packages access
npm whoami --registry https://npm.pkg.github.com
```

**Required PAT Permissions**:
- `repo` (full repository access)
- `workflow` (update GitHub Actions workflows)
- `write:packages` (publish to GitHub Packages)
- `read:packages` (read from GitHub Packages)

#### Symptom: Renovate can't access private packages
**Cause**: Missing or incorrect hostRules in renovate.json
**Solution**:
```json
{
  "hostRules": [
    {
      "matchHost": "npm.pkg.github.com",
      "hostType": "npm",
      "username": "x-access-token",
      "password": "{{ secrets.GITHUB_COM_TOKEN }}"
    }
  ]
}
```

### Renovate Issues

#### Symptom: Renovate not creating PRs
**Possible Causes & Solutions**:

1. **Config Validation Error**
   ```bash
   # Validate renovate.json
   npx renovate-config-validator
   ```

2. **App Permissions**
   - Visit https://github.com/apps/renovate
   - Check organization installation
   - Verify repository access

3. **Rate Limiting**
   - Check GitHub API rate limits
   - Review Renovate dashboard logs

4. **Branch Protection**
   - Verify branch protection rules allow automated PRs
   - Check status check requirements

#### Symptom: Updates not grouped correctly
**Cause**: Package rules not matching
**Debug**:
```json
{
  "packageRules": [
    {
      "description": "Debug ChaseNoCap packages",
      "matchPackagePatterns": ["^@chasenocap/"],
      "groupName": "ChaseNoCap packages",
      "logLevel": "debug"
    }
  ]
}
```

### Repository Dispatch Issues

#### Symptom: Package updates not triggering workflows
**Possible Causes**:

1. **Missing PAT_TOKEN in package repos**
   ```yaml
   # .github/workflows/notify-parent.yml
   - name: Notify h1b-visa-analysis
     uses: peter-evans/repository-dispatch@v2
     with:
       token: ${{ secrets.PAT_TOKEN }}  # Must exist in each repo
   ```

2. **Event type mismatch**
   ```yaml
   # Meta repo must listen for same event type
   on:
     repository_dispatch:
       types: [package-published]  # Must match sender
   ```

3. **Payload format issues**
   ```json
   // Verify payload structure
   {
     "package": "logger",
     "version": "1.0.1", 
     "repository": "ChaseNoCap/logger"
   }
   ```

### Submodule Sync Issues

#### Symptom: Submodules not updating to correct versions
**Cause**: Tag naming inconsistencies
**Solution**:
```bash
# Standardize tag format in package repos
git tag v1.0.1  # Use v prefix consistently
git push origin v1.0.1

# Update workflow to handle both formats
if git rev-parse "v${VERSION}" >/dev/null 2>&1; then
  git checkout "v${VERSION}"
elif git rev-parse "${VERSION}" >/dev/null 2>&1; then
  git checkout "${VERSION}"
else
  echo "Warning: Could not find tag"
fi
```

#### Symptom: Submodule conflicts during updates
**Solution**:
```bash
# Reset submodule to tracked commit
git submodule update --init --force

# Update to latest
git submodule update --remote --merge

# Handle conflicts manually
cd packages/[package-name]
git status  # Check for conflicts
git add .   # Stage resolved changes
cd ../..
git add packages/[package-name]
```

### Auto-merge Issues

#### Symptom: PRs not auto-merging
**Checklist**:
- [ ] Labels match auto-merge config
- [ ] Required status checks pass
- [ ] No blocking labels present
- [ ] Branch protection allows auto-merge

**Debug**:
```yaml
# Check .github/auto-merge.yml
minApprovals:
  NONE: 0
requiredLabels:
  - dependencies  # Must match PR labels
  - automated
blockingLabels:
  - do-not-merge
  - work-in-progress  # Remove if present
```

### Performance Issues

#### Symptom: Updates taking too long
**Optimizations**:

1. **Reduce check frequency**
   ```json
   {
     "schedule": ["every 2 hours"],  // Less frequent
     "prCreation": "not-pending"     // Batch updates
   }
   ```

2. **Limit concurrent PRs**
   ```json
   {
     "prConcurrentLimit": 5,  // Reduce from 20
     "prHourlyLimit": 2       // Rate limit
   }
   ```

#### Symptom: GitHub Actions timeout
**Solutions**:
- Split package updates into smaller batches
- Use matrix strategy for parallel processing
- Increase timeout in workflow

### Package Publishing Issues

#### Symptom: Packages not triggering notifications
**Debug Steps**:

1. **Check workflow triggers**
   ```yaml
   on:
     release:
       types: [published]
     push:
       tags: ['v*']
   ```

2. **Verify npm publish process**
   ```bash
   # Check if package was published
   npm view @chasenocap/[package] --registry https://npm.pkg.github.com
   ```

3. **Test notification manually**
   ```bash
   # Trigger notify workflow manually
   gh workflow run notify-parent.yml -f version=1.0.1
   ```

## Monitoring Commands

### Check Renovate Status
```bash
# View recent Renovate activity
gh api repos/ChaseNoCap/h1b-visa-analysis/actions/workflows/renovate.yml/runs

# Check dependency dashboard
curl -H "Authorization: token $TOKEN" \
  https://api.github.com/repos/ChaseNoCap/h1b-visa-analysis/contents/.github/DEPENDENCY_DASHBOARD.md
```

### Monitor Package Versions
```bash
# Check all package versions
for pkg in cache di-framework event-system file-system logger markdown-compiler prompts report-components report-templates test-helpers test-mocks; do
  echo "Checking @chasenocap/$pkg"
  npm view "@chasenocap/$pkg" version --registry https://npm.pkg.github.com
done
```

### Check Workflow Status
```bash
# List recent workflow runs
gh run list --workflow=auto-update-dependencies.yml --limit=10

# View specific run logs
gh run view [RUN_ID] --log
```

## Recovery Procedures

### Reset Renovate State
```bash
# Clear Renovate cache
curl -X POST \
  -H "Authorization: token $TOKEN" \
  https://api.renovatebot.com/webhook \
  -d '{"repository":"ChaseNoCap/h1b-visa-analysis","action":"reset"}'
```

### Manual Dependency Update
```bash
# Update specific package manually
npm update @chasenocap/logger@1.0.2

# Update submodule
cd packages/logger
git fetch --tags
git checkout v1.0.2
cd ../..

# Commit changes
git add .
git commit -m "chore: manual update @chasenocap/logger to 1.0.2"
```

### Emergency Disable
```bash
# Disable Renovate temporarily
echo '{"enabled": false}' > renovate.json

# Disable repository dispatch
# Comment out workflow_dispatch in .github/workflows/auto-update-dependencies.yml
```

## Prevention Best Practices

### 1. Consistent Tagging
```bash
# Always use semantic versioning with v prefix
git tag v1.2.3
git push origin v1.2.3
```

### 2. Test Before Merge
```yaml
# Add tests to workflow
- name: Run tests
  run: |
    npm test
    npm run build
    npm run lint
```

### 3. Gradual Rollout
- Test changes with single package first
- Monitor for 24 hours before full rollout
- Keep rollback plan ready

### 4. Documentation
- Update this guide when issues are resolved
- Document new edge cases discovered
- Maintain troubleshooting runbook

## Escalation Path

1. **Level 1**: Check this guide, common solutions
2. **Level 2**: Review GitHub Actions logs, Renovate dashboard
3. **Level 3**: Manual intervention, temporary disable
4. **Level 4**: Rollback to manual dependency management

## Contact Information

- **Primary**: Repository maintainer
- **Backup**: GitHub Issues in meta repository
- **Emergency**: Disable automation, manual updates

---

*Last updated: [DATE]*
*Next review: [QUARTERLY]*