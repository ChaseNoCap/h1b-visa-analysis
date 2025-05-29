#!/usr/bin/env node

const express = require('express');
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const cors = require('cors');

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.GIT_SERVER_PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Helper function to safely execute git commands
async function execGitCommand(cwd, args) {
  const command = `git ${args.join(' ')}`;
  console.log(`Executing: ${command} in ${cwd}`);
  
  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd,
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    
    if (stderr && !stderr.includes('warning:')) {
      console.warn(`Git stderr: ${stderr}`);
    }
    
    return stdout;
  } catch (error) {
    console.error(`Git command failed: ${error.message}`);
    throw new Error(`Git command failed: ${error.message}`);
  }
}

// Execute git command endpoint
app.post('/api/git/exec', async (req, res) => {
  const { cwd, args } = req.body;
  
  if (!cwd || !args || !Array.isArray(args)) {
    return res.status(400).json({ error: 'Invalid request: cwd and args required' });
  }

  // Security: validate cwd is within the meta-gothic-framework
  const resolvedPath = path.resolve(cwd);
  const basePath = path.resolve(path.join(__dirname, '../../..'));
  
  if (!resolvedPath.startsWith(basePath)) {
    return res.status(403).json({ error: 'Access denied: path outside of meta-gothic-framework' });
  }

  try {
    const output = await execGitCommand(resolvedPath, args);
    res.text(output);
  } catch (error) {
    res.status(500).text(error.message);
  }
});

// Scan all metaGOTHIC packages for changes
app.get('/api/git/scan-all', async (req, res) => {
  const packagesDir = path.join(__dirname, '../../packages');
  const packages = [
    'claude-client',
    'prompt-toolkit', 
    'sdlc-config',
    'sdlc-engine',
    'sdlc-content',
    'graphql-toolkit',
    'context-aggregator',
    'ui-components'
  ];

  try {
    const results = await Promise.all(
      packages.map(async (pkg) => {
        const pkgPath = path.join(packagesDir, pkg);
        
        try {
          // Get status
          const statusOutput = await execGitCommand(pkgPath, ['status', '--porcelain=v1']);
          const files = statusOutput
            .split('\n')
            .filter(line => line.trim())
            .map(line => {
              const status = line.substring(0, 2);
              const file = line.substring(3);
              return {
                file,
                status: status.trim() || '??',
                staged: status[0] !== ' ' && status[0] !== '?'
              };
            });

          // Get current branch
          const branch = await execGitCommand(pkgPath, ['branch', '--show-current']);

          return {
            package: pkg,
            path: pkgPath,
            branch: branch.trim(),
            changes: files,
            hasChanges: files.length > 0
          };
        } catch (error) {
          console.error(`Error scanning ${pkg}:`, error);
          return {
            package: pkg,
            path: pkgPath,
            error: error.message,
            hasChanges: false
          };
        }
      })
    );

    res.json(results.filter(r => r.hasChanges || r.error));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/git/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Git server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/git/exec - Execute git command');
  console.log('  GET  /api/git/scan-all - Scan all packages');
  console.log('  GET  /api/git/health - Health check');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down git server...');
  process.exit(0);
});