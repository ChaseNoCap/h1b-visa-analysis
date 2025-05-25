#!/bin/bash

# Script to update workflows in all package repositories

PACKAGES=(
  "cache"
  "di-framework"
  "event-system"
  "file-system"
  "logger"
  "markdown-compiler"
  "prompts"
  "report-components"
  "report-templates"
  "test-helpers"
  "test-mocks"
)

echo "🔄 Updating workflows in all package repositories..."
echo "This will add push triggers and manual dispatch support."
echo ""

# Track successful updates
SUCCESS_COUNT=0
FAILED_PACKAGES=()

for package in "${PACKAGES[@]}"; do
  echo "📦 Updating $package..."
  
  cd "packages/$package" || {
    echo "❌ Failed to enter $package directory"
    FAILED_PACKAGES+=("$package")
    continue
  }
  
  # Copy updated workflow
  cp "../../scripts/notify-parent-template.yml" ".github/workflows/notify-parent.yml"
  
  # Check if there are changes
  if git diff --quiet; then
    echo "✅ Already up to date"
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
  else
    # Commit and push
    git add .github/workflows/notify-parent.yml
    git commit -m "fix: update workflow triggers for testing

- Add push trigger for main branch
- Add manual workflow_dispatch trigger
- Update condition logic to handle all trigger types
- Improve version detection for different events

This enables proper testing of the automation system." || {
      echo "❌ Failed to commit"
      FAILED_PACKAGES+=("$package")
      cd ../..
      continue
    }
    
    git push origin main || {
      echo "❌ Failed to push"
      FAILED_PACKAGES+=("$package")
      cd ../..
      continue
    }
    
    echo "✅ Successfully updated and pushed"
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
  fi
  
  cd ../..
  sleep 1  # Small delay to avoid rate limiting
done

echo ""
echo "🎯 Update Summary"
echo "================="
echo "✅ Successfully updated: $SUCCESS_COUNT packages"
echo "❌ Failed: ${#FAILED_PACKAGES[@]} packages"

if [ ${#FAILED_PACKAGES[@]} -gt 0 ]; then
  echo ""
  echo "Failed packages:"
  for pkg in "${FAILED_PACKAGES[@]}"; do
    echo "  - $pkg"
  done
fi

echo ""
echo "🧪 Testing the Updates"
echo "====================="
echo ""
echo "The workflows should now trigger on:"
echo "1. Every push to main branch"
echo "2. Manual workflow dispatch"
echo "3. Release creation"
echo "4. After 'Publish Package' workflow"
echo ""
echo "Monitor at:"
echo "- Meta repo: https://github.com/ChaseNoCap/h1b-visa-analysis/actions"
echo "- Meta PRs: https://github.com/ChaseNoCap/h1b-visa-analysis/pulls"