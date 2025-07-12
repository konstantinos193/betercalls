-- Create a custom type for call statuses
CREATE TYPE call_status AS ENUM ('Upcoming', 'Won', 'Lost', 'Push');

-- Create the calls table
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  match_home_team TEXT NOT NULL,
  match_away_team TEXT NOT NULL,
  bet_type TEXT NOT NULL,
  pick TEXT NOT NULL,
  odds TEXT NOT NULL,
  units NUMERIC(3, 1) NOT NULL,
  analysis TEXT,
  status call_status NOT NULL DEFAULT 'Upcoming'
);

-- Enable Row Level Security (RLS)
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read-only access to all calls
CREATE POLICY "Allow public read-only access" ON calls
  FOR SELECT USING (true);

-- Allow admin users full access
-- This assumes you have a way to identify admins, e.g., via a custom claim in their JWT
-- For now, we will use the service_role key which bypasses RLS.
-- A more robust policy would be: CREATE POLICY "Allow full access for admins" ON calls FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
