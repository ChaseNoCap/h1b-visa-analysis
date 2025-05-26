# Unified Dependency Strategy - Troubleshooting Guide

> **Status Update (May 2025)**: The unified dependency strategy has been **fully implemented and tested**. 
> All major scenarios have been validated including local development, tag-based publishing, beta releases, 
> and end-to-end automation. The system is **production-ready**.

This guide helps resolve common issues with the unified dependency management system.

## Quick Diagnostics

Run these commands to diagnose your current state:

```bash
# Check current mode
npm run test:mode

# Check link status  
npm run dev:status

# Verify package installations
npm ls --depth=0

# Check global npm links
npm list -g --depth=0 --link
```

## Common Issues and Solutions

### 1. Authentication Errors

#### Problem: `401 Unauthorized` when running npm commands

**Symptom:**
```
npm error 401 Unauthorized - GET https://npm.pkg.github.com/...
```

**Solutions:**

1. **For Local Development (Recommended)**
   ```bash
   # You don't need authentication for local development!
   # Just use the setup script:
   npm run dev:setup
   ```

2. **If You Need Registry Access**
   ```bash
   # Set up GitHub Personal Access Token
   export PAT_TOKEN=your_github_token_here
   
   # Configure npm
   npm config set @chasenocap:registry https://npm.pkg.github.com
   npm config set //npm.pkg.github.com/:_authToken $PAT_TOKEN
   ```

3. **Token Permissions**
   Ensure your PAT has these scopes:
   - `read:packages` (required)
   - `write:packages` (for publishing)
   - `repo` (for private repos)

### 2. Link Issues

#### Problem: "Package not found" in local mode

**Symptom:**
```
Cannot find module '@chasenocap/logger'
```

**Solutions:**

1. **Rebuild All Links**
   ```bash
   # Clean and rebuild
   npm run dev:clean
   npm run dev:setup
   
   # Verify links
   npm run dev:status
   ```

2. **Check Package Build Status**
   ```bash
   # Packages must be built before linking
   cd packages/logger
   npm run build
   cd ../..
   ```

3. **Manual Link Creation**
   ```bash
   # Create link for specific package
   cd packages/logger
   npm link
   cd ../..
   npm link @chasenocap/logger
   ```

#### Problem: Links exist but changes aren't reflecting

**Solutions:**

1. **Check TypeScript Watch Mode**
   ```bash
   # Ensure build watch is running
   cd packages/logger
   npm run build:watch
   ```

2. **Verify Link Points to Correct Location**
   ```bash
   ls -la node_modules/@chasenocap/logger
   # Should show symlink to packages/logger
   ```

### 3. Mode Switching Issues

#### Problem: Can't switch from local to pipeline mode

**Solutions:**

1. **Clean Switch to Pipeline Mode**
   ```bash
   # Remove all links
   npm run dev:clean
   
   # Force registry mode
   FORCE_REGISTRY=true npm ci
   ```

2. **Verify Mode**
   ```bash
   npm run test:mode
   # Should show useRegistry: true
   ```

#### Problem: Pipeline mode using old versions

**Solutions:**

1. **Update Lock File**
   ```bash
   # Remove lock file and reinstall
   rm package-lock.json
   npm install
   ```

2. **Force Latest Versions**
   ```bash
   # Update all @chasenocap packages
   npm update @chasenocap/*
   ```

### 4. Workflow Issues

#### Problem: Tag not triggering publish

**Checklist:**

1. **Correct Tag Format**
   ```bash
   # Single package
   git tag logger@1.2.3
   
   # Ecosystem release
   git tag v1.2.3
   
   # Push tags
   git push origin --tags
   ```

2. **Check Workflow Status**
   ```bash
   # View workflow runs
   gh workflow list
   gh run list --workflow="Unified Package Workflow"
   ```

3. **Verify Secrets**
   - Ensure `PAT_TOKEN` is set in repository secrets
   - Token has required permissions

#### Problem: Publish succeeds but no notification

**Solutions:**

1. **Check Repository Dispatch**
   ```bash
   # View recent dispatches
   gh api repos/ChaseNoCap/h1b-visa-analysis/dispatches
   ```

2. **Verify Client Payload**
   Check workflow logs for the notify step

### 5. Build Errors

#### Problem: TypeScript errors after linking

**Solutions:**

1. **Rebuild All Packages**
   ```bash
   # In each package directory
   npm run build
   ```

