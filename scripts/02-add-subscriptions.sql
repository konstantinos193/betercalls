-- Create the profiles table only if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT, -- e.g., 'monthly', 'yearly', 'lifetime'
  subscription_status TEXT DEFAULT 'inactive', -- e.g., 'active', 'inactive', 'cancelled'
  helio_subscription_id TEXT UNIQUE -- To link to Helio's subscription object
);

-- Enable Row Level Security (RLS) on the table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid errors, then recreate them
DROP POLICY IF EXISTS "Profiles are viewable by everyone." ON profiles;
CREATE POLICY "Profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile." ON profiles;
CREATE POLICY "Users can update their own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Ensure the subscription_status column has a default value
ALTER TABLE profiles ALTER COLUMN subscription_status SET DEFAULT 'inactive';
