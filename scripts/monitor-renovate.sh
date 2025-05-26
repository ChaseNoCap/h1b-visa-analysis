#!/bin/bash

# Renovate-specific Monitoring Script
# Monitors Renovate bot activity, PR velocity, and automerge effectiveness

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
OWNER="ChaseNoCap"
META_REPO="h1b-visa-analysis"

echo -e "${BLUE}🔄 Renovate Activity Monitor${NC}"
echo -e "${BLUE}============================${NC}"
echo ""

# Function to check Renovate configuration
check_renovate_config() {
  echo -e "${YELLOW}📋 Renovate Configuration${NC}"
  
  # Check if renovate.json exists
  if gh api "repos/$OWNER/$META_REPO/contents/renovate.json" &>/dev/null; then
    echo -e "  Config: ${GREEN}✅ renovate.json found${NC}"
    
    # Get key settings
    local config=$(gh api "repos/$OWNER/$META_REPO/contents/renovate.json" --jq '.content' | base64 -d)
    
    # Extract schedule
    local schedule=$(echo "$config" | jq -r '.schedule[0] // "not set"')
    echo -e "  Schedule: $schedule"
    
    # Extract PR limits
    local pr_limit=$(echo "$config" | jq -r '.prConcurrentLimit // "unlimited"')
    local pr_hourly=$(echo "$config" | jq -r '.prHourlyLimit // "unlimited"')
    echo -e "  PR Limits: $pr_limit concurrent, $pr_hourly per hour"
    
    # Check automerge settings
    local automerge_count=$(echo "$config" | jq -r '.packageRules | map(select(.automerge == true)) | length')
    echo -e "  Automerge Rules: $automerge_count configured"
  else
    echo -e "  Config: ${RED}❌ renovate.json not found${NC}"
  fi
  echo ""
}

