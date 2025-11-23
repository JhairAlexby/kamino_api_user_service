import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from '../config/sequelize.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class MigrationRunner {
  constructor() {
    this.sequelize = sequelize;
    this.migrationsDir = path.join(__dirname, 'migrations');
  }

  async getExecutedMigrations() {
    const [rows] = await this.sequelize.query('SELECT migration_name, status FROM migrations');
    return new Map(rows.map(r => [r.migration_name, r.status]));
  }

  async registerMigration(name, status) {
    await this.sequelize.query(
      'INSERT INTO migrations (migration_name, status) VALUES ($1, $2) ON CONFLICT (migration_name) DO UPDATE SET status = EXCLUDED.status, executed_at = CURRENT_TIMESTAMP',
      { bind: [name, status] }
    );
  }

  async runPending() {
    try {
      await fs.mkdir(this.migrationsDir, { recursive: true });
      const files = (await fs.readdir(this.migrationsDir))
        .filter(f => f.endsWith('.sql'))
        .sort();

      const executed = await this.getExecutedMigrations();

      for (const file of files) {
        const fullPath = path.join(this.migrationsDir, file);
        const sql = await fs.readFile(fullPath, 'utf8');
        const migrationName = this.extractName(file);
        if (executed.has(migrationName) && executed.get(migrationName) === 'success') continue;

        try {
          const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);
          for (const stmt of statements) {
            try {
              await this.sequelize.query(stmt);
            } catch (e) {
              const msg = String(e?.message || '');
              const code = e?.parent?.code;
              if (code === '42710' || msg.includes('already exists')) {
                continue;
              }
              throw e;
            }
          }
          await this.registerMigration(migrationName, 'success');
          console.log(`Migration executed: ${migrationName}`);
        } catch (err) {
          console.error(`Migration failed: ${migrationName}`, err);
          await this.registerMigration(migrationName, 'failed');
          throw err;
        }
      }
    } catch (err) {
      console.error('Migration runner error:', err);
      throw err;
    }
  }

  extractName(fileName) {
    const base = path.basename(fileName, '.sql');
    const parts = base.split('_');
    if (parts.length >= 2) {
      return parts.slice(1).join('_');
    }
    return base;
  }
}
