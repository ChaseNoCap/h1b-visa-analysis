# Repository Creation Standard Operating Procedure

## Overview

This document provides the standardized process for creating new package repositories in the ChaseNoCap ecosystem. All repositories must follow these patterns to ensure consistency with ADR-003 (Automated Publishing Infrastructure), ADR-002 (Git Submodules Architecture), and ADR-016 (Local NPM Authentication).

## Prerequisites

Before creating a new repository, ensure you have:
- [ ] Admin access to github.com/ChaseNoCap organization
- [ ] Personal Access Token (PAT) with repo and packages scopes
- [ ] Local development environment set up with NPM_TOKEN
- [ ] Familiarity with the ecosystem's architectural decisions (ADRs)

## Repository Creation Checklist

### Step 1: Create GitHub Repository

1. **Navigate to GitHub Organization**
   - Go to https://github.com/ChaseNoCap
   - Click "New repository"

2. **Configure Repository Settings**
   ```
   Repository name: [package-name] (no @chasenocap prefix)
   Description: [Package description matching package.json]
   Visibility: Public
   Initialize: NO (we'll push existing code)
   License: MIT
   ```

3. **Initial Repository Setup**
   ```bash
   # Do NOT initialize with README or any files
   # We'll push the complete package structure
   ```

### Step 2: Configure Repository Settings

Navigate to Settings and configure:

1. **General Settings**
   - [ ] Default branch: `main`
   - [ ] Features: Enable Issues, Projects, Wiki (as needed)
   - [ ] Merge button: Allow squash merging only
   - [ ] Automatically delete head branches: ✅

2. **Branch Protection Rules** (Settings → Branches)
   
   Create rule for `main` branch:
   - [ ] Require pull request reviews before merging: ✅
   - [ ] Dismiss stale pull request approvals: ✅
   - [ ] Require status checks to pass: ✅
     - Required checks: `build`, `test`, `lint`, `typecheck`
   - [ ] Require branches to be up to date: ✅
   - [ ] Include administrators: ❌ (for emergency fixes)
   - [ ] Allow force pushes: ❌
   - [ ] Allow deletions: ❌

3. **GitHub Pages** (if documentation needed)
   - [ ] Source: Deploy from a branch
   - [ ] Branch: `gh-pages` (if applicable)

### Step 3: Configure Secrets

Navigate to Settings → Secrets and variables → Actions:

1. **Add Repository Secret**
   ```
   Name: PAT_TOKEN
   Value: [Your GitHub Personal Access Token]
   ```
   
   **Note**: This token needs scopes per ADR-016:
   - `repo` (for private repos and submodule access)
   - `write:packages` (for publishing)
   - `read:packages` (for consuming packages)

### Step 4: Configure GitHub Packages

1. **Package Visibility** (Settings → Packages)
   - [ ] Ensure package visibility matches repository (usually public)
   - [ ] Link repository to package after first publish

2. **Package Settings in package.json**
   ```json
   {
     "name": "@chasenocap/[package-name]",
     "publishConfig": {
       "registry": "https://npm.pkg.github.com"
     },
     "repository": {
       "type": "git",
       "url": "git+https://github.com/ChaseNoCap/[package-name].git"
     }
   }
   ```

### Step 5: Deploy Unified Package Workflow

1. **Create Workflow Directory**
   ```bash
   mkdir -p .github/workflows
   ```

2. **Add Unified Package Workflow** (per ADR-003)
   
   Create `.github/workflows/unified-workflow.yml`:
   ```yaml
   name: Unified Package Workflow
   
   on:
     push:
       branches: [main]
       tags: ['v*.*.*']
     pull_request:
       branches: [main]
   
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         
         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '20'
             cache: 'npm'
         
         - name: Configure npm for GitHub Packages
           run: |
             npm config set @chasenocap:registry https://npm.pkg.github.com
             npm config set //npm.pkg.github.com/:_authToken ${{ secrets.PAT_TOKEN }}
             npm config set registry https://registry.npmjs.org/
         
         - name: Install dependencies
           run: npm ci
         
         - name: Build
           run: npm run build
         
         - name: Lint
           run: npm run lint
         
         - name: Type Check
           run: npm run typecheck
         
         - name: Test
           run: npm test
         
         - name: Test Coverage
           run: npm run test:coverage
   
     publish:
       needs: test
       runs-on: ubuntu-latest
       if: startsWith(github.ref, 'refs/tags/v')
       steps:
         - uses: actions/checkout@v4
         
         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '20'
             cache: 'npm'
         
         - name: Configure npm for GitHub Packages
           run: |
             npm config set @chasenocap:registry https://npm.pkg.github.com
             npm config set //npm.pkg.github.com/:_authToken ${{ secrets.PAT_TOKEN }}
             npm config set registry https://registry.npmjs.org/
             echo "NPM configuration:"
             npm config list
         
         - name: Install dependencies
           run: npm ci
         
         - name: Build
           run: npm run build
         
         - name: Publish to GitHub Packages
           run: npm publish
           env:
             NODE_AUTH_TOKEN: ${{ secrets.PAT_TOKEN }}
         
         - name: Create GitHub Release
           uses: actions/create-release@v1
           env:
             GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
           with:
             tag_name: ${{ github.ref_name }}
             release_name: Release ${{ github.ref_name }}
             draft: false
             prerelease: false
   
     notify:
       needs: publish
       runs-on: ubuntu-latest
       if: success()
       steps:
         - name: Notify parent repository
           run: |
             curl -X POST \
               -H "Authorization: token ${{ secrets.PAT_TOKEN }}" \
               -H "Accept: application/vnd.github.v3+json" \
               https://api.github.com/repos/ChaseNoCap/h1b-visa-analysis/dispatches \
               -d '{
                 "event_type": "package-published",
                 "client_payload": {
                   "package": "${{ github.event.repository.name }}",
                   "version": "${{ github.ref_name }}",
                   "repository": "${{ github.repository }}"
                 }
               }'
   ```

