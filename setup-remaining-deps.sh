#!/bin/bash

# Function to setup a repository
setup_repo() {
    local REPO_NAME=$1
    local DESCRIPTION=$2
    local INDEX_CONTENT=$3
    
    echo "Setting up $REPO_NAME repository..."
    
    # Create a temporary directory for the setup
    TEMP_DIR="temp-setup-$REPO_NAME"
    mkdir -p "$TEMP_DIR"
    cd "$TEMP_DIR"
    
    # Clone the repo
    echo "Cloning repository..."
    git clone "https://github.com/ChaseNoCap/$REPO_NAME.git"
    cd "$REPO_NAME"
    
    # Create package.json
    echo "Creating package.json..."
    cat > package.json << EOF
{
  "name": "$REPO_NAME",
  "version": "0.1.0",
  "description": "$DESCRIPTION",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": $(echo "$DESCRIPTION" | awk '{print "[\"" tolower($1) "\", \"" tolower($2) "\", \"" tolower($3) "\"]"}'),
  "author": "",
  "license": "MIT"
}
EOF
    
    # Create index.js
    echo "Creating index.js..."
    echo "$INDEX_CONTENT" > index.js
    
    # Create README.md
    echo "Creating README.md..."
    cat > README.md << EOF
# $REPO_NAME

$DESCRIPTION for H1B visa analysis reports.

## Installation

\`\`\`bash
npm install github:ChaseNoCap/$REPO_NAME
\`\`\`

## Usage

\`\`\`javascript
import $REPO_NAME from "$REPO_NAME";
// See index.js for available exports
\`\`\`
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
    
    # Commit and push
    echo "Committing and pushing..."
    git add .
    git commit -m "Initial setup with npm package structure and automation"
    git push
    
    # Clean up
    cd ../../..
    rm -rf "$TEMP_DIR"
    
    echo "✅ $REPO_NAME setup complete!"
    echo "⚠️  Don't forget to add the PAT_TOKEN secret:"
    echo "   https://github.com/ChaseNoCap/$REPO_NAME/settings/secrets/actions"
    echo ""
}

# Setup markdown-compiler
MARKDOWN_COMPILER_INDEX='// Markdown processing and compilation
export function compile(markdown) {
  // Basic markdown compilation placeholder
  return {
    content: markdown,
    compiled: true,
    timestamp: new Date().toISOString()
  };
}

export default { compile };'

setup_repo "markdown-compiler" "Markdown processing and compilation" "$MARKDOWN_COMPILER_INDEX"

# Setup report-components
REPORT_COMPONENTS_INDEX='// H1B research content components
export const components = {
  title: "H1B Visa Analysis",
  sections: [
    { id: "overview", title: "Overview", content: "H1B visa program analysis placeholder" },
    { id: "statistics", title: "Statistics", content: "Statistical data placeholder" },
    { id: "trends", title: "Trends", content: "Trend analysis placeholder" }
  ],
  metadata: {
    version: "0.1.0",
    lastUpdated: new Date().toISOString()
  }
};

export default components;'

setup_repo "report-components" "H1B research content components" "$REPORT_COMPONENTS_INDEX"

echo "🎉 All repositories have been set up!"
echo ""
echo "Remember to add the PAT_TOKEN to each repository:"
echo "1. https://github.com/ChaseNoCap/markdown-compiler/settings/secrets/actions"
echo "2. https://github.com/ChaseNoCap/report-components/settings/secrets/actions"