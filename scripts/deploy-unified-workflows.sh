#!/bin/bash
# Deploy unified workflows to all packages

set -e

echo "🚀 Deploying Unified Package Workflows"
echo "====================================="
echo ""

# Check if template exists
if [ ! -f "scripts/unified-publish-template.yml" ]; then
    echo "❌ Error: unified-publish-template.yml not found!"
    exit 1
fi

# Get all package directories
packages=(
    "di-framework"
    "logger" 
    "test-mocks"
    "test-helpers"
    "file-system"
    "event-system"
    "cache"
    "report-templates"
    "prompts"
    "markdown-compiler"
    "report-components"
)

# Deploy to each package
echo "📦 Deploying workflows to packages..."
echo ""

for package in "${packages[@]}"; do
    package_path="packages/$package"
    
    if [ ! -d "$package_path" ]; then
        echo "⚠️  Warning: $package_path not found, skipping..."
        continue
    fi
    
    echo "→ Processing $package..."
    
    # Create .github/workflows directory if it doesn't exist
    mkdir -p "$package_path/.github/workflows"
    
    # Copy the unified workflow
    cp scripts/unified-publish-template.yml "$package_path/.github/workflows/unified-workflow.yml"
    
    # Remove old workflows if they exist
    if [ -f "$package_path/.github/workflows/publish.yml" ]; then
        rm "$package_path/.github/workflows/publish.yml"
        echo "  ✓ Removed old publish.yml"
    fi
    
    if [ -f "$package_path/.github/workflows/notify-parent.yml" ]; then
        rm "$package_path/.github/workflows/notify-parent.yml"
        echo "  ✓ Removed old notify-parent.yml"
    fi
    
    echo "  ✓ Deployed unified-workflow.yml"
    
    # Stage changes for commit
    cd "$package_path"
    git add .github/workflows/
    cd - > /dev/null
done

echo ""
echo "✅ Workflows deployed to all packages!"
echo ""
echo "📋 Next Steps:"
echo "1. Review changes in each package"
echo "2. Commit with message: 'feat: implement unified dependency strategy with tag-based publishing'"
echo "3. Push changes to all package repositories"
echo ""
echo "💡 To commit all packages, run:"
echo "   ./scripts/commit-all-packages.sh 'feat: implement unified dependency strategy with tag-based publishing'"