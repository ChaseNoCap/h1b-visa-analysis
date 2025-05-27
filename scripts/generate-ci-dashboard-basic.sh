#!/bin/bash

# Generate basic CI dashboard
# Wrapper for monitor-ci-health.sh that saves to reports folder

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Output files
OUTPUT_FILE="reports/ci/dashboard.md"
HISTORY_FILE="reports/ci/history/dashboard-$(date +%Y-%m-%d-%H%M%S).md"

# Ensure reports directory exists
mkdir -p reports/ci/history

echo -e "${YELLOW}📊 Generating Basic CI Dashboard...${NC}"

# Generate dashboard
./scripts/monitor-ci-health.sh > "$OUTPUT_FILE"

# Copy to history
cp "$OUTPUT_FILE" "$HISTORY_FILE"

echo -e "${GREEN}✅ Basic dashboard generated at: $OUTPUT_FILE${NC}"
echo -e "   📂 History saved at: $HISTORY_FILE"
