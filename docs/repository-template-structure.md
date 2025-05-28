# Repository Template Structure

This document provides the standard directory structure and file templates for new ChaseNoCap packages.

## Standard Directory Structure

```
[package-name]/
├── .github/
│   └── workflows/
│       └── unified-workflow.yml    # Automated publishing workflow
├── src/
│   ├── index.ts                    # Main package exports
│   ├── interfaces/                 # TypeScript interfaces
│   │   └── I[PackageName].ts
│   ├── implementations/            # Concrete implementations
│   │   └── [PackageName].ts
│   ├── types/                      # Type definitions
│   │   └── [PackageName]Types.ts
│   └── utils/                      # Utility functions
├── tests/
│   ├── setup.ts                    # Test setup file
│   ├── unit/                       # Unit tests
│   │   └── [PackageName].test.ts
│   └── integration/                # Integration tests (if needed)
├── dist/                           # (gitignored) Build output
├── coverage/                       # (gitignored) Coverage reports
├── node_modules/                   # (gitignored) Dependencies
├── .gitignore
├── .npmrc                          # NPM authentication config
├── CLAUDE.md                       # AI context documentation
├── eslint.config.js                # ESLint flat config
├── LICENSE                         # MIT license
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json                   # TypeScript config
└── vitest.config.ts                # Test configuration
```

## File Templates

### 1. Package Entry Point (`src/index.ts`)

```typescript
// Main interfaces
export type { I[PackageName] } from './interfaces/I[PackageName].js';

// Types
export type {
  [PackageName]Config,
  [PackageName]Options,
  [PackageName]Result
} from './types/[PackageName]Types.js';

// Implementations
export { [PackageName] } from './implementations/[PackageName].js';

// Utilities (if applicable)
export { create[PackageName]Container } from './utils/[PackageName]Container.js';

// Constants/Tokens
export { [PACKAGE_NAME]_TYPES } from './types/InjectionTokens.js';
```

### 2. Interface Template (`src/interfaces/I[PackageName].ts`)

```typescript
export interface I[PackageName] {
  /**
   * Main method description
   */
  process(input: string): Promise<string>;
  
  /**
   * Configuration method
   */
  configure(options: [PackageName]Options): void;
  
  /**
   * Health check
   */
  healthCheck(): Promise<boolean>;
}
```

### 3. Implementation Template (`src/implementations/[PackageName].ts`)

```typescript
import { injectable, inject } from 'inversify';
import type { ILogger } from '@chasenocap/logger';
import type { I[PackageName] } from '../interfaces/I[PackageName].js';
import type { [PackageName]Options } from '../types/[PackageName]Types.js';
import { [PACKAGE_NAME]_TYPES } from '../types/InjectionTokens.js';

@injectable()
export class [PackageName] implements I[PackageName] {
  private options: [PackageName]Options;

  constructor(
    @inject([PACKAGE_NAME]_TYPES.ILogger) private readonly logger: ILogger
  ) {
    this.options = this.getDefaultOptions();
  }

  async process(input: string): Promise<string> {
    this.logger.debug('Processing input', { input });
    
    try {
      // Implementation logic here
      const result = await this.performProcessing(input);
      
      this.logger.info('Processing completed', { 
        inputLength: input.length,
        resultLength: result.length 
      });
      
      return result;
    } catch (error) {
      this.logger.error('Processing failed', error as Error);
      throw error;
    }
  }

  configure(options: [PackageName]Options): void {
    this.options = { ...this.options, ...options };
    this.logger.debug('Configuration updated', { options: this.options });
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Perform health check
      return true;
    } catch (error) {
      this.logger.error('Health check failed', error as Error);
      return false;
    }
  }

  private async performProcessing(input: string): Promise<string> {
    // Core logic implementation
    return input.toUpperCase(); // Example
  }

  private getDefaultOptions(): [PackageName]Options {
    return {
      // Default configuration
    };
  }
}
```

### 4. Test Template (`tests/unit/[PackageName].test.ts`)

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Container } from 'inversify';
import type { ILogger } from '@chasenocap/logger';
import { [PackageName] } from '../../src/implementations/[PackageName].js';
import { [PACKAGE_NAME]_TYPES } from '../../src/types/InjectionTokens.js';

