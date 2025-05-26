#!/bin/bash

# CI Dashboard Generator
# Generates a comprehensive markdown dashboard of CI/CD health status

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DASHBOARD_PATH="${1:-$SCRIPT_DIR/../docs/ci-dashboard.md}"

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📊 Generating CI Dashboard...${NC}"

# Run the monitor script and capture JSON output
JSON_OUTPUT=$("$SCRIPT_DIR/monitor-ci-health-json.sh" 2>/dev/null || echo '{}')

# Extract data from JSON
TIMESTAMP=$(echo "$JSON_OUTPUT" | jq -r '.timestamp // "Unknown"')
HEALTH_SCORE=$(echo "$JSON_OUTPUT" | jq -r '.summary.health_score // 0')
AUTOMATION_EFFECTIVENESS=$(echo "$JSON_OUTPUT" | jq -r '.summary.automation_effectiveness // 0')
TOTAL_PACKAGES=$(echo "$JSON_OUTPUT" | jq -r '.summary.total_packages // 0')
PASSING_PACKAGES=$(echo "$JSON_OUTPUT" | jq -r '.summary.passing_packages // 0')
FAILING_PACKAGES=$(echo "$JSON_OUTPUT" | jq -r '.summary.failing_packages // 0')
OPEN_PRS=$(echo "$JSON_OUTPUT" | jq -r '.summary.open_prs // 0')
CONFLICTS=$(echo "$JSON_OUTPUT" | jq -r '.summary.conflicts // 0')
API_RATE_LIMIT=$(echo "$JSON_OUTPUT" | jq -r '.summary.api_rate_limit_percentage // 0')

# Determine health emoji
if [[ $HEALTH_SCORE -ge 90 ]]; then
  HEALTH_EMOJI="🟢"
  HEALTH_STATUS="Healthy"
elif [[ $HEALTH_SCORE -ge 70 ]]; then
  HEALTH_EMOJI="🟡"
  HEALTH_STATUS="Warning"
else
  HEALTH_EMOJI="🔴"
  HEALTH_STATUS="Critical"
fi

# Generate the dashboard
cat > "$DASHBOARD_PATH" << EOF
# CI Pipeline Health Dashboard

**Generated**: $TIMESTAMP  
**Overall Health**: $HEALTH_EMOJI $HEALTH_STATUS ($HEALTH_SCORE%)  
**Automation Effectiveness**: $AUTOMATION_EFFECTIVENESS%

## Quick Links

