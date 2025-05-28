# Repository Creation Quick Checklist

**Package Name**: ______________________  
**Date**: ______________________  
**Created By**: ______________________

## Pre-Creation
- [ ] Admin access to ChaseNoCap organization
- [ ] PAT_TOKEN ready with required scopes
- [ ] Package code ready in local packages/ directory

## GitHub Repository Setup
- [ ] Create repository at github.com/ChaseNoCap/[package-name]
- [ ] Configure general settings (default branch: main)
- [ ] Add branch protection rules for main branch
- [ ] Add PAT_TOKEN secret in repository settings

## Required Files
- [ ] `.github/workflows/unified-workflow.yml` (from SOP)
- [ ] `.npmrc` with authentication pattern
- [ ] `README.md` with standard sections
- [ ] `CLAUDE.md` with package documentation
- [ ] `LICENSE` (MIT)
- [ ] `tsconfig.json` configured
- [ ] `eslint.config.js` configured
- [ ] `vitest.config.ts` configured
- [ ] `package.json` with correct metadata

## Package.json Verification
- [ ] Name: `@chasenocap/[package-name]`
- [ ] Version: `1.0.0`
- [ ] Type: `module`
- [ ] Main/Types paths correct
- [ ] Scripts: build, test, lint, typecheck
- [ ] PublishConfig for GitHub Packages
- [ ] Repository URL correct
- [ ] Tier field set (core/shared/app)

## Initial Push
- [ ] Git init and add remote
- [ ] Initial commit pushed to main
- [ ] Tag created: `v1.0.0`
- [ ] Tag pushed to trigger publish

## Automation Verification
- [ ] GitHub Actions workflow triggered
- [ ] Build passing
- [ ] Tests passing
- [ ] Lint passing
- [ ] TypeCheck passing
- [ ] Package published to GitHub Packages
- [ ] Repository dispatch notification sent

## Meta Repository Integration
- [ ] Added as Git submodule
- [ ] Updated in package.json dependencies
- [ ] Auto-update PR created (if applicable)

## Final Validation
- [ ] Package installable via npm
- [ ] All automation working
- [ ] Documentation complete

---

**Notes/Issues**:
_____________________________________
_____________________________________
_____________________________________