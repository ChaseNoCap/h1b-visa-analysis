# Publishing Next Steps

## Current Status

### ✅ Completed
1. **cache package**: Implemented and built with Cacheable/InvalidateCache decorators
2. **markdown-compiler**: Now builds successfully (was blocked by cache)
3. **report-components**: Has H1B content, package name updated
4. **Publishing workflows**: Already configured in `.github/workflows/`
5. **Package configurations**: All have proper package.json and .npmrc files

### 🔄 Package Dependencies Order
```
1. First wave (no internal deps):
   - di-framework ✅
   - prompts ✅
   - inversify (external)

2. Second wave (depend on first wave):
   - event-system ✅ (needs di-framework)
   - file-system ✅ (needs inversify)
   - cache ✅ Built (needs di-framework)

3. Third wave (multiple deps):
   - test-mocks ✅ (needs event-system)
   - report-templates ✅ (needs di-framework, file-system)
   - markdown-compiler ✅ Built (needs cache)

4. Fourth wave:
   - test-helpers ✅ (needs test-mocks)
   - report-components ✅ Has content (standalone)
```

## Required Actions

### 1. Set Up GitHub PAT Token
```bash
# Create token at: https://github.com/settings/tokens
# Required scopes:
# - read:packages
# - write:packages  
# - repo (for private repos)

# Add to environment:
export NPM_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 2. Publish New/Updated Packages

Since some packages are already published, we need to publish only the new ones:

```bash
# Set token
export NODE_AUTH_TOKEN=$NPM_TOKEN

# 1. Publish cache (new implementation)
cd packages/cache
npm publish

# 2. Publish markdown-compiler (now that cache is available)
cd ../markdown-compiler  
npm publish

# 3. Publish report-components
cd ../report-components
npm publish
```

### 3. Update Main package.json

Replace file dependencies with versioned dependencies:

```json
{
  "dependencies": {
    "@chasenocap/cache": "^1.0.0",
    "@chasenocap/di-framework": "^1.0.0",
    "@chasenocap/event-system": "^1.0.3",
    "@chasenocap/file-system": "^1.0.0",
    "@chasenocap/logger": "^1.0.0",
    "@chasenocap/markdown-compiler": "^0.1.0",
    "@chasenocap/report-components": "^0.1.0",
    "@chasenocap/report-templates": "^1.0.1",
    "inversify": "^6.0.2",
    "reflect-metadata": "^0.2.1"
  }
}
```

### 4. Configure Renovate

Create/update `renovate.json`:

```json
{
  "extends": ["config:base"],
  "packageRules": [
    {
      "matchPackagePatterns": ["^@chasenocap/"],
      "groupName": "Internal packages",
      "automerge": true,
      "automergeType": "pr",
      "schedule": ["after 10pm every weekday", "before 5am every weekday", "every weekend"]
    }
  ],
  "git-submodules": {
    "enabled": true
  },
  "postUpdateOptions": ["npmDedupe", "yarnDedupeHighest"]
}
```

### 5. Set Up Repository Dispatch

In each package repository, add workflow to notify meta repo:

`.github/workflows/notify-parent.yml`:
```yaml
name: Notify Parent Repository

on:
  release:
    types: [published]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Notify meta repository
        uses: peter-evans/repository-dispatch@v2
        with:
          token: ${{ secrets.PAT_TOKEN }}
          repository: ChaseNoCap/h1b-visa-analysis
          event-type: package-updated
          client-payload: '{"package": "${{ github.event.repository.name }}", "version": "${{ github.event.release.tag_name }}"}'
```

### 6. Update Meta Repository Workflow

Create `.github/workflows/handle-package-update.yml`:
```yaml
name: Handle Package Update

on:
  repository_dispatch:
    types: [package-updated]

jobs:
  update-dependency:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Update package version
        run: |
          npm update @chasenocap/${{ github.event.client_payload.package }}
          
      - name: Update submodule
        run: |
          cd packages/${{ github.event.client_payload.package }}
          git pull origin main
          cd ../..
          git add packages/${{ github.event.client_payload.package }}
          
      - name: Create PR
        uses: peter-evans/create-pull-request@v5
        with:
          title: "chore: update ${{ github.event.client_payload.package }} to ${{ github.event.client_payload.version }}"
          commit-message: "chore: update ${{ github.event.client_payload.package }} to ${{ github.event.client_payload.version }}"
          branch: update-${{ github.event.client_payload.package }}-${{ github.event.client_payload.version }}
```

## Benefits of This Setup

1. **Version Control**: Each package has proper semantic versioning
2. **Automated Updates**: Renovate will create PRs for package updates
3. **Submodule Sync**: Git submodules stay in sync with published versions
4. **CI/CD Integration**: Changes trigger builds and tests automatically
5. **Private Registry**: Packages stay private within your GitHub org

## Testing the Setup

1. Publish a patch version of one package
2. Verify Renovate creates a PR in the meta repo
3. Check that submodule reference is updated
4. Ensure CI passes with new version
5. Merge and verify production build

## Troubleshooting

- **401 Unauthorized**: Check NPM_TOKEN is set and has correct scopes
- **Package not found**: Ensure package is published and .npmrc is configured
- **Submodule out of sync**: Run `git submodule update --remote --merge`
- **Renovate not working**: Check renovate.json syntax and GitHub App permissions