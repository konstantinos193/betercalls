-- Run this script to update your database for lifetime plans
-- This script will:
-- 1. Add 'lifetime' to the plan_interval enum
-- 2. Update the existing Lifetime plan to be active and use the correct interval
-- 3. Create the Lifetime plan if it doesn't exist

-- Add 'lifetime' to the plan_interval enum
ALTER TYPE plan_interval ADD VALUE IF NOT EXISTS 'lifetime';

-- Update the existing Lifetime plan to use the correct interval and activate it
UPDATE subscription_plans 
SET 
  interval = 'lifetime',
  is_active = true,
  features = '["Everything in Yearly", "Exclusive Expert Q&As", "Lifetime Access"]'
WHERE name = 'Lifetime';

-- If the Lifetime plan doesn't exist, create it
INSERT INTO subscription_plans (name, description, price, currency, interval, features, is_active)
SELECT 'Lifetime', 'All in. Forever.', 500.00, 'eur', 'lifetime', '["Everything in Yearly", "Exclusive Expert Q&As", "Lifetime Access"]', true
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans WHERE name = 'Lifetime');

-- Verify the changes
SELECT name, interval, price, is_active FROM subscription_plans ORDER BY price; 