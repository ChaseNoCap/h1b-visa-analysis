#!/bin/bash

echo "🧪 Testing Dependency Automation System"
echo "======================================="
echo ""

# Test 1: Check Renovate config
echo "1️⃣ Checking Renovate configuration..."
if [ -f "renovate.json" ]; then
  echo "✅ renovate.json exists"
  if jq empty renovate.json 2>/dev/null; then
    echo "✅ renovate.json is valid JSON"
  else
    echo "❌ renovate.json has invalid JSON"
  fi
else
  echo "❌ renovate.json not found"
fi

# Test 2: Check GitHub Actions workflow
echo ""
echo "2️⃣ Checking GitHub Actions workflow..."
if [ -f ".github/workflows/auto-update-dependencies.yml" ]; then
  echo "✅ Auto-update workflow exists"
else
  echo "❌ Auto-update workflow not found"
fi

# Test 3: Check npm authentication
echo ""
echo "3️⃣ Checking npm authentication..."
if npm view @chasenocap/logger name --registry https://npm.pkg.github.com 2>/dev/null | grep -q "logger"; then
  echo "✅ Can access @chasenocap packages"
else
  echo "❌ Cannot access @chasenocap packages - check authentication"
fi

# Test 4: Check if Renovate app is installed
echo ""
echo "4️⃣ Checking Renovate app status..."
echo "⚠️  Manual check required: Visit https://github.com/ChaseNoCap/h1b-visa-analysis/settings/installations"

# Test 5: Test repository dispatch
echo ""
echo "5️⃣ Testing repository dispatch..."
echo "To test the dispatch manually, run:"
echo ""
echo 'curl -X POST \'
echo '  -H "Authorization: token $GITHUB_TOKEN" \'
echo '  -H "Accept: application/vnd.github.v3+json" \'
echo '  https://api.github.com/repos/ChaseNoCap/h1b-visa-analysis/dispatches \'
echo '  -d '"'"'{"event_type":"package-published","client_payload":{"package":"logger","version":"1.0.1"}}'"'"

echo ""
echo "📋 Summary"
echo "=========="
echo "After installing Renovate and adding PAT_TOKEN to all repos:"
echo "1. The system will check for updates every 30 minutes"
echo "2. Package releases will trigger immediate updates"
echo "3. PRs will be created automatically"
echo "4. Tests will run on all PRs"
echo "5. Successful updates will auto-merge"