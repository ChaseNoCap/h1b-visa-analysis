# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an H1B report generator that orchestrates three GitHub-based dependencies:
- `prompts-shared` - AI development workflows and context management
- `markdown-compiler` - Markdown processing and compilation  
- `report-components` - H1B research content

The project automatically generates reports when dependencies update via GitHub Actions.

## Key Commands

```bash
# Install dependencies
npm install

# Generate report (outputs to dist/)
npm run build

# Update all GitHub dependencies
npm run update-deps
```

## Architecture

The project uses a dependency orchestration pattern:
1. **Context Loading**: Loads configurations from `prompts-shared`
2. **Content Fetching**: Pulls latest from `report-components`
3. **Compilation**: Uses `markdown-compiler` to process content
4. **Generation**: Outputs final report to `dist/`

## Important Notes

- Main generation logic should be implemented in `src/generate-report.js` (currently referenced in package.json but not yet created)
- The project uses ES modules (`"type": "module"` in package.json)
- GitHub Actions automation requires `PAT_TOKEN` secret for cross-repo notifications
- No test framework is currently configured