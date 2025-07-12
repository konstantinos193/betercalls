-- Update the plan_interval enum to include 'lifetime'
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