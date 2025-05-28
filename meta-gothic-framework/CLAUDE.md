# metaGOTHIC CLAUDE.md

This is the nested meta repository for the metaGOTHIC framework - an AI-Guided Opinionated TypeScript Framework with High Intelligent Components.

## 🎯 Repository Purpose

This nested meta repository consolidates all metaGOTHIC-specific packages to:
1. **Simplify Management**: Keep metaGOTHIC packages separate from H1B analysis packages
2. **Enable UI Development**: Provide a dedicated space for the metaGOTHIC dashboard
3. **Monitor Health**: Real-time monitoring of all metaGOTHIC packages and CI/CD pipelines
4. **Control Pipelines**: Centralized control for triggering builds, tests, and publishing

## 📦 Package Structure

```
metaGOTHIC/
├── packages/                     # Git submodules for metaGOTHIC packages
│   ├── claude-client/           # Claude CLI subprocess wrapper
│   ├── prompt-toolkit/          # XML template system
│   ├── sdlc-config/            # YAML-based SDLC configuration
│   ├── sdlc-engine/            # State machine for SDLC phases
│   ├── sdlc-content/           # Templates and knowledge base
│   ├── graphql-toolkit/        # GraphQL utilities
│   ├── context-aggregator/     # Intelligent context management
│   └── ui-components/          # React dashboard components
├── src/                        # (Future) API server for dashboard
├── docs/                       # metaGOTHIC-specific documentation
└── scripts/                    # Automation scripts
```

## 🚀 UI Components Package

The `ui-components` package is the primary interface for metaGOTHIC, featuring:

### Health Monitoring Dashboard
- **Real-time Status**: Monitor all package health metrics
- **Build Status**: Track CI/CD pipeline success/failure
- **Test Coverage**: Visualize test coverage across packages
- **Dependency Status**: Track outdated dependencies
- **Recent Activity**: View recent commits and workflow runs

### Pipeline Control Center
- **Quick Actions**: One-click test runs, deployments, and publishing
- **Workflow Management**: Trigger, cancel, and monitor workflows
- **Package Publishing**: Tag and publish packages with version control
- **Repository Filtering**: Focus on specific packages

## 🔧 Development Workflow

### Initial Setup
```bash
# Clone with submodules
git clone --recurse-submodules <repo-url> metaGOTHIC
cd metaGOTHIC

# Or initialize submodules after cloning
git submodule update --init --recursive

# Install dependencies
npm install
```

### Running the Dashboard
```bash
# Development mode
npm run dev

# This runs the UI in development mode at http://localhost:3000
```

### Working with Packages
```bash
# Update all submodules to latest
npm run update-submodules

# Work on a specific package
cd packages/prompt-toolkit
npm test
npm run build

# Commit changes in submodule
git add .
git commit -m "feat: add new template function"
git push

# Update submodule reference in meta repo
cd ../..
git add packages/prompt-toolkit
git commit -m "chore: update prompt-toolkit submodule"
```

## 🏗️ Architecture Patterns

### Nested Meta Repository Pattern
This is our first implementation of a nested meta repository:
- **Parent**: h1b-visa-analysis (contains both H1B and metaGOTHIC packages)
- **Child**: metaGOTHIC (contains only metaGOTHIC packages)
- **Benefits**: Clear separation of concerns, focused development environment

### UI Architecture
- **React + TypeScript**: Type-safe component development
- **TanStack Query**: Efficient data fetching and caching
- **Tailwind CSS**: Utility-first styling with dark mode support
- **Vite**: Fast development and optimized builds

### API Integration (Future)
The dashboard currently uses mock data. Future integration will:
- Connect to GitHub API for real-time repository data
- Use GitHub Actions API for workflow management
- Implement WebSocket connections for live updates
- Add authentication for secure operations

## 📊 Monitoring Capabilities

### Health Metrics Tracked
- **Build Status**: Pass/fail status of latest builds
- **Test Coverage**: Percentage and trends
- **Dependency Health**: Outdated or vulnerable dependencies
- **Activity**: Recent commits, PRs, and issues
- **Performance**: Build times and bundle sizes

### Pipeline Control Features
- **Trigger Workflows**: Start tests, builds, or deployments
- **Cancel Operations**: Stop running workflows
- **Publish Packages**: Version, tag, and publish to npm
- **Batch Operations**: Perform actions across multiple packages

## 🔐 Security Considerations

### Authentication (To Be Implemented)
- GitHub OAuth for user authentication
- PAT tokens for API operations
- Role-based access control for sensitive operations

### Best Practices
- Never commit secrets or tokens
- Use environment variables for configuration
- Implement rate limiting for API calls
- Audit log all pipeline operations

## 📈 Future Enhancements

### Phase 1: MVP (Current)
- ✅ Basic health monitoring dashboard
- ✅ Pipeline control interface
- ✅ Mock data integration
- ⏳ Package creation within UI

### Phase 2: API Integration
- [ ] GitHub API connection
- [ ] Real-time data updates
- [ ] Authentication system
- [ ] Webhook integration

### Phase 3: Advanced Features
- [ ] Performance analytics
- [ ] Dependency graph visualization
- [ ] Automated issue creation
- [ ] Integration with Claude for AI assistance

## 🤖 AI Context Loading

When working with metaGOTHIC packages, load context progressively:

1. **Overview**: Load this CLAUDE.md for metaGOTHIC context
2. **Package Details**: Load specific package CLAUDE.md files
3. **Implementation**: Load source code as needed

### Quick Commands for Claude
- "Show metaGOTHIC health" → Load dashboard components
- "Update package X" → Load package submodule
- "Add new metaGOTHIC feature" → Load relevant architecture docs
- "Fix pipeline issue" → Load pipeline control components

## 🚦 Status Indicators

### Package Health Status
- 🟢 **Healthy**: All checks passing, up-to-date
- 🟡 **Warning**: Minor issues, outdated dependencies
- 🔴 **Critical**: Build failures, security issues

### Pipeline Status
- ⏸️ **Queued**: Waiting to start
- 🔄 **In Progress**: Currently running
- ✅ **Success**: Completed successfully
- ❌ **Failed**: Completed with errors
- ⏹️ **Cancelled**: Manually stopped

## 📝 Development Guidelines

### For UI Components
- Use TypeScript strict mode
- Follow React best practices
- Implement error boundaries
- Add loading states for all async operations
- Use semantic HTML and ARIA labels

### For Package Management
- Keep submodules up-to-date
- Version packages semantically
- Document all public APIs
- Maintain high test coverage
- Update CLAUDE.md with changes

## 🔄 Integration with Parent Meta Repository

This nested repository maintains its independence while staying connected:
- Parent tracks this entire directory as a unit
- Changes here don't affect H1B packages
- Shared dependencies use published versions
- Clear boundary between frameworks