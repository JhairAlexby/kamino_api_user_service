import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ quiet: true });

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const email = `veriftest_${Date.now()}@example.com`;
    const res = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name, role, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [email, 'x', 'Verify', 'Test', 'USER', true]
    );
    console.log('Inserted user id:', res.rows[0].id);
  } catch (e) {
    console.error('Insert failed:', e);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();
