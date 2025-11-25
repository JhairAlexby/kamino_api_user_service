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
    const res = await pool.query(
      `SELECT column_name, data_type, column_default, is_nullable
       FROM information_schema.columns
       WHERE table_name='users'
       ORDER BY ordinal_position`
    );
    console.table(res.rows);
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();
