# Dependency Repository Setup Instructions

You need to set up each of the three dependency repositories. Here's what to do:

## Option 1: Quick Setup (Recommended)

Run these commands for each repository:

### For prompts-shared:
```bash
# Clone the repo
git clone https://github.com/ChaseNoCap/prompts-shared.git
cd prompts-shared

# Create package.json
echo '{
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
}' > package.json

# Create index.js
echo '// AI development workflows and context management
export const workflows = {
  name: "prompts-shared",
  version: "0.1.0",
  getContext: () => ({
    environment: "development",
    timestamp: new Date().toISOString()
  })
};

export default workflows;' > index.js

# Create README.md
echo '# prompts-shared

AI development workflows and context management for H1B visa analysis.

## Installation

```bash
npm install github:ChaseNoCap/prompts-shared
```

## Usage

```javascript
import workflows from "prompts-shared";
const context = workflows.getContext();
```' > README.md

# Create workflow directory and file
mkdir -p .github/workflows
echo 'name: Notify Parent Repository

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
        client-payload: '\''{"repository": "${{ github.repository }}", "ref": "${{ github.ref }}", "sha": "${{ github.sha }}"}'\''' > .github/workflows/notify-parent.yml

# Commit and push
git add .
git commit -m "Initial setup with npm package structure and automation"
git push

# Go back
cd ..
```

### For markdown-compiler:
```bash
# Clone the repo
git clone https://github.com/ChaseNoCap/markdown-compiler.git
cd markdown-compiler

# Create package.json
echo '{
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
}' > package.json

# Create index.js
echo '// Markdown processing and compilation
export function compile(markdown) {
  // Basic markdown compilation placeholder
  return {
    content: markdown,
    compiled: true,
    timestamp: new Date().toISOString()
  };
}

export default { compile };' > index.js

# Create README.md
echo '# markdown-compiler

Markdown processing and compilation for H1B visa analysis reports.

## Installation

```bash
npm install github:ChaseNoCap/markdown-compiler
```

## Usage

```javascript
import { compile } from "markdown-compiler";
const result = compile("# Hello World");
```' > README.md

# Create workflow (same as above)
mkdir -p .github/workflows
echo 'name: Notify Parent Repository

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
        client-payload: '\''{"repository": "${{ github.repository }}", "ref": "${{ github.ref }}", "sha": "${{ github.sha }}"}'\''' > .github/workflows/notify-parent.yml

# Commit and push
git add .
git commit -m "Initial setup with npm package structure and automation"
git push

# Go back
cd ..
```

### For report-components:
```bash
# Clone the repo
git clone https://github.com/ChaseNoCap/report-components.git
cd report-components

# Create package.json
echo '{
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
}' > package.json

# Create index.js
echo '// H1B research content components
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

export default components;' > index.js

# Create README.md
echo '# report-components

H1B research content components for visa analysis reports.

## Installation

```bash
npm install github:ChaseNoCap/report-components
```

## Usage

```javascript
import components from "report-components";
console.log(components.sections);
```' > README.md

# Create workflow (same as above)
mkdir -p .github/workflows
echo 'name: Notify Parent Repository

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
        client-payload: '\''{"repository": "${{ github.repository }}", "ref": "${{ github.ref }}", "sha": "${{ github.sha }}"}'\''' > .github/workflows/notify-parent.yml

# Commit and push
git add .
git commit -m "Initial setup with npm package structure and automation"
git push

# Go back
cd ..
```

## Option 2: Manual Setup

If you prefer to set up manually:

1. Go to each repository on GitHub
2. Create the files listed above using the GitHub web interface
3. Don't forget to add the PAT_TOKEN secret to each repository

## After Setup

1. Add PAT_TOKEN secret to each repository:
   - Go to Settings → Secrets and variables → Actions
   - Add new repository secret named `PAT_TOKEN`
   - Use the same token you created earlier

2. Test the setup by running in the main project:
   ```bash
   cd h1b-visa-analysis
   npm run update-deps
   npm run build
   ```

3. The workflow should now trigger automatically when any dependency is updated!