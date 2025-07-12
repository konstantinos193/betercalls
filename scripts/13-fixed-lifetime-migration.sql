-- Fixed migration script for lifetime plans
-- This script properly handles enum value addition in separate transactions

-- Step 1: Add 'lifetime' to the plan_interval enum (separate transaction)
ALTER TYPE plan_interval ADD VALUE IF NOT EXISTS 'lifetime';

-- Step 2: Commit the enum change (this happens automatically in most clients)
-- If you're using psql, you might need to manually commit here

-- Step 3: Update the existing Lifetime plan to use the correct interval and activate it
UPDATE subscription_plans 
SET 
  interval = 'lifetime',
  is_active = true,
  features = '["Everything in Yearly", "Exclusive Expert Q&As", "Lifetime Access"]'
WHERE name = 'Lifetime';

-- Step 4: If the Lifetime plan doesn't exist, create it
INSERT INTO subscription_plans (name, description, price, currency, interval, features, is_active)
SELECT 'Lifetime', 'All in. Forever.', 500.00, 'eur', 'lifetime', '["Everything in Yearly", "Exclusive Expert Q&As", "Lifetime Access"]', true
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans WHERE name = 'Lifetime');

-- Step 5: Verify the changes
SELECT name, interval, price, is_active FROM subscription_plans ORDER BY price; 