# Function to analyze Renovate PRs
analyze_renovate_prs() {
  echo -e "${YELLOW}📊 Renovate PR Analysis${NC}"
  
  # Get all Renovate PRs (open and closed)
  local all_prs=$(gh pr list --repo "$OWNER/$META_REPO" \
    --author "renovate[bot]" \
    --json number,title,state,createdAt,closedAt,mergedAt,labels \
    --limit 50)
  
  local open_prs=$(echo "$all_prs" | jq -r 'map(select(.state == "OPEN")) | length')
  local merged_recent=$(echo "$all_prs" | jq -r 'map(select(.mergedAt != null and ((now - (.mergedAt | fromdateiso8601)) < 86400))) | length')
  
  echo -e "  Open Renovate PRs: $open_prs"
  echo -e "  Merged in last 24h: $merged_recent"
  
  # Check for different update types
  local security_prs=$(echo "$all_prs" | jq -r 'map(select(.state == "OPEN" and (.labels | map(.name) | contains(["security"])))) | length')
  local major_prs=$(echo "$all_prs" | jq -r 'map(select(.state == "OPEN" and (.title | contains("major")))) | length')
  
  if [[ $security_prs -gt 0 ]]; then
    echo -e "  ${RED}Security Updates: $security_prs pending${NC}"
  fi
  
  if [[ $major_prs -gt 0 ]]; then
    echo -e "  ${YELLOW}Major Updates: $major_prs pending${NC}"
  fi
  
  # Average time to merge
  local merge_times=$(echo "$all_prs" | jq -r '
    map(select(.mergedAt != null) | 
    ((.mergedAt | fromdateiso8601) - (.createdAt | fromdateiso8601)) / 3600) | 
    if . < 0 then 0 else . end')
  
  if [[ -n "$merge_times" ]] && [[ $(echo "$all_prs" | jq -r 'map(select(.mergedAt != null)) | length') -gt 0 ]]; then
    local avg_merge_time=$(echo "$merge_times" | jq -s 'if length > 0 then add/length else 0 end' | xargs printf "%.1f")
    echo -e "  Avg merge time: ${avg_merge_time}h"
  fi
  
  echo ""
}

# Function to check automerge effectiveness
check_automerge() {
  echo -e "${YELLOW}🤖 Automerge Effectiveness${NC}"
  
  # Get recent closed PRs
  local closed_prs=$(gh pr list --repo "$OWNER/$META_REPO" \
    --author "renovate[bot]" \
    --state closed \
    --json number,title,mergedAt,labels,mergeCommit \
    --limit 20)
  
  local total_closed=$(echo "$closed_prs" | jq -r 'length')
  local auto_merged=$(echo "$closed_prs" | jq -r 'map(select(.labels | map(.name) | contains(["automerge"]))) | length')
  
  if [[ $total_closed -gt 0 ]]; then
    local automerge_rate=$((auto_merged * 100 / total_closed))
    echo -e "  Automerge rate: $automerge_rate% ($auto_merged/$total_closed)"
    
    if [[ $automerge_rate -lt 70 ]]; then
      echo -e "  ${YELLOW}⚠️  Low automerge rate - check for test failures${NC}"
    else
      echo -e "  ${GREEN}✅ Good automerge rate${NC}"
    fi
  else
    echo -e "  No recent closed PRs to analyze"
  fi
  
  echo ""
}

# Function to check for Renovate issues
check_renovate_issues() {
  echo -e "${YELLOW}🚨 Potential Issues${NC}"
  
  local issues_found=false
  
  # Check for old open PRs
  local old_prs=$(gh pr list --repo "$OWNER/$META_REPO" \
    --author "renovate[bot]" \
    --json number,title,createdAt \
    --jq 'map(select((now - (.createdAt | fromdateiso8601)) > 604800))')
  
  local old_count=$(echo "$old_prs" | jq -r 'length')
  
  if [[ $old_count -gt 0 ]]; then
    echo -e "  ${YELLOW}⚠️  $old_count PR(s) older than 7 days:${NC}"
    echo "$old_prs" | jq -r '.[] | "     #\(.number): \(.title)"'
    issues_found=true
  fi
  
  # Check for conflicted PRs
  local conflicted=$(gh pr list --repo "$OWNER/$META_REPO" \
    --author "renovate[bot]" \
    --json number,title,mergeable \
    --jq 'map(select(.mergeable == "CONFLICTING"))')
  
  local conflict_count=$(echo "$conflicted" | jq -r 'length')
  
  if [[ $conflict_count -gt 0 ]]; then
    echo -e "  ${RED}❌ $conflict_count PR(s) with conflicts:${NC}"
    echo "$conflicted" | jq -r '.[] | "     #\(.number): \(.title)"'
    issues_found=true
  fi
  
  if [[ "$issues_found" == "false" ]]; then
    echo -e "  ${GREEN}✅ No issues detected${NC}"
  fi
  
  echo ""
}

# Function to show Renovate dashboard status
check_dependency_dashboard() {
  echo -e "${YELLOW}📋 Dependency Dashboard${NC}"
  
  if gh api "repos/$OWNER/$META_REPO/contents/.github/DEPENDENCY_DASHBOARD.md" &>/dev/null; then
    echo -e "  Dashboard: ${GREEN}✅ Available${NC}"
    echo -e "  URL: https://github.com/$OWNER/$META_REPO/blob/main/.github/DEPENDENCY_DASHBOARD.md"
    
    # Get last update time
    local last_update=$(gh api "repos/$OWNER/$META_REPO/commits?path=.github/DEPENDENCY_DASHBOARD.md&per_page=1" \
      --jq '.[0].commit.committer.date // "unknown"')
    
    if [[ "$last_update" != "unknown" ]]; then
      if [[ "$(uname)" == "Darwin" ]]; then
        local update_timestamp=$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "$last_update" +%s 2>/dev/null || echo 0)
      else
        local update_timestamp=$(date -d "$last_update" +%s 2>/dev/null || echo 0)
      fi
      local current_timestamp=$(date +%s)
      local diff=$((current_timestamp - update_timestamp))
      
      if [[ $diff -lt 3600 ]]; then
        echo -e "  Last updated: $((diff / 60)) minutes ago"
      elif [[ $diff -lt 86400 ]]; then
        echo -e "  Last updated: $((diff / 3600)) hours ago"
      else
        echo -e "  Last updated: $((diff / 86400)) days ago"
      fi
    fi
  else
    echo -e "  Dashboard: ${YELLOW}⚠️  Not found${NC}"
    echo -e "  ${YELLOW}Enable with ':dependencyDashboard' in renovate.json${NC}"
  fi
  echo ""
}

# Main execution
check_renovate_config
analyze_renovate_prs
check_automerge
check_renovate_issues
check_dependency_dashboard

# Summary and recommendations
echo -e "${BLUE}💡 Recommendations${NC}"
echo -e "────────────────────"

# Get current stats for recommendations
prs=$(gh pr list --repo "$OWNER/$META_REPO" --author "renovate[bot]" --json state --jq 'map(select(.state == "OPEN")) | length')

if [[ $prs -gt 10 ]]; then
  echo "- High PR count ($prs) - consider increasing automerge scope"
fi

if [[ $prs -gt 0 ]]; then
  echo "- Review open PRs: gh pr list --repo $OWNER/$META_REPO --author 'renovate[bot]'"
fi

echo "- Check logs: https://app.renovatebot.com/dashboard#github/$OWNER/$META_REPO"
echo ""

# Quick commands
echo -e "${BLUE}🛠️  Useful Commands${NC}"
echo -e "────────────────────"
echo "# Merge all mergeable Renovate PRs:"
echo "gh pr list --repo $OWNER/$META_REPO --author 'renovate[bot]' --json number,mergeable --jq '.[] | select(.mergeable == \"MERGEABLE\") | .number' | xargs -I {} gh pr merge {} --repo $OWNER/$META_REPO --auto"
echo ""
echo "# Rebase all Renovate PRs:"
echo "gh pr list --repo $OWNER/$META_REPO --author 'renovate[bot]' --json number --jq '.[].number' | xargs -I {} gh pr comment {} --repo $OWNER/$META_REPO --body '@renovate rebase'"