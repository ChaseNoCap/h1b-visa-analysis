# Automation Setup

## GitHub Actions Integration

### Dependency Repos Need These Workflows:

#### For prompts-shared:
```yaml
name: Notify Dependents
on:
  push:
    branches: [main]
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: peter-evans/repository-dispatch@v2
        with:
          token: ${{ secrets.PAT_TOKEN }}
          repository: ChaseNoCap/h1b-report-generator
          event-type: dependency-updated
```

#### For markdown-compiler:
Same workflow as above

#### For report-components:
Same workflow as above

### Required Secrets:
- `PAT_TOKEN`: Personal Access Token with repo scope

### Local Development:
```bash
# Trigger manual build
npm run build

# Update all dependencies
npm run update-deps
```