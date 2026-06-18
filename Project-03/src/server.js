// ============================================================
//  Server entry point.
// ============================================================
import app from './app.js';
import pool from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

// Verify the DB connection on boot, then start the server.
async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Connected to PostgreSQL');

    app.listen(PORT, () => {
      console.log(`🚀 Book Library API running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Could not connect to the database:', err.message);
    console.error('   Check your .env DATABASE_URL and that PostgreSQL is running.');
    process.exit(1);
  }
}

start();
