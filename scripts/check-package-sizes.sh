#!/bin/bash

# Check package sizes in packages/shared/
# Warns if any package exceeds 1000 lines
# Returns non-zero exit code if violations found

set -euo pipefail

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Configuration
MAX_LINES=1000
PACKAGES_DIR="packages/shared"

# Check if packages directory exists
if [ ! -d "$PACKAGES_DIR" ]; then
    echo -e "${YELLOW}Warning: $PACKAGES_DIR directory not found${NC}"
    exit 0
fi

# Track violations
violations=0
total_packages=0

echo "Checking package sizes in $PACKAGES_DIR..."
echo "Maximum allowed lines per package: $MAX_LINES"
echo "================================================"

# Find all packages (directories with package.json)
for package_dir in "$PACKAGES_DIR"/*; do
    if [ -d "$package_dir" ] && [ -f "$package_dir/package.json" ]; then
        package_name=$(basename "$package_dir")
        total_packages=$((total_packages + 1))
        
        # Count lines in TypeScript/JavaScript files
        # Exclude node_modules, dist, coverage, and test files
        line_count=0
        if command -v fd &> /dev/null; then
            # Use fd if available (faster)
            line_count=$(fd -e ts -e js -e tsx -e jsx . "$package_dir" \
                --exclude node_modules \
                --exclude dist \
                --exclude coverage \
                --exclude '*.test.*' \
                --exclude '*.spec.*' \
                --exec wc -l {} + 2>/dev/null | awk '{sum += $1} END {print sum}' || echo 0)
        else
            # Fallback to find
            line_count=$(find "$package_dir" -type f \( -name "*.ts" -o -name "*.js" -o -name "*.tsx" -o -name "*.jsx" \) \
                -not -path "*/node_modules/*" \
                -not -path "*/dist/*" \
                -not -path "*/coverage/*" \
                -not -name "*.test.*" \
                -not -name "*.spec.*" \
                -exec wc -l {} + 2>/dev/null | awk '{sum += $1} END {print sum}' || echo 0)
        fi
        
        # Handle empty result
        if [ -z "$line_count" ] || [ "$line_count" = "" ]; then
            line_count=0
        fi
        
        # Check if package exceeds limit
        if [ "$line_count" -gt "$MAX_LINES" ]; then
            echo -e "${RED}✗ $package_name: $line_count lines (exceeds limit by $((line_count - MAX_LINES)) lines)${NC}"
            violations=$((violations + 1))
        elif [ "$line_count" -gt $((MAX_LINES * 80 / 100)) ]; then
            # Warning if approaching limit (80%)
            echo -e "${YELLOW}⚠ $package_name: $line_count lines ($(( (line_count * 100) / MAX_LINES ))% of limit)${NC}"
        else
            echo -e "${GREEN}✓ $package_name: $line_count lines${NC}"
        fi
    fi
done

echo "================================================"
echo "Summary:"
echo "Total packages checked: $total_packages"

if [ "$violations" -gt 0 ]; then
    echo -e "${RED}Violations found: $violations packages exceed the $MAX_LINES line limit${NC}"
    echo ""
    echo "Consider decomposing large packages into smaller, focused modules."
    echo "See docs/decomposition-principles.md for guidance."
    exit 1
else
    echo -e "${GREEN}All packages are within size limits!${NC}"
    exit 0
fi