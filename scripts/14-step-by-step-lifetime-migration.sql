-- Step-by-step migration script for lifetime plans
-- Run these commands one by one to avoid the enum transaction issue

-- Step 1: Add 'lifetime' to the plan_interval enum
-- Run this command first and commit:
ALTER TYPE plan_interval ADD VALUE IF NOT EXISTS 'lifetime';

-- Step 2: After committing the above, run this to update the existing plan
-- Run this command second:
UPDATE subscription_plans 
SET 
  interval = 'lifetime',
  is_active = true,
  features = '["Everything in Yearly", "Exclusive Expert Q&As", "Lifetime Access"]'
WHERE name = 'Lifetime';

-- Step 3: Create the Lifetime plan if it doesn't exist
-- Run this command third:
INSERT INTO subscription_plans (name, description, price, currency, interval, features, is_active)
SELECT 'Lifetime', 'All in. Forever.', 500.00, 'eur', 'lifetime', '["Everything in Yearly", "Exclusive Expert Q&As", "Lifetime Access"]', true
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans WHERE name = 'Lifetime');

-- Step 4: Verify the changes
-- Run this command last:
SELECT name, interval, price, is_active FROM subscription_plans ORDER BY price; 