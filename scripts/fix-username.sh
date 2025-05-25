#!/bin/bash

# Fix all occurrences of chasenogap to chasenocap

echo "Fixing username from chasenogap to chasenocap..."

# Fix in all package.json files
find . -type f -name "package.json" -not -path "*/node_modules/*" -not -path "*/dist/*" | while read file; do
    if grep -q "chasenogap" "$file"; then
        echo "Fixing: $file"
        sed -i '' 's/chasenogap/chasenocap/g' "$file"
    fi
done

# Fix in TypeScript files
find . -type f -name "*.ts" -not -path "*/node_modules/*" -not -path "*/dist/*" | while read file; do
    if grep -q "chasenogap" "$file"; then
        echo "Fixing: $file"
        sed -i '' 's/chasenogap/chasenocap/g' "$file"
    fi
done

# Fix in JavaScript files
find . -type f -name "*.js" -not -path "*/node_modules/*" -not -path "*/dist/*" | while read file; do
    if grep -q "chasenogap" "$file"; then
        echo "Fixing: $file"
        sed -i '' 's/chasenogap/chasenocap/g' "$file"
    fi
done

# Fix in Markdown files
find . -type f -name "*.md" -not -path "*/node_modules/*" -not -path "*/dist/*" | while read file; do
    if grep -q "chasenogap" "$file"; then
        echo "Fixing: $file"
        sed -i '' 's/chasenogap/chasenocap/g' "$file"
    fi
done

# Fix in YAML files
find . -type f \( -name "*.yml" -o -name "*.yaml" \) -not -path "*/node_modules/*" -not -path "*/dist/*" | while read file; do
    if grep -q "chasenogap" "$file"; then
        echo "Fixing: $file"
        sed -i '' 's/chasenogap/chasenocap/g' "$file"
    fi
done

# Fix in .npmrc files
find . -type f -name ".npmrc" -not -path "*/node_modules/*" | while read file; do
    if grep -q "chasenogap" "$file"; then
        echo "Fixing: $file"
        sed -i '' 's/chasenogap/chasenocap/g' "$file"
    fi
done

echo "Done! All occurrences of 'chasenogap' have been replaced with 'chasenocap'"