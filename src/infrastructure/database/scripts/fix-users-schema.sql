-- Ensure extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users: ensure UUID PK with default and timestamp defaults
ALTER TABLE users ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Drop duplicate ID columns if exist and no data depends
ALTER TABLE refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_user_id_fkey;
ALTER TABLE users DROP COLUMN IF EXISTS id_uuid;
ALTER TABLE users DROP COLUMN IF EXISTS id_int;

-- Refresh tokens: standardize to UUID user_id and FK to users(id)
ALTER TABLE refresh_tokens DROP COLUMN IF EXISTS user_id_int;
ALTER TABLE refresh_tokens DROP COLUMN IF EXISTS user_id_uuid;
ALTER TABLE refresh_tokens ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
ALTER TABLE refresh_tokens ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