2. **Check TypeScript Versions**
   ```bash
   # Ensure consistent versions
   npm ls typescript
   ```

3. **Clear TypeScript Cache**
   ```bash
   rm -rf dist/
   rm -rf node_modules/.cache/
   npm run build
   ```

### 6. Submodule Issues

#### Problem: Package changes not showing in git

**Solutions:**

1. **Update Submodule Reference**
   ```bash
   cd packages/logger
   git add .
   git commit -m "fix: your changes"
   git push
   
   # In meta repo
   cd ../..
   git add packages/logger
   git commit -m "chore: update logger submodule"
   ```

2. **Sync All Submodules**
   ```bash
   git submodule update --remote --merge
   ```

## Environment-Specific Issues

### CI/CD Environment

#### Problem: CI builds failing with link errors

**Solution:** CI should never use npm link
```yaml
# Ensure CI environment variable is set
env:
  CI: true
```

#### Problem: Tag builds not publishing

**Check:**
1. Workflow triggered on tags
2. PAT_TOKEN has write:packages permission
3. Package version matches tag

### Local Development

#### Problem: Performance issues with many links

**Solutions:**

1. **Link Only What You're Working On**
   ```bash
   # Link specific packages
   cd packages/logger
   npm link
   cd ../..
   npm link @chasenocap/logger
   ```

2. **Use Selective Watch**
   ```bash
   # Only watch packages you're editing
   cd packages/logger
   npm run build:watch
   ```

## Advanced Troubleshooting

### Debug Mode

Enable verbose logging:

```bash
# Verbose npm output
npm install --verbose

# Debug mode for scripts
DEBUG=* npm run dev:setup

# Node debugging
NODE_OPTIONS='--inspect' npm run dev
```

### Check npm Configuration

```bash
# View all npm config
npm config list

# Check specific values
npm config get @chasenocap:registry
npm config get registry

# Reset to defaults
npm config delete @chasenocap:registry
npm config delete //npm.pkg.github.com/:_authToken
```

### Inspect Package State

```bash
# Check package.json in node_modules
cat node_modules/@chasenocap/logger/package.json | grep version

# Compare with source
cat packages/logger/package.json | grep version

# Check resolved versions
npm ls @chasenocap/logger
```

### Force Rebuilds

```bash
# Complete clean rebuild
rm -rf node_modules package-lock.json
rm -rf packages/*/node_modules
rm -rf packages/*/dist
npm run dev:clean
npm install
npm run dev:setup
```

## Prevention Tips

### 1. Always Check Mode First
Before troubleshooting, know which mode you're in:
```bash
npm run test:mode
```

### 2. Keep Dependencies Updated
```bash
# Regular updates
npm update
cd packages/logger && npm update
```

### 3. Use Correct Commands
- Development: `npm run dev`
- Testing: `npm test`
- Publishing: Use git tags, not manual publish

### 4. Monitor CI/CD
```bash
# Watch workflow runs
gh run watch
```

## Getting Help

### 1. Check Logs
- npm logs: `~/.npm/_logs/`
- Build output: Check terminal output
- CI logs: GitHub Actions tab

### 2. Diagnostic Information
When reporting issues, include:
```bash
npm run test:mode
npm run dev:status
npm --version
node --version
git --version
```

### 3. Common Log Locations
- npm debug logs: `~/.npm/_logs/`
- TypeScript build: `dist/` directories
- Git submodules: `.git/modules/`

## Quick Reference Card

| Issue | Command | Purpose |
|-------|---------|---------|
| Check mode | `npm run test:mode` | See current dependency mode |
| Check links | `npm run dev:status` | List all package links |
| Setup dev | `npm run dev:setup` | Configure local development |
| Clean links | `npm run dev:clean` | Remove all npm links |
| Force registry | `FORCE_REGISTRY=true npm ci` | Use published packages |
| Update submodules | `git submodule update --remote` | Sync git submodules |
| View workflows | `gh run list` | Check CI/CD status |

## Summary

Most issues can be resolved by:
1. Understanding which mode you're in (`npm run test:mode`)
2. Cleaning and rebuilding (`npm run dev:clean && npm run dev:setup`)
3. Ensuring packages are built before linking
4. Using the correct commands for your environment

The unified dependency strategy is designed to "just work" - if you're having issues, you're likely in the wrong mode or missing a setup step.