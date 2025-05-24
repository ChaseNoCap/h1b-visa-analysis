#!/bin/bash

# Script to remove @h1b/ prefix from all package references

echo "Removing @h1b/ prefix from all files..."

# Function to update a file
update_file() {
    local file=$1
    echo "Updating $file..."
    
    # Create a temporary file
    temp_file="${file}.tmp"
    
    # Replace all @h1b/ prefixes
    sed -E 's/@h1b\///g' "$file" > "$temp_file"
    
    # Move temp file back
    mv "$temp_file" "$file"
}

# Update all markdown files in docs
for file in docs/*.md; do
    if grep -q "@h1b/" "$file"; then
        update_file "$file"
    fi
done

# Update CLAUDE.md files in packages
for file in packages/*/CLAUDE.md packages/*/README.md; do
    if [ -f "$file" ] && grep -q "@h1b/" "$file"; then
        update_file "$file"
    fi
done

# Update the main CLAUDE.md
if [ -f "CLAUDE.md" ] && grep -q "@h1b/" "CLAUDE.md"; then
    update_file "CLAUDE.md"
fi

# Update tsconfig.json if needed
if [ -f "tsconfig.json" ] && grep -q "@h1b/" "tsconfig.json"; then
    update_file "tsconfig.json"
fi

echo "Done! All @h1b/ prefixes have been removed."
echo ""
echo "Summary of changes:"
echo "- @h1b/test-mocks → test-mocks"
echo "- @h1b/test-helpers → test-helpers"
echo "- @h1b/di-framework → di-framework"
echo "- @h1b/logger → logger"
echo "- @h1b/file-system → file-system"
echo "- @h1b/events → events"
echo "- @h1b/cache → cache"
echo "- @h1b/core → core"