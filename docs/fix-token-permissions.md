# Fix GitHub Token Permissions

## Issue
The current token doesn't have the required permissions to publish packages to GitHub Packages Registry.

Error: `Permission permission_denied: The token provided does not match expected scopes.`

## Solution

You need to create a new Personal Access Token (PAT) with the correct scopes:

### 1. Go to GitHub Settings
1. Visit https://github.com/settings/tokens
2. Click "Generate new token (classic)"

### 2. Required Scopes
Select the following scopes:
- ✅ **write:packages** - Upload packages to GitHub Package Registry
- ✅ **read:packages** - Download packages from GitHub Package Registry  
- ✅ **delete:packages** (optional) - Delete packages
- ✅ **repo** - Full control of private repositories (required for private packages)

### 3. Generate Token
1. Give it a descriptive name (e.g., "npm-packages")
2. Set expiration (recommend 90 days)
3. Click "Generate token"
4. Copy the new token immediately

### 4. Update Your Configuration
Replace the token in `.npmrc`:
```bash
# Edit the .npmrc file
@chasenocap:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_NEW_TOKEN_HERE
always-auth=true
```

### 5. Alternative: Use GitHub CLI
You can also use GitHub CLI for authentication:
```bash
gh auth login
gh auth token
```

## Verification
After updating the token, verify it works:
```bash
npm whoami --registry=https://npm.pkg.github.com
```

## Publishing Command
Once the token is fixed, publish packages in this order:
```bash
# Independent packages first
cd packages/di-framework && npm publish
cd ../file-system && npm publish
cd ../event-system && npm publish
cd ../prompts && npm publish
cd ../logger && npm publish

# Then packages with dependencies
cd ../cache && npm publish
cd ../report-templates && npm publish
cd ../test-mocks && npm publish
cd ../test-helpers && npm publish
```