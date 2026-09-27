import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

console.log('=== Step 1: Downloading self-hosted fonts ===');
execSync('node scripts/download-fonts.mjs', { stdio: 'inherit' });

console.log('\n=== Step 2: Cleaning legacy SPA files ===');
execSync('node scripts/clean-legacy.mjs', { stdio: 'inherit' });

console.log('\n=== Step 3: Installing dependencies ===');
execSync('npm install', { stdio: 'inherit' });

console.log('\n=== Step 4: Running Astro static build ===');
execSync('npm run build', { stdio: 'inherit' });

console.log('\n=== Step 5: Running full verification (all 5 tiers) ===');
execSync('node tests/verify-e2e.mjs', { stdio: 'inherit' });

console.log('\n=== Build and verification complete! ===');