- [GitHub Actions](https://github.com/ChaseNoCap/h1b-visa-analysis/actions)
- [Renovate Dashboard](https://github.com/ChaseNoCap/h1b-visa-analysis/blob/main/.github/DEPENDENCY_DASHBOARD.md)
- [Open PRs](https://github.com/ChaseNoCap/h1b-visa-analysis/pulls)

## Summary Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Total Packages | $TOTAL_PACKAGES | - |
| Passing CI | $PASSING_PACKAGES | $([ $PASSING_PACKAGES -eq $TOTAL_PACKAGES ] && echo "✅" || echo "⚠️") |
| Failing CI | $FAILING_PACKAGES | $([ $FAILING_PACKAGES -eq 0 ] && echo "✅" || echo "❌") |
| Open PRs | $OPEN_PRS | $([ $OPEN_PRS -lt 10 ] && echo "✅" || echo "⚠️") |
| PR Conflicts | $CONFLICTS | $([ $CONFLICTS -eq 0 ] && echo "✅" || echo "❌") |
| API Rate Limit | $API_RATE_LIMIT% | $([ $API_RATE_LIMIT -gt 20 ] && echo "✅" || echo "⚠️") |

## Package Status

| Package | CI Status | Last Publish | Open PRs | Actions |
|---------|-----------|--------------|----------|---------|
EOF

# Get detailed package status
OWNER="ChaseNoCap"
PACKAGES=(
  "cache" "di-framework" "event-system" "file-system" 
  "logger" "markdown-compiler" "prompts" "report-components"
  "report-templates" "test-helpers" "test-mocks"
)

for package in "${PACKAGES[@]}"; do
  # Get latest workflow run
  LATEST_RUN=$(gh api "repos/$OWNER/$package/actions/runs" \
    --jq '.workflow_runs[0] | {status: .status, conclusion: .conclusion, html_url: .html_url}' 2>/dev/null || echo '{}')
  
  STATUS=$(echo "$LATEST_RUN" | jq -r '.conclusion // "unknown"')
  RUN_URL=$(echo "$LATEST_RUN" | jq -r '.html_url // "#"')
  
  # Get status emoji
  if [[ "$STATUS" == "success" ]]; then
    STATUS_EMOJI="✅"
  elif [[ "$STATUS" == "failure" ]]; then
    STATUS_EMOJI="❌"
  else
    STATUS_EMOJI="⚠️"
  fi
  
  # Get last release
  LAST_RELEASE=$(gh api "repos/$OWNER/$package/releases/latest" --jq '.published_at // empty' 2>/dev/null || echo "")
  if [[ -z "$LAST_RELEASE" ]]; then
    LAST_RELEASE="Never"
  else
    # Format date for display
    if [[ "$(uname)" == "Darwin" ]]; then
      LAST_RELEASE=$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "$LAST_RELEASE" +"%Y-%m-%d" 2>/dev/null || echo "Unknown")
    else
      LAST_RELEASE=$(date -d "$LAST_RELEASE" +"%Y-%m-%d" 2>/dev/null || echo "Unknown")
    fi
  fi
  
  # Get PR count
  PR_COUNT=$(gh pr list --repo "$OWNER/$package" --state open --json number | jq 'length' 2>/dev/null || echo 0)
  
  # Add to dashboard
  echo "| [$package](https://github.com/$OWNER/$package) | $STATUS_EMOJI $STATUS | $LAST_RELEASE | $PR_COUNT | [View Run]($RUN_URL) |" >> "$DASHBOARD_PATH"
done

# Add recent events section
cat >> "$DASHBOARD_PATH" << 'EOF'

## Recent CI Events

EOF

# Get recent workflow runs across all repos
echo "### Last 10 Workflow Runs" >> "$DASHBOARD_PATH"
echo "" >> "$DASHBOARD_PATH"
echo "| Repository | Workflow | Status | Time | Link |" >> "$DASHBOARD_PATH"
echo "|------------|----------|--------|------|------|" >> "$DASHBOARD_PATH"

# Meta repo runs
RECENT_RUNS=$(gh api "repos/$OWNER/h1b-visa-analysis/actions/runs" \
  --jq '.workflow_runs[:5] | map({name: .name, conclusion: .conclusion, created_at: .created_at, html_url: .html_url, repo: "h1b-visa-analysis"})' 2>/dev/null || echo '[]')

# Add to dashboard
echo "$RECENT_RUNS" | jq -r '.[] | 
  "| \(.repo) | \(.name) | \(if .conclusion == "success" then "✅" elif .conclusion == "failure" then "❌" else "⏳" end) \(.conclusion // "running") | \(.created_at | split("T")[0]) | [View](\(.html_url)) |"' >> "$DASHBOARD_PATH" 2>/dev/null || true

# Add Renovate activity section
cat >> "$DASHBOARD_PATH" << 'EOF'

## Renovate Activity

EOF

# Count Renovate PRs
RENOVATE_OPEN=$(gh pr list --repo "$OWNER/h1b-visa-analysis" --author "renovate[bot]" --state open --json number | jq 'length' 2>/dev/null || echo 0)
RENOVATE_MERGED_TODAY=$(gh pr list --repo "$OWNER/h1b-visa-analysis" --author "renovate[bot]" --state closed --json mergedAt \
  --jq 'map(select(.mergedAt != null and (now - (.mergedAt | fromdateiso8601)) < 86400)) | length' 2>/dev/null || echo 0)

cat >> "$DASHBOARD_PATH" << EOF
- **Open Renovate PRs**: $RENOVATE_OPEN
- **Merged Today**: $RENOVATE_MERGED_TODAY
- **Schedule**: Every 30 minutes
- **Automerge**: Enabled for @chasenocap packages

EOF

# Add monitoring commands section
cat >> "$DASHBOARD_PATH" << 'EOF'
## Monitoring Commands

### Real-time Status
```bash
# Full CI health check
./scripts/monitor-ci-health.sh

# Renovate-specific monitoring
./scripts/monitor-renovate.sh

# JSON output for automation
./scripts/monitor-ci-health.sh json
```

### Quick Actions
```bash
# Check all workflow runs
gh workflow list --all --repo ChaseNoCap/h1b-visa-analysis

# View recent failures
gh run list --workflow "Generate H1B Report" --status failure --limit 5

# Merge all mergeable Renovate PRs
gh pr list --author "renovate[bot]" --json number,mergeable \
  --jq '.[] | select(.mergeable == "MERGEABLE") | .number' | \
  xargs -I {} gh pr merge {} --auto
```

## Alerts & Issues

EOF

# Check for critical issues
CRITICAL_ISSUES=()

if [[ $FAILING_PACKAGES -gt 3 ]]; then
  CRITICAL_ISSUES+=("🚨 **High failure rate**: $FAILING_PACKAGES/$TOTAL_PACKAGES packages failing")
fi

if [[ $CONFLICTS -gt 0 ]]; then
  CRITICAL_ISSUES+=("⚠️ **PR conflicts**: $CONFLICTS PRs need manual resolution")
fi

if [[ $API_RATE_LIMIT -lt 20 ]]; then
  CRITICAL_ISSUES+=("⚠️ **Low API quota**: Only $API_RATE_LIMIT% remaining")
fi

if [[ ${#CRITICAL_ISSUES[@]} -eq 0 ]]; then
  echo "✅ No critical issues detected" >> "$DASHBOARD_PATH"
else
  for issue in "${CRITICAL_ISSUES[@]}"; do
    echo "- $issue" >> "$DASHBOARD_PATH"
  done
fi

# Add footer
cat >> "$DASHBOARD_PATH" << 'EOF'

---

*Dashboard generated by `scripts/generate-ci-dashboard.sh`*  
*For real-time monitoring, run `./scripts/monitor-ci-health.sh`*
EOF

echo -e "${GREEN}✅ Dashboard generated at: $DASHBOARD_PATH${NC}"

# Also generate a summary for terminal output
echo ""
echo -e "${BLUE}📊 Summary${NC}"
echo "──────────────────"
echo "Overall Health: $HEALTH_EMOJI $HEALTH_STATUS ($HEALTH_SCORE%)"
echo "Passing/Total: $PASSING_PACKAGES/$TOTAL_PACKAGES"
echo "Open PRs: $OPEN_PRS"
echo "Conflicts: $CONFLICTS"
echo ""
echo -e "${YELLOW}View full dashboard: $DASHBOARD_PATH${NC}"