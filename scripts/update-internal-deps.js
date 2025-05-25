#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packagesDir = path.join(__dirname, '..', 'packages');
const packages = ['di-framework', 'test-mocks', 'test-helpers', 'file-system', 'cache', 'report-templates', 'event-system', 'prompts'];
const versions = {};

// Mode: 'workspace' for development, 'version' for publishing
const mode = process.argv[2] || 'version';

console.log(`Updating internal dependencies in ${mode} mode...`);

// Collect all package versions
packages.forEach(pkg => {
  const pkgPath = path.join(packagesDir, pkg, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    versions[pkgJson.name] = pkgJson.version;
    console.log(`Found ${pkgJson.name}@${pkgJson.version}`);
  }
});

// Update dependencies in each package
packages.forEach(pkg => {
  const pkgPath = path.join(packagesDir, pkg, 'package.json');
  if (fs.existsSync(pkgPath)) {
    let pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    let modified = false;
    
    // Update dependencies
    ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
      if (pkgJson[depType]) {
        Object.keys(pkgJson[depType]).forEach(dep => {
          // Check if it's an internal dependency
          if (versions[dep]) {
            const oldValue = pkgJson[depType][dep];
            const newValue = mode === 'workspace' ? 'workspace:*' : `^${versions[dep]}`;
            
            if (oldValue !== newValue) {
              console.log(`  ${pkg}: ${depType}.${dep}: ${oldValue} → ${newValue}`);
              pkgJson[depType][dep] = newValue;
              modified = true;
            }
          }
          
          // Also check for file: references
          if (typeof pkgJson[depType][dep] === 'string' && pkgJson[depType][dep].startsWith('file:')) {
            const referencedPkg = pkgJson[depType][dep].replace('file:../', '').replace('file:./', '');
            const scopedName = `@chasenocap/${referencedPkg}`;
            
            if (versions[scopedName]) {
              console.log(`  ${pkg}: Converting ${depType}.${dep} to ${scopedName}`);
              delete pkgJson[depType][dep];
              pkgJson[depType][scopedName] = mode === 'workspace' ? 'workspace:*' : `^${versions[scopedName]}`;
              modified = true;
            }
          }
        });
      }
    });
    
    if (modified) {
      fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2) + '\n');
      console.log(`✓ Updated ${pkg}/package.json`);
    }
  }
});

// Update main package.json
const mainPkgPath = path.join(__dirname, '..', 'package.json');
const mainPkg = JSON.parse(fs.readFileSync(mainPkgPath, 'utf8'));
let mainModified = false;

['dependencies', 'devDependencies'].forEach(depType => {
  if (mainPkg[depType]) {
    Object.keys(mainPkg[depType]).forEach(dep => {
      if (typeof mainPkg[depType][dep] === 'string' && mainPkg[depType][dep].startsWith('file:')) {
        const pkgName = dep;
        const scopedName = pkgName.startsWith('@') ? pkgName : `@chasenocap/${pkgName}`;
        
        if (versions[scopedName]) {
          console.log(`  Main: Converting ${depType}.${dep} to ${scopedName}`);
          delete mainPkg[depType][dep];
          mainPkg[depType][scopedName] = mode === 'workspace' ? 'workspace:*' : `^${versions[scopedName]}`;
          mainModified = true;
        }
      }
    });
  }
});

if (mainModified) {
  fs.writeFileSync(mainPkgPath, JSON.stringify(mainPkg, null, 2) + '\n');
  console.log('✓ Updated main package.json');
}

console.log('\nDone! Run "npm install" to update node_modules.');