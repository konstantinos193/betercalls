-- Create the discussions table
CREATE TABLE discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow authenticated users to insert comments
CREATE POLICY "Allow authenticated users to insert comments" ON discussions
  FOR INSERT TO authenticated WITH CHECK (true);

-- Allow users to update their own comments
CREATE POLICY "Allow users to update their own comments" ON discussions
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own comments
CREATE POLICY "Allow users to delete their own comments" ON discussions
  FOR DELETE USING (auth.uid() = user_id);

-- Allow everyone to read all comments
CREATE POLICY "Allow public read-only access" ON discussions
  FOR SELECT USING (true);

-- Add an index for faster lookups on call_id
CREATE INDEX idx_discussions_call_id ON discussions(call_id);
