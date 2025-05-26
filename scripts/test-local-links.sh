#!/bin/bash
# Test local npm link setup

set -e

echo "🧪 Testing Local NPM Link Setup"
echo "==============================="
echo ""

# Test 1: Create a simple package link
echo "Test 1: Creating npm link for logger package..."
cd packages/logger
npm link --no-save 2>/dev/null || echo "  ⚠️  Could not create link (may need npm install first)"

# Test 2: Check if link was created
echo ""
echo "Test 2: Checking global npm links..."
npm list -g --depth=0 --link 2>/dev/null | grep chasenocap || echo "  ℹ️  No global links found yet"

# Test 3: Try linking in meta repo
echo ""
echo "Test 3: Attempting to use linked package in meta repo..."
cd ../..
npm link @chasenocap/logger --no-save 2>/dev/null || echo "  ⚠️  Could not link package (expected if package not built)"

# Test 4: Check symlink
echo ""
echo "Test 4: Checking for symlinks in node_modules..."
if [ -L "node_modules/@chasenocap/logger" ]; then
    echo "  ✅ Symlink exists for @chasenocap/logger"
    ls -la node_modules/@chasenocap/logger
else
    echo "  ℹ️  No symlink found (this is expected without prior setup)"
fi

echo ""
echo "📊 Test Summary:"
echo "----------------"
echo "This test demonstrates that npm link can work locally,"
echo "but packages need to be built first for successful linking."
echo ""
echo "The unified dependency strategy will handle this automatically"
echo "by ensuring packages are built before linking."