# Package Publish Monitoring Plan

## Problem Statement

Currently showing "N/A 0/11 packages" for publish workflows, which doesn't provide useful information about:
- Whether packages are being published
- How packages are published (manual vs automated)
- When packages were last published
- If publishing is working correctly

## Current State Analysis

### Publishing Method
- **Registry**: GitHub Packages (`npm.pkg.github.com`)
- **Method**: Manual (`npm publish` from local)
- **Automation**: None (no publish workflows)
- **Trigger**: Developer decision

### What We Need to Track
1. **Last Published Version**: What version is on npm?
2. **Git vs NPM Sync**: Is the published version in sync with git tags?
3. **Publish Frequency**: How often are packages published?
4. **Publish Success**: Are publishes succeeding?
5. **Automation Status**: Is publishing automated?

## Proposed Solution

### 1. Enhanced Monitoring Metrics

Instead of just "has publish workflow", track:
```
| Package | Latest Git | Published | In Sync? | Last Publish | Method |
|---------|------------|-----------|----------|--------------|---------|
| logger  | v1.0.3     | v1.0.0    | ❌       | 3 days ago   | Manual  |
| cache   | v1.0.6     | v1.0.5    | ❌       | 1 week ago   | Manual  |
```

### 2. Add Publish Workflow Template

Create a standard publish workflow for packages:

```yaml
name: Publish Package

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to publish (e.g., 1.0.1)'
        required: true

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://npm.pkg.github.com'
      
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Test
        run: npm test
        
      - name: Publish
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Notify parent repository
        uses: peter-evans/repository-dispatch@v2
        with:
          token: ${{ secrets.PAT_TOKEN }}
          repository: ChaseNoCap/h1b-visa-analysis
          event-type: package-published
          client-payload: |
            {
              "package": "${{ github.event.repository.name }}",
              "version": "${{ github.event.inputs.version || github.ref_name }}",
              "method": "automated"
            }
```

### 3. Update Monitoring Script

Enhance the monitoring to check:
- Git tags vs published versions
- Time since last publish
- Method of publishing

```bash
check_publish_status() {
  local package=$1
  
  # Get latest git tag
  local git_tag=$(gh api "repos/$OWNER/$package/tags" \
    --jq '.[0].name' 2>/dev/null || echo "none")
  
  # Get published version (with auth)
  local published=$(npm view "@chasenocap/$package" version \
    --registry https://npm.pkg.github.com 2>/dev/null || echo "none")
  
  # Check if automated
  local has_publish_workflow="Manual"
  if gh api "repos/$OWNER/$package/contents/.github/workflows" \
    --jq '.[].name' 2>/dev/null | grep -q "publish"; then
    has_publish_workflow="Automated"
  fi
  
  # Compare versions
  local in_sync="❌"
  if [[ "$git_tag" == "v$published" ]] || [[ "$git_tag" == "$published" ]]; then
    in_sync="✅"
  fi
  
  echo "$git_tag|$published|$in_sync|$has_publish_workflow"
}
```

### 4. Implementation Steps

#### Phase 1: Update Monitoring (Immediate)
1. Modify `monitor-ci-health.sh` to show publish status
2. Add publish status to dashboard
3. Show which packages need publishing

#### Phase 2: Add Publish Workflows (Short-term)
1. Create publish workflow template
2. Deploy to high-value packages first (logger, cache)
3. Test automated publishing
4. Roll out to all packages

#### Phase 3: Full Automation (Long-term)
1. Integrate with semantic-release
2. Auto-publish on merged PRs
3. Coordinate with Renovate for version bumps
4. Add changelog generation

## Benefits

1. **Visibility**: Know which packages are out of date
2. **Automation**: Reduce manual publish burden
3. **Consistency**: All packages publish the same way
4. **Reliability**: No forgotten publishes
5. **Instant Updates**: Publish triggers instant update flow

## Success Metrics

- **Sync Rate**: >95% of packages have git tag = npm version
- **Publish Lag**: <1 hour from tag to npm
- **Automation Rate**: 100% packages have publish workflows
- **Failure Rate**: <5% publish failures

## Quick Implementation

For immediate improvement, update the dashboard to show:
```
📦 Publish Status (Manual Process)
• Packages with recent commits but no publish: 3
• Average days between publishes: 7
• Recommended action: Add publish workflows
```

This provides value even before automation is added.