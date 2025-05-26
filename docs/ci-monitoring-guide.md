# CI Monitoring Guide

## Overview

This guide documents the CI/CD monitoring system implemented for the h1b-visa-analysis project ecosystem. The system monitors 11 packages plus the meta repository, providing real-time health status and automated dashboards.

## Monitoring Components

### 1. Core Monitoring Script (`scripts/monitor-ci-health.sh`)

Real-time CI health monitoring across all repositories.

**Features:**
- Monitors workflow status for all 11 packages + meta repo
- Tracks PR health and merge conflicts
- Monitors API rate limits
- Calculates overall health score
- Provides colored terminal output for quick status assessment

**Usage:**
```bash
# Full health check with human-readable output
./scripts/monitor-ci-health.sh

# JSON output for automation
./scripts/monitor-ci-health.sh json
```

**Output Includes:**
- API rate limit status
- Per-package CI status (✅ passing, ❌ failing, ⚠️ unknown)
- Last publish time for each package
- Open PR counts
- Overall health score (percentage)
- Automation effectiveness score
- Recommendations for issues

### 2. Renovate Monitor (`scripts/monitor-renovate.sh`)

Specialized monitoring for Renovate bot activity.

**Features:**
- Checks Renovate configuration
- Analyzes PR velocity and merge times
- Tracks automerge effectiveness
- Identifies stuck or conflicted PRs
- Provides useful bulk operation commands

**Usage:**
```bash
./scripts/monitor-renovate.sh
```

### 3. Dashboard Generator (`scripts/generate-ci-dashboard.sh`)

Creates a comprehensive markdown dashboard.

**Features:**
- Generates `docs/ci-dashboard.md`
- Shows package status table with links
- Lists recent workflow runs
- Tracks Renovate activity
- Identifies critical issues
- Includes quick action commands

**Usage:**
```bash
# Generate dashboard (default location: docs/ci-dashboard.md)
./scripts/generate-ci-dashboard.sh

# Generate to custom location
./scripts/generate-ci-dashboard.sh /path/to/dashboard.md
```

### 4. JSON Data Provider (`scripts/monitor-ci-health-json.sh`)

Simplified script providing machine-readable output.

**Usage:**
```bash
# Get JSON data
./scripts/monitor-ci-health-json.sh

# Pretty print with jq
./scripts/monitor-ci-health-json.sh | jq .
```

## Dashboard Interpretation

### Health Score Indicators

- 🟢 **Healthy (90-100%)**: Most/all packages passing CI
- 🟡 **Warning (70-89%)**: Some packages failing, attention needed
- 🔴 **Critical (<70%)**: Many packages failing, immediate action required

### Package Status

Each package shows:
- **CI Status**: Current workflow state (✅ ❌ ⚠️)
- **Last Publish**: When the package was last released
- **Open PRs**: Number of open pull requests
- **Actions**: Direct link to latest workflow run

### Key Metrics

1. **Automation Effectiveness**: How well automation is working (100% = no manual interventions)
2. **API Rate Limit**: GitHub API quota remaining
3. **PR Conflicts**: Number of PRs with merge conflicts
4. **Open PRs**: Total across all repositories

## Common Monitoring Tasks

### Check Overall System Health
```bash
./scripts/monitor-ci-health.sh
```

### View Detailed Package Failures
```bash
# Check specific package failure
gh run list --repo ChaseNoCap/[package-name] --workflow ci --status failure --limit 1
gh run view [run-id] --repo ChaseNoCap/[package-name] --log-failed
```

### Monitor Renovate Activity
```bash
# Check Renovate PRs
./scripts/monitor-renovate.sh

# View all dependency PRs
gh pr list --repo ChaseNoCap/h1b-visa-analysis --author "renovate[bot]"
```

### Generate Fresh Dashboard
```bash
./scripts/generate-ci-dashboard.sh
cat docs/ci-dashboard.md
```

## Automated Monitoring

### Scheduled Monitoring (Coming Soon)

The `.github/workflows/ci-health-check.yml` workflow will:
- Run every 30 minutes (aligned with Renovate)
- Trigger on key events (package publish, PR merge)
- Generate updated dashboards
- Create issues for critical failures

### Event Triggers

Monitoring triggers on:
1. Renovate PR creation/updates
2. Package publishing events
3. Workflow failures
4. Manual dispatch
5. Scheduled runs (every 6 hours)

## Troubleshooting

### High Failure Rate

If many packages are failing:
1. Check for common dependency issues
2. Verify GitHub Actions runners are available
3. Check for API rate limiting
4. Review recent commits for breaking changes

### API Rate Limiting

If rate limit is low:
1. Reduce monitoring frequency
2. Use authenticated requests
3. Wait for reset (shown in monitor output)

### Stale PRs

For PRs older than 7 days:
1. Check for test failures blocking automerge
2. Resolve merge conflicts
3. Manually review and merge if needed

## Integration with Development Workflow

### Before Making Changes
```bash
# Check current health
./scripts/monitor-ci-health.sh

# Generate baseline dashboard
./scripts/generate-ci-dashboard.sh
```

### After Fixes
```bash
# Regenerate dashboard to see improvements
./scripts/generate-ci-dashboard.sh

# Verify specific package is fixed
gh workflow list --repo ChaseNoCap/[package-name]
```

### Continuous Monitoring
```bash
# Keep dashboard open in browser
open docs/ci-dashboard.md

# Run monitor in watch mode (manual)
watch -n 300 ./scripts/monitor-ci-health.sh
```

## Best Practices

1. **Regular Monitoring**: Check dashboard at least daily
2. **Quick Response**: Address failures within 24 hours
3. **Batch Fixes**: Group related fixes to minimize CI runs
4. **Document Issues**: Add notes to PRs about CI fixes
5. **Monitor Trends**: Track health score over time

## Next Steps

1. Implement automated health check workflow
2. Add Slack/Discord notifications for failures
3. Create historical metrics tracking
4. Build web-based dashboard UI