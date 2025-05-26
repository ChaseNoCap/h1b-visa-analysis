#!/bin/bash
# publish-if-tagged.sh - Helper script for tag-based publishing

set -e

echo "🏷️  Tag-Based Publishing Helper"
echo "==============================="
echo ""

# Check if we're on a tag
if git describe --exact-match --tags HEAD 2>/dev/null; then
    TAG=$(git describe --exact-match --tags HEAD)
    echo "✅ Currently on tag: $TAG"
    echo ""
    echo "This tag will trigger automatic publishing when pushed."
    echo ""
    echo "To push this tag and trigger publishing:"
    echo "  git push origin $TAG"
    echo ""
    echo "The unified workflow will:"
    echo "  1. Detect the tag format"
    echo "  2. Extract version information"
    echo "  3. Run tests"
    echo "  4. Publish to GitHub Packages"
    echo "  5. Create GitHub Release"
    echo "  6. Notify dependent repositories"
else
    echo "ℹ️  No tag found at current commit"
    echo ""
    echo "To create a tag for publishing:"
    echo ""
    echo "Single package:"
    echo "  git tag logger@1.2.3 -m \"fix: memory leak\""
    echo "  git push origin logger@1.2.3"
    echo ""
    echo "Multiple packages:"
    echo "  git tag v2.0.0 -m \"feat: major update\""
    echo "  git push origin v2.0.0"
    echo ""
    echo "Preview/beta:"
    echo "  git tag cache@1.3.0-beta.1 -m \"preview: new features\""
    echo "  git push origin cache@1.3.0-beta.1"
fi

echo ""
echo "📊 Current Package Versions:"
echo "----------------------------"

# Show current versions of all packages
for dir in packages/*/; do
    if [ -f "$dir/package.json" ]; then
        package_name=$(basename "$dir")
        version=$(grep '"version"' "$dir/package.json" | head -1 | sed 's/.*"version": *"\([^"]*\)".*/\1/')
        tier=$(grep '"tier"' "$dir/package.json" | head -1 | sed 's/.*"tier": *"\([^"]*\)".*/\1/' || echo "shared")
        printf "%-20s v%-10s [%s]\n" "$package_name" "$version" "$tier"
    fi
done

echo ""
echo "💡 Tips:"
echo "- Tags must match the pattern: package@x.y.z or vx.y.z"
echo "- Use semantic versioning: major.minor.patch"
echo "- Beta/preview releases use 'next' npm tag"
echo "- Regular releases use 'latest' npm tag"