# CI/CD Monitoring and Operations Guide

## Overview

This comprehensive guide covers CI/CD monitoring, dashboard usage, and operational procedures for the h1b-visa-analysis ecosystem.

## Quick Reference

**Live Dashboards** (Auto-generated):
- `docs/ci-dashboard-enhanced.md` - Real-time health metrics
- `docs/ci-dashboard.md` - Package status overview
- `.github/DEPENDENCY_DASHBOARD.md` - Renovate dependency tracking

**Key Scripts**:
- `scripts/monitor-ci-health.sh` - Real-time monitoring
- `scripts/generate-ci-dashboard.sh` - Dashboard generation

## Monitoring System Architecture

### Core Components

#### 1. Real-time Monitoring (`monitor-ci-health.sh`)
- Monitors workflow status across all 11 packages + meta repo
- Tracks PR health and merge conflicts  
- Monitors API rate limits
- Calculates overall health scores
- Provides colored terminal output

#### 2. Dashboard Generation (`generate-ci-dashboard.sh`)
- Creates comprehensive markdown dashboards
- Integrates GitHub API data
- Tracks workflow success rates
- Provides actionable recommendations

#### 3. Notification System
- Repository dispatch triggers for instant updates
- Automated PR creation for dependency updates
- Health alerts for failing workflows

## Usage Instructions

### Real-time Monitoring
```bash
# Basic health check
./scripts/monitor-ci-health.sh

# JSON output for automation
./scripts/monitor-ci-health.sh json

# Continuous monitoring
watch -n 30 './scripts/monitor-ci-health.sh'
```

### Dashboard Operations
```bash
# Generate enhanced dashboard
./scripts/generate-ci-dashboard.sh

# Fast metrics only
./scripts/monitor-ci-health.sh --fast
```

## Troubleshooting Workflows

### Common Issues

#### Authentication Failures
**Symptoms**: 401 errors in workflows
**Resolution**:
1. Verify PAT_TOKEN has correct scopes: `repo`, `packages:read`, `packages:write`
2. Check npm configuration in workflows uses `npm config set` not `.npmrc`
3. Validate token hasn't expired

#### Failed Notifications
**Symptoms**: Auto-update workflows not triggered
**Resolution**:
1. Check notify workflow in source package
2. Verify repository_dispatch payload format
3. Confirm webhook permissions

#### Quality Gate Failures
**Symptoms**: Packages fail to publish
**Expected Behavior**: This is correct - packages without tests should fail
**Resolution**: Add comprehensive test suites to affected packages

### Systematic Fix Process

1. **Identify**: Use monitoring dashboard to find failing workflows
2. **Categorize**: 
   - Auth issues → Fix PAT_TOKEN/npm config
   - Quality gates → Add tests
   - Notification → Fix repository_dispatch
3. **Fix**: Apply appropriate resolution
4. **Verify**: Monitor for 24 hours to confirm fix
5. **Document**: Update this guide with any new patterns

## Health Metrics Interpretation

### Health Score Calculation
- **90-100%**: Excellent - All systems operational
- **70-89%**: Good - Minor issues, monitor trends
- **50-69%**: Warning - Active issues requiring attention
- **Below 50%**: Critical - Immediate intervention required

### Workflow Categories
- **CI/Test**: Build, test, lint workflows (quality assurance)
- **Notify**: Repository dispatch triggers (automation infrastructure) 
- **Publish**: Package publication workflows (delivery)
- **Update**: Dependency update automation (maintenance)

## Operational Procedures

### Daily Operations
1. Check dashboard health score
2. Review any failed workflows
3. Monitor PR velocity and merge conflicts
4. Verify dependency updates are processing

### Weekly Operations
1. Review health trends
2. Analyze workflow performance metrics
3. Update documentation for any new issues discovered
4. Plan fixes for persistent issues

### Emergency Response
1. **Critical Health (<50%)**:
   - Immediately check monitoring dashboard
   - Identify most critical failures
   - Apply emergency fixes
   - Document incident and resolution

2. **Authentication Outages**:
   - Check PAT_TOKEN expiration
   - Verify npm configuration consistency
   - Test with single package first

3. **Automation Failures**:
   - Verify notification workflows
   - Check repository_dispatch permissions
   - Test end-to-end flow manually

## Integration with Development Workflow

### Pre-commit Checks
- Ensure local builds pass before pushing
- Check that new packages have test suites
- Verify documentation updates are consistent

### Release Process
1. Monitor health score before releases
2. Ensure all packages have passing workflows
3. Use tag-based publishing for controlled releases
4. Monitor automation response after releases

### Dependency Updates
- Automated via Renovate (30-minute schedule)
- Auto-merge enabled for @chasenocap packages
- Quality gates prevent broken dependencies
- Manual review for major version updates

## Advanced Monitoring

### API Rate Limits
- Monitor GitHub API usage
- Implement backoff strategies for high-frequency operations
- Use authentication to increase rate limits

### Performance Metrics
- Track workflow execution times
- Monitor dependency update latency
- Measure automation effectiveness

### Custom Alerts
```bash
# Example: Alert on health score below 70%
HEALTH=$(./scripts/monitor-ci-health.sh json | jq '.health_score')
if [ "$HEALTH" -lt 70 ]; then
  echo "ALERT: Health score below threshold: $HEALTH%"
fi
```

## Best Practices

### Documentation
- Keep this guide updated with new issues and resolutions
- Reference generated dashboards rather than duplicating metrics
- Focus on procedures and troubleshooting, not current status

### Monitoring
- Use automated dashboards for current status
- Focus manual monitoring on trends and patterns
- Implement alerts for critical thresholds

### Operations
- Follow systematic troubleshooting process
- Document all fixes and their effectiveness
- Test fixes thoroughly before deployment
- Monitor after changes to ensure stability

## Related Documentation

- `/docs/unified-dependency-strategy.md` - Overall dependency strategy
- `/docs/package-catalog.md` - Package details and ownership
- `/docs/automation-validation-status.md` - Current automation status
- Generated dashboards in `/docs/ci-dashboard*.md`
