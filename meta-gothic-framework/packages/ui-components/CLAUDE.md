# UI Components CLAUDE.md

## Overview
This package provides the React-based dashboard interface for the metaGOTHIC framework, featuring health monitoring and CI/CD pipeline control.

## Architecture

### Tech Stack
- **React 18** with TypeScript
- **Vite** for development and building
- **TanStack Query** for data fetching and caching
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vitest** for testing

### Component Structure
```
src/
├── components/
│   ├── HealthDashboard/      # Main health monitoring interface
│   │   ├── index.tsx         # Dashboard container
│   │   ├── RepositoryCard.tsx # Individual repo status card
│   │   ├── MetricsOverview.tsx # Summary metrics display
│   │   └── WorkflowList.tsx  # Recent workflow runs
│   └── PipelineControl/      # CI/CD control interface
│       ├── index.tsx         # Control center container
│       ├── WorkflowCard.tsx  # Workflow trigger interface
│       └── PublishModal.tsx  # Package publishing dialog
├── services/
│   └── api.ts               # API service layer (currently mock)
├── types/
│   └── index.ts             # TypeScript type definitions
├── App.tsx                  # Main app component with routing
└── main.tsx                 # React entry point
```

## Key Features

### Health Monitoring Dashboard
- Real-time package health status
- Build and test coverage metrics
- Dependency health tracking
- Recent workflow activity
- Visual status indicators

### Pipeline Control Center
- One-click workflow triggers
- Package publishing interface
- Repository filtering
- Batch operations support

## Development

### Running the Dashboard
```bash
npm run dev     # Start dev server on http://localhost:3000
npm run build   # Build for production
npm run preview # Preview production build
```

### Testing
```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm run test:coverage # With coverage report
```

### Current Test Coverage
- 7 tests passing
- Components: App, HealthDashboard
- Services: API mock functions
- Full integration tests included

## API Integration

Currently using mock data. Future integration points:
- GitHub API for repository data
- GitHub Actions API for workflows
- WebSocket for real-time updates
- Authentication via GitHub OAuth

## Styling

Uses Tailwind CSS with:
- Dark mode support (class-based)
- Responsive design
- Custom Gothic color palette
- Consistent spacing and sizing

## State Management

- **TanStack Query** for server state
- React Context for UI state (future)
- No client-side state library needed yet

## Performance Considerations

- Lazy loading for routes
- Query caching with 5-minute stale time
- Optimistic updates for actions
- Virtual scrolling for long lists (future)

## Future Enhancements

1. **Real API Integration**
   - Connect to actual GitHub APIs
   - Implement authentication
   - Add error boundaries

2. **Enhanced Features**
   - Dependency graph visualization
   - Performance metrics charts
   - Automated issue creation
   - Integration with Claude

3. **UI Improvements**
   - More detailed workflow logs
   - Customizable dashboard layouts
   - Export functionality
   - Keyboard shortcuts

## Common Issues

### Dev Server Not Loading
- Check if port 3000 is available
- Ensure all dependencies installed
- Clear Vite cache: `rm -rf node_modules/.vite`

### TypeScript Errors
- Run `npm run typecheck` to see all errors
- Most are unused imports (can be cleaned up)
- Doesn't prevent dev server from running

### Test Failures
- Mock data might have changed
- Check for multiple elements with same text
- Use more specific queries