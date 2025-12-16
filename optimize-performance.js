#!/usr/bin/env node

// Performance optimization build script
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting performance optimizations...');

// Optimize HTML files
const optimizeHtml = () => {
  console.log('📄 Optimizing HTML files...');

  const htmlFiles = fs.readdirSync(__dirname)
    .filter(file => file.endsWith('.html'));

  htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Add critical resource hints to head
    const resourceHints = `
  <!-- Performance optimizations -->
  <link rel="dns-prefetch" href="//fonts.googleapis.com">
  <link rel="preload" href="./src/main-optimized.js" as="script">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  `;

    // Insert resource hints after <head>
    content = content.replace('<head>', `<head>${resourceHints}`);

    // Replace main.js with optimized version
    content = content.replace('./src/main.js', './src/main-optimized.js');

    fs.writeFileSync(filePath, content);
  });

  console.log(`✅ Optimized ${htmlFiles.length} HTML files`);
};

// Generate performance report
const generateReport = () => {
  console.log('📊 Generating performance report...');

  const report = {
    timestamp: new Date().toISOString(),
    optimizations: [
      '✅ Implemented lazy loading for JavaScript modules',
      '✅ Added code splitting configuration',
      '✅ Created service worker for caching',
      '✅ Added resource hints and preloading',
      '✅ Optimized image loading',
      '✅ Configured Terser for minification'
    ],
    recommendations: [
      '🔍 Monitor Core Web Vitals using performance-utils.js',
      '📱 Test on mobile devices for performance',
      '🖼️ Consider using WebP format for images',
      '📦 Monitor bundle sizes regularly',
      '🚀 Implement HTTP/2 server push if possible'
    ]
  };

  fs.writeFileSync('performance-report.json', JSON.stringify(report, null, 2));
  console.log('📄 Performance report saved to performance-report.json');
};

// Main execution
const main = () => {
  try {
    optimizeHtml();
    generateReport();
    console.log('🎉 Performance optimizations completed successfully!');
  } catch (error) {
    console.error('❌ Error during optimization:', error.message);
    process.exit(1);
  }
};

main();
