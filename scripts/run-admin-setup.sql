-- Run admin setup migrations
-- This script will set up the admin role system and promote the specified user

-- 1. Add admin role to profiles table
\i scripts/16-add-admin-role.sql

-- 2. Promote the specific user to admin
\i scripts/17-promote-admin.sql

-- 3. Verify the setup
SELECT 
  'Admin setup complete. Check the results above.' as status; 