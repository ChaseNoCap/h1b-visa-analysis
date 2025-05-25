#!/bin/bash

# Script to deploy notify-parent workflow to all package repositories

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

WORKFLOW_TEMPLATE="notify-parent-template.yml"
WORKFLOW_NAME="notify-parent.yml"

echo "🚀 Deploying notify-parent workflow to all package repositories..."

for package in "${PACKAGES[@]}"; do
  echo ""
  echo "📦 Processing $package..."
  
  REPO_PATH="packages/$package"
  
  if [ ! -d "$REPO_PATH" ]; then
    echo "❌ Directory $REPO_PATH not found, skipping..."
    continue
  fi
  
  cd "$REPO_PATH" || exit 1
  
  # Create .github/workflows directory if it doesn't exist
  mkdir -p .github/workflows
  
  # Copy workflow template
  cp "../../scripts/$WORKFLOW_TEMPLATE" ".github/workflows/$WORKFLOW_NAME"
  
  # Check if there are changes
  if git diff --quiet; then
    echo "✅ Workflow already exists and is up to date"
  else
    # Add and commit the workflow
    git add .github/workflows/$WORKFLOW_NAME
    git commit -m "feat: add parent repository notification workflow

This workflow notifies the h1b-visa-analysis meta repository
when a new version of this package is published."
    
    echo "📤 Pushing to origin..."
    git push origin main
    
    echo "✅ Successfully deployed workflow to $package"
  fi
  
  # Return to root directory
  cd ../.. || exit 1
done

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "⚠️  Remember to add PAT_TOKEN secret to each repository:"
echo "   1. Go to repository Settings → Secrets → Actions"
echo "   2. Add new secret named PAT_TOKEN"
echo "   3. Use a Personal Access Token with repo and workflow permissions"