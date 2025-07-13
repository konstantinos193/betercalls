-- Create experts table
-- This migration creates the experts table that's referenced by calls

-- Create experts table
CREATE TABLE IF NOT EXISTS experts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  win_rate DECIMAL(5,2),
  total_calls INTEGER DEFAULT 0,
  total_units DECIMAL(10,2) DEFAULT 0,
  follower_count INTEGER DEFAULT 0
);

-- Enable Row Level Security (RLS) on the table
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;

-- Create policies for experts table
DROP POLICY IF EXISTS "Experts are viewable by everyone." ON experts;
CREATE POLICY "Experts are viewable by everyone." ON experts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert experts." ON experts;
CREATE POLICY "Admins can insert experts." ON experts
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT id FROM users WHERE is_admin = true
  ));

DROP POLICY IF EXISTS "Admins can update experts." ON experts;
CREATE POLICY "Admins can update experts." ON experts
  FOR UPDATE USING (auth.uid() IN (
    SELECT id FROM users WHERE is_admin = true
  ));

DROP POLICY IF EXISTS "Admins can delete experts." ON experts;
CREATE POLICY "Admins can delete experts." ON experts
  FOR DELETE USING (auth.uid() IN (
    SELECT id FROM users WHERE is_admin = true
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_experts_name ON experts(name);
CREATE INDEX IF NOT EXISTS idx_experts_win_rate ON experts(win_rate);

-- Add unique constraint on name
ALTER TABLE experts ADD CONSTRAINT experts_name_unique UNIQUE (name);

-- Insert some default experts
INSERT INTO experts (name, bio, win_rate, total_calls, total_units, follower_count) VALUES
  ('John Smith', 'Professional sports analyst with 10+ years experience', 65.5, 150, 250.5, 1200),
  ('Sarah Johnson', 'Expert in football and basketball predictions', 72.3, 89, 180.2, 850),
  ('Mike Davis', 'Specializes in tennis and baseball analysis', 58.9, 67, 95.8, 420)
ON CONFLICT (name) DO NOTHING;

-- Verify the table creation
SELECT 
  'Experts table created successfully' as status,
  COUNT(*) as total_experts
FROM experts; 