describe('[PackageName]', () => {
  let container: Container;
  let [packageName]: [PackageName];
  let mockLogger: ILogger;

  beforeEach(() => {
    container = new Container();
    
    // Create mock logger
    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    } as unknown as ILogger;

    // Bind dependencies
    container.bind<ILogger>([PACKAGE_NAME]_TYPES.ILogger).toConstantValue(mockLogger);
    container.bind([PackageName]).toSelf();

    // Get instance
    [packageName] = container.get([PackageName]);
  });

  describe('process', () => {
    it('should process input successfully', async () => {
      const input = 'test input';
      const result = await [packageName].process(input);
      
      expect(result).toBeDefined();
      expect(mockLogger.debug).toHaveBeenCalledWith('Processing input', { input });
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      // Test error scenarios
    });
  });

  describe('configure', () => {
    it('should update configuration', () => {
      const options = { /* test options */ };
      [packageName].configure(options);
      
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Configuration updated',
        expect.objectContaining({ options })
      );
    });
  });

  describe('healthCheck', () => {
    it('should return true when healthy', async () => {
      const result = await [packageName].healthCheck();
      expect(result).toBe(true);
    });
  });
});
```

### 5. Package.json Template

```json
{
  "name": "@chasenocap/[package-name]",
  "version": "1.0.0",
  "description": "[Package description]",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "src",
    "README.md",
    "LICENSE",
    "CLAUDE.md"
  ],
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src tests --ext .ts",
    "lint:fix": "eslint src tests --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\" \"tests/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\" \"tests/**/*.ts\"",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist coverage",
    "prepublishOnly": "npm run clean && npm run build && npm test"
  },
  "keywords": [
    "[relevant]",
    "[keywords]",
    "typescript",
    "inversify"
  ],
  "author": "ChaseNoCap",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ChaseNoCap/[package-name].git"
  },
  "bugs": {
    "url": "https://github.com/ChaseNoCap/[package-name]/issues"
  },
  "homepage": "https://github.com/ChaseNoCap/[package-name]#readme",
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "@chasenocap/logger": "^1.0.0",
    "inversify": "^6.0.2",
    "reflect-metadata": "^0.2.1"
  },
  "devDependencies": {
    "@chasenocap/test-helpers": "^0.1.0",
    "@chasenocap/test-mocks": "^0.1.0",
    "@types/node": "^22.10.5",
    "@typescript-eslint/eslint-plugin": "^8.18.1",
    "@typescript-eslint/parser": "^8.18.1",
    "@vitest/coverage-v8": "^2.1.8",
    "eslint": "^9.18.0",
    "eslint-config-prettier": "^9.1.0",
    "prettier": "^3.4.2",
    "typescript": "^5.7.3",
    "vitest": "^2.1.8"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "tier": "shared"
}
```

### 6. CLAUDE.md Template

```markdown
# CLAUDE.md - @chasenocap/[package-name]

## Package Overview
[Brief description of what this package does and its role in the ecosystem]

## Key Responsibilities
1. **[Primary Responsibility]**: [Description]
2. **[Secondary Responsibility]**: [Description]
3. **[Additional Responsibilities]**: [Description]

## Architecture & Design

### Core Components
- **[ComponentName]**: [Description of component and its purpose]
- **[InterfaceName]**: [Description of main interface]
- **[UtilityName]**: [Description of utilities provided]

### Dependencies
- `@chasenocap/logger`: Logging interface
- `inversify`: Dependency injection framework
- [Other dependencies and why they're needed]

## Usage Patterns

### Basic Setup
```typescript
import { Container } from 'inversify';
import { [PackageName] } from '@chasenocap/[package-name]';

const container = new Container();
container.bind(ILogger).toConstantValue(logger);
container.bind([PackageName]).toSelf();

const instance = container.get([PackageName]);
```

### Common Use Cases
```typescript
// Example 1: Basic usage
const result = await instance.process('input data');

// Example 2: With configuration
instance.configure({ option1: 'value1' });
const result = await instance.process('input data');
```

## Testing Guidelines

### Unit Tests
- Test each public method
- Mock all dependencies
- Test error scenarios
- Verify logging calls

### Integration Tests
- Test with real dependencies where appropriate
- Verify end-to-end functionality

## Integration Points

### With Other Packages
- Integrates with `@chasenocap/logger` for logging
- Can be used by [list consuming packages]

### In Service Context
```typescript
// How this package is used in services
```

## Performance Considerations
- [Any performance considerations]
- [Caching strategies if applicable]
- [Resource usage notes]

## Error Handling
- All errors are logged before throwing
- Provides meaningful error messages
- Graceful degradation where possible

## Best Practices
1. Always inject dependencies
2. Use appropriate log levels
3. Handle errors gracefully
4. Follow TypeScript strict mode

## Common Issues & Solutions

### Issue: [Common issue]
**Solution**: [How to resolve]

### Issue: [Another common issue]
**Solution**: [How to resolve]

## Package Principles
- **Single Responsibility**: [What this package is responsible for]
- **Dependency Injection**: All dependencies injected
- **Type Safety**: Full TypeScript support
- **Testability**: Easy to test in isolation
- **Performance**: [Performance characteristics]
```

## Usage Instructions

1. **Copy Template Files**: Use these templates as starting points
2. **Replace Placeholders**: 
   - `[package-name]` → actual package name (kebab-case)
   - `[PackageName]` → PascalCase version
   - `[packageName]` → camelCase version
   - `[PACKAGE_NAME]` → UPPER_SNAKE_CASE version
3. **Customize**: Adapt templates to package-specific needs
4. **Maintain Standards**: Keep consistent with ecosystem patterns

## Notes

- All imports use `.js` extension for ES modules
- All packages use `"type": "module"` in package.json
- Strict TypeScript configuration is standard
- 90% test coverage target for all packages
- Dependency injection pattern using Inversify
- Comprehensive logging using @chasenocap/logger