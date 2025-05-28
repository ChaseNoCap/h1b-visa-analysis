import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Activity, GitBranch, Home, Settings } from 'lucide-react';
import { HealthDashboard } from './components/HealthDashboard';
import { PipelineControl } from './components/PipelineControl';
import clsx from 'clsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
    },
  },
});

const Navigation: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
      isActive
        ? 'bg-gray-900 text-white dark:bg-gray-700'
        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
    );

  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                metaGOTHIC
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink to="/" className={navLinkClass}>
                <Activity className="h-4 w-4" />
                <span>Health Monitor</span>
              </NavLink>
              <NavLink to="/pipelines" className={navLinkClass}>
                <GitBranch className="h-4 w-4" />
                <span>Pipeline Control</span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navigation />
          <Routes>
            <Route path="/" element={<HealthDashboard />} />
            <Route path="/pipelines" element={<PipelineControl />} />
          </Routes>
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </Router>
    </QueryClientProvider>
  );
};