import DatabaseInitializer from '../src/infrastructure/database/DatabaseInitializer.js';
import { MigrationRunner } from '../src/infrastructure/database/MigrationRunner.js';
import { pool } from '../src/infrastructure/config/database.config.js';

describe('Migraciones', () => {
  beforeAll(async () => {
    const db = new DatabaseInitializer();
    await db.initialize();
  });

  test('Registra la migración add_profile_picture_to_users', async () => {
    const runner = new MigrationRunner();
    await runner.runPending();
    const res = await pool.query('SELECT * FROM migrations WHERE migration_name = $1', ['add_profile_picture_to_users']);
    expect(res.rows.length).toBe(1);
    expect(res.rows[0].status).toBe('success');
  });
});

