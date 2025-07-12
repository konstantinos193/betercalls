-- Create a custom type for plan intervals
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_interval') THEN
        CREATE TYPE plan_interval AS ENUM ('monthly', 'annual');
    END IF;
END$$;

-- Create the subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'eur',
  interval plan_interval NOT NULL,
  features JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  -- For potential future integration with payment provider's product IDs
  helio_product_id TEXT
);

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read-only access to active plans" ON subscription_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin full access" ON subscription_plans
  FOR ALL USING (true); -- In a real app, you'd check for an admin role.

-- Seed initial plans if the table is empty
INSERT INTO subscription_plans (name, description, price, currency, interval, features)
SELECT 'Monthly', 'Dip your toes in.', 10.00, 'eur', 'monthly', '["All Standard Bet Calls", "Public Group Access"]'
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans WHERE name = 'Monthly');

INSERT INTO subscription_plans (name, description, price, currency, interval, features)
SELECT 'Yearly', 'For the dedicated winner.', 100.00, 'eur', 'annual', '["All Standard & Premium Calls", "All Group Access", "Priority Support"]'
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans WHERE name = 'Yearly');

INSERT INTO subscription_plans (name, description, price, currency, interval, features, is_active)
SELECT 'Lifetime', 'All in. Forever.', 500.00, 'eur', 'monthly', '["Everything in Yearly", "Exclusive Expert Q&As"]', false
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans WHERE name = 'Lifetime');
