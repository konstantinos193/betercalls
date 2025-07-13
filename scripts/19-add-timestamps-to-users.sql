-- Add missing timestamp columns to users table
-- This migration adds created_at and updated_at columns that are referenced in the type definitions

-- Add created_at column with default value
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add updated_at column with default value
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update existing records to have created_at and updated_at timestamps
UPDATE users 
SET 
    created_at = NOW(),
    updated_at = NOW()
WHERE created_at IS NULL OR updated_at IS NULL;

-- Verify the changes
SELECT 
    'Users table updated with timestamps' as status,
    COUNT(*) as total_users,
    COUNT(CASE WHEN created_at IS NOT NULL THEN 1 END) as users_with_created_at,
    COUNT(CASE WHEN updated_at IS NOT NULL THEN 1 END) as users_with_updated_at
FROM users; 