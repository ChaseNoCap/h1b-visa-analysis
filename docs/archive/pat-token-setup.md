# Personal Access Token (PAT) Setup Guide

## Creating a Personal Access Token

1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a descriptive name: `h1b-visa-analysis-automation`
4. Set expiration (recommend 90 days for security)
5. Select these scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)

6. Click "Generate token"
7. **IMPORTANT**: Copy the token immediately (you won't see it again!)

## Adding PAT_TOKEN to Repository Secrets

### For h1b-visa-analysis (this repo):

1. Go to: https://github.com/ChaseNoCap/h1b-visa-analysis/settings/secrets/actions
2. Click "New repository secret"
3. Name: `PAT_TOKEN`
4. Value: Paste your token
5. Click "Add secret"

### For dependency repositories:

Repeat the above process for each dependency repo when created:
- https://github.com/ChaseNoCap/prompts-shared/settings/secrets/actions
- https://github.com/ChaseNoCap/markdown-compiler/settings/secrets/actions
- https://github.com/ChaseNoCap/report-components/settings/secrets/actions

## Testing the Setup

After adding the secret, you can test by:

1. Going to Actions tab: https://github.com/ChaseNoCap/h1b-visa-analysis/actions
2. Click on "Generate H1B Report" workflow
3. Click "Run workflow" → "Run workflow"
4. Check if it runs successfully

## Security Notes

- Never commit tokens to code
- Rotate tokens regularly (every 90 days)
- Use minimum required permissions
- Consider using GitHub Apps for production use