-- Create the table to store user-expert follow relationships
CREATE TABLE IF NOT EXISTS expert_followers (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expert_id UUID NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, expert_id)
);

-- Add a column to the experts table to cache the follower count
ALTER TABLE experts
ADD COLUMN IF NOT EXISTS follower_count INT NOT NULL DEFAULT 0;

-- Enable RLS on the followers table
ALTER TABLE expert_followers ENABLE ROW LEVEL SECURITY;

-- Policies for expert_followers
-- Allow users to follow (insert)
CREATE POLICY "Users can follow experts" ON expert_followers
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Allow users to unfollow (delete)
CREATE POLICY "Users can unfollow their own followed experts" ON expert_followers
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Allow users to see their own follows
CREATE POLICY "Users can view their own follows" ON expert_followers
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Function to update the follower count on the experts table
CREATE OR REPLACE FUNCTION update_follower_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE experts SET follower_count = follower_count + 1 WHERE id = NEW.expert_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE experts SET follower_count = follower_count - 1 WHERE id = OLD.expert_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger to be safe
DROP TRIGGER IF EXISTS on_follow_change ON expert_followers;

-- Trigger to update the count when a follow is added or removed
CREATE TRIGGER on_follow_change
AFTER INSERT OR DELETE ON expert_followers
FOR EACH ROW EXECUTE FUNCTION update_follower_count();
