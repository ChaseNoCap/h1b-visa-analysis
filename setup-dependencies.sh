#!/bin/bash

# Script to set up the dependency repositories with basic structure

echo "This script will help you set up the dependency repositories."
echo "For each repository, you'll need to:"
echo "1. Clone it locally"
echo "2. Add the files created here"
echo "3. Commit and push"
echo ""
echo "=== Files to add to prompts-shared ==="
echo ""
echo "package.json:"
cat << 'EOF'
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

echo ""
echo "index.js:"
cat << 'EOF'
// AI development workflows and context management
export const workflows = {
  name: 'prompts-shared',
  version: '0.1.0',
  getContext: () => ({
    environment: 'development',
    timestamp: new Date().toISOString()
  })
};

export default workflows;
EOF

echo ""
echo ".github/workflows/notify-parent.yml:"
cat << 'EOF'
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

echo ""
echo "=== Files to add to markdown-compiler ==="
echo ""
echo "package.json:"
cat << 'EOF'
{
  "name": "markdown-compiler",
  "version": "0.1.0",
  "description": "Markdown processing and compilation",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["markdown", "compiler", "processor"],
  "author": "",
  "license": "MIT"
}
EOF

echo ""
echo "index.js:"
cat << 'EOF'
// Markdown processing and compilation
export function compile(markdown) {
  // Basic markdown compilation placeholder
  return {
    content: markdown,
    compiled: true,
    timestamp: new Date().toISOString()
  };
}

export default { compile };
EOF

echo ""
echo "=== Files to add to report-components ==="
echo ""
echo "package.json:"
cat << 'EOF'
{
  "name": "report-components",
  "version": "0.1.0",
  "description": "H1B research content components",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["h1b", "report", "components"],
  "author": "",
  "license": "MIT"
}
EOF

echo ""
echo "index.js:"
cat << 'EOF'
// H1B research content components
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

export default components;
EOF

echo ""
echo "NOTE: Each repository also needs the same .github/workflows/notify-parent.yml file"
echo "Remember to add PAT_TOKEN secret to each repository!"