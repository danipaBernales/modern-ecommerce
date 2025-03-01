#!/usr/bin/env node

/**
 * Netlify Deploy Script
 * 
 * This script helps prepare and deploy the ModernShop application to Netlify.
 * It ensures that all necessary environment variables are set and builds the project.
 * 
 * Usage: node scripts/deploy.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Configuration
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

// Check if .env file exists
function checkEnvFile() {
  const envPath = path.join(rootDir, '.env');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    console.error('Please create a .env file with the following variables:');
    requiredEnvVars.forEach(variable => {
      console.error(`  ${variable}=your_value_here`);
    });
    process.exit(1);
  }
  
  // Read .env file
  const envContent = fs.readFileSync(envPath, 'utf8');
  const missingVars = [];
  
  // Check for required variables
  requiredEnvVars.forEach(variable => {
    if (!envContent.includes(`${variable}=`)) {
      missingVars.push(variable);
    }
  });
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(variable => {
      console.error(`  ${variable}`);
    });
    process.exit(1);
  }
  
  console.log('✅ Environment variables check passed');
}

// Build the project
function buildProject() {
  console.log('🔨 Building the project...');
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: rootDir });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Deploy to Netlify
function deployToNetlify() {
  console.log('🚀 Deploying to Netlify...');
  
  try {
    // Check if netlify CLI is installed
    try {
      execSync('netlify --version', { stdio: 'pipe' });
    } catch (error) {
      console.log('📦 Installing Netlify CLI...');
      execSync('npm install -g netlify-cli', { stdio: 'inherit' });
    }
    
    // Deploy to Netlify
    console.log('🔄 Running Netlify deploy...');
    execSync('netlify deploy --prod', { stdio: 'inherit', cwd: rootDir });
    
    console.log('✅ Deployment completed successfully');
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    console.error('Please try deploying manually using the Netlify CLI or GitHub integration.');
    process.exit(1);
  }
}

// Main function
function main() {
  console.log('🛠️  ModernShop Netlify Deployment Script');
  console.log('=======================================');
  
  // Check environment variables
  checkEnvFile();
  
  // Build the project
  buildProject();
  
  // Deploy to Netlify
  deployToNetlify();
  
  console.log('=======================================');
  console.log('🎉 Deployment process completed!');
  console.log('Visit your Netlify dashboard to see your deployed site.');
}

// Run the script
main();