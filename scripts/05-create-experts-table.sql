-- Create the experts table
CREATE TABLE IF NOT EXISTS experts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  win_rate NUMERIC(5, 2), -- e.g., 68.25
  total_calls INT DEFAULT 0,
  total_units NUMERIC(10, 2) DEFAULT 0
);

-- Add a foreign key column to the calls table to link to an expert
ALTER TABLE calls
ADD COLUMN IF NOT EXISTS expert_id UUID REFERENCES experts(id) ON DELETE SET NULL;

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_calls_expert_id ON calls(expert_id);

-- Seed a default expert if the table is empty
INSERT INTO experts (name, bio, avatar_url)
SELECT 'BeterCalls HQ', 'The official source for house picks and analysis. Data-driven insights from the core team.', '/placeholder.svg?height=128&width=128'
WHERE NOT EXISTS (SELECT 1 FROM experts);
