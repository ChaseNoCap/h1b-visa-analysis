#!/bin/bash
# Configure npm authentication for GitHub Packages

echo "🔐 Configuring NPM Authentication for GitHub Packages"
echo "===================================================="
echo ""

# Check if PAT_TOKEN is available
if [ -z "$PAT_TOKEN" ]; then
    echo "ℹ️  PAT_TOKEN not found in environment."
    echo ""
    echo "To set up authentication, you need a GitHub Personal Access Token with:"
    echo "  - read:packages scope (minimum)"
    echo "  - write:packages scope (if publishing)"
    echo ""
    echo "Set it with: export PAT_TOKEN=your_token_here"
    echo ""
    echo "For now, we'll configure npm to work with local links only."
    exit 0
fi

# Configure npm
echo "📝 Configuring npm..."
npm config set @chasenocap:registry https://npm.pkg.github.com
npm config set //npm.pkg.github.com/:_authToken $PAT_TOKEN
npm config set registry https://registry.npmjs.org/

echo ""
echo "✅ NPM configured for GitHub Packages!"
echo ""
echo "Current configuration:"
npm config list | grep -E "(registry|authToken)" | sed 's/authToken=.*/authToken=***/'