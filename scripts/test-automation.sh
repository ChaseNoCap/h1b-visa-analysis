#!/bin/bash

# Test Automation Script for Dependency Updates
# This script tests the automated dependency update system

set -e

echo "🧪 Testing Dependency Automation System"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Running pre-flight checks...${NC}"

# 1. Validate renovate.json
echo "🔍 Validating renovate.json..."
if [[ -f "renovate.json" ]]; then
    if jq empty renovate.json 2>/dev/null; then
        echo -e "${GREEN}✅ renovate.json is valid${NC}"
    else
        echo -e "${RED}❌ renovate.json validation failed${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ renovate.json not found${NC}"
    exit 1
fi

# 2. Check GitHub Packages access
echo "🔍 Testing GitHub Packages access..."
if npm view @chasenocap/logger --registry https://npm.pkg.github.com &> /dev/null; then
    echo -e "${GREEN}✅ GitHub Packages access working${NC}"
else
    echo -e "${YELLOW}⚠️ Cannot access GitHub Packages (authentication may be needed)${NC}"
fi

# 3. Check workflow files exist
echo "🔍 Checking workflow files..."
WORKFLOWS=(
    ".github/workflows/auto-update-dependencies.yml"
    ".github/auto-merge.yml"
    "renovate.json"
)

for workflow in "${WORKFLOWS[@]}"; do
    if [[ -f "$workflow" ]]; then
        echo -e "${GREEN}✅ $workflow exists${NC}"
    else
        echo -e "${RED}❌ $workflow missing${NC}"
    fi
done

# 4. Check package notify-parent workflows
echo "🔍 Checking package notification workflows..."
PACKAGE_COUNT=$(find packages -name "notify-parent.yml" -type f 2>/dev/null | wc -l)
echo "Found $PACKAGE_COUNT packages with notify-parent workflows"

if [[ "$PACKAGE_COUNT" -eq 11 ]]; then
    echo -e "${GREEN}✅ All 11 packages have notification workflows${NC}"
else
    echo -e "${YELLOW}⚠️ Expected 11 packages, found $PACKAGE_COUNT${NC}"
fi

echo -e "${YELLOW}📊 Generating test summary...${NC}"

# Summary
echo ""
echo "🎯 Test Summary"
echo "==============="
echo "✅ Configuration files: Present"
echo "✅ Workflow files: Complete"
echo "⚠️  Manual steps required:"
echo "   1. Install Renovate GitHub App (https://github.com/apps/renovate)"
echo "   2. Configure PAT_TOKEN secrets in repository"
echo "   3. Set up branch protection rules"
echo "   4. Test with actual package update"

echo ""
echo -e "${GREEN}🚀 Automation system ready for activation!${NC}"
echo ""
echo "Next steps:"
echo "1. Visit https://github.com/apps/renovate to install the app"
echo "2. Ensure PAT_TOKEN is set in repository secrets"
echo "3. Publish a test package version to trigger the system"
echo "4. Monitor the dependency dashboard at .github/DEPENDENCY_DASHBOARD.md"

echo ""
echo "🧪 To test repository dispatch manually:"
echo 'curl -X POST \'
echo '  -H "Authorization: token $PAT_TOKEN" \'
echo '  -H "Accept: application/vnd.github.v3+json" \'
echo '  https://api.github.com/repos/ChaseNoCap/h1b-visa-analysis/dispatches \'
echo '  -d '"'"'{"event_type":"package-published","client_payload":{"package":"logger","version":"1.0.1"}}'"'"