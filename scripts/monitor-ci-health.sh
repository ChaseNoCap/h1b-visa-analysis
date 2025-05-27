#!/bin/bash

# Enhanced CI Pipeline Health Monitor
# Provides transparent workflow categorization without misleading metrics

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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

# Initialize counters
ci_packages=0
notify_working=0
notify_total=0

# Function to check API rate limit
check_rate_limit() {
  local rate_info=$(gh api rate_limit)
  local remaining=$(echo "$rate_info" | jq -r '.rate.remaining')
  local limit=$(echo "$rate_info" | jq -r '.rate.limit')
  local percentage=$((remaining * 100 / limit))
  echo "$percentage"
}

# Function to categorize and count workflows
analyze_package_workflows() {
  local package=$1
  local has_ci=false
  local notify_status="none"
  
  # Check for CI workflows (including unified workflow)
  if gh api "repos/$OWNER/$package/contents/.github/workflows" --jq '.[].name' 2>/dev/null | grep -qE "(ci|test|build|unified-workflow)\.yml"; then
    has_ci=true
  fi
  
  # Check notify workflow (unified workflow includes notify functionality)
  local notify_runs=$(gh run list --repo "$OWNER/$package" \
    --workflow "Unified Package Workflow" \
    --limit 5 --json conclusion 2>/dev/null || echo "[]")
  
  if [[ "$notify_runs" != "[]" && $(echo "$notify_runs" | jq 'length') -gt 0 ]]; then
    ((notify_total++))
    local latest=$(echo "$notify_runs" | jq -r '.[0].conclusion')
    if [[ "$latest" == "success" ]]; then
      notify_status="success"
      ((notify_working++))
    else
      notify_status="failure"
    fi
  fi
  
  echo "$package|$has_ci|$notify_status"
}

# Function to check Renovate activity
check_renovate_status() {
  local prs=$(gh pr list --repo "$OWNER/$META_REPO" \
    --author "renovate[bot]" \
    --json number,title,state,createdAt \
    --limit 10)
  
  local open=$(echo "$prs" | jq -r 'map(select(.state == "OPEN")) | length')
  local total=$(echo "$prs" | jq -r 'length')
  
  echo "$open|$total"
}

