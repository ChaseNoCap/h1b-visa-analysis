# Package Dependency Update Automation - Resume Prompt

## Context Summary
This project is completing a systematic dependency update across all 11 packages in the h1b-visa-analysis monorepo. **Phase 1 is COMPLETE (5/11 packages updated)**. Ready to resume Phase 2.

## Project Structure
- **Meta Repository**: h1b-visa-analysis (main coordination repo)
- **11 Git Submodule Packages**: Each package is an independent GitHub repository
- **Architecture**: TypeScript + Inversify DI + Vitest testing + ESLint v9

## Phase 1 COMPLETED ✅ (5/11 packages)
The following packages have been successfully updated, committed, and pushed:

1. **di-framework** ✅ - Core DI utilities (85 tests pass)
2. **logger** ✅ - Winston-based logging (15 tests pass) 
3. **file-system** ✅ - File operations abstraction (17 tests pass)
4. **test-mocks** ✅ - Mock implementations (11 tests pass)
5. **test-helpers** ✅ - Test utilities (21 tests pass)

## Phase 2 TODO 📋 (6/11 packages remaining)

### Target Dependency Versions (standardized across all packages):
```json
{
  "@types/node": "^22.0.0",
  "@typescript-eslint/eslint-plugin": "^8.0.0", 
  "@typescript-eslint/parser": "^8.0.0",
  "@vitest/coverage-v8": "^3.0.0",
  "eslint": "^9.0.0",
  "eslint-config-prettier": "^10.0.0",
  "eslint-plugin-prettier": "^5.0.1",
  "globals": "^16.2.0",
  "prettier": "^3.1.0",
  "typescript": "^5.3.0",
  "vitest": "^3.0.0",
  "@eslint/js": "^9.27.0"
}
```

### Remaining Packages:
1. **event-system** - Event-driven debug/test system
2. **cache** - Caching decorators (@Cacheable, @InvalidateCache)
3. **report-templates** - Template engine and report builders
4. **prompts** - AI context management (documentation package)
5. **markdown-compiler** - Complex dependencies, coordinate carefully
6. **report-components** - H1B content package

## Established Update Pattern

For each package:

1. **Navigate to package**: `cd packages/[package-name]`
2. **Update package.json** devDependencies to target versions
3. **Create ESLint v9 flat config**:
   ```javascript
   // eslint.config.js
   import js from '@eslint/js';
   import typescript from '@typescript-eslint/eslint-plugin';
   import parser from '@typescript-eslint/parser';
   import prettier from 'eslint-plugin-prettier';
   import prettierConfig from 'eslint-config-prettier';
   import globals from 'globals';

   export default [
     { ignores: ['dist/', 'coverage/', 'node_modules/'] },
     js.configs.recommended,
     {
       files: ['src/**/*.ts', 'tests/**/*.ts'],
       languageOptions: {
         parser,
         parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
         globals: { ...globals.es2022, ...globals.node }
       },
       plugins: { '@typescript-eslint': typescript, prettier },
       rules: {
         ...typescript.configs.recommended.rules,
         ...prettierConfig.rules,
         '@typescript-eslint/explicit-function-return-type': 'off',
         '@typescript-eslint/explicit-module-boundary-types': 'off',
         '@typescript-eslint/no-explicit-any': 'warn',
         '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
         'no-console': 'warn',
         'prettier/prettier': 'error'
       }
     }
   ];
   ```
4. **Remove old .eslintrc.json** if present
5. **Update lint scripts** in package.json:
   ```json
   {
     "lint": "eslint src tests",
     "lint:fix": "eslint src tests --fix"
   }
   ```
6. **Install dependencies**: `npm install` (may need `npm install --save-dev @eslint/js`)
7. **Run tests**: `npm test` (ensure all pass)
8. **Fix linting**: `npm run lint:fix` 
9. **Build package**: `npm run build`
10. **Commit & push**: 
    ```bash
    git add .
    git commit -m "feat: update dependencies to latest versions

    - Update to ESLint v9 with flat config format
    - Update TypeScript ESLint to v8
    - Update Vitest to v3
    - Update @types/node to v22
    - Add globals package for ESLint v9 support
    - Fix formatting and linting issues
    - All [X] tests pass
    - Builds successfully"
    git push
    ```

## Current Repository State
- **Location**: `/Users/josh/Documents/h1b-visa-analysis`
- **Meta repo**: Documentation updated in `/docs/backlog.md`
- **Packages location**: `packages/[package-name]/`
- **Each package**: Independent git repository (not submodules)

## Known Issues & Solutions
- **GitHub auth issues**: May need to temporarily remove `@chasenocap/*` dependencies during `npm install`
- **ESLint type-aware rules**: Use simpler config without `project: './tsconfig.json'`
- **BufferEncoding not defined**: Add `BufferEncoding: 'readonly'` to globals
- **Test runner globals**: Add `it: 'readonly'` to globals if needed

## Completion Criteria
- All 11 packages updated to target dependency versions
- All packages building and testing successfully
- All changes committed and pushed to individual package repositories
- Documentation updated in meta repository
- Consistent ESLint v9 flat config across all packages

## Resume Command
```bash
cd /Users/josh/Documents/h1b-visa-analysis
# Check current status
git status
ls packages/
# Continue with event-system package
cd packages/event-system
npm test  # Verify current state
# Begin update process...
```

Use this prompt to continue the dependency update work efficiently.