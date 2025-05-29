# @chasenocap/ui-components

[![Version](https://img.shields.io/npm/v/@chasenocap/ui-components.svg)](https://github.com/ChaseNoCap/ui-components)
[![Build Status](https://github.com/ChaseNoCap/ui-components/workflows/CI/badge.svg)](https://github.com/ChaseNoCap/ui-components/actions)

Production-ready React dashboard for the metaGOTHIC framework, providing real-time health monitoring and CI/CD pipeline control with comprehensive GitHub API integration.

## 🚀 Production Features

### Real GitHub API Integration
- **Browser-compatible implementation** with authentication validation
- **Production-ready GitHub service** with proper error handling
- **Token validation** with visual status indicators
- **Rate limiting awareness** and proper caching

### Comprehensive Error Handling
- **ApiError component** for user-friendly error display
- **Refined error boundaries** with GitHub-specific error handling
- **Query error boundaries** with retry functionality
- **Loading timeouts** and graceful degradation

### Production Dashboard
- **Live at**: http://localhost:3001
- **Real-time data** from GitHub API
- **Responsive design** with Tailwind CSS
- **Performance optimized** with proper caching

## 🏗️ Architecture

### Tech Stack
- **React 18** with TypeScript
- **Vite** for development and building  
- **TanStack Query** for data fetching and caching
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Real GitHub API** integration

### Browser-Compatible Utilities
- **Logger**: Browser-compatible logging with console fallback
- **Cache**: Memory-based caching with TTL support
- **Error Handling**: Comprehensive error boundaries and user feedback

## 🎯 Key Components

### Health Dashboard
```tsx
import { HealthDashboard } from '@chasenocap/ui-components';

// Real-time monitoring with GitHub API
<HealthDashboard />
```

### Pipeline Control
```tsx
import { PipelineControl } from '@chasenocap/ui-components';

// CI/CD workflow management
<PipelineControl />
```

### Error Handling
```tsx
import { GitHubErrorBoundary, ApiError } from '@chasenocap/ui-components';

// Comprehensive error management
<GitHubErrorBoundary>
  <YourComponent />
</GitHubErrorBoundary>
```

## 🚀 Quick Start

### Installation
```bash
npm install @chasenocap/ui-components
```

### Development Server
```bash
npm run dev     # http://localhost:3001
npm run build   # Production build
npm run preview # Preview production build
```

### Environment Setup
Create `.env.local`:
```env
VITE_GITHUB_TOKEN=your_github_token_here
```

## 🧪 Testing

### Test Coverage
- **20+ tests** with comprehensive coverage
- **Integration tests** for GitHub API
- **Component tests** for all major features
- **Error boundary tests** for edge cases

```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm run test:coverage # Coverage report
```

## 📊 Features

### Health Monitoring
- ✅ **Real-time repository status** from GitHub API
- ✅ **Workflow run tracking** with detailed status
- ✅ **Build and test metrics** with visual indicators
- ✅ **Error state handling** with user-friendly messages

### Pipeline Control
- ✅ **One-click workflow triggers** via GitHub API
- ✅ **Package publishing interface** with validation
- ✅ **Repository filtering** and search
- ✅ **Batch operations** for multiple repositories

### Production Ready
- ✅ **Comprehensive error handling** with graceful degradation
- ✅ **Loading states** and skeleton components
- ✅ **Token validation** with visual feedback
- ✅ **Rate limiting** awareness and caching
- ✅ **Responsive design** for all screen sizes

## 🔧 API Integration

### GitHub Service
```typescript
import { gitHubService } from '@chasenocap/ui-components';

// Real GitHub API calls with error handling
const repositories = await gitHubService.getRepositories();
const workflows = await gitHubService.getWorkflowRuns(owner, repo);
```

### Authentication
- **Token validation** with visual indicators
- **Scope verification** for required permissions
- **Error recovery** with clear user guidance

## 🎨 Styling

### Tailwind CSS Integration
- **Dark mode support** with system preference detection
- **Custom Gothic color palette** for branding
- **Responsive breakpoints** for all devices
- **Component variants** for different states

### Design System
- **Consistent spacing** using Tailwind scale
- **Typography hierarchy** with clear visual hierarchy
- **Icon system** using Lucide React
- **Loading patterns** with shimmer effects

## 🚀 Performance

### Optimization Features
- **Query caching** with 5-minute stale time
- **Background refetching** for fresh data
- **Optimistic updates** for immediate feedback
- **Memory-efficient** component rendering

### Browser Compatibility
- **Modern browsers** (Chrome, Firefox, Safari, Edge)
- **ES2020+ features** with proper polyfills
- **Browser-compatible** logging and caching
- **Progressive enhancement** for older browsers

## 🔍 Troubleshooting

### Common Issues

#### Dashboard Not Loading
```bash
# Check port availability
lsof -i :3001

# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

#### GitHub API Errors
- Verify `VITE_GITHUB_TOKEN` is set correctly
- Check token permissions (repo, workflow scopes)
- Review rate limiting in browser console
- Use token validation banner for diagnostics

#### Build Issues
```bash
npm run typecheck  # Check TypeScript errors
npm run lint       # Check ESLint issues
npm run build      # Full production build
```

## 📈 Development Status

### Current Implementation
- ✅ **Production-ready dashboard** at http://localhost:3001
- ✅ **Real GitHub API integration** with comprehensive error handling
- ✅ **Browser-compatible utilities** (logger, cache)
- ✅ **Comprehensive test suite** with 20+ tests
- ✅ **Error boundaries** and user-friendly error states

### Recent Achievements
- **Real GitHub API**: Complete browser-compatible implementation
- **Error Handling**: Comprehensive ApiError component and boundaries
- **Production Dashboard**: Live at http://localhost:3001 with real data
- **Token Validation**: Visual indicators and authentication management
- **Performance**: Optimized caching and loading states

## 🤝 Contributing

### Development Workflow
1. **Clone repository** with submodules
2. **Install dependencies**: `npm install`
3. **Set up environment**: Copy `.env.example` to `.env.local`
4. **Start development**: `npm run dev`
5. **Run tests**: `npm test`

### Code Standards
- **TypeScript strict mode** enabled
- **ESLint + Prettier** for code formatting
- **Component testing** required for new features
- **Error handling** must be comprehensive
- **Documentation** updates for new features

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Related Packages

- **[@chasenocap/cache](../cache)**: Caching utilities
- **[@chasenocap/logger](../logger)**: Logging infrastructure  
- **[@chasenocap/github-graphql-client](../github-graphql-client)**: GitHub API client

---

**metaGOTHIC Framework** - AI-guided development infrastructure