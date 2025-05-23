import { generateReport } from '../packages/report-generator/index.js';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

async function build() {
  console.log('📊 Building H1B Visa Analysis...');
  
  try {
    const report = await generateReport();
    
    mkdirSync('./dist', { recursive: true });
    
    const outputPath = resolve('./dist/h1b-visa-analysis.md');
    writeFileSync(outputPath, report);
    
    console.log('✅ Analysis generated:', outputPath);
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();