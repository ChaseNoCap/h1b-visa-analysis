#!/bin/bash

# CI Pipeline Health Monitor - JSON Output
# Simplified version that outputs JSON for dashboard generation

set -euo pipefail

# Configuration
OWNER="ChaseNoCap"
META_REPO="h1b-visa-analysis"
PACKAGES=(
  "cache" "di-framework" "event-system" "file-system" 
  "logger" "markdown-compiler" "prompts" "report-components"
  "report-templates" "test-helpers" "test-mocks"
)

# Initialize counters
total_packages=${#PACKAGES[@]}
passing_packages=0
failing_packages=0
total_open_prs=0
total_conflicts=0

# Check rate limit
rate_info=$(gh api rate_limit 2>/dev/null || echo '{"resources":{"core":{"remaining":0,"limit":1,"reset":0}}}')
remaining=$(echo "$rate_info" | jq -r '.resources.core.remaining')
limit=$(echo "$rate_info" | jq -r '.resources.core.limit')
percentage=$((limit > 0 ? remaining * 100 / limit : 0))

# Check meta repo
meta_runs=$(gh api "repos/$OWNER/$META_REPO/actions/runs" --jq '.workflow_runs[:5]' 2>/dev/null || echo '[]')
meta_status="unknown"
if [[ $(echo "$meta_runs" | jq -r 'map(select(.conclusion == "failure")) | length') -gt 0 ]]; then
  meta_status="failing"
elif [[ $(echo "$meta_runs" | jq -r 'map(select(.conclusion == "success")) | length') -gt 0 ]]; then
  meta_status="passing"
fi

meta_prs=$(gh pr list --repo "$OWNER/$META_REPO" --state open --json number 2>/dev/null | jq 'length' || echo 0)

# Check packages
for package in "${PACKAGES[@]}"; do
  # Get workflow status
  runs=$(gh api "repos/$OWNER/$package/actions/runs" --jq '.workflow_runs[:3]' 2>/dev/null || echo '[]')
  
  if [[ $(echo "$runs" | jq -r 'map(select(.conclusion == "failure")) | length') -gt 0 ]]; then
    ((failing_packages++))
  elif [[ $(echo "$runs" | jq -r 'map(select(.conclusion == "success")) | length') -gt 0 ]]; then
    ((passing_packages++))
  fi
  
  # Count PRs
  pr_count=$(gh pr list --repo "$OWNER/$package" --state open --json number 2>/dev/null | jq 'length' || echo 0)
  total_open_prs=$((total_open_prs + pr_count))
done

# Calculate scores
health_score=$((total_packages > 0 ? passing_packages * 100 / total_packages : 0))
automation_effectiveness=$((100 - (total_conflicts * 10)))
automation_effectiveness=$((automation_effectiveness < 0 ? 0 : automation_effectiveness))

# Output JSON
cat << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "summary": {
    "health_score": $health_score,
    "automation_effectiveness": $automation_effectiveness,
    "total_packages": $total_packages,
    "passing_packages": $passing_packages,
    "failing_packages": $failing_packages,
    "open_prs": $total_open_prs,
    "conflicts": $total_conflicts,
    "api_rate_limit_percentage": $percentage
  },
  "meta_repository": {
    "name": "$META_REPO",
    "status": "$meta_status",
    "open_prs": $meta_prs
  }
}
EOF