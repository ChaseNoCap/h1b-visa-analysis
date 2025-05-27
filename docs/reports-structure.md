# Reports Structure and Naming Convention

## Overview

All generated reports are now stored in a gitignored `/reports` directory with a consistent structure and naming convention. This ensures reports are not tracked in version control while maintaining easy access to current and historical versions.

## Directory Structure

```
reports/                    # Gitignored root directory
├── ci/                     # CI/CD dashboards and monitoring
│   ├── dashboard.md        # Current basic CI dashboard (static name)
│   ├── dashboard.md           # Current enhanced dashboard (static name)
│   └── history/            # Historical snapshots
│       ├── dashboard-YYYY-MM-DD-HHMMSS.md
│       └── dashboard-YYYY-MM-DD-HHMMSS.md
├── h1b/                    # H1B analysis reports
│   ├── analysis.md         # Current H1B report (static name)
│   └── history/            # Historical reports
│       └── analysis-YYYY-MM-DD-HHMMSS.md
└── test/                   # Test output reports
    ├── e2e-results.md      # Latest E2E test results
    ├── integration-results.md  # Latest integration results
    └── history/            # Historical test results
        └── *-results-YYYY-MM-DD-HHMMSS.md
```

## Naming Convention

### Current Reports (Static Names)
- **CI Dashboard**: `dashboard.md`
- **CI Enhanced**: `dashboard.md`
- **H1B Analysis**: `analysis.md`
- **E2E Tests**: `e2e-results.md`
- **Integration Tests**: `integration-results.md`

### Historical Reports
Format: `{report-type}-YYYY-MM-DD-HHMMSS.md`

Examples:
- `dashboard-2025-05-27-143022.md`
- `analysis-2025-05-27-143022.md`
- `e2e-results-2025-05-27-143022.md`

## Generation Process

### Automatic Dual-Write
When a report is generated:
1. Written to the static location (e.g., `reports/ci/dashboard.md`)
2. Copied to history with timestamp (e.g., `reports/ci/history/dashboard-2025-05-27-143022.md`)

### Report Generators

#### CI Dashboards
```bash
# Generate dashboard
./scripts/generate-ci-dashboard.sh
# Output: reports/ci/dashboard.md
# History: reports/ci/history/dashboard-TIMESTAMP.md
```

#### H1B Analysis
```bash
# Generate via build
npm run build
# Output: reports/h1b/analysis.md
# History: reports/h1b/history/analysis-TIMESTAMP.md
```

#### Test Reports
Generated automatically during test runs:
- E2E tests write to `reports/test/e2e-results.md`
- Integration tests write to `reports/test/integration-results.md`

## Benefits

1. **Consistent References**: Documentation can always reference static paths
2. **No Version Control**: Reports don't clutter git history
3. **Historical Tracking**: All reports preserved with timestamps
4. **Clean URLs**: No need to update paths when new reports generate
5. **Simple Management**: Clear structure for retention policies

## Usage in Documentation

### Referencing Current Reports
```markdown
See the current CI dashboard at `/reports/ci/dashboard.md`
```

### Referencing Report Locations
```markdown
Reports are generated in:
- CI dashboards: `/reports/ci/`
- H1B analysis: `/reports/h1b/`
- Test results: `/reports/test/`
```

## Retention Policy

Currently: **Indefinite retention** (all historical reports kept)

Future considerations:
- Time-based retention (e.g., keep 30 days)
- Count-based retention (e.g., keep last 100)
- Size-based retention (e.g., max 1GB)

## Implementation Details

### ReportGenerator Service
The `ReportGenerator` service automatically:
1. Creates the output directory if needed
2. Creates the history subdirectory
3. Writes to both current and history locations
4. Returns the current location path

### Script Updates
- `generate-ci-dashboard.sh`: Updated to write to reports/ci/dashboard.md
- `monitor-ci-health.sh`: Used for real-time monitoring to stdout
- Test configurations: Updated to use reports/test/

### Gitignore
Added to `.gitignore`:
```
# Generated reports
reports/
```

## Migration Notes

### From Old Locations
- `/docs/ci-dashboard*.md` → `/reports/ci/dashboard.md`
- `/dist/h1b-report*.md` → `/reports/h1b/`
- `/tests/*/output/` → `/reports/test/`

Old tracked files have been removed from git.
