#!/bin/bash

echo "Setting up prompts-shared repository..."

# Create a temporary directory for the setup
TEMP_DIR="temp-setup-prompts-shared"
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

# Clone the repo
echo "Cloning repository..."
git clone https://github.com/ChaseNoCap/prompts-shared.git
cd prompts-shared

# Create package.json
echo "Creating package.json..."
cat > package.json << 'EOF'
{
  "name": "prompts-shared",
  "version": "0.1.0",
  "description": "AI development workflows and context management",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["ai", "prompts", "workflows"],
  "author": "",
  "license": "MIT"
}
EOF

# Create index.js
echo "Creating index.js..."
cat > index.js << 'EOF'
// AI development workflows and context management
export const workflows = {
  name: "prompts-shared",
  version: "0.1.0",
  getContext: () => ({
    environment: "development",
    timestamp: new Date().toISOString()
  })
};

export default workflows;
EOF

# Create README.md
echo "Creating README.md..."
cat > README.md << 'EOF'
# prompts-shared

AI development workflows and context management for H1B visa analysis.

## Installation

```bash
npm install github:ChaseNoCap/prompts-shared
```

## Usage

```javascript
import workflows from "prompts-shared";
const context = workflows.getContext();
```
EOF

# Create workflow directory and file
echo "Creating GitHub workflow..."
mkdir -p .github/workflows
cat > .github/workflows/notify-parent.yml << 'EOF'
name: Notify Parent Repository

on:
  push:
    branches: [ main ]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
    - name: Trigger parent repository workflow
      uses: peter-evans/repository-dispatch@v3
      with:
        token: ${{ secrets.PAT_TOKEN }}
        repository: ChaseNoCap/h1b-visa-analysis
        event-type: dependency-updated
        client-payload: '{"repository": "${{ github.repository }}", "ref": "${{ github.ref }}", "sha": "${{ github.sha }}"}'
EOF

# Show what will be committed
echo ""
echo "Files to be committed:"
git status

# Commit and push
echo ""
echo "Committing and pushing..."
git add .
git commit -m "Initial setup with npm package structure and automation"
git push

# Clean up
cd ../../..
rm -rf "$TEMP_DIR"

echo ""
echo "✅ prompts-shared setup complete!"
echo ""
echo "⚠️  Don't forget to add the PAT_TOKEN secret to this repository:"
echo "   https://github.com/ChaseNoCap/prompts-shared/settings/secrets/actions"