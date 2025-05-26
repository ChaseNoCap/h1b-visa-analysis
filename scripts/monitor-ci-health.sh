#!/bin/bash

# CI Pipeline Health Monitor
# Uses gh CLI to programmatically capture CI/CD status across all repositories
# Outputs both human-readable and JSON formats for consumption by other tools

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
OWNER="ChaseNoCap"
META_REPO="h1b-visa-analysis"
PACKAGES=(
  "cache" "di-framework" "event-system" "file-system" 
  "logger" "markdown-compiler" "prompts" "report-components"
  "report-templates" "test-helpers" "test-mocks"
)

# Output format (human or json)
OUTPUT_FORMAT="${1:-human}"

# Function to output JSON
output_json() {
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
    "open_prs": $meta_open_prs
  }
}
EOF
}

# Global variables for summary
health_score=0
automation_effectiveness=0
total_packages=${#PACKAGES[@]}
passing_packages=0
failing_packages=0
total_open_prs=0
total_conflicts=0
percentage=0
meta_status="unknown"
meta_open_prs=0

# Function to get workflow status for a repository
get_workflow_status() {
  local repo=$1
  local status="unknown"
  local failing_workflows=()
  
  # Get recent workflow runs
  local runs=$(gh api "repos/$OWNER/$repo/actions/runs" \
    --jq '.workflow_runs[:5] | map({name: .name, status: .status, conclusion: .conclusion, created_at: .created_at})')
  
  # Check for any failures in recent runs
  local has_failure=$(echo "$runs" | jq -r 'map(select(.conclusion == "failure")) | length')
  local has_success=$(echo "$runs" | jq -r 'map(select(.conclusion == "success")) | length')
  
  if [[ "$has_failure" -gt 0 ]]; then
    status="failing"
    failing_workflows=($(echo "$runs" | jq -r 'map(select(.conclusion == "failure")) | .[].name'))
  elif [[ "$has_success" -gt 0 ]]; then
    status="passing"
  else
    status="unknown"
  fi
  
  echo "$status|${failing_workflows[*]:-}"
}

# Function to check PR status
check_pr_status() {
  local repo=$1
  
  # Get dependency-related PRs
  local prs=$(gh pr list --repo "$OWNER/$repo" \
    --label "dependencies,automated" \
    --json number,title,state,createdAt,mergeable,isDraft \
    --limit 10)
  
  local open_count=$(echo "$prs" | jq -r 'map(select(.state == "OPEN")) | length')
  local mergeable_count=$(echo "$prs" | jq -r 'map(select(.mergeable == "MERGEABLE")) | length')
  local conflicted_count=$(echo "$prs" | jq -r 'map(select(.mergeable == "CONFLICTING")) | length')
  
  echo "$open_count|$mergeable_count|$conflicted_count"
}

# Function to check rate limit
check_rate_limit() {
  local rate_info=$(gh api rate_limit)
  local remaining=$(echo "$rate_info" | jq -r '.resources.core.remaining')
  local limit=$(echo "$rate_info" | jq -r '.resources.core.limit')
  local reset=$(echo "$rate_info" | jq -r '.resources.core.reset')
  # Handle macOS vs Linux date command
  if [[ "$(uname)" == "Darwin" ]]; then
    local reset_time=$(date -r "$reset" +"%Y-%m-%d %H:%M:%S")
  else
    local reset_time=$(date -d "@$reset" +"%Y-%m-%d %H:%M:%S")
  fi
  
  local percentage=$((remaining * 100 / limit))
  echo "$remaining|$limit|$percentage|$reset_time"
}

# Function to get last publish time for a package
get_last_publish() {
  local repo=$1
  
  # Get latest release or tag
  local latest_release=$(gh api "repos/$OWNER/$repo/releases/latest" 2>/dev/null | jq -r '.published_at // empty')
  
  if [[ -z "$latest_release" ]]; then
    # Try tags if no releases
    local latest_tag=$(gh api "repos/$OWNER/$repo/tags" --jq '.[0].name // empty' 2>/dev/null)
    if [[ -n "$latest_tag" ]]; then
      latest_release="tag: $latest_tag"
    else
      latest_release="never"
    fi
  else
    # Convert to relative time
    if [[ "$(uname)" == "Darwin" ]]; then
      # macOS: Use different date parsing
      local publish_timestamp=$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "$latest_release" +%s 2>/dev/null || echo 0)
    else
      local publish_timestamp=$(date -d "$latest_release" +%s 2>/dev/null || echo 0)
    fi
    local current_timestamp=$(date +%s)
    local diff=$((current_timestamp - publish_timestamp))
    
    if [[ $diff -lt 3600 ]]; then
      latest_release="$((diff / 60))m ago"
    elif [[ $diff -lt 86400 ]]; then
      latest_release="$((diff / 3600))h ago"
    else
      latest_release="$((diff / 86400))d ago"
    fi
  fi
  
  echo "$latest_release"
}

