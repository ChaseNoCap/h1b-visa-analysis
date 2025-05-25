# GitHub Packages Authentication Setup

## Overview

This guide explains how to set up authentication for GitHub Packages in the h1b-visa-analysis project.

## Local Development

### 1. Create Personal Access Token (PAT)

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Configure:
   - **Note**: `h1b-packages-access`
   - **Expiration**: 90 days (or your preference)
   - **Scopes**:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `write:packages` (Upload packages)
     - ✅ `read:packages` (Download packages)
4. Click "Generate token" and copy it

### 2. Set Environment Variable

Add to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
export NPM_TOKEN="ghp_your_token_here"
```

Then reload:
```bash
source ~/.zshrc  # or ~/.bashrc
```

### 3. Test Authentication

```bash
cd /path/to/h1b-visa-analysis
npm install
```

You should see packages downloading from GitHub Packages.

## GitHub Actions Setup

### Repository Secret

The `PAT_TOKEN` secret should already be configured with the same token used for:
- Submodule access
- Repository dispatch
- Package registry access

### How It Works

1. `.npmrc` uses `${NPM_TOKEN}` environment variable
2. Workflow sets `NPM_TOKEN` from `secrets.PAT_TOKEN`
3. npm automatically authenticates to GitHub Packages

## Troubleshooting

### 401 Unauthorized

```bash
npm error code E401
npm error 401 Unauthorized - GET https://npm.pkg.github.com/@chasenocap%2flogger
```

**Fix**: Ensure NPM_TOKEN is set:
```bash
echo $NPM_TOKEN  # Should show your token
```

### 404 Not Found

**Possible causes**:
- Package not published yet
- Token doesn't have read:packages scope
- Wrong package name

### Testing Token

```bash
# Test authentication
curl -H "Authorization: token $NPM_TOKEN" \
  https://api.github.com/user/packages/package/npm/logger

# Test npm access
npm view @chasenocap/logger --registry https://npm.pkg.github.com
```

## Security Notes

1. **Never commit tokens** to the repository
2. **Use environment variables** for tokens
3. **Rotate tokens** regularly (90 days recommended)
4. **Use minimal scopes** needed for the task

## Package Publishing

When publishing packages, use the same token:

```bash
cd packages/logger
npm publish
```

The token needs `write:packages` scope for publishing.