# Adding PAT_TOKEN to Package Repositories

You need to add the PAT_TOKEN secret to each of these repositories:

## Repositories Checklist

- [x] https://github.com/ChaseNoCap/cache
- [x] https://github.com/ChaseNoCap/di-framework
- [x] https://github.com/ChaseNoCap/event-system
- [x] https://github.com/ChaseNoCap/file-system
- [x] https://github.com/ChaseNoCap/logger
- [x] https://github.com/ChaseNoCap/markdown-compiler
- [x] https://github.com/ChaseNoCap/prompts
- [x] https://github.com/ChaseNoCap/report-components
- [x] https://github.com/ChaseNoCap/report-templates
- [x] https://github.com/ChaseNoCap/test-helpers
- [x] https://github.com/ChaseNoCap/test-mocks

## Steps for Each Repository

1. Go to the repository
2. Click **Settings** (in the repository, not your profile)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add:
   - **Name**: `PAT_TOKEN`
   - **Secret**: Your personal access token (same one used for GITHUB_TOKEN)
6. Click **Add secret**

## Quick Links Script

Copy and paste this into your browser's console to open all settings pages:

```javascript
const repos = [
  'cache', 'di-framework', 'event-system', 'file-system', 
  'logger', 'markdown-compiler', 'prompts', 'report-components',
  'report-templates', 'test-helpers', 'test-mocks'
];

repos.forEach(repo => {
  window.open(`https://github.com/ChaseNoCap/${repo}/settings/secrets/actions/new`, '_blank');
});
```

**Note**: This will open 11 tabs - make sure your browser allows popups from GitHub.