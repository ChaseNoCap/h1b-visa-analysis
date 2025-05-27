# Package Operations Guide

## Overview

This guide covers package management operations for the h1b-visa-analysis ecosystem, including publishing, versioning, and dependency management across 11 Git submodule packages.

## Current Architecture

**Package Registry**: GitHub Packages (@chasenocap scope)  
**Package Structure**: 11 independent Git submodules  
**Publishing Strategy**: Tag-based automated publishing  
**Development Mode**: npm link for instant local updates  

## Quick Reference

### Package Status
All 11 packages are published and operational:
- Core: `di-framework`, `logger`
- Shared: `cache`, `file-system`, `event-system`, `test-mocks`, `test-helpers`  
- Application: `report-templates`, `markdown-compiler`, `report-components`, `prompts`

### Key Commands
```bash
# Check package status
npm run dev:status

# Publish tagged package
git tag package-name@1.2.3
git push origin main --tags

# Setup local development
npm run dev:setup
```

## Package Publishing

### Automated Publishing (Recommended)

All packages use tag-based automated publishing:

1. **Tag the release**:
   ```bash
   cd packages/logger
   git tag v1.2.3 -m "feat: new logging features"
   git push origin main --tags
   ```

2. **Workflow triggers automatically**:
   - Builds and tests package
   - Publishes to GitHub Packages
   - Notifies meta repository
   - Creates dependency update PR

### Publishing Workflow Details

Each package has a standardized workflow:

```yaml
name: Publish Package
on:
  push:
    tags: ['v*.*.*']

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Configure npm authentication
        run: |
          npm config set @chasenocap:registry https://npm.pkg.github.com
          npm config set //npm.pkg.github.com/:_authToken ${{ secrets.PAT_TOKEN }}
          
      - name: Build and test
        run: |
          npm ci
          npm run build
          npm test
          
      - name: Publish
        run: npm publish
        
      - name: Notify meta repository
        run: |
          curl -X POST ${{ secrets.META_REPO_WEBHOOK }} \
            -d '{"package": "${{ github.repository }}", "version": "${{ github.ref_name }}"}'
```

### Quality Gates

Packages must pass quality gates before publishing:
- **Tests**: All tests must pass
- **Build**: TypeScript compilation must succeed
- **Linting**: Code must pass ESLint checks
- **Coverage**: Test coverage targets should be met

## Versioning Strategy

