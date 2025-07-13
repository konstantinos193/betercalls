-- Create categories table for organizing calls
-- This migration adds a categories table to help organize different types of calls

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on the table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories table
DROP POLICY IF EXISTS "Categories are viewable by everyone." ON categories;
CREATE POLICY "Categories are viewable by everyone." ON categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert categories." ON categories;
CREATE POLICY "Admins can insert categories." ON categories
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT id FROM users WHERE is_admin = true
  ));

DROP POLICY IF EXISTS "Admins can update categories." ON categories;
CREATE POLICY "Admins can update categories." ON categories
  FOR UPDATE USING (auth.uid() IN (
    SELECT id FROM users WHERE is_admin = true
  ));

DROP POLICY IF EXISTS "Admins can delete categories." ON categories;
CREATE POLICY "Admins can delete categories." ON categories
  FOR DELETE USING (auth.uid() IN (
    SELECT id FROM users WHERE is_admin = true
  ));

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_categories_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_categories_updated_at_column();

-- Insert some default categories
INSERT INTO categories (name, description, icon_name) VALUES
  ('Football', 'Football betting calls', 'football'),
  ('Basketball', 'Basketball betting calls', 'basketball'),
  ('Tennis', 'Tennis betting calls', 'tennis'),
  ('Baseball', 'Baseball betting calls', 'baseball'),
  ('Hockey', 'Hockey betting calls', 'hockey'),
  ('Other Sports', 'Other sports betting calls', 'sports')
ON CONFLICT (name) DO NOTHING;

-- Verify the changes
SELECT 
  'Categories table created successfully' as status,
  COUNT(*) as total_categories
FROM categories; 