// ============================================================
//  One-shot DB setup: runs db/schema.sql against your database.
//  Usage:  npm run db:setup
// ============================================================
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');

async function run() {
  try {
    const sql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(sql);
    console.log('✅ Schema created and seed data inserted.');
  } catch (err) {
    console.error('❌ Failed to set up schema:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();
