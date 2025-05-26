#!/usr/bin/env node

/**
 * Smart Dependency Manager - Unified Dependency Strategy Implementation
 * 
 * Automatically detects environment and sets up appropriate dependency mode:
 * - Local Development: Uses npm link for instant updates
 * - Pipeline/CI: Uses published packages from registry
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mode detection logic
const detectMode = () => {
  const isCI = process.env.CI === 'true';
  const hasTag = process.env.GITHUB_REF?.startsWith('refs/tags/');
  const isLocalDev = !isCI && !hasTag;
  const forceRegistry = process.env.FORCE_REGISTRY === 'true';
  
  return {
    mode: isLocalDev && !forceRegistry ? 'local' : 'pipeline',
    useLinks: isLocalDev && !forceRegistry,
    useRegistry: isCI || forceRegistry || hasTag,
    shouldPublish: hasTag,
    environment: {
      isCI,
      hasTag,
      isLocalDev,
      forceRegistry
    }
  };
};

// Execute command with error handling
const exec = (command, options = {}) => {
  try {
    return execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
};

// Get all workspace packages
const getWorkspacePackages = () => {
  const packagesDir = path.join(path.dirname(__dirname), 'packages');
  const packages = [];
  
  // Read all directories in packages/
  const dirs = fs.readdirSync(packagesDir).filter(dir => {
    const fullPath = path.join(packagesDir, dir);
    return fs.statSync(fullPath).isDirectory() && 
           fs.existsSync(path.join(fullPath, 'package.json'));
  });
  
  // Parse package.json for each package
  dirs.forEach(dir => {
    const packagePath = path.join(packagesDir, dir);
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(packagePath, 'package.json'), 'utf8')
    );
    
    // Find local dependencies
    const localDeps = [];
    const allDeps = {
      ...packageJson.dependencies || {},
      ...packageJson.devDependencies || {},
      ...packageJson.peerDependencies || {}
    };
    
    Object.keys(allDeps).forEach(dep => {
      if (dep.startsWith('@chasenocap/')) {
        localDeps.push(dep);
      }
    });
    
    packages.push({
      name: packageJson.name,
      path: packagePath,
      localDependencies: localDeps,
      tier: packageJson.tier || 'shared' // Default tier
    });
  });
  
  return packages;
};

class SmartDependencyManager {
  constructor() {
    this.config = detectMode();
  }
  
  async setup() {
    console.log('🔍 Smart Dependency Manager - Detecting environment...');
    console.log(`📍 Mode: ${this.config.mode.toUpperCase()}`);
    console.log(`🔗 Use Links: ${this.config.useLinks}`);
    console.log(`📦 Use Registry: ${this.config.useRegistry}`);
    console.log(`🚀 Should Publish: ${this.config.shouldPublish}`);
    console.log('');
    
    if (this.config.useLinks) {
      await this.setupLocalMode();
    } else {
      await this.setupPipelineMode();
    }
  }
  
  async setupLocalMode() {
    console.log('🚀 Local Development Mode - Setting up npm links...');
    console.log('✨ All changes will be instantly reflected across packages');
    console.log('');
    
    const packages = getWorkspacePackages();
    
    // First, ensure dependencies are installed in each package
    console.log('📦 Installing dependencies in packages...');
    for (const pkg of packages) {
      if (fs.existsSync(path.join(pkg.path, 'package-lock.json'))) {
        console.log(`  → Installing dependencies for ${pkg.name}`);
        try {
          exec(`cd ${pkg.path} && npm ci`, { stdio: 'pipe' });
        } catch (e) {
          // Fallback to npm install if ci fails
          exec(`cd ${pkg.path} && npm install`, { stdio: 'pipe' });
        }
      }
    }
    console.log('');
    
    // Then, create all links
    console.log('📌 Creating package links...');
    for (const pkg of packages) {
      console.log(`  → Linking ${pkg.name}`);
      exec(`cd ${pkg.path} && npm link`, { stdio: 'pipe' });
    }
    console.log('');
    
    // Then, link dependencies
    console.log('🔗 Linking package dependencies...');
    for (const pkg of packages) {
      if (pkg.localDependencies.length > 0) {
        console.log(`  → ${pkg.name} links to:`);
        for (const dep of pkg.localDependencies) {
          console.log(`    • ${dep}`);
          exec(`cd ${pkg.path} && npm link ${dep}`, { stdio: 'pipe' });
        }
      }
    }
    console.log('');
    
    // Finally, link in the root project
    console.log('🏠 Linking packages in root project...');
    for (const pkg of packages) {
      exec(`npm link ${pkg.name}`, { stdio: 'pipe' });
    }
    
    console.log('');
    console.log('✅ All packages linked for instant updates!');
    console.log('⚡ Changes in any package are immediately available everywhere');
    
    // Show link status
    this.showLinkStatus(packages);
  }
  
  async setupPipelineMode() {
    console.log('✅ Pipeline Mode - Using published versions');
    console.log('📦 Installing from npm registry...');
    console.log('');
    
    // Install from registry
    console.log('Running npm ci...');
    exec('npm ci');
    
    // Update to specific version if triggered by repository dispatch
    if (process.env.UPDATE_PACKAGE && process.env.UPDATE_VERSION) {
      const packageName = process.env.UPDATE_PACKAGE;
      const version = process.env.UPDATE_VERSION;
      
      console.log('');
      console.log(`📦 Updating ${packageName} to ${version}...`);
      exec(`npm install ${packageName}@${version}`);
      
      // Update git submodule to matching tag
      const packageShortName = packageName.replace('@chasenocap/', '');
      const submodulePath = `packages/${packageShortName}`;
      
      if (fs.existsSync(submodulePath)) {
        console.log(`📌 Updating git submodule ${submodulePath} to tag v${version}...`);
        exec(`cd ${submodulePath} && git fetch --tags && git checkout v${version}`);
      }
    }
    
    console.log('');
    console.log('✅ Pipeline setup complete!');
  }
  
  showLinkStatus(packages) {
    console.log('');
    console.log('📊 Package Link Status:');
    console.log('────────────────────────');
    
    packages.forEach(pkg => {
      const linkPath = path.join(path.dirname(__dirname), 'node_modules', pkg.name);
      const isLinked = fs.existsSync(linkPath) && fs.lstatSync(linkPath).isSymbolicLink();
      const status = isLinked ? '✓ linked' : '✗ not linked';
      const emoji = isLinked ? '🔗' : '📦';
      
      console.log(`${emoji} ${pkg.name.padEnd(35)} ${status}`);
    });
    
    console.log('────────────────────────');
  }
  
  // Check if links are properly set up
  async checkLinks() {
    const packages = getWorkspacePackages();
    let allLinked = true;
    
    packages.forEach(pkg => {
      const linkPath = path.join(path.dirname(__dirname), 'node_modules', pkg.name);
      if (!fs.existsSync(linkPath) || !fs.lstatSync(linkPath).isSymbolicLink()) {
        allLinked = false;
      }
    });
    
    return allLinked;
  }
}

// CLI commands
const commands = {
  setup: async () => {
    const manager = new SmartDependencyManager();
    await manager.setup();
  },
  
  status: async () => {
    const manager = new SmartDependencyManager();
    const packages = getWorkspacePackages();
    manager.showLinkStatus(packages);
  },
  
  clean: async () => {
    console.log('🧹 Cleaning npm links...');
    const packages = getWorkspacePackages();
    
    // Unlink from root
    for (const pkg of packages) {
      try {
        exec(`npm unlink ${pkg.name}`, { stdio: 'pipe' });
      } catch (e) {
        // Ignore errors - link might not exist
      }
    }
    
    // Unlink packages themselves
    for (const pkg of packages) {
      try {
        exec(`cd ${pkg.path} && npm unlink`, { stdio: 'pipe' });
      } catch (e) {
        // Ignore errors
      }
    }
    
    console.log('✅ Links cleaned');
  },
  
  mode: async () => {
    const config = detectMode();
    console.log('Current mode configuration:');
    console.log(JSON.stringify(config, null, 2));
  }
};

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2] || 'setup';
  
  if (commands[command]) {
    commands[command]().catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
  } else {
    console.log('Usage: node smart-deps.js [command]');
    console.log('Commands:');
    console.log('  setup  - Set up dependencies based on detected mode (default)');
    console.log('  status - Show current link status');
    console.log('  clean  - Remove all npm links');
    console.log('  mode   - Show current mode configuration');
    process.exit(1);
  }
}

export { detectMode, getWorkspacePackages, SmartDependencyManager };