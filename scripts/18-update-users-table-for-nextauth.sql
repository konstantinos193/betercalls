-- Update users table to include admin role and subscription fields for NextAuth
-- This migration adds the necessary fields that were previously in the profiles table

-- Add admin role column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- Add subscription fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_tier TEXT,
ADD COLUMN IF NOT EXISTS helio_subscription_id TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create a function to promote a user to admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Get the user ID from the email
  SELECT id INTO user_id FROM users WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Update the user to make them an admin
  UPDATE users SET is_admin = true WHERE id = user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION promote_to_admin(TEXT) TO authenticated;

-- Create a function to update subscription status
CREATE OR REPLACE FUNCTION update_user_subscription(
  user_email TEXT,
  subscription_status TEXT,
  subscription_tier TEXT DEFAULT NULL,
  helio_subscription_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Get the user ID from the email
  SELECT id INTO user_id FROM users WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Update the user's subscription details
  UPDATE users SET 
    subscription_status = update_user_subscription.subscription_status,
    subscription_tier = update_user_subscription.subscription_tier,
    helio_subscription_id = update_user_subscription.helio_subscription_id
  WHERE id = user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_user_subscription(TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- Verify the changes
SELECT 
  'Users table updated successfully' as status,
  COUNT(*) as total_users,
  COUNT(CASE WHEN is_admin = true THEN 1 END) as admin_users,
  COUNT(CASE WHEN subscription_status = 'active' THEN 1 END) as active_subscriptions
FROM users; 