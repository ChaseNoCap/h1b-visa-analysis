# Coverage Badges Implementation Guide

## Overview

This guide explains how to implement coverage badges for the H1B Visa Analysis monorepo packages to visually display test coverage in documentation.

## Badge Types

### 1. Static Badges (shields.io)
The simplest approach using manually updated shields.io badges:

```markdown
![Coverage](https://img.shields.io/badge/coverage-91.89%25-brightgreen)
```

**Pros**: Simple, no infrastructure needed
**Cons**: Manual updates required

### 2. Dynamic Coverage Badges

#### Option A: GitHub Actions + Gist
1. Run tests and generate coverage in CI
2. Extract coverage percentage
3. Update a GitHub Gist
4. Use dynamic shields.io badge pointing to gist

```yaml
# .github/workflows/coverage.yml
- name: Update coverage badge
  run: |
    COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.statements.pct')
    echo "{ \"coverage\": \"$COVERAGE%\" }" > coverage.json
    # Update gist using GitHub API
```

```markdown
![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/USER/GIST_ID/raw/coverage.json)
```

#### Option B: Codecov Integration
1. Add codecov to CI pipeline
2. Upload coverage reports
3. Use codecov badges

```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/coverage-final.json
```

```markdown
[![codecov](https://codecov.io/gh/ChaseNoCap/h1b-visa-analysis/branch/main/graph/badge.svg)](https://codecov.io/gh/ChaseNoCap/h1b-visa-analysis)
```

## Implementation for Packages

### Package-Level Badges
For individual packages in the monorepo:

```markdown
# In packages/test-helpers/README.md
![Coverage](https://img.shields.io/badge/coverage-91.89%25-brightgreen)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![Size](https://img.shields.io/badge/size-611_lines-blue)
```

### Main README Badges
For the main project README:

```markdown
# H1B Visa Analysis

![Build Status](https://github.com/ChaseNoCap/h1b-visa-analysis/workflows/CI/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-96%25-brightgreen)
![Packages](https://img.shields.io/badge/packages-8-blue)
![License](https://img.shields.io/badge/license-MIT-blue)
```

## Recommended Approach

For this monorepo, I recommend starting with **static badges** that are manually updated:

1. **Simple to implement** - No additional infrastructure
2. **Low maintenance** - Coverage doesn't change frequently
3. **Clear documentation** - Shows commitment to testing

### Implementation Steps

1. Add badges to each package's README:
```bash
# For each package with source access
cd packages/[package-name]
# Add badges to README.md
```

2. Update main README.md with overall badges

3. Create a script to help update badges:
```bash
#!/bin/bash
# scripts/update-badges.sh
COVERAGE=$(npm run coverage -- --reporter=json-summary | grep "statements" | awk '{print $2}')
echo "Update README.md badges with coverage: $COVERAGE%"
```

## Badge Examples

### Coverage Levels
- ![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen) - Excellent (90%+)
- ![Coverage](https://img.shields.io/badge/coverage-84%25-yellowgreen) - Good (80-89%)
- ![Coverage](https://img.shields.io/badge/coverage-75%25-yellow) - Fair (70-79%)
- ![Coverage](https://img.shields.io/badge/coverage-60%25-orange) - Needs work (60-69%)
- ![Coverage](https://img.shields.io/badge/coverage-45%25-red) - Poor (<60%)

### Package Status
- ![Status](https://img.shields.io/badge/status-stable-brightgreen)
- ![Status](https://img.shields.io/badge/status-beta-yellow)
- ![Status](https://img.shields.io/badge/status-experimental-orange)

### Package Type
- ![Type](https://img.shields.io/badge/type-published-blue)
- ![Type](https://img.shields.io/badge/type-local-lightblue)

## Future Enhancements

1. **Automated Updates**: GitHub Action to update badges on test runs
2. **Coverage Trends**: Historical coverage tracking
3. **Per-Package CI**: Individual package test status
4. **Dashboard**: Create a coverage dashboard page

## Resources

- [Shields.io Documentation](https://shields.io/)
- [GitHub Actions Badge](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/adding-a-workflow-status-badge)
- [Codecov Documentation](https://docs.codecov.com/docs)
- [Coverage Badge Examples](https://github.com/dwyl/repo-badges)