# Main monitoring logic
echo -e "${BLUE}🔍 CI Pipeline Health Monitor${NC}"
echo -e "${BLUE}=============================${NC}"
echo ""

# Check rate limit first
echo -e "${YELLOW}📊 API Rate Limit Status${NC}"
IFS='|' read -r remaining limit percentage reset_time <<< "$(check_rate_limit)"
if [[ $percentage -lt 20 ]]; then
  echo -e "${RED}⚠️  Low API quota: $remaining/$limit ($percentage%) - Resets at $reset_time${NC}"
else
  echo -e "${GREEN}✅ API quota: $remaining/$limit ($percentage%)${NC}"
fi
echo ""

# Monitor meta repository
echo -e "${YELLOW}📦 Meta Repository Status${NC}"
echo -e "Repository: $OWNER/$META_REPO"

# Check meta repo workflows
IFS='|' read -r status failures <<< "$(get_workflow_status "$META_REPO")"
if [[ "$status" == "passing" ]]; then
  echo -e "  CI Status: ${GREEN}✅ Passing${NC}"
elif [[ "$status" == "failing" ]]; then
  echo -e "  CI Status: ${RED}❌ Failing${NC}"
  echo -e "  Failed workflows: ${RED}$failures${NC}"
else
  echo -e "  CI Status: ${YELLOW}⚠️  Unknown${NC}"
fi

# Check PRs
IFS='|' read -r open_prs mergeable conflicted <<< "$(check_pr_status "$META_REPO")"
echo -e "  Open PRs: $open_prs (Mergeable: $mergeable, Conflicts: $conflicted)"

# Check for Renovate dashboard
if gh api "repos/$OWNER/$META_REPO/contents/.github/DEPENDENCY_DASHBOARD.md" &>/dev/null; then
  echo -e "  Renovate: ${GREEN}✅ Dashboard exists${NC}"
else
  echo -e "  Renovate: ${YELLOW}⚠️  No dashboard found${NC}"
fi
echo ""

# Monitor package repositories
echo -e "${YELLOW}📦 Package Repository Status${NC}"
echo -e "─────────────────────────────────────────────────────────────────────"
printf "%-20s %-12s %-15s %-10s %-10s\n" "Package" "CI Status" "Last Publish" "Open PRs" "Issues"
echo -e "─────────────────────────────────────────────────────────────────────"

