import { Repository, HealthMetrics, WorkflowRun, PublishRequest } from '@/types';

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
  // In production, this would call the GitHub API
  // For now, return mock data based on our metaGOTHIC packages
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
  ];
}

export async function fetchHealthMetrics(): Promise<HealthMetrics[]> {
  // In production, this would aggregate data from GitHub API
  // For now, return mock data
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
  // In production, use GitHub API
  console.log('Triggering workflow:', params);
  await new Promise(resolve => setTimeout(resolve, 1000));
}

export async function cancelWorkflow(params: {
  repository: string;
  runId: number;
}): Promise<void> {
  // In production, use GitHub API
  console.log('Cancelling workflow:', params);
  await new Promise(resolve => setTimeout(resolve, 1000));
}

export async function publishPackage(request: PublishRequest): Promise<void> {
  // In production, trigger the publish workflow
  console.log('Publishing package:', request);
  await new Promise(resolve => setTimeout(resolve, 2000));
}