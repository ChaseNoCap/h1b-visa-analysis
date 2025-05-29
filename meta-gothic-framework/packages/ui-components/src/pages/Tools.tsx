import React, { useState } from 'react';
import { GitCommit, GitPullRequest, Tag, RefreshCw, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { UncommittedChangesAnalyzer } from '../components/Tools/UncommittedChangesAnalyzer';
import { CommitMessageGenerator } from '../components/Tools/CommitMessageGenerator';
import { toolsService, type PackageChanges, type CommitMessage } from '../services/toolsService';

interface ToolCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'ready' | 'running' | 'error' | 'success';
}

export const Tools: React.FC = () => {
  const { theme } = useTheme();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [toolStatuses, setToolStatuses] = useState<Record<string, ToolCard['status']>>({});
  const [scannedChanges, setScannedChanges] = useState<PackageChanges[]>([]);
  const [generatedMessages, setGeneratedMessages] = useState<CommitMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const tools: ToolCard[] = [
    {
      id: 'uncommitted-changes',
      title: 'Uncommitted Changes Analyzer',
      description: 'Scan all Meta GOTHIC packages for uncommitted changes and generate AI-powered commit messages',
      icon: <GitCommit className="h-6 w-6" />,
      status: toolStatuses['uncommitted-changes'] || 'ready'
    },
    {
      id: 'commit-message-generator',
      title: 'AI Commit Message Generator',
      description: 'Generate semantic commit messages using AI analysis of your changes',
      icon: <GitCommit className="h-6 w-6" />,
      status: toolStatuses['commit-message-generator'] || 'ready'
    },
    {
      id: 'bulk-commit',
      title: 'Bulk Commit Tool',
      description: 'Commit all analyzed changes with AI-generated messages across all packages',
      icon: <CheckCircle className="h-6 w-6" />,
      status: toolStatuses['bulk-commit'] || 'ready'
    },
    {
      id: 'push-all',
      title: 'Push All Repositories',
      description: 'Push all Meta GOTHIC package repositories to their remotes',
      icon: <GitPullRequest className="h-6 w-6" />,
      status: toolStatuses['push-all'] || 'ready'
    },
    {
      id: 'tag-publish',
      title: 'Tag & Publish Packages',
      description: 'Create version tags and trigger package publishing workflows',
      icon: <Tag className="h-6 w-6" />,
      status: toolStatuses['tag-publish'] || 'ready'
    }
  ];

  const handleToolClick = (toolId: string) => {
    setSelectedTool(toolId);
  };

  const handleCommitAll = async () => {
    if (generatedMessages.length === 0) return;
    
    setIsProcessing(true);
    setToolStatuses(prev => ({ ...prev, 'bulk-commit': 'running' }));
    
    try {
      await toolsService.commitChanges(generatedMessages);
      setToolStatuses(prev => ({ ...prev, 'bulk-commit': 'success' }));
      // Clear changes after successful commit
      setScannedChanges([]);
      setGeneratedMessages([]);
    } catch (error) {
      setToolStatuses(prev => ({ ...prev, 'bulk-commit': 'error' }));
      console.error('Failed to commit changes:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePushAll = async () => {
    setIsProcessing(true);
    setToolStatuses(prev => ({ ...prev, 'push-all': 'running' }));
    
    try {
      await toolsService.pushAllRepositories();
      setToolStatuses(prev => ({ ...prev, 'push-all': 'success' }));
    } catch (error) {
      setToolStatuses(prev => ({ ...prev, 'push-all': 'error' }));
      console.error('Failed to push repositories:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: ToolCard['status']) => {
    switch (status) {
      case 'ready': return theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
      case 'running': return 'text-blue-500';
      case 'error': return 'text-red-500';
      case 'success': return 'text-green-500';
      default: return theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getStatusIcon = (status: ToolCard['status']) => {
    switch (status) {
      case 'running': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Meta GOTHIC Tools</h1>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Powerful tools for managing your Meta GOTHIC packages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool.id)}
            className={`
              p-6 rounded-lg border text-left transition-all
              ${theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                : 'bg-white border-gray-200 hover:bg-gray-50'
              }
              ${selectedTool === tool.id 
                ? theme === 'dark' 
                  ? 'ring-2 ring-blue-500' 
                  : 'ring-2 ring-blue-400'
                : ''
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={getStatusColor(tool.status)}>
                  {tool.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{tool.title}</h3>
                  <p className={`mt-1 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {tool.description}
                  </p>
                </div>
              </div>
              <div className={getStatusColor(tool.status)}>
                {getStatusIcon(tool.status)}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Tool-specific content will be rendered here based on selectedTool */}
      {selectedTool && (
        <div className={`
          mt-8 p-6 rounded-lg border
          ${theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
          }
        `}>
          {selectedTool === 'uncommitted-changes' && (
            <div className="space-y-6">
              <UncommittedChangesAnalyzer
                onAnalysisComplete={(changes) => {
                  setScannedChanges(changes);
                  setToolStatuses(prev => ({ 
                    ...prev, 
                    'uncommitted-changes': changes.length > 0 ? 'success' : 'ready' 
                  }));
                }}
              />
              {scannedChanges.length > 0 && (
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => setSelectedTool('commit-message-generator')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                  >
                    <span>Generate Commit Messages</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
          
          {selectedTool === 'commit-message-generator' && (
            <div className="space-y-6">
              <CommitMessageGenerator
                changes={scannedChanges}
                onMessagesGenerated={(messages) => {
                  setGeneratedMessages(messages);
                  setToolStatuses(prev => ({ 
                    ...prev, 
                    'commit-message-generator': 'success' 
                  }));
                }}
              />
              {generatedMessages.length > 0 && (
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => setSelectedTool('bulk-commit')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                  >
                    <span>Proceed to Commit</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
          
          {selectedTool === 'bulk-commit' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Ready to Commit</h3>
              <div className="space-y-3">
                {generatedMessages.map((msg) => (
                  <div
                    key={msg.package}
                    className={`p-3 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <p className="font-medium">{msg.package}</p>
                    <p className={`text-sm font-mono mt-1 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  This will commit changes in {generatedMessages.length} packages
                </p>
                <button
                  onClick={handleCommitAll}
                  disabled={isProcessing}
                  className={`
                    flex items-center space-x-2 px-6 py-2 rounded-md transition-colors
                    ${isProcessing
                      ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                    }
                  `}
                >
                  <GitCommit className="h-4 w-4" />
                  <span>{isProcessing ? 'Committing...' : 'Commit All'}</span>
                </button>
              </div>
            </div>
          )}
          
          {selectedTool === 'push-all' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Push All Repositories</h3>
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <p className={`font-medium mb-2 ${
                  theme === 'dark' ? 'text-yellow-400' : 'text-yellow-800'
                }`}>
                  ⚠️ Important
                </p>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  This will push all Meta GOTHIC package repositories to their remotes.
                  Make sure all changes are committed before pushing.
                </p>
              </div>
              <div className="flex items-center justify-end">
                <button
                  onClick={handlePushAll}
                  disabled={isProcessing}
                  className={`
                    flex items-center space-x-2 px-6 py-2 rounded-md transition-colors
                    ${isProcessing
                      ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }
                  `}
                >
                  <GitPullRequest className="h-4 w-4" />
                  <span>{isProcessing ? 'Pushing...' : 'Push All'}</span>
                </button>
              </div>
            </div>
          )}
          
          {selectedTool === 'tag-publish' && (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Tag & Publish tool coming soon...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};