-- Add column for profile pictures with size constraint (<= 5MB)
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture BYTEA;
ALTER TABLE users ADD CONSTRAINT chk_users_profile_picture_size CHECK (COALESCE(octet_length(profile_picture), 0) <= 5242880);
