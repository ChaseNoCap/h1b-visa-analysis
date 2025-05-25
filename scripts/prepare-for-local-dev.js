#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packagesDir = path.join(__dirname, '..', 'packages');
const packages = ['di-framework', 'test-mocks', 'test-helpers', 'file-system', 'cache', 'report-templates', 'event-system', 'prompts'];

console.log('Preparing packages for local development...\n');

// Map of scoped names to local paths
const localPaths = {
  '@chasenocap/di-framework': 'file:../di-framework',
  '@chasenocap/test-mocks': 'file:../test-mocks',
  '@chasenocap/test-helpers': 'file:../test-helpers',
  '@chasenocap/file-system': 'file:../file-system',
  '@chasenocap/cache': 'file:../cache',
  '@chasenocap/report-templates': 'file:../report-templates',
  '@chasenocap/event-system': 'file:../event-system',
  '@chasenocap/prompts': 'file:../prompts'
};

// Update each package
packages.forEach(pkg => {
  const pkgPath = path.join(packagesDir, pkg, 'package.json');
  if (fs.existsSync(pkgPath)) {
    let pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    let modified = false;
    
    // Update dependencies
    ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
      if (pkgJson[depType]) {
        Object.keys(pkgJson[depType]).forEach(dep => {
          if (localPaths[dep]) {
            const oldValue = pkgJson[depType][dep];
            const newValue = localPaths[dep];
            
            if (oldValue !== newValue) {
              console.log(`  ${pkg}: ${depType}.${dep}: ${oldValue} → ${newValue}`);
              pkgJson[depType][dep] = newValue;
              modified = true;
            }
          }
        });
      }
    });
    
    if (modified) {
      fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2) + '\n');
      console.log(`✓ Updated ${pkg}/package.json\n`);
    }
  }
});

console.log('Done! Ready for local development.');
console.log('Run "npm install" to install dependencies.');