### Semantic Versioning
All packages follow [semantic versioning](https://semver.org/):
- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backwards compatible
- **PATCH** (0.0.1): Bug fixes, backwards compatible

### Version Coordination

**Independent Versioning**: Each package has its own version lifecycle  
**Tier-Based Updates**: Strategic grouping prevents update fatigue

```javascript
const PACKAGE_TIERS = {
  core: ['di-framework', 'logger'],          // Immediate updates
  shared: ['cache', 'file-system', '...'],   // 5-minute batching
  app: ['report-templates', 'prompts']       // 15-minute coordination
};
```

### Pre-release Versions

Use pre-release tags for testing:
```bash
# Beta release
git tag v1.2.0-beta.1

# Release candidate
git tag v1.2.0-rc.1
```

## Dependency Management

### Inter-Package Dependencies

Packages reference each other using published versions:

```json
{
  "dependencies": {
    "@chasenocap/logger": "^1.0.0",
    "@chasenocap/di-framework": "^1.0.0"
  }
}
```

### Dependency Update Flow

1. **Package publishes** → GitHub webhook triggers
2. **Meta repository** receives notification  
3. **Renovate** creates update PR within minutes
4. **Auto-merge** if all tests pass
5. **Submodule sync** updates Git references

### Development Dependencies

For development, use npm link for instant updates:
```bash
npm run dev:setup  # Links all packages automatically
```

## Package Configuration

### Required package.json Fields

```json
{
  "name": "@chasenocap/package-name",
  "version": "1.0.0",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/ChaseNoCap/package-name.git"
  },
  "files": ["dist", "README.md"],
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}
```

### Authentication Configuration

Packages automatically configure authentication in workflows:
```bash
npm config set @chasenocap:registry https://npm.pkg.github.com
npm config set //npm.pkg.github.com/:_authToken ${{ secrets.PAT_TOKEN }}
```

## Local Development

### Setup Development Environment

```bash
# One-time setup
npm run dev:setup

# Start development with links
npm run dev

# Check link status
npm run dev:status
```

### Testing Package Changes

```bash
# Test in package directory
cd packages/logger
npm test

# Test integration in meta repo
cd ../../
npm test  # Uses linked packages automatically
```

### Switching Between Modes

```bash
# Use published versions (pipeline mode)
FORCE_REGISTRY=true npm ci

# Switch back to links (development mode)
npm run dev:setup
```

## Consuming Packages

### In Meta Repository

The meta repository automatically consumes all packages:

```typescript
// Import from published packages
import { ILogger } from '@chasenocap/logger';
import { injectable, inject } from '@chasenocap/di-framework';
```

### In External Projects

External projects need authentication:

```bash
# Configure registry
npm config set @chasenocap:registry https://npm.pkg.github.com
npm config set //npm.pkg.github.com/:_authToken YOUR_TOKEN

# Install packages
npm install @chasenocap/logger
```

## Monitoring and Troubleshooting

### Package Health Monitoring

```bash
# Check publishing status
./scripts/monitor-ci-health.sh

# View package-specific metrics
./scripts/generate-ci-dashboard.sh
```

### Common Issues

#### Authentication Failures
**Symptoms**: 401 errors during publish
**Resolution**:
1. Verify PAT_TOKEN has `packages:write` scope
2. Check npm configuration uses `npm config set` not `.npmrc`
3. Ensure token hasn't expired

#### Failed Quality Gates
**Symptoms**: Package fails to publish
**Expected Behavior**: This is correct - broken packages should not publish
**Resolution**: Fix failing tests, build errors, or linting issues

#### Version Conflicts
**Symptoms**: Dependency resolution errors
**Resolution**:
1. Check for circular dependencies
2. Verify version ranges are compatible
3. Update package-lock.json if needed

#### Link Issues in Development
**Symptoms**: Changes not reflected across packages
**Resolution**:
```bash
# Rebuild all links
npm run dev:setup --force

# Verify links
npm run dev:status
```

## Best Practices

### Package Design
- **Single Purpose**: Each package should have one clear responsibility
- **Small Size**: Target <1000 lines of code for maintainability
- **Clear API**: Export only necessary interfaces
- **Good Tests**: Maintain >90% test coverage where applicable

### Versioning
- **Tag Consistently**: Use semantic version tags (v1.2.3)
- **Document Changes**: Include meaningful tag messages
- **Test Before Tagging**: Ensure all tests pass locally
- **Coordinate Major Versions**: Plan breaking changes across packages

### Development Workflow
- **Use Links Locally**: Develop with npm link for speed
- **Tag for Integration**: Use tags to trigger full pipeline testing
- **Monitor Health**: Check CI dashboards regularly
- **Update Dependencies**: Keep packages current with security updates

### Documentation
- **Keep Current**: Update README files with API changes
- **Examples**: Provide clear usage examples
- **Migration Guides**: Document breaking changes
- **CLAUDE.md**: Maintain AI context files for each package

## Security Considerations

### Access Control
- **Scoped Packages**: Use @chasenocap scope for namespace isolation
- **Private Registry**: GitHub Packages provides access control
- **Token Management**: Rotate PAT tokens regularly
- **Minimal Permissions**: Grant only necessary repository access

### Dependency Security
- **Automated Updates**: Renovate handles security patches
- **Audit Regularly**: Run `npm audit` in packages
- **Monitor Vulnerabilities**: GitHub security alerts enabled
- **Review Dependencies**: Evaluate new dependencies carefully

## Package Catalog Reference

For detailed information about each package:
- **Package Details**: See `/docs/package-catalog.md`
- **Architecture**: See `/docs/architecture-reference.md`  
- **Individual CLAUDE.md**: Each package has its own context file

## Advanced Operations

### Batch Operations

```bash
# Test all packages
./scripts/test-all-packages.sh

# Check package sizes
./scripts/check-package-sizes.sh

# Validate all packages
./scripts/validate-all-packages.sh
```

### Emergency Procedures

#### Rollback Package Version
```bash
# Publish previous version
cd packages/problematic-package
npm publish --tag previous-version

# Update meta repository
cd ../../
npm install @chasenocap/package@previous-version
```

#### Fix Broken Publication
```bash
# Re-run quality gates
cd packages/failing-package
npm run build && npm test

# Force republish if needed
npm publish --force
```

## Related Documentation

- **Unified Strategy**: `/docs/unified-dependency-strategy.md` - Overall approach
- **Developer Guide**: `/docs/unified-dependency-developer-guide.md` - Daily workflows
- **Troubleshooting**: `/docs/unified-dependency-troubleshooting.md` - Issue resolution
- **CI Operations**: `/docs/ci-monitoring-operations-guide.md` - Health monitoring
- **Package Catalog**: `/docs/package-catalog.md` - Detailed package information
