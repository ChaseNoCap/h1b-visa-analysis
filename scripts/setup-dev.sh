#!/bin/bash
# setup-dev.sh - One-time setup for H1B Analysis development environment

set -e  # Exit on error

echo "🚀 H1B Analysis Development Environment Setup"
echo "==========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "packages" ]; then
    echo "❌ Error: Must run from h1b-visa-analysis root directory"
    exit 1
fi

# Step 1: Initialize submodules if needed
echo "📦 Step 1: Checking Git submodules..."
if [ -z "$(ls -A packages/)" ]; then
    echo "  → Initializing submodules..."
    git submodule update --init --recursive
else
    echo "  ✓ Submodules already initialized"
fi
echo ""

# Step 2: Install root dependencies
echo "📦 Step 2: Installing root dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "  ✓ Root dependencies already installed"
fi
echo ""

# Step 3: Install dependencies in all packages
echo "📦 Step 3: Installing package dependencies..."
for dir in packages/*/; do
    if [ -f "$dir/package.json" ]; then
        package_name=$(basename "$dir")
        echo "  → Installing dependencies for $package_name..."
        (cd "$dir" && npm install) > /dev/null 2>&1 || {
            echo "    ⚠️  Warning: Failed to install dependencies for $package_name"
        }
    fi
done
echo "  ✓ Package dependencies installed"
echo ""

# Step 4: Set up npm links
echo "🔗 Step 4: Setting up npm links for instant updates..."
node scripts/smart-deps.js setup
echo ""

# Step 5: Add convenience scripts to package.json if not present
echo "📝 Step 5: Adding convenience scripts..."
if ! grep -q '"dev:setup"' package.json; then
    # Create a temporary file with the new scripts
    node -e "
    const pkg = require('./package.json');
    pkg.scripts = pkg.scripts || {};
    pkg.scripts['dev'] = 'node scripts/smart-deps.js && npm run build:watch';
    pkg.scripts['dev:setup'] = 'bash scripts/setup-dev.sh';
    pkg.scripts['dev:status'] = 'node scripts/smart-deps.js status';
    pkg.scripts['dev:clean'] = 'node scripts/smart-deps.js clean';
    pkg.scripts['publish:tagged'] = 'bash scripts/publish-if-tagged.sh';
    pkg.scripts['test:mode'] = 'node scripts/smart-deps.js mode';
    require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\\n');
    "
    echo "  ✓ Added development scripts to package.json"
else
    echo "  ✓ Development scripts already present"
fi
echo ""

# Step 6: Create local development config if not exists
echo "📋 Step 6: Creating development configuration..."
if [ ! -f ".devmode.json" ]; then
    cat > .devmode.json << 'EOF'
{
  "local": {
    "autoLink": true,
    "watchAll": true,
    "testMode": "fast"
  },
  "pipeline": {
    "publishStrategy": "immediate",
    "testMode": "full",
    "notifyChannels": ["github"]
  },
  "packages": {
    "logger": {
      "tier": "core",
      "alwaysPublish": true
    },
    "di-framework": {
      "tier": "core",
      "alwaysPublish": true
    },
    "cache": {
      "tier": "shared"
    },
    "file-system": {
      "tier": "shared"
    },
    "event-system": {
      "tier": "shared"
    },
    "test-mocks": {
      "tier": "shared",
      "devOnly": true
    },
    "test-helpers": {
      "tier": "shared",
      "devOnly": true
    },
    "report-templates": {
      "tier": "app"
    },
    "markdown-compiler": {
      "tier": "app"
    },
    "report-components": {
      "tier": "app"
    },
    "prompts": {
      "tier": "app"
    }
  }
}
EOF
    echo "  ✓ Created .devmode.json configuration"
else
    echo "  ✓ Development configuration already exists"
fi
echo ""

# Step 7: Add .devmode.json to .gitignore if not already there
if ! grep -q ".devmode.json" .gitignore 2>/dev/null; then
    echo ".devmode.json" >> .gitignore
    echo "  ✓ Added .devmode.json to .gitignore"
fi

# Step 8: Create convenience aliases (optional)
echo "💡 Step 7: Developer shortcuts (optional)..."
echo ""
echo "Add these aliases to your shell profile (~/.bashrc or ~/.zshrc):"
echo ""
echo "  # H1B Analysis shortcuts"
echo "  alias h1b='cd $(git rev-parse --show-toplevel 2>/dev/null || echo .)'  # Jump to project root"
echo "  alias h1b-dev='npm run dev'                      # Start development mode"
echo "  alias h1b-test='npm test'                        # Run all tests"
echo "  alias h1b-status='npm run dev:status'            # Check link status"
echo "  alias h1b-clean='npm run dev:clean && npm ci'   # Clean and reinstall"
echo ""

# Final status check
echo "🏁 Setup Complete!"
echo "=================="
echo ""
echo "✅ Environment: LOCAL DEVELOPMENT MODE"
echo "✅ Package links: Active"
echo "✅ Instant updates: Enabled"
echo ""
echo "🚀 Quick Start:"
echo "  npm run dev         # Start development with watching"
echo "  npm run dev:status  # Check package link status"
echo "  npm test            # Run tests with linked packages"
echo ""
echo "📚 When ready to publish:"
echo "  1. Commit your changes"
echo "  2. Tag with version: git tag logger@1.2.3"
echo "  3. Push with tags: git push origin main --tags"
echo ""
echo "Happy coding! 🎉"