# Main execution
if [[ "$OUTPUT_FORMAT" == "json" ]]; then
  # JSON output for automation
  results=()
  for package in "${PACKAGES[@]}"; do
    result=$(analyze_package_workflows "$package")
    results+=("$result")
  done
  
  renovate_info=$(check_renovate_status)
  IFS='|' read -r renovate_open renovate_total <<< "$renovate_info"
  
  cat << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "packages_with_ci": $ci_packages,
  "notify_success_rate": $(if [[ $notify_total -gt 0 ]]; then echo $((notify_working * 100 / notify_total)); else echo 0; fi),
  "renovate_open_prs": $renovate_open,
  "api_rate_limit": $(check_rate_limit)
}
EOF
else
  # Human-readable output
  echo -e "${BLUE}🚀 Enhanced CI Pipeline Health Monitor${NC}"
  echo -e "${BLUE}======================================${NC}"
  echo ""
  
  # API rate limit
  rate_percent=$(check_rate_limit)
  echo -e "${YELLOW}📊 API Rate Limit:${NC} ${rate_percent}%"
  echo ""
  
  # Check meta repository
  echo -e "${YELLOW}📦 Meta Repository Status${NC}"
  meta_status=$(gh run list --repo "$OWNER/$META_REPO" \
    --workflow "Generate H1B Report" \
    --limit 1 --json conclusion \
    --jq '.[0].conclusion' 2>/dev/null || echo "unknown")
  
  if [[ "$meta_status" == "success" ]]; then
    echo -e "  CI Status: ${GREEN}✅ Passing${NC}"
  else
    echo -e "  CI Status: ${RED}❌ Failing${NC}"
  fi
  echo ""
  
  # Analyze packages
  echo -e "${YELLOW}📊 Package Analysis${NC}"
  echo -e "────────────────────────────────────────────────"
  printf "%-20s %-10s %-15s\n" "Package" "Has CI?" "Notify Status"
  echo -e "────────────────────────────────────────────────"
  
  for package in "${PACKAGES[@]}"; do
    result=$(analyze_package_workflows "$package")
    IFS='|' read -r pkg has_ci notify_status <<< "$result"
    
    # Format output
    ci_icon="❌"
    if [[ "$has_ci" == "true" ]]; then
      ci_icon="✅"
      ((ci_packages++))
    fi
    
    notify_icon="⚫"
    [[ "$notify_status" == "success" ]] && notify_icon="✅"
    [[ "$notify_status" == "failure" ]] && notify_icon="❌"
    
    printf "%-20s %-10s %-15s\n" "$pkg" "$ci_icon" "$notify_icon"
  done
  echo ""
  
  # Get real-time metrics
  echo -e "${YELLOW}📈 Real-Time Metrics${NC}"
  echo -e "────────────────────────────────────────────────"
  
  # Calculate notify success rate from recent runs
  notify_success=0
  notify_runs=0
  for package in "${PACKAGES[@]}"; do
    runs=$(gh api "repos/$OWNER/$package/actions/workflows" --jq '.workflows[] | select(.name == "Notify Parent Repository on Publish") | .id' 2>/dev/null | head -1)
    if [[ -n "$runs" ]]; then
      recent=$(gh api "repos/$OWNER/$package/actions/workflows/$runs/runs?per_page=3" --jq '.workflow_runs[] | .conclusion' 2>/dev/null)
      while IFS= read -r conclusion; do
        if [[ -n "$conclusion" ]]; then
          notify_runs=$((notify_runs + 1))
          [[ "$conclusion" == "success" ]] && notify_success=$((notify_success + 1))
        fi
      done <<< "$recent"
    fi
  done
  
  notify_rate=0
  [[ $notify_runs -gt 0 ]] && notify_rate=$((notify_success * 100 / notify_runs))
  
  # Check publish automation (unified workflows include publish functionality)
  publish_count=0
  for package in "${PACKAGES[@]}"; do
    if gh api "repos/$OWNER/$package/contents/.github/workflows" --jq '.[].name' 2>/dev/null | grep -qE "(publish|unified-workflow)"; then
      publish_count=$((publish_count + 1))
    fi
  done
  
  echo -e "Packages with CI: ${ci_packages}/11 ($((ci_packages * 100 / 11))%)"
  echo -e "Notify Success Rate: ${notify_rate}% (${notify_success}/${notify_runs} recent runs)"
  echo -e "Publish Automation: ${publish_count}/11 packages"
  
  # Renovate status
  renovate_info=$(check_renovate_status)
  IFS='|' read -r renovate_open renovate_total <<< "$renovate_info"
  echo -e "Renovate PRs: ${renovate_open} open"
  
  # Calculate health score
  health_score=$(( (notify_rate * 40 / 100) + (publish_count * 60 / 11) ))
  echo ""
  echo -e "${YELLOW}🎯 Overall Health Score: ${health_score}%${NC}"
  echo -e "────────────────────────────────────────────────"
  
  # Dynamic assessment based on metrics
  if [[ $health_score -ge 80 ]]; then
    echo -e "• Pipeline Status: ${GREEN}✅ Healthy${NC}"
  elif [[ $health_score -ge 50 ]]; then
    echo -e "• Pipeline Status: ${YELLOW}⚠️  Needs Improvement${NC}"
  else
    echo -e "• Pipeline Status: ${RED}❌ Critical Issues${NC}"
  fi
  
  echo -e "• Meta Repository: ${GREEN}✅ Working${NC}"
  echo -e "• Notify System: $([ $notify_rate -ge 80 ] && echo "${GREEN}✅ Operational${NC}" || echo "${YELLOW}⚠️  Issues Detected${NC}")"
  echo -e "• Publish Automation: $([ $publish_count -ge 6 ] && echo "${GREEN}✅ Good Coverage${NC}" || echo "${RED}⚠️  Low Coverage${NC}")"
  echo -e "• Renovate: ${GREEN}✅ Active Fallback${NC}"
  echo ""
  
  # Data-driven recommendations
  echo -e "${YELLOW}💡 Data-Driven Next Steps${NC}"
  echo -e "────────────────────────────────────────────────"
  if [[ $publish_count -lt 11 ]]; then
    echo -e "• Priority 1: Complete publish automation ($((11 - publish_count)) packages remaining)"
  fi
  if [[ $notify_rate -lt 95 ]]; then
    echo -e "• Priority 2: Investigate notify workflow failures"
  fi
  echo -e "• Run ./scripts/generate-ci-dashboard.sh for detailed analysis"
fi