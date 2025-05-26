#!/usr/bin/env node

/**
 * Add tier configuration to all package.json files
 * Tiers determine update grouping strategy in pipeline mode
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Package tier definitions
const PACKAGE_TIERS = {
  core: {
    packages: ['di-framework', 'logger'],
    description: 'Core infrastructure - immediate updates'
  },
  shared: {
    packages: ['cache', 'file-system', 'event-system', 'test-mocks', 'test-helpers'],
    description: 'Shared utilities - 5 minute batch updates'
  },
  app: {
    packages: ['report-templates', 'markdown-compiler', 'report-components', 'prompts'],
    description: 'Application layer - 15 minute coordinated updates'
  }
};

// Get tier for a package
function getTierForPackage(packageName) {
  for (const [tier, config] of Object.entries(PACKAGE_TIERS)) {
    if (config.packages.includes(packageName)) {
      return tier;
    }
  }
  return 'shared'; // Default tier
}

// Update package.json with tier
function updatePackageJson(packagePath, packageName) {
  const packageJsonPath = path.join(packagePath, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.log(`  ⚠️  No package.json found in ${packagePath}`);
    return false;
  }
  
  try {
    // Read package.json
    const content = fs.readFileSync(packageJsonPath, 'utf8');
    const pkg = JSON.parse(content);
    
    // Add tier configuration
    const tier = getTierForPackage(packageName);
    pkg.tier = tier;
    
    // Also add unified dependency config
    pkg.unifiedDependencies = {
      tier: tier,
      strategy: tier === 'core' ? 'immediate' : tier === 'shared' ? 'batch-5min' : 'coordinate-15min',
      localDevelopment: true
    };
    
    // Write back with proper formatting
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
    
    console.log(`  ✓ Added tier '${tier}' to ${packageName}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Error updating ${packageName}: ${error.message}`);
    return false;
  }
}

// Main execution
console.log('🏷️  Adding Tier Configuration to Packages');
console.log('=======================================');
console.log('');

// Show tier definitions
console.log('📊 Tier Definitions:');
for (const [tier, config] of Object.entries(PACKAGE_TIERS)) {
  console.log(`  ${tier}: ${config.description}`);
  console.log(`    → ${config.packages.join(', ')}`);
}
console.log('');

// Process all packages
console.log('📦 Updating package.json files...');
const packagesDir = path.join(path.dirname(__dirname), 'packages');
const packages = fs.readdirSync(packagesDir).filter(dir => {
  const fullPath = path.join(packagesDir, dir);
  return fs.statSync(fullPath).isDirectory();
});

let successCount = 0;
packages.forEach(packageName => {
  const packagePath = path.join(packagesDir, packageName);
  if (updatePackageJson(packagePath, packageName)) {
    successCount++;
  }
});

console.log('');
console.log(`✅ Updated ${successCount}/${packages.length} packages with tier configuration`);
console.log('');
console.log('📋 Next Steps:');
console.log('1. Review the tier assignments');
console.log('2. Commit changes to all packages');
console.log('3. The tier configuration will be used in pipeline mode for update grouping');