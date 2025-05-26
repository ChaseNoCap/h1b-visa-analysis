# Package Update Checklist

## 🎯 Quick Reference for Each Package Update

### For EVERY Package:

1. **Update package.json devDependencies**:
```json
{
  "@typescript-eslint/eslint-plugin": "^8.0.0",
  "@typescript-eslint/parser": "^8.0.0", 
  "@vitest/coverage-v8": "^3.0.0",
  "eslint": "^9.0.0",
  "eslint-config-prettier": "^10.0.0",
  "globals": "^16.0.0",
  "vitest": "^3.0.0",
  "@types/node": "^22.0.0"
}
```

2. **Delete** `.eslintrc.json`

3. **Create** `eslint.config.js`:
```javascript
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022
      }
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json'
      },
      globals: {
        ...globals.node,
        ...globals.es2022,
        NodeJS: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescript,
      'prettier': prettier
    },
    rules: {
      ...typescript.configs['recommended'].rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/require-await': 'off',
      'prettier/prettier': 'error'
    }
  },
  prettierConfig,
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**']
  }
];
```

4. **Run**:
```bash
npm install
npm run lint:fix  # Fix any auto-fixable issues
npm run typecheck # Ensure TypeScript happy
npm test          # Ensure tests pass
```

## 📋 Package-Specific Notes

### 🔨 di-framework
- No special considerations
- Just update dependencies and ESLint

### 📝 logger  
- Verify Winston still works correctly
- Check log output formatting unchanged

### 📁 file-system
- Test with new @types/node v22
- Verify all fs operations still work

### 🧪 test-mocks
- Ensure mocks compatible with vitest v3
- Check assertion helpers still work

### 🧪 test-helpers (SPECIAL ATTENTION)
- **vitest is a PRODUCTION dependency here!**
- Update to vitest v3 in dependencies, not devDependencies
- May need code changes for vitest v3 API
- Test thoroughly as other packages depend on this

### 📊 event-system
- Verify decorators still work
- Test event emission/subscription

### 💾 cache
- Test @Cacheable decorator
- Verify TTL functionality
- Check memory cache operations

### 📄 report-templates
- Should be straightforward
- Test template generation

### 📚 prompts
- Documentation only
- Minimal updates needed

### 📝 markdown-compiler
- Complex package - test thoroughly
- Verify markdown processing unchanged
- Check file includes work

### 📋 report-components
- Content only
- Should have no issues

## 🚀 Update Order

1. **di-framework** → 2. **logger** → 3. **file-system** → 4. **test-mocks** → 5. **test-helpers** → 6. **event-system** → 7. **cache** → 8. **report-templates** → 9. **prompts** → 10. **markdown-compiler** → 11. **report-components**

## ⚠️ Common Issues & Fixes

### Issue: "Cannot find module 'globals'"
**Fix**: Make sure to add `"globals": "^16.0.0"` to devDependencies

### Issue: ESLint errors about undefined globals
**Fix**: Ensure globals are properly spread in the config

### Issue: Tests failing with vitest v3
**Fix**: Check for API changes in vitest migration guide

### Issue: TypeScript errors after update
**Fix**: The newer @typescript-eslint is stricter - fix the actual type issues

## ✅ Definition of Done per Package

- [ ] Dependencies updated in package.json
- [ ] ESLint v9 config created and working
- [ ] Old .eslintrc.json deleted
- [ ] `npm install` runs without errors
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes  
- [ ] `npm test` passes
- [ ] Package builds successfully
- [ ] Version bumped (major or minor depending on changes)
- [ ] CHANGELOG updated
- [ ] Package published to GitHub Packages
- [ ] Meta repo updated to use new version