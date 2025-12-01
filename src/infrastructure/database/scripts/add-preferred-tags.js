import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function addPreferredTags() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'kamino_user_service',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    ssl: false
  });

  try {
    await client.connect();
    console.log('🔄 Conectado a la base de datos');

    const checkColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    
    const existingColumns = checkColumns.rows.map(row => row.column_name);
    console.log('📋 Columnas actuales:', existingColumns.join(', '));
    console.log('');

    if (!existingColumns.includes('preferred_tags')) {
      console.log('➕ Agregando columna preferred_tags...');
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN preferred_tags JSONB DEFAULT '[]'::jsonb NOT NULL
      `);
      console.log('✅ Columna preferred_tags agregada');
    } else {
      console.log('⏭️  Columna preferred_tags ya existe');
    }

    console.log('');
    console.log('✅ Migración completada exitosamente');
    
  } catch (error) {
    console.error('');
    console.error('❌ Error en migración:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    process.exit(0);
  }
}

addPreferredTags();
