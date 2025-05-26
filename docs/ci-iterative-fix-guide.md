# CI Iterative Fix Guide

## Overview

This guide provides a systematic approach to fixing CI failures across the package ecosystem using the monitoring dashboard as a feedback loop.

## Current Status (May 2025)

- **Overall Health**: 🔴 Critical (54%)
- **Failing Packages**: 5/11
  - ❌ di-framework
  - ❌ event-system  
  - ❌ file-system
  - ❌ logger
  - ❌ test-helpers

## Iterative Fix Process

### Step 1: Generate Baseline Dashboard
```bash
./scripts/generate-ci-dashboard.sh
```

### Step 2: Identify Priority Order

Fix packages in this order:
1. **Core Dependencies First**: Packages that others depend on
2. **Simple Fixes**: Quick wins to improve health score
3. **Complex Issues**: Tackle after dependencies are stable

**Recommended Order:**
1. logger (core dependency, likely simple)
2. file-system (core dependency)
3. test-helpers (testing infrastructure)
4. di-framework (has open PR)
5. event-system (depends on di-framework)

### Step 3: Fix Process for Each Package

```bash
# 1. Navigate to package
cd packages/[package-name]

# 2. Check recent failure logs
gh run list --workflow ci --status failure --limit 1
gh run view [run-id] --log-failed

# 3. Common fixes:
# Update dependencies
npm update
npm audit fix

# Clear caches
rm -rf node_modules package-lock.json
npm install

# Run tests locally
npm test
npm run lint
npm run build

# 4. Commit fixes
git add .
git commit -m "fix: resolve CI failures"
git push

# 5. Return to meta repo
cd ../..

# 6. Update submodule reference
git add packages/[package-name]
git commit -m "chore: update [package-name] submodule"
```

### Step 4: Verify Fix
```bash
# Wait 2-3 minutes for CI to run
# Then regenerate dashboard
./scripts/generate-ci-dashboard.sh

# Check if package is now ✅
grep "[package-name]" docs/ci-dashboard.md
```

### Step 5: Repeat Until All Green

Continue with next failing package until dashboard shows 100% health.

## Common CI Failure Patterns

### 1. Outdated Dependencies
**Symptoms**: Security vulnerabilities, peer dependency warnings
**Fix**: 
```bash
npm update
npm audit fix --force
```

### 2. Type Errors
**Symptoms**: TypeScript compilation failures
**Fix**:
```bash
npm run typecheck
# Fix reported errors
npm run build
```

### 3. Test Failures
**Symptoms**: Jest/Vitest test failures
**Fix**:
```bash
npm test -- --no-coverage
# Fix failing tests
npm test
```

### 4. Linting Issues
**Symptoms**: ESLint errors
**Fix**:
```bash
npm run lint
npm run lint -- --fix
```

### 5. Missing Dependencies
**Symptoms**: Cannot find module errors
**Fix**:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Automation Helpers

### Batch Check All Packages
```bash
# Check all package CI status
for pkg in cache di-framework event-system file-system logger markdown-compiler prompts report-components report-templates test-helpers test-mocks; do
  echo "=== $pkg ==="
  gh run list --repo ChaseNoCap/$pkg --workflow ci --limit 1
done
```

### Quick Fix Script
```bash
#!/bin/bash
# Save as scripts/quick-fix-package.sh

PACKAGE=$1
cd packages/$PACKAGE
npm update
npm audit fix
npm test
if [ $? -eq 0 ]; then
  git add .
  git commit -m "fix: resolve CI failures"
  git push
  cd ../..
  git add packages/$PACKAGE
  git commit -m "chore: update $PACKAGE submodule"
  echo "✅ $PACKAGE fixed!"
else
  echo "❌ $PACKAGE still has issues"
fi
```

## Success Metrics

Track progress with these metrics:
- Health Score: Target 100%
- Failing Packages: Target 0
- All workflows: Green checkmarks
- Zero open Renovate PRs (all merged)

## Tips for Efficiency

1. **Run fixes in parallel**: Open multiple terminal tabs
2. **Use the dashboard**: Regenerate after each fix
3. **Check dependencies**: Some failures cascade
4. **Local verification**: Always test locally first
5. **Commit granularly**: One fix per commit for easy rollback

## Post-Fix Checklist

After all packages are green:
- [ ] All 11 packages showing ✅ in dashboard
- [ ] Meta repository CI passing
- [ ] No PR conflicts
- [ ] Renovate PRs merging automatically
- [ ] Health score at 100%
- [ ] Document any special fixes needed

## Maintenance

Once all green, maintain health by:
1. Running dashboard daily
2. Addressing failures immediately
3. Keeping dependencies updated
4. Monitoring Renovate activity