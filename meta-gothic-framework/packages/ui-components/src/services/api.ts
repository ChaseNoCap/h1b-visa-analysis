import { Repository, HealthMetrics, WorkflowRun, PublishRequest } from '@/types';

// GitHub service integration with fallback to enhanced mock
let githubService: any = null;
let useEnhancedMock = false;
let gitHubInitPromise: Promise<void> | null = null;

// Initialize GitHub service asynchronously
async function initializeGitHubService() {
  if (gitHubInitPromise) return gitHubInitPromise;
  
  gitHubInitPromise = (async () => {
    try {
      // Check if GitHub token is available for real API
      const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
      
      if (githubToken) {
        try {
          // Try to initialize real GitHub service
          const { githubService: realGithubService } = await import('./githubService.js');
          githubService = realGithubService;
          useEnhancedMock = false;
          console.log('✅ Using real GitHub API with token');
          return; // Exit early if real service works
        } catch (error) {
          console.log('⚠️ Real GitHub service failed, falling back to enhanced mock:', error);
        }
      }

      // Use enhanced mock service
      const { githubService: mockGithubService } = await import('./githubServiceMock.js');
      githubService = mockGithubService;
      useEnhancedMock = true;
      
    } catch (error) {
      console.log('⚠️ Failed to initialize any GitHub service:', error);
      useEnhancedMock = false;
    }
  })();
  
  return gitHubInitPromise;
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchRepositories(): Promise<Repository[]> {
  await initializeGitHubService();
  
  if (githubService) {
    try {
      return await githubService.fetchRepositories();
    } catch (error) {
      console.warn('Failed to fetch repositories from service, falling back to basic mock:', error);
    }
  }

  // Fallback to mock data
  return [
    {
      id: '1',
      name: 'claude-client',
      fullName: 'ChaseNoCap/claude-client',
      description: 'Claude CLI subprocess wrapper with streaming support',
      url: 'https://github.com/ChaseNoCap/claude-client',
      isSubmodule: true,
      packageName: '@chasenocap/claude-client',
      version: '0.1.0',
    },
    {
      id: '2',
      name: 'prompt-toolkit',
      fullName: 'ChaseNoCap/prompt-toolkit',
      description: 'XML template system for metaGOTHIC framework',
      url: 'https://github.com/ChaseNoCap/prompt-toolkit',
      isSubmodule: true,
      packageName: '@chasenocap/prompt-toolkit',
      version: '0.1.0',
    },
    {
      id: '3',
      name: 'sdlc-config',
      fullName: 'ChaseNoCap/sdlc-config',
      description: 'YAML-based SDLC configuration management',
      url: 'https://github.com/ChaseNoCap/sdlc-config',
      isSubmodule: true,
      packageName: '@chasenocap/sdlc-config',
      version: '0.1.0',
    },
    {
      id: '4',
      name: 'sdlc-engine',
      fullName: 'ChaseNoCap/sdlc-engine',
      description: 'State machine for SDLC phase management',
      url: 'https://github.com/ChaseNoCap/sdlc-engine',
      isSubmodule: true,
      packageName: '@chasenocap/sdlc-engine',
      version: '0.1.0',
    },
    {
      id: '5',
      name: 'sdlc-content',
      fullName: 'ChaseNoCap/sdlc-content',
      description: 'Templates and knowledge base for metaGOTHIC',
      url: 'https://github.com/ChaseNoCap/sdlc-content',
      isSubmodule: true,
      packageName: '@chasenocap/sdlc-content',
      version: '0.1.0',
    },
    {
      id: '6',
      name: 'graphql-toolkit',
      fullName: 'ChaseNoCap/graphql-toolkit',
      description: 'GraphQL utilities and schema management',
      url: 'https://github.com/ChaseNoCap/graphql-toolkit',
      isSubmodule: true,
      packageName: '@chasenocap/graphql-toolkit',
      version: '0.1.0',
    },
    {
      id: '7',
      name: 'context-aggregator',
      fullName: 'ChaseNoCap/context-aggregator',
      description: 'Intelligent context management for AI workflows',
      url: 'https://github.com/ChaseNoCap/context-aggregator',
      isSubmodule: true,
      packageName: '@chasenocap/context-aggregator',
      version: '0.1.0',
    },
    {
      id: '8',
      name: 'ui-components',
      fullName: 'ChaseNoCap/ui-components',
      description: 'metaGOTHIC UI Components and Dashboard',
      url: 'https://github.com/ChaseNoCap/ui-components',
      isSubmodule: true,
      packageName: '@chasenocap/ui-components',
      version: '0.1.0',
    },
    {
      id: '9',
      name: 'github-graphql-client',
      fullName: 'ChaseNoCap/github-graphql-client',
      description: 'Smart GitHub API client with GraphQL/REST routing',
      url: 'https://github.com/ChaseNoCap/github-graphql-client',
      isSubmodule: true,
      packageName: '@chasenocap/github-graphql-client',
      version: '1.0.0',
    },
  ];
}

export async function fetchHealthMetrics(): Promise<HealthMetrics[]> {
  await initializeGitHubService();
  
  if (githubService) {
    try {
      return await githubService.fetchHealthMetrics();
    } catch (error) {
      console.warn('Failed to fetch health metrics from service, falling back to basic mock:', error);
    }
  }

  // Fallback to mock data
  const repos = await fetchRepositories();
  return repos.map(repo => ({
    repository: repo.name,
    status: Math.random() > 0.8 ? 'warning' : 'healthy',
    lastUpdate: new Date().toISOString(),
    metrics: {
      buildStatus: Math.random() > 0.9 ? 'failing' : 'passing',
      testCoverage: Math.random() * 40 + 60,
      lastPublish: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      openIssues: Math.floor(Math.random() * 10),
      openPRs: Math.floor(Math.random() * 5),
      dependencyStatus: Math.random() > 0.7 ? 'outdated' : 'up-to-date',
    },
    workflows: [],
  }));
}

export async function triggerWorkflow(params: {
  repository: string;
  workflow: string;
  inputs?: Record<string, any>;
}): Promise<void> {
  await initializeGitHubService();
  
  if (githubService) {
    try {
      return await githubService.triggerWorkflow(params);
    } catch (error) {
      console.warn('Failed to trigger workflow from service, using basic mock:', error);
    }
  }

  // Fallback to mock behavior
  console.log('Triggering workflow (mock):', params);
  await new Promise(resolve => setTimeout(resolve, 1000));
}

export async function cancelWorkflow(params: {
  repository: string;
  runId: number;
}): Promise<void> {
  await initializeGitHubService();
  
  if (githubService) {
    try {
      return await githubService.cancelWorkflow(params);
    } catch (error) {
      console.warn('Failed to cancel workflow from service, using basic mock:', error);
    }
  }

  // Fallback to mock behavior
  console.log('Cancelling workflow (mock):', params);
  await new Promise(resolve => setTimeout(resolve, 1000));
}

export async function publishPackage(request: PublishRequest): Promise<void> {
  await initializeGitHubService();
  
  if (githubService) {
    try {
      return await githubService.publishPackage(request);
    } catch (error) {
      console.warn('Failed to publish package from service, using basic mock:', error);
    }
  }

  // Fallback to mock behavior
  console.log('Publishing package (mock):', request);
  await new Promise(resolve => setTimeout(resolve, 2000));
}