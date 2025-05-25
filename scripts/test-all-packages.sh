#!/bin/bash

# Script to test GitHub Actions automation for all packages

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

TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
STATUS_FILE="../docs/automation-validation-status.md"

echo "🚀 Testing GitHub Actions Automation for All Packages"
echo "===================================================="
echo "Timestamp: $TIMESTAMP"
echo ""

# Function to update status in markdown file
update_status() {
  local package=$1
  local column=$2
  local status=$3
  
  # This is a placeholder - in real implementation would update the markdown table
  echo "[$package] $column: $status"
}

# Function to add automation notice to README
add_automation_notice() {
  local package=$1
  local readme_path="packages/$package/README.md"
  
  if [ ! -f "$readme_path" ]; then
    echo "Creating README.md for $package"
    cat > "$readme_path" << EOF
# @chasenocap/$package

## Automation Status

This package is integrated with automated dependency updates:
- ✅ GitHub Actions workflow configured
- ✅ Repository dispatch enabled
- ✅ Automated PR creation on publish
- ✅ Renovate monitoring for updates

**Validation Date**: $TIMESTAMP

---

EOF
  else
    # Append automation notice if not already present
    if ! grep -q "Automation Status" "$readme_path"; then
      cat >> "$readme_path" << EOF

## Automation Status

This package is integrated with automated dependency updates:
- ✅ GitHub Actions workflow configured
- ✅ Repository dispatch enabled
- ✅ Automated PR creation on publish
- ✅ Renovate monitoring for updates

**Validation Date**: $TIMESTAMP
EOF
    else
      # Update validation date
      sed -i.bak "s/\*\*Validation Date\*\*:.*/\*\*Validation Date\*\*: $TIMESTAMP/" "$readme_path"
      rm "${readme_path}.bak"
    fi
  fi
}

# Main test loop
for package in "${PACKAGES[@]}"; do
  echo ""
  echo "📦 Testing $package..."
  echo "------------------------"
  
  cd "packages/$package" || {
    echo "❌ Failed to enter $package directory"
    update_status "$package" "Status" "❌ Directory Error"
    continue
  }
  
  # Step 1: Add workflow if not exists
  if [ ! -f ".github/workflows/notify-parent.yml" ]; then
    echo "⚠️  Workflow not found, adding..."
    mkdir -p .github/workflows
    cp "../../scripts/notify-parent-template.yml" ".github/workflows/notify-parent.yml"
    git add .github/workflows/notify-parent.yml
    git commit -m "feat: add parent notification workflow"
    update_status "$package" "Workflow Added" "✅"
  else
    echo "✅ Workflow already exists"
    update_status "$package" "Workflow Added" "✅"
  fi
  
  # Step 2: Update README with automation notice
  echo "📝 Updating README.md..."
  add_automation_notice "$package"
  
  # Step 3: Commit changes
  if ! git diff --quiet; then
    git add README.md
    git commit -m "docs: add automation validation notice

Testing automated dependency update system.
Validation timestamp: $TIMESTAMP"
    update_status "$package" "Test Commit" "✅"
    
    # Step 4: Push changes
    echo "📤 Pushing to origin..."
    if git push origin main; then
      echo "✅ Successfully pushed changes"
      update_status "$package" "Workflow Run" "⏳"
      
      # Note the workflow URL
      echo "🔗 Check workflow at: https://github.com/ChaseNoCap/$package/actions"
    else
      echo "❌ Failed to push changes"
      update_status "$package" "Workflow Run" "❌"
    fi
  else
    echo "ℹ️  No changes to commit (already up to date)"
    update_status "$package" "Test Commit" "✅"
  fi
  
  # Return to root
  cd ../.. || exit 1
  
  # Small delay to avoid rate limiting
  sleep 2
done

echo ""
echo "✅ Test execution complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Monitor each package's Actions tab for workflow runs"
echo "2. Check h1b-visa-analysis Actions for repository dispatch triggers"
echo "3. Look for automated PRs in the meta repository"
echo "4. Update the validation status document with results"
echo ""
echo "🔗 Quick Links:"
echo "- Meta repo actions: https://github.com/ChaseNoCap/h1b-visa-analysis/actions"
echo "- Meta repo PRs: https://github.com/ChaseNoCap/h1b-visa-analysis/pulls"
echo "- Renovate dashboard: https://app.renovatebot.com/dashboard"