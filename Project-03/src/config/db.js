// ============================================================
//  Pillar 2: The Bridge — Native Driver (pg) connection pool.
//  A pool reuses connections instead of opening a new one per
//  request, which is faster and safer under load.
// ============================================================
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Prefer a single DATABASE_URL; fall back to individual PG* vars.
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT) || 5432,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    });

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

/**
 * Thin wrapper around pool.query.
 * IMPORTANT: always pass user input through `params` (the second
 * argument) so pg sends it as a *parameterized query*. The values
 * are treated as data, never as executable SQL — this is what
 * neutralizes SQL injection (Pillar 4: The Shield).
 *
 * @param {string} text  - SQL with $1, $2 ... placeholders
 * @param {Array}  params - values for the placeholders
 */
export const query = (text, params) => pool.query(text, params);

export default pool;
