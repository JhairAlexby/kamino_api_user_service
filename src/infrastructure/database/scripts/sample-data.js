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
    const u = await pool.query('SELECT id_int, id, id_uuid, email, created_at, updated_at FROM users ORDER BY created_at DESC NULLS LAST LIMIT 5');
    const r = await pool.query('SELECT id, user_id_int, user_id, user_id_uuid, token FROM refresh_tokens ORDER BY created_at DESC NULLS LAST LIMIT 5');
    console.log('Users:', u.rows);
    console.log('RefreshTokens:', r.rows);
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();
