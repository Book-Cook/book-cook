#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Automated bundle analysis script
 * Analyzes webpack stats and reports bundle size issues
 */

const BUNDLE_THRESHOLDS = {
  maxPageSize: 400 * 1024, // 400KB max per page
  maxTotalSize: 2 * 1024 * 1024, // 2MB max total
  maxChunkSize: 100 * 1024, // 100KB max per chunk
};

function analyzeBundleStats() {
  const statsPath = path.join(__dirname, '../.next/analyze/webpack-stats.json');
  
  if (!fs.existsSync(statsPath)) {
    console.error('❌ webpack-stats.json not found. Run `npm run build` first.');
    process.exit(1);
  }

  const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
  const assets = stats.assets || [];
  
  console.log('📊 Bundle Analysis Report\n');
  
  // Page-level analysis
  const pages = {};
  assets.forEach(asset => {
    if (asset.name.includes('pages/')) {
      const pageName = asset.name.match(/pages\/(.+?)(-|\.)/)?.[1] || 'unknown';
      if (!pages[pageName]) pages[pageName] = { size: 0, files: [] };
      pages[pageName].size += asset.size;
      pages[pageName].files.push(asset.name);
    }
  });
  
  // Report page sizes
  console.log('📄 Page Bundle Sizes:');
  Object.entries(pages).forEach(([page, data]) => {
    const sizeKB = (data.size / 1024).toFixed(1);
    const status = data.size > BUNDLE_THRESHOLDS.maxPageSize ? '❌' : '✅';
    console.log(`  ${status} ${page}: ${sizeKB}KB`);
    
    if (data.size > BUNDLE_THRESHOLDS.maxPageSize) {
      console.log(`    ⚠️  Exceeds ${BUNDLE_THRESHOLDS.maxPageSize / 1024}KB threshold`);
    }
  });
  
  // Large chunks analysis
  console.log('\n🧩 Large Chunks (>50KB):');
  const largeChunks = assets
    .filter(asset => asset.size > 50 * 1024 && asset.name.includes('chunks/'))
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);
    
  largeChunks.forEach(chunk => {
    const sizeKB = (chunk.size / 1024).toFixed(1);
    const status = chunk.size > BUNDLE_THRESHOLDS.maxChunkSize ? '❌' : '⚠️';
    console.log(`  ${status} ${chunk.name}: ${sizeKB}KB`);
  });
  
  // Dependencies analysis
  if (stats.modules) {
    console.log('\n📦 Heavy Dependencies:');
    const modulesBySize = stats.modules
      .filter(module => module.size > 20 * 1024)
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);
      
    modulesBySize.forEach(module => {
      const sizeKB = (module.size / 1024).toFixed(1);
      const name = module.name?.split('node_modules/')?.[1]?.split('/')?.[0] || module.name;
      console.log(`  📦 ${name}: ${sizeKB}KB`);
    });
  }
  
  // Summary
  const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0);
  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
  
  console.log(`\n📋 Summary:`);
  console.log(`  Total bundle size: ${totalSizeMB}MB`);
  console.log(`  Number of assets: ${assets.length}`);
  console.log(`  Pages analyzed: ${Object.keys(pages).length}`);
  
  // Exit with error if thresholds exceeded
  const hasLargePages = Object.values(pages).some(page => page.size > BUNDLE_THRESHOLDS.maxPageSize);
  if (hasLargePages || totalSize > BUNDLE_THRESHOLDS.maxTotalSize) {
    console.log('\n❌ Bundle size thresholds exceeded!');
    process.exit(1);
  }
  
  console.log('\n✅ All bundle size checks passed!');
}

if (require.main === module) {
  analyzeBundleStats();
}

module.exports = { analyzeBundleStats };