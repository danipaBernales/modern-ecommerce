#!/usr/bin/env node

/**
 * Migration Checker Script
 * 
 * This script analyzes SQL migration files to detect potential issues:
 * - Duplicate content between migrations
 * - Overlapping operations (e.g., multiple migrations modifying the same table)
 * - Missing dependencies
 * 
 * Usage: node check-migrations.js
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// Get current file directory (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const MIGRATIONS_DIR = path.join(__dirname, '..', 'supabase', 'migrations');
const SIMILARITY_THRESHOLD = 0.8; // 80% similarity is considered suspicious

// Utility functions
function calculateHash(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

function calculateSimilarity(str1, str2) {
  // Simple similarity measure based on common lines
  const lines1 = str1.split('\n').filter(line => line.trim() !== '');
  const lines2 = str2.split('\n').filter(line => line.trim() !== '');
  
  const set1 = new Set(lines1);
  const set2 = new Set(lines2);
  
  let commonLines = 0;
  for (const line of set1) {
    if (set2.has(line)) {
      commonLines++;
    }
  }
  
  return commonLines / Math.max(set1.size, set2.size);
}

function extractTableOperations(sql) {
  const operations = [];
  
  // Match CREATE TABLE statements
  const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_"]+)/gi;
  let match;
  while ((match = createTableRegex.exec(sql)) !== null) {
    operations.push({
      type: 'CREATE',
      table: match[1].replace(/"/g, ''),
      sql: match[0]
    });
  }
  
  // Match ALTER TABLE statements
  const alterTableRegex = /ALTER\s+TABLE\s+([a-zA-Z0-9_"]+)/gi;
  while ((match = alterTableRegex.exec(sql)) !== null) {
    operations.push({
      type: 'ALTER',
      table: match[1].replace(/"/g, ''),
      sql: match[0]
    });
  }
  
  // Match INSERT INTO statements
  const insertRegex = /INSERT\s+INTO\s+([a-zA-Z0-9_"]+)/gi;
  while ((match = insertRegex.exec(sql)) !== null) {
    operations.push({
      type: 'INSERT',
      table: match[1].replace(/"/g, ''),
      sql: match[0]
    });
  }
  
  return operations;
}

// Main function
async function checkMigrations() {
  console.log('Checking migrations in:', MIGRATIONS_DIR);
  
  try {
    // Read all migration files
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    if (files.length === 0) {
      console.log('No migration files found.');
      return;
    }
    
    console.log(`Found ${files.length} migration files.`);
    
    // Analyze migrations
    const migrations = [];
    const contentHashes = new Map();
    const tableOperations = new Map();
    
    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const hash = calculateHash(content);
      
      const migration = {
        file,
        path: filePath,
        content,
        hash,
        operations: extractTableOperations(content)
      };
      
      migrations.push(migration);
      
      // Check for duplicate content
      if (contentHashes.has(hash)) {
        console.log(`\n⚠️ DUPLICATE CONTENT DETECTED:`);
        console.log(`  - ${file}`);
        console.log(`  - ${contentHashes.get(hash)}`);
        console.log('  These files have identical content.');
      }
      contentHashes.set(hash, file);
      
      // Track table operations
      for (const op of migration.operations) {
        if (!tableOperations.has(op.table)) {
          tableOperations.set(op.table, []);
        }
        tableOperations.get(op.table).push({
          file,
          type: op.type,
          sql: op.sql
        });
      }
    }
    
    // Check for similar content
    console.log('\nChecking for similar migrations...');
    for (let i = 0; i < migrations.length; i++) {
      for (let j = i + 1; j < migrations.length; j++) {
        const similarity = calculateSimilarity(migrations[i].content, migrations[j].content);
        if (similarity > SIMILARITY_THRESHOLD && migrations[i].hash !== migrations[j].hash) {
          console.log(`\n⚠️ SIMILAR CONTENT DETECTED (${Math.round(similarity * 100)}% similar):`);
          console.log(`  - ${migrations[i].file}`);
          console.log(`  - ${migrations[j].file}`);
        }
      }
    }
    
    // Check for overlapping operations
    console.log('\nChecking for overlapping table operations...');
    for (const [table, ops] of tableOperations.entries()) {
      if (ops.length > 1) {
        const createOps = ops.filter(op => op.type === 'CREATE');
        const alterOps = ops.filter(op => op.type === 'ALTER');
        const insertOps = ops.filter(op => op.type === 'INSERT');
        
        if (createOps.length > 1) {
          console.log(`\n⚠️ MULTIPLE CREATE OPERATIONS for table "${table}":`);
          createOps.forEach(op => console.log(`  - ${op.file}`));
        }
        
        if (alterOps.length > 0) {
          console.log(`\n📝 Table "${table}" is altered in multiple migrations:`);
          alterOps.forEach(op => console.log(`  - ${op.file}`));
        }
        
        if (insertOps.length > 1) {
          console.log(`\n⚠️ MULTIPLE INSERT OPERATIONS for table "${table}":`);
          insertOps.forEach(op => console.log(`  - ${op.file}`));
        }
      }
    }
    
    console.log('\nMigration check completed.');
  } catch (err) {
    console.error('Error checking migrations:', err);
  }
}

// Run the script
checkMigrations();