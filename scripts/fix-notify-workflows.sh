#!/bin/bash

# Fix Notify Workflows Script
# Updates notify workflows in all packages for reliable instant updates

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
PACKAGES=(
  "cache" "di-framework" "event-system" "file-system" 
  "logger" "markdown-compiler" "prompts" "report-components"
  "report-templates" "test-helpers" "test-mocks"
)

echo -e "${YELLOW}🔧 Fixing Notify Workflows for Instant Updates${NC}"
echo "================================================"

# Function to update workflow in a package
update_package_workflow() {
  local package=$1
  local package_dir="packages/$package"
  
  echo -e "\n${YELLOW}📦 Processing $package...${NC}"
  
  # Navigate to package
  cd "$package_dir"
  
  # Create .github/workflows directory if it doesn't exist
  mkdir -p .github/workflows
  
  # Copy the updated template
  cp ../../scripts/notify-parent-template.yml .github/workflows/notify-parent.yml
  
  # Check if there are changes
  if git status --porcelain | grep -q .; then
    echo -e "${GREEN}✅ Workflow updated${NC}"
    
    # Stage and commit
    git add .github/workflows/notify-parent.yml
    git commit -m "fix: update notify workflow for reliable instant updates

- Remove workflow_run trigger that was causing issues
- Simplify conditional logic for job execution
- Maintain push, release, and manual dispatch triggers
- Ensures instant updates to meta repository on package changes"
    
    # Push changes
    git push origin main
    echo -e "${GREEN}✅ Pushed to $package${NC}"
  else
    echo -e "${YELLOW}⏭️  No changes needed${NC}"
  fi
  
  # Return to root
  cd ../..
}

# Main execution
echo -e "\n${YELLOW}📋 Plan:${NC}"
echo "1. Update notify workflow template"
echo "2. Apply to all 11 packages"
echo "3. Commit and push changes"
echo "4. Verify workflows are functional"

# Confirmation
echo -e "\n${YELLOW}Ready to update all packages? (y/n)${NC}"
read -r response
if [[ "$response" != "y" ]]; then
  echo "Aborted."
  exit 0
fi

# Update all packages
success_count=0
fail_count=0

for package in "${PACKAGES[@]}"; do
  if update_package_workflow "$package"; then
    ((success_count++))
  else
    ((fail_count++))
    echo -e "${RED}❌ Failed to update $package${NC}"
  fi
done

# Summary
echo -e "\n${GREEN}📊 Summary:${NC}"
echo "- Successful updates: $success_count"
echo "- Failed updates: $fail_count"

if [[ $fail_count -eq 0 ]]; then
  echo -e "\n${GREEN}🎉 All packages updated successfully!${NC}"
  echo -e "\n${YELLOW}Next steps:${NC}"
  echo "1. Wait 2-3 minutes for workflows to initialize"
  echo "2. Test by pushing a small change to any package"
  echo "3. Verify instant update PR is created in meta repo"
else
  echo -e "\n${RED}⚠️  Some packages failed to update. Please check manually.${NC}"
fi

# Update meta repository to track changes
echo -e "\n${YELLOW}📝 Updating submodule references in meta repository...${NC}"
git add packages
git commit -m "chore: update submodules after notify workflow fixes" || echo "No submodule changes"