# Summary counters
total_packages=${#PACKAGES[@]}
passing_packages=0
failing_packages=0
total_open_prs=0
total_conflicts=0

# Check each package
for package in "${PACKAGES[@]}"; do
  # Get workflow status
  IFS='|' read -r status failures <<< "$(get_workflow_status "$package")"
  
  # Get PR status
  IFS='|' read -r open_prs mergeable conflicted <<< "$(check_pr_status "$package")"
  total_open_prs=$((total_open_prs + open_prs))
  total_conflicts=$((total_conflicts + conflicted))
  
  # Get last publish
  last_publish=$(get_last_publish "$package")
  
  # Count status
  if [[ "$status" == "passing" ]]; then
    status_icon="${GREEN}✅${NC}"
    ((passing_packages++))
  elif [[ "$status" == "failing" ]]; then
    status_icon="${RED}❌${NC}"
    ((failing_packages++))
  else
    status_icon="${YELLOW}⚠️ ${NC}"
  fi
  
  # Format PR info
  if [[ $conflicted -gt 0 ]]; then
    pr_info="${YELLOW}$open_prs ($conflicted conflicts)${NC}"
  else
    pr_info="$open_prs"
  fi
  
  # Output row
  printf "%-20s %-20s %-15s %-20s %-10s\n" \
    "$package" "$status_icon $status" "$last_publish" "$pr_info" "-"
done

echo -e "─────────────────────────────────────────────────────────────────────"

# Overall health calculation
health_score=$((passing_packages * 100 / total_packages))
automation_effectiveness=$((100 - (total_conflicts * 10)))
automation_effectiveness=$((automation_effectiveness < 0 ? 0 : automation_effectiveness))

echo ""
echo -e "${YELLOW}📊 Summary${NC}"
echo -e "─────────────────────────"
echo -e "Total Packages: $total_packages"
echo -e "Passing: ${GREEN}$passing_packages${NC}"
echo -e "Failing: ${RED}$failing_packages${NC}"
echo -e "Open PRs: $total_open_prs"
echo -e "Conflicts: ${YELLOW}$total_conflicts${NC}"
echo ""

# Overall health indicator
echo -ne "Overall Health: "
if [[ $health_score -ge 90 ]]; then
  echo -e "${GREEN}🟢 Healthy ($health_score%)${NC}"
elif [[ $health_score -ge 70 ]]; then
  echo -e "${YELLOW}🟡 Warning ($health_score%)${NC}"
else
  echo -e "${RED}🔴 Critical ($health_score%)${NC}"
fi

echo -e "Automation Effectiveness: $automation_effectiveness%"

# Recent issues detection
echo ""
echo -e "${YELLOW}🚨 Recent Issues${NC}"
echo -e "─────────────────────────"

issues_found=false

# Check for stale PRs (older than 7 days)
for package in "${PACKAGES[@]}"; do
  stale_prs=$(gh pr list --repo "$OWNER/$package" \
    --label "dependencies" \
    --json number,title,createdAt \
    --jq 'map(select((now - (.createdAt | fromdateiso8601)) > 604800)) | length')
  
  if [[ $stale_prs -gt 0 ]]; then
    echo -e "- ${YELLOW}$package${NC}: $stale_prs stale PR(s) (>7 days old)"
    issues_found=true
  fi
done

# Check for workflow failures
if [[ $failing_packages -gt 0 ]]; then
  echo -e "- ${RED}$failing_packages packages with failing CI${NC}"
  issues_found=true
fi

# Check for high conflict rate
if [[ $total_conflicts -gt 3 ]]; then
  echo -e "- ${YELLOW}High conflict rate: $total_conflicts PRs with conflicts${NC}"
  issues_found=true
fi

if [[ "$issues_found" == "false" ]]; then
  echo -e "${GREEN}✅ No critical issues detected${NC}"
fi

# Recommendations
echo ""
echo -e "${YELLOW}💡 Recommendations${NC}"
echo -e "─────────────────────────"

if [[ $failing_packages -gt 0 ]]; then
  echo "- Investigate failing CI builds in affected packages"
fi

if [[ $total_conflicts -gt 0 ]]; then
  echo "- Resolve PR conflicts to enable automerge"
fi

if [[ $total_open_prs -gt 20 ]]; then
  echo "- High PR count detected - review automerge settings"
fi

if [[ $percentage -lt 30 ]]; then
  echo "- API rate limit low - reduce monitoring frequency"
fi

# Output JSON if requested
if [[ "$OUTPUT_FORMAT" == "json" ]]; then
  # Build JSON output
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
    "status": "$status",
    "open_prs": $open_prs
  }
}
EOF
fi