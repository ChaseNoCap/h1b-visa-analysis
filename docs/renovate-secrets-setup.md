# Renovate Secrets Setup Guide

## Overview

Renovate now uses UI-based secrets management instead of encrypted tokens in config files. This guide shows how to set up authentication for GitHub Packages.

## Steps to Configure Renovate Secrets

### 1. Access Mend Developer Portal

1. Go to [Mend Developer Portal](https://developer.mend.io/)
2. Sign in with your GitHub account
3. Navigate to your organization: `ChaseNoCap`

### 2. Add GitHub Token Secret

1. Find the **Secrets** or **App Secrets** section
2. Click **Add Secret** or **New Secret**
3. Configure:
   - **Secret Name**: `GITHUB_COM_TOKEN`
   - **Secret Value**: Your Personal Access Token (same PAT_TOKEN)
   - **Repositories**: Select `h1b-visa-analysis` (or apply to all)

### 3. Token Requirements

The token needs these scopes:
- ✅ `repo` - Access private repositories
- ✅ `read:packages` - Download packages from GitHub Packages
- ✅ `write:packages` - (Optional) If Renovate publishes

### 4. How It Works

In `renovate.json`:
```json
{
  "hostRules": [
    {
      "matchHost": "npm.pkg.github.com",
      "hostType": "npm",
      "username": "x-access-token",
      "password": "{{ secrets.GITHUB_COM_TOKEN }}"
    }
  ]
}
```

Renovate will:
1. Read `{{ secrets.GITHUB_COM_TOKEN }}` placeholder
2. Replace with actual token from Mend portal
3. Use for authenticating to GitHub Packages

## Alternative: Self-Hosted Renovate

If using self-hosted Renovate:
1. Use environment variables
2. Or use the old encryption at https://app.renovatebot.com/encrypt-old

## Verification

After setup, Renovate should:
1. Successfully access @chasenocap packages
2. Create PRs with dependency updates
3. Update both package.json and submodules

## Troubleshooting

### "Cannot find package @chasenocap/..."
- Check secret is named exactly `GITHUB_COM_TOKEN`
- Verify token has `read:packages` scope
- Ensure secret is applied to the repository

### "Authentication failed"
- Token might be expired
- Secret might not be saved properly
- Check Renovate logs in Mend portal

## Our Configuration Alignment

Everything aligns perfectly:
- **Local Dev**: Uses `NPM_TOKEN` environment variable
- **GitHub Actions**: Uses `secrets.PAT_TOKEN` as `NPM_TOKEN`
- **Renovate**: Uses `secrets.GITHUB_COM_TOKEN` from Mend portal
- **All**: Use the same `.npmrc` registry configuration

## Security Notes

1. Use the same PAT token everywhere for consistency
2. Rotate tokens every 90 days
3. Monitor Renovate dashboard for auth failures
4. Never commit tokens to the repository