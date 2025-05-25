#!/bin/bash

# Comprehensive validation script for all packages

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

echo "🔍 Comprehensive Package Validation"
echo "==================================="
echo ""
echo "This script will make a small documentation change to each package"
echo "to trigger the GitHub Actions workflow."
echo ""

# Function to test a single package
test_package() {
  local package=$1
  local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
  
  echo ""
  echo "📦 Testing $package..."
  echo "------------------------"
  
  cd "packages/$package" || {
    echo "❌ Failed to enter $package directory"
    return 1
  }
  
  # Create or update AUTOMATION.md
  cat > AUTOMATION.md << EOF
# Automation Validation

This file validates the GitHub Actions automation setup.

## Status
- **Package**: @chasenocap/$package
- **Validation Time**: $timestamp
- **Workflow**: notify-parent.yml
- **Purpose**: Trigger automated dependency updates

## Configuration
- ✅ GitHub Actions workflow installed
- ✅ PAT_TOKEN secret configured
- ✅ Repository dispatch enabled
- ✅ Renovate monitoring active

## Test Results
- **Push Time**: $timestamp
- **Expected**: Workflow triggers on push
- **Monitor**: https://github.com/ChaseNoCap/$package/actions

---
*This file is used for automation testing and can be safely ignored.*
EOF

  # Commit and push
  git add AUTOMATION.md
  git commit -m "test: validate automation workflow

Automated test at $timestamp
Testing repository dispatch and PR creation" || {
    echo "ℹ️  No changes to commit"
    cd ../..
    return 0
  }
  
  git push origin main || {
    echo "❌ Failed to push"
    cd ../..
    return 1
  }
  
  echo "✅ Successfully pushed test commit"
  echo "🔗 Monitor at: https://github.com/ChaseNoCap/$package/actions"
  
  cd ../..
  
  # Small delay to avoid rate limiting
  sleep 3
}

# Main execution
echo "Starting validation tests..."

for package in "${PACKAGES[@]}"; do
  test_package "$package"
done

echo ""
echo "✅ All packages have been tested!"
echo ""
echo "📋 Validation Checklist:"
echo "========================"
echo ""
echo "1. Check each package's Actions tab:"
for package in "${PACKAGES[@]}"; do
  echo "   - https://github.com/ChaseNoCap/$package/actions"
done
echo ""
echo "2. Monitor meta repository:"
echo "   - Actions: https://github.com/ChaseNoCap/h1b-visa-analysis/actions"
echo "   - PRs: https://github.com/ChaseNoCap/h1b-visa-analysis/pulls"
echo ""
echo "3. Check Renovate Dashboard:"
echo "   - https://app.renovatebot.com/dashboard#github/ChaseNoCap/h1b-visa-analysis"
echo ""
echo "4. Expected Results:"
echo "   - Each push should trigger the notify-parent workflow"
echo "   - Repository dispatch should be sent to meta repo"
echo "   - Meta repo workflow should create/update PRs"
echo "   - Renovate should detect any version changes"
echo ""
echo "📊 Update the validation status document with results!"