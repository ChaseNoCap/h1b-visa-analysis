# H1B Report Generator

Generates the final H1B research report by orchestrating:
- `prompts-shared` - AI development workflows and context management
- `markdown-compiler` - Markdown processing and compilation
- `report-components` - H1B research content

## Architecture

```
h1b-report-generator/
├── .github/workflows/    # CI/CD automation
├── src/                 # Report generation logic
├── dist/               # Generated reports
├── config/             # Configuration files
├── scripts/            # Build and utility scripts
└── docs/              # Documentation
```

## Workflow

1. **Context Loading**: Loads prompts-shared configurations
2. **Content Fetching**: Pulls latest report-components
3. **Compilation**: Uses markdown-compiler to process
4. **Generation**: Outputs final report to dist/

## Automated Updates

GitHub Actions workflows trigger on:
- Changes to prompts-shared
- Updates to report-components
- Markdown-compiler improvements

## Usage

```bash
npm install
npm run build
```

Generated report will be in `dist/`