### Step 6: Configure NPM Authentication

1. **Add .npmrc File** (per ADR-016)
   
   Create `.npmrc` in repository root:
   ```
   @chasenocap:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NPM_TOKEN}
   ```

2. **Update .gitignore**
   ```
   # Ensure .npmrc is tracked (it uses env variable)
   # Do NOT add .npmrc to .gitignore
   ```

### Step 7: Standard Repository Files

1. **README.md**
   - Package name and description
   - Installation instructions
   - Usage examples
   - API documentation
   - Contributing guidelines
   - License information

2. **CLAUDE.md** (per ecosystem standards)
   - Package overview
   - Key responsibilities
   - Architecture & design
   - Usage patterns
   - Testing guidelines
   - Integration points
   - Common issues & solutions
   - Package principles

3. **LICENSE** (MIT)
   ```
   MIT License
   
   Copyright (c) 2025 ChaseNoCap
   
   [Standard MIT license text]
   ```

4. **TypeScript Configuration** (`tsconfig.json`)
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "ES2022",
       "moduleResolution": "node",
       "outDir": "./dist",
       "rootDir": "./src",
       "declaration": true,
       "declarationMap": true,
       "sourceMap": true,
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true,
       "experimentalDecorators": true,
       "emitDecoratorMetadata": true,
       "resolveJsonModule": true,
       "isolatedModules": true
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules", "dist", "tests"]
   }
   ```

5. **ESLint Configuration** (`eslint.config.js`)
   - Use flat config format
   - Include TypeScript plugin
   - Include Prettier integration

6. **Vitest Configuration** (`vitest.config.ts`)
   - Coverage thresholds (90% target)
   - Test setup file
   - Environment configuration

### Step 8: Package.json Configuration

Ensure package.json includes:

```json
{
  "name": "@chasenocap/[package-name]",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "src",
    "README.md",
    "LICENSE",
    "CLAUDE.md"
  ],
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src tests --ext .ts",
    "lint:fix": "eslint src tests --ext .ts --fix",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist coverage",
    "prepublishOnly": "npm run clean && npm run build && npm test"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ChaseNoCap/[package-name].git"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "tier": "shared"
}
```

**Note**: The `tier` field is used by smart-deps.js for package grouping:
- `core`: Immediate updates (di-framework, logger)
- `shared`: 5-minute batching (most packages)
- `app`: 15-minute coordination (UI packages)

### Step 9: Push Initial Code

1. **Initialize Git and Push**
   ```bash
   cd packages/[package-name]
   git init
   git remote add origin git@github.com:ChaseNoCap/[package-name].git
   git add .
   git commit -m "feat: initial implementation"
   git branch -M main
   git push -u origin main
   ```

2. **Create Initial Tag** (triggers publish)
   ```bash
   git tag -a v1.0.0 -m "feat: initial release"
   git push origin v1.0.0
   ```

### Step 10: Verify Automation

1. **Check GitHub Actions**
   - [ ] Workflow triggered on tag push
   - [ ] All quality gates pass (build, test, lint, typecheck)
   - [ ] Package published successfully
   - [ ] Repository dispatch notification sent

2. **Verify Package Publication**
   - [ ] Package visible at github.com/orgs/ChaseNoCap/packages
   - [ ] Package installable via npm

3. **Check Meta Repository Integration**
   - [ ] Auto-update PR created in h1b-visa-analysis
   - [ ] Submodule reference will be added in next step

## Post-Creation Steps

1. **Add to Meta Repository** (per ADR-002)
   ```bash
   cd h1b-visa-analysis
   git submodule add https://github.com/ChaseNoCap/[package-name].git packages/[package-name]
   git add .gitmodules packages/[package-name]
   git commit -m "feat: add [package-name] as submodule"
   ```

2. **Update Dependencies**
   - Add to meta repository package.json
   - Update smart-deps.js PACKAGE_TIERS if needed

3. **Documentation**
   - Update package catalog documentation
   - Add to ADR validation results

## Validation Checklist

Before considering the repository ready:

- [ ] Repository created with correct settings
- [ ] Branch protection rules active
- [ ] PAT_TOKEN secret configured
- [ ] Unified Package Workflow deployed
- [ ] NPM authentication configured (.npmrc)
- [ ] All standard files present
- [ ] Initial version tagged and published
- [ ] Package visible in GitHub Packages
- [ ] Repository dispatch working
- [ ] Added as submodule to meta repository

## Troubleshooting

### Common Issues

1. **Workflow Not Triggering**
   - Verify PAT_TOKEN has workflow scope
   - Check branch protection rules aren't blocking
   - Ensure tag format matches pattern (v*.*.*)

2. **NPM Authentication Failures**
   - Verify PAT_TOKEN has packages:write scope
   - Check npm config in workflow
   - Ensure .npmrc uses ${NPM_TOKEN} pattern

3. **Repository Dispatch Not Working**
   - Verify PAT_TOKEN has repo scope
   - Check meta repository allows dispatch events
   - Verify JSON payload format

## References

- **ADR-002**: Git Submodules Architecture
- **ADR-003**: Automated Publishing Infrastructure (Dual-Mode Architecture)
- **ADR-016**: Local NPM Authentication Strategy
- **Existing Examples**: github.com/ChaseNoCap/cache, github.com/ChaseNoCap/logger