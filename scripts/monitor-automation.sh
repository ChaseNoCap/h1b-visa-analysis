#!/bin/bash

echo "🔍 Monitoring Automation Status"
echo "==============================="
echo ""

# Check for PRs in meta repository
echo "📋 Checking for automated PRs..."
echo "Visit: https://github.com/ChaseNoCap/h1b-visa-analysis/pulls"
echo ""

# Check meta repository actions
echo "⚙️  Meta Repository Actions:"
echo "https://github.com/ChaseNoCap/h1b-visa-analysis/actions"
echo ""

# Check individual package actions
echo "📦 Package Repository Actions:"
packages=(
  "cache" "di-framework" "event-system" "file-system" 
  "logger" "markdown-compiler" "prompts" "report-components"
  "report-templates" "test-helpers" "test-mocks"
)

for pkg in "${packages[@]}"; do
  echo "- $pkg: https://github.com/ChaseNoCap/$pkg/actions"
done

echo ""
echo "🔄 Renovate Dashboard:"
echo "https://app.renovatebot.com/dashboard#github/ChaseNoCap/h1b-visa-analysis"
echo ""

# Test manual dispatch
echo "🧪 To manually trigger a test dispatch, run:"
echo ""
cat << 'EOF'
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/ChaseNoCap/h1b-visa-analysis/dispatches \
  -d '{"event_type":"package-published","client_payload":{"package":"logger","version":"1.0.2","repository":"ChaseNoCap/logger"}}'
EOF

echo ""
echo "📝 To check if dispatch was received, monitor:"
echo "https://github.com/ChaseNoCap/h1b-visa-analysis/actions/workflows/auto-update-dependencies.yml"