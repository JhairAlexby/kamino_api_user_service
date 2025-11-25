#!/usr/bin/env node

import dotenv from 'dotenv';
import DatabaseInitializer from '../DatabaseInitializer.js';

// Load environment variables
dotenv.config();

async function migrateDatabase() {
    const dbInitializer = new DatabaseInitializer();
    
    try {
        console.log('🔄 Starting database migration...');
        
        // Test connection first
        await dbInitializer.testConnection();
        
        // Sync models with alter: true to update existing tables
        console.log('📊 Synchronizing database models...');
        await dbInitializer.syncModels();

        // Run initialization script to apply ALTERs and auxiliary structures
        console.log('📜 Applying schema changes for users and migrations log...');
        await dbInitializer.sequelize.query(`
          ALTER TABLE IF EXISTS users
            ADD COLUMN IF NOT EXISTS profile_photo_url VARCHAR(500),
            ADD COLUMN IF NOT EXISTS gender VARCHAR(20) CHECK (gender IN ('MALE','FEMALE','NON_BINARY','OTHER'));
        `);
        await dbInitializer.sequelize.query(`
          CREATE INDEX IF NOT EXISTS idx_users_gender ON users(gender);
        `);
        await dbInitializer.sequelize.query(`
          CREATE TABLE IF NOT EXISTS migrations_log (
            id SERIAL PRIMARY KEY,
            name VARCHAR(150) UNIQUE NOT NULL,
            description TEXT,
            applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);

        // Register this migration in migrations_log
        const name = '2025-11-24_add_user_profile_photo_and_gender';
        const description = 'Add columns profile_photo_url and gender to users; create migrations_log table';
        try {
            await dbInitializer.sequelize.query(
                'INSERT INTO migrations_log (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
                { bind: [name, description] }
            );
            console.log(`📝 Migration registered: ${name}`);
        } catch (e) {
            console.warn('⚠️ Failed to register migration log:', e.message);
        }
        
        console.log('✅ Database migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database migration failed:', error.message);
        process.exit(1);
    } finally {
        await dbInitializer.close();
    }
}

// Run the migration
migrateDatabase();
