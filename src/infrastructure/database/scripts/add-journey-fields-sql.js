import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function runMigration() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'kamino_user_service',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Conectado a la base de datos');

    // Verificar qué columnas existen
    const checkColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    
    const existingColumns = checkColumns.rows.map(row => row.column_name);
    console.log('Columnas actuales:', existingColumns);

    // Agregar age si no existe
    if (!existingColumns.includes('age')) {
      console.log('Agregando columna age...');
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN age INTEGER
      `);
      console.log('Columna age agregada');
    } else {
      console.log('Columna age ya existe');
    }

    // Agregar favorite_places si no existe
    if (!existingColumns.includes('favorite_places')) {
      console.log('Agregando columna favorite_places...');
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN favorite_places JSONB DEFAULT '[]'::jsonb NOT NULL
      `);
      console.log('Columna favorite_places agregada');
    } else {
      console.log('Columna favorite_places ya existe');
    }

    // Agregar visited_places si no existe
    if (!existingColumns.includes('visited_places')) {
      console.log('Agregando columna visited_places...');
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN visited_places JSONB DEFAULT '[]'::jsonb NOT NULL
      `);
      console.log('Columna visited_places agregada');
    } else {
      console.log('Columna visited_places ya existe');
    }

    console.log('Migración completada exitosamente');
    
  } catch (error) {
    console.error('Error en migración:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  } finally {
    await client.end();
    process.exit(0);
  }
}

runMigration();
