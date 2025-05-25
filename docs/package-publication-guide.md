# GitHub Packages Registry Publication Guide

This guide covers the complete process for publishing private NPM packages from the h1b-visa-analysis monorepo to GitHub Packages Registry.

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Package Configuration](#package-configuration)
4. [Authentication Setup](#authentication-setup)
5. [GitHub Actions Automation](#github-actions-automation)
6. [Versioning Strategies](#versioning-strategies)
7. [Inter-Package Dependencies](#inter-package-dependencies)
8. [Consuming Private Packages](#consuming-private-packages)
9. [Best Practices](#best-practices)
10. [Common Pitfalls](#common-pitfalls)
11. [Package-Specific Examples](#package-specific-examples)

## Overview

GitHub Packages Registry allows you to host and manage private npm packages alongside your code. For a monorepo, this enables:
- Private package hosting with authentication
- Automated publishing via GitHub Actions
- Version management integrated with git tags
- Dependency resolution between private packages

## Prerequisites

1. **GitHub Repository**: Your monorepo must be hosted on GitHub
2. **Personal Access Token (PAT)**: Required for authentication
3. **Node.js**: Version 16+ recommended
4. **npm**: Version 7+ (for workspaces support)

## Package Configuration

### 1. Package Naming Convention

GitHub Packages requires scoped package names matching your GitHub username or organization:

```json
{
  "name": "@chasenogap/di-framework"
}
```

### 2. Complete package.json Configuration

Each package needs specific fields configured:

```json
{
  "name": "@chasenogap/di-framework",
  "version": "1.0.0",
  "description": "Dependency injection framework",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "src",
    "README.md",
    "CLAUDE.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "prepublishOnly": "npm run build && npm test"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ChaseNoCap/h1b-visa-analysis.git",
    "directory": "packages/di-framework"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com",
    "access": "restricted"
  },
  "keywords": ["dependency-injection", "typescript", "inversify"],
  "author": "ChaseNoCap",
  "license": "MIT",
  "engines": {
    "node": ">=16.0.0"
  }
}
```

### 3. TypeScript Configuration

Ensure each package has its own `tsconfig.json`:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.test.ts", "**/*.spec.ts"]
}
```

## Authentication Setup

### 1. Create Personal Access Token (PAT)

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with scopes:
   - `read:packages` - Download packages
   - `write:packages` - Upload packages
   - `delete:packages` - Delete packages (optional)
   - `repo` - Access private repositories

### 2. Local .npmrc Configuration

#### Global Configuration (~/.npmrc)
```ini
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@chasenogap:registry=https://npm.pkg.github.com
```

#### Project Root .npmrc
```ini
@chasenogap:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
always-auth=true
```

#### Per-Package .npmrc (packages/*/npmrc)
```ini
@chasenogap:registry=https://npm.pkg.github.com
```

### 3. Environment Variable Setup

```bash
# Add to your shell profile (.bashrc, .zshrc, etc.)
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Or use .env file (remember to add to .gitignore)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## GitHub Actions Automation

### 1. Manual Release Workflow

Create `.github/workflows/publish-package.yml`:

```yaml
name: Publish Package

on:
  workflow_dispatch:
    inputs:
      package:
        description: 'Package to publish'
        required: true
        type: choice
        options:
          - di-framework
          - test-mocks
          - test-helpers
          - file-system
          - cache
          - report-templates
          - event-system
          - prompts
      version:
        description: 'Version bump type'
        required: true
        type: choice
        options:
          - patch
          - minor
          - major
          - prepatch
          - preminor
          - premajor
          - prerelease

permissions:
  contents: write
  packages: write

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'
          
      - name: Configure Git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build all packages
        run: npm run build:all
        
      - name: Run tests
        run: npm run test:all
        
      - name: Version and Publish
        working-directory: packages/${{ github.event.inputs.package }}
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          npm version ${{ github.event.inputs.version }}
          npm publish
          
      - name: Push version tags
        run: |
          git push --follow-tags
```

### 2. Automated Release on Tag

Create `.github/workflows/publish-on-tag.yml`:

```yaml
name: Publish Tagged Package

on:
  push:
    tags:
      - '@chasenogap/*@*'

permissions:
  contents: read
  packages: write

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'
          
      - name: Extract package info
        id: package
        run: |
          TAG=${GITHUB_REF#refs/tags/}
          PACKAGE=$(echo $TAG | cut -d'@' -f2 | cut -d'/' -f2)
          VERSION=$(echo $TAG | cut -d'@' -f3)
          echo "package=$PACKAGE" >> $GITHUB_OUTPUT
          echo "version=$VERSION" >> $GITHUB_OUTPUT
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build package
        working-directory: packages/${{ steps.package.outputs.package }}
        run: npm run build
        
      - name: Publish package
        working-directory: packages/${{ steps.package.outputs.package }}
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npm publish
```

### 3. Batch Publishing Workflow

Create `.github/workflows/publish-all-packages.yml`:

```yaml
name: Publish All Packages

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version bump type for all packages'
        required: true
        type: choice
        options:
          - patch
          - minor
          - major

permissions:
  contents: write
  packages: write

jobs:
  publish:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        package:
          - di-framework
          - test-mocks
          - test-helpers
          - file-system
          - cache
          - report-templates
          - event-system
          - prompts
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'
          
      - name: Configure Git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build all packages
        run: npm run build:all
        
      - name: Version and Publish ${{ matrix.package }}
        working-directory: packages/${{ matrix.package }}
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          npm version ${{ github.event.inputs.version }} --no-git-tag-version
          npm publish
          
      - name: Commit version changes
        run: |
          git add packages/*/package.json
          git commit -m "chore: bump versions for release"
          git push
```

## Versioning Strategies

### 1. Independent Versioning (Recommended)

Each package maintains its own version:

```bash
# Version individual packages
cd packages/di-framework
npm version patch  # 1.0.0 → 1.0.1

# Creates git tag: @chasenogap/di-framework@1.0.1
```

### 2. Synchronized Versioning

All packages share the same version:

```bash
# Script to version all packages
for package in packages/*; do
  if [ -f "$package/package.json" ]; then
    cd "$package"
    npm version patch --no-git-tag-version
    cd ../..
  fi
done
git add packages/*/package.json
git commit -m "chore: bump all packages to v1.0.1"
git tag v1.0.1
git push --tags
```

### 3. Semantic Release Integration

Use `semantic-release` for automated versioning:

```json
{
  "release": {
    "branches": ["main"],
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/npm",
      "@semantic-release/github"
    ]
  }
}
```

## Inter-Package Dependencies

### 1. Workspace Protocol (Development)

During development, use workspace protocol:

```json
{
  "dependencies": {
    "@chasenogap/di-framework": "workspace:*"
  }
}
```

### 2. Published Package References (Production)

Before publishing, update to specific versions:

```json
{
  "dependencies": {
    "@chasenogap/di-framework": "^1.0.0"
  }
}
```

### 3. Dependency Update Script

Create `scripts/update-internal-deps.js`:

```javascript
const fs = require('fs');
const path = require('path');

const packages = fs.readdirSync('packages');
const versions = {};

// Collect all package versions
packages.forEach(pkg => {
  const pkgPath = path.join('packages', pkg, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    versions[pkgJson.name] = pkgJson.version;
  }
});

// Update dependencies
packages.forEach(pkg => {
  const pkgPath = path.join('packages', pkg, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    
    // Update dependencies
    ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
      if (pkgJson[depType]) {
        Object.keys(pkgJson[depType]).forEach(dep => {
          if (versions[dep]) {
            pkgJson[depType][dep] = `^${versions[dep]}`;
          }
        });
      }
    });
    
    fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2) + '\n');
  }
});
```

## Consuming Private Packages

### 1. Project Setup

For projects consuming your private packages:

```bash
# Create .npmrc in project root
echo "@chasenogap:registry=https://npm.pkg.github.com" > .npmrc
echo "//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}" >> .npmrc

# Set environment variable
export GITHUB_TOKEN="your-pat-token"

# Install packages
npm install @chasenogap/di-framework @chasenogap/logger
```

### 2. CI/CD Configuration

For GitHub Actions:

```yaml
- name: Install dependencies
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: |
    echo "@chasenogap:registry=https://npm.pkg.github.com" > .npmrc
    echo "//npm.pkg.github.com/:_authToken=\${NODE_AUTH_TOKEN}" >> .npmrc
    npm ci
```

### 3. Docker Configuration

For Docker builds:

```dockerfile
FROM node:18

# Pass token as build argument
ARG GITHUB_TOKEN

# Configure npm
RUN echo "@chasenogap:registry=https://npm.pkg.github.com" > ~/.npmrc && \
    echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> ~/.npmrc

# Copy and install
WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN rm ~/.npmrc  # Remove token after install

COPY . .
RUN npm run build
```

## Best Practices

### 1. Security
- **Never commit tokens**: Add `.npmrc` with tokens to `.gitignore`
- **Use secrets in CI**: Store PAT as GitHub Secret
- **Rotate tokens regularly**: Set expiration dates on PATs
- **Minimal token scope**: Only grant necessary permissions

### 2. Package Quality
- **Always build before publish**: Use `prepublishOnly` script
- **Include TypeScript definitions**: Ship `.d.ts` files
- **Document breaking changes**: Use semantic versioning
- **Test before release**: Run full test suite

### 3. Monorepo Management
- **Use npm workspaces**: Simplifies dependency management
- **Consistent tooling**: Same build/test commands across packages
- **Shared configurations**: Extend base tsconfig/eslint configs
- **Automated checks**: Lint, test, and build in CI

### 4. Publishing Checklist
```markdown
- [ ] Update CHANGELOG.md
- [ ] Run tests locally
- [ ] Update internal dependencies
- [ ] Build all packages
- [ ] Bump version appropriately
- [ ] Create git tag
- [ ] Push to GitHub
- [ ] Verify package published
- [ ] Update consuming projects
```

## Common Pitfalls

### 1. Authentication Issues

**Problem**: `npm ERR! 401 Unauthorized`

**Solutions**:
- Verify token has `write:packages` scope
- Check token hasn't expired
- Ensure `.npmrc` is properly configured
- Token must be set as environment variable

### 2. Naming Conflicts

**Problem**: `npm ERR! 403 Forbidden - Package name not allowed`

**Solutions**:
- Use your GitHub username/org as scope
- Ensure package.json name matches exactly
- Check repository permissions

### 3. Missing Build Artifacts

**Problem**: Published package is empty or missing files

**Solutions**:
- Add `files` field to package.json
- Run build in `prepublishOnly` script
- Verify `dist/` folder exists before publish

### 4. Circular Dependencies

**Problem**: Package A depends on B, B depends on A

**Solutions**:
- Extract shared code to new package
- Use peer dependencies
- Refactor to remove circular dependency

### 5. Version Conflicts

**Problem**: Incompatible versions between packages

**Solutions**:
- Use exact versions for internal deps
- Update all packages together
- Use `npm-check-updates` tool

## Package-Specific Examples

### di-framework Configuration

```json
{
  "name": "@chasenogap/di-framework",
  "version": "1.0.0",
  "description": "Lightweight dependency injection framework",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "src", "README.md", "CLAUDE.md"],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ChaseNoCap/h1b-visa-analysis.git",
    "directory": "packages/di-framework"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com",
    "access": "restricted"
  },
  "dependencies": {
    "inversify": "^6.0.2",
    "reflect-metadata": "^0.2.1"
  }
}
```

### test-helpers with Internal Dependency

```json
{
  "name": "@chasenogap/test-helpers",
  "version": "1.0.0",
  "dependencies": {
    "@chasenogap/test-mocks": "^1.0.0",
    "vitest": "^1.2.0"
  },
  "peerDependencies": {
    "@chasenogap/di-framework": "^1.0.0"
  }
}
```

### Publishing Commands

```bash
# First-time setup
cd packages/di-framework
npm run build
npm test

# Manual publish
npm login --registry=https://npm.pkg.github.com
npm publish

# With version bump
npm version patch
npm publish

# Automated via GitHub Actions
# Push tag: @chasenogap/di-framework@1.0.1
git tag @chasenogap/di-framework@1.0.1
git push --tags
```

## Migration Path

### Phase 1: Package Preparation
1. Update all package.json files with proper configuration
2. Add .npmrc files to each package
3. Ensure all packages build correctly
4. Update inter-package dependencies

### Phase 2: Initial Publishing
1. Set up GitHub PAT with proper scopes
2. Configure local environment
3. Manually publish each package in dependency order:
   - di-framework (no deps)
   - test-mocks (depends on di-framework)
   - test-helpers (depends on test-mocks)
   - file-system, cache, event-system (depend on di-framework)
   - report-templates (depends on multiple)

### Phase 3: Automation
1. Set up GitHub Actions workflows
2. Configure secrets in repository
3. Test automated publishing with patch versions
4. Document process for team

### Phase 4: Consumer Updates
1. Update main project to use published packages
2. Remove packages from workspaces array
3. Update CI/CD pipelines
4. Test full build and deployment

## Troubleshooting Commands

```bash
# Verify authentication
npm whoami --registry=https://npm.pkg.github.com

# View package info
npm view @chasenogap/di-framework --registry=https://npm.pkg.github.com

# List all versions
npm view @chasenogap/di-framework versions --registry=https://npm.pkg.github.com

# Debug publishing issues
npm publish --dry-run

# Clear npm cache if needed
npm cache clean --force

# Check package contents before publish
npm pack
tar -tzf chasenogap-di-framework-1.0.0.tgz
```

## Conclusion

Publishing private packages to GitHub Packages Registry provides a secure, integrated solution for managing monorepo packages. Follow this guide to ensure smooth setup, publishing, and consumption of your packages across projects.

Remember to:
- Keep tokens secure
- Version packages semantically
- Automate where possible
- Document breaking changes
- Test thoroughly before publishing

For additional help, consult the [GitHub Packages documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).