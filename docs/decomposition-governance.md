# Decomposition Governance

## Overview

This document establishes governance processes to ensure our decomposition principles are consistently applied across all packages and migrations in the H1B monorepo.

## Core Documents

1. **[Decomposition Principles](./decomposition-principles.md)** - The foundational principles
2. **[Decomposition Analysis](./decomposition-analysis.md)** - Detailed analysis and patterns
3. **[Package Decision Record Template](./package-decision-record-template.md)** - For documenting decisions
4. **[Implementation Roadmap](./implementation-roadmap.md)** - With principle checkpoints

## Governance Process

### 1. Package Creation Review

Before creating any new package:
- [ ] Complete a Package Decision Record using the template
- [ ] Review against all 6 decomposition principles
- [ ] Get review from at least one other developer
- [ ] Document any exceptions with clear rationale

### 2. Package Growth Monitoring

For existing packages:
- **Weekly**: Check package sizes during sprint reviews
- **Monthly**: Full audit of all packages against principles
- **Quarterly**: Review and update principles based on learnings

### 3. Migration Checkpoints

During any migration:
- **Pre-Migration**: Validate approach with principles
- **Mid-Migration**: Size and complexity checks
- **Post-Migration**: Full principle compliance review

## Enforcement Mechanisms

### Automated Checks

1. **Size Limits** (via CI/CD)
   ```bash
   # Check package size
   find packages/shared/*/src -name "*.ts" | xargs wc -l
   ```

2. **Dependency Count**
   ```bash
   # Check dependencies
   jq '.dependencies | length' packages/shared/*/package.json
   ```

### Manual Reviews

1. **PR Reviews** must check:
   - Does this change align with our principles?
   - Should this be in a separate package?
   - Is the package still focused on one purpose?

2. **Architecture Reviews** (monthly):
   - Review all packages against principles
   - Document any drift
   - Plan remediation if needed

## Education and Onboarding

### For New Developers

1. Read decomposition principles first
2. Review existing packages as examples
3. Complete first package creation with mentor
4. Document learnings in package decision record

### For Claude/AI Assistants

Every CLAUDE.md file must include:
```markdown
## Decomposition Principles

This package follows the monorepo decomposition principles:
- **Focus on ONE Thing**: [What this package does]
- **Prefer Simplicity**: [How it stays simple]
- **Clear Boundaries**: [Public API vs Internal]
- **Descriptive Naming**: [Why named this way]
- **Small Size**: [Current size and limits]

See `/docs/decomposition-principles.md` for details.
```

## Metrics and Reporting

### Key Metrics

1. **Package Size** (target: < 1000 lines)
2. **Dependency Count** (target: < 3)
3. **Purpose Clarity** (can explain in one sentence)
4. **API Surface** (target: < 10 public exports)

### Monthly Report Template

```markdown
## Decomposition Health Report - [Month Year]

### Package Summary
- Total packages: X
- Average size: Y lines
- Largest package: Z (lines)
- Most dependencies: A (count)

### Compliance Status
- [ ] All packages under 1000 lines
- [ ] All packages have single purpose
- [ ] All packages follow naming convention
- [ ] All CLAUDE.md files updated

### Actions Needed
1. Package X needs splitting because...
2. Package Y needs renaming to...
```

## Decision Rights

### Who Can:

1. **Create New Package**: Any developer with PR review
2. **Split Existing Package**: Team lead approval needed
3. **Merge Packages**: Architecture review required
4. **Grant Exceptions**: Tech lead + documented rationale

## Continuous Improvement

### Quarterly Reviews

1. Review all package decision records
2. Identify patterns in exceptions
3. Update principles if needed
4. Share learnings with team

### Feedback Loops

1. Developer surveys on principle effectiveness
2. Time tracking on package-related work
3. Defect analysis related to package boundaries
4. Performance impact of decomposition

## Exception Process

When principles must be violated:

1. **Document** in Package Decision Record
2. **Time-bound** the exception (e.g., "until Q3 refactor")
3. **Mitigate** with extra testing/documentation
4. **Review** monthly until resolved

## Tools and Automation

### Planned Tooling

1. **Package Size Monitor** - GitHub Action to check sizes
2. **Dependency Analyzer** - Visualize package dependencies
3. **Principle Checker** - Lint rules for common violations
4. **Dashboard** - Real-time package health metrics

### Current Scripts

```bash
# Check all package sizes
./scripts/check-package-sizes.sh

# Validate naming conventions
./scripts/validate-package-names.sh

# Generate dependency graph
./scripts/generate-dep-graph.sh
```

## Success Indicators

### Short Term (3 months)
- All packages compliant with principles
- Zero "utils" or "core" packages
- Clear understanding across team

### Long Term (12 months)
- Faster feature development
- Easier onboarding
- Reduced coupling between features
- Better test isolation

## References

- [Decomposition Principles](./decomposition-principles.md)
- [Decomposition Analysis](./decomposition-analysis.md)
- [Implementation Roadmap](./implementation-roadmap.md)
- [Migration Plan](./migration-plan.md)