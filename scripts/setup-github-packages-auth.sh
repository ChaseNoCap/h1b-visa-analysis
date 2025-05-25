#!/bin/bash

echo "🔐 GitHub Packages Authentication Setup"
echo "======================================"
echo ""
echo "This script will help you set up authentication for GitHub Packages."
echo ""

# Check if GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ GITHUB_TOKEN environment variable is not set."
  echo ""
  echo "To create a Personal Access Token:"
  echo "1. Go to https://github.com/settings/tokens"
  echo "2. Click 'Generate new token' → 'Generate new token (classic)'"
  echo "3. Select scopes:"
  echo "   - repo (Full control of private repositories)"
  echo "   - write:packages (Upload packages to GitHub Package Registry)"
  echo "   - read:packages (Download packages from GitHub Package Registry)"
  echo "4. Generate token and copy it"
  echo ""
  echo "Then run: export GITHUB_TOKEN=your_token_here"
  exit 1
fi

# Create .npmrc in home directory
echo "📝 Creating ~/.npmrc for global authentication..."
cat > ~/.npmrc << EOF
@chasenocap:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
EOF

echo "✅ Created ~/.npmrc"

# Create local .npmrc
echo "📝 Creating local .npmrc..."
cat > .npmrc << EOF
@chasenocap:registry=https://npm.pkg.github.com/
EOF

echo "✅ Created .npmrc"

# Test authentication
echo ""
echo "🧪 Testing authentication..."
if npm view @chasenocap/logger --registry https://npm.pkg.github.com > /dev/null 2>&1; then
  echo "✅ Authentication successful! You can now install @chasenocap packages."
else
  echo "❌ Authentication test failed. Please check your token permissions."
fi

echo ""
echo "📋 Next steps:"
echo "1. Run 'npm install' to install dependencies"
echo "2. Install Renovate app: https://github.com/apps/renovate"
echo "3. Deploy workflows: ./scripts/deploy-notify-workflow.sh"