#!/usr/bin/env node

/**
 * Data preparation script for TV shows visualization
 * Runs both data splitting and metadata generation
 */

import { execSync } from 'child_process';

console.log('🚀 Starting data preparation...\n');

try {
  console.log('📊 Step 1: Splitting data files...');
  execSync('node scripts/split-data.js', { stdio: 'inherit' });

  console.log('\n📋 Step 2: Generating metadata...');
  execSync('node scripts/generate-metadata.js', { stdio: 'inherit' });

  console.log('\n✅ Data preparation complete!');
  console.log('📦 Generated files:');
  console.log('   - public/data/imdb_top_tv_shows_base.csv');
  console.log('   - public/data/imdb_top_tv_shows_details.csv');
  console.log('   - public/data/metadata.json');
} catch (error) {
  console.error('\n❌ Error during data preparation:', error.message);
  process.exit(1);
}
